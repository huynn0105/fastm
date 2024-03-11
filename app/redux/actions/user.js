/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import NotificationManager from 'app/manager/NotificationManager';
import { User } from 'app/models';
import KeychainWrapper from 'app/utils/KeychainWrapper';
import { Alert, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { AsyncStorageKeys, TrackingEvents } from '../../constants/keys';
import ContactsManager from '../../manager/ContactsManager';
import DatabaseManager from '../../manager/DatabaseManager';
import DigitelClient, { API_ERROR_CODES } from '../../network/DigitelClient';
import { ERROR_CODE } from '../../network/ErrorCode';
import ChatCenter from '../../submodules/firebase/manager/ChatCenter';
import { initChatCenter, deInitChatCenter } from '../../submodules/firebase/redux/actions/app';

import { getAllNumUnreadNotiFb, getLastNotiFb } from './notification';
import Smartlook from 'smartlook-react-native-wrapper';

import ChatManager from '../../submodules/firebase/manager/ChatManager';
import FirebaseFunctions from '../../submodules/firebase/network/FirebaseFunctions';
import { fetchThreads } from '../../submodules/firebase/redux/actions/thread';
import { logEvent, logEventWithAttibute } from '../../tracking/Firebase';
import { loginService, METHOD } from '../../utils/FacebookWrapper';
import LocalStorageUtil from '../../utils/LocalStorageUtil';
import { setCommonLoading } from './actionsV3/commonLoading';
import { fetchAppInfo } from './general';
import { homeNavigate, switchRootScreenToLogin, switchRootScreenToMain } from './navigation';
import {
  GET_OWNERS_RESPONSE,
  GET_USERS_RESPONSE,
  IMPORTANT_UPDATE_PROFILE_RESPONSE,
  IS_GET_OWNERS_PROCESSING,
  IS_GET_USERS_PROCESSING,
  IS_IMPORTANT_UPDATE_PROFILE_PROCESSING,
  IS_LOGIN_PROCESSING,
  IS_LOGOUT_PROCESSING,
  IS_REGISTER_PROCESSING,
  IS_REGISTER_VALIDATE_PROCESSING,
  IS_RESET_PASSWORD_PROCESSING,
  IS_SEND_PASSWORD_PROCESSING,
  IS_UPDATE_PROFILE_PROCESSING,
  LOADING_ACCOUNT_DATA,
  LOGIN_RESPONSE,
  LOGOUT_RESPONSE,
  MY_USER,
  MY_USER_LIST,
  REGISTER_RESPONSE,
  REGISTER_VALIDATE_RESPONSE,
  RESET_APP_STATE,
  RESET_PASSWORD_INFO,
  RESET_PASSWORD_RESPONSE,
  SEND_PASSWORD_RESPONSE,
  UPDATE_PROFILE_RESPONSE,
} from './types';
import { clearListRSMPushMessage } from './actionsV3/rsmPushMessage';
import { getFilterRating, getInfoCollaborator } from './actionsV3/collaboratorAction';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
// import { flyersTrackEvent, FLYERS_EVENT } from '../../utils/AppsFlyers';

const _ = require('lodash');

// --------------------------------------------------

function loadingAccountData(loading) {
  return {
    type: LOADING_ACCOUNT_DATA,
    payload: loading,
  };
}

export function isLoginProcessing(bool) {
  return {
    type: IS_LOGIN_PROCESSING,
    isProcessing: bool,
  };
}

export function loginResponse(object) {
  return {
    type: LOGIN_RESPONSE,
    response: object,
  };
}

export function isLogoutProcessing(bool) {
  return {
    type: IS_LOGOUT_PROCESSING,
    isProcessing: bool,
  };
}

export function logoutResponse(object) {
  return {
    type: LOGOUT_RESPONSE,
    response: object,
  };
}

export function myUser(user) {
  // save user
  const asyncTask = async () => {
    try {
      const token = user.accessToken;

      const noTokenUser = Object.assign({}, user);
      noTokenUser.accessToken = 'notoken';

      await AsyncStorage.setItem(AsyncStorageKeys.MY_USER, JSON.stringify(noTokenUser));
      await KeychainWrapper.setToken(noTokenUser.uid, token);
    } catch (error) {
      //
    }
  };
  asyncTask();
  // update in store
  return {
    type: MY_USER,
    myUser: user,
  };
}

export const myUsers = (users) => ({
  type: MY_USER_LIST,
  payload: users,
});

// LOGIN, REGISTER

export function login(username, password) {
  return (dispatch, getState) => {
    dispatch(loginResponse({}));
    dispatch(isLoginProcessing(true));
    const deviceUDID = DeviceInfo.getUniqueId();
    DigitelClient.loginViaFirebase(username, password, deviceUDID)
      .then((user) => {
        return auth()
          .signInWithCustomToken(user.firebaseToken)
          .then(() => {
            return mLoginSuccess(user, dispatch, getState);
          })
          .catch(() => {
            const response = {
              errorCode: 'WRONG_PASSWORD',
              status: false,
              message: 'Mật khẩu không hợp lệ',
            };
            return mLoginFail(response, dispatch, getState);
          });
      })
      .catch((response) => {
        return mLoginFail(response, dispatch, getState);
      });
  };
}

export function loginExternal(platform, data, onSuccess) {
  return (dispatch, getState) => {
    dispatch(loginResponse({}));
    const startRequest = () => {
      dispatch(isLoginProcessing(true));
    };
    const endRequest = () => {
      // dispatch(isLoginProcessing(false));
    };

    const loginAction = async () => {
      let params;
      try {
        const accessToken = await loginService(platform, data);

        const deviceUDID = DeviceInfo.getUniqueId();
        params = {
          platform,
          accessToken,
          deviceUDID,
          startRequest,
          endRequest,
        };
        const users = await DigitelClient.mfLoginExternal(params);
        dispatch(isLoginProcessing(true));
        const isUsingPasscode = await DigitelClient.mCheckUsingPasscode(users?.[0].mPhoneNumber);
        const lastInforUser = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
        const _lastInfor = JSON.parse(lastInforUser);
        const _userLogin = {
          ...users?.[0],
          useQuickLogin: _lastInfor?.useQuickLogin,
          usePasscode: isUsingPasscode?.isUserPassCode,
        };
        try {
          await auth().signInWithCustomToken(_userLogin?.firebaseToken);
        } catch (error) {
          console.log('!@@@###@', error);
        }
        await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(_userLogin));
        dispatch(isLoginProcessing(false));
        // setTimeout(() => {
        //   dispatch(isLoginProcessing(false));
        // }, 500);
        messaging().subscribeToTopic(`user-${_userLogin.uid}`);
        onSuccess();
        return mLoginSuccess(_userLogin, dispatch, getState);
      } catch (err) {
        const { errorCode, requestDataWithOTP } = err;
        return mfLoginFail(
          errorCode,
          dispatch,
          requestDataWithOTP.axiosOTPData
            ? requestDataWithOTP.axiosOTPData.params
            : {
                platform,
              },
        );
      }
    };
    return loginAction();
  };
}

