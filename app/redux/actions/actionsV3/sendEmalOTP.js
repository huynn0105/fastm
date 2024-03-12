import DigitelClient from '../../../network/DigitelClient';
import { setCommonLoading } from './commonLoading';

export function dispatchSendEmailOTP(email, callback) {
  return (dispatch, getState) => {
    dispatch(setCommonLoading(true));
    DigitelClient.sendEmailOTP(email)
      .then((payload) => {
        dispatch(setCommonLoading(false));
        if (callback) {
          callback(payload);
        }
      })
      .catch((response) => {
        dispatch(setCommonLoading(false));
      });
  };
}

export function dispatchVerifyEmailOTP(email, otpCode, callback) {
  return (dispatch, getState) => {
    dispatch(setCommonLoading(true));
    DigitelClient.verifyEmailOTP(email, otpCode)
      .then((payload) => {
        dispatch(setCommonLoading(false));
        if (callback) {
          callback(payload);
        }
      })
      .catch((response) => {
        dispatch(setCommonLoading(false));
      });
  };
}
