/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import LottieView from 'lottie-react-native';

import colors from 'app/constants/colors';
import Styles from 'app/constants/styles';
import KJButtonPressIn from 'app/components/common/KJButtonPressIn';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils, { isPhoneX, updateTimeAgoString } from 'app/utils/Utils';
import Colors from '../../theme/Color';
const LOG_TAG = 'CreateGroupChat/NavigationBar.js';
/* eslint-enable */

const IS_PHONE_X = isPhoneX();
const ANDROID_OFFSET = Platform.OS === 'android' ? -20 : 0;
const NAVIGATION_BAR_OFFSET = ANDROID_OFFSET;
const TITLE_MARGIN_TOP = Platform.OS === 'ios' ? 0 : -2;
const STATUS_MARGIN_TOP = Platform.OS === 'ios' ? 2 : 0;

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // --------------------------------------------------
  onBackPress = () => {
    this.props.onBackPress();
  };
  onTitlePress = () => {
    this.props.onTitlePress();
  };

  onNavToNotificationSetting = () => {
    this.props.onNavToNotificationSetting();
  };

  // --------------------------------------------------
  renderSingleThreadStatus() {
    const connected = this.props.internetState;
    return (
      <View style={styles.statusContainer}>
        <View style={[styles.status, { backgroundColor: connected ? '#69E387' : '#7c7c7c' }]} />
        <AppText style={styles.statusText}>
          {connected ? 'Đang hoạt động' : 'Không có kết nối'}
        </AppText>
      </View>
    );
  }
  renderBackButton() {
    return (
      <KJButtonPressIn
        testID="header-back"
        containerStyle={styles.backButton}
        leftIconSource={require('./img/back.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPressIn={this.onBackPress}
      />
    );
  }
  renderTitle() {
    return (
      <Animatable.View
        style={styles.titleContainer}
        animation="fadeIn"
        duration={1500}
        useNativeDriver
      >
        <TouchableOpacity
          style={[Styles.button_overlay, { flexDirection: 'row', alignItems: 'center' }]}
          onPressIn={this.onTitlePress}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <AppText style={styles.titleText}>{this.props.thread.titleString()}</AppText>
              <Animatable.View
                style={{ marginLeft: 8, marginTop: 1, height: 16 }}
                animation={this.props.loading ? 'zoomIn' : 'zoomOut'}
                duration={200}
                useNativeDriver
              >
                <LottieView
                  style={{ flex: 1, width: 16, height: 16 }}
                  source={require('./img/loading.json')}
                  autoPlay
                  loop
                />
              </Animatable.View>
            </View>
            {this.renderSingleThreadStatus()}
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  renderButtons = () => {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={this.onTitlePress}>
          <Image style={styles.setting} source={require('./img/setting.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  renderButtonSetting = () => {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={this.onNavToNotificationSetting}>
          <Image style={styles.setting} source={require('./img/icon_setting.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {this.renderBackButton()}
          {this.renderTitle()}
          {this.renderButtons()}
          {this.renderButtonSetting()}
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  thread: PropTypes.instanceOf(Object),
  onBackPress: PropTypes.func,
  onTitlePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  thread: {},
  onBackPress: () => {},
  onTitlePress: () => {},
};

const mapStateToProps = (state) => ({
  internetState: state.internetState,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    paddingBottom: 0,
    height: 48,
    backgroundColor: Colors.neutral5,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.neutral5,
  },
  backButton: {
    marginTop: 0,
    width: 52,
    height: 44,
    backgroundColor: '#f000',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: TITLE_MARGIN_TOP,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#0000',
  },
  titleText: {
    flex: 0,
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#202020',
    fontSize: 15,
    fontWeight: '400',
  },
  statusContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: STATUS_MARGIN_TOP,
  },
  statusText: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  status: {
    flex: 0,
    marginTop: 2,
    marginRight: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#E6EBFF',
  },
  typeText: {
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 0,
    marginRight: 0,
  },
  call: {
    width: 22,
    height: 44,
    resizeMode: 'contain',
    marginRight: 8,
    marginLeft: 16,
  },
  setting: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 16,
    marginLeft: 8,
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: TITLE_MARGIN_TOP,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#0000',
    opacity: 0.8,
  },
});
