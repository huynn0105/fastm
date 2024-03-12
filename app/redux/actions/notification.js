/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import DatabaseManager from 'app/manager/DatabaseManager';
import DigitelClient from 'app/network/DigitelClient';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_TYPES,
} from '../../submodules/firebase/model/Notification';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../../submodules/firebase/network/FirebaseFunctions';
import { fetchAllListOSTicket, fetchThreadByTicketNumber } from './feedback';
import {
  ADD_NOTI_TO_PENDING_LIST,
  APPEND_NOTIFICATIONS,
  COUNT_UNREAD_NOTIFICATIONS,
  COUNT_UNREAD_NOTIFICATIONS_FB,
  GET_NOTIFICATIONS_RESPONSE,
  IS_GET_NOTIFICATIONS_PROCESSING,
  IS_REGISTER_FIREBASE_TOKEN_PROCESSING,
  NOTIFICATIONS,
  PENDING_NOTIFICATION,
  READ_ALL_NOTIFICATION,
  READ_NOTIFICATION,
  REGISTER_FIREBASE_TOKEN_RESPONSE,
  REMOVE_NOTI_FROM_PENDING_LIST,
} from './types';
import { showAlert } from '../../utils/UIUtils';

const LOG_TAG = 'actions/notification.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------

export function isRegisterFirebaseTokenProcessing(bool) {
  return {
    type: IS_REGISTER_FIREBASE_TOKEN_PROCESSING,
    isProcessing: bool,
  };
}

export function registerFirebaseTokenResponse(object) {
  return {
    type: REGISTER_FIREBASE_TOKEN_RESPONSE,
    response: object,
  };
}

export function registerFirebaseToken(fcmToken, deviceUDID, deviceType, os, osVersion) {
  return (dispatch) => {
    dispatch(registerFirebaseTokenResponse({}));
    dispatch(isRegisterFirebaseTokenProcessing(true));
    DigitelClient.registerFirebaseToken(fcmToken, deviceUDID, deviceType, os, osVersion)
      .then(() => {
        // update state
        dispatch(isRegisterFirebaseTokenProcessing(false));
        dispatch(
          registerFirebaseTokenResponse({
            status: true,
            message: 'OK',
          }),
        );
      })
      .catch((response) => {
        dispatch(isRegisterFirebaseTokenProcessing(false));
        dispatch(registerFirebaseTokenResponse(response));
      });
  };
}

// --------------------------------------------------

export function isGetNotificationsProcessing(bool) {
  return {
    type: IS_GET_NOTIFICATIONS_PROCESSING,
    isProcessing: bool,
  };
}

export function getNotificationsResponse(object) {
  return {
    type: GET_NOTIFICATIONS_RESPONSE,
    response: object,
  };
}

export function notifications(objects, category, type) {
  return {
    type: NOTIFICATIONS,
    category,
    notifications: objects,
    read: type,
  };
}

export function appendNotifications(objects, category, type) {
  return {
    type: APPEND_NOTIFICATIONS,
    category,
    notifications: objects,
    read: type,
  };
}

export function unreadNotifications(object, category) {
  return {
    type: COUNT_UNREAD_NOTIFICATIONS_FB,
    category,
    count: object,
  };
}

export function readNotification(noti, category) {
  return {
    type: READ_NOTIFICATION,
    category,
    noti,
  };
}

export function readAllNotification(category, type) {
  return {
    type: READ_ALL_NOTIFICATION,
    category,
    read: type,
  };
}

export function addNotificationToPendingListAction(notification) {
  return {
    type: ADD_NOTI_TO_PENDING_LIST,
    payload: notification,
  };
}

export function removeNotificationFromPendingList(notification) {
  return {
    type: REMOVE_NOTI_FROM_PENDING_LIST,
    payload: notification,
  };
}

function dispatchNotifications(dispatch, getState, objects, category, type) {
  const oldNotificationList =
    category === 'admin'
      ? getState().adminGiftedNotifications
      : getState().systemGiftedNotifications;
  if (mCheckNotificationChanged(objects, oldNotificationList)) {
    dispatch(notifications(objects, category, type));
  }
}

export function countUnReadNotifications(category) {
  const count = DatabaseManager.shared().countUnReadNotifications(category);
  return {
    type: COUNT_UNREAD_NOTIFICATIONS,
    category,
    count,
  };
}

export function readAllNotifications(category) {
  return (dispatch) => {
    DatabaseManager.shared().readAllNotifications(category);
    dispatch(countUnReadNotifications(category));
  };
}

export function pendingNotification(object) {
  return {
    type: PENDING_NOTIFICATION,
    notification: object,
  };
}

export function getAllNumUnreadNotiFb() {
  return (dispatch) => {
    dispatch(getNumUnreadNoti('admin'));
    dispatch(getNumUnreadNoti('system'));
  };
}

