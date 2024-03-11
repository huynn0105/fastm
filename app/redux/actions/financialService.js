import { FETCHING_FINANCIAL_SERVICES, FINANCIAL_SERVICES } from './types';
import DigitelClient from '../../network/DigitelClient';

// ------------------------------------------------------------
// Action Object Creators
// ------------------------------------------------------------
export function fetchingFinancialServices(fetching) {
  return {
    type: FETCHING_FINANCIAL_SERVICES,
    payload: fetching
  };
}

export function updateFinancialServices(finServices) {
  return {
    type: FINANCIAL_SERVICES,
    payload: finServices
  };
}

// ------------------------------------------------------------
// Async Action Functions
// ------------------------------------------------------------
export function fetchFinancialServices() {
  const doneFetching = (dispatch, items) => {
    dispatch(updateFinancialServices(items));
    dispatch(fetchingFinancialServices(false));
  };

  const addComingItem = items => {
    return [...items];
  };

  return dispatch => {
    dispatch(fetchingFinancialServices(true));
    DigitelClient.mfFetchFinancialServices()
      .then(items => {
        doneFetching(dispatch, addComingItem(items));
      })
      .catch(error => doneFetching(dispatch, []));
  };
}
