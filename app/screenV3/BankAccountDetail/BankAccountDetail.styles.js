import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';
export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  wapperBox: {
    flex: 0,
    backgroundColor: '#fff',
    paddingHorizontal: SW(16),
    // marginTop: SH(16),
  },
  expendContainer: {
    marginTop: SH(16),
  },
  boxCMNDContainer: {
    paddingBottom: 0,
  },
  dividers: {
    height: 1,
    width: '100%',
    marginVertical: 6,
    backgroundColor: Colors.neutral4,
  },
  labelStatus: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primary4,
    marginVertical: 8,
    marginRight: 12,
  },
  imageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  status: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.primary4,
  },
  successTxt: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent1,
  },
  failureTxt: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
  },
  penddingTxt: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent2,
  },
  title: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  selfieImg: {
    width: SCREEN_WIDTH - 32,
    height: ((SCREEN_WIDTH - 32) * 242) / 343,
    borderRadius: 6,
    marginVertical: 10,
  },
  btnWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  successDesc: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.thirdGreen,
  },
  noteTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray5,
  },
});
