import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import Styles from '../../constants/styles';
import KJTextButton from '../../common/KJTextButton.js';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: OtpCodeConfirm.js';
/* eslint-enable */

const TOTAL_COUNT_DOWN_SECS = 60;

// --------------------------------------------------
// component
// --------------------------------------------------

class ResetPasswordControl extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      actionCode: props.actionCode,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      actionCode: nextProps.actionCode,
    });
  }
  // --------------------------------------------------
  onOtpCodeChangeText = (text) => {
    this.props.onActionCodeTextChange(text);
  }
  onOtpCodeSubmitEditing = () => {
    if (!this.newPasswordInput) { return; }
    this.newPasswordInput.focus();
  }
  onNewPasswordChangeText = (text) => {
    this.props.onNewPasswordTextChange(text);
  }
  onNewPasswordSubmitEditing = () => {
    if (!this.newPasswordConfirmInput) { return; }
    this.newPasswordConfirmInput.focus();
  }
  onNewPasswordConfirmChangeText = (text) => {
    this.props.onConfirmPasswordTextChange(text);
  }
  // --------------------------------------------------
  renderTitle() {
    const { userPhoneNumber } = this.props;
    return (
      <Text style={styles.titleText}>
        <Text style={{ color: '#7f7f7f', backgroundColor: '#0000' }}>
          {'MFAST sẽ gọi đến số'}
        </Text>
        <Text style={{ color: '#7f7f7f', fontWeight: '600', backgroundColor: '#0000' }}>
          {` ${userPhoneNumber} `}
        </Text>
        <Text style={{ color: '#7f7f7f', backgroundColor: '#0000' }}>
          {'và thông báo \n mã xác thực tài khoản trong vòng'}
        </Text>
        <Text style={{ color: '#202020', fontWeight: '600', backgroundColor: '#0000' }}>
          {` ${TOTAL_COUNT_DOWN_SECS} giây.`}
        </Text>
      </Text>
    );
  }
  render() {
    const props = this.props;
    const textInputHeight = Platform.OS === 'ios' ? 32 : 44;
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 90,
        }}
      >

        <View style={styles.inputContainer}>
          
          <TextInput
            ref={o => { this.otpCodeInput = o; }}
            style={[styles.textInput, { height: textInputHeight }]}
            keyboardType={'numeric'}
            underlineColorAndroid="#0000"
            value={this.state.actionCode}
            placeholder="Mã OTP"
            placeholderTextColor="#878787"
            onChangeText={this.onOtpCodeChangeText}
            onSubmitEditing={this.onOtpCodeSubmitEditing}
          />

          <View style={styles.separator} />

          <TextInput
            ref={o => { this.newPasswordInput = o; }}
            style={[styles.textInput, { height: textInputHeight }]}
            underlineColorAndroid="#0000"
            placeholder="Mật khẩu mới"
            placeholderTextColor="#878787"
            secureTextEntry
            onChangeText={this.onNewPasswordChangeText}
            onSubmitEditing={this.onNewPasswordSubmitEditing}
          />

          <View style={styles.separator} />

          <TextInput
            ref={o => { this.newPasswordConfirmInput = o; }}
            style={[styles.textInput, { height: textInputHeight }]}
            underlineColorAndroid="#0000"
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#878787"
            secureTextEntry
            onChangeText={this.onNewPasswordConfirmChangeText}
          />

        </View>

        {this.renderTitle()}

        <KJTextButton
          buttonStyle={[Styles.button, { marginTop: 20 }]}
          textStyle={[Styles.button_text, { marginLeft: 8, marginRight: 8 }]}
          text="Đổi mật khẩu"
          onPress={() => props.onResetPasswordPress()}
        />

        <TouchableHighlight
          style={[Styles.link_button, { marginTop: 12 }]}
          onPress={() => props.onBackToLoginPress()}
          underlayColor="#0000"
        >
          <Text style={Styles.link_button_text}>
            Đăng nhập
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[Styles.link_button, { marginTop: 4 }]}
          onPress={() => props.onResetPasswordRequestPress()}
          underlayColor="#0000"
        >
          <Text style={Styles.link_button_text}>
            Lấy mã OTP mới
          </Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default ResetPasswordControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
    borderColor: '#A0A0A0',
    borderRadius: 4,
    borderWidth: 0.25,
    elevation: 4,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  textInput: {
    fontSize: 14,
    height: 32,
    marginTop: 8,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
  },
  warningText: {
    backgroundColor: '#0000',
    color: '#EE0000',
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'center',
  },
  titleText: {
    marginTop: 20,
    marginBottom: 0,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: '#0000',
  },
});
