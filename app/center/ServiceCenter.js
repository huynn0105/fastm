import { ERROR_CODE } from '../network/ErrorCode';
import { openOTPInput, openLogin } from '../redux/actions/navigation';
import { showInfoAlert } from '../utils/UIUtils';
import BroadcastManager from '../submodules/firebase/manager/BroadcastManager';
import store from '../redux/store/store';

function initServiceCenter() {
  function showErrorMessage(errorMessage) {
    showInfoAlert(errorMessage);
  }

  function otpHandler(errorCode, args) {
    switch (errorCode) {
      case ERROR_CODE.WRONG_OTP:
      case ERROR_CODE.EXPIRED_OTP:
      case ERROR_CODE.REQUIRED_OTP:
        store.dispatch(openOTPInput(args.requestData));
        break;
      case ERROR_CODE.INVALID_TOKEN:
        break;
      case ERROR_CODE.USER_NOT_EXIST:
        break;
      case ERROR_CODE.REQUIRED_LOGIN:
        store.dispatch(openLogin());
        break;
      default:
        break;
    }
  }

  return {
    addObservers() {
      BroadcastManager.shared().addObserver(
        BroadcastManager.NAME.API.ERROR_MESSAGE,
        this,
        showErrorMessage
      );
      BroadcastManager.shared().addObserver(
        BroadcastManager.NAME.API.ERROR_OTP,
        this,
        otpHandler
      );
    }
  };
}

function initSingletonUserCenter() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initServiceCenter();
        instance.addObservers();
      }
      return instance;
    }
  };
}

const ServiceCenter = initSingletonUserCenter();
export default ServiceCenter;
