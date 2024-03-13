import { StyleSheet } from 'react-native';
import { SH, SW } from '../../../constants/styles';

import Colors from '../../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.actionBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.actionBackground,
    padding: 16,
  },
  pathImage: {
    width: SW(120),
    height: SH(160),
    borderRadius: 6,
    marginLeft: SW(12),
  },
  importImageContainer: {
    width: SW(120),
    height: SH(160),
    borderRadius: 6,
    backgroundColor: Colors.actionBackground,
    borderStyle: 'dashed',
    borderColor: Colors.primary2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SH(16),
  },
  icAdd: {
    width: 24,
    height: 24,
    tintColor: Colors.primary2,
  },
  indicator: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIndicatorLeft: {
    opacity: 0.6,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    marginBottom: 16,
  },
  topIndicatorRight: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary2,
    marginBottom: 16,
  },
  txtDow: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
    paddingRight: 8,
  },
  btContainer: {
    paddingHorizontal: SW(41),
    marginVertical: SH(10),
  },
  bottomBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    marginVertical: 12,
  },
  indicatorBottom: {
    fontSize: 14,
    letterSpacing: 0,
    color: Colors.primary2,
    marginRight: 12,
    flex: 1,
    lineHeight: 18,
  },
  iconContainer: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  resultContainer: {
    borderRadius: 6,
    backgroundColor: '#ffeee0',
    padding: 12,
    marginBottom: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  raw: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icPending: {
    width: 20,
    height: 20,
  },
  indicatorStatus: {
    fontSize: SH(13),
    lineHeight: SH(16),
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.accent2,
    marginLeft: 6,
  },
  indicatorLabel: {
    opacity: 0.6,
    fontSize: SH(12),
    lineHeight: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  indicatorDesc: {
    flex: 1,
    fontSize: SH(13),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(16),
    letterSpacing: 0,
    color: Colors.accent2,
    marginTop: 10,
  },
  resultContainerFailure: {
    borderRadius: 6,
    backgroundColor: '#ffe1e5',
    padding: 12,
    marginBottom: 16,
  },
  resultContainerSuccess: {
    borderRadius: 6,
    backgroundColor: '#d3ffe4',
    padding: 12,
    marginBottom: 16,
  },
  indicatorStatusSuccess: {
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.accent1,
    marginLeft: 6,
  },
  indicatorStatusFailure: {
    fontSize: SH(13),
    lineHeight: SH(16),
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.accent3,
    marginLeft: 6,
  },
  indicatorLabelFailure: {
    opacity: 0.6,
    fontSize: SH(12),
    lineHeight: SH(16),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary3,
  },
  indicatorDescFailure: {
    flex: 1,
    fontSize: SH(13),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(16),
    letterSpacing: 0,
    color: Colors.accent3,
    marginTop: SH(10),
  },
  indicatorDescSuccess: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: Colors.accent1,
    marginTop: 10,
  },
  labelInput: {
    fontSize: SH(14),
    lineHeight: SH(20),
    textAlign: 'center',
    color: Colors.gray1,
    marginBottom: SH(16),
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
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: Colors.primary4,
  },
  highlight: {
    color: Colors.accent3,
    fontWeight: '500',
  },
  bottonIndicator: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.primary4,
    marginTop: 20,
  },
  updateImage: {
    width: SW(140),
    height: SH(120),
    resizeMode: 'contain',
    marginBottom: SH(16),
    marginTop: SH(20),
  },
});
