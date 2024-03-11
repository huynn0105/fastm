import {
  IS_GET_LOGIN_ACTIVITY_PROCESSING,
  GET_LOGIN_ACTIVITY_RESPONSE,
  LOGIN_ACTIVITY_RESPONSE,
  APPEND_LOGIN_ACTIVITY,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';

export function isLoginActivitiesProcessing(isProcessing) {
  return {
    type: IS_GET_LOGIN_ACTIVITY_PROCESSING,
    payload: isProcessing,
  };
}

export function getLoginActivitiesResponse(object) {
  return {
    type: GET_LOGIN_ACTIVITY_RESPONSE,
    payload: object,
  };
}

export function loginActivities(object) {
  return {
    type: LOGIN_ACTIVITY_RESPONSE,
    payload: object,
  };
}

export function appendLoginActivities(object) {
  return {
    type: APPEND_LOGIN_ACTIVITY,
    payload: object,
  };
}

export function requestLoginActivities(page = 1, perPage = 10) {
  return (dispath, getState) => {
    const userId = getState().myUser.uid;
    dispath(getLoginActivitiesResponse({}));
    dispath(isLoginActivitiesProcessing(true));
    DigitelClient.getLoginActitivies(userId, page, perPage)
      .then(items => {
        dispath(isLoginActivitiesProcessing(false));
        dispath(getLoginActivitiesResponse({
          status: true, message: 'OK', canLoadMore: items.length > 0,
        }));
        if (page === 1) {
          dispath(loginActivities(items));
        }
        else {
          dispath(appendLoginActivities(items));
        }
      })
      .catch(response => {
        dispath(isLoginActivitiesProcessing(false));
        dispath(getLoginActivitiesResponse(response));
      });
  };
}
