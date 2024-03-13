// @flow

import { HELP_EVENT } from '../actions/types';

export function helpItem(state: {} = {}, action: { type: string, response: {} }) {
  switch (action.type) {
    case HELP_EVENT:
      return action.response;
    default:
      return state;
  }
}
