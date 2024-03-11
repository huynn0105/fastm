/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { currentScreenName, internetState } from 'app/redux/actions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Easing, Image, Platform, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Permissions from 'react-native-permissions';
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { connect } from 'react-redux';
import NotificationOnBox from '../../components/NotificationOnBox';
import { SH, SW } from '../../constants/styles';
import NotificationManager from '../../manager/NotificationManager';
import AddChatMemberScreen from '../../screens/AddChatMember/index';
import AddNewContactScreen from '../../screens/AddNewContact/index';
import SingleChatScreen from '../../screens/Chat';
import ChatBox from '../../screens/ChatBox/index';
import ChatImages from '../../screens/ChatImages/index';
import ChatMembers from '../../screens/ChatMembers/index';
import ChatMessageDetailsScreen from '../../screens/ChatMessageDetails';
// import CallScreen from '../../screens/CallScreen/index';
import ChatSettings from '../../screens/ChatSettings/index';
import ChatVideos from '../../screens/ChatVideos/index';
import CreateGroupChat from '../../screens/CreateGroupChat/index';
import CreateGroupChatStep2 from '../../screens/CreateGroupChatStep2/index';
import EditProfileScreen from '../../screens/EditProfile/index';
import ForwardScreen from '../../screens/Forward';
import PinMessageScreen from '../../screens/PinMessage';
import ChatListScreen from '../../screens2/Chat';
import AccountAdvancedUpdateScreen from '../../screenV3/AccountAdvancedUpdate/AccountAdvancedUpdate.index';
import AccountBasicUpdateScreen from '../../screenV3/AccountBasicUpdate/AccountBasicUpdate.index';
import AdLinkScreen from '../../screenV3/AdLink/AdLink.View';
import CreateAdLinkScreen from '../../screenV3/CreateAdLink/CreateAdLink.View';
// screen v3
import AccountIdentificationScreen from '../../screenV3/AccountIdentification/AccountIdentification.index';
import OldAccountIdentificationScreen from '../../screenV3/AccountIdentification/AccountIdentification.index';
import AccountInforScreen from '../../screenV3/AccountInfor/AccountInfor.index';
import AccountPrivateScreen from '../../screenV3/AccountPrivate/AccountPrivate.index';
import AccountPrivateVisibleScreen from '../../screenV3/AccountPrivateVisible/AccountPrivateVisible.index';
import AccountSettingScreen from '../../screenV3/AccountSetting/AccountSetting.View';
// import AccountSettingScreen from '../../screenV3/AccountSetting/AccountSetting.index';
import AddBankAccountScreen from '../../screenV3/AddBankAccount/AddBankAccount.index';
import BankAccountScreen from '../../screenV3/BankAccount/BankAccount.index';
import BankAccountDetailScreen from '../../screenV3/BankAccountDetail/BankAccountDetail.index';
import ContractCollaboratorsScreen from '../../screenV3/ContractCollaborators/ContractCollaborators.index';
import HomeScreen from '../../screenV3/Home';
import Login from '../../screenV3/login/Login.View';
import NewsScreen from '../../screenV3/News/News.View';
import NotiInApp from '../../screenV3/NotiInApp';
import PasswordAndSecurity from '../../screenV3/PasswordAndSecurity/PasswordAndSecurity.View';
import RegisterTaxNumberScreen from '../../screenV3/RegisterTaxNumber/RegisterTaxNumber.index';
import RSMPushMessage from '../../screenV3/RSMPushMessage/RSMPushMessage.View';
import FastLoanScreen from '../../screenV3/FastLoan/FastLoan.index';
import CustomerScreen from '../../screenV3/Customer/Customer.View';
import CustomerDetailScreen from '../../screenV3/CustomerDetail/CustomerDetailNew.View';
import Collaborator from '../../screenV3/Collaborator/Collaborator.View';
// import RegisterReferralScreen from '../../screenV3/RegisterReferral/RegisterReferral.View';
import RegisterReferralScreen from '../../screenV3/RegisterReferral/RegisterReferral.View';
import CollaboratorLeaveScreen from '../../screenV3/CollaboratorLeave/CollaboratorLeave.View';
import StatusESignScreen from '../../screenV3/StatusESign/StatusESign.View';
import Notification from '../../screenV3/Notification/Notification.View';
import MTrade from '../../screenV3/MTrade/MTrade.View';

