
import FirebaseFunctions from '../../network/FirebaseFunctions';
import FirebaseDatabase from '../../network/FirebaseDatabase';

import {
  BLOCKED_USER_LIST,
  BLOCKED_THREAD_LIST,
  IS_GETTING_BLOCKED_USER_LIST,
} from '../actions/types';


export function isGetBlockedUsersProcessing(isProcessing) {
  return {
    type: IS_GETTING_BLOCKED_USER_LIST,
    payload: isProcessing,
  };
}

export function blockedUserList(users) {
  return {
    type: BLOCKED_USER_LIST,
    payload: users,
  };
}

export function blockedThreads(threads) {
  return {
    type: BLOCKED_THREAD_LIST,
    payload: threads,
  };
}

export function requestBlockedUsersList() {
  return (dispatch) => {
    const asyncTask = async () => {
      dispatch(isGetBlockedUsersProcessing(true));
      const token = await FirebaseDatabase.firebaseToken();
      FirebaseFunctions.getBlockedUsers(token)
        .then(items => {
          dispatch(isGetBlockedUsersProcessing(false));
          dispatch(blockedUserList(items));
        })
        .catch((error) => {
          dispatch(isGetBlockedUsersProcessing(false));
        });
    };
    return asyncTask();
  };
}