export function loginByPassCode(phoneNumber, passcode, onSuccess, onError) {
  return async (dispatch, getState) => {
    dispatch(loginResponse({}));

    try {
      const deviceUDID = DeviceInfo.getUniqueId();

      const user = await DigitelClient.mLoginWithPasscode(phoneNumber, passcode, deviceUDID);

      const _user = user?.data[0];

      if (_user) {
        const lastInforUser = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
        const _lastInfor = JSON.parse(lastInforUser);
        const useQuickLogin = _lastInfor?.useQuickLogin;

        const _userFirebase = await DigitelClient.loginWithTokenViaFirebase(_user?.accessToken);
        const { data } = _userFirebase;
        const userLoginSuccess = {
          ...data,
          firebaseToken: _userFirebase?.firebase?.token,
          uid: data?.ID,
          isLoggedIn: true,
          useQuickLogin: useQuickLogin ? useQuickLogin : false,
          usePasscode: true,
        };

        const dataTracking = {
          user_id: userLoginSuccess?.uid,
          phoneNumber: userLoginSuccess?.mobilePhone || userLoginSuccess?.mPhoneNumber,
          fullName: userLoginSuccess?.fullName,
          email: userLoginSuccess?.email,
        };
        logEventWithAttibute(dataTracking);

        await auth().signInWithCustomToken(userLoginSuccess?.firebaseToken);
        await AsyncStorage.setItem(
          AsyncStorageKeys.LAST_USER_INFO,
          JSON.stringify(userLoginSuccess),
        );

        // firebase.messaging().subscribeToTopic(`user-${userLoginSuccess?.uid}`);

        onSuccess();
        return mLoginSuccess(userLoginSuccess, dispatch, getState);
      }
    } catch (error) {
      // onError();

      dispatch(setCommonLoading(false));
      onError();
      return mLoginFail(error, dispatch, getState);
    }
  };
}

