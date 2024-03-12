import { StyleSheet } from 'react-native';
import { SH } from '../../constants/styles';
import Colors from '../../theme/Color';

export default StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  wrapper: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  wrapperCamera: {
    alignItems: 'center',
    flex: 0.6,
    // flex: 1,
  },
  containerCamera: {
    // flex: 1,
    marginTop: SH(51),
    // justifyContent: 'space-around',

    alignItems: 'center',
    // justifyContent: 'center',
  },
});
