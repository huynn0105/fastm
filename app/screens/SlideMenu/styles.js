
import { StyleSheet } from 'react-native';

import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.app_theme,
  },
  headerContainer: {
    paddingTop: 44,
    paddingBottom: 44,
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  userAvatar: {
    width: 72,
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#fff',
  },
  userName: {
    marginTop: 12,
    color: '#fff',
    fontSize: 18,
  },
  userCreateTime: {
    marginTop: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
  },
  menuContainer: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 0,
    marginBottom: -12,
    paddingTop: 0,
    backgroundColor: '#0000',
  },
  versionContainer: {
    alignSelf: 'stretch',
    marginTop: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 4,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#fff2',
  },
});
