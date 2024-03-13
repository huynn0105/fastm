// @flow

import {
  PROMOTION_EVENT,
} from '../actions/types';

export function promotionEvent(state:{} = {}, action: {type: string, response: {}}) {
  switch (action.type) {
    case PROMOTION_EVENT:
      return action.response;
    default:
      return state;
  }
}
