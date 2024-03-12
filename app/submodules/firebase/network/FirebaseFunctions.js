/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * FirebaseFunctions
 * - API to interact with firebase database
 */

import { Configs } from '../config.js';

import { User, Notification } from '../model';
import Contact from '../../../models/Contact';
import store from '../../../redux/store/store';

// --------------------------------------------------

const UNKNOWN_ERROR_RESPONSE = {
  status: false,
  message: 'UNKNOW_ERROR',
};

export const API_ERROR_CODES = {
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  INVALID_ACCESS_TOKEN: 'INVALID_ACCESS_TOKEN',
  UNKNOWN_ERROR: 'UNKNOW_ERROR',
};

// --------------------------------------------------

const axios = require('axios');

const AxiosClient = axios.create({
  baseURL: Configs.firebaseFunctionsBaseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// --------------------------------------------------
// FirebaseFunctions
// --------------------------------------------------

class FirebaseFunctions {
  static setup(userID, userAccessToken) {
    FirebaseFunctions.userID = userID;
    FirebaseFunctions.userAccessToken = userAccessToken;
  }

  /**
   * Help to log axios error
   */
  static logAxiosError(error, api = 'API') {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    }
    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
    }
    // rarely need -> disabled
  }

  /**
   * Make sure if an axius error/exception occur, it will be log & have message
   */
  static handleAxiosError(error, api = 'API') {
    console.log('TCL: FirebaseFunctions -> statichandleAxiosError -> error', error);
    FirebaseFunctions.logAxiosError(error, api);
    if (error.response && error.response.data) {
      const response = Object.assign(UNKNOWN_ERROR_RESPONSE, error.response.data);
      return Promise.reject(response);
    }
    return Promise.reject(UNKNOWN_ERROR_RESPONSE);
  }

  /**
   * Make sure if a response failed, it will be log & have message
   */
  static handleFailResponse(response, api = 'API') {
    const message = Object.assign(UNKNOWN_ERROR_RESPONSE, response);
    return Promise.reject(message);
  }

  // --------------------------------------------------

  static handleLoginResponse(response) {
    const api = 'login';
    if (response.data.status !== true) {
      return FirebaseFunctions.handleFailResponse(response, api);
    }
    // parse user
    const userData = response.data.data || {};
    const firebaseData = response.data.firebase || {};
    const extraInfo = {
      uid: userData.ID || '',
      firebaseToken: firebaseData.token || '',
    };
    const userJSON = Object.assign({}, userData, extraInfo);
    const user = User.objectFromLoginJSON(userJSON);
    // wrong password
    if (!user) {
      const err = { response: { status: 404 } };
      throw err;
    }
    // ok
    else {
      return user;
    }
  }

  static handleLoginError(error) {
    const api = 'login';
    // custom an error code if invalid token
    if (error.response && error.response.status === 403) {
      return Promise.reject(
        Object.assign(
          {
            errorCode: API_ERROR_CODES.INVALID_ACCESS_TOKEN,
          },
          error.response.data,
        ),
      );
    }
    // custom an error code if wrong password
    if (error.response && error.response.status === 404) {
      return Promise.reject(
        Object.assign(
          {
            errorCode: API_ERROR_CODES.WRONG_PASSWORD,
          },
          error.response.data,
        ),
      );
    }
    // other errors
    return FirebaseFunctions.handleAxiosError(error, api);
  }

  static loginViaFirebase(username, password, deviceUDID) {
    const url = `${Configs.firebaseFunctionsBaseURL}/login`;
    return AxiosClient.get(url, {
      params: {
        username,
        password,
        deviceUDID,
      },
    })
      .then((response) => {
        return FirebaseFunctions.handleLoginResponse(response);
      })
      .catch((error) => {
        return FirebaseFunctions.handleLoginError(error);
      });
  }

  static loginWithTokenViaFirebase(accessToken) {
    const url = `${Configs.firebaseFunctionsBaseURL}/loginToken`;
    return AxiosClient.get(url, {
      params: {
        accessToken,
      },
    })
      .then((response) => {
        return FirebaseFunctions.handleLoginResponse(response);
      })
      .catch((error) => {
        return FirebaseFunctions.handleLoginError(error);
      });
  }

  static registerFcmToken(deviceUDID, fcmToken) {
    const api = 'registerFcmToken';
    const url = `${Configs.firebaseFunctionsBaseURL}/registerFcmToken`;
    const userID = store.getState().myUser ? store.getState().myUser.uid : '';
    return AxiosClient.get(url, {
      params: {
        userID,
        deviceUDID,
        fcmToken,
      },
    })
      .then((response) => {
        console.log('aaa-49', response);
        if (response.status === 200) {
          return true;
        }
        return false;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getContacts(standardPhoneNumbers, fbToken) {
    const api = 'getContacts';
    return AxiosClient.get('getContactsToken', { params: { standardPhoneNumbers, fbToken } })
      .then((response) => {
        if (response.data.data) {
          return response.data.data;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static searchUserByPhone(standardPhoneNumber, fbToken) {
    const api = 'searchUserByPhone';
    return AxiosClient.get('searchUserByPhone', { params: { standardPhoneNumber, fbToken } })
      .then((response) => {
        if (response.data.data) {
          return response.data.data;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static updateUserReadTimeInThread(threadID, userID) {
    const api = 'updateUserReadTimeInThread';
    return AxiosClient.get('updateUserReadTimeInThread', { params: { threadID, userID } })
      .then((response) => {
        if (response.status === 200) {
          return true;
        }
        return false;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getPublicThreads() {
    const api = 'getPublicThreads';
    const secretKey = Configs.firebaseFunctionsSecretKey;
    return AxiosClient.get('getAllPublicThreads', { params: { secretKey } })
      .then((response) => {
        if (response.data.data) {
          return response.data.data;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getBlockedUsers(fbToken) {
    const api = 'getBlockedUsers';
    return AxiosClient.get('getBlockedUsers', { params: { fbToken } })
      .then((response) => {
        if (response.data.data) {
          return response.data.data;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getNotification(token, toDate, num, category, type) {
    const api = 'getNotification';
    return AxiosClient.get('getOldNotiFromDate', {
      params: { token, toDate, num, category, type },
    })
      .then((response) => {
        if (response.data.data) {
          const data = response.data.data;
          const items = data
            .map((json) => Notification.objectFromJSONFB(json))
            .filter((item) => item !== null)
            .sort((a, b) => {
              if (a.createTime > b.createTime) {
                return -1;
              }
              return 1;
            });
          return items;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getNotificationCategoryFull(token, toDate, num) {
    const api = 'getNotificationCategoryFull';
    return AxiosClient.get('getOldNotiFullCategoryFromDate', { params: { token, toDate, num } })
      .then((response) => {
        if (response.data.data) {
          const data = response.data.data;
          const result = {};
          result.admin = data.admin
            .map((json) => Notification.objectFromJSONFB(json))
            .filter((item) => item !== null)
            .sort((a, b) => {
              if (a.createTime > b.createTime) {
                return -1;
              }
              return 1;
            });
          result.system = data.system
            .map((json) => Notification.objectFromJSONFB(json))
            .filter((item) => item !== null)
            .sort((a, b) => {
              if (a.createTime > b.createTime) {
                return -1;
              }
              return 1;
            });
          return result;
        }
        return [];
      })
      .catch((error) => {
        console.log(error);
      });
    // FirebaseFunctions.handleAxiosError(error, api));
  }

  static getNotificationFull(token, category, toDate, num) {
    const api = 'getNotificationFull';
    return AxiosClient.get('getOldNotiFromDateFull', { params: { token, toDate, num, category } })
      .then((response) => {
        if (response.data.data) {
          const data = response.data.data;
          const items = data
            .map((json) => Notification.objectFromJSONFB(json))
            .filter((item) => item !== null)
            .sort((a, b) => {
              if (a.createTime > b.createTime) {
                return -1;
              }
              return 1;
            });
          return items;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getNumUnreadNotification(token, category) {
    const api = 'getNumUnreadNotification';
    return AxiosClient.get('numUnreadNoti', { params: { token, category } })
      .then((response) => {
        if (response.data.total) {
          const unread = response.data.total;
          return unread;
        }
        return 0;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static readNotification(token, category, notiID, type) {
    const api = 'readNotification';

    return AxiosClient.get('readNoti', { params: { token, category, notiID, type } })
      .then((response) => {
        if (response.data.message) {
          return true;
        }
        return false;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static readAllNotification(token, category) {
    const api = 'readAllNotification';
    return AxiosClient.get('readAllNoti', { params: { token, category } })
      .then((response) => {
        if (response.data.message) {
          return true;
        }
        return false;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static getNewChatMess(token, threadID, readTime = 0) {
    const api = 'getNewChatMess';
    return AxiosClient.get('getNewChatMess', { params: { token, threadID, readTime } })
      .then((response) => {
        if (response.data && response.data.data) {
          return response.data.data;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static fetchConversationContacts(token) {
    const api = 'fetchConversationContacts';
    return AxiosClient.get(api, { params: { fbToken: token } })
      .then((response) => {
        if (response.data && response.data.data) {
          return response.data.data.map(Contact.objectFromJSON);
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static fetchConversationContactsOnline(token) {
    const api = 'fetchConversationContactsOnline';
    return AxiosClient.get(api, { params: { fbToken: token } })
      .then((response) => {
        if (response.data && response.data.data) {
          return response.data.data.map(Contact.objectFromJSON);
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  // apiGetInvitationAndSendingRequest,
  // // apiDeleteContact,
  // // apiFavoriteContact,
  // apiSendRequestContact,
  // apiResendRequestContact,
  // apiCancelRequestContact,
  // apiAcceptRequestContact,
  // apiRejectRequestContact

  static fetchInvitationAndSendingRequest(token) {
    const api = 'fetchInvitationAndSendingRequest';
    return AxiosClient.get(api, { params: { fbToken: token } })
      .then((response) => {
        if (response.data && response.data.data) {
          return response.data.data;
        }
        throw Error();
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static sendRequestContact(token, phoneNumber, nickname = '') {
    const api = 'sendRequestContact';
    return AxiosClient.get(api, { params: { fbToken: token, phoneNumber, message: '', nickname } })
      .then(() => {
        return true;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  // static resendRequestContact(token, invitationID) {
  //   const api = 'resendRequestContact';
  //   return AxiosClient.get(api, { params: { fbToken: token, invitationID } })
  //     .then(() => {
  //       return true;
  //     })
  //     .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  // }

  static cancelRequestContact(token, phoneNumber) {
    const api = 'cancelRequestContact';
    return AxiosClient.get(api, { params: { fbToken: token, phoneNumber } })
      .then(() => {
        return true;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static acceptRequestContact(token, invitationID, acceptedUserID) {
    const api = 'acceptRequestContact';
    return AxiosClient.get(api, { params: { fbToken: token, invitationID, acceptedUserID } })
      .then(() => {
        return true;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static rejectRequestContact(token, senderID) {
    const api = 'rejectRequestContact';
    return AxiosClient.get(api, { params: { fbToken: token, senderID } })
      .then(() => {
        return true;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }

  static updateRefContact(token, refID) {
    const api = 'updateRefContact';
    return AxiosClient.get(api, { params: { fbToken: token, uidRef: refID } })
      .then(() => {
        return true;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }
  static flagNotification(token, category, notiID, type, createdDate, isFlag) {
    console.log(
      '\u001B[33m ai log ne \u001B[36m -> file: FirebaseFunctions.js -> line 487 -> type',
      type,
    );
    const api = 'flagNoti';
    return AxiosClient.get(api, { params: { token, category, notiID, type, createdDate, isFlag } })
      .then((response) => {
        if (response.data.message) {
          return true;
        }
        return false;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }
  static getFilterNotification(token, category) {
    const api = 'getFilterNotification';
    return AxiosClient.get(api, { params: { token, category } })
      .then((response) => {
        if (response.data.data) {
          return response.data.data;
        }
        return {};
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }
  static searchOldNotification(token, category, type, keyword, toDate) {
    const api = 'searchOldNoti';
    return AxiosClient.get(api, {
      params: { token, category, type, keyword, toDate },
    })
      .then((response) => {
        if (response.data.data) {
          const data = response.data.data;
          const items = data
            .map((json) => Notification.objectFromJSONFB(json))
            .filter((item) => item !== null)
            .sort((a, b) => {
              if (a.createTime > b.createTime) {
                return -1;
              }
              return 1;
            });
          return items;
        }
        return [];
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }
  static countChatUnread(token, withoutThreadIDs) {
    const api = 'countChatUnread';
    return AxiosClient.get(api, {
      params: { token, withoutThreadIDs },
    })
      .then((response) => {
        console.log('aaa-111', JSON.stringify({ token, withoutThreadIDs }), response);
        return response?.data?.data || 0;
      })
      .catch((error) => FirebaseFunctions.handleAxiosError(error, api));
  }
}

export default FirebaseFunctions;
