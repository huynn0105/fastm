import {
  ACTIVE_TABBAR_EVENT,
} from '../actions/types';


export function activeTabbar(state = true, action) {
  switch (action.type) {
    case ACTIVE_TABBAR_EVENT:
      return action.payload;
    default:
      return state;
  }
}
