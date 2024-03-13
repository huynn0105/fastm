/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import DigitelClient from 'app/network/DigitelClient';
import DatabaseManager from 'app/manager/DatabaseManager';
import { News } from 'app/models';

import {
  IS_GET_NEWS_PROCESSING,
  GET_NEWS_RESPONSE,
  NOTICE_NEWS,
  APPEND_NOTICE_NEWS,
  COUNT_UNREAD_NOTICE_NEWS,
} from './types';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/news.js';
/* eslint-enable */

// --------------------------------------------------

export function isGetNewsProcessing(bool) {
  return {
    type: IS_GET_NEWS_PROCESSING,
    isProcessing: bool,
  };
}

export function getNewsResponse(object) {
  return {
    type: GET_NEWS_RESPONSE,
    response: object,
  };
}

export function noticeNews(object) {
  return {
    type: NOTICE_NEWS,
    noticeNews: object,
  };
}

export function appendNoticeNews(object) {
  return {
    type: APPEND_NOTICE_NEWS,
    noticeNews: object,
  };
}

export function getNoticeNews(page = 1, perPage = 20) {
  return (dispatch, getState) => {
    // allow only 1 notices news run at a time
    if (getState().isGetNewsProcessing) {
      return Promise.resolve(true);
    }
    // request
    dispatch(getNewsResponse({}));
    dispatch(isGetNewsProcessing(true));
    return DigitelClient.mfGetNews(page, perPage)
      .then((items) => {
        // update state
        dispatch(isGetNewsProcessing(false));
        dispatch(
          getNewsResponse({
            status: true,
            message: 'OK',
            category: 1,
            canLoadMore: items.length > 0,
          }),
        );
        // clearn old-data if page is 1
        if (page === 1) {
          DatabaseManager.shared().deleteAllNews();
        }
        // insert db
        const dbItems = DatabaseManager.shared().createObjects('News', items);
        if (page === 1) {
          dispatch(noticeNews(dbItems));
        } else {
          dispatch(appendNoticeNews(dbItems));
        }
        // update unread
        setTimeout(() => {
          dispatch(countUnReadNoticeNews());
        }, 500);
        // finish
        return true;
      })
      .catch((response) => {
        dispatch(isGetNewsProcessing(false));
        dispatch(getNewsResponse({ ...response, category: 1 }));
        // finish
        return Promise.resolve(true);
      });
  };
}

export function countUnReadNoticeNews() {
  const count = DatabaseManager.shared().countUnReadNewsInCategory(News.CategoryIDs.NOTICE);
  return {
    type: COUNT_UNREAD_NOTICE_NEWS,
    count,
  };
}

export function readNews(news) {
  return (dispatch) => {
    DatabaseManager.shared().readNews(news);
    if (news.categoryID === News.CategoryIDs.NOTICE) {
      dispatch(countUnReadNoticeNews());
    }
  };
}

export function readAllNoticeNews() {
  return (dispatch) => {
    DatabaseManager.shared().readAllNewsInCategory(News.CategoryIDs.NOTICE);
    dispatch(countUnReadNoticeNews());
  };
}
