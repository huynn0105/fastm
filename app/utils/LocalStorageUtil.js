import AsyncStorage from '@react-native-async-storage/async-storage';


class LocalStorageUtil {
  static saveDataAsyncStorage = (data, key) => {
    return AsyncStorage.setItem(key, data);
  };

  static retrieveDataAsyncStorage = key => {
    return AsyncStorage.getItem(key);
  };

  static removeDataAsyncStorage = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  static clearAllDataAsyncStorage = () => {
    return AsyncStorage.clear();
  }
}

export default LocalStorageUtil;
