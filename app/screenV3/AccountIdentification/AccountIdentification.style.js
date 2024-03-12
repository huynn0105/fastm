import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';

import Colors from '.././../theme/Color';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  stepContainer: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: Colors.neutral5,
  },
  swipperWrapper: {
    // flexGrow: 1,
    flex: 1,
  },
  pageWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  linearGradient: {
    flex: 1,
  },
  stepIndicatorContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  txtLabelIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary5,
  },
  txtLabel: {
    fontSize: SH(12),
    lineHeight: SH(16),
    textAlign: 'center',
    color: Colors.primary4,
    minWidth: SW(52),
    paddingHorizontal: SW(4),
  },
});
