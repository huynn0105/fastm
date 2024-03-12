import { REQUEST_WITH_OTP_RESULT, SENDING_OTP_RESULLT, SENDING_OTP } from './types';
import DigitelClient from '../../network/DigitelClient';
import { ERROR_CODE } from '../../network/ErrorCode';

const sendingOTP = (object) => ({ type: SENDING_OTP, payload: object });
const sendingOTPResult = (object) => ({ type: SENDING_OTP_RESULLT, payload: object });
const requestWithOTPResult = (object) => ({
  type: REQUEST_WITH_OTP_RESULT,
  payload: object,
});

export const OTP_RESULT_TYPE = {
  NONE: 'NONE',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
};

export const sendRequestWithOTP = (requestData, OTP) => {
  return async (dispatch) => {
    try {
      dispatch(sendingOTP(true));
      dispatch(requestWithOTPResult(OTP_RESULT_TYPE.NONE));
      await DigitelClient.sendRequestWithOTP(requestData, OTP);
      dispatch(requestWithOTPResult(OTP_RESULT_TYPE.SUCCESS));
    } catch (err) {
      if (err.errorCode === ERROR_CODE.EXPIRED_OTP || err.errorCode === ERROR_CODE.WRONG_OTP) {
        dispatch(requestWithOTPResult(OTP_RESULT_TYPE.FAILED));
      }
    } finally {
      dispatch(sendingOTP(false));
    }
  };
};

export const requestOTP = (phone, isRetry, callback, type) => {
  return async (dispatch) => {
    try {
      dispatch(sendingOTP(true));
      dispatch(requestWithOTPResult(OTP_RESULT_TYPE.NONE));
      const resOTP = await DigitelClient.mfRequestOTP(phone, isRetry, type);
      if (typeof callback === 'function') {
        callback(resOTP);
      }
      dispatch(sendingOTPResult(OTP_RESULT_TYPE.SUCCESS));
    } catch (err) {
      dispatch(sendingOTPResult(OTP_RESULT_TYPE.FAILED));
    } finally {
      dispatch(sendingOTP(false));
    }
  };
};
