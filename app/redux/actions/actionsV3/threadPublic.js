import { SET_THREAD_PUBLIC } from './actionTypes';
import DigitelClient from '../../../network/DigitelClient';
  
function setThreadPublic(payload) {
  return {
    type: SET_THREAD_PUBLIC,
    payload,
  };
}

export function dispatchGetThreadPublic() {
  return (dispatch, getState) => {
    DigitelClient.getThreadPublic()
      .then(payload => {
          dispatch(setThreadPublic(payload));
      })
      .catch(response => {
      });
  };
}