import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';

import { connect } from 'react-redux';


import AppStrings from 'app/constants/strings';
import AppStyles from 'app/constants/styles';
import colors from 'app/constants/colors';

import HeaderRow from './HeaderRow';
import InfoRow from './InfoRow';
import SpaceRow from './SpaceRow';
import AppText from '../../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils, { getAppVersionAndBuild } from 'app/utils/Utils';
const LOG_TAG = 'AboutAppayScreen.js';
/* eslint-enable */

// --------------------------------------------------
// AboutAppayScreen
// --------------------------------------------------

class AboutAppayScreen extends Component {

  componentDidMount() {
  }

  onAppayIntroPress = () => {
    const title = 'MFAST';
    const url = this.props.appInfo.introduceUrlMFast;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  }

  renderDigiPayInfo = () => {
    return (
      <View style={styles.digipayContainer}>
        <AppText style={styles.digipayText}>
          {AppStrings.digipay_info_1}
        </AppText>
        <View style={{ height: 12, backgroundColor: '#0000' }} />
        <AppText style={styles.digipayText}>
          {AppStrings.digipay_info_2}
        </AppText>
      </View>
    );
  }

  renderAppayInfo = () => {
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
          isSeperatorHidden
          onPress={this.onAppayIntroPress}
        />
      </View>
    );
  }

  renderAboutInfo = () => {
    return (
      <View style={styles.infoContainer}>
        <AppText
          style={styles.infoText}
        >
          {AppStrings.app_info}
        </AppText>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          
          <SpaceRow />
          <HeaderRow
            title={'DIGIPAY'}
          />
          {this.renderDigiPayInfo()}

          <SpaceRow />
          <HeaderRow
            title={'MFAST'}
          />
          {this.renderAppayInfo()}

          <SpaceRow />
          {this.renderAboutInfo()}

        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------

AboutAppayScreen.navigationOptions = () => ({
  title: 'Về MFAST',
  headerBackTitle: AppStrings.navigation_back_title,
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
});

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
    backgroundColor: colors.navigation_bg,
  },
  digipayContainer: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.navigation_bg,
  },
  digipayText: {
    color: '#707070',
    fontSize: 14,
  },
  infoContainer: {
    justifyContent: 'center',
    paddingTop: 36,
    paddingBottom: 44,
    alignItems: 'center',
    backgroundColor: colors.navigation_bg,
  },
  infoText: {
    color: '#707070',
    fontSize: 12,
    textAlign: 'center',
  },
});
