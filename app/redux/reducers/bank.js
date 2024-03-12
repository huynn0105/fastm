import {
  IS_GET_USER_BANK_LIST,
  USER_BANK_LIST_RESPONSE,
  WITHDRAW_INFOS,
  WITHDRAW_TERM
} from '../actions/types';

export function isGetUserBankList(state = false, action) {
  return action.type === IS_GET_USER_BANK_LIST ? action.payload : state;
}

export function userBankList(state = [], action) {
  return action.type === USER_BANK_LIST_RESPONSE ? action.payload : state;
}

export const withdrawInfos = (state = [], action) =>
  action.type === WITHDRAW_INFOS ? action.payload : state;

export const withdrawTerm = (state = '', action) =>
  action.type === WITHDRAW_TERM ? action.payload : state;
