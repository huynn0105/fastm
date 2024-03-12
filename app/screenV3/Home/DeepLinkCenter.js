import hmacSHA512 from 'crypto-js/hmac-sha512';
import querystring from 'query-string';
import { Alert, Clipboard, InteractionManager, Linking, Platform, Share } from 'react-native';
import Communications from 'react-native-communications';
import SendSMS from 'react-native-sms';
import VnpayMerchant from 'react-native-vnpay-merchant';
import {
  Configs,
  DeepLinkPaths,
  DEEP_LINK_BASE_URL,
  EndpointJoinGroupMfast,
} from '../../constants/configs';
import strings, { formatString } from '../../constants/strings';
import User from '../../models/User';
import DigitelClient from '../../network/DigitelClient';
import { pendingOpenDeepLink } from '../../redux/actions/app';
import {
  fetchConversationContacts,
  setIsFetchingSingleChat,
} from '../../redux/actions/conversationContact';
import { makeCall } from '../../redux/actions/sip';
import store from '../../redux/store/store';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import { openChatWithThread, openChatWithUser } from '../../submodules/firebase/redux/actions';
// import { flyersTrackEvent } from '../../utils/AppsFlyers';
import InAppReview from '../../utils/inAppReview';
import { checkMicroPermission } from '../../utils/PermissionWrapper';
import {
  openOSSettings,
  showAlert,
  showAlertForRequestPermission,
  showInfoAlert,
} from '../../utils/UIUtils';
import { sortObject } from '../../utils/Utils';
import FlutterService from './FlutterService';
import { openAccountIdentification } from '../../redux/actions/actionsV3/navigationAction';

const DEEP_LINK_VIEW = {
  os_setting: 'os_setting',
  user_point: 'user_point',
  home_shop: 'home_shop',
  webview: 'webview',
  survey: 'survey',
  services: 'services',
  news: 'News',
  os_ticket: 'OSTicket',
  app: 'app',
  customer: 'cutomer',
  account_setting_tab: 'account_setting_tab',
};

class DeepLinkCenter {
  constructor(props) {
    this.params = {};
    this.params.navigation = props.navigation;
  }

