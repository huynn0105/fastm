import {
  SET_LIST_BANK_BRANCHES,
  SET_LIST_BANKS,
  SET_LIST_MY_BANKING,
  SET_KBANK_DATA,
  SET_BIDV_DATA,
} from './actionTypes';
import { setLoadingAddBanking } from './commonLoading';
import DigitelClient from '../../../network/DigitelClient';
import { Alert } from 'react-native';

function setBanks(payload) {
  return {
    type: SET_LIST_BANKS,
    payload,
  };
}

function setBankBranches(payload) {
  return {
    type: SET_LIST_BANK_BRANCHES,
    payload,
  };
}

function setListMyBanking(payload) {
  return {
    type: SET_LIST_MY_BANKING,
    payload,
  };
}

export function dispatchGetListBanks() {
  return (dispatch, getState) => {
    DigitelClient.getListBanks()
      .then((payload) => {
        dispatch(setBanks(payload));
      })
      .catch((response) => {});
  };
}

export function dispatchGetListBankBranches() {
  return (dispatch, getState) => {
    DigitelClient.getListBankBranches()
      .then((payload) => {
        dispatch(setBankBranches(payload));
      })
      .catch((response) => {});
  };
}

export function dispatchGetListMyBank(callback) {
  return (dispatch, getState) => {
    DigitelClient.getListMyBank()
      .then((payload) => {
        dispatch(setListMyBanking(payload));
        callback?.(true);
      })
      .catch((response) => {
        callback?.(false);
      });
  };
}

export function dispatchAddMyBanking(payload, callBack) {
  return (dispatch, getState) => {
    dispatch(setLoadingAddBanking(true));
    DigitelClient.addMyBank(payload)
      .then((response) => {
        if (callBack) {
          callBack(response);
        }
        if (response?.status) {
          dispatch(dispatchGetListMyBank());
        }
        dispatch(setLoadingAddBanking(false));
      })
      .catch((error) => {
        dispatch(setLoadingAddBanking(false));
      });
  };
}

export function dispatchAddMomoWallet(callback) {
  return (dispatch) => {
    DigitelClient.addMomoWallet()
      .then((response) => {
        if (callback) {
          callback(response);
        }
      })
      .catch((error) => {
        console.log('error la gi', error);
      });
  };
}

export const dispatchCancelMomoWallet = (callback) => {
  return () => {
    DigitelClient.cancelMomoWallet()
      .then((response) => {
        if (callback) {
          callback(response);
        }
      })
      .catch((error) => {
        if (__DEV__) {
          console.log('34', error);
        }
      });
  };
};

export const setDefaultBank = (bankID, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.setDefaultBank(bankID);
    if (res?.data?.status) {
      const listBank = getState().banking.listMyBanking;
      const newListBank = listBank?.map((item) => {
        if (item?.banking_id === bankID) {
          return {
            ...item,
            default: '1',
          };
        } else if (item?.default === '1') {
          return {
            ...item,
            default: '0',
          };
        } else {
          return item;
        }
      });
      dispatch(setListMyBanking(newListBank));
      callback(true);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};

export const deleteBank = (bankID, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.deleteBank(bankID);
    if (res?.data?.status) {
      const listBank = getState().banking.listMyBanking;
      const newListBank = listBank?.filter((item) => item?.banking_id !== bankID);
      dispatch(setListMyBanking(newListBank));
      dispatch(dispatchGetListMyBank());
      callback(true);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};

export const getInfoWithdrawalMoney = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getInfoWithdrawalMoney();
    console.log('aaa-36', res);
    if (res?.data?.status) {
      callback(true, res?.data?.data);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};

export const checkWithdrawalMoney = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.checkWithdrawalMoney();
    console.log('aaa-37', res);
    callback(res?.data?.allow_withdrawal, res?.data?.errors);
  } catch (err) {
    callback(false, err?.message);
  }
};
export const sendOTPWithdrawMoney =
  (phone, callback, isRetry, type) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.sendOTPWithdrawMoney(phone, isRetry, type);
      console.log('aaa-38', res);
      if (res?.data?.status) {
        callback(true, res?.data);
      } else {
        callback(false, res?.data?.message);
      }
    } catch (err) {
      callback(false, err?.message);
    }
  };
export const withdrawMoney =
  (phone, otp, bankId, money, location, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.withdrawMoney(phone, otp, bankId, money, location);
      console.log('aaa-39', res);
      callback(res?.data?.status, res?.data?.message);
    } catch (err) {
      callback(false, err?.message);
    }
  };
export const getWithdrawMoneyHistory =
  (filter, page, month, year, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getWithdrawMoneyHistory(filter, page, month, year);
      console.log('aaa-30:', res.request.responseURL);
      if (res?.data?.status) {
        callback(
          true,
          res?.data?.data?.list,
          res?.data?.data?.load_more,
          res?.data?.data?.tax_holding,
        );
      } else {
        callback(false, res?.data?.message);
      }
    } catch (err) {
      callback(false, err?.message);
    }
  };
export const getStatisticMoney = (month, year, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getStatisticMoney(month, year);
    console.log('aaa-28:', res);
    if (res?.data?.status) {
      callback(true, res?.data?.data);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};

export const getKBankData = (month, year, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getKBankData();
    if (res?.data?.status) {
      dispatch({ type: SET_KBANK_DATA, payload: res?.data?.data?.kbank });
      callback(true, res?.data?.data?.kbank);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};

export const getBIDVData = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getBIDVData();
    if (res?.data?.status) {
      dispatch({ type: SET_BIDV_DATA, payload: res?.data?.data?.bidv });
      callback(true, res?.data?.data?.kbank);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};

export const getUserBIDVData = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getUserBIDVData();
    if (res?.data?.status) {
      callback(true, res?.data?.data);
    } else {
      callback(false, res?.data?.message);
    }
  } catch (err) {
    callback(false, err?.message);
  }
};
