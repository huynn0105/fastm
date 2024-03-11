import {
  IS_GET_NEWS_PROCESSING,
  GET_NEWS_RESPONSE,
  NOTICE_NEWS,
  APPEND_NOTICE_NEWS,
  COUNT_UNREAD_NOTICE_NEWS,
} from '../actions/types';


export function isGetNewsProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_NEWS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getNewsResponse(state = {}, action) {
  switch (action.type) {
    case GET_NEWS_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function noticeNews(state = [], action) {
  switch (action.type) {
    case NOTICE_NEWS:
      return action.noticeNews;
    case APPEND_NOTICE_NEWS:
      return state.concat(action.noticeNews);
    default:
      return state;
  }
}

export function totalUnReadNoticeNews(state = 0, action) {
  switch (action.type) {
    case COUNT_UNREAD_NOTICE_NEWS:
      return action.count;
    default:
      return state;
  }
}