//------------------------------------------------------------

import Colors from '../../theme/Color';
import { logEvent } from '../../tracking/Firebase';
import iphone12Helper from '../../utils/iphone12Helper';
import NavigationServices from '../../utils/NavigationService';
import AboutAppayScreen from '../AboutAppay/index';
import BlockedUsersScreen from '../BlockedUsers/index';
import ChatFeedbackScreen from '../ChatFeedback';
import ChatFeedbackHome from '../ChatFeedbackHome';
// import Collaborator from '../Collaborator';
import ContactRequestList from '../ContactRequestList';
import CreateContactRequest from '../CreateContactRequest';
import CustomCamera from '../CustomCamera';
import CustomCameraLiveness from '../CustomCameraLiveness';
// import CustomerScreen from '../Customer/index';
import EmployeeCard from '../EmployeeCard';
import EmployeeCardDetail from '../EmployeeCardDetail';
import ForgetPasswordScreen from '../ForgetPassword/index';
import LoginActivities from '../LoginActivities';
import LoginCitizenIdScreen from '../LoginCitizenId/index';
import NotificationSettingScreen from '../NotificationSetting';
import WebViewScreen from '../Others/WebViewScreen';
import OtpConfirmScreen from '../Otp';
import PhoneInputScreen from '../PhoneInput';
import ProfileScreen from '../Profile/index';
import RegisterNameScreen from '../RegisterAccount/RegisterNameScreen';
// import RegisterReferralScreen from '../RegisterAccount/RegisterReferralScreen';
import ReportScreen from '../Report/index';
import ServicesScreen from '../Services/index';
import SettingScreen from '../Setting/index';
import ShopScreen from '../Shop/index';
import SyncProfileScreen from '../SyncProfile';
import WalletScreen from '../Wallet';
import ChatNotificationIcon from './ChatNotificationIcon';
import TabBar from './Tabbar';
import RSMDetailMessage from '../../screenV3/RSMDetailMessage/RSMDetailMessage.View';
import CollaboratorPending from '../../screenV3/CollaboratorPending/CollaboratorPending.View';
import HeaderApp from '../../componentV3/HeaderApp/HeaderApp';
import IncomeScreen from '../../screenV3/Income/Income.View';
import ConfirmCollaboratorPending from '../../screenV3/ConfirmCollaboratorPending/ConfirmCollaboratorPending';
import KJButton from '../../components/common/KJButton';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import MTradeSearch from '../../screenV3/MTradeSearch/MTradeSearch.View';
import MTradeListProduct from '../../screenV3/MTradeListProduct/MTradeListProduct.View';
import MTradeDetailProduct from '../../screenV3/MTradeDetailProduct/MTradeDetailProduct.View';
import MTradePayment from '../../screenV3/MTradePayment/MTradePayment.View';
import { IS_ANDROID } from '../../utils/Utils';
import TabBarMTrade from './TabBarMTrade';
import MTradeCard from '../../screenV3/MTradeCard/MTradeCard.View';
import MTradeOrder from '../../screenV3/MTradeOrder/MTradeOrder.View';
import MTradeDetailCollaborator from '../../screenV3/MTradeDetailCollaborator/MTradeDetailCollaborator.View';
import MTradeListOrder from '../../screenV3/MTradeListOrder/MTradeListOrder.View';
import AddBankAccountBIDV from '../../screenV3/AddBankAccountBIDV/AddBankAccountBIDV.View';

const _ = require('lodash');

