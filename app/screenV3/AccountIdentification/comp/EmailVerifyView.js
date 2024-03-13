import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import AppText from '../../../componentV3/AppText';
import OTPBox from '../../../componentV3/OTP/OTPBox';
import styles, { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const EmailVerifyView = ({ email, onSubmitVerify, sendOTP, errorMessageOTPEmail }) => {
  const [otp, setOtp] = useState('');
  const otpBoxRef = useRef(null);
  const [errorMessageOTP, setErrorMessageOTP] = useState('');
  const [timerOTP, setTimerOTP] = useState(30);
  const _onResendOTP = () => {
    setTimerOTP(30);
    // getOTP(1);
    sendOTP(email);
  };
  return (
    <View style={_styles.container}>
      <View>
        <OTPBox
          verifyInfor={{
            by: 'email',
            to: email,
          }}
          ref={(ref) => {
            otpBoxRef.current = ref;
          }}
          timer={timerOTP}
          errorMessage={errorMessageOTPEmail}
          onSubmitVerifyOTP={onSubmitVerify}
          onHandlerCountdownDone={() => setTimerOTP(null)}
          onResendOTP={_onResendOTP}
          onChangeText={(text) => setOtp(text)}
          styleContainer={{ marginHorizontal: SW(78) }}
          customTextResend={
            'Nếu không nhận được mã xác thực, vui lòng kiểm tra lại trong “Hộp thư rác” hoặc bấm gửi lại sau'
          }
        />
      </View>
    </View>
  );
};

const _styles = StyleSheet.create({
  container: {
    paddingHorizontal: SW(16),
    alignItems: 'center',
    paddingTop: SH(24),
    paddingBottom: Platform.OS === 'android' ? SH(60) : SH(300),
  },
  top: {
    marginTop: SH(24),
    marginBottom: SH(20),
  },
  middle: {},
});

export default EmailVerifyView;
