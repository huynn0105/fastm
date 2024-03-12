import { FETCHING_TOPUP_PAYMENT_URL_DATA, TOPUP_STATUS } from '../actions/types';

export function fetchingTopUpPaymentURLData(state = false, action) {
  return action.type === FETCHING_TOPUP_PAYMENT_URL_DATA ? action.payload : state;
}

export function topupStatus(state = {}, action) {
  return action.type === TOPUP_STATUS ? action.payload : state;
}
