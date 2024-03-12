/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NetInfo from '@react-native-community/netinfo';
import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';

import Modal from 'react-native-modal';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Permissions from 'react-native-permissions';

import {
  homeNavigate,
  pendingNotification,
  internetState,
  currentScreenName,
} from 'app/redux/actions';

import { Configs } from 'app/constants/configs';

import NotificationManager from 'app/manager/NotificationManager';

import SlideMenu from 'app/screens/SlideMenu';
import HomeScreen from 'app/screens/Home';
import AvailableMoneyScreen from 'app/screens/AvailableMoney';
import AvailablePointsScreen from 'app/screens/AvailablePoints';
import EditBankAccountScreen from 'app/screens/EditBankAccount';
import EditPasswordScreen from 'app/screens/EditPassword';
import EditProfileScreen from 'app/screens/EditProfile';
import ForgotPasswordScreen from 'app/screens/ForgotPassword';
import InboxScreen from 'app/screens/Inbox';
import IntroScreen from 'app/screens/Intro';
import SettingsScreen from 'app/screens/Setting';
import OtpConfirmScreen from 'app/screens/Others/OtpConfirmScreen';
import ProfileScreen from 'app/screens/Profile';
import ShopScreen from 'app/screens/Shop';
import WebViewScreen from 'app/screens/Others/WebViewScreen';
import WebViewAndroidScreen from 'app/screens/Others/WebViewAndroidScreen';
import LoginActivities from 'app/screens/LoginActivities';
import AboutAppayScreen from 'app/screens/AboutAppay';
import MailScreen from 'app/screens/Mail';

import ContactsListScreen from 'app/screens/ContactsList';
import ChatsListScreen from 'app/screens/ChatsList';
import ChatScreen from 'app/screens/Chat';
import ChatInboxScreen from 'app/screens/ChatInbox';
import ChatMessageDetailsScreen from 'app/screens/ChatMessageDetails';
import ChatSettingsScreen from 'app/screens/ChatSettings';
import CreateGroupChatScreen from 'app/screens/CreateGroupChat';
import AddNewContactScreen from 'app/screens/AddNewContact';
import AddChatMemberScreen from 'app/screens/AddChatMember';
import ChatMembersScreen from 'app/screens/ChatMembers';
import ChatImagesScreen from 'app/screens/ChatImages';
import ChatVideosScreen from 'app/screens/ChatVideos';
import CreateGroupChat2Screen from 'app/screens/CreateGroupChatStep2';

import PinMessageScreen from 'app/screens/PinMessage';

import ChatBox from 'app/screens/ChatBox';

// import CallScreen from 'app/screens/CallScreen';

import BlockedUsersScreen from 'app/screens/BlockedUsers';

import ReportScreen from 'app/screens/Report';

import NotificationOnBox from 'app/components/NotificationOnBox';

import NotiInApp from '../NotiInApp';

import TabBar from './Tabbar';

import ForwardScreen from '../Forward';

// --------------------------------------------------

/* eslint-disable */
const LOG_TAG = 'MainScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// TABs
// --------------------------------------------------

const HomeStackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    AvailableMoney: {
      screen: AvailableMoneyScreen,
    },
    AvailablePoints: {
      screen: AvailablePointsScreen,
    },
    EditBankAccount: {
      screen: EditBankAccountScreen,
    },
    EditPassword: {
      screen: EditPasswordScreen,
    },
    EditProfile: {
      screen: EditProfileScreen,
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
    },
    Inbox: {
      screen: InboxScreen,
    },
    Mail: {
      screen: MailScreen,
    },
    Intro: {
      screen: IntroScreen,
    },
    OtpConfirm: {
      screen: OtpConfirmScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    Shop: {
      screen: ShopScreen,
    },
    WebView: {
      screen: WebViewScreen,
    },
    WebViewAndroid: {
      screen: WebViewAndroidScreen,
    },
    Chat: {
      screen: ChatScreen,
    },
    ChatBox: { screen: ChatBox },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'screen',
  },
);

HomeStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const ContactsListStackNavigator = createStackNavigator(
  {
    ContactsList: { screen: ContactsListScreen },
    Chat: { screen: ChatScreen },
    // CallDemo: { screen: CallDemoScreen },
  },
  {
    initialRouteName: 'ContactsList',
  },
);

ContactsListStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const ChatsListStackNavigator = createStackNavigator(
  {
    ChatsList: { screen: ChatsListScreen },
    Chat: { screen: ChatScreen },
    ChatInbox: { screen: ChatInboxScreen },
    ChatMessageDetails: { screen: ChatMessageDetailsScreen },
    ChatBox: { screen: ChatBox },
    WebView: {
      screen: WebViewScreen,
    },
    WebViewAndroid: {
      screen: WebViewAndroidScreen,
    },
    EditPassword: {
      screen: EditPasswordScreen,
    },
    OtpConfirm: {
      screen: OtpConfirmScreen,
    },
    AvailableMoney: {
      screen: AvailableMoneyScreen,
    },
    AvailablePoints: {
      screen: AvailablePointsScreen,
    },
  },
  {
    initialRouteName: 'ChatsList',
  },
);

ChatsListStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const SettingStackNavigator = createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen,
    },
    EditBankAccount: {
      screen: EditBankAccountScreen,
    },
    EditPassword: {
      screen: EditPasswordScreen,
    },
    EditProfile: {
      screen: EditProfileScreen,
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
    },
    Inbox: {
      screen: InboxScreen,
    },
    Mail: {
      screen: MailScreen,
    },
    Intro: {
      screen: IntroScreen,
    },
    OtpConfirm: {
      screen: OtpConfirmScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    LoginActivities: {
      screen: LoginActivities,
    },
    AboutAppay: {
      screen: AboutAppayScreen,
    },
    WebView: {
      screen: WebViewScreen,
    },
    WebViewAndroid: {
      screen: WebViewAndroidScreen,
    },
    BlockedUsers: {
      screen: BlockedUsersScreen,
    },
    Report: {
      screen: ReportScreen,
    },
  },
  {
    initialRouteName: 'Settings',
    headerMode: 'screen',
  },
);

SettingStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const CreateGroupStackNavigator = createStackNavigator(
  {
    CreateGroupChat: { screen: CreateGroupChatScreen },
    CreateGroupChatStep2: { screen: CreateGroupChat2Screen },
  },
  {
    initialRouteName: 'CreateGroupChat',
  },
);

CreateGroupStackNavigator.navigationOptions = () => {
  const tabBarVisible = false;
  return {
    tabBarVisible,
  };
};

// --------------------------------------------------
// MAIN TAB
// --------------------------------------------------

const TAB_BAR_POSITION = Platform.OS === 'ios' ? 'bottom' : 'bottom';
const TAB_BAR_ICON_VISIBLE = true;
const TAB_BAR_TITLE_VISIBLE = true;
const TAB_BAR_LABEL_FONT_SIZE = Platform.OS === 'ios' ? 11 : 12;

const tabBarOnPress = ({ navigation, defaultHandler }) => {
  const { isFocused, state, goBack } = navigation;
  if (isFocused()) {
    if (state.routes.length > 1) {
      for (let i = 0; i < state.routes.length - 1; i += 1) {
        goBack();
      }
    } else {
      // @TODO SCROLL TO TOP OF EACH TAB IF SCROLLABLE, $CALLBACK().
    }
  } else {
    defaultHandler();
  }
};

// each tab is a stack navigator
const MainTabNavigator = createBottomTabNavigator(
  {
    HomeTab: {
      screen: HomeStackNavigator,
      navigationOptions: ({ navigation }) => {
        return HomeScreen.navigationOptions(navigation);
      },
    },
    ContactsListTab: {
      screen: ContactsListStackNavigator,
      navigationOptions: ContactsListScreen.navigationOptions(),
    },
    ChatsListTab: {
      screen: ChatsListStackNavigator,
      navigationOptions: ChatsListScreen.navigationOptions(),
    },
    SettingTab: {
      screen: SettingStackNavigator,
      navigationOptions: SettingsScreen.navigationOptions(),
    },
  },
  {
    initialRouteName: 'HomeTab',
    tabBarPosition: TAB_BAR_POSITION,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: '#007FFA',
      inactiveTintColor: '#808080',
      showIcon: TAB_BAR_ICON_VISIBLE,
      showLabel: TAB_BAR_TITLE_VISIBLE,
      style: {
        backgroundColor: '#FAFAFA',
      },
      indicatorStyle: {
        backgroundColor: '#E67A12',
      },
      labelStyle: {
        fontSize: TAB_BAR_LABEL_FONT_SIZE,
      },
    },
    navigationOptions: {
      swipeEnabled: false,
      tabBarOnPress,
    },
    tabBarComponent: TabBar,
  },
);

// wrap tab in a modal
const MainModalNavigator = createStackNavigator(
  {
    MainTabNavigator: { screen: MainTabNavigator },
    AddNewContact: { screen: AddNewContactScreen },
    AddChatMember: { screen: AddChatMemberScreen },
    CreateGroupChat: { screen: CreateGroupStackNavigator },
    ChatSettings: { screen: ChatSettingsScreen },
    ChatMembers: { screen: ChatMembersScreen },
    ChatImages: { screen: ChatImagesScreen },
    ChatVideos: { screen: ChatVideosScreen },
    // Call: { screen: CallScreen },
    ForwardScreen: { screen: ForwardScreen },
    PinMessage: { screen: PinMessageScreen },
    // CreateGroupChatStep2: { screen: CreateGroupChat2Screen },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    style: {
      backgroundColor: '#fff',
    },
  },
);

// wrap modal into a drawer
const MainDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Configs.enableChat ? MainModalNavigator : HomeStackNavigator,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
  },
  {
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentComponent: SlideMenu,
  },
);

const AppNavigator = createAppContainer(MainDrawerNavigator);

