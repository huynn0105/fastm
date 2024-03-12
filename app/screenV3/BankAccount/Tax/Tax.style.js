import { StyleSheet } from 'react-native';
import { SH, SW } from '../../../constants/styles';

import Colors from '../../../theme/Color';
// import { SCREEN_WIDTH } from '../../../utils/Utils';

export default StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.primary5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.primary5,
    paddingHorizontal: SW(16),
  },
  labelInput: {
    fontSize: SH(14),

    lineHeight: SH(20),
    letterSpacing: 0,

    color: Colors.primary4,

    marginBottom: SH(8),
  },
  cmndIdNumber: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary1,
  },
  inputCode: {
    marginHorizontal: 28,
    height: 56,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary1,
    padding: 12,
    textAlign: 'center',
    backgroundColor: '#e2e8ff',
  },
  bottomBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 8,
    backgroundColor: Colors.actionBackground,
    marginVertical: SH(12),
    paddingHorizontal: SW(12),
    paddingVertical: SH(14),
  },
  indicatorBottom: {
    fontSize: 14,
    lineHeight: 18,
    marginRight: 12,
    flex: 1,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary2,
  },

  clearContainer: {
    position: 'absolute',
    right: 12,
  },
  inputCOntainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24,
  },
  indicatorMissing: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
  },
  taxtRefreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SH(24),
    marginTop: SH(16),
  },
  txtRefersh: {
    fontSize: SH(14),
    lineHeight: SH(17),

    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
    marginLeft: 6,
  },
  warningWrapper: {
    flex: 1,
  },
  smbol: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    marginRight: 8,
  },
  lineWarning: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  indicatorWarning: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: Colors.primary4,
  },
  descWarning: {
    flex: 1,
    fontSize: SH(14),
    lineHeight: SH(22),
    letterSpacing: 0,
    color: Colors.primary4,
  },
  highlight: {
    color: Colors.accent3,
    lineHeight: SH(22),
    fontSize: SH(14),
    // fontWeight: '500',
  },
  bottonIndicator: {
    opacity: 0.8,
    fontSize: SH(14),
    lineHeight: SH(20),
    letterSpacing: 0,
    color: Colors.primary4,
    marginTop: SH(24),
  },

  textInBoxMessage: {
    fontSize: 13,
    color: Colors.accent2,
    lineHeight: 18,
  },
  iconStyle: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
    tintColor: Colors.accent2,
  },
});
