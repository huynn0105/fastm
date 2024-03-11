import moment from 'moment';
import DigitelClient from '../../../network/DigitelClient';
import { getRemainSeconds, isValidBetween } from '../../../utils/DateTimeUtil';
import { showDevAlert } from '../../../utils/UIUtils';
import { MY_USER } from '../types';
import {
  SET_ENABLE_NOTE,
  SET_HIGHTLIGHT_PROJECTS,
  SET_LIST_CTVS,
  SET_LIST_NOTIS,
  SET_MORE_LIST_CTVS,
  SET_OVERVIEW_CORE_AGENT,
  SET_TIME_CHECKING,
  SET_STATISTIC_WORKING,
  SET_USER_CONFIG,
  SET_USER_DELETE_ACCOUNT,
  SET_USER_PASSCODE,
} from './actionTypes';
import { setCommonLoading } from './commonLoading';

export function setUserConfigs(payload) {
  return {
    type: SET_USER_CONFIG,
    payload,
  };
}

export function setUserUsePasscode(payload) {
  return {
    type: SET_USER_PASSCODE,
    payload,
  };
}

export function setEnableNote(payload) {
  return {
    type: SET_ENABLE_NOTE,
    payload,
  };
}
function setHighLightsProject(payload) {
  return {
    type: SET_HIGHTLIGHT_PROJECTS,
    payload,
  };
}

export function setListCTVs(payload, isRefresh) {
  return {
    type: isRefresh ? SET_LIST_CTVS : SET_MORE_LIST_CTVS,
    payload,
  };
}

export function setListNotis(payload) {
  return {
    type: SET_LIST_NOTIS,
    payload,
  };
}

export function getPopupSurveyContent(onSuccess) {
  return (dispatch, getState) => {
    DigitelClient.fetchSurveyPopupContent()
      .then((payload) => {
        onSuccess(payload);
      })
      .catch((error) => {});
  };
}

export const submitPopupSurvey = (campaignID, feedbacks, onSuccess) => {
  return (dispatch, getState) => {
    DigitelClient.submitSurveyPopup(campaignID, feedbacks)
      .then((payload) => {
        onSuccess(payload);
      })
      .catch((error) => {
        if (__DEV__) {
          console.log('hello', error);
        }
      });
  };
};

export function getUserConfigs() {
  return (dispatch, getState) => {
    dispatch(setCommonLoading(true));
    DigitelClient.getDataConfigUser()
      .then((payload) => {
        dispatch(setCommonLoading(false));
        dispatch(setUserConfigs(payload));
      })
      .catch((response) => {
        dispatch(setCommonLoading(false));
      });
  };
}

