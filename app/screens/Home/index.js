import React, { Component } from 'react';
import {
  View,
  Image,
  RefreshControl,
  Animated,
  Platform,
  Clipboard,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ActionSheet from 'react-native-actionsheet';

// import firebase from 'react-native-firebase';

import {
  homeNavigate,
  pendingOpenDeepLink,
  logout,
  getSubscriptions,
  getNoticeNews,
  countUnReadNoticeNews,
  readNews,
  readAllNoticeNews,
  getKnowledges,
  countUnReadKnowledges,
  readKnowledge,
  readAllKnowledges,
  getNewsSlideList,
  requestUserAppList,
  fetchMyUser,
  requestBadLoans,
  getPromotionEvent,
  isActiveTabbar,
  getContestItem,
  initSIP,
  makeCall,

  requestUserAppLightList,

  checkSystemStatus,

  getAllNumUnreadNotiFb,

  getHelpItem,
  fetchShopItems,
  fetchDelMod,
} from 'app/redux/actions';

import ActionButton from 'app/components/ActionButton/ActionButton';
import ActionButtonItem from 'app/components/ActionButton/ActionButtonItem';
import KJImage from 'app/components/common/KJImage';

import ImageButton from 'common/buttons/ImageButton';

import Styles from 'app/constants/styles';
import Strings, { formatString } from 'app/constants/strings';
import Colors from 'app/constants/colors';
import { Configs, DeepLinkPaths } from 'app/constants/configs';

import {
  User,
  SystemThread,
} from 'app/models';

import DigitelClient from 'app/network/DigitelClient';
import { showAlert, showInfoAlert, showAlertForRequestPermission, openOSSettings } from 'app/utils/UIUtils';

import { requestLocation } from '../../utils/Permission';
import { checkMicroPermission } from '../../utils/PermissionWrapper';

import NavigationBarHome from './NavigationBarHome';
import styles from './styles';
import LoadMoreView from './LoadMoreView';
import UserAvatar from './UserAvatar';
import UserWall from './UserWall';
import UserBalanceInfo from './UserBalanceInfo1';
import HomeTabbar, { TABS } from './HomeTabbar';
import ContentViewTab from './ContentViewTab';
import ContentViewTabUser from './ContentViewTabUser';

import ChatManager from '../../submodules/firebase/manager/ChatManager';
import {
  openChatWithThread,
  openChatWithUser,
  closeChat,
} from '../../submodules/firebase/redux/actions';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'HomeScreen.js';
/* eslint-enable */

const ZINDEX_FLOAT_BUTTON = 2000;


// --------------------------------------------------
// HomeScreen
// --------------------------------------------------

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      isRefreshing: false,
      navigationBarBackgroundOpacity: 0.2,
      navigationBarTitleOpacity: 0,

      noticeNewsPage: 1,
      canLoadMoreNoticeNews: true,
      isFilterUnReadNoticeNews: false,

      knowledgesPage: 1,
      canLoadMoreKnowledges: true,
      isFilterUnReadKnowledges: false,

      scrollY: new Animated.Value(0),

      showSubContent: false,
      showHomeContent: false,
      showStuffContent: false,
      showShop: false,
      showNews: false,
      showKnow: false,

      scrolling: false,

      zIndexPromoteButton: ZINDEX_FLOAT_BUTTON + 1,
      zIndexHelpButton: ZINDEX_FLOAT_BUTTON,
    };

    this.tabs = [];
    this.fetchingInfo = false;
    this.scrollEnabled = true;
    this.didDragScroll = false;

    this.sipaccount = '';
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.handleRefresh();
    this.onTabChangeIndex(TABS.GENERAL);

    setTimeout(() => {
      this.setState({
        showSubContent: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            showHomeContent: true,
          }, () => {
            setTimeout(() => {
              this.setState({
                showStuffContent: true,
              });
            }, 100);
          });
        }, 100);
      });
    }, 0);

    this.setupSIP();

    setTimeout(() => {
      firebase.analytics().setUserProperty('user_type', `${this.props.myUser.user_type}`);
    }, Platform === 'ios' ? 0 : 1000);

    // this.invokeTut();
    setTimeout(() => {
      requestLocation();
    }, 3000);

    setTimeout(() => {
      this.subs = [
        this.props.navigation.addListener('didFocus', this.reloadWhenFocus),
      ];
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    this.updateRefreshingState(prevProps);
    this.updateCanLoadMoreState(prevProps);
    this.handleHomeNavigate(prevProps);
    this.handleOpenDeepLink(prevProps);
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  setupSIP = () => {  // eslint-disable-line
    if (this.props.myUser && this.sipaccount !== this.props.myUser.SIPAccount) {
      this.sipaccount = this.props.myUser.SIPAccount;
      this.props.initSIP(
        this.props.myUser.SIPAccount,
        this.props.myUser.SIPPassword,
        this.props.myUser.SIPServer,
      );
    }
  }

  // invokeTut = () => {
  //   const asyncTask = async () => {
  //     const doneHome = await checkDoneTut(TUT_HOME_SYSTEM);
  //     if (!doneHome) {
  //       setTimeout(() => {
  //         if (this.props.currentScreenName === this.props.navigation.state.routeName) {
  //           this.props.start();
  //           setTimeout(() => {
  //             if (this.props.currentScreenName !== this.props.navigation.state.routeName) {
  //               this.props.stop();
  //               setTimeout(() => {
  //                 markUndoneTut(TUT_HOME_SYSTEM);
  //               }, 100);
  //             }
  //           }, 500);
  //         }
  //       }, 500);
  //     }
  //   };
  //   asyncTask();
  // }
  // --------------------------------------------------
  onTabChangeIndex = (index) => { // eslint-disable-line
    if (index === this.state.selectedIndex) {
      return;
    }
    if (this.tabs[this.state.selectedIndex]) {
      this.tabs[this.state.selectedIndex].moveOutFor(index);
    }
    if (this.tabs[index]) {
      this.tabs[index].moveInFrom(this.state.selectedIndex);
    }
    this.setState({
      selectedIndex: index,
    });

    // show if seleted
    if (index === TABS.SHOP && this.state.showShop === false) {
      this.setState({
        showShop: true,
      });
    }
    if (index === TABS.NEWS && this.state.showNews === false) {
      this.setState({
        showNews: true,
      });
    }
    if (index === TABS.KNOWLEDGE && this.state.showKnow === false) {
      this.setState({
        showKnow: true,
      });
    }

    setTimeout(() => {
    }, Platform === 'ios' ? 0 : 1000);
  }
  onAvatarPress = () => {
    this.props.navigation.navigate('Profile');
  }
  onAvailableMoneyPress = () => {
    // this.props.navigation.navigate('AvailableMoney');

    const title = 'Thu nhập tích lũy';
    const url = Configs.withdrawHistory;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  }
  onAvailablePointsPress = () => {
    const title = 'Điểm tích lũy';
    const url = Configs.pointHistory;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  }
  onMenuPress = () => {
    this.props.navigation.navigate('DrawerOpen');
  }
  onInboxPress = () => {
    const thread = SystemThread.systemThread();
    this.props.navigation.navigate('ChatBox', { thread });
  }
  onMailPress = () => {
    // this.props.navigation.navigate('Mail');
    const thread = SystemThread.adminThread();
    this.props.navigation.navigate('ChatBox', { thread });
  }

  // USER APP
  // --------------------------------------------------
  onUserAppPress = (userApp) => {
    const title = userApp.productName;
    const url = `${userApp.detailURL}`;
    this.navigationPlatForm(0, title, url);
  }
  onUserAppLightPress = (userApp) => {
    const title = userApp.title;
    const url = `${userApp.url}`;
    this.navigationPlatForm(0, title, url);
  }


  // BAD LOAN
  // --------------------------------------------------
  onBadLoanPress = (badLoan) => {
    const title = 'Chỉ số nợ xấu';
    const url = `${badLoan.url}`;
    this.props.navigation.navigate(
      'WebView',
      { mode: 0, title, url },
    );
  }

  onDelModPress = ({ url, webviewTitle }) => {
    this.navigationPlatForm(0, webviewTitle, url);
  }

  // SUBSCRIPTION
  // --------------------------------------------------
  onSubscriptionPress = (subscription) => {
    // console.log(`${LogTAG}: onSubscriptionPress: `, subscription);
    const title = subscription.projectName;
    const url = `${subscription.detailsURL}`;

    this.navigationPlatForm(0, title, url);
  }
  onSubscriptionRegisterPress = () => {
    // console.log(`${LogTAG}: onSubscriptionRegisterPress: `);
    const title = 'Đăng ký';
    const url = Configs.subscriptionRegisterWebView;

    this.navigationPlatForm(0, title, url);
  }

  onRefSubLightPress = (subscriptionLight) => {
    // console.log(`${LogTAG}: onSubscriptionPress: `, subscription);
    const title = subscriptionLight.label;
    const url = `${subscriptionLight.appURL}`;
    this.navigationPlatForm(0, title, url);
  }

  onSubscriptionLightPress = (subscriptionItemLight) => {
    // console.log(`${LogTAG}: onSubscriptionPress: `, subscription);
    const title = subscriptionItemLight.label;
    const url = `${subscriptionItemLight.url}`;
    this.navigationPlatForm(0, title, url);
  }

  // SUBSCRIPTION
  // --------------------------------------------------
  onPressCard = () => {
    this.props.navigation.navigate('Shop');
  }
  onPressShopItem = (title, url) => {
    if (title && url) {
      this.navigationPlatForm(0, title, url);
    }
  }

  // KNOWLEDGE
  // --------------------------------------------------
  onKnowledgePress = ({ title, url, openKnowledge }) => {
    openKnowledge // eslint-disable-line
      ? this.mOpenKnowlege()
      : this.navigationPlatForm(0, title, url);
  }
  onKnowledgesMorePress = () => {
    this.actionSheetTag = 1;
    this.actionSheet.show();
  }
  onKnowledgesViewMorePress = () => {
    this.scrollView.getNode().scrollTo({ x: 0, y: 0, animated: true });
    setTimeout(() => {
      this.onTabChangeIndex(TABS.KNOWLEDGE);
    }, 250);
  }

  // CUSTOM NEWS
  // --------------------------------------------------
  onCustomNewsPressed = (customNew) => {
    if (!customNew.detailURL() || customNew.detailURL().length === 0) {
      return;
    }
    // open webview
    const title = customNew.ackTitle;
    const url = `${customNew.detailURL()}`;
    const params = {
      mode: 0, title, url,
    };
    this.props.navigation.navigate('WebView', params);
  }

  // NEWS
  // --------------------------------------------------
  onNewsPress = (news) => {
    // cannot find url
    if (!news.detailsURL || news.detailsURL.length === 0) {
      return;
    }
    // open webview
    const title = news.title;
    const url = `${news.detailsURL}`;
    const params = {
      mode: 0, title, url,
    };
    this.props.navigation.navigate('WebView', params);
    setTimeout(() => {
      this.props.readNews(news);
    }, 1000);
  }
  onNoticeNewsMorePress = () => {
    this.actionSheetTag = 2;
    this.actionSheet.show();
  }
  onNoticeNewsViewMorePress = () => {
    this.scrollView.getNode().scrollTo({ x: 0, y: 0, animated: true });
    setTimeout(() => {
      this.onTabChangeIndex(TABS.NEWS);
    }, 250);
  }
  onActionSheetPress = (index) => {
    // Utils.log(`${LOG_TAG} ActionSheet ${this.actionSheetTag}. onPress`, index);
    if (index === 1) {
      if (this.actionSheetTag === 1) {
        this.setState({
          isFilterUnReadKnowledges: !this.state.isFilterUnReadKnowledges,
        });
      } else {
        this.setState({
          isFilterUnReadNoticeNews: !this.state.isFilterUnReadNoticeNews,
        });
      }
    }
    if (index === 2) {
      if (this.actionSheetTag === 1) {
        this.props.readAllKnowledges();
      } else {
        this.props.readAllNoticeNews();
      }
    }
  }

  onPromotionEventPress = (event) => {
    const title = event.title;
    const url = event.webviewURL;
    this.navigationPlatForm(0, title, url);
    setTimeout(() => {
      this.props.isActiveTabbar(true);
    }, 0);
  }

  onHelpEventPress = (event) => {
    const title = event.title;
    const url = event.webviewURL;
    const type = event.type;
    if (type === 'WEB') {
      this.navigationPlatForm(0, title, url);
    }
    else if (type === 'SIP') {
      this.onOpenCallSupport(url);
    }
    setTimeout(() => {
      this.props.isActiveTabbar(true);
    }, 0);
  }

  onOpenCallSupport = (url) => {
    const fullnames = this.props.myUser.fullNameNoDiacritics().split(' ');
    const fullnamesWithoutSpecialChar = fullnames.map(word => word.replace(/\W/g, ''));
    const fullname = fullnamesWithoutSpecialChar.join(' ');

    this.mOpenCall({
      num: url,
      displayNum: Strings.app_support,
      name: '',
      avatar: require('./img/support_call.png'),
      headerParams: {
        'X-appayName': fullname,
        'X-appayMobile': this.props.myUser.phoneNumber,
        'X-appayAcc': this.props.myUser.cmnd,
      },
    });
  }

  onPromotePress = (active) => {
    this.setState({
      zIndexHelpButton: ZINDEX_FLOAT_BUTTON,
      zIndexPromoteButton: ZINDEX_FLOAT_BUTTON + 1,
    });
    this.props.navigation.setParams({ visible: active });
  }
  onHelpPress = (active) => {
    this.setState({
      zIndexHelpButton: ZINDEX_FLOAT_BUTTON + 1,
      zIndexPromoteButton: ZINDEX_FLOAT_BUTTON,
    });
    this.props.navigation.setParams({ visible: active });
  }

  onScrollingChild = (scrolling) => {
    if (this.state.scrolling === true && scrolling === true) {
      return;
    }
    if (scrolling === this.scrollEnabled) {
      this.scrollEnabled = !scrolling;
      this.scrollView.setNativeProps({ scrollEnabled: !scrolling });
    }
  }

  // --------------------------------------------------

  reloadWhenFocus = (forced = false) => {

    // this.invokeTut();

    if (forced || (!this.props.isGetSubscriptionsProcessing &&
      !this.props.isGettingBadLoans &&
      !this.props.isGettingUserAppList &&
      !this.props.isGettingUserAppLightList)) {

      this.props.fetchMyUser();
      this.props.requestUserAppList();
      this.props.requestUserAppLightList();
      this.props.getSubscriptions()
      this.props.getContestItem();
      this.props.fetchDelMod();

      this.props.getAllNumUnreadNotiFb();
    }

    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }

    this.setupSIP();

    setTimeout(() => {
      this.props.checkSystemStatus();
    });
  }

  navigationPlatForm = (mode, title, url) => {

    if (Platform.OS === 'ios') {
      this.props.navigation.navigate(
        'WebView',
        { mode, title, url },
      );
    }
    else {
      this.props.navigation.navigate(
        'WebViewAndroid',
        { mode, title, url },
      );
    }

    const titleName = title.replace(/\W/g, '');
  }

  // --------------------------------------------------
  // 1: knowledge, 2: news
  actionSheetTag = 0;
  canLoadMoreNoticeNews = true;
  canLoadMoreKnowledges = true;
  isHandleScrollProcessing = false;

  // --------------------------------------------------
  handleRefresh = () => {
    // Utils.log(`${LogTAG} handleRefresh`);
    this.setState({
      noticeNewsPage: 1,
      knowledgesPage: 1,
    }, () => {
      // get news in sequence
      this.props.getNoticeNews(this.state.noticeNewsPage).then(() => {
        this.props.getKnowledges(this.state.knowledgesPage);
      });
      // get notifications in sequence because only one request can run at a time
      this.props.getNewsSlideList();

      this.reloadWhenFocus();
      this.props.getPromotionEvent();
      this.props.getHelpItem();
      this.props.fetchShopItems();
    });
  }
  handleLoadMore() {
    // Utils.log(`${LogTAG} handleLoadMore`);
    if (this.state.selectedIndex === TABS.KNOWLEDGE) {
      if (this.props.isGetKnowledgesProcessing) {
        return;
      }
      this.loadMoreKnowledges();
    }
    else if (this.state.selectedIndex === TABS.NEWS) {
      if (this.props.isGetNewsProcessing) {
        return;
      }
      this.loadMoreNoticeNews();
    }
  }

  handleScroll = (event) => {
    if (this.isScrollViewReachedEnd(event.nativeEvent)) {
      this.handleLoadMore();
    }
  }

  onScrollBeginDrag = () => {
    if (this.state.scrolling !== true) {
      this.setState({
        scrolling: true,
      });
    }
  }
  onScrollEndDrag = () => {
    if (this.state.scrolling !== false) {
      this.setState({
        scrolling: false,
      });
    }
  }

  loadMoreNoticeNews() {
    if (!this.state.canLoadMoreNoticeNews) {
      // console.warn(`${LogTAG} loadMoreNoticeNews: alread load all -> return`);
      return;
    }
    this.setState({
      noticeNewsPage: this.state.noticeNewsPage + 1,
    }, () => {
      // console.warn(`${LogTAG} loadMoreNoticeNews: load more`);
      this.props.getNoticeNews(this.state.noticeNewsPage);
    });
  }
  loadMoreKnowledges() {
  }
  updateRefreshingState() {
    if (this.state.isRefreshing) {
      const isProcessing = this.state.selectedIndex === TABS.KNOWLEDGE ?
        this.props.isGetKnowledgesProcessing :
        this.props.isGetNewsProcessing;
      if (isProcessing === false) {
        this.setState({ // eslint-disable-line
          isRefreshing: false,
        });
      }
    }
  }
  updateCanLoadMoreState(prevProps) {
    if (this.state.selectedIndex === TABS.KNOWLEDGE) {
      if (prevProps.getKnowledgesResponse.status !== undefined) return;
      if (this.props.getKnowledgesResponse.status === undefined) return;
      if (!this.props.getKnowledgesResponse.canLoadMore) {
        this.setState({
          canLoadMoreKnowledges: false,
        });
      }
    }
    else if (this.state.selectedIndex === TABS.NEWS) {
      if (prevProps.getNewsResponse.status !== undefined) return;
      if (this.props.getNewsResponse.status === undefined) return;
      if (!this.props.getNewsResponse.canLoadMore) {
        this.setState({
          canLoadMoreNoticeNews: false,
        });
      }
    }
  }
  handleHomeNavigate(prevProps) {
    if (prevProps.homeNavigate === null) { return; }
    if (prevProps.homeNavigate.screen === null && this.props.homeNavigate.screen !== null) {
      const { screen, params } = this.props.homeNavigate;
      if (screen) {

        let navigateKey = '';
        if (screen === 'WebView' || screen === 'ChatBox') {
          navigateKey = JSON.stringify(params);
        }

        this.props.navigation.navigate({
          routeName: screen,
          params,
          key: navigateKey,
        });
      }
      setTimeout(() => {
        this.props.setHomeNavigate();
      }, 0);
    }
  }
  handleOpenDeepLink(prevProps) {
    if (prevProps.pendingOpenDeepLink.path !== this.props.pendingOpenDeepLink.path &&
      this.props.pendingOpenDeepLink.path !== null) {
      const { path, params } = this.props.pendingOpenDeepLink;
      // single chat
      if (path && path === DeepLinkPaths.SINGLE_CHAT) {
        const userID = params.userID;
        const quote = params.message || '';
        if (userID) {
          this.mOpenSingleChat(userID, quote);
        }
      }
      // group chat
      else if (path && path === DeepLinkPaths.GROUP_CHAT) {
        const threadID = params.threadID;
        const message = params.message || '';
        if (threadID) {
          this.mOpenGroupChat(threadID, message);
        }
      }
      // sip call
      else if (path && path === DeepLinkPaths.SIP_CALL) {
        const num = params.num;
        const hideNum = params.hideNum;
        const name = params.name;
        const param1 = params.param1 ? params.param1 : '';
        const param2 = params.param2 ? params.param2 : '';
        const param3 = params.param3 ? params.param3 : '';
        const param4 = params.param4 ? params.param4 : '';
        const param5 = params.param5 ? params.param5 : '';
        if (num) {
          this.mOpenCall({ num, hideNum, name, param1, param2, param3, param4, param5 });
        }
      }
      // copy
      else if (path && path === DeepLinkPaths.COPY) {
        const text = params.text;
        Clipboard.setString(text);
        showInfoAlert(`Đã sao chép ${text}`);
      }
      // go back
      else if (path && path === DeepLinkPaths.GO_BACK) {
        this.props.navigation.dispatch({ type: 'Navigation/BACK' });
      }
      // open view
      else if (path && path === DeepLinkPaths.OPEN) {
        const view = params.view;
        if (view === 'os_setting') {
          openOSSettings();
        }
        else if (view === 'user_point') {
          this.onAvailablePointsPress();
        }
        else if (view === 'home_shop') {
          this.mOpenShop();
        }
      }
      // reset state
      setTimeout(() => {
        this.props.setPendingOpenDeepLink();
      }, 250);
    }
  }
  mOpenSingleChat(userID, message) {
    // Utils.warn(`${LOG_TAG}: mOpenSingleChat: `, userID);
    const asyncTask = async () => {
      try {
        const target = await DigitelClient.getUser(userID);
        if (target) {
          this.props.navigation.navigate('Chat', { message });
          setTimeout(() => {
            this.props.openChatWithUser(target);
          }, 0);
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: mOpenSingleChat: err: ${err}`, err);
        const alert = formatString(Strings.request_action_error, { action_name: 'mở Chat' });
        showAlert(alert);
      }
    };
    asyncTask();
  }
  mOpenGroupChat(threadID, message) {
    // Utils.warn(`${LOG_TAG}: mOpenGroupChat: `, threadID);
    const asyncTask = async () => {
      try {
        const thread = await ChatManager.shared().getThread(threadID);
        this.mOpenChat(thread, message);
      } catch (err) {
        Utils.warn(`${LOG_TAG}: mOpenGroupChat: err: ${err}`, err);
        const alert = formatString(Strings.request_action_error, { action_name: 'mở Chat' });
        showAlert(alert);
      }
    };
    asyncTask();
  }
  mOpenChat(thread, message) {
    // set chatThread & load messages
    this.props.openChatWithThread(thread);
    // wait a bit to load messages & navigate to Chat
    setTimeout(() => {
      this.props.navigation.navigate('Chat', { message });
    }, 10);
  }
  mOpenCall = ({ num, hideNum, displayNum, avatar, name, headerParams, param1, param2, param3, param4, param5 }) => {
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
        .then(isAuthorized => {
          if (isAuthorized) { navigateCall(); }
          else { showAlertForRequestPermission(Strings.micro_access_error_android); }
        })
        .catch(() => {
          showAlertForRequestPermission(Strings.micro_access_error_android);
        });
    }
  }

  mOpenShop = () => {
    this.props.navigation.navigate('Home');
    setTimeout(() => {
      this.onTabChangeIndex(TABS.SHOP);
    }, 300);
  }

  mOpenKnowlege = () => {
    this.scrollView.getNode().scrollTo({ x: 0, y: 0, animated: true });
    setTimeout(() => {
      this.onTabChangeIndex(TABS.KNOWLEDGE);
    }, 200);
  }

  isScrollViewReachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 96;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }
  // --------------------------------------------------
  renderNavigationBar() {
    let mailButtonBadge = '';
    if (this.props.totalUnReadAdminNotifications > 0) {
      mailButtonBadge = `${this.props.totalUnReadAdminNotifications}`;
    }
    let inboxButtonBadge = '';
    if (this.props.totalUnReadSystemNotifications > 0) {
      inboxButtonBadge = `${this.props.totalUnReadSystemNotifications}`;
    }
    return (
      <NavigationBarHome
        backgroundOpacity={this.state.navigationBarBackgroundOpacity}
        titleOpacity={this.state.navigationBarTitleOpacity}
        titleView={
          <Image
            source={require('./img/ic_text_appay.png')}
          />
        }
        onTitlePress={this.onAvatarPress}
        leftButton={
          <InboxButton
            onPress={this.onInboxPress}
          />
        }
        leftButtonBadge={inboxButtonBadge}
        rightButton={
          <MailButton
            onPress={this.onMailPress}
          />
        }
        rightButtonBadge={mailButtonBadge}

        // right2Button={
        //   <MailButton
        //     onPress={this.onMailPress}
        //   />
        // }
        // right2ButtonBadge={right2ButtonBadge}

        scrollY={this.state.scrollY}
        username={this.props.myUser.fullName ? this.props.myUser.fullName.toUpperCase() : ''}
      />
    );
  }
  renderContentUserForTab = (tab) => {
    return (
      (this.props.subscriptions && this.props.subscriptions.items) ?
        <ContentViewTabUser
          ref={ref => { this.tabs[tab] = ref; }}
          isActive={this.state.selectedIndex === tab}
          selectedIndex={tab}
          isGettingUserAppLightList={this.props.isGettingUserAppLightList}

          userAppListData={this.props.userAppList}
          userAppListExtraData={this.state.userAppListExtraData}

          userAppLightListData={this.props.userAppLightList}
          userAppLightListExtraData={this.state.userAppLightListExtraData}

          subscriptions={this.props.subscriptions.items}
          isGetSubscriptionsProcessing={this.props.isGetSubscriptionsProcessing}
          onSubscriptionLightPress={this.onSubscriptionLightPress}
          onRefSubLightPress={this.onRefSubLightPress}

          onUserAppPress={this.onUserAppPress}
          onUserAppLightPress={this.onUserAppLightPress}
          onScrollingChild={this.onScrollingChild}
          parentScrolling={this.state.scrolling}

          delMod={this.props.delMod}
          onDelModPress={this.onDelModPress}
        />
        : null
    );
  }

  renderContentForTab = (tab) => {
    return (
      <ContentViewTab
        ref={ref => { this.tabs[tab] = ref; }}
        // styles={
        //   { display: (this.state.selectedIndex === tab) ? 'flex' : 'none' }
        // }
        isActive={this.state.selectedIndex === tab}
        selectedIndex={tab}

        userAppListData={this.props.userAppList}
        userAppListExtraData={this.state.userAppListExtraData}

        userAppLightListData={this.props.userAppLightList}
        userAppLightListExtraData={this.state.userAppLightListExtraData}

        isGettingBadLoans={this.props.isGettingBadLoans}
        badLoans={this.props.badLoans}

        subscriptions={this.props.subscriptions}
        subscriptionsExtraData={this.state.subscriptionsExtraData}
        isGetSubscriptionsProcessing={this.props.isGetSubscriptionsProcessing}

        noticeNews={this.props.noticeNews}
        isFilterUnReadNoticeNews={this.state.isFilterUnReadNoticeNews}

        knowledges={this.props.knowledges}
        isFilterUnReadKnowledges={this.state.isFilterUnReadKnowledges}
        canLoadMoreNoticeNews={this.state.canLoadMoreNoticeNews}
        isGetNewsProcessing={this.props.isGetNewsProcessing}
        canLoadMoreKnowledges={this.state.canLoadMoreKnowledges}

        totalUnReadKnowledges={this.props.totalUnReadKnowledges}
        totalUnReadNoticeNews={this.props.totalUnReadNoticeNews}

        onSubscriptionPress={this.onSubscriptionPress}
        onSubscriptionRegisterPress={this.onSubscriptionRegisterPress}

        onKnowledgePress={this.onKnowledgePress}
        onKnowledgesMorePress={this.onKnowledgesMorePress}
        onKnowledgesViewMorePress={this.onKnowledgesViewMorePress}

        customNews={this.props.newsSlideList}
        onCustomNewsPressed={this.onCustomNewsPressed}

        onNewsPress={this.onNewsPress}
        onNoticeNewsMorePress={this.onNoticeNewsMorePress}
        onNoticeNewsViewMorePress={this.onNoticeNewsViewMorePress}

        onPressCard={this.onPressCard}
        onPressShopItem={this.onPressShopItem}

        onUserAppPress={this.onUserAppPress}
        onUserAppLightPress={this.onUserAppLightPress}
        onBadLoanPress={this.onBadLoanPress}

        showSubContent={this.state.showSubContent}
        showHomeContent={this.state.showHomeContent}

        delMod={this.props.delMod}
        onDelModPress={this.onDelModPress}
      />
    );
  }

  renderIconAction = (isActive) => {
    return (
      isActive ?
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 2.0,
          }}
          source={require('./img/close.png')}
          resizeMode="contain"
        />
        :
        <KJImage
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
          source={{ uri: this.props.contestItem.imageURL }}
          resizeMode="contain"
        />
    );
  }

  renderIconHelpAction = (isActive) => {
    return (
      isActive ?
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 2.0,
          }}
          source={require('./img/close.png')}
          resizeMode="contain"
        />
        :
        <KJImage
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
          source={{ uri: this.props.helpItem.imageURL }}
          resizeMode="contain"
        />
    );
  }

  renderItemAction = (event) => {
    return (
      <ActionButtonItem
        key={event.imageURL}
        buttonColor="#fff"
        title={event.title}
        onPress={() => this.onPromotionEventPress(event)}>
        <KJImage
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
          source={{ uri: event.imageURL }}
          resizeMode="contain"
        />
      </ActionButtonItem>
    );
  }

  renderHelpItemAction = (event) => {
    return (
      <ActionButtonItem
        key={event.imageURL}
        buttonColor="#fff"
        title={event.title}
        onPress={() => this.onHelpEventPress(event)}
      >
        <KJImage
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
          source={{ uri: event.imageURL }}
          resizeMode="contain"
        />
      </ActionButtonItem>
    );
  }

  render() {
    const {
      myUser,
      contestItem,
    } = this.props;

    const scaleTabbar = this.state.scrollY.interpolate({
      inputRange: [-1, 0, 50, 200, 600],
      outputRange: [1, 1, 1, 0.75, 0.75],
      extrapolate: 'clamp',
    });

    let filterUnReadTitle = this.state.selectedIndex === TABS.KNOWLEDGE ?
      'Xem kiến thức chưa đọc' : 'Xem thông báo chưa đọc';
    if (this.state.selectedIndex === TABS.KNOWLEDGE && this.state.isFilterUnReadKnowledges) {
      filterUnReadTitle = 'Xem tất cả kiến thức';
    }
    if (this.state.selectedIndex === TABS.NEWS && this.state.isFilterUnReadNoticeNews) {
      filterUnReadTitle = 'Xem tất cả thông báo';
    }

    let isLoadMoreHidden = true;
    let isLoadMoreLoading = false;
    if (this.state.selectedIndex === TABS.KNOWLEDGE) {
      isLoadMoreLoading = this.state.canLoadMoreNoticeNews;
      if (this.state.canLoadMoreNoticeNews === false || this.props.isGetNewsProcessing) {
        isLoadMoreHidden = false;
      }
    }
    else if (this.state.selectedIndex === TABS.NEWS) {
      isLoadMoreLoading = this.state.canLoadMoreKnowledges;
      if (this.state.canLoadMoreKnowledges === false || this.props.isGetNewsProcessing) {
        isLoadMoreHidden = false;
      }
    }

    return (
      <View style={styles.container} testID="home_screen">

        {this.renderNavigationBar()}

        <Animated.ScrollView
          testID="test_home_scroll"
          ref={o => { this.scrollView = o; }}
          style={{ flex: 1, backgroundColor: Colors.navigation_bg }}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: '#E6EBFF' }}
              refreshing={this.state.isRefreshing}
              onRefresh={this.handleRefresh}
            />
          }
          scrollEventThrottle={10}
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              {
                useNativeDriver: true,
                listener: this.handleScroll,
              },
            )
          }
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
        >
          {
            // this.state.showHomeContent &&
            <UserBalanceInfo
              userTotalMoney={myUser.totalMoney}
              userTotalPoint={myUser.totalPoint}
              onMoneyPress={this.onAvailableMoneyPress}
              onPointsPress={this.onAvailablePointsPress}
              showSubContent={this.state.showHomeContent}
            />
          }

          {
            // this.state.showHomeContent &&
            <UserAvatar
              user={myUser}
              onAvatarPress={this.onAvatarPress}
              showHomeContent={this.state.showSubContent}
            />
          }

          {
            <UserWall />
          }

          {
            this.state.showHomeContent &&
            <HomeTabbar
              style={{
                transform: [{
                  scaleX: scaleTabbar,
                }, {
                  scaleY: scaleTabbar,
                },
                ],
              }}
              selectedIndex={this.state.selectedIndex}
              onTabTapped={this.onTabChangeIndex}
            />
          }

          <View style={{ flexDirection: 'row', flex: 1, marginBottom: (contestItem.items && contestItem.items.length > 0) ? 42 : 0 }}>
            {
              this.state.showShop &&
              this.renderContentForTab(TABS.SHOP)
            }
            {
              this.state.showKnow &&
              this.renderContentForTab(TABS.KNOWLEDGE)
            }
            {
              this.state.showNews &&
              this.renderContentForTab(TABS.NEWS)
            }
            {
              myUser.user_type === 'pro' && this.state.showSubContent &&
              this.renderContentForTab(TABS.GENERAL)
            }
            {
              myUser.user_type === 'light' && this.state.showSubContent &&
              this.renderContentUserForTab(TABS.GENERAL)
            }
          </View>

          <View style={{ height: 32, backgroundColor: '#0000' }} />

          {
            this.state.showStuffContent &&
            <LoadMoreView
              style={{ marginTop: -12, marginBottom: 20 }}
              isHidden={isLoadMoreHidden}
              isLoading={isLoadMoreLoading}
            />
          }

        </Animated.ScrollView>

        {
          this.state.showStuffContent &&
          <ActionSheet
            ref={o => { this.actionSheet = o; }}
            options={['Đóng', filterUnReadTitle, 'Đánh dấu đọc tất cả']}
            cancelButtonIndex={0}
            onPress={this.onActionSheetPress}
          />
        }
        {
          this.state.showStuffContent &&
          contestItem.items && contestItem.items.length > 0 &&
          <ActionButton
            zIndex={this.state.zIndexPromoteButton}
            textStyle={{
              color: '#f24654',
            }}
            buttonStyle={{
              shadowColor: '#f24654',
            }}
            title={'THI ĐUA'}
            renderIcon={this.renderIconAction}
            onPress={this.onPromotePress}
            activeTabbar={this.props.activeTabbar}
          >
            {
              contestItem.items.map(item => this.renderItemAction(item))
            }
          </ActionButton>
        }
        {
          this.state.showStuffContent &&
          this.props.helpItem.items && this.props.helpItem.items.length > 0 &&
          <ActionButton
            zIndex={this.state.zIndexHelpButton}
            textStyle={{
              color: '#5bad0c',
            }}
            buttonStyle={{
              shadowColor: '#5bad0c',
            }}
            title={this.props.helpItem.title}
            renderIcon={this.renderIconHelpAction}
            onPress={this.onHelpPress}
            activeTabbar={this.props.activeTabbar}
            position={'left'}
          >
            {
              this.props.helpItem.items.map(item => this.renderHelpItemAction(item))
            }
          </ActionButton>
        }

      </View >
    );
  }
}

// --------------------------------------------------

HomeScreen.navigationOptions = () => {
  return {
    title: ' ', // must have a space or navigation will crash
    header: null,
    headerBackTitle: Strings.navigation_back_title,
    headerStyle: Styles.navigator_header_no_border,
    headerTitleStyle: Styles.navigator_header_title,
    headerTintColor: '#000',
    tabBarLabel: 'MFast',
    tabBarIcon: ({ focused }) => {
      const icon = focused ?
        require('../img/tab_home1.png') :
        require('../img/tab_home.png');
      return (
        <Image
          source={icon}
          style={{ width: 24, height: 24 }}
          resizeMode={'contain'}
        />
      );
    },
  };
};

// --------------------------------------------------

// remove slidemenu
// const MenuButton = (props) => (
//   <ImageButton
//     style={styles.menuButton}
//     imageSource={require('./img/ic_menu.png')}
//     onPress={props.onPress}
//   />
// );

const InboxButton = (props) => (
  <ImageButton
    testID="test_inbox_home"
    style={styles.inboxButton}
    imageSource={require('./img/elly.png')}
    imageStyle={{
      width: 36,
      height: 36,
      borderRadius: 36 / 2,
      borderColor: '#2ecc71',
      borderWidth: 0.5,
    }}
    onPressIn={props.onPress}
    imageResizeMode={'cover'}
  />
);

const MailButton = (props) => (
  <ImageButton
    testID="test_mail_home"
    style={styles.mailButton}
    imageSource={require('./img/anna.png')}
    imageStyle={{
      width: 36,
      height: 36,
      borderRadius: 36 / 2,
      borderColor: '#2ecc71',
      borderWidth: 0.5,
    }}
    onPressIn={props.onPress}
    imageResizeMode={'cover'}
  />
);

// --------------------------------------------------
// react-redux
// --------------------------------------------------

HomeScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  homeNavigate: state.homeNavigate,
  pendingOpenDeepLink: state.pendingOpenDeepLink,
  myUser: state.myUser,

  isGettingUserAppList: state.isGettingUserAppList,
  userAppList: state.userAppList,

  isGettingUserAppLightList: state.isGettingUserAppLightList,
  userAppLightList: state.userAppLightList,

  isGetSubscriptionsProcessing: state.isGetSubscriptionsProcessing,
  subscriptions: state.subscriptions,

  isGetNewsProcessing: state.isGetNewsProcessing,
  getNewsResponse: state.getNewsResponse,
  noticeNews: state.noticeNews,
  totalUnReadNoticeNews: state.totalUnReadNoticeNews,

  isGetKnowledgesProcessing: state.isGetKnowledgesProcessing,
  getKnowledgesResponse: state.getKnowledgesResponse,
  knowledges: state.knowledges,
  totalUnReadKnowledges: state.totalUnReadKnowledges,

  // totalUnReadAdminNotifications: state.totalUnReadAdminNotifications,
  // totalUnReadSystemNotifications: state.totalUnReadSystemNotifications,
  totalUnReadAdminNotifications: state.totalUnReadAdminNotificationsFb,
  totalUnReadSystemNotifications: state.totalUnReadSystemNotificationsFb,

  isGettingNewsSlideList: state.isGettingNewsSlideList,
  newsSlideList: state.newsSlideList,

  isGettingBadLoans: state.isGettingBadLoans,
  badLoans: state.badLoans,

  promotionEvent: state.promotionEvent,
  activeTabbar: state.activeTabbar,

  appInfo: state.appInfo,
  contestItem: state.contestItem,

  chatThread: state.chatThread,
  allThreads: state.allThreads,

  currentScreenName: state.currentScreenName,

  totalUnReadAdminNotificationsFb: state.totalUnReadAdminNotificationsFb,

  helpItem: state.helpItem,
  delMod: state.delMod,
});

const mapDispatchToProps = (dispatch) => ({
  setHomeNavigate: (screen, params) => dispatch(homeNavigate(screen, params)),
  setPendingOpenDeepLink: (path, params) => dispatch(pendingOpenDeepLink(path, params)),

  logout: () => dispatch(logout()),

  requestUserAppList: () => dispatch(requestUserAppList()),
  requestUserAppLightList: () => dispatch(requestUserAppLightList()),

  getSubscriptions: () => dispatch(getSubscriptions()),

  getNoticeNews: (page, perPage) => dispatch(getNoticeNews(page, perPage)),
  countUnReadNoticeNews: () => dispatch(countUnReadNoticeNews()),
  readNews: (news) => dispatch(readNews(news)),
  readAllNoticeNews: () => dispatch(readAllNoticeNews()),

  getKnowledges: (page, perPage) => dispatch(getKnowledges(page, perPage)),
  countUnReadKnowledges: () => dispatch(countUnReadKnowledges()),
  readKnowledge: (knowledge) => dispatch(readKnowledge(knowledge)),
  readAllKnowledges: () => dispatch(readAllKnowledges()),

  getNewsSlideList: () => dispatch(getNewsSlideList()),

  openChatWithThread: (thread) => dispatch(openChatWithThread(thread)),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  fetchMyUser: () => dispatch(fetchMyUser()),

  requestBadLoans: (kiNo) => dispatch(requestBadLoans(kiNo)),

  getPromotionEvent: () => dispatch(getPromotionEvent()),
  isActiveTabbar: (active) => dispatch(isActiveTabbar(active)),

  getContestItem: () => dispatch(getContestItem()),

  initSIP: (username, password, domain) => dispatch(initSIP(username, password, domain)),
  makeCall: (destination, headers) => dispatch(makeCall(destination, headers)),

  closeChat: () => dispatch(closeChat()),

  checkSystemStatus: () => dispatch(checkSystemStatus()),

  getAllNumUnreadNotiFb: () => dispatch(getAllNumUnreadNotiFb()),
  getHelpItem: () => dispatch(getHelpItem()),
  fetchShopItems: () => dispatch(fetchShopItems()),
  fetchDelMod: () => dispatch(fetchDelMod()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
