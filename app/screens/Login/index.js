import React, { Component } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import firebase from 'react-native-firebase';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Communications from 'react-native-communications';
import Spinner from 'react-native-loading-spinner-overlay';

import { TestConfigs, AppInfoDefault } from 'app/constants/configs';
import LoginBackground from 'app/common/LoginBackground';
import InputAccessory from 'app/common/InputAccessory';

import { AsyncStorageKeys, TrackingEvents } from 'app/constants/keys';

import {
  login,
  updateAppInfo,
  switchRootScreenToForgotPassword,
  switchRootScreenToRegister,
} from 'app/redux/actions';

import Strings from 'app/constants/strings';
import DigitelClient from 'app/network/DigitelClient';
import { showInfoAlert } from 'app/utils/UIUtils';
import NotificationManager from 'app/manager/NotificationManager';

import LoginControl from './LoginControl';

import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import { logEvent } from '../../tracking/Firebase';
const LOG_TAG = 'LoginScreen.js';
/* eslint-enable */

// how accuracy should get location be
const GET_LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 30000,
  maximumAge: 1000,
};

const _ = require('lodash');

// --------------------------------------------------
// LoginScreen
// --------------------------------------------------

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
    NotificationManager.resetFirebase();

    this.fetchAppInfo();
    firebase.notifications().setBadge(0); // eslint-disable-line
  }
  componentDidMount() {}
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidUpdate(prevProps) {
    this.handleLoginResponse(prevProps);
  }

  fetchAppInfo() {
    // eslint-disable-line
    DigitelClient.getAppInfo()
      .then((appInfo) => {
        // save
        const asyncTask = async () => {
          try {
            await AsyncStorage.setItem(AsyncStorageKeys.APP_INFO, JSON.stringify(appInfo));
          } catch (error) {
            Utils.log(`${LOG_TAG}: save appInfo error: `, error);
          }
        };
        asyncTask();
        this.updateAppInfo(appInfo);
      })
      .catch(() => {});
  }

  updateAppInfo(appInfo) {
    let appInfoValue = appInfo;
    if (appInfoValue === undefined || appInfoValue === null) {
      appInfoValue = AppInfoDefault;
    }
    this.props.updateAppInfo(appInfoValue);
  }

  // --------------------------------------------------
  onUsernameTextChange = (text) => {
    this.setState({ username: text });
  };
  onPasswordTextChange = (text) => {
    this.setState({ password: text });
  };
  onLoginPress = () => {
    const username = this.state.username.trim();
    const password = this.state.password.trim();
    // check inputs
    if (username.length === 0 || password.length === 0) {
      showInfoAlert(Strings.login_missing_fields);
      return;
    }
    // test
    if (TestConfigs.isTestLogin) {
      this.props.login(TestConfigs.testLoginUsername, TestConfigs.testLoginPassword);
      return;
    }
    // end
    this.props.login(username, password);
  };
  onRegisterPress = () => {
    this.props.switchRootScreenToRegister();
  };
  onForgotPasswordPress = () => {
    this.props.switchRootScreenToForgotPassword();
  };
  onHotlinePress = () => {
    Communications.phonecall(this.props.appInfo.contactPhoneNumber, true);
  };

  getLocation = () => {
    checkAndRequestPermissionLocation((location) => {
      if (location && location.latitude) {
        DigitelClient.trackEvent(TrackingEvents.USER_LOGIN, location.latitude, location.longitude);
        logEvent(TrackingEvents.USER_LOGIN, {
          // latitude: location?.latitude,
          // longitude: location?.longitude,
        });
      }
    });
  };

  // --------------------------------------------------
  handleLoginResponse(prevProps) {
    const loginStatus = this.props.loginResponse.status;
    if (loginStatus === false && loginStatus !== prevProps.loginResponse.status) {
      setTimeout(() => {
        // show alert
        const message = this.props.loginResponse.message
          ? this.props.loginResponse.message
          : Strings.unknown_error;
        showInfoAlert(message);
      }, 250);
    } else if (loginStatus === true && loginStatus !== prevProps.loginResponse.status) {
      // tracking
      setTimeout(() => {
        this.getLocation();
      }, 1000);
    }
  }
  // --------------------------------------------------
  render() {
    const { isLoginProcessing } = this.props;

    return (
      <View style={styles.container}>
        <LoginBackground />

        <View style={styles.loginContainer}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}
            overScrollMode={'always'}
            keyboardShouldPersistTaps={'handled'}
          >
            <View style={{ paddingTop: 80 }}>
              <LoginControl
                onUsernameTextChange={this.onUsernameTextChange}
                onPasswordTextChange={this.onPasswordTextChange}
                onLoginPress={this.onLoginPress}
                onRegisterPress={this.onRegisterPress}
                onForgotPasswordPress={this.onForgotPasswordPress}
                onHotlinePress={this.onHotlinePress}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        {Platform.OS !== 'ios' ? null : <InputAccessory />}

        <Spinner
          visible={isLoginProcessing}
          textContent=""
          textStyle={{ color: '#FFF' }}
          overlayColor="#00000080"
        />
      </View>
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

LoginScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isLoginProcessing: state.isLoginProcessing,
  loginResponse: state.loginResponse,
  pendingChangePasswordUser: state.pendingChangePasswordUser,
  appInfo: state.appInfo,
});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
  switchRootScreenToForgotPassword: () => dispatch(switchRootScreenToForgotPassword()),
  switchRootScreenToRegister: () => dispatch(switchRootScreenToRegister()),
  updateAppInfo: (info) => dispatch(updateAppInfo(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#0000',
    marginBottom: 60,
  },
});