const FINISH_CONST = Platform.OS === 'ios' ? 1 : 0.7;
const ALPHA_CONST = 0;
const DURATION_CONST = Platform.OS === 'ios' ? 200 : 250;
const DISTANCE_CONT = Platform.OS === 'ios' ? 100 : 100;

export const defaultNavOptions = {
  headerBackTitle: null,
  headerTintColor: Colors.primary4,
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: Colors.neutral5,
    elevation: 0,
    zIndex: 1,
  },
  headerTitleStyle: {
    fontFamily: 'MFastVN-Regular',
  },
  header: (headerProps) => {
    return <HeaderApp {...headerProps} />;
  },
  headerLeft: (headerLeftProps) => {
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
        onPress={() =>
          headerLeftProps.scene.descriptor.navigation.goBack(headerLeftProps.scene.descriptor.key)
        }
      />
    );
  },
};

const rightFade = (props) => {
  const { position, scene } = props;

  const index = scene.index;

  // const translateX = 0;
  const translateY = 0;

  const opacity = position.interpolate({
    inputRange: [index - FINISH_CONST, index, index + FINISH_CONST],
    outputRange: [ALPHA_CONST, 1, ALPHA_CONST],
    // inputRange: [index - 1, index],
    // outputRange: [0, 1],
  });

  return {
    opacity,
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [index - FINISH_CONST, index, index + FINISH_CONST],
          outputRange: [DISTANCE_CONT, 0, -30],
        }),
      },
      { translateY },
    ],
  };
};

const bottomFade = (props) => {
  const { position, scene } = props;

  const index = scene.index;

  const translateX = 0;

  const opacity = position.interpolate({
    inputRange: [index - FINISH_CONST, index, index + FINISH_CONST],
    outputRange: [ALPHA_CONST, 1, ALPHA_CONST],
    // inputRange: [index - 1, index],
    // outputRange: [0, 1],
  });

  return {
    opacity,
    transform: [
      {
        translateY: position.interpolate({
          inputRange: [index - FINISH_CONST, index, index + FINISH_CONST],
          outputRange: [100, 0, -10],
        }),
      },
      { translateX },
    ],
  };
};

const transitionStackConfig = () => ({
  transitionSpec: {
    duration: DURATION_CONST,
    easing: Easing.out(Easing.poly(2)),
    timing: Animated.timing,
    useNativeDriver: true,
  },
  screenInterpolator: (props) => {
    return rightFade(props);
  },
});

const transitionModalConfig = () => ({
  transitionSpec: {
    duration: DURATION_CONST,
    easing: Easing.out(Easing.poly(2)),
    timing: Animated.timing,
    useNativeDriver: true,
  },
  screenInterpolator: (props) => {
    return bottomFade(props);
  },
});

const HomeStackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    Services: { screen: ServicesScreen },
    News: {
      screen: NewsScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thông tin',
      },
      // navigationOptions: ({ navigation }) => {
      //   return NewsScreen.navigationOptions(navigation);
      // },
    },
    WebView: { screen: WebViewScreen },
    Profile: { screen: ProfileScreen },
    Shop: { screen: ShopScreen },
    // Call: { screen: CallScreen },
    Chat: { screen: SingleChatScreen },
    ChatBox: { screen: ChatBox },
    ChatFeedbackHome: { screen: ChatFeedbackHome },
    ChatFeedback: {
      screen: ChatFeedbackScreen,
      navigationOptions: {
        ...defaultNavOptions,
      },
    },
    EmployeeCard: { screen: EmployeeCard },
    EmployeeCardDetail: { screen: EmployeeCardDetail },
    NotificationSetting: { screen: NotificationSettingScreen },
    WalletScreen: { screen: WalletScreen },
    AccountInforScreen: {
      screen: AccountInforScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thông tin cá nhân',
      },
    },
    Notification: {
      screen: Notification,
      navigationOptions: {
        header: null,
      },
    },
    AccountIdentificationScreen: {
      screen: AccountIdentificationScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Định danh tài khoản',
      },
    },
    OldAccountIdentificationScreen: {
      screen: OldAccountIdentificationScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Định danh tài khoản',
      },
    },
    FastLoanScreen: {
      screen: FastLoanScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Giới thiệu khách hàng vay',
      },
    },
    BankAccountScreen: {
      screen: BankAccountScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Tài khoản ngân hàng',
      },
    },
    AddBankAccountScreen: {
      screen: AddBankAccountScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm tài khoản ngân hàng',
      },
    },
    AccountBasicUpdateScreen: {
      screen: AccountBasicUpdateScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Cập nhật thông tin cơ bản',
      },
    },
    AdLinkScreen: {
      screen: AdLinkScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Tiếp thị liên kết',
      },
    },
    IncomeScreen: {
      screen: IncomeScreen,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavOptions,
        title: 'Thu nhập trong tháng',
      }),
    },
    ConfirmCollaboratorPending: {
      screen: ConfirmCollaboratorPending,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Xác nhận lời mời',
      },
    },
    CustomerDetail: {
      screen: CustomerDetailScreen,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavOptions,
        title: navigation.state?.params?.title || 'Chi tiết khách hàng',
      }),
    },
    CreateContactRequest: {
      screen: CreateContactRequest,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm liên hệ mới',
      },
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: transitionStackConfig,
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

