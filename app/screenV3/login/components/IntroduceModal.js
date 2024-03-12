import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import CustomButton, { BUTTON_COLOR, BUTTON_SIZE } from '../../../components2/CustomButton';
import { SH, SW } from '../../../constants/styles';
import { icons } from '../../../img';
import styles from '../../PasswordAndSecurity/PasswordAndSecurity.styles';
import styles2 from '../Login.styles';
import AppText from '../../../componentV3/AppText';

const IntroduceModal = ({ onFinish, onCloseModal }) => {
  const _onFinish = () => {
    onFinish();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ height: SH(597) }}
      keyboardVerticalOffset={SH(90)}
    >
      <View style={styles.headerViewModalStyle}>
        <Image source={icons.close} style={[styles.iconStyle, { opacity: 0 }]} />
        <AppText style={styles.headerStyle}>Đăng nhập bằng mật khẩu</AppText>
        <TouchableOpacity onPress={onCloseModal}>
          <Image source={icons.close} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <View>
          <View style={{ paddingHorizontal: SW(16), marginTop: SH(24) }}>
            <AppText style={[styles.textStyle, { textAlign: 'center', paddingHorizontal: SW(30) }]}>
              Vui lòng đăng nhập bằng OTP trước, sau đó kích hoạt chức năng này để sử dụng cho các
              lần đăng nhập sau
            </AppText>
          </View>
          <View style={{ marginVertical: SH(16), flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ marginRight: SW(5) }}>
              <Image source={icons.introducePasscode1} style={styles2.imageIntroduceStyle} />
            </View>
            <View style={{ marginLeft: SW(5) }}>
              <Image source={icons.introducePasscode2} style={styles2.imageIntroduceStyle} />
            </View>
          </View>
        </View>
        <View style={{ marginTop: SH(24) }}>
          <CustomButton
            // containerStyle={{
            //   opacity: nextButtonOpacity,
            // }}
            buttonStyle={{ width: SW(343) }}
            // disabled={disabledNextButton}
            title={'Đã hiểu và quay lại'}
            buttonColor={BUTTON_COLOR.GREEN}
            sizeType={BUTTON_SIZE.LARGE}
            onPress={_onFinish}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IntroduceModal;
