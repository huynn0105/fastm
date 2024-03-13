import { BackHandler, Platform } from 'react-native';

let backHandler = null;

const backAndroidHandler = (callback) => {
  if (Platform.OS === 'android') {
    if (backHandler) {
      removeBackAndroidHandler();
    }
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true;
    });
  }
};

const removeBackAndroidHandler = () => {
  if (Platform.OS === 'android' && backHandler && backHandler.remove) {
    backHandler.remove();
    backHandler = null;
  }
};

export { backAndroidHandler, removeBackAndroidHandler };
