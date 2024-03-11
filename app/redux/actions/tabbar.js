import {
  ACTIVE_TABBAR_EVENT,
} from '../actions/types';

export function isActiveTabbar(active) {
  return {
    type: ACTIVE_TABBAR_EVENT,
    payload: active,
  };
}
