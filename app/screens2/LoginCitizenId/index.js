import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';

import LoginToolbar from '../../components2/LoginToolbar';
import CustomTextInput from '../../components2/CustomTextInput';
import LinkButton from '../../components2/LinkButton';
import CustomButton, { BUTTON_SIZE, BUTTON_COLOR } from '../../components2/CustomButton';

import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import { login } from '../../redux/actions';
import { SCREEN_MODE } from '../../screens2/PhoneInput';

import {ICON_PATH} from '../../assets/path';
class LoginCitizenIdScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledLoginButton: false,
      isLoginFailed: false,
      isShownErrorCitizenIdInput: false,
      errorMessageFromServer: '',
      loginFailedMessage: 'Vui lòng kiểm tra lại CMND hoặc mật khẩu'
    };
    this.citizenId = '';
    this.password = '';
  }

  componentWillReceiveProps(nextProps) {
    const currentLoginResponse = this.props.loginResponse;
    const nextLoginResponse = nextProps.loginResponse;
    if (currentLoginResponse.errorCode !== nextLoginResponse.errorCode) {
      this.setState({
        isLoginFailed: true,
        errorMessageFromServer: nextLoginResponse.message
      });
    }
  }

  _onToolbarBackBtnPress = () => {
    this.props.navigation.goBack();
  };

  _onChangeCitizenIdText = text => {
    this.citizenId = text;
    this._validateLoginForm(this.citizenId, this.password);
  };

  _onChangePasswordText = text => {
    this.password = text;
    this._validateLoginForm(this.citizenId, this.password);
  };

  _isValidIdAndPassword = (citizenID, password) => {
    return citizenID.length === 9 && password.length >= 6;
  };

  _isWrongCitizenIDLength = citizenID => {
    return citizenID.length > 9;
  };

  _toggleEnableLoginButton = isEnabled => {
    this.setState({ isEnabledLoginButton: isEnabled });
  };

  _toggleShowCitizenIDError = isError => {
    this.setState({ isShownErrorCitizenIdInput: isError });
  };

  _validateLoginForm = (citizenID, password) => {
    const isValid = this._isValidIdAndPassword(citizenID, password);
    this._toggleEnableLoginButton(isValid);

    const isWrong = this._isWrongCitizenIDLength(citizenID);
    this._toggleShowCitizenIDError(isWrong);
  };

  _onLoginBtnPress = () => {
    this.props.login(this.citizenId, this.password);
  };

  _onRegisterAccountPress = () => {
    this.props.navigation.navigate('PhoneInput', {
      screenMode: SCREEN_MODE.REGISTER_ACCOUNT
    });
  };

  _onForgetPasswordPress = () => {
    this.props.navigation.navigate('ForgetPassword');
  };

  // --------------------------------------------------
  // Render methods
  // --------------------------------------------------

  _renderToolbar = () => <LoginToolbar onToolbarBackPress={this._onToolbarBackBtnPress} />;

  _renderRegister = () => (
    <View style={styles.registerContainer}>
      <Text style={{ ...TextStyles.heading4, opacity: 0.6 }}>{'Chưa có tài khoản, bấm'}</Text>
      <LinkButton
        containerStyle={{ marginLeft: 6 }}
        textStyle={{ ...TextStyles.heading3, color: Colors.primary2 }}
        text={'Đăng ký'}
        onPress={this._onRegisterAccountPress}
      />
    </View>
  );

  _renderCitizenIdInput = isShownError => {
    const { isShownErrorCitizenIdInput } = this.state;
    const errorMessage = isShownErrorCitizenIdInput ? 'Độ dài CMND/CCCD không đúng' : null;
    return (
      <CustomTextInput
        containerStyle={{ ...styles.textInput, height: 50 }}
        inputStyle={{ textAlign: 'center' }}
        placeholder={'Nhập CMND/CCCD'}
        showIcon={false}
        autoFocus
        isShownError={isShownError || isShownErrorCitizenIdInput}
        errorMessage={errorMessage}
        keyboardType={'phone-pad'}
        onChangeText={this._onChangeCitizenIdText}
      />
    );
  };

  _renderPasswordInput = isShownError => (
    <CustomTextInput
      containerStyle={styles.textInput}
      inputStyle={{ textAlign: 'center' }}
      placeholder={'Nhập mật khẩu'}
      showIcon={false}
      keyboardType={'default'}
      secureTextEntry
      isShownError={isShownError}
      onChangeText={this._onChangePasswordText}
    />
  );

  _renderForgetPassword = () => (
    <LinkButton
      textStyle={{ color: Colors.primary2, textAlign: 'center' }}
      text={'Quên mật khẩu ?'}
      onPress={this._onForgetPasswordPress}
    />
  );

  _renderLoginFailedMessage = errorMessage => (
    <View
      style={{
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
      }}
    >
      <Image
        style={{ width: 20, height: 20 }}
        source={ICON_PATH.warning}
      />
      <Text
        style={{
          ...TextStyles.heading4,
          color: Colors.accent3,
          marginLeft: 4,
          textAlign: 'center'
        }}
      >
        {errorMessage}
      </Text>
    </View>
  );

  _renderLoginButton = () => (
    <CustomButton
      buttonStyle={{ width: 226 }}
      title={'Đăng nhập'}
      buttonColor={BUTTON_COLOR.BLUE}
      sizeType={BUTTON_SIZE.REGULAR}
      disabled={!this.state.isEnabledLoginButton}
      onPress={this._onLoginBtnPress}
    />
  );

  render() {
    const { isLoginFailed, loginFailedMessage } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'stretch' }}>
          {this._renderToolbar()}
          <View style={{ flex: 33 }} />
          <Text style={styles.loginTitle}>Đăng nhập bằng CMND/CCCD</Text>
          <View style={{ flex: 43 }} />
          {this._renderCitizenIdInput(isLoginFailed)}
          <View style={{ flex: 46 }} />
          {this._renderPasswordInput(isLoginFailed)}
          <View style={{ flex: 26 }} />
          {this._renderForgetPassword()}
          <View style={{ flex: 26 }} />
          {isLoginFailed ? this._renderLoginFailedMessage(loginFailedMessage) : null}
          {this._renderLoginButton()}
          <View style={{ flex: 26 }} />
          {this._renderRegister()}
          <View style={{ flex: 273 }} />
        </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))
});

const mapStateToProps = state => ({
  loginResponse: state.loginResponse
});

LoginCitizenIdScreen.navigationOptions = () => ({
  header: null,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginCitizenIdScreen);

const styles = StyleSheet.create({
  loginTitle: {
    textAlign: 'center'
  },
  textInput: {
    marginLeft: 16,
    marginRight: 16
  },
  registerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
