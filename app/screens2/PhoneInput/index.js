import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Colors from '../../theme/Color';
import CustomTextInput from '../../components2/CustomTextInput/index';
import TextStyles from '../../theme/TextStyle';
import CustomButton, { BUTTON_SIZE } from '../../components2/CustomButton';
import LinkButton from '../../components2/LinkButton';
import ImageButton from '../../common/buttons/ImageButton';
import LoginToolbar from '../../components2/LoginToolbar';
import { PopupExistingUser } from '../../components2/ExistingPhonePopup';
import { updatePhone, fetchMyUser } from '../../redux/actions/user';
import { ERROR_CODE } from '../../network/ErrorCode';
import { Loading } from '../../components2/LoadingComponent';
import { showInfoAlert } from '../../utils/UIUtils';

export const SCREEN_MODE = {
  UPDATE_PHONE_NUMBER: 'UPDATE_PHONE_NUMBER',
  REGISTER_ACCOUNT: 'REGISTER_ACCOUNT'
};

function ScreenMode(screenMode, title, buttonTitle, footerMessage) {
  this.type = screenMode;
  this.title = title;
  this.buttonTitle = buttonTitle;
  this.footerMessage = footerMessage;
}

class PhoneInputScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoToNextStep: false,
      isShownPhoneInputError: false,
      isLoading: false,
      users: []
    };
    const { navigation } = this.props;
    const screenMode = navigation.getParam('screenMode');
    this.screenMode = this.SCREEN_MODE[screenMode];
    this.phoneNumber = '';
    this.otp = '';
  }

  SCREEN_MODE = {
    UPDATE_PHONE_NUMBER: new ScreenMode(
      SCREEN_MODE.UPDATE_PHONE_NUMBER,
      'Tài khoản của bạn chưa được cập nhật SĐT. SĐT được dùng để bảo mật tài khoản, xác nhận giao dịch, rút tiền…',
      'Cập nhật số điện thoại',
      'Bổ xung sau'
    ),
    REGISTER_ACCOUNT: new ScreenMode(
      SCREEN_MODE.REGISTER_ACCOUNT,
      'Tự do làm việc cùng MFast',
      'Tiếp tục',
      '1 mã xác thực sẽ được gửi về SĐT trên sau khi bạn ấn tiếp tục'
    )
  };

  _onCloseButtonPress = () => {
    this.props.navigation.goBack();
  };

  isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberLength = phoneNumber.length;
    return phoneNumberLength > 8 && phoneNumberLength < 12;
  };

  validatePhoneInput = (phoneNumber) => {
    const isValidPhoneNumber = this.isValidPhoneNumber(phoneNumber);
    this.setState({
      canGoToNextStep: isValidPhoneNumber,
      isShownPhoneInputError: !isValidPhoneNumber && phoneNumber.length >= 12
    });
  };

  _onPhoneInputChangeText = (text) => {
    this.phoneNumber = text;
    this.validatePhoneInput(this.phoneNumber);
  };

  _onButtonPress = () => {
    const phoneNumber = this.phoneNumber;
    switch (this.screenMode.type) {
      case SCREEN_MODE.REGISTER_ACCOUNT:
        this.props.navigation.navigate('OtpConfirm');
        break;
      case SCREEN_MODE.UPDATE_PHONE_NUMBER:
        this.updatePhone(phoneNumber, false, this.otp);
        break;
      default:
        break;
    }
  };

  _onUpdateLaterPress = () => {
    // TODO: Implement close this screen
  };

  _onToolbarBackBtnPress = () => {
    this.props.navigation.goBack();
  };

  /*  PRIVATE
   */

  updatePhone = async (phone, force = false, otp) => {
    const startRequest = () => {
      this.setState({ isLoading: true });
    };
    const endRequest = () => {
      this.setState({ isLoading: false });
    };
    try {
      const result = await updatePhone(phone, force, otp, startRequest, endRequest);
      if (!result) throw Error();
      this.updatePhoneSuccess();
    } catch (error) {
      const { errorCode, requestDataWithOTP, data } = error;
      if (errorCode === ERROR_CODE.DUP_PHONE) {
        this.showConfirmUpdatePhone(requestDataWithOTP.axiosOTPData.data.otp_code, data.list);
      }
    } finally {
      endRequest();
    }
  };

  forceUppdatePhone = () => {
    this.updatePhone(this.phoneNumber, true, this.otp);
  };

  changePhone = () => {
    this.otp = '';
    this.setState({ users: [] });
  };

  updatePhoneSuccess = () => {
    this.props.fetchMyUser();
    this._onCloseButtonPress();
    setTimeout(() => {
      showInfoAlert('Cập nhật số điện thoại thành công');
    }, 500);
  };

  showConfirmUpdatePhone = (otp, users) => {
    this.setState({ users });
    this.dupPhonePopupRef.show();
    this.otp = otp;
  };

  // ------------------------------------------------
  // RENDER METHODS
  // ------------------------------------------------

  _renderTitle = () => {
    const { title } = this.screenMode;
    return (
      <Text
        style={{
          ...TextStyles.heading4,
          opacity: 0.6,
          marginLeft: 40,
          marginRight: 40,
          textAlign: 'center'
        }}
      >
        {title}
      </Text>
    );
  };

  _renderUpdatePhoneToolbar = () => (
    <View style={{ padding: 12 }}>
      <Text style={{ ...TextStyles.heading3, textAlign: 'center' }}>
        {'Cập nhật số điện thoại'}
      </Text>
      <ImageButton
        style={{ width: 24, height: 24, position: 'absolute', right: 16, top: 12 }}
        imageSource={require('../../screens2/Login/img/icon_close.png')}
        onPress={this._onCloseButtonPress}
      />
    </View>
  );

  _renderRegisterToolbar = () => <LoginToolbar onToolbarBackPress={this._onToolbarBackBtnPress} />;

  _renderToolbar = () => {
    switch (this.screenMode.type) {
      case SCREEN_MODE.UPDATE_PHONE_NUMBER:
        return this._renderUpdatePhoneToolbar();
      case SCREEN_MODE.REGISTER_ACCOUNT:
        return this._renderRegisterToolbar();
      default:
        return null;
    }
  };

  _renderPhoneInput = () => {
    const { isShownPhoneInputError } = this.state;
    return (
      <CustomTextInput
        textInputRef={this._referencePhoneTextInput}
        containerStyle={{ marginLeft: 16, marginRight: 16 }}
        placeholder={'Nhập số điện thoại'}
        keyboardType={'phone-pad'}
        isShownLeftIcon
        autoFocus
        isShownError={isShownPhoneInputError}
        errorMessage={'Độ dài số điện thoại khồng đúng'}
        onChangeText={this._onPhoneInputChangeText}
      />
    );
  };

  _renderButton = () => {
    const { buttonTitle } = this.screenMode;
    return (
      <CustomButton
        buttonStyle={{ width: 226 }}
        title={buttonTitle}
        sizeType={BUTTON_SIZE.REGULAR}
        disabled={!this.state.canGoToNextStep}
        onPress={this._onButtonPress}
      />
    );
  };

  _renderUpdateLaterMessage = () => (
    <LinkButton
      containerStyle={{ alignSelf: 'center' }}
      textStyle={{ color: Colors.primary2 }}
      text={'Bổ sung sau'}
      onPress={this._onUpdateLaterPress}
    />
  );

  _renderOTPMessage = () => {
    const { footerMessage } = this.screenMode;
    return (
      <Text
        style={{
          ...TextStyles.heading4,
          opacity: 0.6,
          textAlign: 'center',
          paddingLeft: 77,
          paddingRight: 77
        }}
      >
        {footerMessage}
      </Text>
    );
  };

  _renderFooterMessage = () => {
    switch (this.screenMode.type) {
      case SCREEN_MODE.REGISTER_ACCOUNT:
        return this._renderOTPMessage();
      case SCREEN_MODE.UPDATE_PHONE_NUMBER:
        return this._renderUpdateLaterMessage();
      default:
        return null;
    }
  };

  renderPopupExistingUser = (users, phone) => {
    return PopupExistingUser({
      users,
      phone,
      handleRef: (ref) => {
        this.dupPhonePopupRef = ref;
      },
      yesCallback: this.forceUppdatePhone,
      noCallback: this.changePhone
    });
  };

  render() {
    const { users, isLoading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        <View style={{ flex: 1 }}>
          {this._renderToolbar()}
          <View style={{ flex: 46 }} />
          {this._renderTitle()}
          <View style={{ flex: 54 }} />
          {this._renderPhoneInput()}
          <View style={{ flex: 77 }} />
          {this._renderButton()}
          <View style={{ flex: 25 }} />
          {this._renderFooterMessage()}
          <View style={{ flex: 303 }} />
        </View>
        {this.renderPopupExistingUser(users, this.phoneNumber)}
        <Loading visible={isLoading} />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  fetchMyUser
};

PhoneInputScreen.navigationOptions = () => ({
  header: null,
});

export default connect(
  null,
  mapDispatchToProps
)(PhoneInputScreen);
