import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
  View,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Communications from 'react-native-communications';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';
import WelcomeUser from '../../components2/WelcomeUser/index';
import Colors from '../../theme/Color';
import InfoRow from './InfoRow';
import HeaderRow from './HeaderRow';
import SpaceRow from './SpaceRow';
import UserInfoContainer, { ACCOUNT_TYPE } from '../../components2/UserInfoContainer/index';
import Strings from '../../constants/strings';
import { logout } from '../../redux/actions';
import { Loading } from '../../components2/LoadingModal';
import { MFConfigs } from '../../constants/configs';
import { SCREEN_MODE } from '../PhoneInput/index';
import TextStyles from '../../theme/TextStyle';
import NavigationBar from '../../components2/NavigationBar';
import DigitelClient from '../../network/DigitelClient';
import { setShowPopupBrand } from '../../redux/actions/popup';
import AppText from '../../componentV3/AppText';
class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutWebview: false,
      hasEmployeeCard: false,
      isFetchingCard: false,
      supportLine: []
    };
  }

  componentDidMount() {
    this.fetchSupportLine();
    const fetchCard = async () => {
      this.setState({ isFetchingCard: true });
      try {
        const card = await DigitelClient.fetchEmployeeCard();
        if (card) {
          this.setState({ hasEmployeeCard: true });
        }
      } finally {
        this.setState({ isFetchingCard: false });
      }
    };
    fetchCard();
  }

  syncSupportLine = async (supportLine) => {
    await AsyncStorage.setItem(AsyncStorageKeys.SUPPORT_LINE, JSON.stringify(supportLine));
  }

  fetchSupportLine = async () => {
    const cacheSuportLine = await AsyncStorage.getItem(AsyncStorageKeys.SUPPORT_LINE);
    if (cacheSuportLine) {
      this.setState({ supportLine: JSON.parse(cacheSuportLine) });
    }
    const supportLine = await DigitelClient.getSupportLine();
    if(supportLine) {
      this.syncSupportLine(supportLine);
      this.setState({ supportLine });
    }
  }

  // #region EVENTS

  onEmployeeCardPress = () => {
    this.props.navigation.navigate('EmployeeCard');
  };
  onUpdatePhoneNumberPress = () => {
    this.props.navigation.navigate('PhoneInput', {
      screenMode: SCREEN_MODE.UPDATE_PHONE_NUMBER,
    });
  };
  onSeeMoreVerifiedAccountPress = () => {
    Alert.alert('Hello');
  };
  onUserInfoSectionPress = () => {
    this.props.navigation.navigate('Profile', { myUser: this.props.myUser });
  };
  onVerifyAccountPress = () => {
    Alert.alert('Verify Account');
  };
  onRegisterOfficial = () => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Ứng tuyển',
      url: MFConfigs.upPro,
    });
  };
  onWaitingOfficial = () => {
    Alert.alert('Waiting Official Account');
  };
  onLoginActivitiesPress = () => {
    this.props.navigation.navigate('LoginActivities');
  };
  onChangePasswordPress = () => {
    // this.props.navigation.navigate('EditPassword');
  };
  onBlockedUsersPress = () => {
    this.props.navigation.navigate('BlockedUsers');
  };
  onSettingNotificationPress = () => {
    this.props.navigation.navigate('NotificationSetting');
  }
  onAppayIntroPress = () => {
    this.props.navigation.navigate('AboutAppay');
  };
  onTermsOfUsagePress = () => {
    const { appInfo } = this.props;
    // Utils.log(`${LOG_TAG} onTermsOfUsagePress`);
    const title = 'Điều khoản sử dụng';
    const url = appInfo?.termsOfUsageUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onPrivacyPolicyPress = () => {
    const { appInfo } = this.props;
    // Utils.log(`${LOG_TAG} onPrivacyPolicyPress`);
    const title = 'Chính sách bảo mật';
    const url = appInfo?.privacyPolicyUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onContactEmailPress = () => {
    const email = this.props.myUser.email;
    const subject = 'MFast: yêu cầu hỗ trợ';
    const body = `Send from: ${email}\n`;
    Communications.email([this.props.appInfo.contactEmail], null, null, subject, body);
  };
  onContactPhoneNumberPress = () => {
    Communications.phonecall(this.props.appInfo.contactPhoneNumber, true);
  };
  onZaloPress = () => {
    Communications.web(this.props.appInfo.zaloFanpageURL);
  };
  onFacebookPress = () => {
    Communications.web(this.props.appInfo.facebookFanpageURL);
    // Communications.web('fb://page/191958701597238');
    // Linking.openURL(
    //   Platform.OS === 'ios' ? 'fb://profile/191958701597238' : 'fb://page/191958701597238',
    // );
  };
  onFAQPress = () => {
    const title = 'Câu hỏi thường gặp';
    const url = this.props.appInfo.faqUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onLogoutPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            this.logout();
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };
  onLogoutAllDevicesPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_of_all_devices_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            this.logout(true);
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };
  onReportPress = () => {
    // this.props.navigation.navigate('Report', { email: this.props.myUser.email });
    this.props.navigation.navigate('ChatFeedbackHome');
  };
  navigateToLoginModal = () => {
    this.props.navigation.navigate('LoginModal');
  };
  isLoggedIn = () => {
    return this.props.myUser.fullName !== undefined;
  };
  logout = (all = false) => {
    this.setState({ logoutWebview: true });
    this.props.logout(all);
  };

  onSupportLinePress = (openUrl) => {
    if(openUrl) {
      Linking.openURL(openUrl);
    }
  }

  onShowPopUpBrandPress = () => {
    this.props.setShowPopupBrand(true);
  }

  //--------------------------------------
  // Render methods
  //--------------------------------------
  renderLoadingData = () => {
    const { isFetchingCard } = this.state;
    return isFetchingCard ? (
      <View
        style={{
          position: 'absolute',
          top: 18,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AppText style={{ fontSize: 12, color: '#888' }}>{'Đang tải '}</AppText>
        <ActivityIndicator animating />
      </View>
    ) : null;
  };
  renderUserInfoSection = (myUserInfo) => {
    return (
      <UserInfoContainer
        user={myUserInfo}
        userRefCode={myUserInfo.referralCode}
        accountType={ACCOUNT_TYPE.NEED_REGISTER_OFFICIAL_ACCOUNT}
        onUserInfoPress={this.onUserInfoSectionPress}
        onRegisterOfficialPress={this.onRegisterOfficial}
        onUpdatePhoneNumberPress={this.onUpdatePhoneNumberPress}
      />
    );
  };
  renderLoginWelcomeSection = () => (
    <View>
      <WelcomeUser
        style={{ flex: 1, margin: 16 }}
        theme="dark"
        avatar={this.props.myUser.avatarImgURI}
        onPress={this.navigateToLoginModal}
      />
      <Image
        style={{ position: 'absolute', height: '100%', right: 10, top: 0, bottom: 0 }}
        source={require('./img/ic_next.png')}
        resizeMode="contain"
      />
    </View>
  );
  renderUserInfo = () => {
    const { myUser } = this.props;
    return (
      <View style={{ backgroundColor: '#fff' }}>
        {!this.isLoggedIn() ? this.renderLoginWelcomeSection() : this.renderUserInfoSection(myUser)}
      </View>
    );
  };
  renderManageAccount = () => {
    const { hasEmployeeCard } = this.state;
    return this.props.myUser.fullName ? (
      <View>
        <SpaceRow />
        <HeaderRow title={'Quản lý tài khoản'} />
        {this.renderLoadingData()}
        <View style={styles.sectionContainer}>
          <InfoRow
            testID="test_setting_notification_row"
            title={'Thiết lập thông báo'}
            details={''}
            isArrowHidden={false}
            onPress={this.onSettingNotificationPress}
          />
          {hasEmployeeCard ? (
            <InfoRow
              testID="test_login_history_row"
              title={'Công cụ bán hàng'}
              details={''}
              isArrowHidden={false}
              onPress={this.onEmployeeCardPress}
            />
          ) : null}
          <InfoRow
            title={'Lịch sử đăng nhập'}
            details={''}
            isArrowHidden={false}
            onPress={this.onLoginActivitiesPress}
          />
          {/* <InfoRow
            title={'Đổi mật khẩu'}
            details={''}
            isArrowHidden={false}
            onPress={this.onChangePasswordPress}
          /> */}
          <InfoRow
            title={'Danh sách người bị chặn'}
            details={''}
            isArrowHidden={false}
            onPress={this.onBlockedUsersPress}
          />
          <InfoRow
            title={'Đăng xuất'}
            details={''}
            isArrowHidden={false}
            onPress={this.onLogoutPress}
          />
          <InfoRow
            title={'Đăng xuất tất cả thiết bị'}
            details={''}
            isArrowHidden={false}
            isSeperatorHidden
            onPress={this.onLogoutAllDevicesPress}
          />
        </View>
      </View>
    ) : null;
  };
  renderSupport = () => {
    return (
      <View>
        <HeaderRow title={'Hỗ trợ'} />
        {this.renderContactsInfo()}
      </View>
    );
  };

  renderContactsInfo() {
    const { supportLine } = this.state;
    if(!supportLine || (supportLine && supportLine.length <= 0)) { return <View /> }
    return (
      <View style={styles.sectionContainer}>
        {supportLine.map((item, index) => (
          <InfoRow
            key={item.label}
            title={item.label}
            details={item.content}
            detailsStyle={styles.highlightText}
            onPress={() => this.onSupportLinePress(item?.open_url)}
            isSeperatorHidden={(supportLine.length - 1) === index}
          />
        ))}
      </View>
    );
  }
  renderAbout = () => {
    return (
      <View>
        <HeaderRow title={'Giới thiệu chung'} />
        {this.renderAppayInfo()}
      </View>
    );
  };
  renderAppayInfo() {
    const { popupBrand } = this.props;
    return (
      <View style={styles.sectionContainer}>
        {!!popupBrand?.isShowSetting && (
          <InfoRow
            title={popupBrand?.brand_label || ''}
            details={''}
            isArrowHidden={false}
            onPress={this.onShowPopUpBrandPress}
          />
        )}
        <InfoRow
          testID="test_about_appay_row"
          title={'Về MFAST'}
          details={''}
          isArrowHidden={false}
          onPress={this.onAppayIntroPress}
        />
        <InfoRow
          testID="test_agreement_row"
          title={'Điều khoản sử dụng'}
          details={''}
          isArrowHidden={false}
          onPress={this.onTermsOfUsagePress}
        />
        <InfoRow
          testID="test_security_row"
          title={'Chính sách bảo mật'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden
          onPress={this.onPrivacyPolicyPress}
        />
      </View>
    );
  }
  renderVerifiedAccountSection = () => (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onPress={() => this.setState({ isVerifiedAccount: true })}
    >
      <AppText style={{ ...TextStyles.heading3 }}>{'Xác thực tài khoản MFast'}</AppText>
      <AppText style={{ marginTop: 7 }}>{'Để rút tiền về tài khoản NH LK cần xác thực TK'}</AppText>
      <Image
        style={{ position: 'absolute', height: '100%', right: 10, top: 10, bottom: 0 }}
        source={require('./img/ic_next.png')}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
  renderNavigation() {
    return <NavigationBar title={'Cá nhân'} />;
  }
  renderLogoutWebview = () => {
    return this.state.logoutWebview ? (
      <View style={{ position: 'absolute', opacity: 0, width: 0 }}>
        <WebView
          ref={(object) => {
            this.webView = object;
          }}
          source={{ uri: MFConfigs.logoutWebview }}
          dataDetectorTypes={'none'}
        />
      </View>
    ) : null;
  };
  render() {
    const { isLogoutProcessing } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {this.renderNavigation()}
        <ScrollView>
          {this.renderUserInfo()}
          <SpaceRow />
          {this.renderManageAccount()}
          <SpaceRow />
          {this.renderSupport()}
          <SpaceRow />
          {this.renderAbout()}
          <SpaceRow />
          <SpaceRow />
        </ScrollView>
        <Loading visible={isLogoutProcessing} />
        {this.renderLogoutWebview()}
      </SafeAreaView>
    );
  }
}

SettingScreen.navigationOptions = () => {
  return {
    title: 'Cá nhân', // must have a space or navigation will crash
    header: null,
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: Colors.neutral5,
    },
    tabBarLabel: 'Cá nhân',
    headerBackTitle: null,
    tabBarIcon: ({ focused }) => {
      const icon = focused ? require('../img/ic_setting1.png') : require('../img/ic_setting.png');
      return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
    },
  };
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
  isLogoutProcessing: state.isLogoutProcessing,
  popupBrand: state.popupBrand.data,
});

const mapDispatchToProps = (dispatch) => ({
  logout: (isLogOutOfAllDevices) => dispatch(logout(isLogOutOfAllDevices)),
  setShowPopupBrand: (bool) => dispatch(setShowPopupBrand(bool)),
});

// export default SettingsScreen;
export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  highlightText: {
    color: Colors.primary2,
  },
  seperateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9E9E9',
    marginBottom: 10,
  },
});
