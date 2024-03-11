/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import {
  IS_FETCH_THREADS_PROCESSING,
  IS_THREADS_CAN_LOAD_MORE,
  ALL_THREADS,
  OPENING_THREADS,
  UPDATE_TYPING_THREAD,
} from '../actions/types';

export function isFetchThreadsProcessing(state = false, action) {
  switch (action.type) {
    case IS_FETCH_THREADS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function isThreadsCanLoadMore(state = false, action) {
  switch (action.type) {
    case IS_THREADS_CAN_LOAD_MORE:
      return action.isThreadsCanLoadMore;
    default:
      return state;
  }
}

export function allThreads(state = [], action) {
  switch (action.type) {
    case ALL_THREADS:
      return action.threads;
    default:
      return state;
  }
}

export function openingThread(state = false, action) {
  switch (action.type) {
    case OPENING_THREADS:
      return action.payload;
    default:
      return state;
  }
}

export function typingThreads(state = {}, action) {
  const updatedThread = {};
  switch (action.type) {
    case UPDATE_TYPING_THREAD:
      updatedThread[action.payload.uid] = action.payload;
      return { ...state, ...updatedThread };
    default:
      return state;
  }
}
