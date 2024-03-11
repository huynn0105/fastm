import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';

import Colors from '../../theme/Color';
// import { SCREEN_WIDTH } from  '../../utils/Utils';

export default StyleSheet.create({
  safaView: {
    flex: 1,
    backgroundColor: Colors.primary5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.primary5,
  },
  scrollWrapper: {
    flex: 1,
  },
  formWrapper: {
    // margin: 16,
    // padding: 16,
    // borderRadius: 6,
    // backgroundColor: Colors.neutral5
  },
  indicatorBottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wraningIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.accent3,
    marginRight: 10,
  },
  descWraningIndicator: {
    flex: 1,
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.primary4,
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    marginVertical: 14,
  },
  wrapperCheckbox: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  txtTitle: {
    opacity: 0.6,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    marginBottom: 10,
  },
  indicatorBox: {
    marginLeft: 32,
  },
  textStyleBasic: {
    fontSize: SH(14),
    lineHeight: SH(17),
    color: Colors.gray2,
  },
  iconColorStyle: {
    width: SW(40),
    height: SH(40),
    resizeMode: 'contain',
  },
});
