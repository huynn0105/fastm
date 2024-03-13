// /* eslint no-use-before-define: ["error", { "variables": false }], padded-blocks: 0 */

import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { getDefaultAvatar } from '../../utils/userHelper';

const Color = {
  defaultColor: '#b2b2b2',
  backgroundTransparent: 'transparent',
  defaultBlue: '#0084ff',
  leftBubbleBackground: '#f0f0f0',
  white: '#fff',
  carrot: '#e67e22',
  emerald: '#2ecc71',
  peterRiver: '#3498db',
  wisteria: '#8e44ad',
  alizarin: '#e74c3c',
  turquoise: '#1abc9c',
  midnightBlue: '#2c3e50',
  optionTintColor: '#007AFF',
  timeTextColor: '#aaa',
};

const { carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue } = Color;
const COLORS = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

const CharAvatar = (props) => {
  const {
    source,
    style,
    onPress,
    defaultImage,
    defaultName,
    textStyle,
    backgroundColor,
    fontSize,
    textColor,
  } = props;

  /* -------------------------- -------------------------- */
  const getShortName = useCallback(() => {
    if (!defaultName) return '';
    let avatarName = '';
    const name = defaultName?.toUpperCase().split(' ');
    if (name.length === 1) {
      avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      avatarName = `${name[0].charAt(0)}${name[name.length - 1].charAt(0)}`;
    }
    return avatarName;
  }, [defaultName]);

  /* -------------------------- -------------------------- */
  const getBgColorName = useCallback(() => {
    if (!defaultName) return Color.backgroundTransparent;
    let sumChars = 0;
    for (let i = 0; i < defaultName?.length; i += 1) {
      sumChars += defaultName?.charCodeAt(i);
    }
    return COLORS[sumChars % COLORS.length];
  }, [defaultName]);

  const _onPress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={_onPress}
      style={[styles.container, style, { backgroundColor: backgroundColor || getBgColorName() }]}
      accessibilityTraits="image"
    >
      <>
        {source?.uri ? (
          <FastImage style={styles.avatarStyle} source={source} resizeMode="cover" />
        ) : getShortName() ? (
          <AppText
            style={[
              styles.textStyle,
              textStyle,
              fontSize && { fontSize },
              textColor && { color: textColor },
            ]}
          >
            {getShortName()}
          </AppText>
        ) : (
          <FastImage
            style={styles.avatarStyle}
            source={defaultImage || ICON_PATH.unknown}
            resizeMode="cover"
          />
        )}
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  textStyle: {
    color: Color.white,
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    fontWeight: '500',
  },
});

export default CharAvatar;
