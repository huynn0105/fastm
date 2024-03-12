// @flow

import DigitelClient from 'app/network/DigitelClient';
import { Dispatch } from 'redux';

import {
  Help,
} from 'app/models';

import {
  HELP_EVENT,
} from './types';

export function helpItem(object: Help) {
  return {
    type: HELP_EVENT,
    response: object,
  };
}

export function getHelpItem() {
  return (dispatch: Dispatch) => {
    DigitelClient.getHelpItem()
      .then(item => {
        dispatch(helpItem(item));
      })
      .catch();
  };
}
