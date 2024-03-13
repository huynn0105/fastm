import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { connect } from 'react-redux';

import AppStrings from '../../constants/strings';
import AppStyles from '../../constants/styles';
import colors from '../../theme/Color';

import HeaderRow from './HeaderRow';
import InfoRow from './InfoRow';
import SpaceRow from './SpaceRow';
import AppText from '../../componentV3/AppText';
import { getAppVersionAndBuild } from 'app/utils/Utils';
class AboutAppayScreen extends Component {
  componentDidMount() {}

  onAppayIntroPress = () => {
    const title = 'Giới thiệu về MFast';
    const url = this.props.appInfo.introduceUrlMFast;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  onTermPress = () => {
    const title = 'Điều khoản sử dụng';
    const url = this.props.appInfo.termsOfUsageUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  onPrivacyPress = () => {
    const title = 'Cam kết bảo mật';
    const url = this.props.appInfo.privacyPolicyUrl;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  renderDigiPayInfo = () => {
    return (
      <View style={styles.digipayContainer}>
        <AppText style={styles.digipayText}>{AppStrings.digipay_info_1}</AppText>
        <AppText style={{ height: 12, backgroundColor: '#0000' }} />
        <AppText style={styles.digipayText}>{AppStrings.digipay_info_2}</AppText>
      </View>
    );
  };

  renderAppayInfo = () => {
    const appVersion = getAppVersionAndBuild();
    return (
      <View style={styles.appayContainer}>
        <InfoRow
          title={'Giới thiệu về MFast'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden={false}
          onPress={this.onAppayIntroPress}
        />
        <InfoRow title={'Phiên bản hiện tại'} details={appVersion} />
        <InfoRow
          title={'Điều khoản sử dụng'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden={false}
          onPress={this.onTermPress}
        />
        <InfoRow
          title={'Cam kết bảo mật'}
          details={''}
          isArrowHidden={false}
          isSeperatorHidden
          onPress={this.onPrivacyPress}
        />
      </View>
    );
  };

  renderAboutInfo = () => {
    return (
      <View style={styles.infoContainer}>
        <AppText style={styles.infoText}>{AppStrings.app_info}</AppText>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView scrollIndicatorInsets={{ right: 0.5 }}>
          <SpaceRow />
          <HeaderRow title={'Về DigiPay JSC'} />
          {this.renderDigiPayInfo()}

          <SpaceRow />
          <HeaderRow title={'Về MFast'} />
          {this.renderAppayInfo()}

          <SpaceRow />
          {this.renderAboutInfo()}
        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
});

export default connect(mapStateToProps, null)(AboutAppayScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.neutral5,
  },
  digipayContainer: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  digipayText: {
    opacity: 0.8,
    color: colors.primary4,
    fontSize: 14,
    lineHeight: 20,
  },
  infoContainer: {
    justifyContent: 'center',
    paddingTop: 36,
    paddingBottom: 44,
    alignItems: 'center',
    backgroundColor: colors.neutral5,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.primary4,
  },
});
