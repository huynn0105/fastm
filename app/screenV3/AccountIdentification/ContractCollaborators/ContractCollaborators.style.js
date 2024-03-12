import { StyleSheet } from 'react-native';

import Colors from '../../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
    paddingBottom: 8,
    width: SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.primary5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.neutral4,
    marginBottom: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 0,
  },
  txtCheck: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  imgCheck: {
    width: 32,
    height: 32,
    marginRight: 16,
    tintColor: Colors.primary2,
  },
  txtChecked: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  webview: {
    flex: 1,
    borderRadius: 10,
  },
});
