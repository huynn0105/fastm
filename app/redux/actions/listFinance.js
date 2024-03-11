import { LIST_FINANCE } from './types';
import DigitelClient from '../../network/DigitelClient';
import { AsyncStorageKeys } from '../../constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function setListFinance(data) {
  return {
    type: LIST_FINANCE,
    payload: data,
  };
}

export function fetchListFinance() {
  return async (dispatch) => {
    try {
      const posts = await DigitelClient.fetchListFinance();
      dispatch(setListFinance(posts));
      await AsyncStorage.setItem(AsyncStorageKeys.LIST_FINANCE, JSON.stringify(posts));
    } catch (error) {
      dispatch(setListFinance([]));
    }
  };
}

export function fetchListFinanceFromLocal() {
  return async (dispatch) => {
    try {
      const posts = await AsyncStorage.getItem(AsyncStorageKeys.LIST_FINANCE);
      if (posts) {
        dispatch(setListFinance(JSON.parse(posts)));
      }
    } catch (error) {
      if (__DEV__) {
        console.log('error', error);
      }
    }
  };
}
