import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Colors from '../../theme/Color';

import { IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';

const LoginRequire = (props) => (
  <View
    style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.neutral5,
      marginTop: props?.marginTop,
    }}
  >
    <View style={{ position: 'absolute', top: 0, width: '100%' }}>{props?.renderHeader?.()}</View>
    <Image
      source={props?.image || IMAGE_PATH.mascot}
      style={{ width: props?.imageSize || 156, height: props?.imageSize || 156 }}
    />
    <AppText medium style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 16 }}>
      {props?.title ? (
        props?.title
      ) : (
        <>
          Đăng nhập để trở thành đại lý{'\n'}
          <AppText bold style={{ fontSize: 16, lineHeight: 24, color: Colors.blue3 }}>
            tất cả-trong-một
          </AppText>{' '}
          về tài chính, bảo hiểm
        </>
      )}
    </AppText>
    <TouchableOpacity
      style={{
        backgroundColor: Colors.primary2,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        borderRadius: 24,
        marginTop: 16,
      }}
      {...props}
    >
      <AppText
        medium
        style={{ color: Colors.primary5, fontSize: 16, lineHeight: 22, textAlign: 'center' }}
      >
        Đăng nhập ngay
      </AppText>
    </TouchableOpacity>
  </View>
);

export default LoginRequire;
