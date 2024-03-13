import BroadcastManager from '../submodules/firebase/manager/BroadcastManager';
import { ERROR_STATUS, ERROR_CODE } from './ErrorCode';

export class ErrorHandler {
  static handleError({ error, requestData, requestDataWithOTP }) {
    const { errorCode, errorMessage, data } = ErrorHandler.parseErrorData(error);
    this.processErrorCode({ errorCode, errorMessage, data }, requestData, requestDataWithOTP);
    this.showAlertForErrorMsg(errorMessage);
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ errorCode, errorMessage });
  }

  static parseErrorData(errorResponse) {
    const data = errorResponse.data || errorResponse.body;
    const status = errorResponse.status || errorResponse.statusCode;

    let errorCode = ERROR_CODE.UNKNOWN;
    let errorMessage = data.err_msg;
    if (data && status === ERROR_STATUS.ERROR_401) {
      errorCode = Array.isArray(data.err_code) ? data.err_code[0] : data.err_code;
      errorMessage = data.err_msg;
    }
    return { errorCode, errorMessage, data };
  }

  static processErrorCode = (
    { errorCode, errorMessage, data },
    requestData,
    requestDataWithOTP = { reject: () => {} }
  ) => {
    // console.log(errorCode, errorMessage);
    switch (errorCode) {
      /*  NEED OTP
       */

      case ERROR_CODE.REQUIRED_OTP:
        BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.API.ERROR_OTP, errorCode, {
          requestData,
          requestDataWithOTP
        });
        break;

      /*  REJECT REQUEST + OTP CODE
       */

      case ERROR_CODE.EXPIRED_OTP:
      case ERROR_CODE.WRONG_OTP:
        requestDataWithOTP.reject({ errorCode, errorMessage, requestData, requestDataWithOTP });
        break;

      case ERROR_CODE.DUP_PHONE:
        requestDataWithOTP.resolve(data);
        requestData.reject({ errorCode, errorMessage, requestData, requestDataWithOTP, data });
        break;

      /*  REJECT REQUEST
       */

      case ERROR_CODE.INVALID_TOKEN:
      case ERROR_CODE.USER_NOT_EXIST:
      case ERROR_CODE.REQUIRED_LOGIN:
      default:
        requestDataWithOTP.reject({ errorCode, errorMessage, requestData, requestDataWithOTP });
        requestData.reject({ errorCode, errorMessage, requestData, requestDataWithOTP });
        break;
    }
  };

  static showAlertForErrorMsg(errorMessage) {
    if (errorMessage) {
      BroadcastManager.shared().notifyObservers(
        BroadcastManager.NAME.API.ERROR_MESSAGE,
        errorMessage
      );
    }
  }
}
