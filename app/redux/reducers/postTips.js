import { POSTS_TIPS } from '../actions/types';

export const postTips = (state = [], action) =>
  action.type === POSTS_TIPS ? action.payload : state;
