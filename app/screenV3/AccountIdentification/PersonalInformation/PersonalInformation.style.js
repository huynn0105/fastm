import { StyleSheet } from 'react-native';

import Colors from '.././../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import TextStyles from '../../../theme/TextStyle';
import { SH, SW } from '../../../constants/styles';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  container: {
    flex: 1,
  },
  formWrapper: {
    paddingHorizontal: SW(16),
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  labelGender: {
    opacity: 0.6,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    marginRight: 20,
  },
  textFieldContainerStyle: {
    flex: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  buttonWrapper: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral5,
  },
  listContainer: {
    width: '100%',
    marginTop: -18,
    borderColor: Colors.primary2,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listDistrict: {
    maxHeight: SCREEN_WIDTH / 1.5,
    width: '100%',
  },
  itemContainer: {
    flex: 1,
    padding: 8,
  },
  labelItem: {
    ...TextStyles.heading4,
    textAlign: 'center',
  },
  emptyContainer: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  emptyTxt: {
    ...TextStyles.normalTitle,
    opacity: 0.6,
  },
  indicatorDistrictContainer: {
    position: 'absolute',
    right: 0,
    bottom: 14,
    width: 130,
  },
  indicatorDistrictTxt: {
    opacity: 0.4,
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
  },
  containerBoxIdentify: {
    backgroundColor: Colors.primary5,
    // padding: SW(16),
    paddingHorizontal: SW(16),
    paddingTop: SH(16),
    borderRadius: 8,
    marginTop: SH(8),
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
    paddingBottom: SH(50),
    // alignItems: 'center',
  },
  imageSupportManual: {
    width: SW(126),
    height: SH(95),
    resizeMode: 'contain',
  },
  ic: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  rowViewStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fieldTitleText: {
    fontSize: SH(13),
    lineHeight: SH(22),
    color: Colors.gray5,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.gray1,
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
});
