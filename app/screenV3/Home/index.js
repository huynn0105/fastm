import notifee, { TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Dimensions,
  Keyboard,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  View,
} from 'react-native';
import Communications from 'react-native-communications';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import BottomActionSheet from '../../components2/BottomActionSheet';
import CustomPopup from '../../components2/CustomPopup';
import { CARRIER_ITEMS, MOBILE_CARD_DATA_SOURCE } from '../../components2/Forms/MobileCardForm';
import UserList from '../../components2/UserList';
import GridList from '../../componentV3/GridList';
import withGuild from '../../componentV3/HOCs/withGuild';
import LoadingModal from '../../componentV3/LoadingModal';
import ModalUserGuide from '../../componentV3/ModalUserGuide/ModalUserGuide';
import PopupNickName from '../../componentV3/PopupNickName';
import PopupSurvey from '../../componentV3/PopupSurvey';
import { Configs, DEEP_LINK_BASE_URL, isDevelopment, MFConfigs } from '../../constants/configs';
import { AsyncStorageKeys, eventName } from '../../constants/keys';
import strings from '../../constants/strings';
import { SH, SW } from '../../constants/styles';
import NotificationManager from '../../manager/NotificationManager';
// import { flyersTrackEvent, FLYERS_EVENT, flyersUserID } from '../../utils/AppsFlyers';
import DigitelClient from '../../network/DigitelClient';
import {
  fetchFinancialServices,
  fetchMyUser,
  // fetchShopItems,
  getPromotionEvent,
  getSubscriptions,
  loadDatabaseData,
} from '../../redux/actions';
// v3
import {
  getListCTV,
  getListHighLightProducts,
  getPopupSurveyContent,
  getTimeChecking,
  submitPopupSurvey,
} from '../../redux/actions/actionsV3/userConfigs';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';
import { checkSystemStatus, pendingOpenDeepLink } from '../../redux/actions/app';
import { requestBadLoans } from '../../redux/actions/badLoans';
import { getContestItem } from '../../redux/actions/contest';
import {
  fetchListDistrict,
  updateCustomerForms,
  updateListDistrict,
  updateMobileCardCustomerForm,
} from '../../redux/actions/customerForm';
import { fetchDelMod } from '../../redux/actions/delMod';
import { fetchDPD } from '../../redux/actions/DPD';
import { fetchAppInfo, fetchInvitationInfo } from '../../redux/actions/general';
import { getHelpItem } from '../../redux/actions/help';
import { countUnReadKnowledges, getContests } from '../../redux/actions/knowledge';
import { fetchListFinance, fetchListFinanceFromLocal } from '../../redux/actions/listFinance';
import { fetchMobileCardPaymentURLData } from '../../redux/actions/mobileCardPayment';
import { homeNavigate, openLogin, openProfile } from '../../redux/actions/navigation';
import { countUnReadNoticeNews } from '../../redux/actions/news';
import { getAllNumUnreadNotiFb } from '../../redux/actions/notification';
import { getPopupBrandAfterLogin, setShowPopupBrand } from '../../redux/actions/popup';
import { fetchPostList } from '../../redux/actions/postList';
import { fetchPostTips, fetchPostTipsFromLocal } from '../../redux/actions/postTips';
import { fetchShopV2Items, loadShopV2FromLocal } from '../../redux/actions/shop';
import { initSIP, makeCall } from '../../redux/actions/sip';
import { fetchToolItems } from '../../redux/actions/tools';
import { addAccount, chooseUser, logout } from '../../redux/actions/user';
import { requestUserAppList } from '../../redux/actions/userApp';
import { requestUserAppLightList } from '../../redux/actions/userAppLight';
import DelModControl from '../../screens/Home/DelModControl';
import UserAppsControl from '../../screens/Home/UserAppsControl';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { SECTION_ID } from '../../screens2/Services';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import User from '../../submodules/firebase/model/User';
import { closeChat } from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import { logEvent } from '../../tracking/Firebase';
import isIphone12 from '../../utils/iphone12Helper';
import { checkMicroPermission } from '../../utils/PermissionWrapper';
import { showAlertForRequestPermission, showDevAlert } from '../../utils/UIUtils';
import { IS_ANDROID } from '../../utils/Utils';
import { TABS } from '../News/News.View';
import Bubble from './Bubble';
import ButtonNotify from './ButtonNotify';
// import PopupWelcome from '../../componentV3/PopupWelcome';
import {
  MAIN_CATEGORY_HEIGHT,
  MONEY_INFO_HEIGHT,
  PADDING_SPACE,
  SEARCH_HEIGHT,
  SLIDE_USER_GUILD,
  USER_INFO_HEIGHT,
} from './constants';
import ContentSection from './ContentSection';
import ContestBannerSwiper from './ContestBannerSwiper';
import DeepLinkCenter from './DeepLinkCenter';
// import { addContactForRefUser } from '../../redux/actions/conversationContact';
import DPDControl from './DPDControl';
import FinancesVertList from './FinancesVertList';
import FloatingButton from './FloatingButton';
import HeaderSection from './HeaderSection';
import HomeActionSheet, { ITEM_IDS } from './HomeActionSheet';
import ListToolsView from './ListToolsView';
import MainBanner from './MainBanner';
import MainCategory from './MainCategory';
import { MENU_ID } from './MainMenu/index';
import PopupReEKYC from './PopupReEKYC';
import ScrollMenu from './ScrollMenu';
import SearchBar from './SearchBar';
import SearchView from './SearchView';
import ShimmerLoading from './ShimmerLoading';
import ToolsControl from './ToolsControl';
import { UserInfoBanner } from './UserInfoBanner';
import FlutterService, { setShowMTradeCampaign } from './FlutterService';
import {
  FLUTTER_EVENT,
  LOG_EVENT,
  OPEN_VN_PAY,
  TRACKING_EVENT,
} from '../../screens2/Others/CommunicationKey';
import { listenerVNPay, openVNPay, removeListenerVNPay } from '../../utils/vnpayUtil';
import { getListMainBanner } from '../../redux/actions/actionsV3/mtradeAction';
import { FlutterEventKey } from './FlutterEventKey';

