import {
  IS_GET_USER_BANK_LIST,
  USER_BANK_LIST_RESPONSE,
  WITHDRAW_INFOS,
  WITHDRAW_TERM,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';
import Bank from '../../models/Bank';

export function isGetUserBankListProcessing(isProcessing) {
  return {
    type: IS_GET_USER_BANK_LIST,
    payload: isProcessing,
  };
}

export function userBankList(banks) {
  return {
    type: USER_BANK_LIST_RESPONSE,
    payload: banks,
  };
}

export function requestUserBankList() {
  return (dispatch, getState) => {
    dispatch(isGetUserBankListProcessing(true));
    DigitelClient.getUserBankList()
      .then(items => {
        dispatch(isGetUserBankListProcessing(false));

        dispatch(userBankList(items));
        // dispatch(userBankList(addFakeData()));
      })
      .catch(response => {
        dispatch(isGetUserBankListProcessing(false));
        // dispath(userBankList(response));
      });
  };
}

export const withdrawInfos = (infos) => ({ type: WITHDRAW_INFOS, payload: infos });
export const withdrawTerm = (term) => ({ type: WITHDRAW_TERM, payload: term });

export const fetchWithdrawInfos = () => {
  return (dispatch) => {
    DigitelClient.fetchUserBanks()
      .then(result => {
        dispatch(withdrawInfos(result.infos));
        dispatch(withdrawTerm(result.term));
      });
  };
};

const addFakeData = () => {
  const result = [];
  let bank = new Bank();
  bank.holderName = "le anh tu";
  bank.accountNumber = "123345456567";
  bank.bankName = 'vietocmbank';
  bank.status = 'pending';
  bank.detailURL = 'https://appay-rc.cloudcms.vn/fe_credit/banking/add?accessToken=70b527efd452bfa564bb5aa6915cc286c581f60a';
  result.push(bank);

  let bank2 = new Bank();
  bank2.holderName = "Le Anh Tu";
  bank2.accountNumber = "123345456566";
  bank2.bankName = 'vietocmbank';
  bank2.status = 'failed';
  bank.detailURL = 'vnexpress.vn';
  result.push(bank2);

  let bank3 = new Bank();
  bank3.holderName = "le anh tu";
  bank3.accountNumber = "123345456566";
  bank3.bankName = 'vietocmbank';
  bank3.status = 'success';
  // result.push(bank3);

  return result;
}
