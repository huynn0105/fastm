/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import { PENDING_OPEN_DEEP_LINK, INTERNET_STATE_CHANGE, SYSTEM_AVAILABLE } from './types';

import DigitelClient from '../../network/DigitelClient';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/app.js';
/* eslint-enable */

// --------------------------------------------------

export function internet(connected) {
  return {
    type: INTERNET_STATE_CHANGE,
    payload: connected,
  };
}

export const systemStatus = (status) => ({
  type: SYSTEM_AVAILABLE,
  payload: status,
});

// --------------------------------------------------

export function pendingOpenDeepLink(path, params) {
  return {
    type: PENDING_OPEN_DEEP_LINK,
    deepLink: {
      path,
      params,
      id: Math.random(),
    },
  };
}

export function internetState(connected) {
  return (dispatch) => {
    dispatch(internet(connected));
  };
}

let isCheckingSystemStatus = false;
export const checkSystemStatus = () => (dispatch) => {
  const canChecking = () => isCheckingSystemStatus === false;

  const startChecking = () => {
    isCheckingSystemStatus = true;
  };

  const finishChecking = () => {
    setTimeout(() => {
      isCheckingSystemStatus = false;
    }, 4000);
  };

  if (canChecking()) {
    startChecking();
    DigitelClient.checkSystemStatus()
      .then((result) => {
        if (result) {
          dispatch(systemStatus(result));
        }
        finishChecking();
      })
      .catch(() => {
        finishChecking();
      });
  }
};
