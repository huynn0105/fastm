import {
  IS_GET_GIFTS_PROCESSING,
  GET_GIFTS_RESPONSE,
  GIFTS,
  IS_GET_POINTS_HISTORY_PROCESSING,
  GET_POINTS_HISTORY_RESPONSE,
  POINTS_HISTORY,
  APPEND_POINTS_HISTORY,
  IS_REDEEM_GIFT_PROCESSING,
  REDEEM_GIFT_RESPONSE,
} from '../actions/types';


// GIFTS
// --------------------------------------------------

export function isGetGiftsProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_GIFTS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getGiftsResponse(state = {}, action) {
  switch (action.type) {
    case GET_GIFTS_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function gifts(state = [], action) {
  switch (action.type) {
    case GIFTS:
      return action.gifts;
    default:
      return state;
  }
}

// POINTS_HISTORY
// --------------------------------------------------

export function isGetPointsHistoryProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_POINTS_HISTORY_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getPointsHistoryResponse(state = {}, action) {
  switch (action.type) {
    case GET_POINTS_HISTORY_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function pointsHistory(state = [], action) {
  switch (action.type) {
    case POINTS_HISTORY:
      return action.history;
    case APPEND_POINTS_HISTORY:
      return state.concat(action.history);
    default:
      return state;
  }
}

// REDEEM
// --------------------------------------------------

export function isRedeemGiftProcessing(state = false, action) {
  switch (action.type) {
    case IS_REDEEM_GIFT_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function redeemGiftResponse(state = {}, action) {
  switch (action.type) {
    case REDEEM_GIFT_RESPONSE:
      return action.response;
    default:
      return state;
  }
}
