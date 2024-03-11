import { SET_USER_META_DATA, UPDATE_USER_META } from '../../actions/actionsV3/actionTypes';

const initialState = {
  data: {},
};

export function userMetaData(state = initialState, action) {
  switch (action.type) {
    case SET_USER_META_DATA: {
      const { payload } = action;
      return {
        ...state,
        data: payload,
      };
    }
    case UPDATE_USER_META: {
      const { payload } = action;
      return {
        ...state,
        data: { ...state.data, ...payload },
      };
    }
    default:
      return state;
  }
}
