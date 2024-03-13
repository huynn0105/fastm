import {
  IS_GETTING_USER_APP_LIGHT_LIST,
  USER_APP_LIGHT_LIST,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';

const _ = require('lodash');

export function isGettingUserAppLightList(isProcessing) {
  return {
    type: IS_GETTING_USER_APP_LIGHT_LIST,
    payload: isProcessing,
  };
}

export function userAppLightList(apps) {
  return {
    type: USER_APP_LIGHT_LIST,
    payload: apps,
  };
}

export function requestUserAppLightList() {
  return (dispatch, getState) => {
    dispatch(isGettingUserAppLightList(true));
    return DigitelClient.getUserAppLightList()
      .then(items => {
        dispatch(isGettingUserAppLightList(false));

        if (!_.isEqual(getState().userAppLightList, items)) {
          dispatch(userAppLightList(items));
        }
      })
      .catch(response => {
        dispatch(isGettingUserAppLightList(false));
      });
  };
}
