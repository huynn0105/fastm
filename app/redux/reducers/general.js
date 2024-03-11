import {
    IS_GET_BANKS_PROCESSING,
    GET_BANKS_RESPONSE,
    IS_GET_BANK_BRANCHES_PROCESSING,
    GET_BANKS_BRANCHES_RESPONSE,
    UPDATE_APP_INFO,
    INVITATION
} from '../actions/types';

import { AppInfoDefault } from '../../constants/configs';

// --------------------------------------------------

export function isGetBanksProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_BANKS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getBanksResponse(state = {}, action) {
  switch (action.type) {
    case GET_BANKS_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isGetBankBranchesProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_BANK_BRANCHES_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getBankBranchesResponse(state = {}, action) {
  switch (action.type) {
    case GET_BANKS_BRANCHES_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------
// APP INFO

export const appInfo = (state = AppInfoDefault, action) => {
  switch (action.type) {
    case UPDATE_APP_INFO:
      return action.payload.appInfo;
    default:
      return state;
  }
};


export const invitationInfo = (state = {}, action) => {
  return action.type === INVITATION ? action.payload : state;
};
