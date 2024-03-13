// all styles used in the app

import { Dimensions, StyleSheet } from 'react-native';
import { default as Colors, default as colorsTheme } from '../theme/Color';
import iphone12Helper from '../utils/iphone12Helper';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Utils';
import colors from './colors';

const WindowSize = Dimensions.get('window');
const getFontMedium = () => {
  if (WindowSize.width <= 320) return 13;
  if (WindowSize.width <= 375) return 14;
  return 15;
};
export const fontMedium = getFontMedium();

export const SCALE_RATIO_WIDTH = SCREEN_WIDTH / 375;
export const SCALE_RATIO_HEIGHT = SCREEN_HEIGHT / 812;

export const REACT_VIEW_WIDTH = WindowSize.width - 64;

export const SW = (size) => size * SCALE_RATIO_WIDTH;
export const SH = (size) => size * SCALE_RATIO_HEIGHT;

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.button_background,
    borderWidth: 0,
    borderRadius: 22,
    borderColor: '#fff',
    justifyContent: 'center',
    height: 40,
    // paddingLeft: 16,
    // paddingRight: 16,
    overflow: 'hidden',
  },
  button_text: {
    color: colors.text_white,
    fontSize: 15,
    fontWeight: '600',
  },
  button_overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
  },
  link_button: {
    alignItems: 'center',
    backgroundColor: '#0000',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  link_button_text: {
    color: colors.app_theme_darker,
    fontSize: 14,
    fontWeight: '400',
  },
  navigator_header: {
    backgroundColor: colorsTheme.neutral5,
  },
  navigator_header_title: {
    color: '#000',
    fontSize: SH(17),
    lineHeight: SH(22),
    fontFamily: 'MFastVN-Regular',
  },
  navigator_header_no_border: {
    backgroundColor: colorsTheme.neutral5,
    // iOS
    borderBottomWidth: 0,
    // Android
    elevation: 0,
    marginTop: iphone12Helper() ? SH(12) : 0,
  },
  shadow: {
    borderColor: '#A0A0A0',
    elevation: 4,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
  },

  sectionSeparator: {
    flex: 0,
    height: 8,
    backgroundColor: colors.separator,
  },
  commonText: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray1,
  },
  mediumText: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray5,
  },
  commonNormalText: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
  },
  commonTitleText: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,
  },
});
