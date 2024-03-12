import { StyleSheet } from 'react-native';

import Colors from '../../theme/Color';

export default StyleSheet.create({
  safaView: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  wrapperItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    height: '100%',
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: Colors.gray1,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: Colors.gray5,
    lineHeight: 20,
  },
  icRightContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  icRight: {},
  icLeft: {
    width: 24,
    height: 24,
  },
});
