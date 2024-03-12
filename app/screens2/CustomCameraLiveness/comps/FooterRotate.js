import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

import { SCREEN_SIZE } from '../CustomCameraLiveness.contants';

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
        <TouchableOpacity
          style={[styles.cent, { backgroundColor: Colors.actionBackground }]}
          onPress={onStaticCancelPress}
        >
          <AppText style={styles.nomalTxt}>{'Chụp lại'}</AppText>
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
        <TouchableOpacity
          style={[styles.cent, { backgroundColor: Colors.primary2 }]}
          onPress={onStaticFinishPress}
        >
          <AppText style={styles.boldTxt}>{'Tiếp tục'}</AppText>
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
    alignItems: 'flex-end',
    // height: SCREEN_SIZE.height * 0.15,
  },
  flex1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: SH(48),
    width: SW(148),
    borderRadius: 27,
  },
  nomalTxt: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  boldTxt: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.primary5,
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
