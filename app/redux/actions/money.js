/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import DigitelClient from 'app/network/DigitelClient';

import {
  IS_GET_MONEY_HISTORY_PROCESSING,
  GET_MONEY_HISTORY_RESPONSE,
  MONEY_HISTORY,
  APPEND_MONEY_HISTORY,
} from './types';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/money.js';
/* eslint-enable */

// --------------------------------------------------

export function isGetMoneyHistoryProcessing(bool) {
  return {
    type: IS_GET_MONEY_HISTORY_PROCESSING,
    isProcessing: bool,
  };
}

export function getMoneyHistoryResponse(object) {
  return {
    type: GET_MONEY_HISTORY_RESPONSE,
    response: object,
  };
}

export function moneyHistory(object) {
  return {
    type: MONEY_HISTORY,
    history: object,
  };
}

export function appendMoneyHistory(object) {
  return {
    type: APPEND_MONEY_HISTORY,
    history: object,
  };
}

export function getMoneyHistory(fromDate, toDate, page = 1, perPage = 20) {
  return (dispatch) => {
    dispatch(getMoneyHistoryResponse({}));
    dispatch(isGetMoneyHistoryProcessing(true));
    DigitelClient.getMoneyHistory(fromDate, toDate, page, perPage)
      .then(items => {
        // update state
        dispatch(isGetMoneyHistoryProcessing(false));
        dispatch(getMoneyHistoryResponse({
          status: true, message: 'OK', canLoadMore: items.length > 0,
        }));
        if (page === 1) {
          dispatch(moneyHistory(items));
        } else {
          dispatch(appendMoneyHistory(items));
        }
      })
      .catch(response => {
        dispatch(isGetMoneyHistoryProcessing(false));
        dispatch(getMoneyHistoryResponse(response));
      });
  };
}