// --------------------------------------------------
// MainScreen
// --------------------------------------------------

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotiBox: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      NetInfo.fetch().then(this.handleConnectivityChange);
      this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleConnectivityChange);
    }, 3000);

    const asynTask = async () => {
      const value = await AsyncStorage.getItem('first_request_noti');
      if (value !== null && Platform.OS === 'ios') {
        setTimeout(() => {
          Permissions.request('notification', { type: ['alert', 'badge'] }).then((response) => {
            if (response === 'denied') {
              this.setState({
                showNotiBox: true,
              });
            }
          });
        }, 1000);
      } else {
        AsyncStorage.setItem('first_request_noti', 'true');
      }
    };
    asynTask();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }
  componentDidUpdate(prevProps) {
    // Utils.log(`${LOG_TAG} componentDidUpdate: `, this.props);
    // if (prevProps.pendingNotification === null && this.props.pendingNotification !== null) {
    //   this.showingNotification = this.props.pendingNotification;
    //   // remove pending
    //   this.props.setPendingNotification(null);
    //   // show notification
    //   this.showNotification(this.showingNotification);
    // }
  }

  componentWillUnmount() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
  }

  handleConnectivityChange = async () => {
    // eslint-disable-line
    let probablyHasInternet;
    try {
      const googleCall = await fetch(
        // eslint-disable-line
        'https://google.com',
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
          },
        },
      );
      probablyHasInternet = googleCall.status === 200;
    } catch (e) {
      probablyHasInternet = false;
    }

    if (this.props.internet !== probablyHasInternet) {
      this.props.internetState(probablyHasInternet);
      this.handleConnectionChange(probablyHasInternet);
    }

    if (probablyHasInternet === false) {
      setTimeout(() => {
        this.handleConnectivityChange();
      }, 3000);
    }
  };
  // --------------------------------------------------
  onNotificationAlertClose = ({ action }) => {
    // Utils.log(`${LOG_TAG} on notification close: `, action);
    // user tap on notificaton
    if (action === 'tap') {
      // by some reason, notificaton is null
      if (this.showingNotification === null) {
        return;
      }
      // plain text don't have any action -> stop here or it will show again
      // because handleTapOnNotification do show for plain text
      // if (this.showingNotification.type === NOTIFICATION_TYPES.PLAIN_TEXT) {
      //   return;
      // }
      // handle tap
      NotificationManager.shared().handleTapOnNotification(this.showingNotification);
    }
    // clear
    this.showingNotification = null;
  };
  // --------------------------------------------------
  showNotification(notification) {
    // Utils.log(`${LOG_TAG} showNotification: `, notification);
    // const title = (notification.title && notification.title.length > 0) ?
    //   notification.title : '';
    // const message = notification.details;
    // this.dropdown.alertWithType('custom', title, message);
  }
  handleConnectionChange = (isConnected) => {
    if (this.dropdownInternet) {
      if (isConnected) {
        this.dropdownInternet.close();
      } else {
        this.dropdownInternet.alertWithType('custom', '', 'Không có kết nối Internet');
      }
    }
  };
  onPopupBoxCancel = () => {
    this.setState({
      showNotiBox: false,
    });
  };
  onPopupBoxYes = () => {
    this.setState({
      showNotiBox: false,
    });
  };
  renderNotiBox = () => {
    return (
      <Modal
        isVisible={this.state.showNotiBox}
        useNativeDriver
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <NotificationOnBox
            onCancelPress={this.onPopupBoxCancel}
            onYesPress={this.onPopupBoxYes}
          />
          <View style={{ height: 44 }} />
        </View>
      </Modal>
    );
  };

  renderNotiInapp = () => {
    return <NotiInApp />;
  };

  // --------------------------------------------------
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppNavigator
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);

            if (prevScreen !== currentScreen) {
              this.props.currentScreenName(currentScreen);
            }
          }}
        />
        {this.renderNotiBox()}
        {this.renderNotiInapp()}
        <DropdownAlert
          ref={(o) => {
            this.dropdownInternet = o;
          }}
          closeInterval={0}
          updateStatusBar={false}
          containerStyle={{
            flexDirection: 'row',
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: '#ee4e32',
          }}
          messageStyle={{
            fontSize: 14,
            textAlign: 'center',
            color: 'white',
            backgroundColor: 'transparent',
          }}
          elevation={4}
          useNativeDriver
        />
      </View>
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

MainScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pendingNotification: state.pendingNotification,
  internet: state.internetState,
});

const mapDispatchToProps = (dispatch) => ({
  setPendingNotification: (noti) => dispatch(pendingNotification(noti)),
  setHomeNavigate: (screen, params) => dispatch(homeNavigate(screen, params)),
  internetState: (connected) => dispatch(internetState(connected)),
  currentScreenName: (name) => dispatch(currentScreenName(name)),
});

// export default MainScreen;
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const getActiveRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

// --------------------------------------------------
//
// custom left menu width
//
// import { Dimensions } from 'react-native';
//
// constructor(props) {
//   super(props);
//
//   const { width, height } = Dimensions.get('screen');
//   const leftMenuWidth = Math.min(width, height) * 0.7;
//
//   this.MainDrawerNavigator = DrawerNavigator(
//     {
//       Home: {
//         screen: HomeStackNavigator,
//       },
//     },
//     {
//       drawerWidth: leftMenuWidth,
//       contentComponent: LeftMenuView
//     }
//   );
// }
//
// end
