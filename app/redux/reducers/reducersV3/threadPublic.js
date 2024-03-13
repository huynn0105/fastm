import { SET_THREAD_PUBLIC } from '../../actions/actionsV3/actionTypes';

const initialState = [];

export function threadPublicIds(state = initialState, action) {
  switch (action.type) {
    case SET_THREAD_PUBLIC: {
      const { payload } = action;
      return [...payload];
    }
    default:
      return state;
  }
}
