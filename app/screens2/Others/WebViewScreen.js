/* eslint-disable react-native/no-inline-styles */
/**
 *
 * A webview container
 * which override back button to back in web incase the url change
 * params: mode, url, urlsStack
 * -> mode: 0: default -> only load the url
 * -> mode: 1: stack -> load all urls in urlsStack in order, the last item will be one display
 */

import Strings from 'app/constants/strings';
import Styles from 'app/constants/styles';
import hmacSHA512 from 'crypto-js/hmac-sha512';
// share
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  Linking,
  NativeEventEmitter,
  Platform,
  SafeAreaView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import * as Progress from 'react-native-progress';
import VnpayMerchant, { VnpayMerchantModule } from 'react-native-vnpay-merchant';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import KJButton from '../../components/common/KJButton';
import BottomActionSheet from '../../components2/BottomActionSheet';
import AppText from '../../componentV3/AppText';
import {
  Configs,
  DEEP_LINK_BASE_URL,
  isDevelopment,
  isStaging,
  LIST_WEBVIEW_DISABLE_CUSTOM_BACK,
  MFConfigs,
} from '../../constants/configs';
import { SH, SW } from '../../constants/styles';
import SystemThread from '../../models/SystemThread';
import { ERROR_CODE } from '../../network/ErrorCode';
import { openLogin } from '../../redux/actions/navigation';
import {
  LIST_CTV_FUNCTION,
  LIST_CTV_FUNCTION_WITHOUT_RSM,
} from '../../screenV3/AccountSetting/AccountSetting.constant';
import DeepLinkCenter from '../../screenV3/Home/DeepLinkCenter';
import HomeActionSheet, { ITEM_IDS } from '../../screenV3/Home/HomeActionSheet';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import { closeChat } from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import { logEvent } from '../../tracking/Firebase';
import { backAndroidHandler, removeBackAndroidHandler } from '../../utils/BackButtonAndroid';
import ImageUtils from '../../utils/ImageUtils';
import InAppReview from '../../utils/inAppReview';
import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';
// import { flyersTrackEvent } from '../../utils/AppsFlyers';
import { shareNewFeedFacebook, shareNewFeedZalo } from '../../utils/shareSocial';
import Utils, {
  checkInWhileList,
  checkUrlOpenBrowser,
  getAppVersion,
  getDeviceTrackingInfo,
  isDeepLink,
  isNeedAccessToken,
  IS_ANDROID,
  parseURL,
  sortObject,
} from '../../utils/Utils';
import { PhotoPicker } from '../CustomPhotoPicker';
import { defaultNavOptions } from '../Root/MainScreen';
import {
  BACK_TO_HOME,
  BROAD_CAST_DATA_KEY,
  CAMERA_PICKER_KEY,
  CLOSE_WEBVIEW,
  CONFIG_KEY,
  CONTACT_KEY,
  CONTACT_PHONE_KEY,
  CUSTOM_BACK_KEY,
  GET_DEVICE_ID,
  HIDE_NAVIGATION_KEY,
  INJECT_FUNC,
  IN_APP_REVIEW,
  LOCATION_KEY,
  LOG_EVENT,
  MB_SHARE_CLICK,
  NUMBER_BACK_KEY,
  ON_BACK_KEY,
  OPEN_BROWSER,
  OPEN_MOMO,
  OPEN_SCREEN_APP,
  OPEN_VN_PAY,
  OPEN_WEBVIEW,
  PHOTO_PICKER_KEY,
  SHARE_FACEBOOK,
  SHARE_ZALO,
  TITLE_KEY,
  RELOAD_WEBVIEW,
} from './CommunicationKey';
// --------------------------------------------------
// WebViewScreen
// --------------------------------------------------
// import { flyersTrackEvent } from '../../utils/AppsFlyers';

import ErrorHttpView from './ErrorHttpView';
import { checkAndRequestPermission, PERMISSION_CHECK } from '../../utils/permissionV3';
import strings from '../../constants/strings';
import { getContacts } from '../../utils/dataTrackingAgennt';
import FlutterService from '../../screenV3/Home/FlutterService';

const _ = require('lodash');

export const WebViewScreenMode = {
  NORMAL: 0, 
  STACK: 1,
};

const BACK_MODE = {
  NONE: 'NONE',
  HIDDEN: 'HIDDEN',
  NORMAL: 'NORMAL',
  CUSTOM: 'CUSTOM',
  CUSTOM_URL: 'CUSTOM_URL',
};

const CLOSE_MODE = {
  NONE: 'NONE',
  NORMAL: 'NORMAL',
};

export const ERROR_TYPE = {
  LOGIN_REQUIRED: 'LOGIN_REQUIRED',
  BAD_NETWORK: 'BAD_NETWORK',
  ERROR_NETWORK: 'ERROR_NETWORK',
};

// setTimeout(() => {
//   this.props.navigation.navigate({
//     routeName: 'WebView',
//     params: { mode: 0, title: 'test', url: 'https://www.google.com' },
//     key: 'https://www.google.com'
//   });
// }, 6000);

// setTimeout(() => {
//   const test = `
//     window.ReactNativeWebView.postMessage(JSON.stringify({key: 'BROAD_CAST_DATA_KEY', data: "{label: 'test'}"}));
//     ;true;
// `;
//   this.webView.injectJavaScript(test);
// }, 4000);

// setTimeout(() => {
//   const test = `
//     window.ReactNativeWebView.postMessage(JSON.stringify({key: 'CAMERA_PICKER_KEY', data: {}}));
//     ;true;
// `;
//   this.webView.injectJavaScript(test);
// }, 1000);

