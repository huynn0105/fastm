import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Communications from 'react-native-communications';

import AppStrings from '../../constants/strings';
import AppStyles from '../../constants/styles';

import HeaderRow from './HeaderRow';
import InfoRow from './InfoRow';

/* eslint-disable */
import Utils, { getAppVersionAndBuild } from '../../utils/Utils';
const LOG_TAG = '7777: IntroScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// IntroScreen
// --------------------------------------------------

class IntroScreen extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onAppayIntroPress = () => {
    // Utils.log(`${LOG_TAG} onTermsOfUsagePress`);
    const title = 'MFAST';
    const url = this.props.appInfo.introduceUrlMFast;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
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
  // --------------------------------------------------
  renderDigiPayInfo() {
    return (
      <View style={styles.digipayContainer}>
        <Text style={styles.digipayText}>
          {AppStrings.digipay_info_1}
        </Text>
        <View style={{ height: 12, backgroundColor: '#0000' }} />
        <Text style={styles.digipayText}>
          {AppStrings.digipay_info_2}
        </Text>
      </View>
    );
  }
  renderAppayInfo() {
    const appVersion = getAppVersionAndBuild();
    return (
      <View style={styles.appayContainer}>
        <InfoRow
          title={'Phiên bản hiện tại'}
          details={appVersion}
        />
        <InfoRow
          title={'Giới thiệu về MFAST'}
          details={''}
          isArrowHidden={false}
          onPress={this.onAppayIntroPress}
        />
        <InfoRow
          title={'Điều khoản sử dụng'}
          details={''}
          isArrowHidden={false}
          onPress={this.onTermsOfUsagePress}
        />
        <InfoRow
          title={'Chính sách bảo mật'}
          details={''}
          isArrowHidden={false}
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
          details={'MFAST fanpage'}
          detailsStyle={styles.highlightText}
          isSeperatorHidden
          onPress={this.onZaloPress}
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
          {AppStrings.app_info}
        </Text>
      </View>
    );
  }
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>

          <HeaderRow
            title={'VỀ DIGIPAY'}
          />
          {this.renderDigiPayInfo()}

          <HeaderRow
            title={'VỀ MFAST'}
          />
          {this.renderAppayInfo()}

          <HeaderRow
            title={'TRUNG TÂM HỖ TRỢ'}
          />
          {this.renderContactsInfo()}

          {this.renderAboutInfo()}

        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------

IntroScreen.navigationOptions = () => ({
  title: 'Giới thiệu chung',
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

IntroScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
});

// export default IntroScreen;
export default connect(mapStateToProps, null)(IntroScreen);

// --------------------------------------------------

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
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  contactsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  highlightText: {
    color: '#0080DC',
    textDecorationLine: 'underline',
  },
  infoContainer: {
    justifyContent: 'center',
    paddingTop: 36,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: '#E6EBFF',
  },
  infoText: {
    color: '#707070',
    fontSize: 12,
    textAlign: 'center',
  },
});
