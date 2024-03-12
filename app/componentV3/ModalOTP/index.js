import React, { useCallback, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';

import Modal from 'react-native-modal';

import OTPBox from '../OTP/OTPBox';
import Colors from '../../theme/Color';

import { renderNavigation } from '../../components/Navigation';
import SubmitButton from '../Button/SubmitButton';

import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';

const styles = StyleSheet.create({
  otpBoxWrapper: {
    margin: 16,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    padding: 16,
  },
  successWrapper: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2b7d0a',
    marginTop: 20,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    opacity: 0.8,
    marginTop: 10,
  },
  icoSuccess: {
    width: 64,
    height: 64,
  },
});

const ModalOTP = ({
  label,
  verifyInfor,
  timer,
  onCloseModal,
  isVisible,
  isVerified,
  onResendOTP,
  onSubmitVerify,
  errorMessageOTP,
  onHandlerCountdownDone,
  onGobackMain,
  isLoadingPhoneOTP,
  lableSuccess,
  descSuccess,
  type,
  email,
}) => {
  const otpBoxRef = useRef(null);

  /* <------------------- State -------------------> */
  const [disabledButton, setDisabledButton] = useState(true);

  const onBackPress = useCallback(() => {
    if (onCloseModal) {
      onCloseModal();
    }
  }, [onCloseModal]);

  const renderHeader = useCallback(() => {
    return renderNavigation({
      onBackPress,
      title: lableSuccess || 'Xác thực định danh',
      backgroundHeader: Colors.actionBackground,
    });
  }, [onBackPress, lableSuccess]);

  const onSubmit = useCallback(() => {
    if (isVerified && onGobackMain) {
      onGobackMain();
    }
    const otpNumber = otpBoxRef?.current?.getFullNumberOTP();
    if (onSubmitVerify && otpNumber) {
      onSubmitVerify(otpNumber);
    }
  }, [otpBoxRef, onSubmitVerify, isVerified, onGobackMain]);

  const _onHandlerCountdownDone = useCallback(() => {
    if (onHandlerCountdownDone) {
      onHandlerCountdownDone();
    }
  }, [onHandlerCountdownDone]);

  const onChangeText = useCallback((otpCode) => {
    setDisabledButton(otpCode.length !== 4);
  }, []);

  const _onResendOTP = useCallback(() => {
    if (onResendOTP) {
      onResendOTP(verifyInfor?.to);
    }
  }, [onResendOTP, verifyInfor]);

  const handlerDisableButton = useCallback(() => {
    if (isVerified) return false;
    return disabledButton;
  }, [isVerified, disabledButton]);

  const renderSuccessForm = useCallback(() => {
    return (
      <View style={styles.successWrapper}>
        <Image source={ICON_PATH.success} style={styles.icoSuccess} />
        <AppText style={styles.label}>
          {lableSuccess || 'Định danh tài khoản thành công !!!'}
        </AppText>
        <AppText style={styles.subLabel}>
          {descSuccess ||
            'Chúc mừng bạn đã định danh thành công. Bấm “Về thông tin cá nhân” để tiếp tục trải nghiệm MFast. Xin cảm ơn!!!'}
        </AppText>
      </View>
    );
  }, [isVerified, lableSuccess, descSuccess]);

  return (
    <View>
      <Modal
        style={{ flex: 1, margin: 0, padding: 0 }}
        backdropColor={Colors.actionBackground}
        backdropOpacity={1}
        isVisible={isVisible}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
            {renderHeader()}
            {isVerified ? (
              renderSuccessForm()
            ) : (
              <View style={styles.otpBoxWrapper}>
                <OTPBox
                  verifyInfor={verifyInfor}
                  ref={otpBoxRef}
                  timer={timer}
                  errorMessage={errorMessageOTP}
                  onSubmitVerifyOTP={onSubmit}
                  onHandlerCountdownDone={_onHandlerCountdownDone}
                  onResendOTP={_onResendOTP}
                  onChangeText={onChangeText}
                  type={type}
                  email={email}
                />
              </View>
            )}
            <View style={styles.buttonWrapper}>
              <SubmitButton
                disabled={handlerDisableButton()}
                onPress={onSubmit}
                isLoading={isLoadingPhoneOTP}
                label={
                  label ? label : isVerified ? 'Về thông tin cá nhân' : 'Xác thực số điện thoại'
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ModalOTP;
