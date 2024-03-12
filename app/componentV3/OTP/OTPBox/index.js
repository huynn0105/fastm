import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import isEmpty from 'lodash/isEmpty';
import OTPCodeInput from '../OTPCodeInput';

import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';

import { ICON_PATH } from '../../../assets/path';

import AppText from '../../../componentV3/AppText';
import CodeInput from '../../../components2/CodeInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: SW(78),
    // marginRight: SW(78),
    marginVertical: SH(20),
  },
  indicatorTitle: {
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(22),
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(36, 37, 63, 0.6)',
  },
  indicatorTitleBold: {
    // fontWeight: 'bold',
    fontSize: SH(14),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  bottomIndicator: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(36, 37, 61, 0.6)',
  },
  bottomIndicatorBold: {
    fontSize: SH(14),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  resendIndicatorContainer: {
    alignItems: 'center',
  },
  resendIndicator: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
  },
  txtWarning: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
    textAlign: 'center',
    marginBottom: 10,
  },
  txtDecor: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary2,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icWaring: {
    width: 16,
    height: 16,
  },
  txtError: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.accent3,
  },
});

const OTPBox = forwardRef((props, ref) => {
  const {
    verifyInfor,
    timer,
    errorMessage,
    onSubmitVerifyOTP,
    onResendOTP,
    onChangeText,
    onPressInput,
    onHandlerCountdownDone,
    styleContainer,
    email,
    type,
    customTextResend,
    isHideResend,
  } = props;
  /* <------------------- Ref -------------------> */
  const otpNumber1Ref = useRef(null);

  /* <------------------- State -------------------> */

  const [isStart, setIsStart] = useState(false);

  const [value, setValue] = useState('');
  const [secs, setSecs] = useState(0);
  const [isEnableResend, setIsEnableResend] = useState(false);

  /* <------------------- useEffect -------------------> */
  useEffect(() => {
    const intervalTimer = setInterval(countDown, 1000);
    if (secs === 0) {
      clearInterval(intervalTimer);
    }
    return () => {
      clearInterval(intervalTimer);
    };
  }, [secs]);

  useEffect(() => {
    if (timer) {
      setIsEnableResend(false);
      setSecs(timer);
      setIsStart(true);
      setTimeout(() => {
        otpNumber1Ref?.current?.focus();
      }, 250);
    } else {
      setSecs(0);
      setIsStart(false);
    }
  }, [timer]);

  useImperativeHandle(ref, () => ({
    getFullNumberOTP: () => value,
  }));

  /* <------------------- countDown -------------------> */
  const countDown = useCallback(() => {
    const nextSecs = secs - 1;
    if (nextSecs === 0 && isStart && onHandlerCountdownDone) {
      setIsEnableResend(true);
      onHandlerCountdownDone();
    }
    setSecs(nextSecs);
  }, [secs, isStart, onHandlerCountdownDone]);

  /* <------------------- Get -------------------> */

  const resendOTP = useCallback(() => {
    if (onResendOTP && verifyInfor?.to) {
      if (errorMessage) {
        setValue('');
      }
      onResendOTP(verifyInfor?.to);
      setIsEnableResend(false);
    }
  }, [onResendOTP, errorMessage, verifyInfor?.to]);

  const getLableSendTo = useCallback(() => {
    if (verifyInfor?.to && verifyInfor?.by) {
      if (verifyInfor?.by === 'SĐT') {
        return `xxxx${verifyInfor?.to.slice(6, 11)}`;
      }
      return verifyInfor?.to;
    }
    return '';
  }, [verifyInfor]);

  /* <------------------- Render -------------------> */
  if (!verifyInfor || !(verifyInfor?.to && verifyInfor?.by)) {
    return (
      <View>
        <AppText style={styles.txtWarning}>{`Bạn chưa nhập ${
          verifyInfor?.by || ''
        }, vui lòng điền ${verifyInfor?.by || ''} trước khi xác thực.`}</AppText>
        {onPressInput && (
          <AppText style={styles.txtDecor} onPress={onPressInput}>{`Bấm vào đây để nhập ${
            verifyInfor?.by || ''
          }`}</AppText>
        )}
      </View>
    );
  }
  return (
    <View>
      {type !== 'email' ? (
        <AppText style={styles.indicatorTitle}>
          Nhập mã xác thực
          <AppText style={styles.indicatorTitleBold}>{` 4 chữ số`}</AppText>
          {` đã được gửi tới ${verifyInfor?.by || ''} `}
          <AppText bold style={styles.indicatorTitleBold}>
            {getLableSendTo()}
          </AppText>
        </AppText>
      ) : (
        <AppText style={styles.indicatorTitle}>
          Nhập mã xác thực
          <AppText style={styles.indicatorTitleBold}>{` 4 chữ số`}</AppText>
          {` đã được gửi tới email: `}
          <AppText style={styles.indicatorTitleBold}>{email}</AppText>
        </AppText>
      )}

      <View style={[styles.container, styleContainer]}>
        <CodeInput
          onCodeInput={(v) => {
            setValue(v);
            onChangeText(v);
          }}
          onCodeInputSubmit={onSubmitVerifyOTP}
        />
      </View>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Image style={styles.icWaring} source={ICON_PATH.warning} />
          <AppText style={styles.txtError}>{errorMessage}</AppText>
        </View>
      ) : (
        <View />
      )}
      {isHideResend ? null : (
        <>
          {!isEnableResend ? (
            <View style={{ alignItems: 'center' }}>
              <AppText style={styles.bottomIndicator}>
                {customTextResend || 'Nếu không nhận được mã xác thực, bấm gửi lại sau'}
                <AppText style={styles.bottomIndicatorBold}>{` ${secs}s`}</AppText>
              </AppText>
            </View>
          ) : (
            <View style={styles.resendIndicatorContainer}>
              <AppText style={styles.bottomIndicator}>Nếu không nhận được mã xác thực</AppText>
              <AppText onPress={resendOTP} style={styles.resendIndicator}>
                bấm gửi lại
              </AppText>
            </View>
          )}
        </>
      )}
    </View>
  );
});

export default OTPBox;
