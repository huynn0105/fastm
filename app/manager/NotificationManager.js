/**
 * documents:
 * https://rnfirebase.io/docs/v4.0.x/messaging/reference/Messaging
 * https://rnfirebase.io/docs/v4.0.x/notifications/reference/Notifications
 * https://firebase.google.com/docs/cloud-messaging
 *
 * client will subscribe to these topics:
 * - /topics/all
 * - /topics/[ios|android]
 * - /topics/user-<user_id>
 * - /topics/project-<project_id>
 * - /topics/level-<level_id>
 * - /topics/role-<role_id>
 */

/**
 * NOTES:
 * - Be careful when import NotificationManager. It cannot be import in any file that import
 * `redux/actions`, Because NotificationManager is also import `redux/actions` itself.
 * It will cause crash like: `(0, actions.<action_name>) is not a function ...`
 */

/**
 * TODO:
 * investigate how to interact better with redux. as of now, redux cannot use NotificationManager,
 * only NotificationManager subscribe redux store to act
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
// --------------------------------------------------
/* eslint-disable */
import Utils from 'app/utils/Utils';
import { Alert, Linking, Platform, Vibration } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ReactMoE from 'react-native-moengage';
import { DeepLinkPaths, EndpointJoinGroupMfast } from '../constants/configs';
import { AsyncStorageKeys } from '../constants/keys';
import Strings from '../constants/strings';
import { News } from '../models';
import SystemThread from '../models/SystemThread';
import { homeNavigate } from '../redux/actions/navigation';
import {
  addNotificationToPendingList,
  checkCanDisplayNotificationInScreen,
  getLastNotiFb,
  getLastNotiFBCategory,
  pendingNotification,
  readNoti,
} from '../redux/actions/notification';
import store from '../redux/store/store';
import BroadcastManager from '../submodules/firebase/manager/BroadcastManager';
import { Message, Notification } from '../submodules/firebase/model';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_TYPES,
} from '../submodules/firebase/model/Notification';
import FirebaseFunctions from '../submodules/firebase/network/FirebaseFunctions';
import {
  closeChat,
  getNewChatMess,
  loadChatMessages,
  openChatWithThread,
} from '../submodules/firebase/redux/actions';
import DatatabaseManager from './DatabaseManager';
import notifee from '@notifee/react-native';
import { appsFlyerUninstall } from '../utils/AppsFlyers';
import { showDevAlert } from '../utils/UIUtils';
import messaging from '@react-native-firebase/messaging';
import FlutterService from '../screenV3/Home/FlutterService';
import { increaseTotalUnreadChat } from '../redux/actions/actionsV3/chatAction';
import { increaseTotalUnreadNotification } from '../redux/actions/actionsV3/notificationAction';

const LOG_TAG = 'NotificationManager.js';

/* eslint-enable */

const _ = require('lodash');

// check to subscribe store only once
let mIsSubscribeStore = false;

// --------------------------------------------------

