import { REQUEST_WITH_OTP_RESULT, SENDING_OTP_RESULLT, SENDING_OTP } from '../actions/types';
import { OTP_RESULT_TYPE } from '../actions/otp';

export const sendingOTP = (state = false, action) =>
  action.type === SENDING_OTP ? action.payload : state;
export const sendingOTPResult = (state = OTP_RESULT_TYPE.NONE, action) =>
  action.type === SENDING_OTP_RESULLT ? action.payload : state;
export const requestWithOTPResult = (state = OTP_RESULT_TYPE.NONE, action) =>
  action.type === REQUEST_WITH_OTP_RESULT ? action.payload : state;