// setTimeout(() => {
//   Linking.openURL('mfastmobile://goback');
//   setTimeout(() => {
//     Linking.openURL('mfastmobile://open?view=home_shop');
//   }, 100);
// }, 1000);
// setTimeout(() => {
//   Linking.openURL('mfastmobile://open_ctv');
// }, 1000);
// setTimeout(() => {
//   const test = `
//     window.ReactNativeWebView.postMessage(JSON.stringify({key: 'CAMERA_PICKER_KEY', data: {
//       width: 300,
//       height: 260,
//       cameraTitleHtml: '<p style="color: #fff; text-align: center">(Di chuyển MẶT TRƯỚC vào giữa khung chụp. Hình Bắt buộc phải hiển thị <strong style="color: #ff5252">đầy đủ 4 góc</strong>, rõ nét và không bị nhoè)</p>',
//       cameraDetailHtml: '<p style="color: #fff">(Di chuyển MẶT TRƯỚC vào giữa khung chụp. Hình Bắt buộc phải hiển thị <strong style="color: #ff5252">đầy đủ 4 góc</strong>, rõ nét và không bị nhoè)</p>'
//     }}));
//     ;true;
// `;
//   this.webView.injectJavaScript(test);
// }, 1000);

// setTimeout(() => {
//   const payload = vnpayTestPayload();
//   const test = `
//     window.ReactNativeWebView.postMessage(JSON.stringify({key: 'OPEN_VN_PAY', data: ${JSON.stringify(payload)} }));
//     ;true;
// `;
// //   const test = `
// //   window.ReactNativeWebView.postMessage(JSON.stringify({key: 'CAMERA_PICKER_KEY', data: {}}));
// //   ;true;
// //  `;
// 	console.log("TCL: WebViewScreen -> componentDidMount -> test", test)
//   this.webView.injectJavaScript(test);
// }, 2000);
// setTimeout(() => {
//   const payload = vnpayTestPayload();
//   const test = `
//     window.ReactNativeWebView.postMessage(JSON.stringify({key: 'OPEN_VN_PAY', data: ${JSON.stringify(payload)} }));
//     ;true;
// `;
// 	console.log("TCL: WebViewScreen -> componentDidMount -> test", test)
//   this.webView.injectJavaScript(test);
// }, 2000);
const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

const WrapperContainer = ({ isSafeAreaView = false, children }) => {
  if (isSafeAreaView) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    );
  }
  return <View style={styles.container}>{children}</View>;
};
class WebViewScreen extends Component {
  constructor(props) {
    super(props);

    this.title = '';
    if (this.props.navigation || this.props.params) {
      const params = this.props.navigation.state.params || this.props.params;
      const mode = params.mode || 0;

      const webURL = params.url || '';
      const webURLsStack = params.urlsStack || [];
      // is support back inside webview, default is true
      const isBackableInside =
        params.isBackableInside !== undefined && params.isBackableInside !== null
          ? params.isBackableInside
          : true;
      // don't allow web back if current url in unbackableURLs
      const unbackableURLs = params.unbackableURLs || [];
      if (unbackableURLs.length === 0) {
        if (mode === WebViewScreenMode.NORMAL) {
          unbackableURLs.push(webURL);
        }
        if (mode === WebViewScreenMode.STACK) {
          unbackableURLs.push(webURLsStack[webURLsStack.length - 1]);
        } 
      }

      this.callbackBackEvent = params.callbackBackEvent;
      this.initHideHeader = !!JSON.parse(params.hideHeader || false);
      this.isSafeView = !!JSON.parse(params.isSafeView || false);
      // inject function (typeof String)
      this.injectFuncString = params.injectFunc;
      this.title = params.title || '';

      this.startTimeLoad = 0;
      this.loadSuccess = false;

      this.needReloadWhenFocus = false;

      // init state
      this.state = {
        mode,
        unbackableURLs,
        isBackableInside,
        webURL,
        webURLsStack,
        currentWebURLsStackIndex: -1,
        shouldLoadNextURLOnWebURLsStack: true,
        isLoadingHidden: true,
        loadingPercentage: 0,
        isShowErrorHttp: null,
        doneLoadingWeb: false,
        isLoginRequired: !props.myUser.isLoggedIn,
        idWebview: 0,
        timeError: 0,
        jsonPayload: null,
      };
      this.params = params;
    }
    this.loadingEnd = true;
    this.backMode = BACK_MODE.NORMAL;
    this.history = [];
    this.currentKey = '';

    if (this.props.navigation && this.props.navigation.state.params) {
      this.passParams = this.props.navigation.state.params.passParams;
    }

    this.needToken = true;
    this.needReloadAfterLogin = true;

    this.deepLinkCenter = new DeepLinkCenter({
      navigation: this.props.navigation,
    });
  }
  // --------------------------------------------------
  async componentDidMount() {
    // Utils.log(`${LOG_TAG} componentDidMount: `, this.state);

    setTimeout(() => {
      this.handleContactRequest();
    }, 2000);

    if (this.props.navigation) {
      this.setNavigationParams({
        onHeaderBack: this.onHeaderBack,
        isBackableInside: this.state.isBackableInside,
        onClosePress: this.onClosePress,
        hideNavigation: this.initHideHeader,
      });
    }
    if (this.state.mode === 1) {
      setTimeout(() => {
        this.loadNextURLOnWebURLsStack();
      }, 100);
    }

    this.subs = [this.props.navigation.addListener('willFocus', this.reloadWhenFocus)];
    backAndroidHandler(this.onHeaderBack);
    BroadcastManager.shared().addObserver(BroadcastManager.NAME.WEBVIEW.DATA, this, (dataJSON) => {
      this.sendMessageToWebview(dataJSON);
    });
    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.UI.BOTTOM_ACTION_HOME2,
      this,
      this.onOpenBottomSheet,
    );
    eventEmitter.addListener('PaymentBack', (e) => {
      if (e) {
        let payloadRes = {};
        if (this.state.jsonPayload) {
          payloadRes = { ...this.state.jsonPayload };
        }
        payloadRes = { ...payloadRes, resultCode: e.resultCode };
        if (e.resultCode === -1) {
        }

        if (e.resultCode === 10) {
          this.sendMessageToWebview(payloadRes?.data);
          setTimeout(() => {
            if (payloadRes?.data?.vnp_TxnRef) {
              const urlCheck = `${Configs.serverURL}/payment/result_banking_v2/vnpay?vnp_TxnRef=${payloadRes?.data?.vnp_TxnRef}`;
              const deeplink = parseURL(`mfastmobile://open?view=webview&url=${urlCheck}`);
              this.deepLinkCenter.processDeepLink(deeplink);
            }
          }, 500);
          return;
        }
        // if (e?.isCheckData) {

        // }
        // switch (e.resultCode) {

        //resultCode == -1
        //vi: Người dùng nhấn back từ sdk để quay lại
        //en: back from sdk (user press back in button title or button back in hardware android)

        //resultCode == 10
        //vi: Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...) lúc này app tích hợp sẽ cần lưu lại cái PNR, khi nào người dùng mở lại app tích hợp thì sẽ gọi kiểm tra trạng thái thanh toán của PNR Đó xem đã thanh toán hay chưa.
        //en: user select app to payment (Mobile banking, wallet ...) you need save your PNR code. because we don't know when app banking payment successfully. so when user re-open your app. you need call api check your PNR code (is paid or unpaid). PNR: it's vnp_TxnRef. Reference code of transaction at Merchant system

        //resultCode == 99
        //vi: Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp
        //en: back from button (button: done, ...) in the webview when payment success. (incase payment with card, atm card, visa ...)

        //resultCode == 98
        //vi: giao dịch thanh toán bị failed
        //en: payment failed

        //resultCode == 97
        //vi: thanh toán thành công trên webview
        //en: payment success
        // }
      }
    });

    FlutterService.listenerEvent('exit', (event) => {
      try {
        const data = { key: RELOAD_WEBVIEW };
        this.handleReloadWebView(data);
      } catch (error) {
        console.log(error);
      }
    });
  }

  triggerFuncWebView = () => {
    try {
      if (this.injectFuncString) {
        const injectString = this.injectFuncString;
        if (this.webView) {
          this.webView.injectJavaScript(`
              window.ReactNativeWebView.postMessage(JSON.stringify({key: '${INJECT_FUNC}', data: { injectFunc: ${injectString} }}));
                ;true;
              `);
        }
      }
    } catch (error) {
      // console.log("TCL: WebViewScreen -> triggerFuncWebView -> error", error)
    }
  };

  setNavigationParams = (params) => {
    if (
      this.props.navigation &&
      this.props.navigation.state.params &&
      !isNaN(this.props.navigation.state.params.mode)
    ) {
      this.props.navigation.setParams(params);
    }
  };

  componentWillUnmount() {
    if (this.callbackBackEvent !== undefined) {
      this.callbackBackEvent();
    }
    this.subs.forEach((sub) => sub.remove());
    removeBackAndroidHandler(this.onHeaderBack);
    BroadcastManager.shared().removeObserver(BroadcastManager.NAME.WEBVIEW.DATA, this);
    eventEmitter.removeAllListeners('PaymentBack');
    FlutterService.removeListenerEvent('exit');
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.myUser.isLoggedIn !== nextProps.myUser.isLoggedIn) {
      this.setState({
        isLoginRequired: false,
      });
    }
    if (
      this.props.myUser.accessToken !== nextProps.myUser.accessToken &&
      nextProps.myUser.isLoggedIn
    ) {
      this.sendTokenToWebview(this.currentKey, nextProps.myUser.accessToken);
    }
    if (
      this.props.myUser.accessToken !== nextProps.myUser.accessToken &&
      this.needReloadAfterLogin
    ) {
      if (this.props.needReloadForLogin !== false) {
        this.reloadWebView();
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  }

  onOpenBottomSheet = () => {
    if (this.actionSheetRef) {
      this.actionSheetRef.open();
    } else {
      setTimeout(() => {
        if (this.actionSheetRef) {
          this.actionSheetRef.open();
        }
      }, 100);
    }
  };

  onCloseBottomSheet = () => {
    if (this.actionSheetRef) {
      this.actionSheetRef.close();
    }
  };

  onBottomSheetItemPress = (itemID) => {
    if (!this.props.myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }
    const invitation = this.props.invitationInfo;

    requestAnimationFrame(async () => {
      switch (itemID) {
        case ITEM_IDS.COLLABORATORS:
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          setTimeout(() => {
            this.props.navigation.navigate('Collaborator');
          }, 100);

          break;
        case ITEM_IDS.INSTALL_LINK:
          try {
            await Share.share({
              message: invitation.CTV_text,
            });
          } catch (error) {
            if (__DEV__) {
              console.log('error', error);
            }
          }

          break;
        case ITEM_IDS.INTRODUCTION:
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          const { appInfo } = this.props;
          setTimeout(() => {
            this.props.navigation.navigate('WebView', {
              mode: 0,
              title: 'Hướng dẫn chi tiết',
              url: appInfo?.introductionUrl,
            });
          }, 100);

          break;
        case ITEM_IDS.COMMISSION: {
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          setTimeout(() => {
            this.props.navigation.navigate('WebView', {
              mode: 0,
              title: 'Chính sách',
              url: MFConfigs.policyIndirect,
            });
          }, 100);

          break;
        }
        case ITEM_IDS.RSM_PUSH_MESSAGE: {
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          setTimeout(() => {
            this.props.navigation.navigate('RSMPushMessage');
          }, 100);

          break;
        }
        case ITEM_IDS.REF_CODE:
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          Linking.openURL(`${DEEP_LINK_BASE_URL}://copy/?text=${this.props?.myUser?.referralCode}`);
          break;

        case ITEM_IDS.POLICY_COLLABORATOR:
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          this.props.navigation.navigate('WebView', {
            mode: 0,
            title: 'Quy định',
            url: appInfo?.urlRuleCobllabNewModel,
          });
          break;

        case ITEM_IDS.INFO_COLLABORATOR:
          if (this.actionSheetRef) {
            this.actionSheetRef.close();
          }
          Linking.openURL(appInfo?.urlInfoNewModel);
          break;
        default:
          break;
      }
    });
  };
  reloadWhenFocus = () => {
    this.sendFocusToWebview();
    this.props.closeChat();
    if (
      global.isReloadWebview &&
      Platform.OS === 'ios' &&
      (this.state.webURL === MFConfigs.customerSite || this.state.webURL === MFConfigs.ctvSite)
    ) {
      if (this.webView) {
        this.webView.reload();
      }
      global.isReloadWebview = false;
    }
  };
  // --------------------------------------------------
  reloadWebView = () => {
    this.setState({
      isShowErrorHttp: null,
      idWebview: (this.state.idWebview += 1),
      timeError: (this.state.timeError += 1),
    });
    // if (this.webView) {
    //   this.webView.reload();
    // }
  };
  // --------------------------------------------------
  fetchLocation = () => {
    return new Promise((resolve) => {
      checkAndRequestPermission(PERMISSION_CHECK.LOCATION, strings.location_access_error).then(
        (granted) => {
          if (!granted) {
            resolve(null);
            return;
          } else {
            checkAndRequestPermissionLocation((location) => {
              resolve(location);
            });
          }
        },
      );
    });
  };

  fetchDeviceId = async () => {
    const deviceUDID = DeviceInfo.getUniqueId();
    this.sendMessageToWebview({
      key: GET_DEVICE_ID,
      deviceUDID,
      os: Platform.OS,
      appVersion: getAppVersion(),
    });
  };

  // --------------------------------------------------
  onMessage = async (event) => {
    this.hideLoading();
    try {
      // work around for encode data
      let data = event.nativeEvent.data;
      for (let i = 0; i < 5; i += 1) {
        if (data.includes('%')) {
          data = decodeURIComponent(data);
        } else {
          break;
        }
      }

      const dataJSON = JSON.parse(data);

      if (dataJSON.needToken === 'yes') {
        this.needToken = true;
      } else if (dataJSON.needToken === 'no') {
        this.needToken = false;
      } else if (dataJSON?.needReloadWhenFocus !== undefined) {
        this.needReloadWhenFocus = dataJSON?.needReloadWhenFocus;
      }

      if (dataJSON.mode) {
        if (dataJSON.mode === 'ACCESS_TOKEN_FOR_LOGIN') {
          this.needReloadAfterLogin = false;
        }
      }

      switch (dataJSON.key) {
        case ERROR_CODE.REQUIRED_LOGIN:
          this.handleLoginRequest(); // tested
          break;
        case LOCATION_KEY:
          this.handleLocationRequest(dataJSON); // tested
          break;
        case MB_SHARE_CLICK:
          this.handleMBShareClick(dataJSON); // tested
          break;
        case CONTACT_KEY:
          this.handleContactRequest(dataJSON); // tested
          break;
        case CONFIG_KEY:
          this.handleConfig(dataJSON); // tested
          break;
        case TITLE_KEY:
          this.handleTitleCustom(dataJSON); // tested
          break;
        case CUSTOM_BACK_KEY:
          this.handleCanBackURL(dataJSON); // tested
          break;
        case NUMBER_BACK_KEY:
          this.handleNumberBack(dataJSON); // tested
          break;
        case HIDE_NAVIGATION_KEY:
          this.handleHideNavigation(dataJSON); // tested
          break;
        case ON_BACK_KEY:
          this.handleOnBack(dataJSON); // tested
          break;
        case BROAD_CAST_DATA_KEY:
          this.handleBroadCastData(dataJSON); // tested
          break;
        case PHOTO_PICKER_KEY:
          this.handlePhotoPicker(dataJSON); // tested
          break;
        case CAMERA_PICKER_KEY:
          this.handleCameraPicker(dataJSON); // tested
          break;
        case LOG_EVENT:
          this.handleLogEvent(dataJSON); // tested
          break;
        case SHARE_ZALO:
          this.handleShareZalo(dataJSON); // not used
          break;
        case SHARE_FACEBOOK:
          this.handleShareFacebook(dataJSON); // PEND
          break;
        case INJECT_FUNC:
          this.handleOnInjectFunc(dataJSON); // not used
          break;
        case IN_APP_REVIEW:
          this.handleInAppReview(dataJSON); // tested
          break;
        case OPEN_WEBVIEW:
          this.handleOpenNewWebView(dataJSON); // tested
          break;
        case CLOSE_WEBVIEW:
          this.props.navigation.goBack(); // tested
          break;
        case OPEN_VN_PAY:
          this.handleOpenVNPay(dataJSON); // PEND
          break;
        case OPEN_SCREEN_APP: {
          this.handleOpenScreenApp(dataJSON); // not used
          break;
        }
        case OPEN_MOMO: {
          this.handleOpenMomo(dataJSON); // tested
          break;
        }
        case BACK_TO_HOME: {
          this.props.navigation.popToTop(); // tested
          break;
        }
        case GET_DEVICE_ID: {
          this.fetchDeviceId(dataJSON); // tested
          break;
        }
        case CONTACT_PHONE_KEY: {
          this.handleContactPhoneRequest(dataJSON); // BE not used
          break;
        }
        case OPEN_BROWSER: {
          this.handleOpenBrowser(dataJSON); // tested
          break;
        }
        default:
          break;
      }
    } catch (err) {}
  };

  handleOpenBrowser = (dataJSON) => {
    Linking.openURL(dataJSON?.data?.url);
  };
  handleContactPhoneRequest = async (dataJSON) => {
    const contacts = await getContacts();
    const trackingInfo = getDeviceTrackingInfo();
    this.sendMessageToWebview({
      key: CONTACT_PHONE_KEY,
      uid: dataJSON.uid,
      contacts,
      os: Platform.OS,
      appVersion: getAppVersion(),
      ...trackingInfo,
    });
  };
  handleLoginRequest = () => {
    this.currentKey = ERROR_CODE.REQUIRED_LOGIN;
    BroadcastManager.shared().notifyObservers(
      BroadcastManager.NAME.API.ERROR_OTP,
      ERROR_CODE.REQUIRED_LOGIN,
    );
  };
  handleLocationRequest = async (dataJSON) => {
    const location = await this.fetchLocation(dataJSON.uid);
    const trackingInfo = getDeviceTrackingInfo();
    this.sendMessageToWebview({
      key: LOCATION_KEY,
      uid: dataJSON.uid,
      location,
      os: Platform.OS,
      appVersion: getAppVersion(),
      ...trackingInfo,
    });
  };
  handleContactRequest = async () => {
    const contacts = Object.keys(this.props.allContacts).map((key) => {
      return this.props.allContacts[key];
    });

    const trackingInfo = getDeviceTrackingInfo();
    this.sendMessageToWebview({
      key: CONTACT_KEY,
      data: contacts,
      os: Platform.OS,
      appVersion: getAppVersion(),
      ...trackingInfo,
    });
  };
  handleConfig = (dataJSON) => {
    const { title } = dataJSON;
    if (title) {
      this.updateNavigationTitle(title);
    }
  };
  handleTitleCustom = (dataJSON) => {
    const { title } = dataJSON;
    if (title) {
      this.updateNavigationTitle(title);
    }
  };
  handleCanBackURL = (dataJSON) => {
    const mode = dataJSON.mode || BACK_MODE.NONE;
    this.backMode = mode;
    this.setNavigationParams({ hideBack: this.backMode === BACK_MODE.HIDDEN });
  };
  handleCanClose = (dataJSON) => {
    this.setNavigationParams({ hideClose: dataJSON.mode === CLOSE_MODE.NONE });
  };
  handleNumberBack = (dataJSON) => {
    const numberOfBack = dataJSON.step;
    this.history.splice(this.history.length - numberOfBack, numberOfBack);
  };
  handleHideNavigation = (dataJSON) => {
    this.setNavigationParams({ hideNavigation: dataJSON.hide });
  };
  handleOnBack = () => {
    this.onHeaderBack();
  };
  handleBroadCastData = (dataJSON) => {
    BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.WEBVIEW.DATA, dataJSON);
  };
  handlePhotoPicker = (dataJSON) => {
    const { width, height, cameraTitle, cameraDetail, galleryTitle } = dataJSON.data;
    const onFinishPhoto = (imageURI) => {
      this.sendMessageToWebview({ ...dataJSON, hasChoose: true, path: imageURI });
    };

    const onDontPick = () => {
      this.sendMessageToWebview({ ...dataJSON, hasChoose: false });
    };
    this.photoPicker.show({
      cameraTitle,
      cameraDetail,
      galleryTitle,
      width,
      height,
      navigation: this.props.navigation,
      callback: onFinishPhoto,
      callbackDontPick: onDontPick,
    });
  };
  handleCameraPicker = (dataJSON) => {
    const { width, height, cameraTitle, cameraDetail, cameraTitleHtml, cameraDetailHtml } =
      dataJSON.data;
    const onFinishPhoto = (imageURI) => {
      const data = { ...dataJSON, hasChoose: true, path: imageURI };
      this.sendMessageToWebview(data);
    };
    const onDontPick = () => {
      this.sendMessageToWebview({ ...dataJSON, hasChoose: false });
    };
    this.photoPicker.show(
      {
        cameraTitle,
        cameraDetail,
        galleryTitle: 'Gallery',
        cameraTitleHtml,
        cameraDetailHtml,
        width,
        height,
        navigation: this.props.navigation,
        callback: onFinishPhoto,
        callbackDontPick: onDontPick,
      },
      'camera',
    );
  };
  handleLogEvent = (dataJSON) => {
    const { params } = dataJSON;
    if (params?.eventName && params?.eventName?.length > 0) {
      logEvent(params?.eventName, { ...params?.data });
      // flyersTrackEvent(type, product ? { product } : '');
    }
  };
  handleShareZalo = async (dataJSON) => {
    try {
      const { url_share, message } = dataJSON;
      const feedData = {
        message,
        link: url_share,
        linkTitle: url_share,
        linkSource: url_share,
        linkDesc: url_share,
        linkThumb: [url_share],
        others: {},
        appName: 'MFast',
      };
      const data = await shareNewFeedZalo(feedData);
      this.sendMessageToWebview({
        ...dataJSON,
        success: data && data.success,
      });
    } catch (error) {
      // console.log(error.message)
    }
  };

  handleMBShareClick = async (dataJSON) => {
    try {
      // logEvent()
    } catch (error) {}
  };
  handleShareFacebook = async (dataJSON) => {
    const { url_share, message } = dataJSON;
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: url_share,
      contentDescription: message || '',
    };
    const result = await shareNewFeedFacebook(shareLinkContent);
    this.sendMessageToWebview({
      ...dataJSON,
      success: !isEmpty(result),
    });
  };
  handleInAppReview = (dataJSON) => {
    // callback
    const callback = ({ success }) => {
      this.sendMessageToWebview({
        ...dataJSON,
        success,
      });
    };

    // main
    InAppReview(callback);
  };

  handleOpenNewWebView = (dataJSON) => {
    const { url } = dataJSON;
    const { navigation } = this.props;
    if (navigation && url) {
      navigation.push('WebView', { mode: 0, ...dataJSON });
    }
  };

  handleOnInjectFunc = (dataJSON) => {
    const injectFunc = dataJSON?.data?.injectFunc;
    if (injectFunc) {
      if (this.webView) {
        this.webView.injectJavaScript(`${injectFunc};true;`);
      } else {
        // try again
        setTimeout(() => {
          if (this.webView) {
            this.webView.injectJavaScript(`${injectFunc};true;`);
          }
        }, 600);
      }
    }
  };

  handleOpenMomo = async (dataJSON) => {
    // if (canOpened) {
    if (dataJSON?.data?.data?.target) {
      Linking.openURL(dataJSON?.data?.data?.target);
    }
    // }
  };

  handleOpenVNPay = (dataJSON) => {
    try {
      let vnp_Params = dataJSON?.data || {};
      const ipAddr = Utils.getIpAddress();
      vnp_Params.vnp_IpAddr = ipAddr;
      vnp_Params.vnp_TmnCode = Configs.vnpTMNCode;
      vnp_Params.vnp_OrderInfo = dataJSON.data.vnp_OrderInfo;
      this.setState({ jsonPayload: dataJSON });
      vnp_Params = sortObject(vnp_Params);
      let vnpUrl = Configs.vnpUrl;
      const signed = hmacSHA512(
        querystring.stringify(vnp_Params, { encode: false }),
        Configs.vnpHashSecret,
      ).toString();
      vnp_Params.vnp_SecureHash = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      VnpayMerchant.show({
        isSandbox: isDevelopment || isStaging ? true : false,
        paymentUrl: vnpUrl,
        tmn_code: Configs.vnpTMNCode,
        backAlert: 'Bạn có chắc chắn trở lại ko?',
        title: ' ',
        iconBackName: 'back',
        titleColor: '000000',
        beginColor: 'f2f2f2',
        endColor: 'f2f2f2',
        scheme: 'mfastmobile://vnpay',
      });
    } catch (error) {
      Alert.alert('Error open vnpay sdk', JSON.stringify(error));
    }
  };

  handleReloadWebView = (dataJSON) => {
    this.sendMessageToWebview({
      ...dataJSON,
    });
  };

  handleOpenScreenApp = (dataJSON) => {};
  // --------------------------------------------------
  sendFocusToWebview = () => {
    this.sendMessageToWebview({
      key: 'DID_FOCUS',
      os: Platform.OS,
      appVersion: getAppVersion(),
    });
  };

  sendTokenToWebview = (key, accessToken) => {
    this.sendMessageToWebview({
      key,
      accessToken,
      os: Platform.OS,
      appVersion: getAppVersion(),
    });
  };

  sendBackMessageToWebview = (history) => {
    const data = { key: CUSTOM_BACK_KEY };
    if (history) {
      data.history = history;
    }
    this.sendMessageToWebview(data);
  };
  // --------------------------------------------------
  sendMessageToWebview = (message) => {
    if (this.webView) {
      const data = this.injectedJavaScriptData(JSON.stringify(message));
      this.webView.injectJavaScript(data);
    }
  };

  injectedJavaScriptData = (data) => `
    (function() {
      if (typeof listenData !== 'undefined') {
        listenData('${data}');
      };
    })();
    true;
  `;
  // --------------------------------------------------
  onHeaderBack = () => {
    // if (this.canWebViewGoBack && this.state.isBackableInside) {
    switch (this.backMode) {
      case BACK_MODE.CUSTOM:
        LIST_WEBVIEW_DISABLE_CUSTOM_BACK?.includes(this.state.webURL) && Platform.OS === 'android'
          ? this.props.navigation.pop()
          : this.sendBackMessageToWebview(this.history);
        break;
      case BACK_MODE.CUSTOM_URL:
        this.sendBackMessageToWebview([]);
        break;
      default:
        this.backWebview();
        break;
    }
    // this.backMode = BACK_MODE.NORMAL;
    // } else {
    //   this.props.navigation.goBack();
    // }
  };
  onClosePress = () => {
    this.props.navigation.goBack();
  };
  onShouldStartLoadWithRequest = (request) => {
    if (checkInWhileList(request.url)) {
      Linking.openURL(request.url);
      return false;
    }
    if (isDeepLink(request.url)) {
      return false;
    }
    let webUrl = request.url;
    if (isNeedAccessToken(request.url)) {
      webUrl = this.appendParamTo(request.url);
    }
    console.log('aaa-123', webUrl);
    this.updateHistory(webUrl);
    this.resetNavigation();
    return true;
  };
  onWebViewNavigationStateChange = (state) => {
    console.log('meo12', state.url);
    if (checkInWhileList(state.url)) {
      Linking.openURL(state.url);
      return;
    }

    if (checkUrlOpenBrowser(state.url)) {
      this.onHeaderBack();
      Linking.openURL(state.url);
      return;
    }
    if (isDeepLink(state.url)) {
      return;
    }

    // Utils.log(`${LOG_TAG} onWebViewNavigationStateChange: `, state);

    // get webview go back behaviour
    let canWebViewGoBack = state.canGoBack;

    // don't allow webview back if go back to original url
    const unbacks = this.state.unbackableURLs.filter((url) => {
      if (state.url.includes('?')) {
        const newURL = state.url.split('?')[0];
        const unbackUrl = url?.includes('?') ? url.split('?')[0] : url;
        return newURL === unbackUrl;
      }
      return state.url.includes(url);
    });
    if (unbacks.length > 0) {
      canWebViewGoBack = false;
    }

    // update state
    this.canWebViewGoBack = canWebViewGoBack;
    this.setNavigationParams({ canWebViewGoBack: this.canWebViewGoBack });
  };
  onWebViewLoad = () => {
    // log params here might be too much info an can cause freeze ui
    // Utils.log(`${LOG_TAG} onWebViewLoad: ${this.state.webURL}`);
  };

  // checkBadNetwork = () => {
  //   setTimeout(() => {
  //     if (this.loadSuccess) {
  //     } else {
  //       this.setState({
  //         // isLoginRequired: true,
  //         isShowErrorHttp:
  //           this.state.timeError > 2 ? ERROR_TYPE.ERROR_NETWORK : ERROR_TYPE.BAD_NETWORK,
  //         // doneLoadingWeb: false
  //       });
  //     }
  //   }, 7000);
  // };
  onWebViewLoadStart = (event) => {
    // this.checkBadNetwork();
    // log params here might be too much info an can cause freeze ui
    const nativeEvent = event.nativeEvent || {};
    const url = nativeEvent.url || '';
    // --
    this.setState({ isShowErrorHttp: null });
    this.showLoading();
    // auto hide loading if tap on deeplink
    if (isDeepLink(url)) {
      setTimeout(() => {
        this.hideLoading();
      }, 1000);
    }

    this.backMode = BACK_MODE.NORMAL;
    this.needReloadAfterLogin = true;
  };
  onWebViewLoadEnd = (payload) => {
    this.loadSuccess = true;
    // log params here might be too much info an can cause freeze ui
    // Utils.log(`${LOG_TAG} onWebViewLoadEnd`);
    // inject function
    if (this.injectFuncString) {
      this.triggerFuncWebView();
    }
    // normal url
    if (this.state.mode === 0) {
      this.hideLoading();
    }
    // stack urls
    else if (this.state.mode === 1) {
      if (this.state.shouldLoadNextURLOnWebURLsStack) {
        setTimeout(() => {
          this.loadNextURLOnWebURLsStack();
        }, 100);
      }
      if (this.state.currentWebURLsStackIndex >= this.state.webURLsStack.length - 1) {
        this.hideLoading();
      }
    }

    if (this.state.doneLoadingWeb === false) {
      setTimeout(() => {
        if (this.bgImageRef && this.bgImageRef.fadeOut) {
          this.bgImageRef.fadeOut().then(() => {
            this.setState({ doneLoadingWeb: true });
          });
        }
      });
    }
  };
  onWebViewError = (error) => {
    setTimeout(() => {
      this.setState({
        isLoadingHidden: true,
        isShowErrorHttp: ERROR_TYPE.ERROR_NETWORK,
      });
    }, 500);
  };
  // --------------------------------------------------
  resetNavigation = () => {
    this.backMode = BACK_MODE.NORMAL;
    this.setNavigationParams({
      title: this.title,
      hideNavigation: this.initHideHeader,
      hideBack: false,
      hideClose: false,
    });
  };
  updateNavigationTitle = (title) => {
    this.setNavigationParams({ title: title || this.title });
  };
  updateHistory(url) {
    if (this.history.length > 0) {
      if (this.history[this.history.length - 1] !== url) {
        this.history.push(url);
      }
    } else {
      this.history.push(url);
    }
  }

  backWebview = () => {
    if (this.canWebViewGoBack && this.state.isBackableInside) {
      this.webView.goBack();
      this.history.pop();
    } else {
      this.props.navigation.goBack();
    }
  };
  // --------------------------------------------------
  showAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [
        {
          text: 'Đóng',
          onPress: () => {},
        },
      ],
      { cancelable: false },
    );
  }
  onHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent?.statusCode !== 200) {
      this.setState({ isShowErrorHttp: ERROR_TYPE.ERROR_NETWORK });
    }
  };

  // --------------------------------------------------
  showLoading() {
    const startPercentage = 0.1 + Math.floor(Math.random() * 10 + 1) / 25.0;
    this.updateLoadingPercentage(startPercentage);
    setTimeout(() => {
      this.updateLoadingPercentage(startPercentage * (1 + 0.3));
    }, 500);
    this.loadingEnd = false;
    setTimeout(() => {
      if (this.loadingEnd === false) {
        this.setState({ isLoadingHidden: false });
      }
    }, 300);
  }
  hideLoading() {
    this.loadingEnd = true;
    this.updateLoadingPercentage(1);
    setTimeout(() => {
      this.setState({ isLoadingHidden: true, loadingPercentage: 0 });
    }, 200);
  }
  updateLoadingPercentage = (percentage) => {
    if (this.state.loadingPercentage !== 0 && this.state.loadingPercentage !== 1) {
      if (this.state.loadingPercentage > percentage) {
        return;
      }
    }
    if (this.state.loadingPercentage === 1 && percentage !== 0) {
      return;
    }
    this.setState({ loadingPercentage: percentage });
  };
  // --------------------------------------------------
  loadNextURLOnWebURLsStack() {
    // check
    if (this.state.mode !== 1) {
      // Utils.log(`${LOG_TAG} loadNextURLOnWebURLsStack -> wrong mode`);
      return;
    }
    if (this.state.currentWebURLsStackIndex + 1 >= this.state.webURLsStack.length) {
      // Utils.log(`${LOG_TAG} loadNextURLOnWebURLsStack -> load all, stop`);
      return;
    }
    // next url
    const nextIndex = this.state.currentWebURLsStackIndex + 1;
    this.setState({
      currentWebURLsStackIndex: nextIndex,
      webURL: this.state.webURLsStack[nextIndex],
    });
  }
  appendParamToURL(url, param, paramValue) {
    let newURL = this.removeURLParameter(url, param);
    if (newURL.indexOf(param) === -1) {
      const combine = newURL.indexOf('?') === -1 ? '?' : '&';
      newURL = `${newURL}${combine}${param}=${paramValue}`;
    }
    return newURL;
  }
  appendParamTo = (webURL) => {
    let newWebURL = webURL;
    if (webURL !== undefined && webURL !== '') {
      if (this.needToken && this.props.myUser.accessToken) {
        newWebURL = this.appendParamToURL(webURL, 'accessToken', this.props.myUser.accessToken);
      }
      newWebURL = this.appendParamToURL(newWebURL, 'os', Platform.OS);
      newWebURL = this.appendParamToURL(newWebURL, 'appVersion', getAppVersion());
      newWebURL = this.appendParamToURL(newWebURL, 'appName', 'mfast');
    }
    if (this.passParams) {
      const keys = Object.keys(this.passParams);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        newWebURL = this.appendParamToURL(newWebURL, key, this.passParams[key]);
      }
    }
    newWebURL = newWebURL.replace('?&', '?');
    return newWebURL;
  };
  removeURLParameter(url, parameter) {
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter) + '=';
      let pars = urlparts[1].split(/[&;]/g);

      for (let i = pars.length; i-- > 0; ) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
  }
  // --------------------------------------------------
  renderSkeletonBg = () => {
    const { bgImage } = this.params;
    return bgImage ? (
      <Animatable.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'stretch',
          width: '100%',
        }}
        ref={(ref) => {
          this.bgImageRef = ref;
        }}
        useNativeDriver
      >
        <Image
          style={{
            width: '100%',
            flex: 1,
          }}
          resizeMode={'stretch'}
          source={bgImage}
        />
      </Animatable.View>
    ) : null;
  };

  renderModalLoginRequire = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.actionBackground,
          // justifyContent: 'center',
          alignItems: 'center',
          paddingTop: SH(25),
        }}
      >
        <Image
          source={IMAGE_PATH.requireLoginWebview}
          style={{ width: SW(188), height: SH(140), resizeMode: 'contain' }}
        />
        <View style={{ paddingHorizontal: SW(16), marginTop: SH(21) }}>
          <AppText
            style={{
              fontSize: SH(14),
              lineHeight: SH(20),
              color: Colors.gray2,
              textAlign: 'center',
              paddingHorizontal: SW(25),
            }}
          >
            Vui lòng đăng nhập để tiếp tục sử dụng các sản phẩm, dịch vụ có trên MFast.
          </AppText>
        </View>
        <TouchableOpacity
          style={{
            width: SW(180),
            height: SH(48),
            backgroundColor: Colors.primary2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 24,
            marginTop: SH(20),
          }}
          onPress={this.props.openLogin}
        >
          <AppText style={{ fontSize: SH(16), lineHeight: SH(20), color: Colors.primary5 }}>
            Đăng nhập
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    let { webURL, doneLoadingWeb, isShowErrorHttp, isLoginRequired } = this.state;
    const { myUser } = this.props;
    if (webURL !== undefined && webURL !== '') {
      if (webURL instanceof Array) {
        const newWebURLs = webURL.map((url) => this.appendParamTo(url));
        webURL = newWebURLs.join(',');
      } else {
        webURL = this.appendParamTo(webURL);
      }
    }
    // if (isLoginRequired) {
    //   return this.renderModalLoginRequire();
    // }
    // ---
    return (
      <WrapperContainer isSafeAreaView={this.isSafeView}>
        <WebView
          key={this.state.idWebview}
          ref={(object) => {
            this.webView = object;
          }}
          style={{
            backgroundColor: Colors.neutral5,
          }}
          onHttpError={this.onHttpError}
          source={{ uri: webURL }}
          scalesPageToFit
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          onNavigationStateChange={this.onWebViewNavigationStateChange}
          onLoad={this.onWebViewLoad}
          onLoadStart={this.onWebViewLoadStart}
          onLoadEnd={this.onWebViewLoadEnd}
          onError={this.onWebViewError}
          dataDetectorTypes={'none'}
          onMessage={this.onMessage}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          allowsLinkPreview={true}
          allowsInlineMediaPlayback={true}
          onFileDownload={({ nativeEvent: { downloadUrl } }) => {
            ImageUtils.mSaveToCameraRoll(downloadUrl)
              .then(() => Alert.alert('Lưu ảnh thành công!'))
              .catch((error) => console.log('error ne', error));
          }}
        />
        {doneLoadingWeb ? null : this.renderSkeletonBg()}
        {
          <LoadingScreen
            hidden={this.state.isLoadingHidden}
            percentage={this.state.loadingPercentage}
          />
        }
        <PhotoPicker
          ref={(ref) => {
            this.photoPicker = ref;
          }}
        />
        <BottomActionSheet
          ref={(ref) => {
            this.actionSheetRef = ref;
          }}
          render={() => (
            <View>
              <HomeActionSheet
                onClosePress={() => {
                  if (this.actionSheetRef) {
                    this.actionSheetRef.close();
                  }
                }}
                onItemPress={this.onBottomSheetItemPress}
                user={this.props.myUser}
                itemRender={
                  this.props.myUser?.useRsmPush ? LIST_CTV_FUNCTION : LIST_CTV_FUNCTION_WITHOUT_RSM
                }
              />
            </View>
          )}
        />
        {isShowErrorHttp && (
          <ErrorHttpView
            type={isShowErrorHttp}
            onReloadWebview={() => {
              this.reloadWebView();
            }}
            backToHome={() => {
              this.props.navigation.goBack();
            }}
          />
        )}
      </WrapperContainer>
    );
  }
}

