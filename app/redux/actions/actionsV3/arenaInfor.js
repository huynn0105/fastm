import { SET_ARENA_INFOR } from './actionTypes';
import DigitelClient from '../../../network/DigitelClient';

function setArenaInfor(payload) {
  return {
    type: SET_ARENA_INFOR,
    payload,
  };
}

export function getArenaInfor() {
  return (dispatch, getState) => {
    DigitelClient.getArenaInfor()
      .then((payload) => {
        dispatch(setArenaInfor(payload));
      })
      .catch((response) => {});
  };
}
