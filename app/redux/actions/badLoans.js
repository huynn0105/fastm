import moment from 'moment';
import { BadLoans } from '../../models';

import {
  IS_GETTING_USER_BAD_LOAN,
  USER_BAD_LOAN,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';

const _ = require('lodash');

export function isGettingBadLoans(isProcessing) {
  return {
    type: IS_GETTING_USER_BAD_LOAN,
    payload: isProcessing,
  };
}

export function badLoans(loans) {
  return {
    type: USER_BAD_LOAN,
    payload: loans,
  };
}

export function requestBadLoans(kiNo) {
  return (dispatch, getState) => {
    dispatch(isGettingBadLoans(true));
    const today = moment().format('YYYY-MM-DD');
    DigitelClient.getBadLoans(today, kiNo)
      .then(item => {
        if (!_.isEqual(getState().badLoans, item)) {
          dispatch(badLoans(item));
        }
        dispatch(isGettingBadLoans(false));
      })
      .catch(response => {
        dispatch(isGettingBadLoans(false));
        // dispatch(badLoans(BadLoans.fakeData()));
      });
  };
}