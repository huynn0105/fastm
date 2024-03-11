import React, { Component } from 'react';
import { LayoutAnimation, UIManager, Platform } from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MainScreen from 'app/screens/Root/MainScreen';
import LoadingScreen from 'app/screens/Root/LoadingScreen';
import LoginScreen from 'app/screens/Login';
import RegisterScreen from 'app/screens/Register';
import ForgotPasswordScreen from 'app/screens/ForgotPassword';
import MaintainingView from '../../screens/Others/MaintainingView';

import {
  checkSystemStatus,
} from '../../redux/actions';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'RootScreen.js';
/* eslint-enable */

// --------------------------------------------------
// RootScreen
// --------------------------------------------------

class RootScreen extends Component {
  componentDidMount() {
    
  }
  // componentWillUpdate() {
  //   if (UIManager.setLayoutAnimationEnabledExperimental) {
  //     UIManager.setLayoutAnimationEnabledExperimental(true);
  //   }
  //   LayoutAnimation.linear();
  // }
  // --------------------------------------------------
  render() {
    if (!this.props.systemStatus.available) {
      return <MaintainingView url={this.props.systemStatus.freeze_page} />;
    }

    if (this.props.rootScreen === 'LOGIN') {
      return (
        <LoginScreen />
      );
    }
    if (this.props.rootScreen === 'REGISTER') {
      return (
        <RegisterScreen />
      );
    }
    if (this.props.rootScreen === 'FORGOT_PASSWORD') {
      return (
        <ForgotPasswordScreen />
      );
    }
    if (this.props.rootScreen === 'MAIN') {
      return (
        <MainScreen />
      );
    }
    return (
      // <View />
      // <LoadingScreen />
      null
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

RootScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rootScreen: state.rootScreen,
  systemStatus: state.systemStatus,
});

const mapDispatchToProps = (dispatch) => ({
  checkSystemStatus: () => dispatch(checkSystemStatus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
