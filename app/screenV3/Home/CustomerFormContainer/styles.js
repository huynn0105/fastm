import { StyleSheet } from 'react-native';
import { SH } from '../../../constants/styles';
import Colors from '../../../theme/Color';

export default StyleSheet.create({
  textStyle: {
    fontSize: SH(15),
    lineHeight: SH(20),
    color: Colors.primary4,
    
  },
  smallTextStyle: {
    fontSize: SH(13),
    color: Colors.accent1,
    fontWeight: 'bold',
  },
});
