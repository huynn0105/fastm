import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

import { Configs } from '../../constants/configs';
import Styles from '../../constants/styles';
import KJTextButton from '../../common/KJTextButton';

// --------------------------------------------------
// LoginControl
// --------------------------------------------------

class LoginControl extends PureComponent {

  onUsernameTextChange = (text) => {
    this.props.onUsernameTextChange(text);
  }
  onUsernameTextSubmitEditing = () => {
    this.passwordInput.focus();
  }

  onPasswordTextChange = (text) => {
    this.props.onPasswordTextChange(text);
  }
  onPasswordTextSubmitEditing = () => {
    this.props.onLoginPress();
  }

  onLoginPress = () => {
    this.props.onLoginPress();
  }
  onRegisterPress = () => {
    this.props.onRegisterPress();
  }
  onForgotPasswordPress = () => {
    this.props.onForgotPasswordPress();
  }
  onHotlinePress = () => {
    this.props.onHotlinePress();
  }

  // --------------------------------------------------
  render() {
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
        {/* <Animation
          style={{ height: 56, width: 360 }}
          source={require('./img/appay1.json')}
          autoPlay
          loop
        />
        <Animation
          style={{ height: 56, width: 360 }}
          source={require('./img/appay2.json')}
          autoPlay
          loop
        />
        <Animation
          style={{ height: 56, width: 360 }}
          source={require('./img/appay3.json')}
          autoPlay
          loop
        /> */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={o => { this.usernameInput = o; }}
            style={[styles.textInput, { height: textInputHeight }]}
            keyboardType={'numeric'}
            underlineColorAndroid="#0000"
            onChangeText={this.onUsernameTextChange}
            onSubmitEditing={this.onUsernameTextSubmitEditing}
            placeholder="Số CMND"
            placeholderTextColor="#878787"
            testID="input_id"
          />

          <View style={styles.separator} />

          <TextInput
            ref={o => { this.passwordInput = o; }}
            style={[styles.textInput, { height: textInputHeight }]}
            underlineColorAndroid="#0000"
            onChangeText={this.onPasswordTextChange}
            onSubmitEditing={this.onPasswordTextSubmitEditing}
            placeholder="Mật khẩu"
            placeholderTextColor="#878787"
            secureTextEntry
            testID="input_pass"
          />
        </View>

        <KJTextButton
          buttonStyle={[Styles.button, { marginTop: 20 }]}
          textStyle={[Styles.button_text, { marginLeft: 24, marginRight: 24 }]}
          text={'Đăng nhập'}
          onPress={this.onLoginPress}
          testID="btn_login"
        />

        <TouchableHighlight
          style={[Styles.link_button, { marginTop: 12 }]}
          onPress={this.onForgotPasswordPress}
          underlayColor="#0000"
        >
          <Text style={Styles.link_button_text}>
            Quên mật khẩu?
          </Text>
        </TouchableHighlight>

        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#7F7F7F', backgroundColor: '#0000', fontSize: 14 }}>
            {'Nếu chưa có tài khoản hãy'}
          </Text>
          <TouchableOpacity
            style={[Styles.link_button, { marginLeft: 0, paddingLeft: 4 }]}
            onPress={this.onRegisterPress}
            underlayColor="#0000"
          >
            <Text style={[Styles.link_button_text, { fontWeight: '600' }]}>
              {'Đăng ký'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableHighlight
          style={[Styles.link_button, { marginTop: 12 }]}
          onPress={this.onHotlinePress}
          underlayColor="#0000"
        >
          <Text style={Styles.link_button_text}>
            {`Cần hỗ trợ? Gọi ${this.props.appInfo.contactPhoneNumberPretty}`}
          </Text>
        </TouchableHighlight>

      </View>
    );
  }
}

// --------------------------------------------------

LoginControl.defaultProps = {
  onUsernameTextChange: () => {},
  onPasswordTextChange: () => {},
  onLoginPress: () => {},
  onRegisterPress: () => {},
  onForgotPasswordPress: () => {},
};

LoginControl.propTypes = {
  onUsernameTextChange: PropTypes.func,
  onPasswordTextChange: PropTypes.func,
  onLoginPress: PropTypes.func,
  onRegisterPress: PropTypes.func,
  onForgotPasswordPress: PropTypes.func,
};

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
});

export default connect(mapStateToProps)(LoginControl);

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
    color: '#202020',
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
  },
});
