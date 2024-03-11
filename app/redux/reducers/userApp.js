import {
  IS_GETTING_USER_APP_LIST,
  USER_APP_LIST,
} from '../actions/types';

export function isGettingUserAppList(state = false, action) {
  return action.type === IS_GETTING_USER_APP_LIST ? action.payload : state;
}

export function userAppList(state = [], action) {
  return action.type === USER_APP_LIST ? action.payload : state;
}
