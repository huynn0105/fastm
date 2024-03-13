import { POST_LIST } from '../actions/types';

export const postList = (state = [], action) =>
  (action.type === POST_LIST ? action.payload : state);
