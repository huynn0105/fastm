import DigitelClient from '../../../network/DigitelClient';
import { TAB_TYPE } from '../../../screenV3/Notification/Notification.constants';
import FirebaseDatabase from '../../../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../../../submodules/firebase/network/FirebaseFunctions';
import { unreadNotifications } from '../notification';
import { READ_NOTIFICATION } from '../types';
import {
  FLAG_NOTIFICATION,
  INCREASE_TOTAL_UNREAD_NOTIFICATION,
  READ_ALL_NOTIFICATION_NEW,
  READ_NOTIFICATION_NEW,
  SET_FILTER_NOTIFICATION,
  SET_LIST_NOTIFICATION,
  SET_MORE_LIST_NOTIFICATION,
  SET_TOTAL_UNREAD_NOTIFICATION,
  UNREAD_NOTIFICATION_NEW,
} from './actionTypes';

const MAX_LIST_LENGTH = 6;

export const getListNotification =
  (category, type, toDate, isAppend, keyword, callback, isUnread) => async (dispatch) => {
    try {
      const token = await FirebaseDatabase.firebaseToken();

      let notis;

      if (keyword?.trim()?.length) {
        const date = new Date();

        date.setMonth(date.getMonth() - 3);

        notis = await FirebaseFunctions.searchOldNotification(
          token,
          category,
          type,
          keyword?.trim(),
          Math.floor(date.getTime() / 1000),
        );
        callback?.(true, true);
      } else {
        notis = await FirebaseFunctions.getNotification(
          token,
          toDate,
          MAX_LIST_LENGTH,
          category,
          isUnread ? 'unread' : type,
        );

        const outOfData = notis?.length < MAX_LIST_LENGTH;

        callback?.(true, outOfData);
      }
      dispatch({
        type: isAppend ? SET_MORE_LIST_NOTIFICATION : SET_LIST_NOTIFICATION,
        payload: { data: notis, category, type },
      });
    } catch (err) {
      console.log(
        '\u001B[33m ai log ne \u001B[36m -> file: notificationAction.js -> line 54 -> err',
        err,
      );
      callback?.(false, true);
    }
  };

export const readNotification = (uid, category, type, callback) => async (dispatch, getState) => {
  try {
    dispatch({
      type: READ_NOTIFICATION_NEW,
      payload: {
        uid,
        category,
        type,
      },
    });
    const token = await FirebaseDatabase.firebaseToken();
    const isReadSuccess = await FirebaseFunctions.readNotification(token, category, uid, type);

    if (isReadSuccess) {
      const unread =
        category === 'admin'
          ? getState().totalUnReadAdminNotificationsFb - 1
          : getState().totalUnReadSystemNotificationsFb - 1;
      dispatch(unreadNotifications(unread > 0 ? unread : 0, category));
    } else {
      callback?.(false);
      dispatch({
        type: UNREAD_NOTIFICATION_NEW,
        payload: {
          uid,
          category,
          type,
        },
      });
    }
  } catch (err) {
    callback?.(false);
    dispatch({
      type: UNREAD_NOTIFICATION_NEW,
      payload: {
        uid,
        category,
        type,
      },
    });
  }
};
export const readAllNotification = (category, callback) => async (dispatch, getState) => {
  try {
    const token = await FirebaseDatabase.firebaseToken();
    const isReadSuccess = await FirebaseFunctions.readAllNotification(token, category);

    if (isReadSuccess) {
      dispatch(unreadNotifications(0, category));
      dispatch({
        type: READ_ALL_NOTIFICATION_NEW,
        payload: {
          category,
        },
      });
    } else {
      callback?.(false);
    }
  } catch (err) {
    callback?.(false);
  }
};

export const flagNotification = (item, category, type, callback) => async (dispatch, getState) => {
  const isFlag = !item?.flag;

  try {
    dispatch({
      type: FLAG_NOTIFICATION,
      payload: {
        item,
        category,
        type,
        isFlag,
      },
    });
    const token = await FirebaseDatabase.firebaseToken();
    const isFlagSuccess = await FirebaseFunctions.flagNotification(
      token,
      category,
      item?.uid,
      type,
      Math.floor(Date.now() / 1000),
      isFlag,
    );

    if (isFlagSuccess) {
      callback?.(true);
    } else {
      dispatch({
        type: FLAG_NOTIFICATION,
        payload: {
          item,
          category,
          type,
          isFlag: !isFlag,
        },
      });
      callback?.(false);
    }
  } catch (err) {
    dispatch({
      type: FLAG_NOTIFICATION,
      payload: {
        item,
        category,
        type,
        isFlag: !isFlag,
      },
    });
    callback?.(false);
  }
};

export const getFilterNotification = (category, callback) => async (dispatch, getState) => {
  try {
    const token = await FirebaseDatabase.firebaseToken();
    const data = await FirebaseFunctions.getFilterNotification(token, category);

    if (data) {
      let convertData = [];
      const keys = Object.keys(data);
      keys.forEach((key) => {
        let content = '';
        switch (key) {
          case TAB_TYPE.FINANCIAL:
            content = 'tài chính';
            break;
          case TAB_TYPE.AFFILIATE:
            content = 'tiếp thị liên kết';
            break;
          case TAB_TYPE.INSURANCE:
            content = 'bảo hiểm';
            break;
          case TAB_TYPE.OTHER:
            content = 'khác';
            break;
          default:
            break;
        }
        const values = data[key];
        const arrValues = Object.values(values).map((value) => ({
          id: value,
          title: value,
        }));
        convertData.push({
          key,
          data: arrValues,
          title: `Sản phẩm ${content}`,
          subTitle: `dự án ${content}`,
        });
      });

      dispatch({
        type: SET_FILTER_NOTIFICATION,
        payload: {
          data: convertData,
          category,
        },
      });
      callback?.(true, data);
    } else {
      callback?.(false);
    }
  } catch (err) {
    callback?.(false);
  }
};

export const getTotalUnreadNotification = () => async (dispatch, getState) => {
  try {
    const result = await DigitelClient.getTotalUnreadNotification();
    if (result?.data?.status) {
      console.log('aaa-222', result);
      dispatch({
        type: SET_TOTAL_UNREAD_NOTIFICATION,
        payload: result?.data?.data?.admin + result?.data?.data?.system,
      });
    }
  } catch (_) {}
};

export const increaseTotalUnreadNotification = () => (dispatch) => {
  dispatch({
    type: INCREASE_TOTAL_UNREAD_NOTIFICATION,
  });
};
