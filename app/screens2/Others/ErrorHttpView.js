import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';

import Colors from '../../theme/Color';
import { ERROR_TYPE } from './WebViewScreen';

const ErrorHttpView = ({ type, onReloadWebview, backToHome }) => {
  switch (type) {
    case ERROR_TYPE.BAD_NETWORK: {
      return (
        <View
          style={{
            backgroundColor: Colors.actionBackground,
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View style={{ marginTop: SH(48) }}>
            <Image source={IMAGE_PATH.badNetwork} style={styles.bannerImage} />
          </View>
          <View style={{ paddingHorizontal: SW(16) }}>
            <AppText style={[styles.textStyle, { textAlign: 'center' }]}>
              {`Đã có lỗi xảy ra,\n vui lòng kiểm tra lại kết nối và thử lại.`}
            </AppText>
          </View>
          <TouchableOpacity
            style={{
              width: SW(180),
              height: SH(48),
              backgroundColor: Colors.primary2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              marginTop: SH(20),
            }}
            onPress={onReloadWebview}
          >
            <AppText style={{ fontSize: SH(16), lineHeight: SH(20), color: Colors.primary5 }}>
              Thử lại
            </AppText>
          </TouchableOpacity>
        </View>
      );
    }
    case ERROR_TYPE.ERROR_NETWORK: {
      return (
        <View
          style={{
            backgroundColor: Colors.actionBackground,
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View style={{ marginTop: SH(48) }}>
            <Image source={IMAGE_PATH.errorNetwork} style={styles.bannerImage} />
          </View>
          <View style={{ paddingHorizontal: SW(16) }}>
            <AppText style={[styles.textStyle, { textAlign: 'center' }]}>
              {`Đã có lỗi xảy ra,\n liên kết đã đóng hoặc không tồn tại.`}
            </AppText>
          </View>
          <TouchableOpacity
            style={{
              width: SW(180),
              height: SH(48),
              backgroundColor: Colors.primary2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              marginTop: SH(20),
            }}
            onPress={backToHome}
          >
            <AppText style={{ fontSize: SH(16), lineHeight: SH(20), color: Colors.primary5 }}>
              Quay lại
            </AppText>
          </TouchableOpacity>
        </View>
      );
    }
    default: {
      return (
        <View style={styles.container}>
          <Image source={IMAGE_PATH.logo_blur} style={styles.logo} />
          <Text style={styles.errorTxt}>Rất tiếc, truy cập tạm thời không khả dụng.</Text>
          <Text style={styles.errorTxt}>Vui lòng thử lại, hoặc liên hệ với bộ phận hỗ trợ. </Text>
          <Text style={styles.errorTxt}>Xin cảm ơn.</Text>
        </View>
      );
    }
  }
};

export default ErrorHttpView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral5,
  },
  logo: {
    height: SH(60),
    width: SW(60),
    resizeMode: 'contain',
    marginBottom: SH(10),
  },
  errorTxt: {
    opacity: 0.6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: SW(188),
    height: SH(140),
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray2,
  },
});