function initNotificationManager() {
  // Utils.warn(`${LOG_TAG} initNotificationManager`,);

  // PRIVATE
  // --------------------------------------------------

  let rootScreen = null;
  let isPermissionGranted = false;

  // check subscriptions change
  let mSubscriptions = null;
  let mSubscriptionsIDs = '';
  let mSubscriptionsTopics = [];

  // firebase messaging
  let mUnsubscribeOnTokenRefreshFunc = null;
  let mUnsubscribeOnNotificationFunc = null;
  let mUnsubscribeOnMessageFunc = null;
  let mUnsubscribeOnNotificationOpenedFunc = null;
  let mUnsubscribeOnMessageMoengageFunc = null;

  if (!mIsSubscribeStore) {
    mIsSubscribeStore = true;
    store.subscribe(() => {
      const currentRootScreen = store.getState().rootScreen;
      if (
        store.getState().myUser &&
        store.getState().myUser.uid &&
        rootScreen === null &&
        currentRootScreen
      ) {
        rootScreen = currentRootScreen;
        mInitMessaging();
      }
      const currentSubscriptions = store.getState().subscriptions.items;
      if (!_.isEqual(mSubscriptions, currentSubscriptions)) {
        mSubscriptions = currentSubscriptions;
      }
    });
  }

  // --------------------------------------------------

  async function mInitMessaging() {
    // Utils.log(`${LOG_TAG} initMessaging`);
    // subscribe firebase events
    mUnsubscribeOnTokenRefreshFunc = messaging().onTokenRefresh(mOnTokenRefresh);
    mUnsubscribeOnMessageFunc = messaging().onMessage(mOnMessage);
    mUnsubscribeOnNotificationOpenedFunc =
      messaging().onNotificationOpenedApp(mOnNotificationOpened);

    // update fcm token
    NotificationManager.shared().updateFcmToken();
    // chekc initial notification
    setTimeout(() => {
      NotificationManager.shared().checkInitialNotification();
    }, 100);

    notifee.createChannel({
      id: 'mfast_channel',
      name: 'MFast Channel',
    });
  }

  function mDeinitMessaging() {
    // Utils.log(`${LOG_TAG}: deinitMessaging`);

    // unsubscribe event handler
    if (mUnsubscribeOnTokenRefreshFunc) {
      mUnsubscribeOnTokenRefreshFunc();
      mUnsubscribeOnTokenRefreshFunc = null;
    }
    if (mUnsubscribeOnNotificationFunc) {
      mUnsubscribeOnNotificationFunc();
      mUnsubscribeOnNotificationFunc = null;
    }
    if (mUnsubscribeOnMessageFunc) {
      mUnsubscribeOnMessageFunc();
      mUnsubscribeOnMessageFunc = null;
    }
    if (mUnsubscribeOnNotificationOpenedFunc) {
      mUnsubscribeOnNotificationOpenedFunc();
      mUnsubscribeOnNotificationOpenedFunc = null;
    }
    if (mUnsubscribeOnMessageMoengageFunc) {
      mUnsubscribeOnMessageMoengageFunc();
      mUnsubscribeOnMessageMoengageFunc = null;
    }

    // delete firebase instance to unsubscribe everythings
    // then reset NotificationManager for next login
    NotificationManager.shared().resetFirebaseInstanceID();
  }

  function mRequestPermission() {
    isPermissionGranted = false;
    // iOS
    if (Platform.OS === 'ios') {
      return messaging()
        .requestPermission()
        .then(() => {
          // Utils.log(`${LOG_TAG} iOS.requestPermissions: ok`);
          isPermissionGranted = true;
          return true;
        })
        .catch((error) => {
          Utils.warn(`${LOG_TAG} iOS.requestPermissions: error: `, error);
          return Promise.reject(error);
        });
    }
    // Android
    if (Platform.OS === 'android') {
      isPermissionGranted = true;
      return Promise.resolve(true);
    }
    // Others
    return Promise.reject(new Error('UNKNOW OS'));
  }

  function mOnTokenRefresh() {
    // Utils.log(`${LOG_TAG}: onTokenRefresh: `);
    NotificationManager.shared().updateFcmToken();
  }

  function mOnNotification(payload) {
    // Utils.log(`${LOG_TAG}: mOnNotification: payload: `, payload);
    // parse notification

    if (Platform.OS === 'ios') {
      mUpdateBadgeIcon(payload);
    }

    const notification = mConvertNotificationFromPayload(payload);
    const deviceId = DeviceInfo.getUniqueId();

    if (notification?.type == NOTIFICATION_TYPES.SHOW_LOGOUT_POPUP) {
      if (
        notification &&
        notification.extraData &&
        notification.extraData.deviceUDID &&
        notification.extraData.deviceUDID.length > 0 &&
        notification.extraData.deviceUDID !== deviceId
      ) {
        BroadcastManager.shared().notifyObservers('show_popup_force_logout');
        return;
      } else {
        return;
      }
    }

    if (notification?.type == NOTIFICATION_TYPES.OPEN_VIEW) {
      if (notification?.extraData?.action?.length > 0) {
        FlutterService.sendEvent('notification', JSON.stringify(notification?.extraData));
      }
    }

    checkReloadEvent(notification);

    if (!notification) {
      Utils.log(`${LOG_TAG}: mOnNotification: invalid notification: `, notification, payload);
      return;
    }

    // check force lgout
    if (!notification || mIsForceLogout(notification)) {
      BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.USER.INVALID_TOKEN);
      return;
    }

    // if user tap on notification
    if (
      payload.opened_from_tray &&
      (payload.opened_from_tray === 1 || payload.opened_from_tray === true)
    ) {
      NotificationManager.shared().handleTapOnNotification(notification);
    } else {
      // user receive push notification when app open
      // NotificationManager.shared().showNotification(notification);
      if (checkCanDisplayNotificationInScreen(notification, store.getState)) {
        Vibration.vibrate(500);
        store.dispatch(increaseTotalUnreadChat());
        store.dispatch(addNotificationToPendingList(notification));
      }
    }
    // fetch notification if it comes from Digitel
    if (
      notification.category === NOTIFICATION_CATEGORIES.ADMIN ||
      notification.category === NOTIFICATION_CATEGORIES.SYSTEM
    ) {
      // store.dispatch(getNotifications(notification.category));
      // store.dispatch(getLastNotiFBCategory(notification.category));
      store.dispatch(increaseTotalUnreadNotification());
    }
  }

  function checkReloadEvent(notification) {
    if (!notification) return;
    if (notification.event && notification.event.length > 0) {
      if (notification.event.includes('reload_customer')) {
        BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.EVENT.RELOAD_CUTOMER);
      }
      if (notification.event.includes('reload_col')) {
        BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.EVENT.RELOAD_COL);
      }
    }
  }

  function mOnMessage(payload) {
    // console.log('background', payload);
    mUpdateBadgeIcon(payload);
    mOnNotification(payload);
  }

  /**
   * trigger when user tap on notification when app on foreground or background
   */
  function mOnNotificationOpened(payload) {
    if (payload?.notification?.data?.moengage) {
      const url = payload?.notification?.data?.app_extra?.moe_deeplink;

      // if (
      //   !url ||
      //   !(url.startsWith(`${DEEP_LINK_BASE_URL}://`) || url.startsWith(EndpointJoinGroupMfast))
      // ) {
      //   return;
      // }
      // // check user login
      // const me = store.getState().myUser;
      // if (!(me && me.uid && me.accessToken && me.accessToken.length > 0)) {
      //   return;
      // }
      // parse & handle
      setTimeout(() => {
        Linking.openURL(url);
      }, 200);
    } else {
      const notiPayload = { ...payload, opened_from_tray: true };
      // handle
      mOnNotification(notiPayload);
    }
    // Utils.log(`${LOG_TAG}: mOnNotificationOpened: payload: `, payload);
    // hack with opened_from_tray
  }

  function mUpdateBadgeIcon(payload) {
    // Utils.log(`${LOG_TAG} payload: `, payload);

    if (payload?.data?.type === '-1') {
      // messaging().setBadge(parseInt(payload.data.badge, 10));

      if (payload?.data?.typeRead === 'noti') {
        store.dispatch(getLastNotiFb());
      }
    }
  }

  /**
   * trigger when user tap on notification when app terminated
   */
  async function mCheckInitialNotification() {
    // Utils.log(`${LOG_TAG}: mCheckInitialNotification: `);
    try {
      const notificationOpen = await messaging().getInitialNotification();

      const notiPayload = { ...notificationOpen, opened_from_tray: true };

      const data = notiPayload?.data || notiPayload?._data;

      if (data?.category === NOTIFICATION_CATEGORIES.SYSTEM) {
        store.dispatch(homeNavigate('ChatBox', { thread: SystemThread.systemThread() }));
      }

      if (data?.category === NOTIFICATION_CATEGORIES.ADMIN) {
        store.dispatch(homeNavigate('Notification', { thread: SystemThread.adminThread() }));
      }

      if (data?.extra_data) {
        data.extraData = JSON.parse(data.extra_data);
      }
      if (data?.notification_id) {
        data.uid = data.notification_id;
      }
      setTimeout(() => {
        NotificationManager.shared().handleTapOnNotification(data);
      }, 500);

      // setTimeout(() => {
      //   mOnNotification(notiPayload);
      // }, 500);
    } catch (error) {
      if (__DEV__) {
        console.log('error', JSON.stringify(error));
      }
    }

    // firebase
    //   .notifications()
    //   .getInitialNotification()
    //   .then((payload) => {
    //     console.log('amamamwf', payload);
    //     // Utils.log(`${LOG_TAG}: getInitialNotification: `, payload);
    //     if (!payload) return;
    //     // hack with opened_from_tray
    //     const notiPayload = { ...payload.notification, opened_from_tray: true };
    //     // handle
    //     mOnNotification(notiPayload);
    //   });
  }

  /**
   * check and re-subscribe all topics
   */
  function mUpdateSubscribeTopics() {
    mUpdateSubscribeTopicsForUser();
    // mUpdateSubscribeTopicsForSubscriptions();
  }

  /**
   * check and re-subscribe user related topics
   */
  function mUpdateSubscribeTopicsForUser() {
    // subscribe to my user id
    const userID = store.getState().myUser.uid;
    // messaging().subscribeToTopic(`user-${userID}`);
    // // subscribe os by default
    // messaging().subscribeToTopic('all');
    // messaging().subscribeToTopic(Platform.OS);
  }

  /**
   * check and re-subscribe for subscriptions related topics
   */
  function mUpdateSubscribeTopicsForSubscriptions() {
    // unsubscribe old topics
    if (mSubscriptionsTopics) {
      for (let i = 0; i < mSubscriptionsTopics.length; i += 1) {
        const topic = mSubscriptionsTopics[i];
        messaging().unsubscribeFromTopic(topic);
      }
    }
    // subscribe new topics: project, level, role
    mSubscriptionsTopics = [];
    const currentSubscriptions = store.getState().subscriptions.items;
    if (currentSubscriptions) {
      // project
      mUpdateSubscribeProjects(currentSubscriptions);
      // project level
      mUpdateSubscribeProjectLevels(currentSubscriptions);
      // project role
      mUpdateSubscribeProjectRoles(currentSubscriptions);
    }
  }

  // HELPERS
  // --------------------------------------------------

  function mUpdateSubscribeProjects(currentSubscriptions) {
    const projectTopics = currentSubscriptions
      .filter((item) => item.projectID !== undefined && item.projectID !== null)
      .map((item) => `project-${item.projectID}`);
    const uniqueProjectTopics = Array.from(new Set(projectTopics));
    mSubscribeTopics(uniqueProjectTopics);
    mSubscriptionsTopics = mSubscriptionsTopics.concat(uniqueProjectTopics);
  }

  function mUpdateSubscribeProjectLevels(currentSubscriptions) {
    const levelTopics = currentSubscriptions
      .filter((item) => item.levelID !== undefined && item.levelID !== null)
      .map((item) => `level-${item.levelID}`);
    const uniqueLevelTopics = Array.from(new Set(levelTopics));
    mSubscribeTopics(uniqueLevelTopics);
    mSubscriptionsTopics = mSubscriptionsTopics.concat(uniqueLevelTopics);
  }

  function mUpdateSubscribeProjectRoles(currentSubscriptions) {
    const roleTopics = currentSubscriptions
      .filter((item) => item.roleID !== undefined && item.roleID !== null)
      .map((item) => `role-${item.roleID}`)
      .sort();
    const uniqueRoleTopics = Array.from(new Set(roleTopics));
    mSubscribeTopics(uniqueRoleTopics);
    mSubscriptionsTopics = mSubscriptionsTopics.concat(uniqueRoleTopics);
  }

  function mSubscribeTopics(topics) {
    for (let i = 0; i < topics.length; i += 1) {
      const topic = topics[i];
      messaging().subscribeToTopic(topic);
    }
  }

  function mConvertNotificationFromPayload(payload) {
    // tweak for simulator
    const payloadInfo = payload;
    if (DeviceInfo.isEmulator()) {
      payloadInfo.aps = { alert: payload.notification };
    }

    const notification = Notification.objectFromNotificationPayload(payloadInfo);

    console.log('aaa-50', JSON.stringify(payloadInfo));

    // check notification
    if (!notification || !mIsNotificationValid(notification)) {
      return null;
    }
    // ok
    return notification;
  }

  function mIsForceLogout(noti) {
    if (noti.type === NOTIFICATION_TYPES.FORCE_LOGOUT) {
      return true;
    }
    return false;
  }

  function mIsNotificationValid(noti) {
    if (noti.type === NOTIFICATION_TYPES.SHOW_LOGOUT_POPUP) {
      return true;
    }
    if (
      noti.type === NOTIFICATION_TYPES.PLAIN_TEXT ||
      noti.type === NOTIFICATION_TYPES.CHANGE_PASS
    ) {
      if (noti.details && noti.details.length > 0) {
        return true;
      } else {
        if (noti?.extraDataJSON?.length > 0) {
          return true;
        }
      }
    } else if (
      noti.type === NOTIFICATION_TYPES.WEB_LINK ||
      noti.type === NOTIFICATION_TYPES.PLAIN_TEXT_WEB_LINK
    ) {
      if (noti.extraData && noti.extraData.url && noti.extraData.url.length > 0) {
        return true;
      }
    } else if (noti.type === NOTIFICATION_TYPES.WEB_STACK) {
      if (noti.extraData && noti.extraData.urls_stack && noti.extraData.urls_stack.length > 0) {
        return true;
      }
    } else if (noti.type === NOTIFICATION_TYPES.NEWS_DETAILS) {
      if (noti.extraData && noti.extraData.news) {
        const news = News.objectFromJSON(noti.extraData.news);
        if (news.uid && news.uid.length > 0) {
          return true;
        }
      }
    } else if (noti.type === NOTIFICATION_TYPES.MONEY_HISTORY) {
      return true;
    } else if (noti.type === NOTIFICATION_TYPES.POINTS_HISTORY) {
      return true;
    } else if (noti.type === NOTIFICATION_TYPES.CHAT_MESSAGE) {
      if (noti.extraData && noti.extraData.chatMessage) {
        const message = Message.objectFromJSON(noti.extraData.chatMessage);
        if (message.uid && message.uid.length > 0) {
          return true;
        }
      }
    } else if (noti.type === NOTIFICATION_TYPES.CHAT_THREAD_CHANGE) {
      return true;
    } else if (noti.type === NOTIFICATION_TYPES.FORCE_LOGOUT) {
      return true;
    } else if (noti.type === NOTIFICATION_TYPES.OPEN_VIEW) {
      return true;
    } else if (noti.type === NOTIFICATION_TYPES.EMPLOYEE_CARD) {
      return true;
    } else if (noti.type === NOTIFICATION_TYPES.FEEDBACK) {
      return true;
    }
    return false;
  }

  function mGetSortedSubscriptionsProjectIDs(subscriptions) {
    if (!subscriptions) {
      return '';
    }
    const projectsIDs = subscriptions
      .map((item) => parseInt(item.uid, 10))
      .sort((item1, item2) => item1 - item2)
      .reduce((acc, item) => {
        return `${acc}_${item}`;
      }, '');
    return projectsIDs;
  }

  // PUBLIC
  // --------------------------------------------------
  return {
    messaging() {
      return messaging();
    },
    isPermissionGranted() {
      return isPermissionGranted;
    },
    isUserLoggedIn() {
      const me = store.getState().myUser;
      if (!me || !me.uid || me.uid.length === 0) {
        return false;
      }
      return true;
    },
    resetFirebaseInstanceID() {
      try {
        messaging()
          .deleteToken()
          .then(() => {
            Utils.log(`${LOG_TAG}: resetFirebaseInstanceID: ok`);
            NotificationManager.reset();
          })
          .catch((err) => {
            Utils.warn(`${LOG_TAG}: resetFirebaseInstanceID: err: ${err}`, err);
            NotificationManager.reset();
          });
        // this.saveFcmToken('');
      } catch (err) {}
    },
    checkInitialNotification() {
      if (!this.isUserLoggedIn()) {
        Utils.log(`${LOG_TAG}: checkInitialNotification: user not logged in -> return`);
        return;
      }
      mCheckInitialNotification();
    },
    updateSubscribeTopics() {
      if (!this.isUserLoggedIn()) {
        Utils.log(`${LOG_TAG}: updateSubscribeTopics: user not logged in -> return`);
        return;
      }
      mUpdateSubscribeTopics();
    },
    updateFcmToken() {
      mRequestPermission()
        .then(() => {
          messaging()
            .getToken()
            .then(async (token) => {
              console.log('123', token);
              this.registerFcmToken(token);
              this.updateSubscribeTopics();
              appsFlyerUninstall(token);
              try {
                if (Platform.OS === 'android') {
                  ReactMoE.passFcmPushToken(token);
                  ReactMoE.passFcmPushPayload({});
                } else {
                  ReactMoE.registerForPush();
                }
              } catch (_) {}

              // }
            });
        })
        .catch((err) => {
          Utils.warn(`${LOG_TAG} updateFcmToken err ${err}: `, err);
        });
    },
    saveFcmToken(fcmToken) {
      const asyncTask = async () => {
        try {
          await AsyncStorage.setItem(AsyncStorageKeys.FCM_TOKEN, fcmToken);
        } catch (error) {
          Utils.warn(`${LOG_TAG}: saveFcmToken error: `, error);
        }
      };
      asyncTask();
    },
    registerFcmToken(fcmToken) {
      const deviceUDID = DeviceInfo.getUniqueId();
      FirebaseFunctions.registerFcmToken(deviceUDID, fcmToken)
        .then((result) => {
          Utils.warn(`${LOG_TAG}: registerFcmToken: success: ${result}`);
        })
        .catch((err) => {
          Utils.warn(`${LOG_TAG}: registerFcmToken: err: ${err}`, err);
        });
    },
    showNotification(notification) {
      // Utils.log(`${LOG_TAG}: showNotification: `, notification);
      if (
        notification.category === NOTIFICATION_CATEGORIES.ADMIN ||
        notification.category === NOTIFICATION_CATEGORIES.SYSTEM
      ) {
        // show noti from Digitel
        store.dispatch(pendingNotification(notification));
      } else if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
        const messageJSON = notification.extraData.chatMessage || {};
        const message = Message.objectFromJSON(messageJSON);
        if (!message) {
          Utils.log(`${LOG_TAG}: showNotification: message is null -> return`);
          return;
        }
        // get thread
        const threadID = message.threadID;
        const currentThread = store.getState().chatThread;
        // show notif if current thread is different
        if (!currentThread || currentThread.uid !== threadID) {
          store.dispatch(pendingNotification(notification));
        }
      }
    },
    handleTapOnNotification(notification = {}) {
      // Utils.log(`${LOG_TAG}: handleTapOnNotification: `, notification);
      // read
      // DatatabaseManager.shared().readNotification(notification);
      // handle

      if (
        notification.type === NOTIFICATION_TYPES.PLAIN_TEXT ||
        notification.type === NOTIFICATION_TYPES.CHANGE_PASS ||
        notification.type === NOTIFICATION_TYPES.EMPLOYEE_CARD ||
        notification.type === NOTIFICATION_TYPES.PLAIN_TEXT_WEB_LINK
      ) {
        // this.showNotification(notification);
        this.mOpenChatBox(notification);
      } else if (notification?.type === NOTIFICATION_TYPES.FEEDBACK) {
        const ticket = notification?.extraData?.ticket;
        store.dispatch(
          homeNavigate('ChatFeedback', {
            screenMode: ticket.status,
            ticket,
          }),
        );
      } else if (
        notification.type === NOTIFICATION_TYPES.OPEN_VIEW ||
        notification.type === NOTIFICATION_TYPES.CONFIRM_CTV
      ) {
        // store.dispatch(
        //   readNoti(notification.category, {
        //     notification,
        //     _id: notification.uid,
        //     uid: notification.uid,
        //   }),
        // );
        const url = notification?.extraData?.url;
        Linking.openURL(url);
      } else if (notification.type === NOTIFICATION_TYPES.WEB_LINK) {
        const title = notification.extraData.screen_title || Strings.alert_title;
        const url = notification?.extraData?.url;
        const unbackableURLs = notification?.extraData?.unbackable_urls;

        // store.dispatch(
        //   readNoti(notification.category, {
        //     notification,
        //     _id: notification.uid,
        //     uid: notification.uid,
        //   }),
        // );

        if (url) {
          store.dispatch(
            homeNavigate('WebView', {
              mode: 0,
              title,
              url,
              unbackableURLs,
            }),
          );
        }
      } else if (notification.type === NOTIFICATION_TYPES.WEB_STACK) {
        const title = notification.extraData.screen_title || Strings.alert_title;
        const urlsStack = notification.extraData.urls_stack;
        const unbackableURLs = notification.extraData.unbackable_urls;

        // store.dispatch(
        //   readNoti(notification.category, {
        //     notification,
        //     _id: notification.uid,
        //     uid: notification.uid,
        //   }),
        // );

        store.dispatch(
          homeNavigate('WebView', {
            mode: 1,
            title,
            urlsStack,
            unbackableURLs,
          }),
        );
      } else if (notification.type === NOTIFICATION_TYPES.NEWS_DETAILS) {
        const news = News.objectFromJSON(notification.extraData.news);
        store.dispatch(homeNavigate('NewsDetails', { news }));
      } else if (notification.type === NOTIFICATION_TYPES.MONEY_HISTORY) {
        store.dispatch(homeNavigate('AvailableMoney', {}));
      } else if (notification.type === NOTIFICATION_TYPES.POINTS_HISTORY) {
        store.dispatch(homeNavigate('AvailablePoints', {}));
      } else if (notification.type === NOTIFICATION_TYPES.CHAT_MESSAGE) {
        // get message
        const messageJSON = notification.extraData.chatMessage || {};
        FlutterService.openChat({
          threadId: messageJSON?.threadID,
        });
        // const message = Message.objectFromJSON(messageJSON);
        // if (!message) {
        //   Utils.log(`${LOG_TAG}: handleTapOnNotification: message is null -> return`);
        //   return;
        // }
        // // get thread
        // const threadID = message.threadID;
        // const threadDB = DatatabaseManager.shared().getObject('Thread', threadID);
        // if (!threadDB) {
        //   Utils.log(`${LOG_TAG}: handleTapOnNotification: thread is null -> return`);
        //   return;
        // }

        // const readTimes = threadDB.readTimes;
        // const userID = store.getState().myUser.uid;
        // let myReadTime = readTimes[`user_${userID}`];
        // if (!myReadTime) {
        //   myReadTime = 0;
        // }

        // store.dispatch(getNewChatMess(threadID, myReadTime));
        // // is currently open a chat
        // const shouldOpenChatScreen = store.getState().chatThread === null;
        // // reset chat
        // store.dispatch(closeChat());
        // store.dispatch(openChatWithThread(threadDB));
        // // navigate if needed
        // if (shouldOpenChatScreen) {
        //   store.dispatch(homeNavigate('Chat', {}));
        // } else {
        //   store.dispatch(loadChatMessages(12));
        // }
      } else if (notification.type === NOTIFICATION_TYPES.OPEN_VIEW) {
        // store.dispatch(
        //   readNoti(notification.category, {
        //     notification,
        //     _id: notification.uid,
        //     uid: notification.uid,
        //   }),
        // );

        let url = notification?.extraData?.url;
        if (!url) return;
        // parse to join group
        if (url.startsWith(EndpointJoinGroupMfast)) {
          const threadID = url.split('/')?.[3];
          url = `${DeepLinkPaths.JOIN_GROUP}?threadID=${threadID}`;
        }
        Linking.openURL(url);
      }
    },
    deinitMessaging() {
      rootScreen = null;
      mDeinitMessaging();
    },

    mOpenChatBox(notification) {
      const thread =
        notification.category === NOTIFICATION_CATEGORIES.ADMIN
          ? SystemThread.adminThread()
          : SystemThread.systemThread();
      store.dispatch(homeNavigate('ChatBox', { thread }));
    },
  };
}

