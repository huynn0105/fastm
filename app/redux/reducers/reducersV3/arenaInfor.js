import {SET_ARENA_INFOR} from '../../actions/actionsV3/actionTypes';

const initialState = {
  data: {},
};

export function arenaInfor(state = initialState, action) {
  switch (action.type) {
    case SET_ARENA_INFOR: {
      const { payload } = action;
      return {
        ...state,
        data: payload,
      };
    }
    default:
      return state;
  }
};