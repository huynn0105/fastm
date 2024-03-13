import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.primary5,
    // backgroundColor: 'red',
  },
  iconStyle: {
    width: SW(24),
    height: SW(24),
    resizeMode: 'contain',
  },
  titleStyle: {
    fontSize: 16,
    color: Colors.gray1,
    lineHeight: 23,
    fontWeight: '500',
  },
  descriptionStyle: {
    fontSize: 14,
    color: Colors.gray2,
    lineHeight: 20,
  },
  headerViewModalStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral5,
    height: SH(46),
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    alignItems: 'center',
    paddingHorizontal: SW(11),
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 23,
    color: Colors.primary4,
  },
  headerStyle: {
    fontSize: 14,
    color: Colors.primary1,
    lineHeight: SH(17),
    fontWeight: '500',
  },
  inputStyle: {
    height: SH(48),
    fontSize: 18,
    lineHeight: 23,
    marginHorizontal: SW(16),
    borderRadius: 27,
  },
});
