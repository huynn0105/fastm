/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import DigitelClient from 'app/network/DigitelClient';

import {
  IS_GET_GIFTS_PROCESSING,
  GET_GIFTS_RESPONSE,
  GIFTS,
  IS_GET_POINTS_HISTORY_PROCESSING,
  GET_POINTS_HISTORY_RESPONSE,
  POINTS_HISTORY,
  APPEND_POINTS_HISTORY,
  IS_REDEEM_GIFT_PROCESSING,
  REDEEM_GIFT_RESPONSE,
} from './types';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/gift.js';
/* eslint-enable */

// GIFT
// --------------------------------------------------

export function isGetGiftsProcessing(bool) {
  return {
    type: IS_GET_GIFTS_PROCESSING,
    isProcessing: bool,
  };
}

export function getGiftsResponse(object) {
  return {
    type: GET_GIFTS_RESPONSE,
    response: object,
  };
}

export function gifts(object) {
  return {
    type: GIFTS,
    gifts: object,
  };
}

export function getGifts() {
  return (dispatch) => {
    dispatch(getGiftsResponse({}));
    dispatch(isGetGiftsProcessing(true));
    DigitelClient.getGifts()
      .then(items => {
        dispatch(isGetGiftsProcessing(false));
        dispatch(getGiftsResponse({ status: true, message: 'OK' }));
        dispatch(gifts(items));
      })
      .catch(response => {
        dispatch(isGetGiftsProcessing(false));
        dispatch(getGiftsResponse(response));
      });
  };
}

// POINTS_HISTORY
// --------------------------------------------------

export function isGetPointsHistoryProcessing(bool) {
  return {
    type: IS_GET_POINTS_HISTORY_PROCESSING,
    isProcessing: bool,
  };
}

export function getPointsHistoryResponse(object) {
  return {
    type: GET_POINTS_HISTORY_RESPONSE,
    response: object,
  };
}

export function pointsHistory(object) {
  return {
    type: POINTS_HISTORY,
    history: object,
  };
}

export function appendPointsHistory(object) {
  return {
    type: APPEND_POINTS_HISTORY,
    history: object,
  };
}

export function getPointsHistory(fromDate, toDate, page = 1, perPage = 20) {
  return (dispatch) => {
    dispatch(getPointsHistoryResponse({}));
    dispatch(isGetPointsHistoryProcessing(true));
    DigitelClient.getPointsHistory(fromDate, toDate, page, perPage)
      .then(items => {
        // update state
        dispatch(isGetPointsHistoryProcessing(false));
        dispatch(getPointsHistoryResponse({
          status: true, message: 'OK', canLoadMore: items.length > 0,
        }));
        if (page === 1) {
          dispatch(pointsHistory(items));
        } else {
          dispatch(appendPointsHistory(items));
        }
      })
      .catch(response => {
        dispatch(isGetPointsHistoryProcessing(false));
        dispatch(getPointsHistoryResponse(response));
      });
  };
}

// REDEEM
// --------------------------------------------------

export function isRedeemGiftProcessing(bool) {
  return {
    type: IS_REDEEM_GIFT_PROCESSING,
    isProcessing: bool,
  };
}

export function redeemGiftResponse(object) {
  return {
    type: REDEEM_GIFT_RESPONSE,
    response: object,
  };
}

export function redeemGift(giftID) {
  return (dispatch) => {
    dispatch(redeemGiftResponse({}));
    dispatch(isRedeemGiftProcessing(true));
    DigitelClient.redeemGift(giftID)
      .then((response) => {
        dispatch(isRedeemGiftProcessing(false));
        dispatch(redeemGiftResponse(Object.assign({ status: true }, response)));
      })
      .catch(response => {
        dispatch(isRedeemGiftProcessing(false));
        dispatch(redeemGiftResponse(response));
      });
  };
}
