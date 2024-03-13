import React, { useEffect, useRef } from 'react';
import { Image, Text, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SH, SW } from '../../../constants/styles';
import styles from '../PasswordAndSecurity.styles';
import CustomTextInput from '../../../components2/CustomTextInput';
import Colors from '../../../theme/Color';

import { Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import VerifyOTPCode from './verifyOTPView';
import { icons } from '../../../img';
import PCustomTextInput from '../../../components2/PCustomTextInput';
import AppText from '../../../componentV3/AppText';

const AddPassCodeView = ({ onFinish, onCloseModal }) => {
  const passCodeInputRef = useRef(null);
  const verifyPassCodeInputRef = useRef(null);

  const [passCode, setPassCode] = React.useState('');
  const [verifyPassCode, setVerifyPassCode] = React.useState('');
  const [step, setStep] = React.useState(0);
  const [errorCode, setErrorCode] = React.useState('');

  const onSetPassword = () => {
    setStep(1);
  };

  const validateButton = () => {
    if (passCode.length < 6 || verifyPassCode.length < 6 || passCode !== verifyPassCode) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (passCode.length === 6) {
      verifyPassCodeInputRef.current?.textInputRef.focus();
    }
  }, [passCode]);

  useEffect(() => {
    if (verifyPassCode !== passCode && verifyPassCode?.length === 6 && passCode.length === 6) {
      setErrorCode('Mật khẩu không khớp, vui lòng kiểm tra lại');
    } else {
      setErrorCode('');
    }
  }, [verifyPassCode, passCode]);

  const _onFinish = (passCode) => {
    onFinish(passCode);
  };

  return (
    <View>
      {step === 0 ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ height: Platform.OS === 'ios' ? SH(708) : SH(500) }}
          keyboardVerticalOffset={SH(90)}
        >
          <View style={styles.headerViewModalStyle}>
            <Image source={icons.close} style={[styles.iconStyle, { opacity: 0 }]} />
            <AppText style={styles.headerStyle}>Đặt mật khẩu</AppText>
            <TouchableOpacity onPress={onCloseModal}>
              <Image source={icons.close} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <View>
              <View style={{ paddingHorizontal: SW(16), marginTop: SH(24) }}>
                <AppText style={[styles.textStyle, { textAlign: 'center' }]}>
                  Đặt mật khẩu gồm 6 chữ số để đăng nhập vào MFast thay cho mã xác thực OTP
                </AppText>
              </View>
              <View style={{ marginVertical: SH(16) }}>
                <PCustomTextInput
                  ref={(ref) => {
                    passCodeInputRef.current = ref;
                  }}
                  autoFocus
                  isShowLeftIcon
                  // isShownClearTextButton={true}
                  hideShowClearTextButton
                  inputStyle={[
                    styles.inputStyle,
                    { backgroundColor: 'rgb(241, 247, 255)', borderColor: Colors.primary2, borderWidth: 1 },
                  ]}
                  keyboardType="number-pad"
                  secureTextEntry={true}
                  placeholder="Nhập mật khẩu"
                  maxLength={6}
                  onChangeText={(text) => setPassCode(text)}
                  isShownLeftIcon={true}
                  icon={icons.iconShield}
                />
              </View>
              <PCustomTextInput
                ref={(ref) => {
                  verifyPassCodeInputRef.current = ref;
                }}
                inputStyle={[
                  styles.inputStyle,
                  {
                    backgroundColor: 'rgb(241, 247, 255)',
                    borderColor: Colors.neutral3,
                    borderWidth: 1,
                  },
                ]}
                secureTextEntry={true}
                placeholder="Nhập lại mật khẩu"
                hideShowClearTextButton
                maxLength={6}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  setErrorCode('');
                  setVerifyPassCode(text);
                }}
                isShownLeftIcon={true}
                icon={icons.iconShield}
              />
              {errorCode && errorCode.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: SH(15),
                  }}
                >
                  <Image
                    source={icons.iconWarning}
                    style={{
                      width: SW(20),
                      height: SH(20),
                      resizeMode: 'contain',
                      marginRight: SW(8),
                    }}
                  />
                  <AppText style={{ fontSize: SH(14), lineHeight: SH(16), color: Colors.accent3 }}>
                    {errorCode}
                  </AppText>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              disabled={validateButton()}
              onPress={onSetPassword}
              style={{
                height: SH(46),
                width: SW(343),
                backgroundColor: validateButton() ? '#c4c7d8' : Colors.primary2,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 23,
                marginBottom: SH(20),
              }}
            >
              <AppText style={{ fontSize: SH(16), lineHeight: SH(24), color: Colors.primary5 }}>
                Đặt mật khẩu
              </AppText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <VerifyOTPCode
          onFinish={_onFinish}
          passCode={passCode}
          onCloseModal={onCloseModal}
          onPressBack={() => setStep(0)}
        />
      )}
    </View>
  );
};

export default AddPassCodeView;