const SCREEN_SIZE = Dimensions.get('window');
const BACKGROUND_IMAGE_WIDTH = SCREEN_SIZE.width * 1.2;
const ZINDEX_FLOAT_BUTTON = 2000;
const PADDING_TOP_LIST = MONEY_INFO_HEIGHT + USER_INFO_HEIGHT - MAIN_CATEGORY_HEIGHT;
const INPUT_RANGE = [-50, 0, PADDING_TOP_LIST - PADDING_SPACE, PADDING_TOP_LIST];
export const MAX_HEIGHT_HEADER = PADDING_TOP_LIST;

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      carrierItems: CARRIER_ITEMS,
      mobileCardPaymentDataSource: MOBILE_CARD_DATA_SOURCE,
      needLoadStuff2: true,
      bubbleInfor: null,
      isShowBubble: false,
      isVisibleGuild: false,
      isShowUpdateNickName: false,
      showPopupSurvey: false,
      contentPopupSurvey: {},
      contentUserGuildHome: [...SLIDE_USER_GUILD],
      isVisibleNewGuild: false,
      showPopupHomeView: false,
      fadeHome: new Animated.Value(1),
      showSearch: new Animated.Value(0),
      zIndexValue: new Animated.Value(-1),
      keywordReceive: '',
      marginRightButton: new Animated.Value(SW(24)),
      canScroll: new Animated.Value(1),
      isFirstLogin: false,
      deeplinkAfterLogin: null,
      isVisibleHomeSearchScreen: false,
      // isVisibleWelcomePopup: false,
    };
    this.scrollY = 0;
    this.isCollapsed = false;
    this.isCollaping = false;
    this.canShowRefreshControl = false;
    this.searchBarRef = React.createRef();
    this.toolItemsRef = React.createRef();

    this.scrollDidEndScroll = false;
    this.campaignID = 0;
    this.toolList = [];
    this.toolListDescription = '';

    this.deepLinkCenter = new DeepLinkCenter({
      navigation: this.props.navigation,
    });

    if (!this.AnimatedScrollView) {
      this.AnimatedScrollView =
        Platform.OS === 'ios'
          ? Animated.createAnimatedComponent(KeyboardAwareScrollView)
          : Animated.ScrollView;
    }

    this.onLayoutDelayed = _.debounce(this.onLayoutSlidePos, 500);
    this.offsetSections = {};
    this.measureSections = {};
  }

  async componentDidMount() {
    setTimeout(() => {
      this.showPopupDelay();
    }, 4000);
    this.prefetchAPI();
    this.fetchBubbleInfor();
    this.props.getListHighLightProducts();

    this.subs = [this.props.navigation.addListener('didFocus', this.reloadWhenFocus)];

    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.UI.TABBAR_HOME,
      this,
      this.scrollToTop,
    );
    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.UI.MAIN_TABBAR.ACCOUNT_SETTING_TAB,
      this,
      this.onOpenAccountSetting,
    );

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);

    this.props.loadShopV2FromLocal();
    this.props.fetchListFinanceFromLocal();
    this.props.fetchPostTipsFromLocal();

    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification?.notification?.id) {
      this.props.navigation.navigate('Notification', {
        params: {
          isUnread: true,
        },
      });
      DeviceEventEmitter.emit('unread_notification', true);
    }
    // this.onSetDefaultNotification();
    if (this.props.myUser && this.props.myUser.isLoggedIn) {
      this.props.fetchDPD();
      this.handleOpenUserGuide();
    }
    this.listenerEventFlutter();
  }

  listenerEventFlutter = () => {
    FlutterService.listenerEvent(LOG_EVENT, (event) => {
      const data = JSON.parse(event);
      if (data?.eventName?.length) {
        logEvent(data?.eventName, { ...data?.data });
      }
    });
    FlutterService.listenerEvent(OPEN_VN_PAY, (event) => {
      try {
        const data = JSON.parse(event);
        openVNPay(data);
      } catch (error) {}
    });
    listenerVNPay();
    FlutterService.listenerEvent(TRACKING_EVENT, (event) => {
      const data = JSON.parse(event) || { eventName: '', logData: {} };
      if (data?.eventName?.length) {
        DigitelClient.trackEvent(
          data?.eventName,
          data?.lat,
          data?.lon,
          data?.param1,
          data?.param2,
          data?.param3,
          data?.param4,
          data?.param5,
          data?.extraParams,
        );
        logEvent(data?.eventName, data?.logData);
      }
    });
    FlutterService.listenerEvent(FLUTTER_EVENT, (event) => {
      const payload = JSON.parse(event);
      if (!payload?.key) return;

      switch (payload?.key) {
        case FlutterEventKey.logOut:
          this.props?.logout(true);
          break;
        case FlutterEventKey.refreshTimeChecking:
          this.props?.getTimeChecking();
          break;
        case FlutterEventKey.showMTradeCampaign:
          setShowMTradeCampaign(payload?.data?.value);
          break;
        default:
          break;
      }
    });
  };

  removeListenerEventFlutter = () => {
    FlutterService.removeListenerEvent(LOG_EVENT);
    FlutterService.removeListenerEvent(OPEN_VN_PAY);
    FlutterService.removeListenerEvent(TRACKING_EVENT);
    removeListenerVNPay();
  };

  showPopupDelay = async () => {
    this.setState({
      showPopupHomeView: true,
    });
  };

  fetchContentPopupSurvey = () => {
    try {
      const onSuccess = (payload) => {
        if (!this.state.isVisibleNewGuild) {
          this.setState({
            showPopupSurvey: true,
          });
        }
        this.setState({
          contentPopupSurvey: payload?.question,
        });
        this.campaignID = payload?.id;
      };
      this.props.fetchPopupSurveyContent(onSuccess);
    } catch (error) {
      console.log('xin chao', error);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    this.handleHomeNavigate(prevProps);
    this.handleOpenDeepLink(prevProps);
    setTimeout(() => {
      // set timeout for check user guide has done
      this.handleOpenDeepLinkAfterLogin(prevProps, prevState);
    }, 500);
  }
  shouldComponentUpdate(nextProps) {
    if (!this.state.needLoadStuff2) {
      if (_.isEqual(this.props.myUser, nextProps.myUser)) return false;
    }
    return true;
  }
  async componentWillReceiveProps(nextProps) {
    if (this.props.myUser.isLoggedIn !== nextProps.myUser.isLoggedIn) {
      setTimeout(() => {
        this.reloadWhenFocus();
        this.prefetchAPI();
        if (nextProps.myUser.isLoggedIn) {
          NotificationManager.shared();
          this.props.getPopupBrandAfterLogin();
          this.props.fetchDPD();
        }

        BroadcastManager.shared().notifyObservers('check_codepush');
      }, 500);

      if (nextProps.myUser.isLoggedIn) {
        this.handleOpenUserGuide();
      }
    }
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
    BroadcastManager.shared().removeObserver(BroadcastManager.NAME.UI.TABBAR_HOME, this);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.removeListenerEventFlutter();
  }

  handleOpenUserGuide = () => {
    AsyncStorage.getItem(AsyncStorageKeys.USER_GUIDE).then((value) => {
      const parseValue = JSON.parse(value);
      const isFirstLogin = !parseValue;
      this.setState({
        isFirstLogin,
      });
    });
  };

  handleCloseUserGuide = () => {
    this.setState({
      isFirstLogin: false,
    });
  };

  handleOpenDeepLink = (prevProps) => {
    const prevLink = prevProps.pendingOpenDeepLink;
    const curLink = this.props.pendingOpenDeepLink;
    const isLoggedIn = this.props.myUser.isLoggedIn;

    if (prevLink.id === curLink.id || !curLink.path) return;
    if (!isLoggedIn) {
      this.props.openLogin();
      this.setState({
        deeplinkAfterLogin: curLink,
      });
      return;
    }
    this.deepLinkCenter.processDeepLink(curLink);
  };

  handleOpenDeepLinkAfterLogin = (prevProps, prevState) => {
    // open deeplink after show user guide
    if (this.state.isFirstLogin !== prevState.isFirstLogin) {
      if (!this.state.isFirstLogin && this.state.deeplinkAfterLogin) {
        this.deepLinkCenter.processDeepLink(this.state.deeplinkAfterLogin);
        this.setState({
          deeplinkAfterLogin: null,
        });
      }
    }

    // open deeplink after login
    if (this.props.myUser.isLoggedIn !== prevProps.myUser.isLoggedIn) {
      if (this.props.myUser.isLoggedIn && !this.state.isFirstLogin) {
        this.deepLinkCenter.processDeepLink(this.state.deeplinkAfterLogin);
        this.setState({
          deeplinkAfterLogin: null,
        });
      }
    }
  };

  handleHomeNavigate(prevProps) {
    if (prevProps.homeNavigate === null) {
      return;
    }
    // const { screen: prevScreen } = prevProps.homeNavigate;
    const { screen, params } = this.props.homeNavigate;
    if (screen !== null) {
      this.props.setHomeNavigate();
      this.props.navigation.navigate({ routeName: screen, params, key: JSON.stringify(params) });
    }
  }

  fetchBubbleInfor = async () => {
    const bubbleInfor = await DigitelClient.getBubbleInfor();
    this.setState({ bubbleInfor, isShowBubble: !!bubbleInfor?.is_show });
  };

  onHideBubble = () => {
    this.setState({ isShowBubble: false });
  };

  onBubblePress = () => {
    const { bubbleInfor } = this.state;
    const openUrl = bubbleInfor?.open_url;
    if (bubbleInfor && openUrl) {
      if (this.isDeepLink(openUrl)) {
        Linking.openURL(openUrl);
      } else {
        this.props.setHomeNavigate('WebView', { mode: 0, title: '', url: openUrl });
      }
    }
  };

  initShowNickName = () => {
    const { myUser } = this.props;
    this.setState({ isShowUpdateNickName: !!myUser?.isRequiredNickname });
  };

  checkShowPopupSurvey = async () => {
    try {
      const listUsersSurvey = await AsyncStorage.getItem(AsyncStorageKeys.POPUP_SURVEY_USER);
      const _listUsersSurvey = JSON.parse(listUsersSurvey);
      const userIndex = _listUsersSurvey?.findIndex((user) => user?.uid === this.props.myUser?.uid);

      return _listUsersSurvey?.[userIndex];
    } catch (error) {
      if (__DEV__) {
        console.log('error', error);
      }
    }
  };

  checkIsToday = (date1, date2) => {
    if (date1.getDate() !== date2.getDate()) {
      return false;
    }
    return true;
  };

  reloadWhenFocus = async (forced = false) => {
    this.props.onReload();
    if (
      forced ||
      (!this.props.isGetSubscriptionsProcessing &&
        !this.props.isGettingBadLoans &&
        !this.props.isGettingUserAppList &&
        !this.props.isGettingUserAppLightList)
    ) {
      this.props.fetchAppInfo();
      this.props.fetchMyUser();

      this.props.getUserMetaData(async (payload) => {
        const data = await this.checkShowPopupSurvey();

        const timeDismiss = moment.unix(data?.timeDismiss).toDate();
        const today = moment().toDate();

        const isSameDay = this.checkIsToday(timeDismiss, today);

        if (!payload?.potential_skills && !isSameDay) {
          this.fetchContentPopupSurvey();
        }
      });

      const { onShowGuild } = this.props;
      if (onShowGuild) {
        onShowGuild();
      }
      const showNewGuild = await AsyncStorage.getItem(AsyncStorageKeys.NEW_USER_GUILD);
      if (!showNewGuild || JSON.parse(showNewGuild) !== 1) {
        this.setState({
          isVisibleNewGuild: true,
        });
      }
    }
    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }
    this.props.fetchListFinance();
    this.props.fetchShopV2();
    setTimeout(() => {
      this.props.checkSystemStatus();
      this.initShowNickName();
    });
  };

  prefetchAPI = () => {
    setTimeout(() => {
      this.props.getContests();
      this.props.fetchInvitationInfo();
      this.fetchDistrict();
      this.props.fetchPostList();
      this.props.fetchPostTips();
      this.props.fetchListFinance();
    }, 1000);
  };

  fetchDistrict = async () => {
    const districts = await AsyncStorage.getItem(AsyncStorageKeys.DISTRICT);
    if (districts) {
      this.props.updateListDistrict(JSON.parse(districts));
    } else {
      this.props.fetchListDistrict();
    }
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
    if (this.props.myUser.SIPAccount && this.props.myUser.SIPAccount !== '') {
      const navigateCall = () => {
        const headers = headerParams || {
          'X-Param1': param1,
          'X-Param2': param2,
          'X-Param3': param3,
          'X-Param4': param4,
          'X-Param5': param5,
        };
        this.props.makeCall(num, headers);
        const user = new User();
        user.fullName = name;
        user.phoneNumber = displayNum || (hideNum ? `******${num.substr(num.length - 4)}` : num);
        user.avatar = avatar;
        setTimeout(() => {
          this.props.navigation.navigate('Call', { user });
        }, 5);
      };

      checkMicroPermission()
        .then((isAuthorized) => {
          if (isAuthorized) {
            navigateCall();
          } else {
            showAlertForRequestPermission(strings.micro_access_error_android);
          }
        })
        .catch(() => {
          showAlertForRequestPermission(strings.micro_access_error_android);
        });
    } else {
      Communications.phonecall(num, true);
    }
  };

  getCollaboratorsLink = () => {
    return this.props.appInfo.mFastCollaborators;
  };
  getAddRefLink = () => {
    return this.props.appInfo.mFastNewCollaborator;
  };

  scrollToTop = () => {
    this.scrollToPosition(0, 0);
  };

  scrollToPosition = (x, y) => {
    if (Platform.OS === 'ios') {
      if (this?.scrollViewRef?.props) {
        this.scrollViewRef.props.scrollToPosition(x, y);
      }
    } else {
      if (this?.scrollViewRef?._component) {
        this.scrollViewRef._component.scrollTo({ x, y, animated: true });
      }
    }
  };

  refScrollViewIOS = (ref) => {
    if (Platform.OS === 'ios') this.scrollViewRef = ref;
  };
  refScrollViewAndroid = (ref) => {
    if (Platform.OS === 'android') this.scrollViewRef = ref;
  };

  // #region EVENTS

  onKeyboardDidShow = () => {
    // this.props.navigation.setParams({ visible: false });
  };

  onKeyboardDidHide = () => {
    // this.props.navigation.setParams({ visible: true });
  };

  onHomeAllRefresh = () => {
    this.canShowRefreshControl = true;
    this.prefetchAPI();
    this.reloadWhenFocus();
    this.fetchBubbleInfor();
    this.props.getListMainBanner();
    if (this.props.myUser && this.props.myUser.isLoggedIn) {
      this.props.fetchDPD();
    }
  };
  onAvailableMoneyPress = () => {
    logEvent('press_onAvailableMoneyPress');
    if (!this.props.myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }

    this.props.navigation.navigate('IncomeScreen');
  };
  onAvailablePointsPress = () => {
    logEvent('press_onAvailablePointsPress');
    if (!this.props.myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }
    const title = 'Điểm tích lũy';
    const url = Configs.pointHistory;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title,
      url,
      bgImage: require('./img/bg_point.png'),
    });
  };
  onWalletPress = () => {
    const { appInfo, navigation, myUser } = this.props;
    logEvent('event_press_wallet');
    if (!myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }
    const casa = appInfo?.casa;
    if (casa) {
      const { title, url } = casa;
      navigation.navigate('WalletScreen', { mode: 0, title, url });
    }
  };
  onMenuPress = (menuID) => {
    const { appInfo } = this.props;
    switch (menuID) {
      case MENU_ID.WITHDRAW:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'Rút tiền',
          url: MFConfigs.withdraw,
        });
        break;
      case MENU_ID.SHOP:
        this.props.navigation.navigate('Shop');
        break;
      case MENU_ID.REFERRAL:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'Giới thiệu KH',
          url: appInfo.mFastPredsaCustomer,
          bgImage: require('./img/bg_add_customer.png'),
        });
        break;
      case MENU_ID.COLLABORATOR:
        this.handlerOpenSheetRef();
        break;
      case MENU_ID.GUIDE:
        this.props.navigation.navigate('News');
        break;
      case MENU_ID.POLICY:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'Chính sách',
          url: MFConfigs.policy,
        });
        break;
      case MENU_ID.FINANCE:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'Tài chính',
          url: appInfo.mFastCustomer,
        });
        break;
      case MENU_ID.INSURANCE:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'Bảo hiểm',
          url: appInfo.insuranceCommonUrl,
        });
        break;
      case MENU_ID.UTILITIES:
        // this.props.navigation.navigate('Shop');
        this.props.navigation.navigate('Services', {
          firstSection: 'product',
          onHelpPress: this.onShopItemPress,
        });
        break;
      case MENU_ID.INTRODUCE_CUSTOMER:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'Hồ sơ KH',
          url: appInfo.mFastCustomer,
        });
        break;
      case MENU_ID.LIST_CUSTOMER:
        this.props.setHomeNavigate('WebView', {
          mode: 0,
          title: 'KH của bạn',
          url: appInfo.mFastYourCustomer,
        });
        break;
      default:
        break;
    }
  };
  onAllServicesPress = () => {
    this.props.navigation.navigate('Services', {
      firstSection: SECTION_ID.SERVICE,
      onHelpPress: this.onHelpItemPress,
    });
  };
  onAllShopPress = () => {
    this.props.navigation.navigate('Services', {
      firstSection: SECTION_ID.SHOP,
      onHelpPress: this.onHelpItemPress,
    });
  };
  onAllHelpPress = () => {
    this.props.navigation.navigate('Services', {
      firstSection: SECTION_ID.HELP,
      onHelpPress: this.onHelpItemPress,
    });
  };
  onSubItemPress = ({ title, url }) => {
    logEvent('press_news');
    logEvent(`press_news_${title}`);
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  onWelcomeUserPress = () => {
    if (this.props.myUser.isLoggedIn) {
      this.props.navigation.navigate('AccountSettingScreen');
    } else {
      this.props.navigation.navigate('LoginModal');
    }
  };

  onFullNamePress = () => {
    // if (this.userListSheetRef) this.userListSheetRef.open();
    if (this.props.myUser.isLoggedIn) {
      this.props.navigation.navigate('AccountSettingScreen');
    } else {
      this.props.navigation.navigate('LoginModal');
    }
  };

  onOpenAccountSetting = () => {
    if (this.props.myUser.isLoggedIn) {
      this.props?.getTimeChecking();
      this.props.navigation.navigate('AccountSettingScreen');
    } else {
      this.props.navigation.navigate('LoginModal');
    }
  };

  onCloseUserListPress = () => {
    if (this.userListSheetRef) this.userListSheetRef.close();
  };

  handlerOpenSheetRef = () => {
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

  onBottomSheetItemPress = (itemID) => {
    if (this.actionSheetRef) {
      this.actionSheetRef.close();
    }
    if (!this.props.myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }

    const invitation = this.props.invitationInfo;
    const appInfo = this.props.appInfo;

    setTimeout(() => {
      switch (itemID) {
        case ITEM_IDS.ADD_REFERRAL:
          this.props.setHomeNavigate('WebView', {
            mode: 0,
            title: 'Tạo tài khoản CTV',
            url: this.getAddRefLink(),
          });
          break;
        case ITEM_IDS.COLLABORATORS:
          // this.props.setHomeNavigate('WebView', {
          //   mode: 0,
          //   title: 'Danh sách CTV',
          //   url: this.getCollaboratorsLink()
          // });
          this.props.navigation.navigate('Collaborator');
          break;
        case ITEM_IDS.INTRODUCTION:
          this.props.navigation.navigate('WebView', {
            mode: 0,
            title: 'Hướng dẫn chi tiết',
            url: appInfo?.introductionUrl,
          });
          break;
        case ITEM_IDS.INSTALL_LINK:
          Share.share({ message: invitation.CTV_text });
          break;
        case ITEM_IDS.REF_CODE:
          try {
            Share.share({
              message: invitation.CTV_text2,
            });
          } catch (error) {
            if (__DEV__) {
              console.log('error', error);
            }
          }
          break;
        case ITEM_IDS.POLICY_COLLABORATOR:
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
          this.props.navigation.navigate('WebView', {
            mode: 0,
            title: 'Con đường huyền thoại',
            url: appInfo?.urlInfoNewModel,
          });
          break;
        default:
          break;
      }
    }, 450);
  };
  onUserAppPress = (userApp) => {
    const title = userApp.productName;
    const url = `${userApp.detailURL}`;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onUserAppLightPress = (userApp) => {
    const title = userApp.title;
    const url = `${userApp.url}`;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onBadLoanPress = (badLoan) => {
    const title = 'Chỉ số nợ xấu';
    const url = `${badLoan.url}`;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onDelModPress = ({ url, webviewTitle }) => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: webviewTitle,
      url,
    });
  };
  onYourWorkCardPress = ({ projectName, detailsURL }) => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: projectName,
      url: detailsURL,
    });
  };
  onPromotionEventPress = (event) => {
    this.onFloatingItemPress(event);
  };
  onHelpEventPress = (event) => {
    this.onFloatingItemPress(event);
  };
  onFloatingItemPress = (event) => {
    const title = event.title;
    const url = event.webviewURL;
    const type = event.type;
    if (type === 'SIP') {
      this.onOpenCallSupport(url);
    } else {
      this.props.navigation.navigate('WebView', { mode: 0, title, url });
    }
  };
  onHelpPress = (active) => {
    // this.setState({
    //   zIndexHelpButton: ZINDEX_FLOAT_BUTTON + 1,
    //   zIndexPromoteButton: ZINDEX_FLOAT_BUTTON,
    // });
    this.props.navigation.setParams({ visible: active });
  };
  onPromotePress = (active) => {
    // this.setState({
    //   zIndexHelpButton: ZINDEX_FLOAT_BUTTON,
    //   zIndexPromoteButton: ZINDEX_FLOAT_BUTTON + 1,
    // });
    this.props.navigation.setParams({ visible: active });
  };
  onOpenCallSupport = (url) => {
    const fullnames = this.props.myUser.fullNameNoDiacritics().split(' ');
    const fullnamesWithoutSpecialChar = fullnames.map((word) => word.replace(/\W/g, ''));
    const fullname = fullnamesWithoutSpecialChar.join(' ');

    this.mOpenCall({
      num: url,
      displayNum: strings.app_support,
      name: '',
      avatar: require('./img/support_call.png'),
      headerParams: {
        'X-appayName': fullname,
        'X-appayMobile': this.props.myUser.phoneNumber,
        'X-appayAcc': this.props.myUser.cmnd,
      },
    });
  };
  onAllNewsPress = () => {
    this.props.navigation.navigate('News', { focusedTabIndex: TABS.NEWS });
  };
  onCarrierItemPress = (_, selectedIndex) => {
    const { carrierItems } = this.state;
    const mappedCarrierItems = carrierItems.map((carrier, index) => {
      const isSelected = index === selectedIndex;
      return Object.assign({}, carrier, {
        isSelected,
      });
    });
    this.setState({
      carrierItems: mappedCarrierItems,
    });
    this.changeCarrierSheetRef.close();
  };
  onMobileCardItemPress = (_, selectedMobileCardItemIndex) => {
    const { mobileCardPaymentDataSource } = this.state;
    const mappedMobileCardDataSource = mobileCardPaymentDataSource.map((item, index) => {
      const isSelected = index === selectedMobileCardItemIndex;
      return Object.assign({}, item, { isSelected });
    });
    this.setState({
      mobileCardPaymentDataSource: mappedMobileCardDataSource,
    });
  };
  // Scroll handler
  onScrollEndDrag = () => {
    if (this.state.isFirstLogin) return null;

    if (this.scrollY > 0 && this.scrollY <= PADDING_TOP_LIST) {
      this.scrollDidEndScroll = true;
      // timeout for smooth scroll
      requestAnimationFrame(() => {
        if (this.scrollDidEndScroll) {
          this.collapseMenu(!this.isCollapsed);
        }
      });
    }
  };
  onMomentumScrollEnd = () => {
    if (this.state.isFirstLogin) return null;

    if (this.scrollY > 0 && this.scrollY <= PADDING_TOP_LIST) {
      this.scrollDidEndScroll = true;
      this.collapseMenu(!this.isCollapsed);
    }
  };
  collapseMenu = (isCollapsed) => {
    if (this.isCollaping) return;
    if (isCollapsed) {
      this.onScrollTo(PADDING_TOP_LIST + 22);
    } else {
      this.onScrollTo(0);
    }
    this.isCollapsed = isCollapsed;
    this.isCollaping = true;
    setTimeout(() => {
      this.isCollaping = false;
    }, 500);
  };
  handleScrollEvent = ({ nativeEvent }) => {
    this.scrollDidEndScroll = false;
    this.scrollY = nativeEvent.contentOffset.y;

    this.mainCategoryRef?.changeOffset(this.scrollY);

    if (this.scrollY >= PADDING_TOP_LIST) {
      this.isCollapsed = true;
    }

    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 10;
    const isCloseBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    this.mainCategoryRef?.setLastIndexActive(isCloseBottom);
  };

  onAddAccountPress = () => {
    this.userListSheetRef.close();
    this.props.addAccount();
  };
  onSwitchAccountPress = (user) => {
    this.userListSheetRef.close();
    this.props.chooseUser(user);
  };

  onToolItemPress = (item) => {
    // if (!this.props.myUser.isLoggedIn) {
    //   this.props.openLogin();
    //   return;
    // }
    // eslint-disable-next-line camelcase
    const { url, webview_title } = item;
    logEvent(`press_tool_${webview_title}`);
    if (url.includes('vn/FEEDBACK')) {
      this.props.navigation.navigate('ChatFeedbackHome');
    } else if (url.includes('vn/REPORT')) {
      this.props.navigation.navigate('ReportDashboard');
    } else if (url.includes('vn/BH_TOOL')) {
      this.props.navigation.navigate('EmployeeCard');
    } else {
      this.props.navigation.navigate('WebView', { mode: 0, title: webview_title, url });
    }
  };

  onShopItemPress = (item, alias) => {
    const { url, title, tag_name, url_title } = item;

    if (tag_name === 'UNG_TUYEN_NGHIEP_VU') {
      logEvent(eventName.VIEW_APPLY_JOB);
    }
    logEvent(`press_${alias}`, { tag_name });
    if (url.startsWith(DEEP_LINK_BASE_URL)) {
      Linking.openURL(url);
    } else {
      if (tag_name === 'ECOM_AFFILIATE' || tag_name === 'DIGITAL_LEAD') {
        let _title = encodeURIComponent(title);
        let _url = encodeURIComponent(encodeURIComponent(url));
        FlutterService.handleDeeplink({
          name: '',
          path: `/webview?title=${_title}&url=${_url}`,
        });
        return;
      }
      const sectionShowNotificationButton = ['finance', 'bank', 'insurance'];
      const isShowNotificationButton = sectionShowNotificationButton?.includes(alias);
      const indexTabNotification =
        alias === 'finance' ? 2 : alias === 'bank' ? 3 : alias === 'insurance' ? 4 : 0;
      const params = {
        mode: 0,
        title: url_title,
        url,
        isShowNotificationButton,
        indexTabNotification,
      };
      console.log('aaa-31', JSON.stringify(params));
      this.props.navigation.navigate('WebView', params);
    }
  };

  onAllPress = (item) => {
    const { appInfo } = this.props;
    console.log('aaa-33', JSON.stringify(item));
    if (item?.action_press_all === 'OPEN_BOTTOM_SHEET') {
      const dataTool = this.getTool(item?.cat_alias);
      this.toolList = dataTool?.tools || [];
      this.toolListDescription = dataTool?.cat_description || '';

      this.toolItemsRef.current.open(dataTool?.tools_title || '');
    } else if (item?.urlAllItemPress?.length > 0) {
      this.props.setHomeNavigate('WebView', {
        mode: 0,
        title: 'Bảo hiểm',
        url: item?.urlAllItemPress,
      });
    } else {
      this.props.navigation.navigate('Services', {
        firstSection: item.cat_alias,
        onHelpPress: this.onShopItemPress,
      });
    }
  };

  onAllToolsBottomSheetPress = (item) => {
    this.props.setHomeNavigate('WebView', {
      mode: 0,
      title: item?.url_title,
      url: item?.url,
    });
  };

  onAllContestPress = () => {
    this.props.navigation.navigate('News', { focusedTabIndex: 2 });
  };

  onPressOpenTabNews = (focusTabIndex) => {
    this.props.navigation.navigate('News', {
      focusedTabIndex: isDevelopment ? 1 : 0,
      tabNewsIndex: focusTabIndex ? focusTabIndex : 0,
    });
  };

  isDeepLink(url) {
    return url && (url.startsWith(`${DEEP_LINK_BASE_URL}://`) || url.startsWith('tel:'));
  }

  onPressBanner = (item) => {
    if (this.isDeepLink(item.url)) {
      Linking.openURL(item.url);
      return false;
    }
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: item.url_title || '',
      url: item.url,
    });
  };

  scrollToOffsetTopForm = () => {
    setTimeout(() => {
      if (this.scrollViewRef) {
        this.scrollToPosition(0, MAX_HEIGHT_HEADER * 1.8);
      }
    }, 300);
  };

  onPreFocusDistrictTextInput = () => {
    if (this.scrollViewRef) {
      this.scrollToPosition(0, MAX_HEIGHT_HEADER * 3.1);
    }
  };

  onPressItemFinance = (item) => {
    if (this.isDeepLink(item.url)) {
      Linking.openURL(item.url);
      return false;
    }
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: item?.url_title || item?.title || '',
      url: item.url,
    });
  };

  getNextSunday = () => {
    const dayINeed = 7; // for Sunday
    const today = moment().isoWeekday();

    if (this.props.myUser.uid === '1240469574') {
      return moment().add(1, 'minute').valueOf();
    }

    // if we haven't yet passed the day of the week that I need:
    if (today <= dayINeed) {
      // then just give me this week's instance of that day
      return moment().isoWeekday(dayINeed).set({ hour: 20, minute: 0, second: 0 }).valueOf();
    } else {
      // otherwise, give me *next week's* instance of that same day
      return moment()
        .add(1, 'weeks')
        .isoWeekday(dayINeed)
        .set({ hour: 20, minute: 0, second: 0 })
        .valueOf();
    }
  };

  onSetDefaultNotification = (
    totalUnReadAdminNotifications = this.props?.totalUnReadAdminNotifications,
    isLoggedIn = this?.props?.myUser.isLoggedIn,
  ) => {
    if (Number(totalUnReadAdminNotifications || 0) > 0 && isLoggedIn) {
      notifee.getTriggerNotificationIds().then(async (ids) => {
        if (ids.includes('unread_notification')) {
          return;
        }
        const time = this.getNextSunday();
        const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: time,
        };

        await notifee.createTriggerNotification(
          {
            id: 'unread_notification',
            title: 'Bạn có các tin nhắn trong tuần chưa xem',
            body: 'Khám phá ngay để không bỏ lỡ bất kỳ tin tức/thông báo mới nhất trên MFast nhé!',
            android: {
              channelId: 'mfast_channel',
              pressAction: {
                launchActivity: 'default',
                id: 'default',
              },
            },
          },
          trigger,
        );
      });
    } else if (!isLoggedIn || Number(totalUnReadAdminNotifications || 0) <= 0) {
      this.onCancelDefaultNotification();
    }
  };

  onCancelDefaultNotification = () => {
    notifee.getTriggerNotificationIds().then(async (ids) => {
      if (ids.includes('unread_notification')) {
        await notifee.cancelNotification('unread_notification');
      }
    });
  };

  // --------------------------------------------------
  // RENDER METHODS
  // --------------------------------------------------
  renderDelMod = () => {
    return this.props.delMod && this.props.delMod.title ? (
      <DelModControl delMod={this.props.delMod} onItemPress={this.onDelModPress} />
    ) : null;
  };
  renderUserAppList = () => {
    const { userAppList, userAppLightList } = this.props;
    return userAppList.length > 0 || userAppLightList.length > 0 ? (
      <UserAppsControl
        data={userAppList}
        lightData={userAppLightList}
        extraData={userAppList}
        onItemPress={this.onUserAppPress}
        onItemLightPress={this.onUserAppLightPress}
      />
    ) : null;
  };

  onLayoutSlidePos = (event) => {
    const { y } = event.nativeEvent.layout;
    const temp = [...this.state.contentUserGuildHome];
    temp[0].yPos = y;
    // temp[0].childComponent = () => {
    //   return this.renderBadLoan();
    // };
    this.setState({
      contentUserGuildHome: [...temp],
      // isVisibleNewGuild: true
    });
  };

  renderBadLoan = (isGuild = false) => {
    const { DPD, listFinance } = this.props;
    return (
      <View onLayout={(event) => this.onLayoutSlidePos(event)}>
        <View>
          <HeaderSection
            isGuild={isGuild}
            style={{ margin: 16, marginBottom: 0 }}
            title={listFinance?.title}
            note={listFinance?.note}
            labelRight={'Chính sách'}
            onAllPress={() => {
              this.props.setHomeNavigate('WebView', {
                mode: 0,
                title: 'Chính sách',
                url: MFConfigs.policy,
              });
            }}
          />
        </View>

        {!!DPD?.items?.length > 0 && <DPDControl navigation={this.props.navigation} />}
        <FinancesVertList data={listFinance?.items} onPressItem={this.onPressItemFinance} />
      </View>
    );
  };

  onLayoutShop = (event, item) => {
    if (!item) return;
    const { y } = event.nativeEvent.layout;
    const temp = [...this.state.contentUserGuildHome];
    const index = item.cat_alias === 'bank' ? 1 : item.cat_alias === 'insurance' ? 2 : -1;
    if (index > 0 && y > 0) {
      temp[index].yPos = y;
      temp[index].childComponent = () => {
        return (
          <ScrollView scrollEnabled={false}>
            <View key={`${item.cat_title}`}>
              <HeaderSection
                isGuild={true}
                style={{ margin: SW(12), marginTop: 0, marginBottom: 0 }}
                title={item.cat_title}
                onAllPress={() => this.onAllPress(item)}
                note={item?.note}
                labelRight={'Tất cả'}
              />
              <View style={{ flex: 1 }}>
                <GridList
                  items={item.items}
                  navigation={this.props.navigation}
                  onPressItem={() => {}}
                  alias={item?.cat_alias}
                />
              </View>
            </View>
          </ScrollView>
        );
      };
      this.setState({
        contentUserGuildHome: [...temp],
      });
    }
  };

  renderMainCategory() {
    const { shopV2Items, insets } = this.props;

    const opacity = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [0, 0, 1, 1],
    });
    const zIndexValue = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [-1, -1, 1, 1],
    });

    const data = [
      { cat_alias: 'TIPS', cat_title: 'Mẹo dành cho bạn' },
      ...shopV2Items?.filter((it) => it?.position === 'top'),
      ...shopV2Items?.filter((it) => it?.position === 'bottom'),
      { cat_alias: 'NEWS', cat_title: 'Tin tức, khuyến mãi' },
    ];

    return (
      <MainCategory
        data={data}
        ref={(ref) => {
          this.mainCategoryRef = ref;
        }}
        offsetSections={this.offsetSections}
        onPress={(key) => {
          this?.scrollViewRef?.scrollTo?.({
            y: (this.offsetSections[key] || 0) + 1,
          });
        }}
        opacity={opacity}
        zIndexValue={zIndexValue}
        insets={insets}
      />
    );
  }

  renderContent = (position, onPress) => {
    const { shopV2Items, myUser } = this.props;

    const data = shopV2Items.filter((item) => item.position === position);
    return data?.length ? (
      data.map((item) => {
        if (item?.cat_alias === 'contest') {
          return this.renderSwiperBanner();
        }
        if (item?.cat_alias === 'post') {
          return this.renderNews();
        }
        return (
          <View
            animation={'fadeIn'}
            duration={2250}
            onLayout={(event) => {
              this.offsetSections[item?.cat_alias] = event.nativeEvent.layout.y + PADDING_TOP_LIST;
              this.onLayoutShop(event, item);
              this.measureSections[item?.cat_alias] = event.nativeEvent.layout;
              this?.userGuideRef?.setMeasureSections(this.measureSections);
            }}
          >
            <ContentSection
              item={item}
              navigation={this.props.navigation}
              onPress={onPress}
              onAllPress={() => this.onAllPress(item)}
            />
          </View>
        );
      })
    ) : (
      <ShimmerLoading />
    );
  };
  renderNews = () => {
    const { postList } = this.props;
    if (!postList || postList.length === 0) {
      return null;
    }

    const data = postList.map((post) => ({
      title: post.postTitle,
      image: post.postImage,
      detailsURL: post.webURL,
    }));

    return (
      <View
        onLayout={(e) => {
          this.offsetSections.post = e.nativeEvent.layout.y + PADDING_TOP_LIST;
        }}
      >
        <HeaderSection
          style={{ margin: 16, marginBottom: 12, marginTop: 32 }}
          title={'Tin tức, khuyến mãi'}
          onAllPress={() => this.onPressOpenTabNews(0)}
          labelRight={'Tất cả'}
        />
        <ScrollMenu
          style={{ paddingHorizontal: 16 }}
          dataSources={data
            .map((item) => ({
              icon: { uri: item.image },
              title: item.title,
              url: item.detailsURL,
            }))
            .slice(0, 5)}
          onPress={this.onSubItemPress}
        />
      </View>
    );
  };

  renderTips = () => {
    const { postTips } = this.props;

    if (!postTips || postTips.length === 0) {
      return null;
    }

    const data = postTips.map((post) => ({
      title: post.postTitle,
      image: post.postImage,
      detailsURL: post.webURL,
    }));

    return (
      <View
        onLayout={(e) => {
          this.offsetSections.tip = e.nativeEvent.layout.y + PADDING_TOP_LIST;
        }}
      >
        <HeaderSection
          style={{ margin: 12, marginBottom: 0, marginTop: 22 }}
          title={'Mẹo dành cho bạn'}
          onAllPress={() => this.onPressOpenTabNews(5)}
          labelRight={'Tất cả'}
        />
        <ScrollMenu
          style={{ paddingHorizontal: 16 }}
          type={'TIPS'}
          dataSources={data
            .map((item) => ({
              icon: { uri: item.image },
              title: item.title,
              url: item.detailsURL,
            }))
            .slice(0, 5)}
          onPress={this.onSubItemPress}
        />
      </View>
    );
  };

  renderSwiperBanner = () => {
    const { contests } = this.props;
    const isShowlistBanner =
      contests && Array.isArray(contests.processing) && contests.processing.length > 0;
    if (!isShowlistBanner)
      return (
        <View
          onLayout={(e) => {
            this.offsetSections.contest = e.nativeEvent.layout.y + PADDING_TOP_LIST;
          }}
        />
      );
    const list = [];
    contests.processing.map((categories) => categories.items.map((item) => list.push(item)));
    return (
      <View
        onLayout={(e) => {
          this.offsetSections.contest = e.nativeEvent.layout.y + PADDING_TOP_LIST;
        }}
      >
        <HeaderSection
          style={{ margin: 16, marginBottom: 12, marginTop: 32 }}
          title={'Chương trình thi đua'}
          onAllPress={this.onAllContestPress}
          labelRight={'Tất cả'}
        />
        <ContestBannerSwiper
          dataSource={list}
          onBannerItemPress={(item) => {
            this.onPressBanner(item);
          }}
        />
      </View>
    );
  };
  renderFinancialServices = () => {
    const { financialServiceItems } = this.props;
    return (
      <View>
        <HeaderSection
          style={{ margin: 16, marginBottom: 0, marginTop: 0 }}
          title={'Dịch vụ tài chính'}
          onAllPress={this.onAllServicesPress}
          labelRight={'Tất cả'}
        />
        <GridList
          maxRows={2}
          navigation={this.props.navigation}
          title={''}
          items={financialServiceItems}
          onPressItem={this.onSubItemPress}
        />
      </View>
    );
  };
  renderMainMenu = () => {
    const { myUser, appInfo } = this.props;
    const opacitySearchBar = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [1, 1, 0, 0],
    });
    const zIndexValue = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [1, 1, -1, -1],
    });
    const translateY = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [0, 0, -SH(60), -SH(60)],
    });

    const opacityBalanceView = this.state.showSearch.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    if (this.state.isFirstLogin) return null;

    return (
      <MainBanner
        isShowGift={myUser?.insPromotionTurnCount > 0}
        navigation={this.props.navigation}
        onAvailableMoneyPress={this.onAvailableMoneyPress}
        onAvailablePointsPress={this.onAvailablePointsPress}
        onMenuPress={this.onMenuPress}
        myUser={myUser}
        walletInfo={appInfo.casa}
        opacityValue={opacitySearchBar}
        onWalletPress={this.onWalletPress}
        translateY={translateY}
        zIndexValue={zIndexValue}
        opacityBalanceView={opacityBalanceView}
      />
    );
  };

  getInsetTop = () => {
    return this.props.insets.top || PADDING_SPACE;
  };

  renderHeaderBackground() {
    const maxHeightImage =
      this.getInsetTop() + SEARCH_HEIGHT + USER_INFO_HEIGHT + MONEY_INFO_HEIGHT / 2;
    const minHeightImage = this.getInsetTop() + SEARCH_HEIGHT + PADDING_SPACE;

    const heightImage = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [maxHeightImage, maxHeightImage, minHeightImage, minHeightImage],
    });

    const subtractHeight = this.state.showSearch.interpolate({
      inputRange: [0, 1],
      outputRange: [0, minHeightImage + PADDING_SPACE * 2],
    });

    return (
      <Animated.View
        style={{
          flex: 1,
          position: 'absolute',
          bottom: 0,
          left: 0,
          top: 0,
          width: BACKGROUND_IMAGE_WIDTH,
          right: 0,
          minHeight: minHeightImage,
          height: Animated.subtract(heightImage, subtractHeight),
          borderRadius: 0,
        }}
      >
        <Animated.Image
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            width: SCREEN_SIZE.width,
            height: '100%',
          }}
          resizeMode="stretch"
          source={require('./img/header_bg.png')}
        />
      </Animated.View>
    );
  }

  renderButtonNotify = () => {
    const backgroundColor = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [
        'rgba(255,255,255, 0.2)',
        'rgba(255,255,255, 0.2)',
        'rgba(255,255,255, 0)',
        'rgba(255,255,255, 0)',
      ],
    });
    const top = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [
        USER_INFO_HEIGHT / 2 + SEARCH_HEIGHT / 2,
        USER_INFO_HEIGHT / 2 + SEARCH_HEIGHT / 2,
        0,
        0,
      ],
    });
    const size = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [SH(36), SH(36), SH(24), SH(24)],
    });

    const opacityBalanceView = this.state.showSearch.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const zIndex = this.state.showSearch.interpolate({
      inputRange: [0, 1],
      outputRange: [9, 0],
    });

    return (
      <ButtonNotify
        navigation={this.props.navigation}
        isLoggedIn={this?.props?.myUser?.isLoggedIn}
        totalUnReadSystemNotifications={this.props?.totalUnReadSystemNotifications}
        totalUnReadAdminNotifications={this.props?.totalUnReadAdminNotifications}
        backgroundColor={backgroundColor}
        size={size}
        top={USER_INFO_HEIGHT / 2 + SEARCH_HEIGHT / 2}
        opacity={opacityBalanceView}
        zIndex={zIndex}
      />
    );
  };

  renderSearchBar = () => {
    const isLoggedIn = this?.props?.myUser?.isLoggedIn;
    const maxWidthSearchBar = SW(343);
    const minWidthSearchBar = isLoggedIn ? SW(255) : SW(305);

    const widthSearchBar = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [maxWidthSearchBar, maxWidthSearchBar, minWidthSearchBar, minWidthSearchBar],
    });
    const zIndexCloseButton = this.state.fadeHome.interpolate({
      inputRange: [0, 1],
      outputRange: [99, -1],
    });
    return (
      <SearchBar
        ref={this.searchBarRef}
        onFocusInput={this.onFocusInput}
        onCloseSearchView={this.onCloseSearchView}
        onGetKeyword={this.onGetKeyword}
        inputKeyword={this.state.keywordReceive}
        isVisibleHomeSearchScreen={this.state.isVisibleHomeSearchScreen}
        widthSearchBar={widthSearchBar}
        onResetKeyword={this.resetKeyword}
        zIndexCloseButton={zIndexCloseButton}
        insets={this.props.insets}
        isLoggedIn={isLoggedIn}
      />
    );
  };
  renderUserInfo = () => {
    const opacitySearchBar = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [1, 1, 0, 0],
    });

    const translateY = this.state.scrollY.interpolate({
      inputRange: INPUT_RANGE,
      outputRange: [0, 0, -SH(60), -SH(60)],
    });

    const opacityBalanceView = this.state.showSearch.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const { myUser, userMetaData, hierInfoUser } = this.props;

    return (
      <UserInfoBanner
        userMetaData={userMetaData}
        myUser={myUser}
        onWelcomeUserPress={this.onWelcomeUserPress}
        onFullNamePress={this.onFullNamePress}
        opacitySearchBar={opacitySearchBar}
        translateY={translateY}
        opacityBalanceView={opacityBalanceView}
        hierInfoUser={hierInfoUser}
        insets={this.props.insets}
        onAvailableMoneyPress={this.onAvailableMoneyPress}
      />
    );
  };
  renderBottomActionSheet = () => {
    return (
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
            />
          </View>
        )}
        // onClose={this.onCloseBottomSheet}
        // onOpen={this.onOpenBottomSheet}
      />
    );
  };

  renderRightFloatingButton = () => {
    const { contestItem, activeTabbar } = this.props;
    // const { zIndexPromoteButton } = this.state;
    return (
      <FloatingButton
        position={'right'}
        title={contestItem.title}
        items={contestItem.items}
        zIndexButton={ZINDEX_FLOAT_BUTTON}
        activeTabbar={activeTabbar}
        imageURL={contestItem.imageURL}
        onRootPress={this.onPromotePress}
        onItemPress={this.onPromotionEventPress}
      />
    );
  };
  renderLeftFloatingButton = () => {
    const { helpItem, activeTabbar } = this.props;
    // const { zIndexHelpButton } = this.state;
    return (
      <FloatingButton
        position={'left'}
        title={helpItem.title}
        items={helpItem.items}
        zIndexButton={ZINDEX_FLOAT_BUTTON}
        activeTabbar={activeTabbar}
        imageURL={helpItem.imageURL}
        onRootPress={this.onHelpPress}
        onItemPress={this.onHelpEventPress}
      />
    );
  };

  renderToolControl = () => {
    return this.props.myUser && this.props.myUser.isLoggedIn && this.props.toolItems ? (
      <View>
        <HeaderSection
          style={{ margin: 16, marginBottom: 0 }}
          title={'Tiện ích'}
          onAllPress={this.onAllHelpPress}
          labelRight={'Tất cả'}
        />
        <ToolsControl
          hideTitle
          toolItems={this.props.toolItems}
          onItemPress={this.onToolItemPress}
        />
      </View>
    ) : null;
  };

  renderHelpItems = () => {
    const { items = [] } = this.props.helpItem;
    if (items.length === 0) return null;

    const mappedItems = items.map((item) => ({
      ...item,
      icon: item.imageURL,
      title: item.title,
    }));

    return (
      <View>
        <HeaderSection
          style={{ margin: SW(16), marginBottom: 0 }}
          title={'Tiện ích'}
          onAllPress={this.onAllHelpPress}
          labelRight={'Tất cả'}
        />
        <GridList items={mappedItems} onPressItem={this.onHelpItemPress} />
      </View>
    );
  };
  renderUserList = () => {
    const { myUser, navigation } = this.props;
    return (
      <CustomPopup
        ref={(ref) => {
          this.userListSheetRef = ref;
        }}
        render={() => (
          <UserList
            myUser={myUser}
            onClosePress={this.onCloseUserListPress}
            onAddAccountPress={this.onAddAccountPress}
            onSwitchAccountPress={this.onSwitchAccountPress}
            navigation={navigation}
          />
        )}
        position={'TOP'}
        canClose
      />
    );
  };

  renderShop = () => {
    const { shopItems, fetchingShopItems } = this.props;

    return (
      <View style={{ marginTop: SH(16) }}>
        <GridList
          title={'Dịch vụ mua sắm'}
          items={shopItems}
          loading={fetchingShopItems}
          navigation={this.props.navigation}
          onPressItem={this.onShopItemPress}
        />
      </View>
    );
  };

  onPressCloseModalBrand = () => {
    this.props.setShowPopupBrand(false);
  };

  onClosPopupeUpdateNickName = () => {
    this.setState({ isShowUpdateNickName: false }, () => {
      this.props.fetchMyUser();
    });
  };

  onCloseModalGuild = () => {
    this.setState({ isVisibleGuild: false }, async () => {
      await AsyncStorage.setItem(AsyncStorageKeys.GUILD_SHOW, '1');
    });
  };

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  renderPopupBrand = () => {
    const { userMetaData, DPD, popupBrand } = this.props;

    const { contentPopupSurvey, showPopupSurvey, isVisibleNewGuild } = this.state;
    // if (isVisibleNewGuild) {
    //   // return null;
    //   return (
    //     <PopupUserGuildHome
    //       isVisible={isVisibleNewGuild}
    //       onClose={this.onCloseNewGuild}
    //       onNextStep={this.onNextStepNewUserGuild}
    //       contentUserGuildHome={this.state.contentUserGuildHome}
    //       hasDPD={!!DPD?.items?.length}
    //       navigation={this.props.navigation}
    //     />
    //   );
    // } else
    if (contentPopupSurvey && showPopupSurvey) {
      const contentStep2 = [];
      for (let i = 1; i < contentPopupSurvey.length; i++) {
        contentStep2.push(contentPopupSurvey[i]);
      }

      return (
        <PopupSurvey
          isVisible={showPopupSurvey}
          contentStep1={contentPopupSurvey?.[0]}
          onAnswer={this.sendAnswerSurvey}
          onDismiss={this.dismissSurvey}
          dismissTitle={contentPopupSurvey?.[0]?.dismissTitle}
          actionTitle={contentPopupSurvey?.[0]?.actionTitle}
          numberOfButtons={contentPopupSurvey?.[0]?.numberOfButtons || 1}
          userMetaData={userMetaData}
          contentStep2={contentStep2}
        />
      );
    }
    if (popupBrand && popupBrand?.data && this.props.myUser.isLoggedIn) {
      const { data } = popupBrand;
      if (!data) return;
      if (data?.rightButtonUrl?.length > 0) {
        return <PopupReEKYC data={data} navigation={this.props.navigation} />;
      } else {
        return null;
        // <PopupBrand isVisible={isShow} data={data} onPressClose={this.onPressCloseModalBrand} />
      }
    }
  };

  sendAnswerSurvey = (value, callback, isVerified) => {
    if (isVerified) {
      this.props.submitPopupSurvey(this.campaignID, value, () => {
        this.setState({
          showPopupSurvey: false,
        });
        callback();
      });
    } else {
      callback();
    }
  };

  dismissSurvey = async () => {
    try {
      const { myUser } = this.props;

      const userDismissSurvey = {
        uid: myUser?.uid,
        timeDismiss: moment().unix(),
      };

      const listUsersSurvey = await AsyncStorage.getItem(AsyncStorageKeys.POPUP_SURVEY_USER);
      const _listUsersSurvey = JSON.parse(listUsersSurvey);
      const arrayUser = _listUsersSurvey?.length > 0 ? _listUsersSurvey : [];

      const indexUser = arrayUser.findIndex((user) => user?.uid === userDismissSurvey?.uid);
      if (indexUser !== -1) {
        arrayUser.map(async (user) => {
          if (user.uid === myUser.uid) {
            user.timeDismiss = moment().unix();
          }
          return user;
        });
      } else {
        arrayUser.push(userDismissSurvey);
      }
      await AsyncStorage.setItem(AsyncStorageKeys.POPUP_SURVEY_USER, JSON.stringify(arrayUser));

      this.setState({
        showPopupSurvey: false,
      });
    } catch (error) {
      console.log('hello errorr', error);
    }

    // const listUsersSurvey= await AsyncStorage.getItem(AsyncStorageKeys.POPUP_SURVEY_USER);
    // const _listUsersSurvey = JSON.parse
  };

  onCloseNewGuild = async () => {
    await AsyncStorage.setItem(AsyncStorageKeys.NEW_USER_GUILD, '1');
    setTimeout(() => {
      this.setState({
        isVisibleNewGuild: false,
        isVisibleWelcomePopup: true,
      });

      this.props.getUserMetaData(async (payload) => {
        const data = await this.checkShowPopupSurvey();

        const timeDismiss = moment.unix(data?.timeDismiss).toDate();
        const today = moment().toDate();

        const isSameDay = this.checkIsToday(timeDismiss, today);

        if (!payload?.potential_skills && !isSameDay) {
          this.fetchContentPopupSurvey();
        }
      });
    }, 1000);
  };

  // onCloseWelcomePopup = () => {
  //   this.setState({
  //     isVisibleWelcomePopup: false
  //   });
  // }

  onNextStepNewUserGuild = (index) => {
    setTimeout(() => {
      if (this.scrollViewRef) {
        this.scrollToPosition(
          0,
          MAX_HEIGHT_HEADER -
            (isIphone12() || isIphoneX() ? SH(40) : 0) +
            this.state.contentUserGuildHome?.[0]?.yPos +
            this.state.contentUserGuildHome?.[index]?.yPos,
        );
      }
    }, 100);
  };

  onFocusInput = () => {
    this.setState({
      isVisibleHomeSearchScreen: true,
    });
    this.scrollViewRef?.setNativeProps({
      scrollEnabled: false,
    });
    this.scrollViewRef.scrollTo({ y: 0, animation: false });
    Animated.timing(this.state.marginRightButton, {
      toValue: SW(84),
      duration: 400,
    }).start();
    Animated.timing(this.state.canScroll, {
      toValue: 0,
      duration: 1,
    }).start();
    Animated.timing(this.state.fadeHome, {
      toValue: 0,
      duration: 400,
    }).start();

    // setTimeout(() => {
    Animated.timing(this.state.showSearch, {
      toValue: 1,
      duration: 400,
    }).start();
    // }, 600);

    setTimeout(() => {
      Animated.timing(this.state.zIndexValue, {
        toValue: 999,
        duration: 100,
      }).start();
    }, 100);

    // this.searchBarRef.current.focus();
  };
  onCloseSearchView = () => {
    this.setState({
      isVisibleHomeSearchScreen: false,
    });
    this.scrollViewRef?.setNativeProps({
      scrollEnabled: true,
    });
    Animated.timing(this.state.marginRightButton, {
      toValue: SW(24),
      duration: 400,
    }).start();
    Animated.timing(this.state.canScroll, {
      toValue: 1,
      duration: 1,
    }).start();
    setTimeout(() => {
      Animated.timing(this.state.fadeHome, {
        toValue: 1,
        duration: 200,
      }).start();
      Animated.timing(this.state.showSearch, {
        toValue: 0,
        duration: 200,
      }).start();
    }, 200);
    setTimeout(() => {
      Animated.timing(this.state.zIndexValue, {
        toValue: -1,
        duration: 400,
      }).start();
    }, 400);
  };

  onGetKeyword = (keyword) => {
    this.setState({
      keywordReceive: keyword,
    });
  };

  resetKeyword = () => {
    this.setState({
      keywordReceive: '',
    });
    this.searchBarRef.current?.clearInput();
  };

  getTool = (alias) => {
    const indexFinanceList = this.props.shopV2Items.findIndex(
      (shopItem) => shopItem?.cat_alias === alias,
    );
    if (this.props.shopV2Items?.[indexFinanceList]?.tools?.length > 0) {
      return this.props.shopV2Items?.[indexFinanceList];
    }
    return {};
  };

  onPressItemToolView = (item) => {
    this.toolItemsRef?.current?.close();

    console.log('aaa-32', JSON.stringify(item));

    if (item?.is_zalo === 1 || this.isDeepLink(item?.url)) {
      Linking.openURL(item?.url).catch((error) => {
        if (__DEV__) {
        }
      });
    } else {
      this.props.navigation.navigate('WebView', {
        mode: 0,
        url: item?.url,
        title: item?.title,
      });
    }
  };

  onScrollTo = (y) => {
    this?.scrollViewRef?.scrollTo?.({
      y,
    });
  };

  render() {
    const {
      fetchingMobileCardPaymentURLData,
      loadingAccountData,
      isFetchingGlobalCareURLData,
      isLoginProcessing,
      isLogoutProcessing,
      myUser,
    } = this.props;
    const isRefreshing = false;
    const {
      needLoadStuff2,
      bubbleInfor,
      isShowBubble,
      isShowUpdateNickName,
      showPopupHomeView,
      isFirstLogin,
    } = this.state;
    const loading =
      fetchingMobileCardPaymentURLData ||
      loadingAccountData ||
      isFetchingGlobalCareURLData ||
      isLoginProcessing ||
      // isLoading ||
      isLogoutProcessing;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.actionBackground }}>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          {this.renderHeaderBackground()}
          <View
            style={{
              marginTop: this.props.insets.top ? 0 : PADDING_SPACE,
              width: '100%',
            }}
          >
            {this.renderSearchBar()}
            {this.renderButtonNotify()}
          </View>
          <Animated.View
            style={{
              zIndex: this.state.scrollY.interpolate({
                inputRange: INPUT_RANGE,
                outputRange: [999, 999, 1, -1],
              }),
              width: '100%',
              top: SEARCH_HEIGHT + this.getInsetTop(),
              height: USER_INFO_HEIGHT + MONEY_INFO_HEIGHT,
              position: 'absolute',
            }}
          >
            {this.renderUserInfo()}
            {this.renderMainMenu()}
          </Animated.View>
          {this.renderMainCategory()}

          <View>
            <this.AnimatedScrollView
              innerRef={this.refScrollViewIOS}
              ref={this.refScrollViewAndroid}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={10}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                {
                  useNativeDriver: false,
                  listener: this.handleScrollEvent,
                },
              )}
              scrollEnabled={!!this.state.canScroll}
              onScrollBeginDrag={this.onScrollBeginDrag}
              onScrollEndDrag={this.onScrollEndDrag}
              onMomentumScrollEnd={this.onMomentumScrollEnd}
              refreshControl={
                <RefreshControl
                  style={{ backgroundColor: 'transparent' }}
                  refreshing={isRefreshing}
                  onRefresh={this.onHomeAllRefresh}
                  tintColor={Colors.gray5}
                />
              }
              contentContainerStyle={{
                paddingBottom: BOTTOM_BAR_HEIGHT + SH(IS_ANDROID ? 64 : 30),
                paddingTop: PADDING_TOP_LIST,
              }}
              style={{
                marginTop: MAIN_CATEGORY_HEIGHT,
              }}
              // contentInset={{ top: PADDING_TOP_LIST }}
              // contentOffset={{ y: PADDING_TOP_LIST }}
            >
              <Animated.View
                style={{
                  opacity: this.state.fadeHome,
                }}
              >
                {this.renderTips()}
                {myUser?.showLegacyList ? this.renderBadLoan() : null}
                {needLoadStuff2 ? (
                  <>
                    {this.renderContent('top', this.onShopItemPress)}
                    {this.renderContent('bottom', this.onShopItemPress)}
                  </>
                ) : null}
              </Animated.View>
            </this.AnimatedScrollView>
            {/* <Animated.View style={{ opacity: this.state.fadeHome }}> */}

            {/* {this.renderMainCategory()} */}

            {/* </Animated.View> */}
            <LoadingModal visible={loading} />
            <Bubble
              isShowBubble={isShowBubble}
              data={bubbleInfor}
              onHideBubble={this.onHideBubble}
              onBubblePress={this.onBubblePress}
            />
          </View>
          <ModalUserGuide
            ref={(ref) => (this.userGuideRef = ref)}
            onScrollTo={this.onScrollTo}
            navigation={this.props.navigation}
            paddingTop={
              (MAIN_CATEGORY_HEIGHT + SEARCH_HEIGHT - (this.props.insets.top ? 0 : PADDING_SPACE)) /
              2
            }
            offsetStartList={
              this.getInsetTop() + SEARCH_HEIGHT + USER_INFO_HEIGHT + MAIN_CATEGORY_HEIGHT
            }
            isFirstLogin={isFirstLogin}
            onEndUserGuide={this.handleCloseUserGuide}
          />
        </SafeAreaView>
        {this.renderBottomActionSheet()}
        {showPopupHomeView && this.renderPopupBrand()}

        <PopupNickName isVisible={isShowUpdateNickName} onClose={this.onClosPopupeUpdateNickName} />

        <SearchView
          opacity={this.state.showSearch}
          zIndex={this.state.zIndexValue}
          keyword={this.state.keywordReceive}
          navigation={this.props.navigation}
          listFinance={this.props.listFinance || {}}
          shopV2Items={this.props.shopV2Items || {}}
          top={this.getInsetTop() + SEARCH_HEIGHT + PADDING_SPACE}
        />

        <BottomActionSheet
          ref={(ref) => {
            this.toolItemsRef.current = ref;
          }}
          render={() => {
            return (
              <ListToolsView
                toolList={this.toolList || []}
                onPressItem={this.onPressItemToolView}
                description={this.toolListDescription}
              />
            );
          }}
          canClose={true}
          haveCloseButton={true}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setHomeNavigate: (screen, params) => dispatch(homeNavigate(screen, params)),
  setPendingOpenDeepLink: (path, params) => dispatch(pendingOpenDeepLink(path, params)),

  fetchListDistrict: () => dispatch(fetchListDistrict()),
  updateCustomerForms: (customerFormData) => dispatch(updateCustomerForms(customerFormData)),
  updateMobileCardCustomerForm: (mobileCardCustomerForm) =>
    dispatch(updateMobileCardCustomerForm(mobileCardCustomerForm)),

  // fetchShopItems: () => dispatch(fetchShopItems()),
  loadDatabaseData: (page, perPage) => dispatch(loadDatabaseData(page, perPage)),
  openLogin: () => dispatch(openLogin()),
  openProfile: () => dispatch(openProfile()),
  fetchFinancialServicesHome: () => dispatch(fetchFinancialServices()),

  requestUserAppList: () => dispatch(requestUserAppList()),
  requestUserAppLightList: () => dispatch(requestUserAppLightList()),

  getSubscriptions: () => dispatch(getSubscriptions()),

  countUnReadNoticeNews: () => dispatch(countUnReadNoticeNews()),

  countUnReadKnowledges: () => dispatch(countUnReadKnowledges()),
  fetchMyUser: () => dispatch(fetchMyUser()),

  requestBadLoans: (kiNo) => dispatch(requestBadLoans(kiNo)),

  getPromotionEvent: () => dispatch(getPromotionEvent()),

  getContestItem: () => dispatch(getContestItem()),

  initSIP: (username, password, domain) => dispatch(initSIP(username, password, domain)),
  makeCall: (destination, headers) => dispatch(makeCall(destination, headers)),

  closeChat: () => dispatch(closeChat()),

  checkSystemStatus: () => dispatch(checkSystemStatus()),

  getAllNumUnreadNotiFb: () => dispatch(getAllNumUnreadNotiFb()),
  getHelpItem: () => dispatch(getHelpItem()),
  fetchDelMod: () => dispatch(fetchDelMod()),
  fetchAppInfo: (info) => dispatch(fetchAppInfo(info)),

  fetchMobileCardPaymentURLData: (paramObject, callback) =>
    dispatch(fetchMobileCardPaymentURLData(paramObject, callback)),
  addAccount: () => dispatch(addAccount()),
  chooseUser: (user) => dispatch(chooseUser(user)),

  fetchToolItems: () => dispatch(fetchToolItems()),
  fetchPostList: () => dispatch(fetchPostList()),
  fetchInvitationInfo: () => dispatch(fetchInvitationInfo()),
  // addContactForRefUser: () => dispatch(addContactForRefUser()),
  fetchDPD: () => dispatch(fetchDPD()),
  fetchShopV2: () => dispatch(fetchShopV2Items()),
  loadShopV2FromLocal: () => dispatch(loadShopV2FromLocal()),
  getContests: () => dispatch(getContests()),
  updateListDistrict: (payload) => dispatch(updateListDistrict(payload)),
  getUserMetaData: (onSuccess) => dispatch(getUserMetaData(onSuccess)),
  setShowPopupBrand: (bool) => dispatch(setShowPopupBrand(bool)),
  getPopupBrandAfterLogin: () => dispatch(getPopupBrandAfterLogin()),
  fetchPostTips: () => dispatch(fetchPostTips()),
  fetchPostTipsFromLocal: () => dispatch(fetchPostTipsFromLocal()),
  fetchListFinance: () => dispatch(fetchListFinance()),
  fetchListFinanceFromLocal: () => dispatch(fetchListFinanceFromLocal()),
  fetchPopupSurveyContent: (onSuccess) => dispatch(getPopupSurveyContent(onSuccess)),
  submitPopupSurvey: (campaignID, feedbacks, onSuccess) =>
    dispatch(submitPopupSurvey(campaignID, feedbacks, onSuccess)),
  getListHighLightProducts: () => dispatch(getListHighLightProducts()),
  getListCTV: () => dispatch(getListCTV()),
  getListMainBanner: () => dispatch(getListMainBanner()),
  logout: (isLogOutOfAllDevices) => dispatch(logout(isLogOutOfAllDevices)),
  getTimeChecking: () => dispatch(getTimeChecking()),
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,

  pendingOpenDeepLink: state.pendingOpenDeepLink,

  // fetchingShopItems: state.fetchingShopItems,
  shopItems: state.shopItems,
  financialServiceItems: state.financialServiceItems,

  totalUnReadAdminNotifications: state.totalUnReadAdminNotificationsFb,
  totalUnReadSystemNotifications: state.totalUnReadSystemNotificationsFb,
  homeNavigate: state.homeNavigate,

  // isGettingUserAppList: state.isGettingUserAppList,
  userAppList: state.userAppList,

  // isGettingUserAppLightList: state.isGettingUserAppLightList,
  userAppLightList: state.userAppLightList,

  // isGetSubscriptionsProcessing: state.isGetSubscriptionsProcessing,
  subscriptions: state.subscriptions,

  // isGetNewsProcessing: state.isGetNewsProcessing,
  getNewsResponse: state.getNewsResponse,
  noticeNews: state.noticeNews,
  totalUnReadNoticeNews: state.totalUnReadNoticeNews,

  // isGetKnowledgesProcessing: state.isGetKnowledgesProcessing,
  knowledges: state.knowledges,
  totalUnReadKnowledges: state.totalUnReadKnowledges,

  // isGettingNewsSlideList: state.isGettingNewsSlideList,
  newsSlideList: state.newsSlideList,

  // isGettingBadLoans: state.isGettingBadLoans,
  badLoans: state.badLoans,

  promotionEvent: state.promotionEvent,
  activeTabbar: state.activeTabbar,

  contestItem: state.contestItem,

  chatThread: state.chatThread,

  totalUnReadAdminNotificationsFb: state.totalUnReadAdminNotificationsFb,

  helpItem: state.helpItem,
  delMod: state.delMod,

  mobileCardCustomerForm: state.mobileCardCustomerForm,
  // fetchingCustomerFormData: state.fetchingCustomerFormData,

  fetchingMobileCardPaymentURLData: state.fetchingMobileCardPaymentURLData,
  mobileCardPaymentURLData: state.mobileCardPaymentURLData,

  isFetchingGlobalCareURLData: state.isFetchingGlobalCareURLData,

  loadingAccountData: state.loadingAccountData,
  isLoginProcessing: state.isLoginProcessing,
  isLogoutProcessing: state.isLogoutProcessing,

  toolItems: state.toolItems,
  postList: state.postList,
  invitationInfo: state.invitationInfo,
  shopV2Items: state.shopV2Items,
  isLoading: state.loading.isLoading,
  contests: state.contests,
  popupBrand: state.popupBrand,
  userMetaData: state.userMetaData.data,
  DPD: state.DPD,
  postTips: state.postTips,
  listFinance: state.listFinance,
  hierInfoUser: state.collaboratorReducer.hierInfoUser,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withGuild(withSafeAreaInsets(HomeScreen)));
