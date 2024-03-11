import FirebaseDatabase from '../../../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../../../submodules/firebase/network/FirebaseFunctions';
import { INCREASE_TOTAL_UNREAD_CHAT, SET_TOTAL_UNREAD_CHAT } from './actionTypes';

export const getTotalUnreadChat = () => async (dispatch, getState) => {
  const systemThreadId = getState()?.appInfo?.systemThreadId;
  try {
    const token = await FirebaseDatabase.firebaseToken();
    const countUnread = await FirebaseFunctions.countChatUnread(token, systemThreadId);

    dispatch({
      type: SET_TOTAL_UNREAD_CHAT,
      payload: countUnread,
    });
  } catch (_) {}
};

export const increaseTotalUnreadChat = () => (dispatch) => {
  dispatch({
    type: INCREASE_TOTAL_UNREAD_CHAT,
  });
};
