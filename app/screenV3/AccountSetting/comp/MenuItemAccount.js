import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';

import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';

import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';

const MenuItemAccount = ({
  label,
  iconUrl,
  isPaddingTop,
  isPaddingBottom,
  onPress,
  action,
  disabled,
  hideNextIcon,
  rightLabel,
  rightLabelObject,
}) => {
  const _onPress = useCallback(() => {
    if (typeof onPress === 'function') {
      onPress(action);
    }
  }, [onPress, action]);

  const renderRightLabel = useCallback(() => {
    if (!rightLabelObject) return <View />;
    const { color, type, content } = rightLabelObject;
    if (!(type && content)) return <View />;
    if (type === 'IMAGE') {
      return (
        <Image
          source={{ uri: content }}
          style={[styles.imgRightlabel, disabled && styles.disabled]}
        />
      );
    } else {
      return (
        <AppText style={[styles.rightSubLable, disabled && styles.disabled, color && { color }]}>
          {content}
        </AppText>
      );
    }
  }, [rightLabelObject]);

  return (
    <TouchableWithoutFeedback onPress={_onPress} disabled={disabled}>
      <View
        style={[
          styles.menuItemWrapper,
          isPaddingTop && styles.paddingTop,
          isPaddingBottom && styles.paddingBottom,
        ]}
      >
        <View style={styles.leftSpace}>
          <FastImage
            source={{ uri: iconUrl }}
            style={[styles.ic, disabled && styles.disabled]}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <AppText style={[styles.label, disabled && styles.disabled]}>{label}</AppText>
        {/* {renderRightLabel()} */}
        {rightLabel && (
          <AppText style={[styles.rightLabel, disabled && styles.disabled]}>{rightLabel}</AppText>
        )}
        {!hideNextIcon && (
          <View style={styles.rightSpace}>
            <Image
              source={ICON_PATH.arrow_right}
              style={[styles.ic, disabled && styles.disabled]}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MenuItemAccount;

const styles = StyleSheet.create({
  menuItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: SH(5),
  },
  disabled: {
    opacity: 0.4,
  },
  paddingTop: {
    paddingTop: SH(16),
  },
  paddingBottom: {
    paddingBottom: SH(16),
  },
  leftSpace: {
    width: SW(58),
    alignItems: 'center',
  },
  rightSpace: {
    width: SW(46),
    alignItems: 'center',
  },
  ic: {
    width: SW(24),
    height: SH(24),
  },
  label: {
    flex: 1,
    fontSize: SH(16),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(23),
    letterSpacing: 0,
    color: Colors.primary4,
  },
  rightLabel: {
    fontSize: SH(16),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: SH(23),
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary2,
    marginRight: SW(16),
  },
  rightSubLable: {
    fontSize: SH(12),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(18),
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
    marginHorizontal: SW(6),
  },
  imgRightlabel: {
    width: SW(20),
    height: SH(20),
  },
});
