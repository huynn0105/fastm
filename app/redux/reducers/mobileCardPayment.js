import {
  FETCHING_MOBILE_CARD_PAYMENT_URL_DATA,
  MOBILE_CARD_PAYMENT_URL_DATA,
} from '../actions/types';

export function fetchingMobileCardPaymentURLData(state = false, action) {
  return action.type === FETCHING_MOBILE_CARD_PAYMENT_URL_DATA ? action.payload : state;
}

export function mobileCardPaymentURLData(state = {}, action) {
  return action.type === MOBILE_CARD_PAYMENT_URL_DATA ? action.payload : state;
}