export function registerExternal(
  { platform, accessToken, fullName, referralID, ...data },
  onSuccess,
) {
  return async (dispatch) => {
    dispatch(loginResponse({}));
    const startRequest = () => {
      dispatch(isLoginProcessing(true));
    };
    const endRequest = () => {
      dispatch(isLoginProcessing(false));
    };

    try {
      const deviceUDID = DeviceInfo.getUniqueId();

      const user = await DigitelClient.mfRegisterExternal(
        {
          platform,
          accessToken,
          fullName,
          referralID,
          deviceUDID,
          ...data,
        },
        startRequest,
        endRequest,
      );

      // flyersTrackEvent(FLYERS_EVENT.REGISTER);
      dispatch(chooseUser(user));
      const dataTracking = {
        phoneNumber: user?.mPhoneNumber,
        fullName: user?.fullName,
        user_id: user?.uid,
      };
      logEventWithAttibute(dataTracking);
      logEvent('CompletedRegistration', {});
      onSuccess();
      // await firebase.auth().signInAndRetrieveDataWithCustomToken(user.firebaseToken);
      // return mLoginSuccess(user, dispatch, getState);
    } catch (err) {
      const { errorCode } = err;
      return mfLoginFail(errorCode, dispatch, {
        platform,
        accessToken,
      });
    } finally {
      dispatch(isLoginProcessing(false));
    }
  };
}

export function removeSupporter(onSuccess) {
  return async (dispatch, getState) => {
    try {
      const res = await DigitelClient.removeSupporter();

      onSuccess(res?.data?.status, res?.data?.message);
      if (res?.data?.status) {
        const myUid = getState().myUser?.uid;
        dispatch(getFilterRating(myUid));
      }
    } catch (err) {
      console.log('\u001B[36m -> file: user.js:356 -> err', err);
      onSuccess(false, err?.message);
    }
  };
}

export function loginWithToken(accessToken) {
  return (dispatch, getState) => {
    dispatch(loginResponse({}));
    dispatch(isLoginProcessing(true));
    DigitelClient.loginWithToken(accessToken)
      .then((user) => {
        return mLoginSuccess(user, dispatch, getState);
      })
      .catch((response) => {
        return mLoginFail(response, dispatch, getState);
      });
  };
  //   DigitelClient.loginWithTokenViaFirebase(accessToken)
  //     .then(user => {
  //       console.log('loginWithTokenViaFirebase');
  //       console.log(new Date().getSeconds());
  //       return firebase.auth().signInAndRetrieveDataWithCustomToken(user.firebaseToken)
  //         .then(() => {
  //           console.log('mLoginSuccess');
  //           console.log(new Date().getSeconds());
  //           return mLoginSuccess(user, dispatch, getState);
  //         })
  //         .catch(err => {
  //           const response = {
  //             errorCode: 'INVALID_ACCESS_TOKEN',
  //             status: false,
  //             message: 'Mật khẩu không hợp lệ',
  //           };
  //           return mLoginFail(response, dispatch, getState);
  //         });
  //     })
  //     .catch(response => {
  //       return mLoginFail(response, dispatch, getState);
  //     });
  // };
}

function mfLoginFail(errorCode, dispatch, params) {
  mLogoutSuccess(dispatch);
  setTimeout(() => {
    dispatch(loginResponse({}));
    const emptyUser = new User();
    dispatch(myUser(emptyUser));

    switch (errorCode) {
      case ERROR_CODE.USER_NOT_EXIST:
        dispatch(homeNavigate('RegisterName', params));
        break;
      default:
        break;
    }
  }, 500);
}

