import { POSTS_TIPS } from './types';
import DigitelClient from '../../network/DigitelClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';

export function postTips(data) {
  return {
    type: POSTS_TIPS,
    payload: data,
  };
}

export function fetchPostTips() {
  return async (dispatch) => {
    try {
      const posts = await DigitelClient.fetchPostsTips();
      await AsyncStorage.setItem(AsyncStorageKeys.LIST_POST_TIPS, JSON.stringify(posts));
      dispatch(postTips(posts));
    } catch (error) {
      dispatch(postTips([]));
    }
  };
}

export function fetchPostTipsFromLocal() {
  return async (dispatch) => {
    try {
      const posts = await AsyncStorage.getItem(AsyncStorageKeys.LIST_POST_TIPS);
      if (posts) {
        dispatch(postTips(JSON.parse(posts)));
      }
    } catch (error) {
      if (__DEV__) {
        console.log('error', error);
      }
      dispatch(postTips([]));
    }
  };
}
