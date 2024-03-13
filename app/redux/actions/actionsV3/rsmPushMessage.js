import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../../constants/keys';

export function onPressRSMMessage(idNotify, callback) {
  return (dispatch, getState) => {
    AsyncStorage.getItem(AsyncStorageKeys.LIST_ID_RSM)
      .then((value) => {
        const listIdRSMSeen = value ? JSON.parse(value) : [];
        if (!listIdRSMSeen.includes(idNotify)) {
          AsyncStorage.setItem(
            AsyncStorageKeys.LIST_ID_RSM,
            JSON.stringify([...listIdRSMSeen, idNotify]),
          )
            .then(() => {
              callback?.(true);
            })
            .catch((error) => {
              callback?.(false);
            });
        } else {
          callback?.(false);
        }
      })
      .catch((error) => {
        callback?.(false);
      });
  };
}

export function clearListRSMPushMessage() {
  return (dispatch) => {
    AsyncStorage.setItem(AsyncStorageKeys.LIST_ID_RSM, JSON.stringify([]));
  };
}
