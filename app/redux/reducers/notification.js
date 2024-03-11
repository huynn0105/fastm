/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import { NOTIFICATION_CATEGORIES } from '../../submodules/firebase/model/Notification';
import DatabaseManager from 'app/manager/DatabaseManager';

import {
  IS_REGISTER_FIREBASE_TOKEN_PROCESSING,
  REGISTER_FIREBASE_TOKEN_RESPONSE,
  IS_GET_NOTIFICATIONS_PROCESSING,
  GET_NOTIFICATIONS_RESPONSE,
  NOTIFICATIONS,
  APPEND_NOTIFICATIONS,
  PENDING_NOTIFICATION,
  PENDING_NOTIFICATION_LIST,
  COUNT_UNREAD_NOTIFICATIONS,
  COUNT_UNREAD_NOTIFICATIONS_FB,
  READ_NOTIFICATION,
  READ_ALL_NOTIFICATION,
  ADD_NOTI_TO_PENDING_LIST,
  REMOVE_NOTI_FROM_PENDING_LIST,
} from '../actions/types';

// --------------------------------------------------

export function isRegisterFirebaseTokenProcessing(state = false, action) {
  switch (action.type) {
    case IS_REGISTER_FIREBASE_TOKEN_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function registerFirebaseTokenResponse(state = {}, action) {
  switch (action.type) {
    case REGISTER_FIREBASE_TOKEN_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function isGetNotificationsProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_NOTIFICATIONS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getNotificationsResponse(state = {}, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function adminNotifications(state = [], action) {
  return state;
  // if (action.category !== NOTIFICATION_CATEGORIES.ADMIN) {
  //   return state;
  // }
  // switch (action.type) {
  //   case NOTIFICATIONS:
  //     return action.notifications;
  //   case APPEND_NOTIFICATIONS:
  //     return state.concat(action.notifications);
  //   default:
  //     return state;
  // }
}

export function systemNotifications(state = [], action) {
  return state;
  // if (action.category !== NOTIFICATION_CATEGORIES.SYSTEM) {
  //   return state;
  // }
  // switch (action.type) {
  //   case NOTIFICATIONS:
  //     return action.notifications;
  //   case APPEND_NOTIFICATIONS:
  //     return state.concat(action.notifications);
  //   default:
  //     return state;
  // }
}

export function adminGiftedNotifications(state = [], action) {
  if (action.category !== NOTIFICATION_CATEGORIES.ADMIN) {
    return state;
  }

  if (action.type === READ_ALL_NOTIFICATION || action.type === READ_NOTIFICATION) {
    return mProcessNoti(state, action);
  }

  if (action.read !== 'all') {
    return state;
  }

  return mProcessNoti(state, action);
}

export function systemGiftedNotifications(state = [], action) {
  if (action.category !== NOTIFICATION_CATEGORIES.SYSTEM) {
    return state;
  }

  if (action.type === READ_ALL_NOTIFICATION || action.type === READ_NOTIFICATION) {
    return mProcessNoti(state, action);
  }

  if (action.read !== 'all') {
    return state;
  }

  return mProcessNoti(state, action);
}

export function adminGiftedUnreadNotifications(state = [], action) {
  if (action.category !== NOTIFICATION_CATEGORIES.ADMIN) {
    return state;
  }

  if (action.type === READ_ALL_NOTIFICATION || action.type === READ_NOTIFICATION) {
    return mProcessNoti(state, action);
  }

  if (action.read !== 'unread') {
    return state;
  }

  return mProcessNoti(state, action);
}

export function systemGiftedUnreadNotifications(state = [], action) {
  if (action.category !== NOTIFICATION_CATEGORIES.SYSTEM) {
    return state;
  }

  if (action.type === READ_ALL_NOTIFICATION || action.type === READ_NOTIFICATION) {
    return mProcessNoti(state, action);
  }

  if (action.read !== 'unread') {
    return state;
  }

  return mProcessNoti(state, action);
}

function mProcessNoti(state, action) {
  switch (action.type) {
    case NOTIFICATIONS:
      return action.notifications.map((noti) => {
        return mConvertNotiToGiftedMessage(noti);
      });
    case APPEND_NOTIFICATIONS:
      return state.concat(
        action.notifications.map((noti) => {
          return mConvertNotiToGiftedMessage(noti);
        }),
      );

    case READ_NOTIFICATION:
      mReadNotification(action.noti);
      return state.map((item) => (item.uid === action.noti.uid ? { ...item, read: true } : item));
    case READ_ALL_NOTIFICATION:
      state.forEach((item) => {
        mReadNotification(item);
      });
      return state.map((item) => ({ ...item, read: true }));
    default:
      return state;
  }
}

export function totalUnReadAdminNotifications(state = 0, action) {
  switch (action.type) {
    case COUNT_UNREAD_NOTIFICATIONS:
      if (action.category === 'admin') {
        return action.count;
      }
      return state;
    default:
      return state;
  }
}

export function totalUnReadSystemNotifications(state = 0, action) {
  switch (action.type) {
    case COUNT_UNREAD_NOTIFICATIONS:
      if (action.category === 'system') {
        return action.count;
      }
      return state;
    default:
      return state;
  }
}

export function totalUnReadAdminNotificationsFb(state = 0, action) {
  switch (action.type) {
    case COUNT_UNREAD_NOTIFICATIONS_FB:
      if (action.category === 'admin') {
        return action.count;
      }
      return state;
    default:
      return state;
  }
}

export function totalUnReadSystemNotificationsFb(state = 0, action) {
  switch (action.type) {
    case COUNT_UNREAD_NOTIFICATIONS_FB:
      if (action.category === 'system') {
        return action.count;
      }
      return state;
    default:
      return state;
  }
}

export function pendingNotification(state = null, action) {
  switch (action.type) {
    case PENDING_NOTIFICATION:
      return action.notification;
    default:
      return state;
  }
}

export function pendingNotificationList(state = [], action) {
  const notification = action.payload;
  switch (action.type) {
    case PENDING_NOTIFICATION_LIST:
      return notification;
    case ADD_NOTI_TO_PENDING_LIST:
      return mAppendNotificationToList(notification, state);
    case REMOVE_NOTI_FROM_PENDING_LIST:
      return mRemoveNotificationFromList(notification, state);
    default:
      return state;
  }
}

function mConvertNotiToGiftedMessage(notification) {
  // base props
  const text = notification.extraData.htmlBody
    ? notification.extraData.htmlBody
    : notification.extraData.body;
  const giftedMessage = {
    notification,
    _id: notification.uid,
    uid: notification.uid,
    user: {
      _id: 'appay',
    },
    createdAt: notification.createTimeMoment().toDate(),
    text,
    title: notification.extraData.title,
  };
  return giftedMessage;
}

function mReadNotification(noti) {
  DatabaseManager.shared().readNotificationFb(noti);
}

function mAppendNotificationToList(notification, notificationList) {
  let result = notificationList;
  let notificationIsExist = false;
  if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
    result = result.filter((noti) => noti.category !== NOTIFICATION_CATEGORIES.CHAT);
  }
  for (let i = 0; i < result.length; i += 1) {
    const oldNoti = result[i];
    if (oldNoti.uid === notification.uid) {
      notificationIsExist = true;
      break;
    }
  }
  if (!notificationIsExist) {
    if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
      result = result.concat([notification]);
    } else {
      result = [notification].concat(result);
    }
  }
  return result;
}

function mRemoveNotificationFromList(notification, notificationList) {
  let result = notificationList;
  if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
    result = result.filter((noti) => noti.category !== NOTIFICATION_CATEGORIES.CHAT);
  } else {
    result = result.filter((noti) => noti.uid !== notification.uid);
  }
  return result;
}
