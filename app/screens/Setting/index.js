import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Animated,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Communications from 'react-native-communications';
import ImageButton from 'common/buttons/ImageButton';
// import { NOTIFICATION_CATEGORIES } from 'app/models/Notification';
import { TrackingEvents } from 'app/constants/keys';
import DigitelClient from 'app/network/DigitelClient';
import Strings from 'app/constants/strings';

import {
  SystemThread,
} from 'app/models';

import {
  logout,
} from 'app/redux/actions';

import AppStyles from '../../constants/styles';

import HeaderRow from './HeaderRow';
import InfoRow from './InfoRow';
import SpaceRow from './SpaceRow';
import UserInfoRow from './UserInfoRow';

import NavigationBarHome from '../Home/NavigationBarHome';

/* eslint-disable */
import Utils, { getAppVersionAndBuild } from '../../utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = '7777: SettingsScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// SettingsScreen
// --------------------------------------------------

class SettingsScreen extends Component {

  state = {
    needRenderManageAccount: false,
    needRenderAppayInfo: false,
    needRenderContactInfo: false,
  }

  componentDidMount() {
    setTimeout(() => this.setState({ needRenderManageAccount: true }), 0);
    setTimeout(() => this.setState({ needRenderAppayInfo: true }), 0);
    setTimeout(() => this.setState({ needRenderContactInfo: true }), 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // onInboxPress = () => {
  //   const category = NOTIFICATION_CATEGORIES.SYSTEM;
  //   this.props.navigation.navigate('Inbox', { category, title: 'Thông báo từ Hệ Thống' });
  // }
  // onMailPress = () => {
  //   this.props.navigation.navigate('Mail');
  // }
  onInboxPress = () => {
    const thread = SystemThread.systemThread();
    this.props.navigation.navigate('ChatsListTab');
    setTimeout(() => {
      this.props.navigation.navigate('ChatBox', { thread });
    }, 200);
  }
  onMailPress = () => {
    // this.props.navigation.navigate('Mail');
    const thread = SystemThread.adminThread();
    this.props.navigation.navigate('ChatsListTab');
    setTimeout(() => {
      this.props.navigation.navigate('ChatBox', { thread });
    }, 200);
  }

  onUserInfoPress = () => {
    this.props.navigation.navigate('Profile');
  }

  onLoginActivitiesPress = () => {
    this.props.navigation.navigate('LoginActivities');
  }

  onChangePasswordPress = () => {
    this.props.navigation.navigate('EditPassword');
  }

  onBlockedUsersPress = () => {
    this.props.navigation.navigate('BlockedUsers');
  }

  onLogoutPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            // tracking
            DigitelClient.trackEvent(TrackingEvents.USER_LOGOUT);
            // wait a bit and logout
            setTimeout(() => {
              this.props.logout();
            }, 500);
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  onLogoutAllDevicesPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_of_all_devices_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            // tracking
            DigitelClient.trackEvent(TrackingEvents.USER_LOGOUT);
            // wait a bit and logout
            setTimeout(() => {
              this.props.logout(true);
            }, 500);
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  onAppayIntroPress = () => {
    this.props.navigation.navigate('AboutAppay');
  }
  onTermsOfUsagePress = () => {
    // Utils.log(`${LOG_TAG} onTermsOfUsagePress`);
    const title = 'Điều khoản sử dụng';
    const url = this.props.appInfo.termsOfUsageUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  }
  onPrivacyPolicyPress = () => {
    // Utils.log(`${LOG_TAG} onPrivacyPolicyPress`);
    const title = 'Chính sách bảo mật';
    const url = this.props.appInfo.privacyPolicyUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  }
  onContactEmailPress = () => {
    Utils.log(`${LOG_TAG} onContactEmailPress`);
    const email = this.props.myUser.email;
    const subject = 'MFast: yêu cầu hỗ trợ';
    const body = `Send from: ${email}\n`;
    Communications.email([this.props.appInfo.contactEmail], null, null, subject, body);
  }
  onContactPhoneNumberPress = () => {
    Utils.log(`${LOG_TAG} onContactPhoneNumberPress`);
    Communications.phonecall(this.props.appInfo.contactPhoneNumber, true);
  }
  onZaloPress = () => {
    Communications.web(this.props.appInfo.zaloFanpageURL);
  }
  onFacebookPress = () => {
    Communications.web(this.props.appInfo.facebookFanpageURL);
  }
  onFAQPress = () => {
    const title = 'Câu hỏi thường gặp';
    const url = this.props.appInfo.faqUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  }
  onReportPress = () => {
    this.props.navigation.navigate('Report', { email: this.props.myUser.email });
  }

  // --------------------------------------------------
  // 5/4/08
  // renderDigiPayInfo() {
  //   return (
  //     <View style={styles.digipayContainer}>
  //       <Text style={styles.digipayText}>
  //         {AppStrings.digipay_info_1}
  //       </Text>
  //       <View style={{ height: 12, backgroundColor: '#0000' }} />
  //       <Text style={styles.digipayText}>
  //         {AppStrings.digipay_info_2}
  //       </Text>
  //     </View>
  //   );
  // }

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
        titleView={
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#000',
          }
          }
          >
            Thiết lập
          </Text>
        }
        onTitlePress={this.onAvatarPress}
        // leftButton={
        // <InboxButton
        //   onPress={this.onInboxPress}
        // />
        // }
        // leftButtonBadge={inboxButtonBadge}
        // rightButton={
        // <MailButton
        //   onPress={this.onMailPress}
        // />
        // }
        // rightButtonBadge={mailButtonBadge}
        scrollY={new Animated.Value(0)}
      />
    );
  }

  renderManageAcocunt = () => {
    return (
      <View style={styles.appayContainer}>
        <InfoRow
          testID="test_login_history_row"
          title={'Lịch sử đăng nhập'}
          details={''}
          isArrowHidden={false}
          onPress={this.onLoginActivitiesPress}
        />
        <InfoRow
          testID="test_change_pass_row"
          title={'Đổi mật khẩu'}
          details={''}
          isArrowHidden={false}
          onPress={this.onChangePasswordPress}
        />
        <InfoRow
          testID="test_login_history_row_"
          title={'Danh sách người bị chặn'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden
          onPress={this.onBlockedUsersPress}
        />
      </View>
    );
  }

  renderAppayInfo() {
    return (
      <View style={styles.appayContainer}>
        {/* // 4/4/08
        <InfoRow
          title={'Phiên bản hiện tại'}
          details={appVersion}
        /> */}
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
  renderContactsInfo() {
    const contactEmail = this.props.appInfo.contactEmail;
    const contactPhoneNumber = this.props.appInfo.contactPhoneNumberPretty;
    return (
      <View style={styles.contactsContainer}>
        <InfoRow
          title={'Hotline'}
          // subtitle={'(hỗ trợ chat Zalo/ Viber)'}
          details={contactPhoneNumber}
          detailsStyle={styles.highlightText}
          onPress={this.onContactPhoneNumberPress}
        />
        <InfoRow
          title={'Email'}
          // subtitle={'(hỗ trợ các thắc mắc qua email)'}
          details={contactEmail}
          detailsStyle={styles.highlightText}
          onPress={this.onContactEmailPress}
        />
        <InfoRow
          title={'Zalo'}
          // subtitle={'(zalo fanpage)'}
          details={this.props.appInfo.zaloFanpageText}
          detailsStyle={styles.highlightText}
          onPress={this.onZaloPress}
        />
        <InfoRow
          title={'Facebook'}
          // subtitle={'(zalo fanpage)'}
          details={this.props.appInfo.facebookFanpageText}
          detailsStyle={styles.highlightText}
          onPress={this.onFacebookPress}
        />
        {/* <InfoRow
          title={'Câu hỏi thông dụng'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden
          onPress={this.onFAQPress}
        /> */}
        <InfoRow
          title={'Gửi phản hồi về MFast'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden
          onPress={this.onReportPress}
        />
      </View>
    );
  }
  renderAboutInfo() {
    return (
      <View style={styles.infoContainer}>
        <Text
          style={styles.infoText}
        >
          {Strings.app_info}
        </Text>
      </View>
    );
  }

  render() {

    const {
      needRenderManageAccount,
      needRenderAppayInfo,
      needRenderContactInfo,
    } = this.state;

    return (
      <View style={styles.container} testID="test_settings_screen">
        {
          this.renderNavigationBar()
        }
        <ScrollView
          style={{ backgroundColor: colors.separator }}
        >

          <SpaceRow />

          {/* // 5/4/08
          <HeaderRow
            title={'VỀ DIGIPAY'}
          />
          {this.renderDigiPayInfo()} */}

          <UserInfoRow
            onPress={this.onUserInfoPress}
          />

          <SpaceRow />
          <HeaderRow
            title={'Quản lí tài khoản'}
          />
          {needRenderManageAccount && this.renderManageAcocunt()}
          <SpaceRow />
          <HeaderRow
            title={'Hỗ trợ'}
          />
          {needRenderContactInfo && this.renderContactsInfo()}
          <SpaceRow />
          <HeaderRow
            title={'Giới thiệu chung'}
          />
          {needRenderAppayInfo && this.renderAppayInfo()}
          <SpaceRow />
          <SpaceRow />
        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------

SettingsScreen.navigationOptions = () => ({
  title: 'Thiết lập',
  header: null,
  headerBackTitle: Strings.navigation_back_title,
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
  tabBarIcon: ({ focused }) => {
    const icon = focused ?
      require('./img/settings1.png') :
      require('./img/settings.png');
    return (
      <Image
        source={icon}
        style={{ width: 24, height: 24 }}
        resizeMode={'contain'}
      />
    );
  },

  tabBarTestID: 'test_tabbar_settings',
});
// --------------------------------------------------
// react-redux
// --------------------------------------------------

SettingsScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,

  // totalUnReadAdminNotifications: state.totalUnReadAdminNotifications,
  // totalUnReadSystemNotifications: state.totalUnReadSystemNotifications,
  totalUnReadAdminNotifications: state.totalUnReadAdminNotificationsFb,
  totalUnReadSystemNotifications: state.totalUnReadSystemNotificationsFb,
});


const mapDispatchToProps = (dispatch) => ({
  logout: (isLogOutOfAllDevices) => dispatch(logout(isLogOutOfAllDevices)),
});

// export default SettingsScreen;
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

// --------------------------------------------------

const InboxButton = (props) => (
  <ImageButton
    style={styles.inboxButton}
    imageSource={require('./img/bell.png')}
    onPressIn={props.onPress}
  />
);

const MailButton = (props) => (
  <ImageButton
    style={styles.mailButton}
    imageSource={require('./img/envelope.png')}
    onPressIn={props.onPress}
  />
);


const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#E6EBFF',
  },
  digipayContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  digipayText: {
    color: '#707070',
    fontSize: 14,
  },
  appayContainer: {
    paddingBottom: 0,
    backgroundColor: colors.navigation_bg,
  },
  contactsContainer: {
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  highlightText: {
    color: '#0080DC',
    // 4/4/08
    // textDecorationLine: 'underline',
  },
  infoContainer: {
    justifyContent: 'center',
    paddingTop: 36,
    paddingBottom: 44,
    alignItems: 'center',
    backgroundColor: '#E6EBFF',
  },
  infoText: {
    color: '#707070',
    fontSize: 12,
    textAlign: 'center',
  },
  inboxButton: {
    width: 64,
    height: 64,
    paddingTop: 0,
    paddingBottom: 20,
    paddingLeft: 4,
    paddingRight: 24,
  },
  mailButton: {
    width: 64,
    height: 64,
    paddingTop: 0,
    paddingBottom: 20,
    // paddingLeft: 24,
    paddingRight: 14,
  },
});