const LoadingScreen = ({ percentage, hidden }) => (
  <View style={[styles.loadingContainer, hidden ? { opacity: 0 } : {}]}>
    <Progress.Bar
      progress={percentage}
      borderRadius={0}
      borderWidth={0}
      height={1.5}
      width={null}
      color={Colors.primary2}
    />
  </View>
);

// --------------------------------------------------

WebViewScreen.navigationOptions = ({ navigation }) => {
  const params = navigation.state.params;
  const title = navigation.state.params.title || ' ';
  const options = {
    ...defaultNavOptions,
    title,
    headerLeft: params.hideBack ? null : <HeaderBackButton navigation={navigation} />,
    gesturesEnabled: params.disabledSwipeToBack ? false : true,
    headerRight: (
      <HeaderRightButton
        isShowCloseButton={params && params.canWebViewGoBack && !params.hideClose}
        navigation={navigation}
      />
    ),
  };
  if (params.hideNavigation) {
    options.header = null;
  }
  return options;
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

WebViewScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
  invitationInfo: state.invitationInfo,
});

const mapDispatchToProps = (dispatch) => ({
  closeChat: () => dispatch(closeChat()),
  openLogin: () => dispatch(openLogin()),
});

// const TrackingWebViewScreen = componentWithTracker(
//   WebViewScreen,
//   SCREEN.WEB_VIEW,
//   WebViewScreen.navigationOptions
// );

