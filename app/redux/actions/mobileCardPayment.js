import { FETCHING_MOBILE_CARD_PAYMENT_URL_DATA, MOBILE_CARD_PAYMENT_URL_DATA } from './types';
import DigitelClient from '../../network/DigitelClient';

export function fetchingMobileCardPaymentURLData(isFetching) {
  return {
    type: FETCHING_MOBILE_CARD_PAYMENT_URL_DATA,
    payload: isFetching,
  };
}

export function updateMobileCardPaymentURLData(mobilePaymentURLData) {
  return {
    type: MOBILE_CARD_PAYMENT_URL_DATA,
    payload: mobilePaymentURLData,
  };
}

export function fetchMobileCardPaymentURLData(paramObject, callback) {
  const doneFetching = (dispatch, data) => {
    // dispatch(updateMobileCardPaymentURLData(data));
    dispatch(fetchingMobileCardPaymentURLData(false));
    callback(data);
  };
  return (dispatch) => {
    dispatch(fetchingMobileCardPaymentURLData(true));
    return DigitelClient.getMobileCardPaymentURL(paramObject)
      .then((data) => {
        doneFetching(dispatch, data);
      })
      .catch((error) => {
        doneFetching(dispatch, {});
      });
  };
}
