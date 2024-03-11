import {
  IS_GET_SUBSCRIPTIONS_PROCESSING,
  GET_SUBSCRIPTIONS_RESPONSE,
  SUBSCRIPTIONS,
} from '../actions/types';

export function isGetSubscriptionsProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_SUBSCRIPTIONS_PROCESSING:
      return action.isProcessing;

    default:
      return state;
  }
}

export function getSubscriptionsResponse(state = {}, action) {
  switch (action.type) {
    case GET_SUBSCRIPTIONS_RESPONSE:
      return action.response;

    default:
      return state;
  }
}

export function subscriptions(state = {
  items: [],
  availableCount: 0,
  kiNo: 0,
}, action) {
  switch (action.type) {
    case SUBSCRIPTIONS:
      return action.subscriptions;

    default:
      return state;
  }
}
