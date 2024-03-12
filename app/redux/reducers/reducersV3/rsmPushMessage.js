import {
  ADD_RSM_PUSH_MESSAGE,
  SET_LIST_RSM_PUSH_MESSAGE,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  listIdRSMSeen: [],
};

export function rsmPushMessage(state = initialState, action) {
  switch (action.type) {
    case SET_LIST_RSM_PUSH_MESSAGE: {
      const { payload } = action;

      return {
        ...state,
        listIdRSMSeen: payload,
      };
    }
    case ADD_RSM_PUSH_MESSAGE: {
      return {
        ...state,
        listIdRSMSeen: [...state.listIdRSMSeen, action.payload],
      };
    }
    default:
      return state;
  }
}
