import DigitelClient from '../../network/DigitelClient';
import { DPD_DATA } from './types';

export function dpd(data) {
  return {
    type: DPD_DATA,
    payload: data,
  };
}

export function fetchDPD() {
  return (dispatch) => {
    return DigitelClient.fetchDPD()
      .then((data) => {
        dispatch(dpd(data));
      })
      .catch(() => {
        dispatch(dpd({}));
      });
  };
}
