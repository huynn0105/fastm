import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';

import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';

export default StyleSheet.create({
  safaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  icTabBar: {
    width: 29,
    height: 29,
  },
  labelTabbar: {
    fontSize: 13,

    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    paddingVertical: 6,
  },
  labelFocus: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.primary2,
  },
  labelBlur: {
    fontWeight: 'normal',
    color: Colors.primary4,
    opacity: 0.8,
    fontSize: SH(14),
    lineHeight: SH(20),
  },
  indicatorStyle: {
    backgroundColor: Colors.primary2,
    height: 2,
  },
  tabbarBg: {
    backgroundColor: Colors.neutral5,
  },
  tabStyle: {},
  contentContainerStyle: {
    backgroundColor: Colors.neutral5,
  },
  backgroundPopup: {
    backgroundColor: Colors.primary5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    minHeight: SH(212),
    // paddingHorizontal: SW(16),
  },
  headerPopupTextStyle: {
    color: Colors.gray1,
    fontSize: SH(16),
    lineHeight: SH(22),
  },
  popupTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  imageStyle: {
    height: SH(48),
    width: SW(188),
    resizeMode: 'contain',
    marginTop: SH(20),
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d6dcf7',
    height: SH(53),
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconStyle: {
    width: SW(56),
    height: SH(56),
  },
});
