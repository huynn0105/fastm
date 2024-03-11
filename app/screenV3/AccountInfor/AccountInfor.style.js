import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';

import Colors from '../../theme/Color';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  indicatorBoxVerify: {
    flex: 1,
    paddingTop: SH(16),
    paddingHorizontal: SW(16),
  },
  boxContainer: {
    borderRadius: 6,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 16,
  },
  linearGradient: {
    flex: 1,
    width: '100%',
  },
  rowStyleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SH(14),
    paddingLeft: SW(14),
    alignItems: 'center',
  },
  iconStyle: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
    marginRight: SW(16),
  },
  textStyle: {
    fontSize: SH(16),
    lineHeight: SH(23),
    color: Colors.primary4,
  },
  buttonBack: {
    alignSelf: 'center',
    marginTop: 24,
    height: 50,
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 24,
    borderColor: Colors.gray5,
  },
  buttonTextBack: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
  },
  buttonBack: {
    alignSelf: 'center',
    marginTop: 24,
    height: 50,
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 24,
    borderColor: Colors.gray5,
  },
  buttonTextBack: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
  },
});
