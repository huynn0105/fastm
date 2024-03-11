import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import AppStyles from '../../constants/styles';
import KJTextButton from '../../common/KJTextButton.js';

// --------------------------------------------------
// component
// --------------------------------------------------

const LogTAG = '7777: RequestCodeControl.js'; // eslint-disable-line

class RequestCodeControl extends PureComponent {
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
        }}
      >

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { height: textInputHeight }]}
            keyboardType={'numeric'}
            underlineColorAndroid="#0000"
            onChangeText={
              (text) => props.onUsernameTextChange(text)
            }
            placeholder="Số CMND"
            placeholderTextColor="#878787"
          />
        </View>

        <KJTextButton
          buttonStyle={[AppStyles.button, { marginTop: 28 }]}
          textStyle={[AppStyles.button_text, { marginLeft: 8, marginRight: 8 }]}
          text="Lấy mã OTP"
          onPress={() => props.onResetPasswordRequestPress()}
        />

        <Text style={[styles.hintText, { marginTop: 24 }]}>
          Sử dụng mã OTP để thay đổi mật khẩu
        </Text>

        <TouchableHighlight
          style={[AppStyles.link_button, { marginTop: 12 }]}
          onPress={() => props.onBackToLoginPress()}
          underlayColor="#0000"
        >
          <Text style={AppStyles.link_button_text}>
            Đăng nhập
          </Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default RequestCodeControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  hintText: {
    backgroundColor: '#0000',
    color: '#707070',
    fontSize: 14,
  },
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
    color: '#202020',
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
  },
});
