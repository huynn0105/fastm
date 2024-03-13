import {
  IS_GETTING_USER_BAD_LOAN,
  USER_BAD_LOAN,
} from '../actions/types';

export function isGettingBadLoans(state = false, action) {
  return action.type === IS_GETTING_USER_BAD_LOAN ? action.payload : state;
}

export function badLoans(state = null, action) {
  return action.type === USER_BAD_LOAN ? action.payload : state;
}
