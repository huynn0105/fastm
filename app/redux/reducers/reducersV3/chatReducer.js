import {
  INCREASE_TOTAL_UNREAD_CHAT,
  SET_TOTAL_UNREAD_CHAT,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  totalUnread: 0,
};

export function chatReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOTAL_UNREAD_CHAT: {
      const { payload } = action;
      return {
        ...state,
        totalUnread: Number(payload) ?? 0,
      };
    }
    case INCREASE_TOTAL_UNREAD_CHAT: {
      return {
        ...state,
        totalUnread: state.totalUnread > 0 ? state.totalUnread + 1 : 0,
      };
    }
    default:
      return state;
  }
}
