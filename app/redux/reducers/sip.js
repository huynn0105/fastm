import {
  UPDATE_SIP,
  CREATE_ACC_SIP,
  CALL_SIP,
  TERMINATE_CALL_SIP,
} from '../actions/types';

export function sip(state = {}, action) {
  switch (action.type) {
    case UPDATE_SIP:
      return action.payload;
    case CREATE_ACC_SIP:
      return {
        ...state,
        account: action.payload,
      };
    case CALL_SIP:
      return {
        ...state,
        call: action.payload,
      };
    case TERMINATE_CALL_SIP:
      return {
        ...state,
        call: action.payload,
      };
    default:
      return state;
  }
}
