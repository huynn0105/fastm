import { FETCHING_GLOBAL_CARE_URL_DATA, GLOBAL_CARE_URL_DATA } from '../actions/types';

export function isFetchingGlobalCareURLData(state = false, action) {
  return action.type === FETCHING_GLOBAL_CARE_URL_DATA ? action.payload : state;
}

export function globalCareURLData(state = {}, action) {
  return action.type === GLOBAL_CARE_URL_DATA ? action.payload : state;
}