function mLoginSuccess(user, dispatch, getState) {
  dispatch(isLoginProcessing(true));
  mSetupUserAndGotoMain(user, dispatch, getState);
  dispatch(myUser(user));
  dispatch(loginResponse({ status: true, message: 'OK' }));
  dispatch(isLoginProcessing(false));
  dispatch(getInfoCollaborator(user?.uid, false, user?.uid));

  if (user?.ui) {
    const dataTracking = {
      user_id: user?.uid,
      phoneNumber: user?.mPhoneNumber,
      fullName: user?.fullName,
      email: user?.email,
    };
    logEventWithAttibute(dataTracking);
  }
  logEvent(TrackingEvents.USER_LOGIN);
  DigitelClient.trackEvent(TrackingEvents.USER_LOGIN);
}

function mLoginFail(response, dispatch, getState) {
  dispatch(isLoginProcessing(false));
  dispatch(loginResponse(response));
  const user = getState().myUser;
  // invalid access token -> login
  if (response.errorCode === API_ERROR_CODES.INVALID_ACCESS_TOKEN) {
    // goto login
    dispatch(switchRootScreenToLogin());
    // clear my user
    const emptyUser = new User();
    dispatch(myUser(emptyUser));
    return;
  }
  // wrong password -> login
  if (response.errorCode === API_ERROR_CODES.WRONG_PASSWORD) {
    dispatch(switchRootScreenToLogin());
    return;
  }
  // don't have save account -> login
  if (!user || user.uid === null || user.uid.length === 0) {
    dispatch(switchRootScreenToLogin());
    return;
  }
  // login error but have saved account -> setup user & go to main
  mSetupUserAndGotoMain(user, dispatch, getState);
}

export function setupUserAndGotoMain(user) {
  return (dispatch) => {
    mSetupUserAndGotoMain(user, dispatch);
  };
}

export function mSetupUserAndGotoMain(user, dispatch) {
  try {
    // setup network
    DigitelClient.setup(user.uid, user.accessToken, user.user_type);
    FirebaseFunctions.setup(user.uid, user.accessToken);
    // // fetch new data
    // wait a bit for setup & go to main
    setTimeout(() => {
      User.setupMyUser(user);
      // ChatManager.shared().setup(user);
      // ChatCenter.shared();
      // UserManager.shared();
      // DatabaseManager.shared().initDatabase();
      // dispatch(initChatCenter());
      dispatch(getLastNotiFb());
      dispatch(fetchThreads());
      dispatch(switchRootScreenToMain());
      dispatch(isLoginProcessing(false));
    }, 200);
  } catch (error) {
    //
  }
}

export function fetchAppData() {
  return (dispatch) => {
    dispatch(fetchMyUser()).then(() => {
      dispatch(getAllNumUnreadNotiFb());
    });
  };
}

// LOGOUT

export function logout(isLogOutOfAllDevices = false, onSuccess, onError) {
  const logoutWithConnect = async (dispatch, isConnected) => {
    // no internet connection -> don't allow logout
    // because firebase cannot un-register successfully
    if (!isConnected) {
      mLogoutError(dispatch);
      return true;
    }
    // have internet connection -> logout
    dispatch(logoutResponse({}));
    // logout
    const deviceUDID = DeviceInfo.getUniqueId();
    return DigitelClient.logoutViaFirebase(deviceUDID, isLogOutOfAllDevices)
      .then(() => {
        if (onSuccess) {
          onSuccess();
        }
        Smartlook.stopRecording();
        return mLogoutSuccess(dispatch);
      })
      .catch(() => {
        if (onError) {
          onError();
        }
        return mLogoutError(dispatch);
      });
  };

  return (dispatch) => {
    dispatch(isLogoutProcessing(true));
    if (Platform.OS === 'ios') {
      return fetch('https://google.com')
        .then((result) => {
          return logoutWithConnect(dispatch, result.status === 200);
        })
        .catch(() => {
          return mLogoutError(dispatch);
        });
      // eslint-disable-next-line no-else-return
    } else {
      return NetInfo.fetch()
        .then((state) => {
          return logoutWithConnect(dispatch, state.isConnected);
        })
        .catch(() => {
          return mLogoutError(dispatch);
        });
    }
  };
}

