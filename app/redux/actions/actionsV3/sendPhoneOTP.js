import { setLoadingPhoneOtp } from './commonLoading';
import DigitelClient from '../../../network/DigitelClient';

export function dispatchSendPhoneOTP(mobilePhone, type, callback, isRetry, func) {
  return (dispatch, getState) => {
    dispatch(setLoadingPhoneOtp(true));
    DigitelClient.sendPhoneOTP(mobilePhone, type, isRetry, func)
      .then((payload) => {
        console.log('123121', payload);
        dispatch(setLoadingPhoneOtp(false));
        if (callback) {
          callback(payload);
        }
      })
      .catch((response) => {
        dispatch(setLoadingPhoneOtp(false));
      });
  };
}

export function dispatchVerifyPhoneOTP(mobilePhone, otpCode, callback) {
  return (dispatch, getState) => {
    dispatch(setLoadingPhoneOtp(true));
    DigitelClient.verifyPhoneOTP(mobilePhone, otpCode)
      .then((payload) => {
        dispatch(setLoadingPhoneOtp(false));
        if (callback) {
          callback(payload);
        }
      })
      .catch((response) => {
        dispatch(setLoadingPhoneOtp(false));
      });
  };
}

export function dispatchVerifyUpdatePhoneOTP(mobilePhone, callback) {
  return (dispatch, getState) => {
    dispatch(setLoadingPhoneOtp(true));
    DigitelClient.updatePhoneNumberUser(mobilePhone)
      .then((payload) => {
        dispatch(setLoadingPhoneOtp(false));
        if (callback) {
          callback(payload);
        }
      })
      .catch((response) => {
        dispatch(setLoadingPhoneOtp(false));
      });
  };
}
