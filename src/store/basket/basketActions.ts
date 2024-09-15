// Externals
import { Action, Dispatch } from 'redux';
import axios from 'axios';

import BasketItem from '../../models/BasketItem';
import { IState } from '../rootReducer';

let apiRequestCounter = 0;

function debounce(validateBasketTotal: (dispatch: Dispatch<Action>, newTotal: number) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (dispatch: Dispatch<Action>, newTotal: number) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      validateBasketTotal(dispatch, newTotal);
    }, delay);
  };
}

const debouncedValidateBasketTotal = debounce((dispatch: Dispatch<Action>, newTotal: number) => {
  apiRequestCounter++

  axios.get('https://2486713dae314753ae6b0ff127002d12.api.mockbin.io/')
    .then(() => {
      dispatch({
        type: 'update-basket-totals',
        payload: newTotal,
      });
    })
    .finally(() => {
      apiRequestCounter--

      if (apiRequestCounter === 0) {
        dispatch({
          type: 'calculating_basket',
          payload: false,
        });
      }
    });
}, 300);

export function incrementItem(basketItem: BasketItem) {
  return (dispatch: Dispatch<Action>, getState: () => IState) => {
    const state: IState = getState();

    dispatch({
      type: 'calculating_basket',
      payload: true,
    });

    const basketItems = state.basket.items.map((item) => {
      if (item.id === basketItem.id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    const newTotal = basketItems.reduce((previousValue: number, currentValue) => {
      const basketItemTotal = currentValue.itemPrice * currentValue.quantity;
      return previousValue + basketItemTotal;
    }, 0);

    dispatch({
      type: 'update-basket',
      payload: basketItems,
    });

    debouncedValidateBasketTotal(dispatch, newTotal);
  };
}

export function decrementItem(basketItem: BasketItem) {
  return (dispatch: Dispatch<Action>, getState: () => IState) => {
    const state: IState = getState();

    const foundItem = state.basket.items.find((item) => item.id === basketItem.id);

    // Disabling 0 quantity
    if (foundItem?.quantity === 1) {
      return;
    }

    dispatch({
      type: 'calculating_basket',
      payload: true,
    });

    const basketItems = state.basket.items.map((item) => {
      if (item.id === basketItem.id) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });

    const newTotal = basketItems.reduce((previousValue: number, currentValue) => {
      const basketItemTotal = currentValue.itemPrice * currentValue.quantity;
      return previousValue + basketItemTotal;
    }, 0);

    dispatch({
      type: 'update-basket',
      payload: basketItems,
    });

    debouncedValidateBasketTotal(dispatch, newTotal);
  };
}