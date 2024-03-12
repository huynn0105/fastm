import {
  DEL_MOD,
} from '../actions/types';

export function delMod(state = null, action) {
  return action.type === DEL_MOD ? action.payload : state;
}
