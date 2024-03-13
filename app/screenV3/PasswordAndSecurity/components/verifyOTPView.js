import React, { useEffect, useRef } from 'react';
import { Image, Text, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SH, SW } from '../../../constants/styles';
import styles from '../PasswordAndSecurity.styles';

import { Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { icons } from '../../../img';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../../redux/selectors/userSelector';
import OTPBox from '../../../componentV3/OTP/OTPBox';
import { useActions } from '../../../hooks/useActions';

import {
  dispatchSendPhoneOTP,
  dispatchVerifyPhoneOTP,
} from '../../../redux/actions/actionsV3/sendPhoneOTP';
import AppText from '../../../componentV3/AppText';

const VerifyOTPCode = ({ onFinish, onCloseModal, passCode, onPressBack }) => {
  const [otp, setOtp] = React.useState('');
  const [timerOTP, setTimerOTP] = React.useState(null);

  const [errorMessageOTP, setErrorMessageOTP] = React.useState('');

  const otpRef = React.useRef(null);
  const actions = useActions({
    dispatchSendPhoneOTP,
    dispatchVerifyPhoneOTP,
  });

  const getOTP = (isRetry) => {
    actions.dispatchSendPhoneOTP(myUser?.mPhoneNumber, 'voice', null, isRetry, 'profile');
  };

  //   const onSetPassword = () => {
  //     const _passCode = passCodeInputRef.current?.textInputRef._lastNativeText;

  //     onFinish(_passCode);
  //   };

  useEffect(() => {
    setTimerOTP(30);
    getOTP();
    return () => {};
  }, []);

  const _onResendOTP = () => {
    console.log('ateetet');
    setTimerOTP(30);
    getOTP(1);
  };

  useEffect(() => {
    if (otp?.length === 4) {
      onSubmit();
    }
  }, [otp]);

  const myUser = useSelectorShallow(getMyuserSelector);

  //   useEffect(() => {
  //     if (passCode.length === 6) {
  //       verifyPassCodeInputRef.current?.textInputRef.focus();
  //     }
  //   }, [passCode]);

  const onSubmit = () => {
    actions.dispatchVerifyPhoneOTP(myUser.mPhoneNumber, otp, (payload) => {
      if (payload.status) {
        onFinish(passCode);
      } else {
        setErrorMessageOTP('Mã OTP không chính xác');
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ height: SH(708) }}
      keyboardVerticalOffset={SH(90)}
    >
      <View style={styles.headerViewModalStyle}>
        <TouchableOpacity onPress={() => onPressBack()}>
          <Image source={icons.back} style={styles.iconStyle} />
        </TouchableOpacity>
        <AppText style={styles.headerStyle}>Xác nhận đặt mật khẩu</AppText>
        <TouchableOpacity onPress={onCloseModal}>
          <Image source={icons.close} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        <View>
          <View style={{ paddingHorizontal: SW(16), marginTop: SH(24) }}></View>
          <View style={{ marginVertical: SH(16), paddingHorizontal: SW(16) }}>
            <OTPBox
              verifyInfor={{
                by: 'SĐT',
                to: myUser?.mPhoneNumber,
              }}
              ref={(ref) => {
                otpRef.current = ref;
              }}
              timer={timerOTP}
              errorMessage={errorMessageOTP}
              //   onSubmitVerifyOTP={onSubmit}
              onHandlerCountdownDone={() => setTimerOTP(null)}
              onResendOTP={_onResendOTP}
              onChangeText={(text) => setOtp(text)}
              styleContainer={{ marginHorizontal: SW(78) }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTPCode;
