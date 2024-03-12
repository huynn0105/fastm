import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: '#000',
  },
  wrapper: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  wrapperCamera: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCamera: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
