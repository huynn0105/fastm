import set from 'lodash/set';

import {
  SET_BIDV_DATA,
  SET_KBANK_DATA,
  SET_LIST_BANKS,
  SET_LIST_BANK_BRANCHES,
  SET_LIST_MY_BANKING,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  data: [],
  listBanks: [],
  listBankBranchs: [],
  listMyBanking: [],
  kbankData: {},
  bidvData: {},
};

const groupByBankName = (payload) => {
  return payload.reduce((accumulator, itemInArray, indexInArray) => {
    if (accumulator) {
      const key = itemInArray?.bankName;
      const value = accumulator[key];
      if (value) {
        set(accumulator, key, value.concat([{ ...itemInArray, value: itemInArray?.branchName }]));
      } else {
        set(accumulator, key, [{ ...itemInArray, value: itemInArray?.branchName }]);
      }

      return accumulator;
    }
  }, {});
};

const preDataBank = (payload) => {
  return payload.map((item) => {
    return { ...item, value: item?.bankName };
  });
};

export function banking(state = initialState, action) {
  switch (action.type) {
    case SET_LIST_BANKS: {
      const { payload } = action;
      return {
        ...state,
        listBanks: preDataBank(payload),
      };
    }
    case SET_LIST_BANK_BRANCHES: {
      const { payload } = action;
      const listBankBranchs = groupByBankName(payload);
      return {
        ...state,
        listBankBranchs,
      };
    }
    case SET_LIST_MY_BANKING: {
      const { payload } = action;
      return {
        ...state,
        listMyBanking: payload,
      };
    }
    case SET_KBANK_DATA: {
      const { payload } = action;
      return {
        ...state,
        kbankData: payload,
      };
    }
    case SET_BIDV_DATA: {
      const { payload } = action;
      return {
        ...state,
        bidvData: payload,
      };
    }
    default:
      return state;
  }
}