  processDeepLink = (deepLink) => {
    try {
      const { path, params } = deepLink;
      // case join group.
      if (path.startsWith(EndpointJoinGroupMfast)) {
        const threadID = path.split('/')?.[3];
        if (threadID) this.mJoinGroupChat(threadID, '');
        setTimeout(() => {
          store.dispatch(pendingOpenDeepLink());
        }, 50);
        return;
      }
      // another case
      switch (path) {
        case DeepLinkPaths.SINGLE_CHAT: {
          const { userID, message = '' } = params;
          if (userID) this.mOpenSingleChat(userID, message);
          break;
        }
        case DeepLinkPaths.GROUP_CHAT: {
          const { threadID, message = '' } = params;
          if (threadID) this.mOpenGroupChat(threadID, message);
          break;
        }
        case DeepLinkPaths.JOIN_GROUP: {
          const { threadID } = params;
          if (threadID) this.mJoinGroupChat(threadID, '');
          break;
        }
        case DeepLinkPaths.SIP_CALL: {
          const {
            num,
            hideNum,
            name,
            param1 = '',
            param2 = '',
            param3 = '',
            param4 = '',
            param5 = '',
          } = params;

          if (num) {
            this.mOpenCall({ num, hideNum, name, param1, param2, param3, param4, param5 });
          }
          break;
        }
        case DeepLinkPaths.SIP_CALL_SUPPORT: {
          const { url } = params;
          this.mOpenCallSupport(url);
          break;
        }
        case DeepLinkPaths.COPY: {
          const { text } = params;

          Clipboard.setString(text);
          showInfoAlert(`Đã sao chép "${text}"`);
          break;
        }
        case DeepLinkPaths.GO_BACK: {
          this.mGoBack();
          break;
        }
        case DeepLinkPaths.OPEN: {
          this.mHandleOpenView(params);
          break;
        }
        case DeepLinkPaths.SMS: {
          const { number, body } = params;
          if (number && body) {
            this.mOpenSMS(number, body);
          }
          break;
        }
        case DeepLinkPaths.OPEN_CTV: {
          BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.UI.BOTTOM_ACTION_HOME2);
          break;
        }
        case DeepLinkPaths.EVENT: {
          const { type, product } = params;
          if (type) {
            this.mLogEvent(type, product);
          }
          break;
        }
        case DeepLinkPaths.SHARE: {
          const { content } = params;

          if (content) {
            Share.share({ message: content })
              .then(() => {
                showInfoAlert(`Chia sẻ thành công "${content}"`);
              })
              .catch(() => {});
          }
          break;
        }
        case DeepLinkPaths.GEN_LINK_REF_AND_SHARE: {
          const { projectID } = params;
          if (projectID) {
            this.genLinkRefAndShare(projectID);
          }
          break;
        }
        case DeepLinkPaths.IN_APP_REVIEW: {
          this.inAppReview();
          break;
        }
        case DeepLinkPaths.BROWSER_OPEN: {
          const { url } = params;
          this.openBrowser(url);
          break;
        }
        case DeepLinkPaths.VN_PAY: {
          if (params) this.openVNPaySDK(params);
          break;
        }
        case DeepLinkPaths.POP_TO_TOP: {
          this.mPopToTop();
          break;
        }
        default:
          break;
      }
      // reset
      setTimeout(() => {
        store.dispatch(pendingOpenDeepLink());
      }, 50);
    } catch (error) {
      // reset
      setTimeout(() => {
        store.dispatch(pendingOpenDeepLink());
      }, 50);
    }
  };

  inAppReview = (funcCallBack) => {
    InAppReview(funcCallBack);
  };

  async genLinkRefAndShare(projectID) {
    const urlRef = await DigitelClient.genLinkReferral(projectID);
    if (urlRef) {
      Share.share({ message: urlRef })
        .then(() => {
          showInfoAlert(`Chia sẻ thành công "${urlRef}"`);
        })
        .catch(() => {});
    } else {
      showInfoAlert('Hệ thống đang bận vui lòng thử lại!!!');
    }
  }

  openBrowser = (url) => {
    try {
      Linking.openURL(url);
    } catch (error) {
      //
    }
  };

  async mOpenSingleChat(userID, message) {
    const { navigation } = this.params;
    try {
      FlutterService.openChat({
        chatUserId: userID,
      });
      // store.dispatch(setIsFetchingSingleChat(true));
      // const target = await DigitelClient.getUser(userID);
      // if (!target) throw Error();
      // store.dispatch(
      //   fetchConversationContacts((contacts) => {
      //     store.dispatch(setIsFetchingSingleChat(false));
      //     const listIds = contacts.map((item) => item.uid);
      //     if (listIds?.includes(target?.uid)) {
      //       navigation.navigate('Chat', { message });
      //       setTimeout(() => {
      //         store.dispatch(openChatWithUser(target));
      //       }, 10);
      //     } else {
      //       Linking.openURL(
      //         `${DEEP_LINK_BASE_URL}://open?view=CreateContactRequest&referralCode=${target?.referralCode}`,
      //       );
      //     }
      //   }),
      // );
    } catch (err) {
      const alert = formatString(strings.request_action_error, { action_name: 'mở Chat' });
      store.dispatch(setIsFetchingSingleChat(false));

      showAlert(alert);
    }
  }
  async mOpenGroupChat(threadID, message) {
    const { navigation } = this.params;
    try {
      FlutterService.openChat({
        threadId: threadID,
      });
      // const thread = await ChatManager.shared().getThread(threadID);
      // if (!thread) throw Error();
      // navigation.navigate('Chat', { message });
      // setTimeout(() => {
      //   store.dispatch(openChatWithThread(thread));
      // }, 10);
    } catch (err) {
      const alert = formatString(strings.request_action_error, { action_name: 'mở Chat' });
      showAlert(alert);
    }
  }

  async mJoinGroupChat(threadID, message) {
    const { navigation } = this.params;
    try {
      const myUser = store.getState().myUser;
      let thread = await ChatManager.shared().getThread(threadID);
      if (!thread) {
        throw Error();
      } else {
        if (thread.usersDetails) {
          const userIDs = Object.keys(thread?.usersDetails);
          const isJoined = userIDs.some((userId) => `user_${myUser?.uid}` === userId);
          if (isJoined) {
            navigation.navigate('Chat', { message: 'Hi' });
            setTimeout(() => {
              store.dispatch(openChatWithThread(thread));
            }, 10);
          } else {
            if (thread?.password) {
              const isJoinByLinkShare = true;
              navigation.navigate('Chat', { message: 'Hi', isJoinByLinkShare });
              setTimeout(() => {
                store.dispatch(openChatWithThread(thread));
              }, 10);
            } else {
              const members = [
                {
                  avatar: myUser?.avatarImage,
                  fullName: myUser?.fullName,
                  phone: myUser?.standardPhoneNumber,
                  uid: myUser?.uid,
                },
              ];
              const isJoinByLinkShare = true;
              await ChatManager.shared().addUsersToGroupThread(
                threadID,
                members,
                isJoinByLinkShare,
              );
              navigation.navigate('Chat', { message: 'Hi' });
              setTimeout(() => {
                store.dispatch(openChatWithThread(thread));
              }, 10);
            }
          }
        } else {
          throw Error();
        }
      }
    } catch (err) {
      const alert = formatString(strings.request_action_error, { action_name: 'mở Chat' });
      showAlert(alert);
    }
  }

  mOpenCallSupport = (url) => {
    const myUser = store.getState().myUser;

    const fullnames = myUser.fullNameNoDiacritics().split(' ');
    const fullnamesWithoutSpecialChar = fullnames.map((word) => word.replace(/\W/g, ''));
    const fullname = fullnamesWithoutSpecialChar.join(' ');

    this.mOpenCall({
      num: url,
      displayNum: strings.app_support,
      name: '',
      avatar: require('./img/support_call.png'),
      headerParams: {
        'X-appayName': fullname,
        'X-appayMobile': myUser.phoneNumber,
        'X-appayAcc': myUser.cmnd,
      },
    });
  };
  mOpenCall = ({
    num,
    hideNum,
    displayNum,
    avatar,
    name,
    headerParams,
    param1,
    param2,
    param3,
    param4,
    param5,
  }) => {
    const { navigation } = this.params;

    const myUser = store.getState().myUser;
    const validSIPAccount = myUser.SIPAccount && myUser.SIPAccount !== '';

    if (!validSIPAccount) {
      Communications.phonecall(num, true);
      return;
    }

    const navigateCall = () => {
      const headers = headerParams || {
        'X-Param1': param1,
        'X-Param2': param2,
        'X-Param3': param3,
        'X-Param4': param4,
        'X-Param5': param5,
      };
      store.dispatch(makeCall(num, headers));

      const user = new User();
      user.fullName = name;
      user.phoneNumber = displayNum || (hideNum ? `******${num.substr(num.length - 4)}` : num);
      user.avatar = avatar;
      setTimeout(() => {
        navigation.navigate('Call', { user });
      }, 5);
    };

    // navigateCall();
    checkMicroPermission()
      .then((isAuthorized) => {
        if (!isAuthorized) {
          throw Error();
        }
        navigateCall();
      })
      .catch((error) => {
        showAlertForRequestPermission(strings.micro_access_error_android);
      });
  };
  mGoBack = () => {
    const { navigation } = this.params;
    navigation.dispatch({ type: 'Navigation/BACK' });
  };
  mPopToTop = () => {
    const { navigation } = this.params;
    navigation.popToTop();
  };

  mHandleOpenView = (params) => {
    const { navigation } = this.params;
    const view = params.view;
    switch (view) {
      case DEEP_LINK_VIEW.account_setting_tab:
        this.mOpenAccountSetting(params);
        break;
      case DEEP_LINK_VIEW.os_setting:
        openOSSettings();
        break;
      case DEEP_LINK_VIEW.user_point:
        this.mOnAvailablePointPress();
        break;
      case DEEP_LINK_VIEW.home_shop:
        this.mOpenShop();
        break;
      case DEEP_LINK_VIEW.webview:
        this.mOpenWebview(
          params.url,
          params.title,
          params.injectFunc,
          params.hideHeader,
          params.isSafeView,
        );
        break;
      case DEEP_LINK_VIEW.survey:
        this.mOpenSurvey(params.campaignID, params.callbackURL, params.callbackTitle);
        break;
      case DEEP_LINK_VIEW.services:
        this.mOpenServices(params.firstSection);
        break;
      case DEEP_LINK_VIEW.news:
        this.mOpenNews(
          params.focusedTabIndex,
          params.useDeepLink,
          params.prefixDeeplink,
          params.url,
          params.title,
        );
        break;
      case DEEP_LINK_VIEW.os_ticket:
        this.mOpenOSTicket(params.screenMode, params.messageDefault);
        break;
      case DEEP_LINK_VIEW.app:
        this.mOpenApp(params.url);
        break;
      case DEEP_LINK_VIEW.customer:
        this.mOpenCustomer(params);
        break;
      default:
        if (view === FlutterService.module.mtrade.name) {
          FlutterService.openMTrade(params);
        } else if (view === FlutterService.name) {
          FlutterService.handleDeeplink(params);
        } else if (
          view === 'AccountIdentificationScreen' ||
          view === 'OldAccountIdentificationScreen'
        ) {
          store.dispatch(openAccountIdentification(navigation.navigate));
        } else if (view === 'Notification') {
          FlutterService.openMFast({
            path: '/notification',
          });
        } else {
          navigation.navigate(view, { params });
        }
        break;
    }
  };
  mOnAvailablePointPress = () => {
    const { navigation } = this.params;
    const title = 'Điểm tích lũy';
    const url = Configs.pointHistory;
    navigation.navigate('WebView', { mode: 0, title, url });
  };
  mOpenShop = () => {
    const { navigation } = this.params;
    navigation.navigate('Shop');
  };
  mOpenWebview = (url, title, injectFunc, hideHeader, isSafeView) => {
    const { navigation } = this.params;
    const decodeURL = decodeURIComponent(url);
    navigation.navigate({
      routeName: 'WebView',
      params: { mode: 0, title, url: decodeURL, injectFunc, hideHeader, isSafeView },
      key: url,
    });
  };
  mOpenSurvey = (campaignID, callbackURL, title) => {
    const { navigation } = this.params;
    navigation.dispatch({ type: 'Navigation/BACK' });
    navigation.navigate('Survey', { campaignID, callbackURL, title });
  };
  mOpenServices = (firstSection) => {
    const { navigation } = this.params;
    navigation.navigate('Services', { firstSection });
  };
  mOpenNews = (focusedTabIndex, useDeepLink, prefixDeeplink, nextUrl, title) => {
    const { navigation } = this.params;
    navigation.push('News', { focusedTabIndex, useDeepLink, prefixDeeplink, nextUrl, title });
  };
  mOpenOSTicket = (screenMode, messageDefault) => {
    const { navigation } = this.params;
    navigation.push('ChatFeedback', { screenMode, messageDefault });
  };
  mOpenApp = (url) => {
    Linking.openURL(url).catch((error) => {
      if (__DEV__) {
      }
    });
  };
  mOpenSMS(number, body) {
    const bodyDecode = decodeURIComponent(body);
    if (Platform.OS === 'android') {
      SendSMS.send({
        body: bodyDecode,
        recipients: [number],
        successTypes: ['sent'],
        allowAndroidSendWithoutReadPermission: true,
      });
    } else {
      const separator = Platform.OS === 'ios' ? '&' : '?';
      const content = `sms:${number}${separator}body=${bodyDecode}`;
      if (Linking.canOpenURL(content)) {
        Linking.openURL(content);
      }
    }
  }

  mOpenCustomer(params) {
    const { ...rest } = params;

    const { navigation } = this.params;

    try {
      navigation?.popToTop();
      navigation?.navigate('Customer', {
        ...rest,
      });
    } catch (error) {
      console.log(
        '\u001B[33m ai log ne \u001B[36m -> file: DeepLinkCenter.js -> line 497 -> error',
        error,
      );
    }
  }

  mOpenAccountSetting(params) {
    const { navigation } = this.params;
    try {
      navigation?.popToTop();
      BroadcastManager.shared().notifyObservers(
        BroadcastManager.NAME.UI.MAIN_TABBAR.ACCOUNT_SETTING_TAB,
      );
    } catch (error) {
      console.log(
        '\u001B[33m ai log ne \u001B[36m -> file: DeepLinkCenter.js -> line 497 -> error',
        error,
      );
    }
  }

  mLogEvent = (type = '', product = '') => {
    // flyersTrackEvent(type, product ? { product } : '');
  };

  openVNPaySDK = (vnp_Params) => {
    vnp_Params.vnp_IpAddr = '192.168.22.118';
    vnp_Params = sortObject(vnp_Params);
    let vnpUrl = Configs.vnpUrl;
    const signed = hmacSHA512(
      querystring.stringify(vnp_Params, { encode: false }),
      Configs.vnpHashSecret,
    ).toString();
    vnp_Params.vnp_SecureHash = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    VnpayMerchant.show({
      isSandbox: true,
      paymentUrl: vnpUrl,
      tmn_code: Configs.vnpTMNCode,
      backAlert: 'Bạn có chắc chắn trở lại ko?',
      title: 'VNPAY',
      iconBackName: 'ion_back',
      beginColor: 'ffffff',
      endColor: 'ffffff',
      titleColor: '000000',
      scheme: 'mfastmobile',
    });
  };
}

export default DeepLinkCenter;
