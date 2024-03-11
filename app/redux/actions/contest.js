import {
  CONTEST_ITEM,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';

const _ = require('lodash');

export function contestItem(contests) {
  return {
    type: CONTEST_ITEM,
    payload: contests,
  };
}

export function getContestItem() {
  return (dispatch, getState) => {
    DigitelClient.getContestItem()
      .then(item => {
        if (!_.isEqual(getState().contestItem, item)) {
          dispatch(contestItem(item));
        }
      })
      .catch(() => {
      });
  };
}
