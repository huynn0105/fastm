import {
  IS_GETTING_USER_APP_LIGHT_LIST,
  USER_APP_LIGHT_LIST,
} from '../actions/types';

export function isGettingUserAppLightList(state = false, action) {
  return action.type === IS_GETTING_USER_APP_LIGHT_LIST ? action.payload : state;
}

export function userAppLightList(state = [], action) {
  return action.type === USER_APP_LIGHT_LIST ? action.payload : state;
}
