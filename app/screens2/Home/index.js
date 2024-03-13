/* eslint-disable react/sort-comp */
import { connect } from 'react-redux';

import {
  Image,
  View,
  SafeAreaView,
  Dimensions,
  Animated,
  Share,
  RefreshControl,
  Platform,
  Keyboard,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Communications from 'react-native-communications';
import React, { Component } from 'react';
import _ from 'lodash';
import { isIphoneX } from 'react-native-iphone-x-helper';
import isIphone12 from '../../utils/iphone12Helper';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

import { Configs, MFConfigs, DEEP_LINK_BASE_URL } from '../../constants/configs';
import { MENU_ID } from './MainMenu/index';
import { openLogin, homeNavigate, openProfile } from '../../redux/actions/navigation';
import BottomActionSheet from '../../components2/BottomActionSheet';
import colors from '../../theme/Color';
import HeaderSection from './HeaderSection';
import HomeActionSheet, { ITEM_IDS } from './HomeActionSheet';
import ScrollMenu from './ScrollMenu';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import { AsyncStorageKeys } from '../../constants/keys';
import {
  // fetchShopItems,
  getNoticeNews,
  loadDatabaseData,
  fetchFinancialServices,
  getSubscriptions,
  fetchMyUser,
  getPromotionEvent,
} from '../../redux/actions';

import { TABS } from '../News';

import { requestUserAppList } from '../../redux/actions/userApp';
import { requestUserAppLightList } from '../../redux/actions/userAppLight';
import { countUnReadNoticeNews } from '../../redux/actions/news';
import { countUnReadKnowledges, getKnowledges, getContests } from '../../redux/actions/knowledge';
import { requestBadLoans } from '../../redux/actions/badLoans';
import { getContestItem } from '../../redux/actions/contest';
import { initSIP, makeCall } from '../../redux/actions/sip';
import { closeChat } from '../../submodules/firebase/redux/actions';
import { checkSystemStatus, pendingOpenDeepLink } from '../../redux/actions/app';
import { getAllNumUnreadNotiFb } from '../../redux/actions/notification';
import { getHelpItem } from '../../redux/actions/help';
import { fetchDelMod } from '../../redux/actions/delMod';
import { YourWorkCard } from '../../components2/YourWorkCard/index';
import strings from '../../constants/strings';
import { checkMicroPermission } from '../../utils/PermissionWrapper';
import { showAlertForRequestPermission } from '../../utils/UIUtils';
import User from '../../submodules/firebase/model/User';
import GridList from '../../components2/GridList/index';
import { MainBanner } from './MainBanner';
import { UserInfoBanner } from './UserInfoBanner';
import FloatingButton from './FloatingButton';
import DelModControl from '../../screens/Home/DelModControl';
import UserAppsControl from '../../screens/Home/UserAppsControl';
import { fetchAppInfo, fetchInvitationInfo } from '../../redux/actions/general';
import NotificationManager from '../../manager/NotificationManager';
import CustomerFormContainer from './CustomerFormContainer';
import ContestBannerSwiper from './ContestBannerSwiper';
import { CARRIER_ITEMS, MOBILE_CARD_DATA_SOURCE } from '../../components2/Forms/MobileCardForm';
import { SECTION_ID } from '../Services';
import DeepLinkCenter from './DeepLinkCenter';
import UserList from '../../components2/UserList';
import {
  fetchCustomerForms,
  updateCustomerForms,
  fetchListDistrict,
  updateMobileCardCustomerForm,
  updateListDistrict,
} from '../../redux/actions/customerForm';
import { fetchMobileCardPaymentURLData } from '../../redux/actions/mobileCardPayment';
import { Loading } from '../../components2/LoadingModal';
import { addAccount, chooseUser } from '../../redux/actions/user';

// v3
import { getUserConfigs } from '../../redux/actions/actionsV3/userConfigs';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';
import { dispatchGetThreadPublic } from '../../redux/actions/actionsV3/threadPublic';

import withGuild from '../../componentV3/HOCs/withGuild';

import ToolsControl from './ToolsControl';
import { fetchToolItems } from '../../redux/actions/tools';
import CustomPopup from '../../components2/CustomPopup';
import { fetchPostList } from '../../redux/actions/postList';
import { logEvent } from '../../tracking/Firebase';
// import { addContactForRefUser } from '../../redux/actions/conversationContact';
import DPDControl from './DPDControl';
import { fetchDPD } from '../../redux/actions/DPD';
import { fetchShopV2Items, loadShopV2FromLocal } from '../../redux/actions/shop';
// import { flyersTrackEvent, FLYERS_EVENT, flyersUserID } from '../../utils/AppsFlyers';
import DigitelClient from '../../network/DigitelClient';
import Bubble from './Bubble';

import { setShowPopupBrand, getPopupBrandAfterLogin } from '../../redux/actions/popup';
import PopupBrand from '../../components2/PopupBrand';
import PopupNickName from '../../componentV3/PopupNickName';

export const MAX_HEIGHT_HEADER = 160;
const SCREEN_SIZE = Dimensions.get('window');
const BACKGROUND_IMAGE_WIDTH = SCREEN_SIZE.width * 1.2;
const BACKGROUND_IMAGE_HEIGHT = 185;
const ZINDEX_FLOAT_BUTTON = 2000;

// setTimeout(() => {
//   Linking.openURL("mfastmobile://open?view=webview&url=https://dav-dev.cimb-bank.com.vn/uat2/octo-web/cards/vi_VN/&title=title&injectFunc=login({token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',hashing:'6Oow2ZQWdOCXNGLpOm9kWJMd9B9Irrffg6hMGzW4GbU=',userIsExist:true})&hideHeader=true");
// }, 5000);

// setTimeout(() => {
//   Linking.openURL("mfastmobile://sms?number=123456789&body=hello");
// }, 5000);

// setTimeout(() => {
// Linking.openURL("mfastmobile://open?view=webview&url=https://dav-dev.cimb-bank.com.vn/uat2/octo-web/cards/vi_VN/&title=title&injectFunc=login({token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',hashing:'6Oow2ZQWdOCXNGLpOm9kWJMd9B9Irrffg6hMGzW4GbU=',userIsExist:true})&hideHeader=true");
// Linking.openURL("mfastmobile://share?content=test");
// Linking.openURL("mfastmobile://copy/?text=https://cash24.vn/?utm_source=dgp&utm_medium=cpa&utm_campaign=dgp&utm_affid=b73d8b05a344d1b4ce208cacd80994d1");
//   Linking.openURL("mfastmobile://in-app-review");
// Linking.openURL("mfastmobile://open?view=News&focusedTabIndex=2&useDeepLink=1&prefixDeeplink=open?view=webview&url=https://appay-rc.cloudcms.vn/contest_mfast/feed_pig/pig&hideHeader=true");
// Linking.openURL("mfastmobile://open?view=News&focusedTabIndex=0&useDeepLink=0&prefixDeeplink=open?view=webview&url=https://appay-rc.cloudcms.vn/contest_mfast/feed_pig/pig&hideHeader=true");
// }, 3000);
class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0.1),
      carrierItems: CARRIER_ITEMS,
      mobileCardPaymentDataSource: MOBILE_CARD_DATA_SOURCE,
      needLoadStuff2: true,
      bubbleInfor: null,
      isShowBubble: false,
      isVisibleGuild: false,
      isShowUpdateNickName: false,
    };
    this.scrollY = 0;
    this.isCollapsed = false;
    this.isCollaping = false;
    this.canShowRefreshControl = false;

    this.scrollDidEndScroll = false;

    this.deepLinkCenter = new DeepLinkCenter({
      navigation: this.props.navigation,
    });

    if (!this.AnimatedScrollView) {
      this.AnimatedScrollView =
        Platform.OS === 'ios'
          ? Animated.createAnimatedComponent(KeyboardAwareScrollView)
          : Animated.ScrollView;
    }
  }

  componentDidMount() {
    this.prefetchAPI();
    this.reloadWhenFocus();
    this.fetchBubbleInfor();

    this.subs = [this.props.navigation.addListener('didFocus', this.reloadWhenFocus)];
    NotificationManager.shared();

    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.UI.TABBAR_HOME,
      this,
      this.scrollToTop,
    );

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);

    this.props.loadShopV2FromLocal();
  }
  componentDidUpdate(prevProps) {
    this.handleHomeNavigate(prevProps);
    this.handleOpenDeepLink(prevProps);
  }
  shouldComponentUpdate(nextProps) {
    if (!this.state.needLoadStuff2) {
      if (_.isEqual(this.props.myUser, nextProps.myUser)) return false;
    }
    return true;
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.myUser.isLoggedIn !== nextProps.myUser.isLoggedIn) {
      setTimeout(() => {
        this.reloadWhenFocus();
        this.prefetchAPI();
        if (nextProps.myUser.isLoggedIn) {
          NotificationManager.shared();
          this.props.getPopupBrandAfterLogin();
        }
      }, 500);
    }
  }
  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
    BroadcastManager.shared().removeObserver(BroadcastManager.NAME.UI.TABBAR_HOME, this);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handleOpenDeepLink = (prevProps) => {
    const prevLink = prevProps.pendingOpenDeepLink;
    const curLink = this.props.pendingOpenDeepLink;
    if (prevLink.path === curLink.path || !curLink.path) return;

    this.deepLinkCenter.processDeepLink(curLink);
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

  reloadWhenFocus = (forced = false) => {
    if (
      forced ||
      (!this.props.isGetSubscriptionsProcessing &&
        !this.props.isGettingBadLoans &&
        !this.props.isGettingUserAppList &&
        !this.props.isGettingUserAppLightList)
    ) {
      this.props.fetchAppInfo();
      this.props.fetchMyUser();
      this.props.getUserMetaData();
      if (this.props.myUser && this.props.myUser.isLoggedIn) {
        this.props.fetchDPD();
      }
      const { onShowGuild } = this.props;
      if (onShowGuild) {
        onShowGuild();
      }
    }
    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }
    this.props.fetchShopV2();
    this.props.fetchCustomerForms();
    setTimeout(() => {
      this.props.checkSystemStatus();
      this.initShowNickName();
    });
  };

  prefetchAPI = () => {
    setTimeout(() => {
      this.props.dispatchGetThreadPublic();
      this.props.getUserConfigs();
      this.props.getContests();
      this.props.getKnowledges();
      this.props.fetchInvitationInfo();
      this.fetchDistrict();
      this.props.fetchPostList();
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
  };
  onAvailableMoneyPress = () => {
    logEvent('press_onAvailableMoneyPress');
    if (!this.props.myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }
    const title = 'Thu nhập tích lũy';
    const url = Configs.withdrawHistory;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title,
      url,
      bgImage: require('./img/bg_point.png'),
    });
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
      this.props.openProfile();
    } else {
      this.props.navigation.navigate('LoginModal');
    }
  };

  onFullNamePress = () => {
    // if (this.userListSheetRef) this.userListSheetRef.open();
    if (this.props.myUser.isLoggedIn) {
      this.props.openProfile();
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
          const { appInfo } = this.props;
          this.props.navigation.navigate('WebView', {
            mode: 0,
            title: 'Hướng dẫn chi tiết',
            url: appInfo?.introductionUrl,
          });
          break;
        case ITEM_IDS.INSTALL_LINK:
          Share.share({ message: invitation.CTV_text });
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
    if (this.scrollY > 0 && this.scrollY <= MAX_HEIGHT_HEADER) {
      this.scrollDidEndScroll = true;
      // timeout for smooth scroll
      setTimeout(() => {
        if (this.scrollDidEndScroll) {
          this.collapseMenu(!this.isCollapsed);
        }
      }, 200);
    }
  };
  onMomentumScrollEnd = () => {
    if (this.scrollY > 0 && this.scrollY <= MAX_HEIGHT_HEADER) {
      this.scrollDidEndScroll = true;
      this.collapseMenu(!this.isCollapsed);
    }
  };
  collapseMenu = (isCollapsed) => {
    if (this.isCollaping) return;

    if (isCollapsed) {
      this.scrollToPosition(0, MAX_HEIGHT_HEADER + 0);
    } else {
      this.scrollToPosition(0, 0);
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
    if (this.scrollY >= MAX_HEIGHT_HEADER) {
      this.isCollapsed = true;
    }
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

  onShopItemPress = (item) => {
    const { url, title } = item;
    logEvent(`press_shop_${title}`);
    if (url.startsWith(DEEP_LINK_BASE_URL)) {
      Linking.openURL(url);
    } else {
      this.props.navigation.navigate('WebView', { mode: 0, title, url });
    }
  };

  onAllPress = (item) => {
    const { appInfo } = this.props;
    if (item?.cat_alias === 'insurance') {
      this.props.setHomeNavigate('WebView', {
        mode: 0,
        title: 'Bảo hiểm',
        url: appInfo?.insuranceCommonUrl,
      });
    } else {
      this.props.navigation.navigate('Services', {
        firstSection: item.cat_alias,
        onHelpPress: this.onShopItemPress,
      });
    }
  };

  onAllContestPress = () => {
    this.props.navigation.navigate('News', { focusedTabIndex: 2 });
  };

  onPressOpenTabNews = () => {
    this.props.navigation.navigate('News', { focusedTabIndex: 1 });
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
  renderBadLoan = () => {
    return <DPDControl navigation={this.props.navigation} />;
  };
  renderHotShop = () => {
    const { shopItems } = this.props;
    return (
      <View>
        <HeaderSection
          style={{ margin: 16, marginBottom: 0 }}
          title={'Sảm phẩm, dịch vụ'}
          onAllPress={this.onAllShopPress}
        />
        {/* <RowMenu
          dataSources={shopItems
            .map((item) => ({
              icon: { uri: item.icon },
              title: item.title,
              url: item.url
            }))
            .slice(0, 3)}
          onPress={this.onSubItemPress}
        /> */}
        <GridList
          maxRows={2}
          navigation={this.props.navigation}
          title={''}
          items={shopItems}
          onPressItem={this.onSubItemPress}
        />
      </View>
    );
  };
  renderContentSection = (title, data, onPress, onAllPress) => {
    return (
      <View key={`${title}`} style={{ marginTop: 16 }}>
        <HeaderSection
          style={{ margin: 12, marginTop: 0, marginBottom: 0 }}
          title={title}
          onAllPress={onAllPress}
        />
        <GridList
          // title={title}
          items={data}
          // loading={fetchingShopItems}
          navigation={this.props.navigation}
          onPressItem={onPress}
        />
      </View>
    );
  };
  renderContent = (position, onPress) => {
    const { shopV2Items } = this.props;
    const data = shopV2Items.filter((item) => item.position === position);
    return (
      <Animatable.View animation={'fadeIn'} duration={150}>
        {data.map((item) =>
          this.renderContentSection(item.cat_title, item.items, onPress, () => {
            this.onAllPress(item);
          }),
        )}
      </Animatable.View>
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
      <View>
        <HeaderSection
          style={{ margin: 12, marginBottom: 0 }}
          title={'Tin tức, khuyến mãi'}
          onAllPress={this.onPressOpenTabNews}
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

  renderSwiperBanner = () => {
    const { contests } = this.props;
    const isShowlistBanner =
      contests && Array.isArray(contests.processing) && contests.processing.length > 0;
    if (!isShowlistBanner) return <View />;
    const list = [];
    contests.processing.map((categories) => categories.items.map((item) => list.push(item)));
    return (
      <View>
        <HeaderSection
          style={{ margin: 16, marginBottom: 0 }}
          title={'Chương trình thi đua'}
          onAllPress={this.onAllContestPress}
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
          style={{ margin: 16, marginTop: 0, marginBottom: 0 }}
          title={'Dịch vụ tài chính'}
          onAllPress={this.onAllServicesPress}
        />
        {/* <RowMenu
          dataSources={financialServiceItems
            .map((item) => ({
              icon: { uri: item.icon },
              title: item.title,
              url: item.url
            }))
            .slice(0, 3)}
          onPress={this.onSubItemPress}
        /> */}
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
  renderYourWorkCard = (items) => {
    return items.map((item, index) => (
      <YourWorkCard
        containerStyle={{ marginTop: index === 0 ? 0 : 14 }}
        cardTitle={item.projectName}
        leftIcon={{ uri: item.logoImage }}
        revenue={item.totalMoney}
        point={item.totalPoint}
        // isShownButton
        // buttonTitle={'Test'}
        onButtonPress={() => {}}
        onCardPress={() => this.onYourWorkCardPress(item)}
      />
    ));
  };
  renderYourWorks = () => {
    const { subscriptions } = this.props;
    const items = subscriptions.items;
    return (
      <View>
        <HeaderSection style={{ margin: 16, marginBottom: 10 }} title={'Nghiệp vụ của bạn'} />
        <View style={{ marginLeft: 16, marginRight: 16 }}>{this.renderYourWorkCard(items)}</View>
      </View>
    );
  };
  renderMainMenu = () => {
    const { myUser, appInfo } = this.props;
    const translateY = Platform.OS === 'ios' ? -160 : -180;
    const opacityBalanceView = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 50, 80, 100],
      outputRange: [1, 1, 1, 1, 0.3, 0],
    });
    const translateYBG = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 100, MAX_HEIGHT_HEADER, MAX_HEIGHT_HEADER + 1],
      outputRange: [200, 100, 0, -100, translateY, translateY],
    });
    const scaleY = 1.2;
    const scaleWhiteBGY = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 120, 160, 240],
      outputRange: [1, 1, 1, 1, scaleY, scaleY],
    });
    return (
      <MainBanner
        isShowGift={myUser?.insPromotionTurnCount > 0}
        navigation={this.props.navigation}
        onAvailableMoneyPress={this.onAvailableMoneyPress}
        onAvailablePointsPress={this.onAvailablePointsPress}
        onMenuPress={this.onMenuPress}
        scrollY={this.state.scrollY}
        myUser={myUser}
        walletInfo={appInfo.casa}
        opacityBalanceView={opacityBalanceView}
        translateYBG={translateYBG}
        scaleWhiteBGY={scaleWhiteBGY}
        onWalletPress={this.onWalletPress}
      />
    );
  };
  renderHeaderBackground() {
    const scaleBG = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 1],
      outputRange: [1.1, 1.05, 1, 1],
    });
    const translateYBG = this.state.scrollY.interpolate({
      inputRange: [-100, -50, 0, 100, 120, 200],
      outputRange: [0, 0, 0, -70, -120, -200],
    });
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            position: 'absolute',
            top: -10,
            bottom: 0,
            left: 0,
            right: 0,
            width: BACKGROUND_IMAGE_WIDTH,
            height: BACKGROUND_IMAGE_HEIGHT,
            borderRadius: 0,
          },
          {
            transform: [
              {
                scaleX: scaleBG,
              },
              {
                scaleY: scaleBG,
              },
              {
                translateY: translateYBG,
              },
            ],
          },
        ]}
      >
        <Image
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            width: SCREEN_SIZE.width,
            height: 160,
          }}
          resizeMode="stretch"
          source={require('./img/header_bg.png')}
        />
      </Animated.View>
    );
  }
  renderUserInfo = () => {
    const translateY = Platform.OS === 'ios' ? -4 : -20;
    const translateYBG = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 100, 200],
      outputRange: [200, 100, 0, translateY, translateY],
    });
    const translateYWelcom = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 100, 200],
      outputRange: [0, 0, 0, 0, -200],
    });
    const opacityBalanceView = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 50, 80, 100],
      outputRange: [1, 1, 1, 1, 0.3, 0],
    });
    const opacityBorderView = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 50, 80, 100],
      outputRange: [0, 0, 0, 0, 0.3, 1],
    });
    const translateXElly = this.state.scrollY.interpolate({
      inputRange: [
        -200,
        -100,
        0,
        MAX_HEIGHT_HEADER - 100,
        MAX_HEIGHT_HEADER,
        MAX_HEIGHT_HEADER + 1,
      ],
      outputRange: [0, 0, 0, 0, 8, 8],
    });
    const { myUser, totalUnReadAdminNotifications, totalUnReadSystemNotifications, userMetaData } =
      this.props;
    return (
      <UserInfoBanner
        userMetaData={userMetaData}
        onWelcomeUserPress={this.onWelcomeUserPress}
        onFullNamePress={this.onFullNamePress}
        navigation={this.props.navigation}
        translateYBG={translateYBG}
        translateYWelcom={translateYWelcom}
        opacityBalanceView={opacityBalanceView}
        opacityBorderView={opacityBorderView}
        translateXElly={translateXElly}
        myUser={myUser}
        totalUnReadAdminNotifications={totalUnReadAdminNotifications}
        totalUnReadSystemNotifications={totalUnReadSystemNotifications}
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
        />
        <ToolsControl
          hideTitle
          toolItems={this.props.toolItems}
          onItemPress={this.onToolItemPress}
        />
      </View>
    ) : null;
  };
  // renderBottomActionSheetListCarrier = () => {
  //   const { mobileCardCustomerForm } = this.props;
  //   const partnersObj = mobileCardCustomerForm ? mobileCardCustomerForm.listPartner : undefined;

  //   if (_.isEmpty(mobileCardCustomerForm) && _.isEmpty(partnersObj)) {
  //     return null;
  //   }

  //   partnersObj.items[partnersObj.selectedIndex].isSelected = true;

  //   return (
  //     <BottomActionSheet
  //       // eslint-disable-next-line no-return-assign
  //       ref={(ref) => (this.changeCarrierSheetRef = ref)}
  //       render={() => (
  //         <ListCarrierBottomActionSheet
  //           dataSource={partnersObj.items}
  //           onCarrierItemPress={this.onListCarrierBottomActionSheetItemPress}
  //           onCloseButtonPress={() => this.changeCarrierSheetRef.close()}
  //         />
  //       )}
  //       // onClose={this.onCloseBottomSheet}
  //       // onOpen={this.onOpenBottomSheet}
  //     />
  //   );
  // };

  renderCustomerFormContainer = () => {
    const { navigation } = this.props;
    return (
      <CustomerFormContainer
        navigation={navigation}
        onPreFocusDistrictTextInput={this.onPreFocusDistrictTextInput}
        onPressWalletFormMakeMoney={this.onWalletPress}
        scrollToOffsetTopForm={this.scrollToOffsetTopForm}
      />
    );
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
          style={{ margin: 16, marginBottom: 0 }}
          title={'Tiện ích'}
          onAllPress={this.onAllHelpPress}
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
      <View style={{ marginTop: 16 }}>
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
  renderPopupBrand = () => {
    const { popupBrand } = this.props;
    if (!popupBrand) return;
    const { isShow, data } = popupBrand;
    if (!data) return;
    return <PopupBrand isVisible={isShow} data={data} onPressClose={this.onPressCloseModalBrand} />;
  };

  render() {
    const {
      // isGetSubscriptionsProcessing,
      // isGetNewsProcessing,
      // isGetKnowledgesProcessing,
      // isGettingNewsSlideList,
      // isGettingBadLoans,
      // fetchingShopItems,
      // fetchingCustomerFormData,
      fetchingMobileCardPaymentURLData,
      loadingAccountData,
      isFetchingGlobalCareURLData,
      isLoginProcessing,

      isLoading,
    } = this.props;

    const isRefreshing = false;
    // this.canShowRefreshControl &&
    // (isGetNewsProcessing ||
    //   isGetKnowledgesProcessing ||
    //   isGetSubscriptionsProcessing ||
    //   isGettingNewsSlideList ||
    //   isGettingBadLoans ||
    //   fetchingShopItems ||
    //   fetchingCustomerFormData);

    const { needLoadStuff2, bubbleInfor, isShowBubble, isShowUpdateNickName, isVisibleGuild } =
      this.state;
    const loading =
      fetchingMobileCardPaymentURLData ||
      loadingAccountData ||
      isFetchingGlobalCareURLData ||
      isLoginProcessing ||
      isLoading;
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral5 }}>
        {this.renderHeaderBackground()}
        <SafeAreaView style={{ flex: 1, marginTop: isIphone12() || isIphoneX() ? 30 : 16 }}>
          <this.AnimatedScrollView
            innerRef={this.refScrollViewIOS}
            ref={this.refScrollViewAndroid}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={10}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              {
                useNativeDriver: true,
                listener: this.handleScrollEvent,
              },
            )}
            onScrollBeginDrag={this.onScrollBeginDrag}
            onScrollEndDrag={this.onScrollEndDrag}
            onMomentumScrollEnd={this.onMomentumScrollEnd}
            extraHeight={200}
            refreshControl={
              <RefreshControl
                style={{ backgroundColor: 'trasparent' }}
                refreshing={isRefreshing}
                onRefresh={this.onHomeAllRefresh}
                tintColor={'white'}
              />
            }
          >
            <View style={{ height: MAX_HEIGHT_HEADER + (isIphone12() || isIphoneX() ? 62 : 70) }} />
            {this.renderBadLoan()}
            {this.renderCustomerFormContainer()}
            {needLoadStuff2 ? (
              <View>
                {/* {this.renderDelMod()} */}
                {/* {this.renderUserAppList()} */}
                {/* {this.renderHelpItems()} */}
                {/* {this.renderToolControl()} */}
                {/* {this.renderFinancialServices()} */}
                {/* {myUser.user_type === 'pro' ? this.renderYourWorks() : null} */}
                {this.renderContent('top', this.onShopItemPress)}
                {this.renderSwiperBanner()}
                {this.renderContent('bottom', this.onShopItemPress)}
                {this.renderNews()}
                {/* {this.renderHotShop()} */}
                {/* {this.renderShop()} */}
              </View>
            ) : null}
            <View style={{ height: 32 }} />
            <View style={{ height: 32 }} />
          </this.AnimatedScrollView>
          {this.renderMainMenu()}
          {this.renderUserInfo()}
          <Loading visible={loading} />
          <Bubble
            isShowBubble={isShowBubble}
            data={bubbleInfor}
            onHideBubble={this.onHideBubble}
            onBubblePress={this.onBubblePress}
          />
        </SafeAreaView>
        {/* {this.renderUserList()} */}
        {this.renderBottomActionSheet()}
        {this.renderPopupBrand()}
        <PopupNickName isVisible={isShowUpdateNickName} onClose={this.onClosPopupeUpdateNickName} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setHomeNavigate: (screen, params) => dispatch(homeNavigate(screen, params)),
  setPendingOpenDeepLink: (path, params) => dispatch(pendingOpenDeepLink(path, params)),

  fetchListDistrict: () => dispatch(fetchListDistrict()),
  updateCustomerForms: (customerFormData) => dispatch(updateCustomerForms(customerFormData)),
  fetchCustomerForms: () => dispatch(fetchCustomerForms()),
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

  getNoticeNews: (page, perPage) => dispatch(getNoticeNews(page, perPage)),
  countUnReadNoticeNews: () => dispatch(countUnReadNoticeNews()),
  getKnowledges: (page, perPage) => dispatch(getKnowledges(page, perPage)),

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
  getUserConfigs: () => dispatch(getUserConfigs()),
  getUserMetaData: () => dispatch(getUserMetaData()),
  setShowPopupBrand: (bool) => dispatch(setShowPopupBrand(bool)),
  getPopupBrandAfterLogin: () => dispatch(getPopupBrandAfterLogin()),
  dispatchGetThreadPublic: () => dispatch(dispatchGetThreadPublic()),
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
  getKnowledgesResponse: state.getKnowledgesResponse,
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

  toolItems: state.toolItems,
  postList: state.postList,
  invitationInfo: state.invitationInfo,
  shopV2Items: state.shopV2Items,
  isLoading: state.loading.isLoading,
  contests: state.contests,
  popupBrand: state.popupBrand,
  userMetaData: state.userMetaData.data,
});

export default connect(mapStateToProps, mapDispatchToProps)(withGuild(HomeScreen));
