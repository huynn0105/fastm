import {
  FINANCIAL_SERVICES,
  FETCHING_FINANCIAL_SERVICES,
} from '../actions/types';

export function financialServiceItems(state = [], action) {
  return action.type === FINANCIAL_SERVICES ? action.payload : state;
}

export function fetchingFinancialServiceItems(state = [], action) {
  return action.type === FETCHING_FINANCIAL_SERVICES ? action.payload : state;
}
