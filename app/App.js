import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupBox from 'app/common/PopupBox';
import 'app/constants/reactotron';
import Strings from 'app/constants/strings';
import { User } from 'app/models';
import RootScreen from 'app/screens2/Root/RootScreen';
import KeychainWrapper from 'app/utils/KeychainWrapper';
import { now } from 'moment';
import moment from 'moment/min/moment-with-locales';
import React, { Component } from 'react';
import { Alert, AppState, Linking, Platform, StatusBar, Text, TextInput, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import branch from 'react-native-branch';
import codePush from 'react-native-code-push';
import Communications from 'react-native-communications';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import ReactMoE, { MoEAppStatus, MoEngageLogConfig, MoEngageLogLevel } from 'react-native-moengage';
import NotificationPopup from 'react-native-push-notification-popup';
import { Provider } from 'react-redux';
import '../global';
import ServiceCenter from './center/ServiceCenter';
import ForceUpdateBox from './components2/ForceUpdateBox';
import ForceLogoutPopup from './componentV3/ForceLogoutPopup';
import Loading from './componentV3/LoadingModal';
import {
  TestConfigs,
  AppInfoDefault,
  DEEP_LINK_BASE_URL,
  EndpointJoinGroupMfast,
  Configs,
} from './constants/configs';
import { AsyncStorageKeys, TrackingEvents } from './constants/keys';
// import NotificationManager from './manager/NotificationManager';
import DigitelClient from './network/DigitelClient';
import {
  fetchAppData,
  myUser,
  switchRootScreenToLogin,
  homeNavigate,
  updateAppInfo,
  pendingOpenDeepLink,
  setupUserAndGotoMain,
  checkSystemStatus,
  logout,
} from './redux/actions';

import { getPopupBrand } from './redux/actions/popup';
import componentWithTracker from './screens/Tracker';
import CustomModal from './screenV3/CustomModal';
import DeepLinkCenter from './screenV3/Home/DeepLinkCenter';
import Smartlook from 'smartlook-react-native-wrapper';

import DatabaseManager from 'app/manager/DatabaseManager';

import { checkAndRequestPostNotification, checkLocation } from './utils/Permission';

import ChatCenter from './submodules/firebase/manager/ChatCenter';

import { checkAndRequestPermissionLocation } from './utils/LocationUtil';
// --------------------------------------------------
import BroadcastManager from './submodules/firebase/manager/BroadcastManager';
import Utils, { compareVersion, getAppVersion, parseURL } from './utils/Utils';
import NotificationManager from './manager/NotificationManager';
import { IMAGE_PATH } from './assets/path';
import store, { persistor } from './redux/store/store';
import notifee, { EventType } from '@notifee/react-native';
import '../global';
import { logEvent, logEventWithAttibute } from './tracking/Firebase';
import { updateUserMetaStep } from './redux/actions/actionsV3/userMetaData';
import { initAppsFlyers } from './utils/AppsFlyers';
import tracker, { ACTION, EVENT, SCREEN } from './tracking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import appsFlyer from 'react-native-appsflyer';
import { PersistGate } from 'redux-persist/integration/react';
import Colors from './theme/Color';
const LOG_TAG = 'App.js';
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
import { RootSiblingParent } from 'react-native-root-siblings';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { showDevAlert } from './utils/UIUtils';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { listenPopupMoengage, removeListenPopupMoengage } from './utils/callbackPopupMoengage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdateMessageBoxVisible: false,
      isUpdateMessageBoxVisiblev2: false,
      updateInfo: {},
      updateMessageBoxTitle: '',
      updateMessageBoxDetails: '',
      popupInfo: {},
      isPopupBoxVisible: false,
      showNotiPayload: false,
      notiPayload: '',
      showPopupLogout: false,
      isUpdatingCodepush: false,
      showPopupCodepush: false,
      showCustomModal: false,
      isMandatoryCodepush: false,
    };
    if (Text.defaultProps == null) {
      Text.defaultProps = {};
    }
    if (TextInput.defaultProps == null) {
      TextInput.defaultProps = {};
    }
    TextInput.defaultProps.allowFontScaling = false;
    Text.defaultProps.allowFontScaling = false;

    this.unSubcribeListenMoengageNotiBackground = null;

    this.deepLinkCenter = new DeepLinkCenter({
      navigation: this.props.navigation,
    });
  }
  //   // const { whyDidYouUpdate } = require('why-did-you-update');
  //   // whyDidYouUpdate(React);
  // }
  async componentDidMount() {
    const myDeviceInfo = DeviceInfo.getUniqueId();
    // BroadcastManager.shared().addObserver('check_codepush', this, () => {
    //   this.checkUpdateCodePush();
    // });

    BroadcastManager.shared().addObserver('CHECK_POPUP_CODE_PUSH', this, () => {
      this.checkShowPopupCodePush();
    });
    Smartlook.setupAndStartRecording({
      smartlookAPIKey: 'bd990a5e397d4a5429b80b1c488410df9ce28870',
      startNewSessionAndUser: true,
      fps: 10,
    });
    if (myDeviceInfo === 'C02B3928-13C2-4621-A22E-9DA986FFAC2B') {
      setTimeout(() => {
        Smartlook.isRecording()
          .then((value) => {
            Alert.alert('is record', JSON.stringify(value));
          })
          .catch((error) => {
            Alert.alert('is error', JSON.stringify(error));
          });
      }, 4000);
    }
    initAppsFlyers();

    branch.subscribe(({ error, params, uri }) => {
      if (error) {
        console.log('error la gi', error);
        // return;
      }
    });

    setTimeout(() => {
      this.checkRefCode();
    }, 2500);
    BroadcastManager.shared().addObserver('show_popup_force_logout', this, () => {
      this.setState({
        showPopupLogout: true,
      });
    });

    this.checkAppVersionv2();
    setTimeout(() => {
      this.checkForPopup();
    }, 5000);
    // app state
    this.currentAppState = AppState.currentState;
    AppState.addEventListener('change', this.handleAppStateChange);

    // open app from url
    Linking.getInitialURL().then((url) => {
      // wait a bit when app first start
      setTimeout(() => {
        this.handleOpenURL(url);
      }, 2000);
    });
    Linking.addEventListener('url', (event) => {
      this.handleOpenURL(event.url);
    });

    setTimeout(() => {
      store.dispatch(checkSystemStatus());
    });
    // init & start
    this.initApp()
      .then(this.startApp)
      .catch((err) => {
        console.log('@@@@', err);
      });
    try {
      listenPopupMoengage();
      ReactMoE.initialize(Configs.moengageKey);
      ReactMoE.showInApp();
    } catch (_) {}
    NotificationManager.shared();

    this.unSubcribeListenMoengageNotiForeground = messaging().onMessage((payload) => {
      if (this.popup && Platform.OS === 'ios') {
        if (
          payload?.data?.moengage &&
          payload?.data?.moengage?.app_id?.length > 0 &&
          this.currentAppState === 'active'
        ) {
          this.popup.show({
            onPress: function () {
              Linking.openURL(payload?.data?.app_extra?.moe_deeplink);
              // if (payload?.data?.app_extra?.screenData?.screenName) {
              //   store.dispatch(
              //     homeNavigate(payload?.data?.app_extra?.screenData?.screenName, {
              //       ...payload?.data?.app_extra?.screenData,
              //     }),
              //   );
              // } else {
              //   setTimeout(() => {
              //     const params = {
              //       mode: 0,
              //       title: payload?.data?.app_extra?.screenData?.title,
              //       url: payload?.data?.app_extra?.screenData?.url,
              //       isBackableInside: false,
              //     };
              //     store.dispatch(homeNavigate('WebView', params));
              //   }, 500);
              // }
            },
            appIconSource: IMAGE_PATH.logoMFastNew,
            appTitle: 'MFast',
            timeText: 'Now',
            title: `${payload?.title}`,
            body: `${payload?.body}`,
            slideOutTime: 5000,
          });
        } else {
          return;
        }
      }
    });

    this.unSubcribeListenMoengageNotiBackground = ReactMoE.setEventListener(
      'pushClicked',
      async (payload) => {
        if (Platform.OS === 'ios') {
          if (payload?.data?.payload?.app_extra?.moe_deeplink?.length > 0) {
            const url = payload?.data?.payload?.app_extra?.moe_deeplink;
            // const isDeeplink = await Linking.canOpenURL(url);
            // if(isDeeplink) {
            setTimeout(() => {
              Linking.openURL(url);
            }, 1200);

            // }
            // Linking.openURL(payload?.payload?.app_extra?.moe_deeplink);
            // this.deepLinkCenter.processDeepLink(url);
            //   setTimeout(() => {
            //     store.dispatch(
            //       homeNavigate(payload?.payload?.app_extra?.screenData?.screenName, {
            //         ...payload?.payload?.app_extra?.screenData,
            //       }),
            //     );
            //   }, 200);
            // } else {
            //   setTimeout(() => {
            //     const params = {
            //       mode: 0,
            //       title: payload?.payload?.app_extra?.screenData?.title,
            //       url: payload?.payload?.app_extra?.screenData?.url,
            //       isBackableInside: false,
            //     };
            //     store.dispatch(homeNavigate('WebView', params));
            //   }, 500);
          }
        } else {
          if (payload?.data?.payload?.screenName) {
            setTimeout(() => {
              store.dispatch(homeNavigate(payload?.data?.payload?.screenName, {}));
            }, 200);
          } else {
            setTimeout(() => {
              const params = {
                mode: 0,
                title: payload?.data?.payload?.title,
                url: payload?.data?.payload?.url,
                isBackableInside: false,
              };
              store.dispatch(homeNavigate('WebView', params));
            }, 500);
          }
        }
      },
    );

    this.unSubcribeNotifeeBackground = notifee.onBackgroundEvent(async ({ type, detail }) => {
      showDevAlert(type);
      switch (type) {
        case EventType.PRESS:
          if (detail.notification?.id === 'unread_notification') {
            this.handleOpenURL(`${DEEP_LINK_BASE_URL}://open?view=Notification&isUnread=true`);
          }
          break;
      }
    });

    this.unSubcribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      showDevAlert(type);
      switch (type) {
        case EventType.PRESS:
          if (detail.notification?.id === 'unread_notification') {
            this.handleOpenURL(`${DEEP_LINK_BASE_URL}://open?view=Notification&isUnread=true`);
          }
          break;
      }
    });

    // this.initTest();
    checkAndRequestPostNotification();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    Linking.removeEventListener('url', this.handleOpenURL);
    BroadcastManager.shared().removeObserver('show_popup_force_logout', this);
    BroadcastManager.shared().removeObserver('CHECK_POPUP_CODE_PUSH', this);
    try {
      removeListenPopupMoengage();
    } catch (_) {}
    if (this.unSubcribeListenMoengageNotiBackground) {
      this.unSubcribeListenMoengageNotiBackground();
      this.unSubcribeListenMoengageNotiBackground = null;
    }
    this?.unSubcribeNotifee?.();
    this?.unSubcribeNotifeeBackground?.();
  }

  checkRefCode = async () => {
    let lastParams = await branch.getLatestReferringParams(); // params from last open
    let installParams = await branch.getFirstReferringParams(); // params from original install
    // Alert.alert('getLatestReferringParams', JSON.stringify(lastParams));

    const refCode = lastParams?.rsaCode ? lastParams?.rsaCode : installParams?.rsaCode;

    if (refCode && refCode.length > 0) {
      await AsyncStorage.setItem(AsyncStorageKeys.REFFERAL_CODE, refCode);
      // return;
    } else {
    }
  };

  checkUserIsExpired = () => {
    DigitelClient.getMyUser()
      .then((user) => {})
      .catch((error) => {
        if (
          error?.errorCode === 'INVALID_ACCESS_TOKEN' &&
          DigitelClient.userAccessToken.length !== 0
        ) {
          store.dispatch(logout(false));
        }
      });
  };

  // --------------------------------------------------
  onUpdateMessageBoxCancel = () => {
    this.closeUpdateMessageBox();
  };
  onUpdateMessageBoxOk = () => {
    const appStoreUrl = this.state.updateInfo.appstore;
    if (appStoreUrl) {
      Communications.web(appStoreUrl);
    }
  };
  onPopupBoxCancel = () => {
    this.closePopupBox();
  };
  onPopupBoxYes = (popup) => {
    const { popupInfo } = this.state;
    // close
    this.closePopupBox();
    // api
    if (popupInfo && popupInfo.postID) {
      DigitelClient.readPopup(popupInfo.postID, true);
    }
    // open webview
    setTimeout(() => {
      const params = {
        mode: 0,
        title: popup?.postTitle || '',
        url: popup?.webURL || '',
        isBackableInside: false,
      };
      store.dispatch(homeNavigate('WebView', params));
    }, 500);
  };

  // --------------------------------------------------

  getLocation = () => {
    checkLocation().then((isAuthozied) => {
      if (isAuthozied) {
        this.sendLocation();
      } else {
        this.trackEventRefreshApp();
      }
    });
  };
  sendLocation() {
    checkAndRequestPermissionLocation((location) => {
      if (location && location.latitude) {
        this.trackEventRefreshApp(location);
        tracker.addEvent({
          [EVENT.LAT]: location.latitude,
          [EVENT.LON]: location.longitude,
        });
      }
    });
  }

  trackEventRefreshApp = async (location) => {
    let currentTime = new Date();
    currentTime = currentTime.getTime();
    const lastestTime = await AsyncStorage.getItem(AsyncStorageKeys.LAST_TIME_EVENT_REFRESH);
    if (lastestTime) {
      if (parseInt(lastestTime, 10) + 3600000 < currentTime) {
        DigitelClient.trackEvent(
          TrackingEvents.APP_REFRESH,
          location?.latitude,
          location?.longitude,
        );
        logEvent(TrackingEvents.APP_REFRESH, {
          // latitude: location?.latitude,
          // longitude: location?.longitude,
        });
        await AsyncStorage.setItem(AsyncStorageKeys.LAST_TIME_EVENT_REFRESH, `${currentTime}`);
      }
    } else {
      DigitelClient.trackEvent(TrackingEvents.APP_REFRESH, location?.latitude, location?.longitude);
      logEvent(TrackingEvents.APP_REFRESH, {
        // latitude: location?.latitude,
        // longitude: location?.longitude,
      });
      await AsyncStorage.setItem(AsyncStorageKeys.LAST_TIME_EVENT_REFRESH, `${currentTime}`);
    }
  };

  updateOnlineStatus = (payload) => {
    store.dispatch(updateUserMetaStep(payload));
  };

  getAppsFlyersID = () =>
    new Promise((resolve, reject) => {
      appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
        if (err) {
          resolve('');
          console.error(err);
        } else {
          resolve(appsFlyerUID);
        }
      });
    });

  trackEventLaunchApp = async () => {
    const me = store.getState().myUser;

    let currentTime = new Date();
    currentTime = currentTime.getTime();

    if (me?.isLoggedIn) {
      const dataTracking = {
        user_id: me?.uid,
        phoneNumber: me?.mPhoneNumber,
        fullName: me?.fullName,
        email: me?.email,
      };
      logEventWithAttibute(dataTracking);
      const payload = {
        last_time_login: now(),
        is_online: true,
      };
      this.updateOnlineStatus(payload);
    }
    const lastestTime = await AsyncStorage.getItem(AsyncStorageKeys.LAST_TIME_EVENT_LAUNCH);
    const myDeviceInfo = await DeviceInfo.getUniqueId();
    const appsFlyersID = await this.getAppsFlyersID();

    const extraParams = {
      deviceID: myDeviceInfo,
      appsFlyersID,
    };

    if (lastestTime) {
      try {
        ReactMoE.setAppStatus(MoEAppStatus.Update);
      } catch (_) {}
      if (parseInt(lastestTime, 10) + 3600000 < currentTime) {
        logEvent(TrackingEvents.APP_LAUNCH, { rsmLevel: me?.rsmRSALevelName });
        if (me?.isLoggedIn) {
          DigitelClient.trackEvent(
            TrackingEvents.APP_LAUNCH,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            extraParams,
          );
          await AsyncStorage.setItem(AsyncStorageKeys.LAST_TIME_EVENT_LAUNCH, `${currentTime}`);
        }
      }
    } else {
      try {
        ReactMoE.setAppStatus(MoEAppStatus.Install);
      } catch (_) {}
      logEvent(TrackingEvents.APP_LAUNCH, { rsmLevel: me?.rsmRSALevelName });
      if (me?.isLoggedIn) {
        DigitelClient.trackEvent(
          TrackingEvents.APP_LAUNCH,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          extraParams,
        );
        await AsyncStorage.setItem(AsyncStorageKeys.LAST_TIME_EVENT_LAUNCH, `${currentTime}`);
      }
    }
  };

  // --------------------------------------------------

  handleAppStateChange = async (nextAppState) => {
    if (Platform.OS === 'ios') {
      if (nextAppState === 'inactive') {
        global.isReloadWebview = true;
        const payload = {
          last_time_login: now(),
          is_online: false,
        };
        this.updateOnlineStatus(payload);
      }

      if (nextAppState === 'active') {
        check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((granted) => {
          if (granted === RESULTS.DENIED) {
            request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
          }
        });
      }

      if (this.currentAppState === 'background' && nextAppState === 'active') {
        tracker.addEvent({
          [EVENT.ACTION_ID]: ACTION.OPEN_BACKGROUND,
          [EVENT.SCREEN_ID]: SCREEN.APP,
        });
      } else if (this.currentAppState === 'inactive' && nextAppState === 'background') {
        tracker.addEvent({
          [EVENT.ACTION_ID]: ACTION.GO_BACKGROUND,
          [EVENT.SCREEN_ID]: SCREEN.APP,
        });
      }

      if (this.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
        this.checkUpdateCodePush();
        const me = store.getState().myUser;
        if (!me?.accessToken?.length) {
          Utils.log(`${LOG_TAG}.handleAppStateChange: user haven't login login -> return`);
          return;
        }
        ChatCenter.shared().goOnline();
        // check for update
        setTimeout(() => {
          this.checkAppVersionv2();
          BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.EVENT.RELOAD_CUTOMER);
          BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.EVENT.RELOAD_COL);
        }, 1500);

        setTimeout(() => {
          const payload = {
            last_time_login: now(),
            is_online: true,
          };
          this.updateOnlineStatus(payload);
        }, 5000);
        // update data
        setTimeout(() => {
          store.dispatch(fetchAppData());
        }, 10);

        // work around for slow init firebase
        try {
          const asyncTaskFb = async () => {
            await auth().currentUser.getIdToken();
          };
          asyncTaskFb();
        } catch (err) {}

        setTimeout(() => {
          store.dispatch(checkSystemStatus());
        });
      }
      this.currentAppState = nextAppState;
    } else {
      if (nextAppState === 'background') {
        const payload = {
          last_time_login: now(),
          is_online: false,
        };
        this.updateOnlineStatus(payload);
        global.isReloadWebview = true;
        tracker.addEvent({
          [EVENT.ACTION_ID]: ACTION.GO_BACKGROUND,
          [EVENT.SCREEN_ID]: SCREEN.APP,
        });
      }
      if (this.currentAppState === 'background' && nextAppState === 'active') {
        tracker.addEvent({
          [EVENT.ACTION_ID]: ACTION.OPEN_BACKGROUND,
          [EVENT.SCREEN_ID]: SCREEN.APP,
        });
      }
      if (this.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
        this.checkUpdateCodePush();
        const me = store.getState().myUser;
        if (!me?.accessToken?.length) {
          Utils.log(`${LOG_TAG}.handleAppStateChange: user haven't login login -> return`);
          return;
        }
        ChatCenter.shared().goOnline();
        // check for update
        setTimeout(() => {
          this.checkAppVersionv2();
          BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.EVENT.RELOAD_CUTOMER);
          BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.EVENT.RELOAD_COL);
        }, 1500);

        setTimeout(() => {
          const payload = {
            last_time_login: now(),
            is_online: true,
          };
          this.updateOnlineStatus(payload);
        }, 5000);
        // check for popup
        // setTimeout(() => {
        //   this.checkForPopup();
        // }, 3000);
        // tracking

        // update data
        setTimeout(() => {
          store.dispatch(fetchAppData());
        }, 10);

        // work around for slow init firebase
        try {
          const asyncTaskFb = async () => {
            await auth().currentUser.getIdToken();
          };
          asyncTaskFb();
        } catch (err) {}

        setTimeout(() => {
          store.dispatch(checkSystemStatus());
        });
      }
      this.currentAppState = nextAppState;
    }
  };
  handleOpenURL = (url) => {
    // Utils.warn(`${LOG_TAG}: handleOpenURL: ${url}`);
    // check url
    if (
      !url ||
      !(url.startsWith(`${DEEP_LINK_BASE_URL}://`) || url.startsWith(EndpointJoinGroupMfast))
    ) {
      return;
    }
    // // check user login
    // const me = store.getState().myUser;
    // if (!(me && me.uid && me.accessToken && me.accessToken.length > 0)) {
    //   return;
    // }
    // parse & handle
    setTimeout(() => {
      const results = parseURL(url);
      store.dispatch(pendingOpenDeepLink(results.path, results.params));
    }, 0);
  };
  // --------------------------------------------------
  initApp() {
    let app;
    moment.locale('vi');
    ChatCenter.shared();
    ServiceCenter.shared();

    this.initAnimatable();

    if (!firebase.apps.length) {
      app = firebase.initializeApp();
    }
    app = new Promise((resolve) => resolve(firebase.app()));
    return app;
  }

  initAnimatable = () => {
    const makeSlideInTranslation = (translationType, fromValue) => ({
      from: {
        [translationType]: fromValue,
      },
      to: {
        [translationType]: 0,
      },
    });

    const makeSlideOutTranslation = (translationType, fromValue) => ({
      from: {
        [translationType]: 0,
      },
      to: {
        [translationType]: fromValue,
      },
    });

    const slideInRight24 = makeSlideInTranslation('translateX', 16);
    const slideOutRight24 = makeSlideOutTranslation('translateX', 16);

    const zoomFadeOut = {
      from: {
        opacity: 1,
        scale: 1,
      },
      to: {
        opacity: 0,
        scale: 1.6,
      },
    };

    Animatable.initializeRegistryWithDefinitions({
      slideInRight24,
      slideOutRight24,
      zoomFadeOut,
    });
  };

  initTest() {
    if (TestConfigs.isTestDatabase) {
      // DatabaseManager.shared().doDeleteDatabase();
    }
  }
  startApp = () => {
    // load save account & start app
    const asyncTask = async () => {
      const user = await this.loadSavedAccount();
      if (
        user &&
        user.fullName &&
        user.accessToken &&
        user.accessToken.length > 0 &&
        user.accessToken !== 'notoken'
      ) {
        // login with saved account
        // Utils.log(`${LOG_TAG}: loadSavedAccount: `, user);
        setTimeout(() => {
          store.dispatch(myUser(user));
        }, 10);
        // store.dispatch(loginWithToken(user.accessToken));
        setTimeout(() => {
          store.dispatch(getPopupBrand());
        }, 1000);
        // add crashlytics info
        // Crashlytics.setUserName(user.uid || 'N/A');
        // Crashlytics.setUserEmail(user.email || 'N/A');
        store.dispatch(setupUserAndGotoMain(user));
      } else {
        store.dispatch(switchRootScreenToLogin());
      }
    };
    asyncTask();
    // check codepush
    setTimeout(() => {
      this.checkUpdateCodePush();
    }, 200);
    // check for popup
    setTimeout(() => {
      this.checkForPopup();
      this.trackEventLaunchApp();
    }, 3000);

    // work around for slow init firebase
    // const asyncTaskFb = async () => {
    // firebase.auth().currentUser.getToken();
    // };
    // asyncTaskFb();
  };
  checkUpdateCodePush() {
    const isAdminId = store.getState()?.myUser?.uid === '1240626961';
    codePush.checkForUpdate().then((update) => {
      if (!__DEV__ && ((update?.isMandatory && update) || (isAdminId && update))) {
        // this.setState(
        //   {
        //     isMandatoryCodepush: update?.isMandatory,
        //   },
        //   () => {
        this.updateCodePush();
        // },
        // );
      } else {
        return;
      }
    });
  }

  updateCodePush = () => {
    codePush?.sync(
      {
        installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
        mandatoryInstallMode: codePush.InstallMode.ON_NEXT_SUSPEND,
      },
      (status) => {
        switch (status) {
          case codePush.SyncStatus.UPDATE_INSTALLED:
            setTimeout(() => {
              this.setState({
                showPopupCodepush: true,
              });
            }, 200);

            break;
          case codePush.SyncStatus.UNKNOWN_ERROR:
            this.checkUpdateCodePush();
            break;
          default: {
          }
        }
      },
      (progress) => {
        console.log('\u001B[36m -> file: App.js:828 -> progress', progress);
      },
    );
  };

  checkShowPopupCodePush() {
    codePush
      .getUpdateMetadata(codePush.UpdateState.PENDING)
      .then((updateMetadata) => {
        if (updateMetadata?.isPending) {
          setTimeout(() => {
            this.setState({
              showPopupCodepush: true,
            });
          }, 200);
        }
      })
      .catch((err) => {
        console.log('checkShowPopupCodePush', err);
      });
  }

  updateAppInfo(appInfo) {
    let appInfoValue = appInfo;
    if (appInfoValue === undefined || appInfoValue === null) {
      appInfoValue = AppInfoDefault;
    }
    store.dispatch(updateAppInfo(appInfoValue));
  }

  checkAppVersion(appInfo) {
    // Utils.log(`${LOG_TAG} checkAppVersion: `, appInfo);

    // check app info
    if (!appInfo) {
      return;
    }

    // check build info
    const updateInfo = Platform.OS === 'ios' ? appInfo.ios : appInfo.android;
    if (!updateInfo) {
      return;
    }

    // check version
    const newestVersion = updateInfo.version;
    const currentVersion = getAppVersion();
    if (newestVersion && newestVersion !== currentVersion) {
      if (compareVersion(currentVersion, newestVersion) < 0) {
        // this.showUpdateMessageBox(updateInfo);
      }
    }
  }

  checkAppVersionv2 = () => {
    // Utils.log(`${LOG_TAG} checkAppVersion: `, appInfo);
    // check version
    const currentVersion = getAppVersion();
    DigitelClient.getAppUpdateMfast(currentVersion).then((updateInfo) => {
      this.showUpdateMessageBoxv2(updateInfo.getInfo(Platform.OS));
    });
  };

  checkForPopup() {
    // user must logged in
    if (!DigitelClient.userID || DigitelClient.userID.length === 0) {
      Utils.log(`${LOG_TAG}.checkForPopup: user haven't log in -> return`);
      return;
    }
    // update is not showing
    if (this.state.isUpdateMessageBoxVisible || this.state.isUpdateMessageBoxVisiblev2) {
      Utils.log(`${LOG_TAG}.checkForPopup: update message box is showing -> return`);
      return;
    }
    // get pop-up
    DigitelClient.getPopup()
      .then((popupInfo) => {
        if (!popupInfo) {
          Utils.log(`${LOG_TAG}.checkForPopup: don't have pop-up -> return`);
          return;
        }
        this.showPopupBox(popupInfo);
      })
      .catch((err) => {
        Utils.warn(`${LOG_TAG}.checkForPopup: get popup error: `, err);
      });
  }
  // --------------------------------------------------
  async loadSavedAccount() {
    try {
      const json = await AsyncStorage.getItem(AsyncStorageKeys.MY_USER);
      if (!json) {
        return null;
      }
      const userJson = JSON.parse(json);
      const user = Object.assign(new User(), userJson);

      if (user.accessToken === '' || user.accessToken === 'notoken') {
        user.accessToken = await KeychainWrapper.getToken();
      }

      return user;
    } catch (error) {
      Utils.warn(`${LOG_TAG}: loadSavedAccount error: `, error);
      return null;
    }
  }
  async loadSavedAppInfo() {
    try {
      const json = await AsyncStorage.getItem(AsyncStorageKeys.APP_INFO);
      if (!json) {
        return null;
      }
      return JSON.parse(json);
    } catch (error) {
      Utils.warn(`${LOG_TAG}: loadSavedAppInfo error: `, error);
      return null;
    }
  }
  showUpdateMessageBox(updateInfo) {
    // Utils.log(`${LOG_TAG} showUpdateMessageBox: `, updateInfo);

    const isForceToUpdate = updateInfo.forceToUpdate || false;
    const forceUpdateMessage = isForceToUpdate ? `\n\n${Strings.app_force_update}` : '';
    const title = `MFast đã có phiên bản mới: ${updateInfo.version}`;
    const details = `${updateInfo.details}${forceUpdateMessage}`;

    this.setState({
      isUpdateMessageBoxVisible: true,
      updateMessageBoxTitle: title,
      updateMessageBoxDetails: details,
      updateInfo,
    });
  }

  showUpdateMessageBoxv2(updateInfo) {
    if (!updateInfo.isShowUpdate) {
      return;
    }
    const isForceToUpdate = updateInfo.forceToUpdate;
    const forceUpdateMessage = isForceToUpdate ? `\n\n${Strings.app_force_update}` : '';
    const title = `MFast đã có phiên bản mới ${updateInfo.version}`;
    const details = `${updateInfo.message}${forceUpdateMessage}`;

    this.setState({
      isUpdateMessageBoxVisiblev2: updateInfo.isShowUpdate,
      updateMessageBoxTitle: title,
      updateMessageBoxDetails: details,
      updateInfo,
    });
  }
  closeUpdateMessageBox() {
    this.setState({
      isUpdateMessageBoxVisible: false,
      isUpdateMessageBoxVisiblev2: false,
    });
  }
  showPopupBox(popupInfo) {
    // show
    this.setState({
      popupInfo,
      isPopupBoxVisible: true,
    });
    // read
    if (popupInfo && popupInfo.postID) {
      DigitelClient.readPopup(popupInfo.postID);
    }
  }
  closePopupBox() {
    this.setState({
      isPopupBoxVisible: false,
    });
  }

  restartApp() {
    // this.setState(
    //   {
    //     showPopupCodepush: false,
    //   },
    // () => {
    console.log('restart app');
    codePush.restartApp();
    //   },
    // );
  }

  renderUpdateMessageBoxCodePush() {
    return (
      <CustomModal isVisible={this.state.showPopupCodepush}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ForceUpdateBox
            title={'MFast vừa có bản cập nhật mới'}
            message={'Vui lòng cập nhật để tiếp tục sử dụng dịch vụ'}
            rightButtonTitle={'Cập nhật ngay'}
            onRightButtonPress={this.restartApp}
            leftButtonTitle={''}
            // onLeftButtonPress={() => {
            //   this.setState({
            //     showPopupCodepush: false,
            //   });
            // }}
            // isForceToUpdate={true}
          />
        </View>
      </CustomModal>
    );
  }
  // --------------------------------------------------
  renderUpdateMessageBox() {
    const {
      updateInfo,
      isUpdateMessageBoxVisible,
      isUpdateMessageBoxVisiblev2,
      updateMessageBoxTitle,
      updateMessageBoxDetails,
    } = this.state;
    const isUpdate = isUpdateMessageBoxVisible || isUpdateMessageBoxVisiblev2;
    if (!isUpdate) {
      return null;
    }

    const isForceToUpdate = updateInfo?.forceToUpdate;
    if (isForceToUpdate) {
      return (
        <Modal isVisible={isUpdate} useNativeDriver animationIn="zoomIn" animationOut="zoomOut">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ForceUpdateBox
              title={updateMessageBoxTitle}
              message={updateMessageBoxDetails}
              leftButtonTitle={''}
              version={updateInfo?.version || ''}
              rightButtonTitle={'Cập nhật ngay'}
              rightButtonTitleStyle={{ color: Colors.primary2 }}
              onRightButtonPress={this.onUpdateMessageBoxOk}
              isForceToUpdate={isForceToUpdate}
            />
            <View style={{ height: 44 }} />
          </View>
        </Modal>
      );
    }
    return (
      <Modal isVisible={isUpdate} useNativeDriver animationIn="zoomIn" animationOut="zoomOut">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ForceUpdateBox
            title={updateMessageBoxTitle}
            message={updateMessageBoxDetails}
            leftButtonTitle={'Để sau'}
            leftButtonTitleStyle={{ color: '#8D8D8D' }}
            onLeftButtonPress={this.onUpdateMessageBoxCancel}
            rightButtonTitle={'Cập nhật ngay'}
            rightButtonTitleStyle={{ color: Colors.primary2 }}
            onRightButtonPress={this.onUpdateMessageBoxOk}
          />
          <View style={{ height: 44 }} />
        </View>
      </Modal>
    );
  }
  handleLogoutSuccess = () => {
    this.setState({
      showPopupLogout: false,
    });
  };
  renderPopupLogout = () => {
    return (
      <Modal
        isVisible={this.state.showPopupLogout}
        useNativeDriver
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <ForceLogoutPopup onLogoutSuccess={this.handleLogoutSuccess} />
      </Modal>
    );
  };
  renderPopupBox = () => {
    return (
      <Modal
        isVisible={this.state.isPopupBoxVisible}
        useNativeDriver
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <PopupBox
            popup={this.state.popupInfo}
            onCancelPress={this.onPopupBoxCancel}
            onYesPress={this.onPopupBoxYes}
          />
          <View style={{ height: 44 }} />
        </View>
      </Modal>
    );
  };
  // --------------------------------------------------
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <RootSiblingParent>
              <View style={{ flex: 1, backgroundColor: '#0000' }}>
                <StatusBar barStyle="dark-content" />
                <RootScreen />
                {this.renderUpdateMessageBox()}
                {this.renderPopupBox()}
                {this.renderPopupLogout()}
                {this.renderUpdateMessageBoxCodePush()}
                <NotificationPopup ref={(ref) => (this.popup = ref)} />
                <Loading visible={this.state.isUpdatingCodepush} />
              </View>
            </RootSiblingParent>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}

const TrackingApp = componentWithTracker(App, SCREEN.APP);
const MFastApp = codePush(codePushOptions)(TrackingApp);

export default MFastApp;
