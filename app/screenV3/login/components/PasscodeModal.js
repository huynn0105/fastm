import React, { useEffect, useRef } from 'react';
import { Image, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SH, SW } from '../../../constants/styles';
import styles from '../../PasswordAndSecurity/PasswordAndSecurity.styles';
import CustomTextInput from '../../../components2/CustomTextInput';
import Colors from '../../../theme/Color';

import { icons } from '../../../img';
import AppText from '../../../componentV3/AppText';

const PassCodeModal = ({ onFinish, onCloseModal, errorMessage, resetError }) => {
  const passCodeInputRef = useRef(null);

  const [passCode, setPassCode] = React.useState('');

  useEffect(() => {
    resetError();
    if (passCode.length === 6) {
      _onFinish(passCode);
    }
  }, [passCode]);

  const _onFinish = (passCode) => {
    onFinish(passCode);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ height: Platform.OS === 'ios' ? SH(597) : SH(400) }}
      keyboardVerticalOffset={SH(90)}
    >
      <View style={styles.headerViewModalStyle}>
        <Image source={icons.close} style={[styles.iconStyle, { opacity: 0 }]} />
        <AppText style={styles.headerStyle}>Đăng nhập bằng mật khẩu</AppText>
        <TouchableOpacity onPress={onCloseModal}>
          <Image source={icons.close} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        <View>
          <View style={{ paddingHorizontal: SW(16), marginTop: SH(24) }}>
            <AppText style={[styles.textStyle, { textAlign: 'center', paddingHorizontal: SW(30) }]}>
              Nhập mật khẩu 6 chữ số của bạn để đăng nhập vào MFast
            </AppText>
          </View>
          <View style={{ marginVertical: SH(16) }}>
            <CustomTextInput
              ref={(ref) => {
                passCodeInputRef.current = ref;
              }}
              autoFocus
              isShowLeftIcon
              // isShownClearTextButton={true}
              hideShowClearTextButton
              inputStyle={[
                styles.inputStyle,
                {
                  backgroundColor:
                    errorMessage && errorMessage?.length > 0 ? 'rgb(255,230,233)' : '#f1f7ff',
                  borderColor:
                    errorMessage && errorMessage?.length > 0 ? Colors.accent3 : Colors.primary2,
                  borderWidth: 1,
                },
              ]}
              keyboardType="number-pad"
              secureTextEntry={true}
              placeholder="Nhập mật khẩu"
              maxLength={6}
              onChangeText={(text) => setPassCode(text)}
              // errorMessage={errorMessage}
              // isShownError={errorMessage && errorMessage.length > 0}
            />
            {errorMessage && errorMessage.length > 0 ? (
              <View style={{ marginTop: SH(12), flexDirection: 'row', paddingHorizontal: SW(16) }}>
                <Image
                  source={icons.iconWarning}
                  style={{ width: SW(20), height: SH(20), resizeMode: 'contain' }}
                />
                <AppText
                  style={{
                    fontSize: SH(14),
                    lineHeight: SH(20),
                    color: Colors.accent3,
                    marginHorizontal: SW(8),
                    textAlign: 'center',
                  }}
                >
                  {errorMessage}
                </AppText>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PassCodeModal;
