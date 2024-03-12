/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import {
  PENDING_OPEN_DEEP_LINK,
  INTERNET_STATE_CHANGE,
  SYSTEM_AVAILABLE,
} from '../actions/types';

// --------------------------------------------------

export function pendingOpenDeepLink(state = {}, action) {
  switch (action.type) {
    case PENDING_OPEN_DEEP_LINK:
      return action.deepLink;
    default:
      return state;
  }
}

export function internetState(state = true, action) {
  return action.type === INTERNET_STATE_CHANGE ? action.payload : state;
}

export const systemStatus =
  (state = {
    available: true,
    status: 0,
    freeze_page: '',
  }, action) => (
      action.type === SYSTEM_AVAILABLE ? {
        ...action.payload,
        available: checkStatusIsAvailable(action.payload.status),
      }
        : state
    );

const checkStatusIsAvailable = (status) => (status === 0);
