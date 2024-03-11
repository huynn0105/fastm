import { DPD_DATA } from '../actions/types';

export function DPD(state = {}, action) {
  return action.type === DPD_DATA ? action.payload : state;
}
