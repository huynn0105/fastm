/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import DigitelClient from 'app/network/DigitelClient';

import {
  IS_GET_SUBSCRIPTIONS_PROCESSING,
  GET_SUBSCRIPTIONS_RESPONSE,
  SUBSCRIPTIONS,
} from './types';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/subscription.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------

export function isGetSubscriptionsProcessing(bool) {
  return {
    type: IS_GET_SUBSCRIPTIONS_PROCESSING,
    isProcessing: bool,
  };
}

export function getSubscriptionsResponse(object) {
  return {
    type: GET_SUBSCRIPTIONS_RESPONSE,
    response: object,
  };
}

export function subscriptions(object) {
  return {
    type: SUBSCRIPTIONS,
    subscriptions: object,
  };
}

export function getSubscriptions() {
  return (dispatch, getState) => {
    dispatch(getSubscriptionsResponse({}));
    dispatch(isGetSubscriptionsProcessing(true));
    return DigitelClient.getSubscriptions()
      .then(results => {
        dispatch(getSubscriptionsResponse({ status: true, message: 'OK' }));
        // validate results
        const items = results.items ? results.items : [];
        const availableCount = results.availableCount ? results.availableCount : 0;
        const kiNo = results.kiNo ? results.kiNo : 0;

        const resultSubscriptions = { items, availableCount, kiNo };
        if (!_.isEqual(getState().subscriptions, resultSubscriptions)) {
          dispatch(subscriptions(resultSubscriptions));
        }
        setTimeout(() => {
          dispatch(isGetSubscriptionsProcessing(false));
        }, 100);
        return true;
      })
      .catch(response => {
        dispatch(getSubscriptionsResponse(response));
        dispatch(isGetSubscriptionsProcessing(false));
        return Promise.resolve(true);
      });
  };
}