// --------------------------------------------------

function initSingletonNotificationManager() {
  let instance;
  return {
    reset() {
      // Utils.log(`${LOG_TAG}: initSingletonNotificationManager -> reset `);
      instance = null;
    },
    shared() {
      if (!instance) {
        // Utils.log(`${LOG_TAG}: initSingletonNotificationManager -> init new instance `);
        instance = initNotificationManager();
      }
      return instance;
    },
    resetFirebase() {
      messaging()
        .deleteToken()
        .then(() => {
          Utils.log(`${LOG_TAG}: resetFirebaseInstanceID: ok`);
        })
        .catch((err) => {
          Utils.warn(`${LOG_TAG}: resetFirebaseInstanceID: err: ${err}`, err);
        });
      // instance.saveFcmToken('');
    },
  };
}

// --------------------------------------------------

const NotificationManager = initSingletonNotificationManager();
export default NotificationManager;

// OLD CODES
// --------------------------------------------------

// Disable -> Because Digitel backend doesn't need fcmToken yet
// registerPushNotification(fcmToken) {
//   if (!this.isUserLoggedIn()) { return; }
//   const deviceUDID = DeviceInfo.getUniqueId();
//   const deviceType = DeviceInfo.getDeviceId();
//   const os = Platform.OS;
//   const osVersion = DeviceInfo.getSystemVersion();
//   store.dispatch(registerFirebaseToken(fcmToken, deviceUDID, deviceType, os, osVersion));
// },
// --
