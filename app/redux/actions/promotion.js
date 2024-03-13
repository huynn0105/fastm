// @flow

import DigitelClient from 'app/network/DigitelClient';
import { Dispatch } from 'redux';

import {
  Promotion,
} from 'app/models';

import {
  PROMOTION_EVENT,
} from './types';

export function promotionEvent(object: Promotion) {
  return {
    type: PROMOTION_EVENT,
    response: object,
  };
}

export function getPromotionEvent() {
  return (dispatch: Dispatch) => {
    DigitelClient.getPromotionEvent()
      .then(item => {
        dispatch(promotionEvent(item));
      })
      .catch();
  };
}
