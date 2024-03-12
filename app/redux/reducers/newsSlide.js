import {
  IS_GETTING_NEWS_SLIDE_LIST,
  NEWS_SLIDE_LIST,
} from '../actions/types';

export function isGettingNewsSlideList(state = false, action) {
  return action.type === IS_GETTING_NEWS_SLIDE_LIST ? action.payload : state;
}

export function newsSlideList(state = {}, action) {
  switch (action.type) {
    case NEWS_SLIDE_LIST:
      return action.payload;
    default:
      return state;
  }
}
