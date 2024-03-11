import React, { Component } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import LoginToolbar from '../../components2/LoginToolbar/index';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import CustomTextInput from '../../components2/CustomTextInput/index';
import CustomButton, { BUTTON_SIZE, BUTTON_COLOR } from '../../components2/CustomButton/index';
import LinkButton from '../../components2/LinkButton/index';
import AppText from '../../componentV3/AppText';
class ForgetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledNextButton: false,
      isShownCitizenIdInputError: false
    };
    this.citizenID = '';
  }

  onToolbarBackBtnPress = () => {
    this.props.navigation.goBack();
  };

  onChangeCitizenIdText = text => {
    this.citizenID = text;
    this.validateCitizenIdInput(this.citizenID);
  };

  onLoginLinkButtonPress = () => {};

  onNextButtonPress = () => {
    this.props.navigation.navigate('OtpConfirm', { citizenId: this.citizenID });
  };

  isValidCitizenId = citizenId => {
    return citizenId.length === 9;
  };

  isWrongLength = citizenId => {
    return citizenId.length > 9;
  };

  validateCitizenIdInput = citizenId => {
    const isValid = this.isValidCitizenId(citizenId);
    this.setState({ isEnabledNextButton: isValid });
    const isWrongLength = this.isWrongLength(citizenId);
    this.setState({ isShownCitizenIdInputError: isWrongLength });
  };

  // --------------------------------------------------
  // RENDER METHODS
  // --------------------------------------------------

  renderToolbar = () => <LoginToolbar onToolbarBackPress={this.onToolbarBackBtnPress} />;

  renderHeaderTitle = () => (
    <AppText
      style={{
        ...TextStyles.heading3,
        textAlign: 'center',
        opacity: 0.6,
        paddingLeft: 44,
        paddingRight: 44
      }}
    >
      {'Vui lòng nhập CMND/ CCCD đăng kí tài khoản để lấy lại mật khẩu'}
    </AppText>
  );

  renderCitizenIdInput = () => {
    const { isShownCitizenIdInputError } = this.state;
    return (
      <CustomTextInput
        containerStyle={{ marginLeft: 16, marginRight: 16, height: 50 }}
        placeholder={'Nhập số CMND/CCCD'}
        autoFocus
        showIcon={false}
        isShownError={isShownCitizenIdInputError}
        errorMessage={'Độ dài CMND/CCCD không đúng'}
        onChangeText={this.onChangeCitizenIdText}
      />
    );
  };

  renderNextButton = () => {
    const { isEnabledNextButton } = this.state;
    return (
      <CustomButton
        containerStyle={{ height: 54 }}
        buttonStyle={{ width: 246 }}
        title={'Lấy mã xác nhận'}
        buttonColor={BUTTON_COLOR.BLUE}
        sizeType={BUTTON_SIZE.LARGE}
        disabled={!isEnabledNextButton}
        onPress={this.onNextButtonPress}
      />
    );
  };

  renderLoginLinkButton = () => (
    <LinkButton
      textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
      text={'Đăng nhập'}
      onPress={this.onLoginLinkButtonPress}
    />
  );

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {this.renderToolbar()}
        <View style={{ flex: 28 }} />
        {this.renderHeaderTitle()}
        <View style={{ flex: 63 }} />
        {this.renderCitizenIdInput()}
        <View style={{ flex: 94 }} />
        {this.renderNextButton()}
        <View style={{ flex: 26 }} />
        {this.renderLoginLinkButton()}
        <View style={{ flex: 358 }} />
      </SafeAreaView>
    );
  }
}

export default ForgetPasswordScreen;