export function forceLogout() {
  return (dispatch, getState) => {
    if (getState().isLogoutProcessing) return;
    const deviceUDID = DeviceInfo.getUniqueId();
    dispatch(isLogoutProcessing(true));
    DigitelClient.logoutViaFirebase(deviceUDID, false);
    mLogoutSuccess(dispatch);
  };
}

const mLogoutSuccess = async (dispatch) => {
  return new Promise(async (resolve) => {
    // if (DigitelClient.checkEmptyAccessToken()) {
    //   dispatch(isLogoutProcessing(false));
    //   return;
    // }

    DigitelClient.setup('', '', '');

    dispatch(isLogoutProcessing(false));
    dispatch(logoutResponse({ status: true }));
    dispatch(fetchAppInfo());

    // // de-init chat
    // dispatch(deInitChatCenter());
    // ContactsManager.shared().deinitManager();

    // clear app state
    dispatch(resetAppState());

    // clear list id rsm seen
    dispatch(clearListRSMPushMessage());

    // clear my user

    const emptyUser = new User();
    dispatch(myUser(emptyUser));
    User.setupMyUser(emptyUser);
    clearAllStorge();
    // sign out firebase
    // -> must be put at the end of others de-init
    setTimeout(() => {
      auth().signOut();
    }, 100);

    dispatch(switchRootScreenToLogin());

    // // de-init db
    // // -> must be put at the end of others de-init
    // setTimeout(() => {
    //   DatabaseManager.shared()
    //     .deinitDatabase()
    //     .then(() => {
    //       dispatch(switchRootScreenToLogin());
    //     });
    // }, 100);

    NotificationManager.shared().deinitMessaging();
    NotificationManager.resetFirebase();

    // setup network
    FirebaseFunctions.setup('', '');
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

async function clearAllStorge() {
  try {
    const isShowGuildSlider = await AsyncStorage.getItem(AsyncStorageKeys.GUILD_SLIDER);
    const lastUserInfo = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
    const listUserShowSurvey = await AsyncStorage.getItem(AsyncStorageKeys.POPUP_SURVEY_USER);
    const isShowUserGuide = await AsyncStorage.getItem(AsyncStorageKeys.USER_GUIDE);
    const rsaCode = await AsyncStorage.getItem(AsyncStorageKeys.REFFERAL_CODE);

    LocalStorageUtil.clearAllDataAsyncStorage();
    // clear Local Storage

    if (isShowGuildSlider) {
      await AsyncStorage.setItem(AsyncStorageKeys.GUILD_SLIDER, isShowGuildSlider);
    }
    if (lastUserInfo) {
      await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, lastUserInfo);
    }
    if (listUserShowSurvey) {
      await AsyncStorage.setItem(AsyncStorageKeys.POPUP_SURVEY_USER, listUserShowSurvey);
    }
    if (isShowUserGuide) {
      await AsyncStorage.setItem(AsyncStorageKeys.USER_GUIDE, isShowUserGuide);
    }
    if (rsaCode) {
      await AsyncStorage.setItem(AsyncStorageKeys.REFFERAL_CODE, rsaCode);
    }
  } catch (err) {}
}

function mLogoutError(dispatch) {
  dispatch(isLogoutProcessing(false));
  dispatch(
    logoutResponse({
      status: false,
      message: 'Oops! Không thể đăng xuất! Xin kiểm tra lại kết nối internet của bạn',
    }),
  );
}

export const hardFixUrlAvatar = (str) => {
  if (!str) {
    return {
      uri: '',
    };
  }
  try {
    const findIndexFolder = str.indexOf('images');
    const lastIndexFolder = str.indexOf('?');
    const findSubString = str.substring(findIndexFolder, lastIndexFolder);
    const _newUrl = findSubString.split('/').join('%2F');
    const _urlRight = str.replace(findSubString, _newUrl);
    return {
      uri: _urlRight,
    };
  } catch (error) {
    return {
      uri: '',
    };
  }
};
export function fetchMyUser() {
  return (dispatch, getState) => {
    const { accessToken, firebaseToken } = getState().myUser;
    if (!accessToken || accessToken.length === 0) {
      return Promise.resolve(true);
    }
    return DigitelClient.getMyUser()
      .then(async (user) => {
        if (user) {
          let useQuickLogin = false;
          try {
            const lastUserInfo = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
            const _lastUser = JSON.parse(lastUserInfo);
            useQuickLogin = _lastUser?.useQuickLogin;
          } catch (error) {
            useQuickLogin = false;
          }

          const avatarImgURI = hardFixUrlAvatar(user?.avatarImage);
          const newMyUser = Object.assign(user, { firebaseToken, useQuickLogin, avatarImgURI });

          if (!_.isEqual(getState().myUser, newMyUser)) {
            dispatch(myUser(newMyUser));
          }
        }
      })
      .catch((error) => {
        if (error?.errorCode === 'INVALID_ACCESS_TOKEN') {
          if (DigitelClient.userAccessToken.length > 0) {
            dispatch(logout(false));
          } else {
            dispatch(forceLogout());
          }
        }
      });
  };
}

// --------------------------------------------------

export function isResetPasswordProcessing(bool) {
  return {
    type: IS_RESET_PASSWORD_PROCESSING,
    isProcessing: bool,
  };
}

export function resetPasswordResponse(object) {
  return {
    type: RESET_PASSWORD_RESPONSE,
    response: object,
  };
}

export function resetPasswordInfo(object) {
  return {
    type: RESET_PASSWORD_INFO,
    info: object,
  };
}

export function requestResetPassword(username) {
  return (dispatch) => {
    dispatch(resetPasswordResponse({ step: 1, shouldAlert: false }));
    dispatch(isResetPasswordProcessing(true));
    DigitelClient.requestResetPassword(username)
      .then((response) => {
        dispatch(isResetPasswordProcessing(false));
        dispatch(
          resetPasswordResponse({
            ...response,
            status: true,
            step: 1,
            shouldAlert: true,
          }),
        );
        dispatch(
          resetPasswordInfo({
            step: 2,
            userID: response.userID,
            actionCode: response.actionCode,
            phoneNumber: response.mobilePhone,
          }),
        );
      })
      .catch((response) => {
        dispatch(isResetPasswordProcessing(false));
        dispatch(resetPasswordResponse({ ...response, shouldAlert: true }));
      });
  };
}

export function resetPassword(userID, newPassword, actionCode) {
  return (dispatch) => {
    dispatch(resetPasswordResponse({ step: 2, shouldAlert: false }));
    dispatch(isResetPasswordProcessing(true));
    DigitelClient.resetPassword(userID, newPassword, actionCode)
      .then(() => {
        dispatch(isResetPasswordProcessing(false));
        dispatch(resetPasswordResponse({ status: true, step: 2, shouldAlert: true }));
        dispatch(
          resetPasswordInfo({
            step: 1,
            userID: '',
            actionCode: '',
          }),
        );
      })
      .catch((response) => {
        dispatch(isResetPasswordProcessing(false));
        dispatch(resetPasswordResponse({ ...response, shouldAlert: true }));
      });
  };
}

// --------------------------------------------------

export function isRegisterProcessing(bool) {
  return {
    type: IS_REGISTER_PROCESSING,
    isProcessing: bool,
  };
}

export function isRegisterValidateProcessing(bool) {
  return {
    type: IS_REGISTER_VALIDATE_PROCESSING,
    payload: bool,
  };
}

export function registerResponse(object) {
  return {
    type: REGISTER_RESPONSE,
    response: object,
  };
}

export function registerValidateResponse(object) {
  return {
    type: REGISTER_VALIDATE_RESPONSE,
    payload: object,
  };
}

export function register(userInfo) {
  return (dispatch) => {
    dispatch(registerResponse({}));
    dispatch(isRegisterProcessing(true));
    DigitelClient.register(userInfo)
      .then((response) => {
        dispatch(isRegisterProcessing(false));
        dispatch(registerResponse(response));
      })
      .catch((response) => {
        dispatch(isRegisterProcessing(false));
        dispatch(registerResponse(response));
      });
  };
}

export function registerValidate(userInfo) {
  return (dispatch) => {
    dispatch(registerValidateResponse({}));
    dispatch(isRegisterValidateProcessing(true));
    DigitelClient.registerValidate(userInfo)
      .then((response) => {
        dispatch(isRegisterValidateProcessing(false));
        dispatch(registerValidateResponse(response));
      })
      .catch((response) => {
        dispatch(isRegisterValidateProcessing(false));
        dispatch(registerValidateResponse(response));
      });
  };
}
// --------------------------------------------------

export function isSendPasswordProcessing(bool) {
  return {
    type: IS_SEND_PASSWORD_PROCESSING,
    isProcessing: bool,
  };
}

export function sendPasswordResponse(object) {
  return {
    type: SEND_PASSWORD_RESPONSE,
    response: object,
  };
}

export function requestSendPassword(cmnd) {
  return (dispatch) => {
    dispatch(sendPasswordResponse({}));
    dispatch(isSendPasswordProcessing(true));
    DigitelClient.requestSendPassword(cmnd)
      .then((response) => {
        dispatch(isSendPasswordProcessing(false));
        dispatch(sendPasswordResponse(response));
      })
      .catch((response) => {
        dispatch(isSendPasswordProcessing(false));
        dispatch(sendPasswordResponse(response));
      });
  };
}

// --------------------------------------------------

export function isUpdateProfileProcessing(bool) {
  return {
    type: IS_UPDATE_PROFILE_PROCESSING,
    isProcessing: bool,
  };
}

export function updateProfileResponse(object) {
  return {
    type: UPDATE_PROFILE_RESPONSE,
    response: object,
  };
}

export function updateProfile(userInfo) {
  return (dispatch) => {
    dispatch(updateProfileResponse({}));
    dispatch(isUpdateProfileProcessing(true));
    // encode image url
    const params = { ...userInfo };
    if (userInfo.avatarImage) {
      const avatarImageEncoded = encodeURI(userInfo.avatarImage);
      params.avatarImage = avatarImageEncoded;
    }
    if (userInfo.wallImage) {
      const wallImageEncoded = encodeURI(userInfo.wallImage);
      params.wallImage = wallImageEncoded;
    }
    // request
    DigitelClient.updateProfile(params)
      .then((response) => {
        // update state
        dispatch(isUpdateProfileProcessing(false));
        dispatch(updateProfileResponse(response));
        // create new User object since redux compare don't shallow User properties
        // and will not re-render incase this.props.myUser propperties update
        // const user = Object.assign(new User(), getState().myUser, userInfo);
        // dispatch(myUser(user));
        dispatch(fetchMyUser());
      })
      .catch((response) => {
        dispatch(isUpdateProfileProcessing(false));
        dispatch(updateProfileResponse(response));
      });
  };
}

// --------------------------------------------------

export function isImportantUpdateProfileProcessing(bool) {
  return {
    type: IS_IMPORTANT_UPDATE_PROFILE_PROCESSING,
    isProcessing: bool,
  };
}

export function importantUpdateProfileResponse(object) {
  return {
    type: IMPORTANT_UPDATE_PROFILE_RESPONSE,
    response: object,
  };
}

export function requestImportantUpdateProfile() {
  return (dispatch) => {
    dispatch(importantUpdateProfileResponse({}));
    dispatch(isImportantUpdateProfileProcessing(true));
    // request
    DigitelClient.requestImportantUpdateProfile()
      .then((response) => {
        // update state
        dispatch(isImportantUpdateProfileProcessing(false));
        dispatch(importantUpdateProfileResponse(response));
      })
      .catch((response) => {
        dispatch(isImportantUpdateProfileProcessing(false));
        dispatch(importantUpdateProfileResponse(response));
      });
  };
}

export function importantUpdateProfile(actionCode, userInfo) {
  return (dispatch, getState) => {
    dispatch(importantUpdateProfileResponse({}));
    dispatch(isImportantUpdateProfileProcessing(true));
    // request
    DigitelClient.importantUpdateProfile(actionCode, userInfo)
      .then((response) => {
        // update state
        dispatch(isImportantUpdateProfileProcessing(false));
        dispatch(importantUpdateProfileResponse(response));
        // update password if needed
        if (userInfo.password && userInfo.password.length > 0) {
          const user = Object.assign(getState().myUser, {
            password: userInfo.password,
          });
          dispatch(myUser(user));
        }
        // update user
        else {
          dispatch(fetchMyUser());
        }
      })
      .catch((response) => {
        dispatch(isImportantUpdateProfileProcessing(false));
        dispatch(importantUpdateProfileResponse({ ...response, shouldAlert: true }));
      });
  };
}

// --------------------------------------------------

export function isGetOwnersProcessing(bool) {
  return {
    type: IS_GET_OWNERS_PROCESSING,
    isProcessing: bool,
  };
}

export function getOwnersResponse(object) {
  return {
    type: GET_OWNERS_RESPONSE,
    response: object,
  };
}

export function getOwners(referralID, searchText) {
  return (dispatch) => {
    dispatch(getOwnersResponse({}));
    dispatch(isGetOwnersProcessing(true));
    DigitelClient.getOwners(referralID, searchText)
      .then((response) => {
        dispatch(isGetOwnersProcessing(false));
        dispatch(getOwnersResponse(response));
      })
      .catch((response) => {
        dispatch(isGetOwnersProcessing(false));
        dispatch(getOwnersResponse(response));
      });
  };
}

// --------------------------------------------------

export function isGetUsersProcessing(bool) {
  return {
    type: IS_GET_USERS_PROCESSING,
    isProcessing: bool,
  };
}

export function getUsersResponse(object) {
  return {
    type: GET_USERS_RESPONSE,
    response: object,
  };
}

export function getUsers(keySearch) {
  return (dispatch) => {
    dispatch(getUsersResponse({}));
    dispatch(isGetUsersProcessing(true));
    DigitelClient.getUsers(keySearch)
      .then((response) => {
        dispatch(isGetUsersProcessing(false));
        dispatch(getUsersResponse(response));
      })
      .catch((response) => {
        dispatch(isGetUsersProcessing(false));
        dispatch(getUsersResponse(response));
      });
  };
}

// --------------------------------------------------

export function resetAppState() {
  return {
    type: RESET_APP_STATE,
  };
}

/*  USER LIST
 */

export function clearUserList() {
  return (dispatch) => {
    dispatch(myUsers([]));
  };
}

export function chooseUser(user) {
  return async (dispatch, getState) => {
    const currentUser = getState().myUser;
    const existCurrentUser = currentUser && currentUser.uid;
    const loginUser = async (userData) => {
      dispatch(isLoginProcessing(true));
      await auth().signInWithCustomToken(userData.firebaseToken);
      dispatch(clearUserList());
      dispatch(isLoginProcessing(false));
      return mLoginSuccess(userData, dispatch, getState);
    };

    const logoutCurrentUser = async () => {
      await dispatch(logout());
    };

    try {
      if (existCurrentUser) {
        dispatch(loadingAccountData(true));
        await logoutCurrentUser();
      }
      dispatch(loadingAccountData(true));
      await loginUser(user.uid ? user : User.objectFromLoginJSON({ ...user, uid: user.ID }));
    } finally {
      dispatch(loadingAccountData(false));
      setTimeout(() => {
        DigitelClient.trackEvent(TrackingEvents.USER_LOGIN);
        dispatch(sendNotificationLogin());
      }, 1000);
    }
  };
}

export async function updateUserNote(userID, note) {
  return DigitelClient.updateUserNote(userID, note);
}

export function updatePhone(phone, force, otp, startRequest, endRequest) {
  return DigitelClient.updatePhone(phone, force, otp, startRequest, endRequest);
}

// ADD ACCOUNT

export function addAccount() {
  return async (dispatch, getState) => {
    const accessToken = getState().myUser.phoneNumber;
    const deviceUDID = DeviceInfo.getUniqueId();
    const params = {
      platform: METHOD.PHONE,
      accessToken,
      deviceUDID,
    };
    try {
      await DigitelClient.mfAddAccount(params);
    } catch (err) {
      return addAccountFail(dispatch, params);
    }
    return true;
  };
}

export function addAccountFail(dispatch, params) {
  dispatch(homeNavigate('RegisterName', params));
}

export function sendNotificationLogin() {
  return () => {
    DigitelClient.mfNotificationLogin();
  };
}
