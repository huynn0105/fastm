import { SET_USER_META_DATA, UPDATE_USER_META } from './actionTypes';

import DigitelClient from '../../../network/DigitelClient';
import UserMetaSchema from '../../../models/userMeta';

import { setLoadingUserMeta, setLoadingGetUMeta } from './commonLoading';
import { showDevAlert } from '../../../utils/UIUtils';

export function setUserMetaData(payload) {
  return {
    type: SET_USER_META_DATA,
    payload,
  };
}
export function updateUserMetaData(payload = {}) {
  return {
    type: UPDATE_USER_META,
    payload,
  };
}

export function getUserMetaData(onSuccess, onError) {
  return (dispatch, getState) => {
    dispatch(setLoadingGetUMeta(true));
    DigitelClient.getUserMetaData()
      .then((payload) => {
        dispatch(setLoadingGetUMeta(false));
        dispatch(setUserMetaData(UserMetaSchema.objectFromJSON(payload)));
        if (onSuccess) {
          onSuccess(UserMetaSchema.objectFromJSON(payload));
        }
      })
      .catch((response) => {
        if (onError) {
          onError(response);
        }
        dispatch(setLoadingGetUMeta(false));
        //
      });
  };
}

export function updateUserMetaStep(payload, callback, isCleanEmpty = true) {
  const parseData = UserMetaSchema.parseDataBeforeUpdate(payload, isCleanEmpty);
  return (dispatch, getState) => {
    dispatch(setLoadingUserMeta(true));
    DigitelClient.updateUserMetaData(parseData)
      .then((response) => {
        if (response.status) {
          dispatch(setUserMetaData(UserMetaSchema.objectFromJSON(response.data)));
        }
        if (callback) {
          callback(response);
        }
        dispatch(setLoadingUserMeta(false));
      })
      .catch((error) => {
        if (callback) {
          callback(error);
        }
        dispatch(setLoadingUserMeta(false));
        //
      });
  };
}

export function updateCMNDUser(payload, callback) {
  const parseData = UserMetaSchema.parseDataBeforeUpdate(payload);
  return (dispatch, getState) => {
    dispatch(setLoadingUserMeta(true));
    DigitelClient.updateCMND(parseData)
      .then((payload) => {
        if (callback) {
          if (payload.data) {
            payload.data = UserMetaSchema.objectFromJSON(payload.data);
          }
          callback(payload);
        }
        dispatch(setLoadingUserMeta(false));
      })
      .catch((response) => {
        if (callback) {
          callback(response);
        }
        dispatch(setLoadingUserMeta(false));
        //
      });
  };
}

export function getPresenceStatusUser(userId, callback) {
  return (dispatch) => {
    DigitelClient.getPresenceStatusUser(userId)
      .then((payload) => {
        callback(payload);
      })
      .catch((error) => {});
  };
}

export function checkLivenessFPT(videoUri, cmndPath, callback) {
  return () => {
    DigitelClient.callLivenessIdentify(videoUri, cmndPath)
      .then((payload) => {
        callback(payload);
      })
      .catch((error) => {
        console.log('meo moe', error);
      });
  };
}

export const checkDuplicateEmail = (email, callback) => {
  return (dispatch) => {
    DigitelClient.checkDuplicateEmail(email)
      .then((payload) => {
        callback(payload);
      })
      .catch((error) => {});
  };
};
