import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import LoginBackground from 'common/LoginBackground';
import InputAccessory from 'common/InputAccessory';
import MessageBox from 'common/MessageBox';

import {
  pendingChangePasswordUser,
  switchRootScreenToLogin,
  requestResetPassword,
  resetPassword,
  resetPasswordInfo,
} from '../../redux/actions';

import { TestConfigs } from '../../constants/configs';
import Strings, { formatString } from '../../constants/strings';
import RequestCodeControl from './RequestCodeControl';
import ResetPasswordControl from './ResetPasswordControl';

import { hidePhoneNumber } from '../../utils/UIUtils';

// --------------------------------------------------

/* eslint-disable */
import Utils, { isEmailValid } from '../../utils/Utils';
const LOG_TAG = '7777: ForgotPasswordScreen.js';
/* eslint-enable */

const MIN_PASSWORD_LENGTH = 6;

const _ = require('lodash');

// --------------------------------------------------
// ForgotPasswordScreen
// --------------------------------------------------

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);

    // step: 1 - input username, 2 - confirm otp
    this.state = {
      username: '',
      actionCode: '',
      newPassword: '',
      newPasswordConfirm: '',
      isMessageBoxVisible: false,
      messageBoxType: 'alert',
      alertTitle: '',
      alertMessage: '',
    };
  }
  componentDidMount() {
    this.props.setResetPasswordInfo({ step: 1 });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidUpdate(prevProps) {
    // test: auto keyin otp
    this.keyinActionCodeIfNeeded(prevProps);
    // show message box
    this.showMessageBoxIfNeeded(prevProps);
  }
  // --------------------------------------------------
  onUsernameTextChange(text) {
    // console.log(`${LogTAG} username: ${text}`);
    this.setState({ username: text });
  }
  onActionCodeTextChange(text) {
    // console.log(`${LogTAG} otp code: ${text}`);
    this.setState({ actionCode: text });
  }
  onNewPasswordTextChange(text) {
    // console.log(`${LogTAG} new password: ${text}`);
    this.setState({ newPassword: text });
  }
  onConfirmPasswordTextChange(text) {
    // console.log(`${LogTAG} new password confirm: ${text}`);
    this.setState({ newPasswordConfirm: text });
  }
  // --------------------------------------------------
  onResetPasswordRequestPress() {
    if (this.checkRequestResetPasswordInputs()) {
      const username = this.state.username.trim();
      setTimeout(() => {
        this.props.requestResetPassword(username);
      }, 250);
    }
  }
  onResetPasswordPress() {
    if (this.checkResetPasswordInputs()) {
      const userID = this.props.resetPasswordInfo.userID;
      const newPassword = this.state.newPassword.trim();
      const actionCode = this.state.actionCode.trim();
      setTimeout(() => {
        this.props.resetPassword(userID, newPassword, actionCode);
      }, 250);
    }
  }
  onBackToLoginPress() {
    this.props.switchRootScreenToLogin();
  }
  // --------------------------------------------------
  checkRequestResetPasswordInputs() {
    // check username
    const username = this.state.username.trim();
    if (username.length === 0) {
      this.alertMessage('Vui lòng nhập username');
      return false;
    }
    return true;
  }
  checkResetPasswordInputs() {
    // check otpCode
    const actionCode = this.state.actionCode.trim();
    if (actionCode.length === 0) {
      this.alertMessage('Vui lòng nhập mã OTP');
      return false;
    }
    // if (actionCode !== this.props.resetPasswordInfo.actionCode) {
    //   this.alertMessage('Mã OTP không hợp lệ');
    //   return false;
    // }
    // check newPassword & newPasswordConfirm
    const newPassword = this.state.newPassword.trim();
    if (newPassword.length === 0) {
      this.alertMessage('Vui lòng nhập mật khẩu mới');
      return false;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      this.alertMessage('Mật khẩu mới không hợp lệ, yêu cầu phải dài ít nhất 6 ký tự');
      return false;
    }
    const newPasswordConfirm = this.state.newPasswordConfirm.trim();
    if (newPassword !== newPasswordConfirm) {
      this.alertMessage('Mật khẩu xác nhận không trùng khớp');
      return false;
    }
    // return
    return true;
  }
  keyinActionCodeIfNeeded(prevProps) {
    if (!TestConfigs.isTestOTP) { return; }
    if (prevProps.isResetPasswordProcessing !== this.props.isResetPasswordProcessing) {
      setTimeout(() => {
        this.setState({
          actionCode: this.props.resetPasswordInfo.actionCode,
        });
      }, 250);
    }
  }
  showMessageBoxIfNeeded(prevProps) {
    // already show
    if (this.state.isModalVisible === true) {
      return;
    }
    // should show alert?
    const response = this.props.resetPasswordResponse;
    const prevResponse = prevProps.resetPasswordResponse;
    if (response.shouldAlert === prevResponse.shouldAlert || response.shouldAlert !== true) {
      return;
    }
    // show sucecss or error
    if (response.status === true) {
      if (response.step === 1) {
        // setTimeout(() => {
        //   this.showStep1SuccessMessageBox();
        // }, 250);
      } else if (response.step === 2) {
        setTimeout(() => {
          this.showStep2SuccessMessageBox();
        }, 250);
      }
    } else {
      const title = Strings.alert_title_error;
      const message = response.message !== undefined ? response.message : Strings.unknonw_error;
      setTimeout(() => {
        this.showAlertMessageBox(title, message);
      }, 250);
    }
  }
  alertMessage(message, onButtonPress) {
    Alert.alert(
      Strings.alert_title,
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            if (onButtonPress !== undefined) { onButtonPress(); }
          },
        },
      ],
      { cancelable: false },
    );
  }
  showAlertMessageBox(title, message) {
    this.setState({
      isMessageBoxVisible: true,
      messageBoxType: 'alert',
      alertTitle: title,
      alertMessage: message,
    });
  }
  showStep1SuccessMessageBox() {
    this.setState({
      isMessageBoxVisible: true,
      messageBoxType: 'step1',
    });
  }
  showStep2SuccessMessageBox() {
    this.setState({
      isMessageBoxVisible: true,
      messageBoxType: 'step2',
    });
  }
  closeMessageBox() {
    this.setState({
      isMessageBoxVisible: false,
    });
  }
  // --------------------------------------------------
  renderSpinner() {
    const { isResetPasswordProcessing } = this.props;
    return (
      <Spinner
        visible={isResetPasswordProcessing}
        textContent="Đang xử lý"
        textStyle={{ color: '#FFF' }}
        overlayColor="#00000080"
      />
    );
  }
  renderMessageBox() {
    let hiddenPhoneNumber = '';
    if (this.props.resetPasswordInfo && this.props.resetPasswordInfo.phoneNumber) {
      hiddenPhoneNumber = hidePhoneNumber(this.props.resetPasswordInfo.phoneNumber);
    }
    return (
      <Modal
        isVisible={this.state.isMessageBoxVisible}
        useNativeDriver
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {
            this.state.messageBoxType !== 'alert' ? null :
              <AlertMessageBox
                title={this.state.alertTitle}
                message={this.state.alertMessage}
                onCancelPress={() => this.closeMessageBox()}
              />
          }
          {
            this.state.messageBoxType !== 'step1' ? null :
              <RequestResetPasswordSuccessMessageBox
                title={formatString(
                  Strings.reset_passwd_step1_success,
                  { phone_number: hiddenPhoneNumber },
                )}
                message={Strings.reset_passwd_step1_details}
                onResendPress={() => {
                  this.closeMessageBox();
                  setTimeout(() => {
                    this.onResetPasswordRequestPress();
                  }, 500);
                }}
                onContinuePress={() => this.closeMessageBox()}
              />
          }
          {
            this.state.messageBoxType !== 'step2' ? null :
              <ResetPasswordSuccessMessageBox
                title={Strings.reset_passwd_step2_success}
                message={Strings.reset_passwd_step2_details}
                onContinuePress={() => {
                  this.closeMessageBox();
                  setTimeout(() => {
                    this.props.switchRootScreenToLogin();
                  }, 500);
                }}
              />
          }
          <View style={{ height: 44 }} />
        </View>
      </Modal>
    );
  }
  render() {

    const resetPasswordInfoResult = this.props.resetPasswordInfo;
    const step = resetPasswordInfoResult.step;
    let hiddenPhoneNumber = '';
    if (this.props.resetPasswordInfo && this.props.resetPasswordInfo.phoneNumber) {
      hiddenPhoneNumber = hidePhoneNumber(this.props.resetPasswordInfo.phoneNumber);
    }

    const {
      actionCode,
    }
      = this.state;
    return (
      <View style={{ flex: 1 }}>

        <LoginBackground />

        <View style={styles.container}>

          <KeyboardAwareScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}
            overScrollMode={'always'}
            keyboardShouldPersistTaps={'handled'}
          >
            {
              step === 1 ?
                <RequestCodeControl
                  onUsernameTextChange={(text) => this.onUsernameTextChange(text)}
                  onResetPasswordRequestPress={() => this.onResetPasswordRequestPress()}
                  onBackToLoginPress={() => this.onBackToLoginPress()}
                />
                :
                <ResetPasswordControl
                  actionCode={actionCode}
                  userPhoneNumber={hiddenPhoneNumber}
                  onActionCodeTextChange={(text) => this.onActionCodeTextChange(text)}
                  onNewPasswordTextChange={(text) => this.onNewPasswordTextChange(text)}
                  onConfirmPasswordTextChange={(text) => this.onConfirmPasswordTextChange(text)}
                  onResetPasswordRequestPress={() => this.onResetPasswordRequestPress()}
                  onResetPasswordPress={() => this.onResetPasswordPress()}
                  onBackToLoginPress={() => this.onBackToLoginPress()}
                />
            }

          </KeyboardAwareScrollView>

        </View>

        {Platform.OS !== 'ios' ? null : <InputAccessory />}

        {this.renderMessageBox()}

        {this.renderSpinner()}

      </View>
    );
  }
}

