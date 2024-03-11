/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import {
  IS_GET_BANKS_PROCESSING,
  GET_BANKS_RESPONSE,
  IS_GET_BANK_BRANCHES_PROCESSING,
  GET_BANKS_BRANCHES_RESPONSE,
  UPDATE_APP_INFO,
  INVITATION,
} from './types';
import DigitelClient from '../../network/DigitelClient';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import { logout } from './user';
import { Alert } from 'react-native';
const LOG_TAG = 'actions/general.js';
/* eslint-enable */

// --------------------------------------------------

export function isGetBanksProcessing(bool) {
  return {
    type: IS_GET_BANKS_PROCESSING,
    isProcessing: bool,
  };
}

export function getBanksResponse(object) {
  return {
    type: GET_BANKS_RESPONSE,
    response: object,
  };
}

export function getBanks() {
  return (dispatch) => {
    dispatch(getBanksResponse({}));
    dispatch(isGetBanksProcessing(true));
    DigitelClient.getBanksList()
      .then((response) => {
        dispatch(isGetBanksProcessing(false));
        dispatch(getBanksResponse(response));
      })
      .catch((response) => {
        dispatch(isGetBanksProcessing(false));
        dispatch(getBanksResponse(response));
      });
  };
}

// --------------------------------------------------

export function isGetBankBranchesProcessing(bool) {
  return {
    type: IS_GET_BANK_BRANCHES_PROCESSING,
    isProcessing: bool,
  };
}

export function getBankBranchesResponse(object) {
  return {
    type: GET_BANKS_BRANCHES_RESPONSE,
    response: object,
  };
}

export function getBankBranches(bankName) {
  return (dispatch) => {
    dispatch(getBankBranchesResponse({}));
    dispatch(isGetBankBranchesProcessing(true));
    DigitelClient.getBankBranchesList(bankName)
      .then((response) => {
        dispatch(isGetBankBranchesProcessing(false));
        dispatch(getBankBranchesResponse(response));
      })
      .catch((response) => {
        dispatch(isGetBankBranchesProcessing(false));
        dispatch(getBankBranchesResponse(response));
      });
  };
}

const updateAppInfo = (appInfo) => ({
  type: UPDATE_APP_INFO,
  payload: { appInfo },
});

export const fetchAppInfo = () => {
  return (dispatch) => {
    DigitelClient.getAppInfo()
      .then((appInfo) => {
        dispatch(updateAppInfo(appInfo));
      })
      .catch((error) => {
        if (
          error?.errorCode === 'INVALID_ACCESS_TOKEN' &&
          DigitelClient.userAccessToken.length !== 0
        ) {
          dispatch(logout(false));
        }
      });
  };
};

export const updateInviatation = (data) => ({ type: INVITATION, payload: data });

export const fetchInvitationInfo = () => {
  return (dispatch) => {
    DigitelClient.fetchInvite().then((data) => {
      dispatch(updateInviatation(data));
    });
  };
};
