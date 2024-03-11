import { StyleSheet } from 'react-native';
import { SH } from '../../constants/styles';

import Colors from '../../theme/Color';

export default StyleSheet.create({
  safaView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.neutral5,
  },
  footerList: {
    height: SH(25),
  },
  linearGradient: {
    flex: 1,
    width: '100%',
    position: 'absolute',
  },
});
