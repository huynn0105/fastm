import {
  DEL_MOD,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';

const _ = require('lodash');

export function delMod(item) {
  return {
    type: DEL_MOD,
    payload: item,
  };
}

export function fetchDelMod() {
  return (dispatch, getState) => {
    DigitelClient.fetchDelMod()
      .then(item => {
        if (!_.isEqual(getState().delMod, item)) {
          dispatch(delMod(item));
        }
      })
      .catch(() => {
        dispatch(delMod({}));
      });
  };
}