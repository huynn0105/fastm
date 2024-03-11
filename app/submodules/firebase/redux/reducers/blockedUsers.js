import {
  BLOCKED_USER_LIST,
  BLOCKED_THREAD_LIST,
  IS_GETTING_BLOCKED_USER_LIST,
} from '../actions/types';

export function isGetBlockedUsersProcessing(state = false, action) {
  return action.type === IS_GETTING_BLOCKED_USER_LIST ? action.payload : state;
}

export function blockedUsers(state = [], action) {
  return action.type === BLOCKED_USER_LIST ? action.payload : state;
}

export function blockedThreads(state = [], action) {
  return action.type === BLOCKED_THREAD_LIST ? action.payload : state;
}

