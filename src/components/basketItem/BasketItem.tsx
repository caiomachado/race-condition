import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import BasketItemModel from '../../models/BasketItem';
import { incrementItem, decrementItem } from '../../store/basket/basketActions';

import './basketItem.scss';

interface BasketItemProps {
  basketItem: BasketItemModel
}

function BasketItem({ basketItem }: BasketItemProps) {
  const dispatch = useDispatch();

  const onMinusButtonClick = useCallback(() => {
    dispatch(decrementItem(basketItem))
  }, [basketItem, dispatch]);

  const onPlusButtonClick = useCallback(() => {
    dispatch(incrementItem(basketItem))
  }, [basketItem, dispatch]);

  return (
    <div className="basket-item">
      <p className='basket-item--info basket-item__name'>Item Name <span>{basketItem.name}</span></p>
      <div className='basket-item--info basket-item__quantity'>
        Quantity

        <div className="basket-item__actions">
          <button className="basket-item__button" onClick={onMinusButtonClick}>-</button>
          <span>{basketItem.quantity}</span>
          <button className="basket-item__button" onClick={onPlusButtonClick}>+</button>
        </div>
      </div>
      <p className='basket-item--info basket-item__total'>Total <span> {basketItem.itemPrice * basketItem.quantity}</span></p>
    </div>
  )
}

export default BasketItem;