const LoginStackNavigator = createStackNavigator(
  {
    LoginModal: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    OtpConfirm: { screen: OtpConfirmScreen },
    LoginCitizenId: { screen: LoginCitizenIdScreen },
    RegisterName: { screen: RegisterNameScreen },
    PhoneInput: { screen: PhoneInputScreen },
    ForgetPassword: { screen: ForgetPasswordScreen },
    WebView: { screen: WebViewScreen },
  },
  {
    transitionConfig: transitionStackConfig,
  },
  // {
  //   headerMode: 'none',
  // },
);

const EditProfileStackNavigator = createStackNavigator(
  {
    EditProfileScreen: { screen: EditProfileScreen },
    OtpConfirm: { screen: OtpConfirmScreen },
  },
  {
    initialRouteName: 'EditProfileScreen',
    transitionConfig: transitionStackConfig,
  },
  // {
  //   headerMode: 'none',
  // },
);

const CustomerStackNavigator = createStackNavigator(
  {
    Customer: {
      screen: CustomerScreen,
      navigationOptions: {
        header: null,
      },
    },
    CustomerDetail: {
      screen: CustomerDetailScreen,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavOptions,
        title: navigation.state?.params?.title || 'Chi tiết khách hàng',
      }),
    },
    WebView: { screen: WebViewScreen },
    Chat: { screen: SingleChatScreen },
    ChatBox: { screen: ChatBox },
    AccountBasicUpdateScreen: {
      screen: AccountBasicUpdateScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Cập nhật thông tin cơ bản',
      },
    },
    AdLinkScreen: {
      screen: AdLinkScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Tiếp thị liên kết',
      },
    },
    CreateAdLinkScreen: {
      screen: CreateAdLinkScreen,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavOptions,
        title: navigation.state?.params?.title || 'Tạo Tiếp thị liên kết',
      }),
    },
    CreateContactRequest: {
      screen: CreateContactRequest,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm liên hệ mới',
      },
    },
  },
  {
    initialRouteName: 'Customer',
    headerBackTitleVisible: false,
    transitionConfig: transitionStackConfig,
  },
);

CustomerStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const ShopStackNavigator = createStackNavigator(
  {
    Shop: { screen: ShopScreen },
    WebView: { screen: WebViewScreen },
  },
  {
    initialRouteName: 'Shop',
    transitionConfig: transitionStackConfig,
  },
);

ShopStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const CollaboratorStackNavigator = createStackNavigator(
  {
    Collaborator: { screen: Collaborator, navigationOptions: { header: null } },
    CollaboratorPending: {
      screen: CollaboratorPending,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Cộng tác viên chờ duyệt',
      },
    },
    ConfirmCollaboratorPending: {
      screen: ConfirmCollaboratorPending,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Xác nhận lời mời',
      },
    },
    CollaboratorLeaveScreen: {
      screen: CollaboratorLeaveScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'CTV cần theo dõi',
      },
    },
    WebView: { screen: WebViewScreen },
    Chat: { screen: SingleChatScreen },
    ChatBox: { screen: ChatBox },
    RSMPushMessage: {
      screen: RSMPushMessage,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Gửi tin nhắn hàng loạt',
      },
    },
    RSMDetailMessage: {
      screen: RSMDetailMessage,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Chi tiết thông báo',
      },
    },
    CreateContactRequest: {
      screen: CreateContactRequest,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm liên hệ mới',
      },
    },
  },
  {
    initialRouteName: 'Collaborator',
    transitionConfig: transitionStackConfig,
    headerMode: 'screen',
    headerBackTitleVisible: false,
  },
);

CollaboratorStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const ChatListStackNavigator = createStackNavigator(
  {
    ChatList: { screen: ChatListScreen },
    CreateGroupChat: { screen: CreateGroupChat },
    CreateGroupChatStep2: { screen: CreateGroupChatStep2 },
    AddNewContact: { screen: AddNewContactScreen },
    Chat: { screen: SingleChatScreen },
    ChatBox: { screen: ChatBox },
    ContactRequestList: { screen: ContactRequestList },
    EmployeeCard: { screen: EmployeeCard },
    EmployeeCardDetail: { screen: EmployeeCardDetail },

    ChatMessageDetails: { screen: ChatMessageDetailsScreen },
    ChatSettings: { screen: ChatSettings },
    ChatMembers: { screen: ChatMembers },
    ChatImages: { screen: ChatImages },
    ChatVideos: { screen: ChatVideos },
    AddChatMember: { screen: AddChatMemberScreen },
    NotificationSetting: { screen: NotificationSettingScreen },
    WebView: { screen: WebViewScreen },
    ChatFeedbackHome: { screen: ChatFeedbackHome },
    ChatFeedback: {
      screen: ChatFeedbackScreen,
      navigationOptions: {
        ...defaultNavOptions,
      },
    },
    CreateContactRequest: {
      screen: CreateContactRequest,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm liên hệ mới',
      },
    },
  },
  {
    initialRouteName: 'ChatList',
    // headerMode: 'none',
    headerBackTitleVisible: false,
    transitionConfig: transitionStackConfig,
  },
);

ChatListStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation?.state?.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const SettingStackNavigator = createStackNavigator(
  {
    Setting: { screen: SettingScreen },
    LoginActivities: { screen: LoginActivities },
    AboutAppay: { screen: AboutAppayScreen },
    WebView: {
      screen: WebViewScreen,
    },
    BlockedUsers: {
      screen: BlockedUsersScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Danh sách người bị chặn',
      },
    },
    Report: {
      screen: ReportScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    ChatFeedbackHome: { screen: ChatFeedbackHome },
    ChatFeedback: {
      screen: ChatFeedbackScreen,
      navigationOptions: {
        ...defaultNavOptions,
      },
    },
    EmployeeCard: { screen: EmployeeCard },
    EmployeeCardDetail: { screen: EmployeeCardDetail },
    OtpConfirm: { screen: OtpConfirmScreen },
    SyncProfile: { screen: SyncProfileScreen },
    NotificationSetting: { screen: NotificationSettingScreen },
  },
  {
    initialRouteName: 'Setting',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: transitionStackConfig,
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

const FeedbackStackNavigator = createStackNavigator(
  {
    ChatFeedbackHome: { screen: ChatFeedbackHome },
    ChatFeedback: {
      screen: ChatFeedbackScreen,
      navigationOptions: {
        ...defaultNavOptions,
      },
    },
  },
  {
    initialRouteName: 'ChatFeedbackHome',
    headerMode: 'screen',
    transitionConfig: transitionStackConfig,
  },
);

FeedbackStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const AccountStackNavigator = createStackNavigator(
  {
    AccountSettingScreen: {
      screen: AccountSettingScreen,
      navigationOptions: {
        header: null,
      },
    },
    AccountInforScreen: {
      screen: AccountInforScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thông tin cá nhân',
      },
    },
    AccountIdentificationScreen: {
      screen: AccountIdentificationScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Định danh tài khoản',
      },
    },
    BankAccountScreen: {
      screen: BankAccountScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Tài khoản ngân hàng',
      },
    },
    AddBankAccountScreen: {
      screen: AddBankAccountScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm tài khoản ngân hàng',
      },
    },
    AccountBasicUpdateScreen: {
      screen: AccountBasicUpdateScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Cập nhật thông tin cơ bản',
      },
    },
    AccountAdvancedUpdateScreen: {
      screen: AccountAdvancedUpdateScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Cập nhật thông tin',
      },
    },
    ContractCollaboratorsScreen: {
      screen: ContractCollaboratorsScreen,
      navigationOptions: {
        ...defaultNavOptions,
        headerTitleStyle: {
          ...defaultNavOptions.headerTitleStyle,
          lineHeight: 20,
        },
        title: 'Hợp đồng dịch vụ MFast',
      },
    },
    BankAccountDetailScreen: {
      screen: BankAccountDetailScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Chi tiết tài khoản',
      },
    },
    PrivateAccountScreen: {
      screen: AccountPrivateScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thiết lập tài khoản',
      },
    },
    AccountPrivateVisibleScreen: {
      screen: AccountPrivateVisibleScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thiết lập hiển thị tài khoản',
      },
    },
    RegisterTaxNumberScreen: {
      screen: RegisterTaxNumberScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Đăng ký tạo MST TNCN',
      },
    },
    PasswordAndSecurity: {
      screen: PasswordAndSecurity,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Mật khẩu và bảo mật',
      },
    },
    RSMPushMessage: {
      screen: RSMPushMessage,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Gửi tin nhắn hàng loạt',
      },
    },
    RSMDetailMessage: {
      screen: RSMDetailMessage,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Chi tiết thông báo',
      },
    },
    LoginActivities: { screen: LoginActivities },
    AboutAppay: {
      screen: AboutAppayScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thông tin ứng dụng',
      },
    },
    WebView: { screen: WebViewScreen },
    BlockedUsers: {
      screen: BlockedUsersScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Danh sách người bị chặn',
      },
    },
    EmployeeCard: { screen: EmployeeCard },
    EmployeeCardDetail: { screen: EmployeeCardDetail },
    ChatFeedbackHome: { screen: ChatFeedbackHome },
    ChatFeedback: {
      screen: ChatFeedbackScreen,
      navigationOptions: {
        ...defaultNavOptions,
      },
    },
    WalletScreen: { screen: WalletScreen },
    RegisterReferral: { screen: RegisterReferralScreen },
    NotificationSetting: {
      screen: NotificationSettingScreen,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thiết lập thông báo',
      },
    },
    StatusESign: {
      screen: StatusESignScreen,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavOptions,
        title: 'Xác thực ký hợp đồng',
      }),
    },
    CreateContactRequest: {
      screen: CreateContactRequest,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm liên hệ mới',
      },
    },
    AddBankAccountBIDVScreen: {
      screen: AddBankAccountBIDV,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thêm tài khoản ngân hàng',
      },
    },
  },
  {
    initialRouteName: 'AccountSettingScreen',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: transitionStackConfig,
  },
);

AccountStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

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
      navigationOptions: () => {
        return {
          title: 'Trang chủ',
          header: null,
          tabBarIcon: ({ focused }) => {
            const icon = focused ? require('./img/home_on.png') : require('./img/home_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
            logEvent('HOME_TAB');
          },
        };
      },
    },
    CustomerTab: {
      screen: CustomerStackNavigator,
      navigationOptions: () => {
        return {
          title: ' ',
          header: null,
          tabBarLabel: 'Khách hàng',
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? require('./img/customer_on.png')
              : require('./img/customer_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
            logEvent('CUSTOMER_TAB');
          },
        };
      },
    },
    CollaboratorTab: {
      screen: CollaboratorStackNavigator,
      navigationOptions: () => {
        return {
          title: ' ',
          header: null,
          tabBarLabel: 'Thu nhập',
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? require('./img/ic_income_on.png')
              : require('./img/ic_income_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
            logEvent('COLLABORATOR_TAB');
          },
        };
      },
    },
    SettingTab: {
      screen: AccountStackNavigator,
      navigationOptions: () => {
        return {
          title: '', // must have a space or navigation swill crash
          header: null,
          tabBarLabel: 'Cá nhân',
          headerBackTitle: null,
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? require('./img/setting_on.png')
              : require('./img/setting_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
            logEvent('SETTING_TAB');
          },
        };
      },
    },
  },
  {
    initialRouteName: 'HomeTab',
    tabBarPosition: TAB_BAR_POSITION,
    animationEnabled: false,
    navigationOptions: {
      swipeEnabled: false,
      tabBarOnPress,
    },
    tabBarComponent: TabBar,
  },
);

const ChatStackNavigator = createStackNavigator(
  {
    Chat: { screen: SingleChatScreen },
    ChatSettings: { screen: ChatSettings },
    ChatMembers: { screen: ChatMembers },
    ChatImages: { screen: ChatImages },
    ChatVideos: { screen: ChatVideos },
    AddChatMember: { screen: AddChatMemberScreen },
    NotificationSetting: { screen: NotificationSettingScreen },
  },
  {
    initialRouteName: 'Chat',
    headerMode: 'none',
    transitionConfig: transitionStackConfig,
  },
);

const SCREEN_WITHOUT_ANIMATIOIN = ['MTradeSearch'];

const MTradeHomeStackNavigator = createStackNavigator(
  {
    MTrade: {
      screen: MTrade,
    },
    MTradeSearch: {
      screen: MTradeSearch,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'MTrade',
      },
    },
    MTradeListProduct: {
      screen: MTradeListProduct,
      navigationOptions: {
        ...defaultNavOptions,
      },
    },
  },
  {
    initialRouteName: 'MTrade',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: (transitionProps, prevTransitionProps) => ({
      transitionSpec: {
        duration: SCREEN_WITHOUT_ANIMATIOIN.some(
          (screenName) =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
        )
          ? 0
          : DURATION_CONST,
      },
    }),
  },
);
const MTradeCardStackNavigator = createStackNavigator(
  {
    MTradeCard: {
      screen: MTradeCard,
    },
  },
  {
    initialRouteName: 'MTradeCard',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: (transitionProps, prevTransitionProps) => ({
      transitionSpec: {
        duration: SCREEN_WITHOUT_ANIMATIOIN.some(
          (screenName) =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
        )
          ? 0
          : DURATION_CONST,
      },
    }),
  },
);
const MTradeOrderStackNavigator = createStackNavigator(
  {
    MTradeOrder: {
      screen: MTradeOrder,
    },
  },
  {
    initialRouteName: 'MTradeOrder',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: (transitionProps, prevTransitionProps) => ({
      transitionSpec: {
        duration: SCREEN_WITHOUT_ANIMATIOIN.some(
          (screenName) =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
        )
          ? 0
          : DURATION_CONST,
      },
    }),
  },
);

