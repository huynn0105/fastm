/**
 * Help to validate otp code
 * The previous screen must pass:
 * - onOtpSubmitCallback
 * - onOtpResendCallback
 * - onOtpCancelCallback
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import Styles from '../../constants/styles';
import Strings, { formatString } from '../../constants/strings';
import CodeInput from '../../common/CodeInput';

import ImageButton from '../../common/buttons/ImageButton';
import TextButton from '../../common/buttons/TextButton';

import { hidePhoneNumber } from '../../utils/UIUtils';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: OtpCodeConfirm.js';
/* eslint-enable */

const TOTAL_COUNT_DOWN_SECS = 60;

// --------------------------------------------------
// OtpCodeConfirm
// --------------------------------------------------

class OtpConfirmScreen extends Component {
  constructor(props) {
    super(props);

    // check params valid
    if (!this.props.navigation || !this.props.navigation.state.params) {
      this.state = {
        otpCode: '',
        otpConfirmCode: '',
        countDownSecs: 0,
      };
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 0);
      return;
    }

    // init state
    const params = this.props.navigation.state.params;

    const otpConfirmCode = params.otpConfirmCode;
    const userPhoneNumber = hidePhoneNumber(params.userPhoneNumber);

    this.onOtpSubmitCallback = params.onOtpSubmitCallback;
    this.onOtpResendCallback = params.onOtpResendCallback;
    this.onOtpCancelCallback = params.onOtpCancelCallback;

    this.state = {
      otpCode: '',
      otpConfirmCode,
      userPhoneNumber,
      countDownSecs: TOTAL_COUNT_DOWN_SECS,
    };
  }
  componentDidMount() {
    // setup navigation
    if (this.props.navigation) {
      this.props.navigation.setParams({
        onHeaderLeftButtonPress: this.onHeaderLeftButtonPress,
        onHeaderRightButtonPress: this.onHeaderRightButtonPress,
      });
    }
    // count down
    this.startCountDown();
  }
  // --------------------------------------------------
  onHeaderLeftButtonPress = () => {
    if (this.onOtpCancelCallback) {
      this.onOtpCancelCallback();
    }
    setTimeout(() => {
      if (this.props.navigation) {
        this.props.navigation.goBack();
      }
    }, 0);
  };
  onOtpInputSubmit = (otpCode) => {
    this.setState(
      {
        otpCode,
      },
      () => {
        // 1. check otp code
        if (!this.checkOtpValid()) {
          return;
        }
        // 2. callback
        // this.props.navigation.goBack();
        setTimeout(() => {
          this.onOtpSubmitCallback(otpCode);
        }, 250);
      },
    );
  };
  onOtpResendPress = () => {
    this.props.navigation.goBack();
    setTimeout(() => {
      this.onOtpResendCallback();
    }, 500);
  };
  // --------------------------------------------------
  checkOtpValid() {
    Utils.log(`${LOG_TAG} checkOtpValid: `, this.state.otpCode, this.state.otpConfirmCode);
    const otpCode = this.state.otpCode ? this.state.otpCode.trim() : '';
    if (otpCode.length === 0) {
      this.showAlert(formatString(Strings.missing_field, { field_name: 'mã xác thực' }));
      return false;
    }
    // if (otpCode !== this.state.otpConfirmCode) {
    //   this.showAlert(Strings.wrong_otp);
    //   return false;
    // }
    return true;
  }
  startCountDown() {
    this.stopCountDown();
    this.countDownInterval = setInterval(() => {
      this.setState(
        {
          countDownSecs: this.state.countDownSecs - 1,
        },
        () => {
          if (this.state.countDownSecs === 0) {
            this.stopCountDown();
          }
        },
      );
    }, 1000);
  }
  stopCountDown() {
    if (this.countDownInterval) {
      clearInterval(this.countDownInterval);
      this.countDownInterval = null;
    }
  }
  showAlert(message) {
    Alert.alert(Strings.alert_title, message, [{ text: 'Đóng' }], { cancelable: false });
  }
  // --------------------------------------------------
  renderTitle() {
    const { userPhoneNumber } = this.state;
    return (
      <Text style={styles.titleText}>
        <Text style={{ color: '#202020' }}>{Strings.otp_call_message1}</Text>
        <Text style={{ color: '#202020', fontWeight: '600' }}>{` ${userPhoneNumber} `}</Text>
        <Text style={{ color: '#202020' }}>{Strings.otp_call_message2}</Text>
        <Text style={{ color: '#202020', fontWeight: '600' }}>
          {` ${TOTAL_COUNT_DOWN_SECS} giây.`}
        </Text>
      </Text>
    );
  }
  renderHint() {
    return <Text style={styles.hintText}>{Strings.otp_hint}</Text>;
  }
  renderOtpInput() {
    return <CodeInput onCodeInputSubmit={this.onOtpInputSubmit} />;
  }
  renderOtpResendButton() {
    const { countDownSecs } = this.state;
    if (countDownSecs === 0) {
      return (
        <TextButton
          style={{ height: 44 }}
          title={'Chưa nhận được cuộc gọi?'}
          titleStyle={{
            fontWeight: '400',
          }}
          isArrowHidden
          onPress={this.onOtpResendPress}
        />
      );
    }
    return <Text style={styles.countDownText}>{`MFAST sẽ gọi trong ${countDownSecs} giây`}</Text>;
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderTitle()}
        {this.renderOtpInput()}
        {this.renderHint()}
        {this.renderOtpResendButton()}
      </View>
    );
  }
}

export default OtpConfirmScreen;

// --------------------------------------------------

OtpConfirmScreen.navigationOptions = ({ navigation }) => ({
  title: 'Nhập mã xác thực',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  headerLeft: <HeaderLeftButton navigation={navigation} />,
});

const HeaderLeftButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <ImageButton
      style={styles.headerLeftButton}
      imageSource={require('./img/arrow_left.png')}
      onPressIn={() => {
        if (params && params.onHeaderLeftButtonPress) {
          params.onHeaderLeftButtonPress();
        }
      }}
    />
  );
};

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  titleText: {
    marginTop: 12,
    marginBottom: 20,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  hintText: {
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12,
    color: '#606060',
    fontSize: 13,
    textAlign: 'center',
  },
  headerLeftButton: {
    width: 64,
    height: 64,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 4,
    paddingRight: 32,
  },
  countDownText: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#0000',
    color: '#0080DC',
    fontSize: 14,
    fontWeight: '400',
  },
});
