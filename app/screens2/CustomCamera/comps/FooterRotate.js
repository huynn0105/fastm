import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AppText from '../../../componentV3/AppText';

import { SCREEN_SIZE } from '../CustomCamera.contants';

const FooterRotate = ({
  onRotateImageRightPress,
  onRotateImageLeftPress,
  onCancelPress,
  onFinishPress,
}) => {
  const onStaticRotateImageRightPress = useCallback(() => {
    if (onRotateImageRightPress) {
      onRotateImageRightPress();
    }
  }, [onRotateImageRightPress]);

  const onStaticRotateImageLeftPress = useCallback(() => {
    if (onRotateImageLeftPress) {
      onRotateImageLeftPress();
    }
  }, [onRotateImageLeftPress]);

  const onStaticCancelPress = useCallback(() => {
    if (onCancelPress) {
      onCancelPress();
    }
  }, [onCancelPress]);

  const onStaticFinishPress = useCallback(() => {
    if (onFinishPress) {
      onFinishPress();
    }
  }, [onFinishPress]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.flex1}>
        <TouchableOpacity style={styles.cent} onPress={onStaticCancelPress}>
          <Image style={styles.normalImg} source={require('../img/ic_close.png')} />
          <AppText style={styles.nomalTxt}>{'Huỷ bỏ'}</AppText>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.flex1}>
                <TouchableOpacity
                    style={styles.cent}
                    onPress={onStaticRotateImageLeftPress }
                >
                    <Image
                        style={styles.normalImg}
                        source={require('../img/ic_rotate_left.png')}
                    />
                    <AppText style={styles.nomalTxt}>
                        {'Xoay Trái'}
                    </AppText>
                </TouchableOpacity>
            </View>
            <View style={styles.flex1}>
                <TouchableOpacity
                    style={styles.cent}
                    onPress={onStaticRotateImageRightPress}
                >
                    <Image
                        style={styles.normalImg}
                        source={require('../img/ic_rotate_right.png')}
                    />
                    <AppText style={styles.nomalTxt}>
                        {'Xoay Phải'}
                    </AppText>
                </TouchableOpacity>
            </View> */}
      <View style={styles.flex1}>
        <TouchableOpacity style={styles.cent} onPress={onStaticFinishPress}>
          <Image style={styles.normalImg} source={require('../img/ic_finish.png')} />
          <AppText style={styles.nomalTxt}>{'Hoàn thành'}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterRotate;

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
