import { StyleSheet } from 'react-native';
import { SH } from '../constants/styles';
import colors from './Color';

const TextStyles = StyleSheet.create({
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 38,
    color: colors.primary4,
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
    color: colors.primary4,
  },
  button1: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 22,
    color: colors.primary4,
  },
  heading3: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 23,
    color: colors.primary4,
  },
  button2: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.primary4,
  },
  heading4: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary4,
  },
  caption1: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.primary4,
  },
  body2: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary4,
  },
  caption2: {
    fontSize: SH(12),
    lineHeight: SH(16),
    color: colors.primary4,
  },
  whiteNormal: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.primary5,
  },
  superSmallText: {
    fontSize: 10,
    lineHeight: 14,
    color: colors.primary4,
  },
  normalTitle: {
    fontSize: SH(12),
    lineHeight: SH(16),
    color: colors.primary4,
  },
});

export default TextStyles;