export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);

// --------------------------------------------------

const HeaderBackButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <KJButton
      testID="header-back"
      leftIconSource={ICON_PATH.back}
      leftIconStyle={{
        width: 22,
        height: 22,
        resizeMode: 'contain',
      }}
      containerStyle={{
        paddingHorizontal: 16,
        height: '100%',
      }}
      onPress={() => {
        if (params.onHeaderBack) {
          requestAnimationFrame(() => {
            params.onHeaderBack();
          });
        }
      }}
    />
  );
};

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  const isShowCloseButton = props?.isShowCloseButton || true;
  const isShowNotificationButton = params?.isShowNotificationButton;
  const indexTabNotification = params?.indexTabNotification;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
      {isShowNotificationButton ? (
        <TouchableOpacity
          testID="header-back"
          style={styles.headerBackButton}
          onPressIn={() => {
            props.navigation.navigate('Notification', {
              thread: SystemThread.adminThread(),
              params: { initAdminIndex: indexTabNotification, initIndex: 1 },
            });
          }}
        >
          <Image
            style={{ width: 22, height: 22, tintColor: Colors.gray5 }}
            source={ICON_PATH.iconBell}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      ) : null}
      {isShowCloseButton ? (
        <TouchableOpacity
          testID="header-back"
          style={styles.headerBackButton}
          onPressIn={() => {
            if (params.onClosePress) {
              requestAnimationFrame(() => {
                params.onClosePress();
              });
            }
          }}
        >
          <Image
            style={{ width: 24, height: 24, tintColor: Colors.gray5 }}
            source={ICON_PATH.home}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: Colors.neutral5,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    // bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0000',
  },
  headerBackButton: {
    width: 44,
    height: 44,
    paddingLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
