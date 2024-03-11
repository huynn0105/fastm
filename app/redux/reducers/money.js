import {
  IS_GET_MONEY_HISTORY_PROCESSING,
  GET_MONEY_HISTORY_RESPONSE,
  MONEY_HISTORY,
  APPEND_MONEY_HISTORY,
} from '../actions/types';

export function isGetMoneyHistoryProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_MONEY_HISTORY_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getMoneyHistoryResponse(state = {}, action) {
  switch (action.type) {
    case GET_MONEY_HISTORY_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function moneyHistory(state = [], action) {
  switch (action.type) {
    case MONEY_HISTORY:
      return action.history;
    case APPEND_MONEY_HISTORY:
      return state.concat(action.history);
    default:
      return state;
  }
}
