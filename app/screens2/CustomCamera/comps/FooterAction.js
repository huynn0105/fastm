import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SCREEN_SIZE } from '../CustomCamera.contants';

const FooterAction = ({ onCapturePress, onCancelPress, onRotateCameraPress }) => {
  const onStaticCapturePress = useCallback(() => {
    if (onCapturePress) {
      onCapturePress();
    }
  }, [onCapturePress]);

  const onStaticCancelPress = useCallback(() => {
    if (onCancelPress) {
      onCancelPress();
    }
  }, [onCancelPress]);

  const onStaticRotateCameraPress = useCallback(() => {
    if (onRotateCameraPress) {
      onRotateCameraPress();
    }
  }, [onRotateCameraPress]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.flex1}>
        <TouchableOpacity style={styles.cent} onPress={onStaticCancelPress}>
          <Image style={styles.normalImg} source={require('../img/ic_close.png')} />
          <AppText style={styles.nomalTxt}>{'Huỷ bỏ'}</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.flex1}>
        <TouchableOpacity style={styles.cent} onPress={onStaticCapturePress}>
          <Image style={styles.boldImg} source={require('../img/ic_capture.png')} />
          <AppText style={styles.boldTxt}>{'Chụp hình'}</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.flex1}>
        <TouchableOpacity style={styles.cent} onPress={onStaticRotateCameraPress}>
          <Image style={styles.normalImg} source={require('../img/ic_switch.png')} />
          <AppText style={styles.nomalTxt}>{'Xoay Camera'}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterAction;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    height: SCREEN_SIZE.height * 0.15,
  },
  flex1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomalTxt: {
    fontSize: 12,
    marginTop: 8,
    color: '#ffffff',
  },
  boldTxt: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    color: '#ffffff',
  },
  normalImg: {
    width: 36,
    height: 36,
  },
  boldImg: {
    width: 64,
    height: 64,
  },
});