// --------------------------------------------------

const AlertMessageBox = (props) => (
  <MessageBox
    title={props.title}
    message={props.message}
    leftButtonTitle={''}
    rightButtonTitle={'Đóng'}
    onRightButtonPress={() => props.onCancelPress()}
  />
);

const RequestResetPasswordSuccessMessageBox = (props) => (
  <MessageBox
    title={props.title}
    message={props.message}
    leftButtonTitle={'Gửi lại'}
    leftButtonTitleStyle={{ color: '#8D8D8D' }}
    onLeftButtonPress={() => props.onResendPress()}
    rightButtonTitle={'Tiếp tục'}
    rightButtonTitleStyle={{ color: '#2A98E0' }}
    onRightButtonPress={() => props.onContinuePress()}
  />
);

const ResetPasswordSuccessMessageBox = (props) => (
  <MessageBox
    title={props.title}
    message={props.message}
    leftButtonTitle={''}
    rightButtonTitle={'Tiếp tục'}
    rightButtonTitleStyle={{ color: '#2A98E0' }}
    onRightButtonPress={() => props.onContinuePress()}
  />
);

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ForgotPasswordScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  pendingChangePasswordUser: state.pendingChangePasswordUser,
  isResetPasswordProcessing: state.isResetPasswordProcessing,
  resetPasswordResponse: state.resetPasswordResponse,
  resetPasswordInfo: state.resetPasswordInfo,
});

const mapDispatchToProps = (dispatch) => ({
  setPendingChangePasswordUser: (user) => dispatch(pendingChangePasswordUser(user)),
  switchRootScreenToLogin: () => dispatch(switchRootScreenToLogin()),
  requestResetPassword: (username) => dispatch(requestResetPassword(username)),
  resetPassword: (userID, newPassword, actionCode) =>
    dispatch(resetPassword(userID, newPassword, actionCode)),
  setResetPasswordInfo: (info) => dispatch(resetPasswordInfo(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginBottom: 60,
  },
});