const MTradeTabNavigator = createBottomTabNavigator(
  {
    MTradeCardStack: {
      screen: MTradeCardStackNavigator,
      navigationOptions: () => {
        return {
          tabBarLabel: 'Giỏ hàng',
          tabBarIcon: ({ focused }) => {
            const icon = focused ? require('./img/card_on.png') : require('./img/card_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
          },
        };
      },
    },
    MTradeHomeStack: {
      screen: MTradeHomeStackNavigator,
      navigationOptions: () => {
        return {
          tabBarLabel: 'Sản phẩm',
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? require('./img/product_on.png')
              : require('./img/product_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
          },
        };
      },
    },
    MTradeOrderStack: {
      screen: MTradeOrderStackNavigator,
      navigationOptions: () => {
        return {
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({ focused }) => {
            const icon = focused ? require('./img/order_on.png') : require('./img/order_off.png');
            return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
          },
          tabBarOnPress: ({ defaultHandler }) => {
            defaultHandler();
          },
        };
      },
    },
  },
  {
    initialRouteName: 'MTradeHomeStack',
    tabBarPosition: TAB_BAR_POSITION,
    animationEnabled: false,
    navigationOptions: {
      swipeEnabled: false,
      tabBarOnPress,
    },
    tabBarComponent: TabBarMTrade,
  },
);

const MTradeContainerNavigator = createStackNavigator(
  {
    MTradeTabNavigator: {
      screen: MTradeTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    MTradeDetailProduct: {
      screen: MTradeDetailProduct,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thông tin sản phẩm',
      },
    },
    MTradePayment: {
      screen: MTradePayment,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Thông tin đơn hàng',
      },
    },
    MTradeDetailCollaborator: {
      screen: MTradeDetailCollaborator,
      navigationOptions: {
        ...defaultNavOptions,
        title: 'Chi tiết cộng tác viên',
      },
    },
    MTradeListOrder: {
      screen: MTradeListOrder,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavOptions,
        title: navigation.state?.params?.title || 'Đơn hàng',
      }),
    },
    WebView: { screen: WebViewScreen },
  },
  {
    initialRouteName: 'MTradeTabNavigator',
    headerMode: 'screen',
    headerBackTitleVisible: false,
    transitionConfig: (transitionProps, prevTransitionProps) => ({
      transitionSpec: {
        duration: SCREEN_WITHOUT_ANIMATIOIN.some(
          (screenName) =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName),
        )
          ? 0
          : DURATION_CONST,
      },
      screenInterpolator: (props) => {
        return rightFade(props);
      },
    }),
  },
);

// wrap tab in a modal
const MainModalNavigator = createStackNavigator(
  {
    MainTabNavigator: { screen: MainTabNavigator },
    LoginModal: { screen: LoginStackNavigator },
    Login: { screen: LoginStackNavigator },
    Profile: { screen: ProfileScreen },
    ChatList: { screen: ChatListStackNavigator },
    ChatBox: { screen: ChatBox },
    CustomCamera: { screen: CustomCamera },
    CustomCameraLiveness: { screen: CustomCameraLiveness },
    OtpConfirm: { screen: OtpConfirmScreen },
    PhoneInput: { screen: PhoneInputScreen },
    RegisterName: { screen: RegisterNameScreen },

    ForgetPassword: { screen: ForgetPasswordScreen },
    WebView: { screen: WebViewScreen },
    EditProfile: { screen: EditProfileStackNavigator },
    ForwardScreen: { screen: ForwardScreen },
    PinMessage: { screen: PinMessageScreen },
    NotificationSetting: { screen: NotificationSettingScreen },
    MTradeContainerNavigator: { screen: MTradeContainerNavigator },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    style: {
      backgroundColor: '#fff',
    },
    transitionConfig: transitionStackConfig,
  },
);

const AppNavigator = createAppContainer(MainModalNavigator);

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
    logEvent('view_Home');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
      return true;
    }
    return false;
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
    if (action === 'tap') {
      if (this.showingNotification === null) {
        return;
      }
      NotificationManager.shared().handleTapOnNotification(this.showingNotification);
    }
    this.showingNotification = null;
  };
  // --------------------------------------------------
  showNotification() {}
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
          ref={NavigationServices.setTopLevelNavigator}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);

            if (prevScreen !== currentScreen) {
              this.props.currentScreenName(currentScreen);
              logEvent(`view_${currentScreen}`);
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
  internet: state.internetState,
});

const mapDispatchToProps = (dispatch) => ({
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
