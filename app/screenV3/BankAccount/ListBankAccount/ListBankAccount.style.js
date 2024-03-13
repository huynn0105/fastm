import { StyleSheet } from 'react-native';
import { SH, SW } from '../../../constants/styles';

import Colors from '../../../theme/Color';
// import { SCREEN_WIDTH } from '../../../utils/Utils';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.actionBackground,
    marginBottom: SH(20),
  },
  indicatorHeaderContainer: {
    marginTop: SH(20),
    marginBottom: SH(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtIndicatorHeader: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.gray2,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#15157A',
  },
  icNextContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorHeader: {
    fontSize: SH(14),
    lineHeight: SH(20),
    // letterSpacing: 0,
    color: Colors.primary5,
  },
  subIndicatorHeader: {
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.primary5,
    marginTop: SH(4),
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  icAdd: {
    width: SW(32),
    height: SH(32),
    resizeMode: 'contain',
  },
  bottomBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary5,
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
});
