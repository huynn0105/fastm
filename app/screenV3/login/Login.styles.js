import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

export default StyleSheet.create({
  iconStyle: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  headerTextStyle1: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.primary4,
    textAlign: 'center',
  },
  headerTextStyle2: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.primary2,
  },
  iconStyle: {
    width: SW(46),
    height: SW(46),
    resizeMode: 'contain',
    tintColor: Colors.primary2,
  },
  toolbar: {
    width: '100%',
    padding: 16,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerHeader: {
    paddingHorizontal: SW(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallIcon: {
    width: SW(18),
    height: SH(18),
    resizeMode: 'contain',
  },
  logo: {
    height: SH(26),
    width: SW(106),
    resizeMode: 'contain',
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
  imageIntroduceStyle: {
    height: SH(288),
    width: SW(167),
    resizeMode: 'contain',
  },
});