export function getLastNotiFb() {
  return (dispatch) => {
    const now = Math.floor(Date.now() / 1000);

    dispatch(getNumUnreadNoti('admin'));
    dispatch(getNumUnreadNoti('system'));

    return dispatch(getLastNotiFBCategoryFull(now));
  };
}

export function getLastNotiFBCategory(category) {
  return (dispatch) => {
    const now = Math.floor(Date.now() / 1000);
    dispatch(getNumUnreadNoti(category));
    return dispatch(getNotificationsFb(category, now, false, 6, 'all'));
  };
}

export function resetCanGetNotificationsFromDB() {
  return (dispatch) => {
    dispatch(
      getNotificationsResponse({
        canLoadMore: true,
      }),
    );
  };
}

function checkNewNotiForUpdate(getState, token, toDate) {
  return FirebaseFunctions.getNotificationCategoryFull(token, toDate, 1)
    .then((items) => {
      // update state
      if (mCheckNotificationChanged(items.admin, getState().adminGiftedNotifications.slice(0, 1))) {
        return true;
      }
      if (
        mCheckNotificationChanged(items.system, getState().systemGiftedNotifications.slice(0, 1))
      ) {
        return true;
      }
      return false;
    })
    .catch((response) => {
      // eslint-disable-line
      return true;
    });
}

export function getLastNotiFBCategoryFull(toDate, num = 6) {
  return (dispatch, getState) => {
    const asyncTask = async () => {
      // allow only process run at a time
      if (getState().isGetNotificationsProcessing) {
        return Promise.resolve(true);
      }

      const token = await FirebaseDatabase.firebaseToken();

      return checkNewNotiForUpdate(getState, token, toDate)
        .then((hasNewNoti) => {
          if (hasNewNoti) {
            // request
            dispatch(
              getNotificationsResponse({
                canLoadMore: true,
              }),
            );
            dispatch(isGetNotificationsProcessing(true));
            return FirebaseFunctions.getNotificationCategoryFull(token, toDate, num);
          }
          return false;
        })
        .then((items) => {
          if (items) {
            // update state
            dispatch(isGetNotificationsProcessing(false));
            dispatch(
              getNotificationsResponse({
                status: true,
                message: 'OK',
                canLoadMore: items.length >= num,
              }),
            );
            if (mCheckNotificationChanged(items.admin, getState().adminGiftedNotifications)) {
              DatabaseManager.shared().deleteAllNotifications('admin');
              const dbItems = DatabaseManager.shared().createObjects('Notification', items.admin);

              dispatchNotifications(dispatch, getState, dbItems, 'admin', 'all');
            }
            if (mCheckNotificationChanged(items.system, getState().systemGiftedNotifications)) {
              DatabaseManager.shared().deleteAllNotifications('system');
              const dbItems = DatabaseManager.shared().createObjects('Notification', items.system);
              dispatchNotifications(dispatch, getState, dbItems, 'system', 'all');
            }
            // clearn old-data if page is 1
            // DatabaseManager.shared().deleteAllNotificationsFull();
            // insert db
          }
          return true;
        })
        .catch((response) => {
          dispatch(isGetNotificationsProcessing(false));
          return Promise.resolve(true);
        });
    };
    return asyncTask();
  };
}

export function getNotificationsFb(category, toDate, isAppend, num = 6, type = 'all') {
  // console.log('111111', category);
  return (dispatch, getState) => {
    // allow only process run at a time
    if (getState().isGetNotificationsProcessing) {
      return Promise.resolve(true);
    }
    dispatch(isGetNotificationsProcessing(true));

    const asyncTask = async () => {
      const token = await FirebaseDatabase.firebaseToken();

      // request

      dispatch(
        getNotificationsResponse({
          canLoadMore: true,
        }),
      );
      dispatch(isGetNotificationsProcessing(true));
      return FirebaseFunctions.getNotification(token, toDate, num, category, type)
        .then((items) => {
          // console.log('222222', items);
          // update state
          dispatch(isGetNotificationsProcessing(false));
          dispatch(
            getNotificationsResponse({
              status: true,
              message: 'OK',
              canLoadMore: items.length >= num,
            }),
          );
          // clearn old-data if page is 1
          if (!isAppend) {
            DatabaseManager.shared().deleteAllNotifications(category);
          }
          // insert db
          const oldNotificationList =
            category === 'admin'
              ? getState().adminGiftedNotifications
              : getState().systemGiftedNotifications;
          // console.log('2.55555', oldNotificationList);
          if (mCheckNotificationChanged(items, oldNotificationList)) {
            const dbItems = DatabaseManager.shared().createObjects('Notification', items);
            if (!isAppend) {
              // console.log('333333', dbItems);
              dispatchNotifications(dispatch, getState, dbItems, category, type);
            } else {
              // console.log('444444', dbItems);
              dispatch(appendNotifications(dbItems, category, type));
            }
          }
          return true;
        })
        .catch((response) => {
          // console.log('error', response);
          dispatch(isGetNotificationsProcessing(false));
          return Promise.resolve(true);
        });
    };
    return asyncTask();
  };
}

