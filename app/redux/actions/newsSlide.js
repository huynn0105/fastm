import DigitelClient from 'app/network/DigitelClient';

import {
  IS_GETTING_NEWS_SLIDE_LIST,
  NEWS_SLIDE_LIST,
} from '../actions/types';

export function isGettingNewsSlideList(bool) {
  return {
    type: IS_GETTING_NEWS_SLIDE_LIST,
    payload: bool,
  };
}

export function newsSlideList(object) {
  return {
    type: NEWS_SLIDE_LIST,
    payload: object,
  };
}

export function getNewsSlideList() {
  return (dispath, getState) => {
    dispath(isGettingNewsSlideList(true));
    DigitelClient.getNewsSlideList()
      .then(items => {
        dispath(isGettingNewsSlideList(false));
          dispath(newsSlideList(items));
      })
      .catch(response => {
        dispath(isGettingNewsSlideList(false));
      });
  };
}
