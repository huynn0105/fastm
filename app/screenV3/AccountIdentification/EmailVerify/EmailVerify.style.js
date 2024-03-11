import { StyleSheet } from 'react-native';
import { SH } from '../../../constants/styles';

import Colors from '.././../../theme/Color';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 50,
    backgroundColor: '#fff',
  },
  indicatorTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(36, 37, 63, 0.6)',
  },
  indicatorTitleBold: {
    fontWeight: 'bold',
    color: 'rgba(36, 37, 63, 1)',
  },
  bottomIndicator: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(36, 37, 61, 0.6)',
  },
  bottomIndicatorBold: {
    fontWeight: 'bold',
    color: 'rgba(36, 37, 63, 1)',
  },
  buttonWrapper: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral5,
  },
  successWrapper: {
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: SH(14),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: SH(22),
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
    marginTop: SH(20),
  },
  subLabel: {
    fontSize: SH(12),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(22),
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    opacity: 0.8,
    marginTop: 10,
  },
  icoSuccess: {
    tintColor: Colors.primary2,
  },
});
