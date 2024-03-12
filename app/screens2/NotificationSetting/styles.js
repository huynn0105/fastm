import { StyleSheet } from 'react-native';
import Colors from '../../theme/Color';

export default StyleSheet.create({
  // scenes
  container: {
    // flex: 1,
    backgroundColor: Colors.primary6,
  },
  titleH1: {
    opacity: 0.6,
    fontSize: 14,
    color: '#24253d',
    margin: 16,
  },
  // item
  notiSettingItemContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 23,
    color: '#24253d',
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.6,
    color: '#24253d',
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorTxt: {
    opacity: 0.6,
    fontSize: 10,
    letterSpacing: 0,
    color: '#24253d',
    paddingRight: 6,
  },
  switchContainer: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
  },
  divider: {
    width: '100%',
    height: 16,
  },
  customerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
