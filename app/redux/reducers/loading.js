import { IS_LOADING } from '../actions/types';

export function loading(state = { isLoading: false }, action) {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}
