import { FETCHING_TOPUP_PAYMENT_URL_DATA, TOPUP_STATUS } from './types';
import DigitelClient from '../../network/DigitelClient';

export function fetchingTopUpPaymentURLData(isFetching) {
  return {
    type: FETCHING_TOPUP_PAYMENT_URL_DATA,
    payload: isFetching,
  };
}

export function topupStatus(status) {
  return {
    type: TOPUP_STATUS,
    payload: status,
  };
}

export function fetchTopUpPaymentURLData(paramObject, callback) {
  const doneFetching = (dispatch, data) => {
    dispatch(fetchingTopUpPaymentURLData(false));
    callback(data);
  };
  return (dispatch) => {
    dispatch(fetchingTopUpPaymentURLData(true));
    return DigitelClient.getTopUpPaymentURL(paramObject)
      .then((data) => {
        doneFetching(dispatch, data);
      })
      .catch((error) => {
        doneFetching(dispatch, {});
      });
  };
}

export function fetchTopupStatus() {
  const doneFetching = (dispatch, data) => {
    dispatch(topupStatus(data));
  };
  return (dispatch) => {
    return DigitelClient.checkTopup()
      .then((data) => {
        doneFetching(dispatch, data);
      })
      .catch((error) => {
        doneFetching(dispatch, {});
      });
  };
}