export function getNumUnreadNoti(category) {
  return (dispatch, getState) => {
    const asyncTask = async () => {
      const token = await FirebaseDatabase.firebaseToken();

      return FirebaseFunctions.getNumUnreadNotification(token, category)
        .then((result) => {
          if (
            (category === 'admin' &&
              !_.isEqual(getState().totalUnReadAdminNotificationsFb, result)) ||
            (category === 'system' &&
              !_.isEqual(getState().totalUnReadSystemNotificationsFb, result))
          ) {
            dispatch(unreadNotifications(result, category));
          }
        })
        .catch(() => {});
    };
    return asyncTask();
  };
}

export function readNoti(category, noti) {
  return (dispatch, getState) => {
    const asyncTask = async () => {
      const token = await FirebaseDatabase.firebaseToken();

      dispatch(isGetNotificationsProcessing(true));
      dispatch(readNotification(noti, category));
      const unread =
        category === 'admin'
          ? getState().totalUnReadAdminNotificationsFb - 1
          : getState().totalUnReadSystemNotificationsFb - 1;
      dispatch(unreadNotifications(unread > 0 ? unread : 0, category));

      return FirebaseFunctions.readNotification(token, category, noti.uid)
        .then(() => {
          dispatch(readNotification(noti, category));
          dispatch(isGetNotificationsProcessing(false));
        })
        .catch(() => {
          dispatch(isGetNotificationsProcessing(false));
        });
    };
    return asyncTask();
  };
}

export function readAllNoti(category, type) {
  return (dispatch) => {
    const asyncTask = async () => {
      const token = await FirebaseDatabase.firebaseToken();
      dispatch(isGetNotificationsProcessing(true));

      dispatch(readAllNotification(category, type));
      dispatch(unreadNotifications(0, category));

      return FirebaseFunctions.readAllNotification(token, category)
        .then(() => {
          dispatch(readAllNotification(category, type));
          dispatch(isGetNotificationsProcessing(false));
        })
        .catch(() => {
          dispatch(isGetNotificationsProcessing(false));
        });
    };
    return asyncTask();
  };
}

export function addNotificationToPendingList(notification) {
  return (dispatch, getState) => {
    if (checkCanDisplayNotificationInScreen(notification, getState, dispatch)) {
      if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
        const updatePhotoForChatNoti = async () => {
          const chatNotification = notification;
          const messageJSON = notification.extraData.chatMessage || {};
          const threadID = messageJSON.threadID;
          const thread = await ChatManager.shared().getThread(threadID);
          chatNotification.image = thread.photoImageURI();
          dispatch(addNotificationToPendingListAction(chatNotification));
        };
        updatePhotoForChatNoti();
      } else {
        dispatch(addNotificationToPendingListAction(notification));
      }
    }
  };
}

function mCheckNotificationChanged(newNotifications = [], oldNotifications) {
  if (newNotifications.length !== oldNotifications.length) {
    return true;
  }
  for (let i = 0; i < newNotifications.length; i += 1) {
    const newNoti = newNotifications[i];
    const oldNoti = oldNotifications[i];
    if (newNoti.uid !== oldNoti.uid) {
      return true;
    }
  }
  return false;
}

export function checkCanDisplayNotificationInScreen(notification, getState, dispatch) {
  let canDisplayNoti = true;
  const currentScreenName = getState().currentScreenName;

  if (dispatch && notification.type === NOTIFICATION_TYPES.FEEDBACK) {
    if (dispatch) dispatch(fetchAllListOSTicket());

    const ticketNumber = notification.extraData.ticket.ticketNumber;
    if (
      getState().threadByTicketID &&
      getState().threadByTicketID.ticketNumber &&
      `${getState().threadByTicketID.ticketNumber}` === `${ticketNumber}`
    ) {
      if (dispatch) dispatch(fetchThreadByTicketNumber(ticketNumber));
      return false;
    }
  }

  if (
    notification.category === NOTIFICATION_CATEGORIES.ADMIN &&
    currentScreenName === `ChatBox_${NOTIFICATION_CATEGORIES.ADMIN}`
  ) {
    canDisplayNoti = false;
  } else if (
    notification.category === NOTIFICATION_CATEGORIES.SYSTEM &&
    currentScreenName === `ChatBox_${NOTIFICATION_CATEGORIES.SYSTEM}`
  ) {
    canDisplayNoti = false;
  } else if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
    const messageJSON = notification.extraData.chatMessage || {};
    const threadID = messageJSON.threadID;
    const currentThread = getState().chatThread;
    if (currentThread && currentThread.uid === threadID) {
      canDisplayNoti = false;
    }
  }
  return canDisplayNoti;
}
