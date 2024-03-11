import {
  CONTEST_ITEM,
} from '../actions/types';

export function contestItem(state = {}, action) {
  return action.type === CONTEST_ITEM ? action.payload : state;
}
