import { connect } from 'react-redux';
import { Text, View, SafeAreaView, StyleSheet, Image } from 'react-native';
import React, { Component } from 'react';

import { Loading } from '../../components2/LoadingComponent';
import { requestOTP, OTP_RESULT_TYPE, sendRequestWithOTP } from '../../redux/actions/otp';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import Colors from '../../theme/Color';
import CustomOtpInput from '../../components2/CustomOtpInput/index';
import LinkButton from '../../components2/LinkButton';
import LoginToolbar from '../../components2/LoginToolbar';
import TextStyles from '../../theme/TextStyle';
import CodeInput from '../../components2/CodeInput';
import AppText from '../../componentV3/AppText';
import { formatPhoneNumber } from '../../utils/phoneHelper';
import HeaderBar from '../../screenV3/login/components/HeaderBar';
import OTPRetry from '../../componentV3/OTP/OTPRetry/OTPRetry';

const OTP_INPUT_LENGTH = 4;
const COUNT_DOWN_SECONDS = 60;
const OPTIONS_RETRY = ['voice', 'sms', 'email'];
const OPTIONS_RETRY_WITHOUT_EMAIL = ['voice', 'sms'];

class OtpConfirmScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoNextStep: false,
      countDownSecs: COUNT_DOWN_SECONDS,
      disabledResend: false,
      disabledChangePhone: false,
      textWrongOTP: '',
      optionsRetry: this.props.navigation.state.params?.allowRetryEmail
        ? OPTIONS_RETRY
        : OPTIONS_RETRY_WITHOUT_EMAIL,
    };
    this.otpText = '';
    this.parseParams();
  }

  componentDidMount() {
    this.requestOTP();
    this.startCountDown(this.props.navigation.state.params?.resendTime);
    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.API.WRONG_OTP,
      this,
      this.otpHandler,
    );
    this.setState({
      disabledChangePhone: this.props.navigation.state.params?.disabledChangePhone || false,
    });
    // setTimeout(() => {
    //   this.otpInput._focusInput(0);
    // }, 500);
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (props.requestWithOTPResult !== nextProps.requestWithOTPResult) {
      this.handleOTPResult(nextProps.requestWithOTPResult);
    }
  }

  componentWillUnmount() {
    this.stopCountDown();
    BroadcastManager.shared().removeObserver(BroadcastManager.NAME.API.WRONG_OTP, this);
    if (this.onOtpCancelCallback) {
      this.onOtpCancelCallback();
    }
  }

  // parse data of the previous request
  parseParams = () => {
    // auto active OTP input after a request
    const { requestData } = this.props.navigation.state.params;
    if (requestData) {
      this.requestData = requestData;
      this.phone =
        // GET request
        (this.requestData.axiosData.params && this.requestData.axiosData.params.accessToken) ||
        // POST request
        (this.requestData.axiosData.data && this.requestData.axiosData.data.mobilePhone) ||
        '';
      return;
    }

    // open direct OTP input
    const {
      userPhoneNumber,
      onOtpResendCallback,
      onOtpSubmitCallback,
      onOtpCancelCallback,
      otpConfirmCode,
    } = this.props.navigation.state.params;
    if (userPhoneNumber) {
      this.phone = userPhoneNumber;
      this.onOtpResendCallback = onOtpResendCallback;
      this.onOtpSubmitCallback = onOtpSubmitCallback;
      this.onOtpCancelCallback = onOtpCancelCallback;
      this.otpConfirmCode = otpConfirmCode;
    }
  };

  /*  EVENTS
   */

  onResentOTPPress = (option) => {
    if (this.requestData) {
      this.setState({ isShownWrongOTPMessage: false });
      this.requestOTP(1, option);
      return;
    }

    // callback for direct OTP
    if (this.onOtpResendCallback) {
      this.setState({ isShownWrongOTPMessage: false });
      this.onOtpResendCallback((wait_retry, allowRetryEmail) => {
        this.startCountDown(wait_retry);
        this.setState({
          optionsRetry: allowRetryEmail ? OPTIONS_RETRY : OPTIONS_RETRY_WITHOUT_EMAIL,
        });
      }, option);
      return;
    }
  };

  onToolbarBackBtnPress = () => {
    this.props.navigation.goBack();
  };

  onToolbarNextButtonPress = () => {
    this.sendCurrentRequest();
  };

  onOtpInputTextChange = (text) => {
    this.otpText = text;
    this.setState({
      canGoNextStep: text.length === OTP_INPUT_LENGTH,
      isShownWrongOTPMessage: false,
    });
    if (text.length === OTP_INPUT_LENGTH) {
      this.sendCurrentRequest();
    }
  };

  onChangePhoneNumberPress = () => {
    this.props.navigation.goBack();
  };

  /*  PRIVATE
   */

  otpHandler = (errorCode) => {
    if (errorCode === 'wrong_otp') {
      this.handleWrongOTP();
    }
  };

  handleOTPResult = (result) => {
    if (result === OTP_RESULT_TYPE.FAILED) this.handleWrongOTP();
    else if (result === OTP_RESULT_TYPE.SUCCESS) this.handleSuccessOTP();
  };

  handleWrongOTP = (text) => {
    this.setState({ isShownWrongOTPMessage: true, textWrongOTP: text });
    // const numberOfInputs = this.otpInput._getNumberOfInputs();
    // this.otpInput._focusInput(numberOfInputs - 1);
  };

  handleSuccessOTP = () => {
    this.props.navigation.goBack();
  };

  sendCurrentRequest = () => {
    // resend request
    if (this.requestData) {
      this.props.sendRequestWithOTP(this.requestData, this.otpText);
      return;
    }

    // callback for direct OTP
    if (this.onOtpSubmitCallback) {
      this.onOtpSubmitCallback(this.otpText, this.handleWrongOTP);
      return;
    }
  };

  requestOTP = (isRetry, type) => {
    this.setState({ disabledResend: true }, () => {
      if (this.requestData)
        this.props.requestOTP(
          this.phone,
          isRetry,
          (responseOTP) => {
            if (
              responseOTP &&
              responseOTP.data &&
              responseOTP.data.status &&
              responseOTP.data.wait_retry
            ) {
              if (__DEV__) {
                this.otpInput?.onTextInputChangeText?.(responseOTP?.data?.otp_code);
              }
              this.startCountDown(responseOTP.data.wait_retry);
              this.setState({
                disabledResend: false,
                optionsRetry: responseOTP.data?.allow_retry_email
                  ? OPTIONS_RETRY
                  : OPTIONS_RETRY_WITHOUT_EMAIL,
              });
            }
          },
          type,
        );
    });
  };

  startCountDown = (countNumber) => {
    this.stopCountDown();
    this.setState({ countDownSecs: countNumber || COUNT_DOWN_SECONDS });
    this.countDownInterval = setInterval(() => {
      this.setState({ countDownSecs: this.state.countDownSecs - 1 }, () => {
        if (this.state.countDownSecs === 0) {
          this.stopCountDown();
          this.setState({ disabledResend: false });
        }
      });
    }, 1000);
  };

  stopCountDown = () => {
    if (this.countDownInterval) {
      clearInterval(this.countDownInterval);
      this.countDownInterval = null;
    }
  };

  /*  RENDER
   */

  renderToolbar = () => (
    <LoginToolbar
      onToolbarBackPress={this.onToolbarBackBtnPress}
      showRightButton
      rightButtonTitle={'Tiếp tục'}
      rightButtonTextStyle={{ color: Colors.primary1 }}
      disabledRightButton={!this.state.canGoNextStep}
      onRightButtonPress={this.onToolbarNextButtonPress}
    />
  );

  renderOtpMessage = (phoneNumber) => (
    <View style={styles.otpMessage}>
      <AppText style={{ fontSize: 14, lineHeight: 22, textAlign: 'center', color: Colors.gray5 }}>
        {'Nhập mã xác thực '}
        <AppText
          style={{ fontSize: 14, lineHeight: 22, textAlign: 'center', color: Colors.gray1 }}
          bold
        >
          4 chữ số
        </AppText>
        {' đã được gửi tới số ĐT '}
        <AppText style={{ fontSize: 14, lineHeight: 22, color: 'black' }} bold>
          {formatPhoneNumber(phoneNumber)}
        </AppText>
      </AppText>
    </View>
  );

  renderOtpInput = (phoneNumber) => {
    const { isShownWrongOTPMessage, textWrongOTP } = this.state;
    return (
      <View>
        {this.renderOtpMessage(phoneNumber)}
        <View style={{ marginTop: 20 }}>
          <CodeInput
            ref={(ref) => {
              this.otpInput = ref;
            }}
            // numberOfInputs={OTP_INPUT_LENGTH}
            // containerStyle={styles.otpInput}
            onCodeInputSubmit={this.onOtpInputTextChange}
          />
        </View>
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            // alignItems: 'center',
            marginTop: 8,
            opacity: isShownWrongOTPMessage ? 1 : 0,
            marginHorizontal: 16,
          }}
        >
          <Image source={require('./img/ic_red_warning.png')} />
          <Text
            style={{
              marginLeft: 6,
              ...TextStyles.normalTitle,
              color: Colors.accent3,
              textAlign: 'center',
            }}
          >
            {textWrongOTP || 'Mã OTP không chính xác!'}
          </Text>
        </View>
      </View>
    );
  };

  renderTimerMessage = () => {
    const { countDownSecs, disabledResend, optionsRetry } = this.state;
    return (
      <View
        style={{
          marginTop: 8,
          marginBottom: 20,
          justifyContent: 'center',
        }}
      >
        <OTPRetry
          title={`Nếu không nhận được mã xác thực,\nvui lòng bấm gửi lại qua`}
          titleCountDown={`Nếu không nhận được mã xác thực,\nbấm gửi lại sau `}
          options={optionsRetry}
          onPressOption={this.onResentOTPPress}
          disabled={disabledResend}
          countDownSecs={countDownSecs}
        />
      </View>
    );
  };

  renderChangeToAnotherPhoneNumber = () => (
    <LinkButton
      containerStyle={{ marginTop: 56, alignSelf: 'center' }}
      textStyle={{ color: Colors.primary2 }}
      text={'Đổi số điện thoại khác'}
      onPress={this.onChangePhoneNumberPress}
    />
  );

  render() {
    const { sendingOTP, navigation } = this.props;
    const { disabledChangePhone } = this.state;
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
      <View style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        <HeaderBar
          goBack={() => {
            navigation.pop();
          }}
        />
        {/* {this.renderToolbar()} */}
        <View
          style={{
            borderRadius: 10,
            marginHorizontal: 16,
            marginTop: 20,
            backgroundColor: Colors.primary5,
          }}
        >
          {this.renderOtpInput(this.phone)}
          {this.renderTimerMessage()}
        </View>
        {this.requestData && !disabledChangePhone ? this.renderChangeToAnotherPhoneNumber() : null}
        <Loading visible={sendingOTP} />
      </View>
      // </SafeAreaView>
    );
  }
}

OtpConfirmScreen.navigationOptions = () => {
  return {
    title: ' ', // must have a space or navigation will crash
    header: null,
  };
};

const styles = StyleSheet.create({
  otpMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 43,
    marginRight: 43,
  },
});

const mapDispatchToProps = {
  requestOTP,
  sendRequestWithOTP,
};

const mapStateToProps = (state) => ({
  sendingOTP: state.sendingOTP,
  sendingOTPResult: state.sendingOTPResult,
  requestWithOTPResult: state.requestWithOTPResult,
});

export default connect(mapStateToProps, mapDispatchToProps)(OtpConfirmScreen);
