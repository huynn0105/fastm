import {
  CHAT_CENTER_STATE,
} from './types';

// --------------------------------------------------

export const CHAT_CENTER_STATES = {
  PENDING_INIT: 'PENDING_INIT',
  INITED: 'INITED',
  PENDING_DE_INIT: 'PENDING_DE_INIT',
  UN_INITED: 'UN_INITED',
};

export function chatCenterState(state) {
  return {
    type: CHAT_CENTER_STATE,
    state,
  };
}

export function initChatCenter() {
  return (dispatch) => {
    dispatch(chatCenterState(CHAT_CENTER_STATES.PENDING_INIT));
  };
}

export function deInitChatCenter() {
  return (dispatch) => {
    dispatch(chatCenterState(CHAT_CENTER_STATES.PENDING_DE_INIT));
  };
}