export const toggleUsePasscode = (status) => {
  return (dispatch) => {
    dispatch(setCommonLoading(true));
    DigitelClient.mTogglePasscode(status)
      .then((payload) => {
        dispatch(setCommonLoading(false));
        if (payload.status) {
          dispatch({ type: SET_USER_PASSCODE, payload: status === 0 ? false : true });
        } else {
          // dispatch({type: SET_USER_PASSCODE, payload: status ===0? false: true})
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
};

export const checkUsingPasscode = (phoneNumber, onSuccess, onError) => {
  return (dispatch) => {
    dispatch(setCommonLoading(true));
    DigitelClient.mCheckUsingPasscode(phoneNumber)
      .then((payload) => {
        dispatch(setCommonLoading(false));
        if (payload?.isUserPassCode) {
          dispatch({ type: SET_USER_PASSCODE, payload: true });
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess();
          }
        } else {
          dispatch({ type: SET_USER_PASSCODE, payload: false });
          if (onError && typeof onError === 'function') {
            onError();
          }
        }
      })
      .catch((error) => {
        if (onError && typeof onError === 'function') {
          onError();
        }
      });
  };
};

export const setPassCode = (phoneNumber, passCode, passCodePlainText, onSuccess, onError) => {
  return (dispatch) => {
    dispatch(setCommonLoading(true));
    DigitelClient.setPassCode(phoneNumber, passCode)
      .then((payload) => {
        if (!payload?.status) {
          onError(payload?.message);
        } else {
          dispatch({ type: MY_USER, myUser: payload?.data[0] });

          dispatch(setCommonLoading(false));
          onSuccess(payload?.data[0]);
        }
        // dispatch(setUser(payload.data[0]));
      })
      .catch((error) => {
        dispatch(setCommonLoading(false));
        onError();
      });
  };
};

export function getListHighLightProducts() {
  return (dispatch) => {
    DigitelClient.fetchListHighlightProject()
      .then((payload) => {
        dispatch(setHighLightsProject(payload));
        // return payload;
      })
      .catch((error) => {
        return error;
      });
  };
}

export function getListCTV(filterParams, callback) {
  return (dispatch) => {
    DigitelClient.getListCTV(filterParams)
      .then((payload) => {
        dispatch(setListCTVs(payload?.data, filterParams?.page === 1 || filterParams?.top > 0));
        callback &&
          callback(true, filterParams?.page === 1 || filterParams?.top ? payload?.total : null);
      })
      .catch((error) => {
        callback && callback(false, null);
      });
  };
}

export function searchCTVs(filterParams, callback) {
  return (dispatch) => {
    DigitelClient.getListCTV(filterParams)
      .then((payload) => {
        callback && callback(true, payload?.data);
      })
      .catch((error) => {
        callback && callback(false, null);
      });
  };
}

export function sendMassMessage(payload, callback) {
  return (dispatch) => {
    DigitelClient.pushMassMessage(payload)
      .then((data) => {
        console.log('actions ', data);
        if (data) {
          callback(data);
        }
      })
      .catch((error) => {
        console.log('jhell=e', error);
      });
  };
}

export function getListSendMassMessage() {
  return (dispatch) => {
    DigitelClient.getListPushMessage()
      .then((response) => {
        if (response?.status) {
          dispatch(setListNotis(response?.data));
        }
      })
      .catch(() => {
        dispatch(setListNotis([]));
      });
  };
}

export const checkHasDeleteAccount = (callback) => {
  return (dispatch) => {
    DigitelClient.checkHasDeleteAccount()
      .then((response) => {
        callback?.(response?.data?.status, response?.data?.message);
      })
      .catch((err) => {
        callback?.(false, err?.message);
      });
  };
};
export const deleteAccount = (mobilePhone, otpCode, callback) => {
  return (dispatch) => {
    DigitelClient.deleteAccount(mobilePhone, otpCode)
      .then((response) => {
        callback?.(response?.data?.status, response?.data?.message);
      })
      .catch((err) => {
        callback?.(false, err?.message);
      });
  };
};

export const deleteAccountV2 = (payload, callback) => (dispatch) => {
  DigitelClient.deleteAccountV2(payload)
    .then((response) => {
      callback?.(response?.data?.status, response?.data?.message, response?.data?.errorCode);
    })
    .catch((error) => {
      callback?.(false, error?.message);
    });
};
export const checkDeleteAccountV2 = (callback) => (dispatch) => {
  DigitelClient.checkDeleteAccountV2()
    .then((response) => {
      if (response?.data?.status) {
        dispatch({ type: SET_USER_DELETE_ACCOUNT, payload: response?.data });
      }
      callback?.(response?.data);
    })
    .catch((error) => {
      callback?.({});
    });
};
export const cancelDeleteAccountV2 = (callback) => (dispatch) => {
  DigitelClient.cancelDeleteAccountV2()
    .then((response) => {
      if (response?.data?.status) {
        dispatch({ type: SET_USER_DELETE_ACCOUNT, payload: {} });
      }
      callback?.(response?.data);
    })
    .catch((error) => {
      callback?.({ status: false, message: error?.message });
    });
};

export const getOverviewCoreAgent = (callback) => (dispatch) => {
  DigitelClient.getOverviewCoreAgent()
    .then((response) => {
      if (response?.data?.status) {
        dispatch({ type: SET_OVERVIEW_CORE_AGENT, payload: response?.data?.data });
      }
      callback?.(response?.data);
    })
    .catch((error) => {
      callback?.({ status: false, message: error?.message });
    });
};

export const getTimeChecking = (callback) => (dispatch) => {
  DigitelClient.getTimeChecking()
    .then((response) => {
      if (response?.data?.status) {
        const data = response?.data?.data;
        dispatch({ type: SET_TIME_CHECKING, payload: data });
        callback?.(data);
      }
      callback?.(response?.data);
    })
    .catch((error) => {
      callback?.({ status: false, message: error?.message });
    });
};

export const getStatisticWorking = (callback) => (dispatch) => {
  DigitelClient.getStatisticWorking()
    .then((response) => {
      if (response?.data?.status) {
        const data = response?.data?.data;
        dispatch({ type: SET_STATISTIC_WORKING, payload: data });
        callback?.(data);
      }
      callback?.(response?.data);
    })
    .catch((error) => {
      callback?.({ status: false, message: error?.message });
    });
};
