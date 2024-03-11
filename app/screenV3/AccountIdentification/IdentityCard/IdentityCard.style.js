import { StyleSheet } from 'react-native';

import Colors from '.././../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { SH, SW } from '../../../constants/styles';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.neutral5,
    paddingBottom: SH(40),
  },
  importCMNDContainer: {
    paddingVertical: SH(20),
    paddingHorizontal: SW(16),
    backgroundColor: Colors.actionBackground,
  },
  identifyCardContainer: {
    marginTop: SH(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inforVerifyContainer: {
    flex: 1,
    paddingHorizontal: SW(16),
    backgroundColor: Colors.neutral5,
  },
  boxVerify: {
    borderRadius: 6,
    backgroundColor: '#fff',
    padding: SW(16),
  },
  indicatorBottomContainer: {
    paddingVertical: SH(16),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // justifyContent: 'space-between',
  },
  topIndicator: {
    fontSize: SH(14),
    lineHeight: SH(22),
    letterSpacing: 0,
    color: Colors.gray1,
  },
  wraningIndicator: {
    fontSize: SH(12),
    fontStyle: 'normal',
    lineHeight: SH(18),
    letterSpacing: 0,
    color: Colors.accent3,
    marginRight: SW(10),
  },
  descWraningIndicator: {
    flex: 1,
    opacity: 0.8,
    fontSize: SH(12),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(18),
    letterSpacing: 0,
    color: Colors.primary4,
    marginVertical: SH(5),
  },
  suggestIndicator: {
    fontSize: SH(14),
    textAlign: 'center',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary2,
  },
  importIndicator: {
    opacity: 0.8,
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    marginTop: SH(20),
    marginBottom: SH(12),
  },
  itemVerifyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  labelTxt: {
    opacity: 0.6,
    fontSize: SH(13),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  divider: {
    height: SH(12),
  },
  valueTxt: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
    marginLeft: SW(30),
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorError: {
    flex: 1,
    fontSize: SH(12),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    lineHeight: SH(17),
    marginLeft: SW(8),
    color: Colors.accent3,
  },
  sendSupportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SH(6),
  },
  icCheck: {
    width: SW(24),
    height: SH(24),
    marginRight: SW(7),
    tintColor: Colors.primary2,
  },
  txtCheckNormal: {
    flex: 1,
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    opacity: 0.8,
    color: Colors.primary4,
  },
  txtChecked: {
    flex: 1,
    fontSize: SH(14),
    fontStyle: 'normal',
    lineHeight: SH(18),
    letterSpacing: 0,
    color: Colors.primary4,
  },
  note: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: Colors.primary5,
    borderWidth: 1,
    borderColor: Colors.neutral4,
    height: SH(65),
    marginTop: SH(10),
    textAlignVertical: 'top',
    padding: SW(12),
  },
  checkboxContainer: {
    marginTop: SH(18),
  },
  ic: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  successTxt: {
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(18),
    letterSpacing: 0,
    color: Colors.accent1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SH(16),
  },
  errorDupContainer: {
    borderRadius: 5,
    backgroundColor: '#ffe2e6',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: Colors.accent3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: SH(16),
    paddingLeft: SW(6),
  },
  txtErrorDup: {
    fontSize: SH(12),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
    paddingVertical: SH(13),
    marginHorizontal: SW(6),
    flex: 1,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
  },
  iconFail: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  iconSuccess: {
    width: SW(15),
    height: SH(15),
    resizeMode: 'contain',
  },
  containerStatusBarStyle: {
    backgroundColor: Colors.primary5,
    padding: SW(12),
    marginHorizontal: SW(16),
    borderRadius: 8,
    borderWidth: 1,
  },
  rowViewSeparate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
  },
  containerStatusNote: {
    marginTop: SH(13),
  },
  containerActionSheet: {
    backgroundColor: Colors.actionBackground,
    paddingHorizontal: SW(16),
    paddingTop: SH(16),

    // alignItems: 'center',
  },
  imageSupportManual: {
    width: SW(126),
    height: SH(95),
    resizeMode: 'contain',
  },
});