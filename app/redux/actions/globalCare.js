import { FETCHING_GLOBAL_CARE_URL_DATA } from './types';
import DigitelClient from '../../network/DigitelClient';

export function fetchingGlobalCareURLData(isFetching) {
  return {
    type: FETCHING_GLOBAL_CARE_URL_DATA,
    payload: isFetching,
  };
}

export function fetchGlobalCareURLData(paramObject, callback) {
  const { accessToken, fullName, citizenID, phoneNumber } = paramObject;
  const doneFetching = (dispatch, data) => {
    dispatch(fetchingGlobalCareURLData(false));
    callback(data);
  };
  return (dispatch) => {
    dispatch(fetchingGlobalCareURLData(true));
    return DigitelClient.getGlobalCareURL(accessToken, fullName, citizenID, phoneNumber)
      .then((data) => {
        doneFetching(dispatch, data);
      })
      .catch((error) => {
        doneFetching(dispatch, {});
      });
  };
}
