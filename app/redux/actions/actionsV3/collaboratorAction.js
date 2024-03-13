import DigitelClient from '../../../network/DigitelClient';
import {
  SET_COLLABORATOR_CURRENT_INDEX,
  SET_FILTER_RATING,
  SET_HIER_INFO_USER,
  SET_LEGEND_CHART,
  SET_MY_SUPPORTER,
  SET_TAB_INDEX_COLLABORATOR,
} from './actionTypes';

export const setCurrentIndex = (index) => (dispatch) =>
  dispatch({ type: SET_COLLABORATOR_CURRENT_INDEX, payload: index });

export const getInfoCollaborator =
  (userId, isUserCollab, parentUserID, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getInfoCollaborator(userId, isUserCollab, parentUserID);

      if (res?.status === 200) {
        callback?.(true, res?.data?.data);
        const myUid = getState().myUser?.uid;
        const isMine = userId === myUid;
        if (isMine) {
          dispatch({ type: SET_HIER_INFO_USER, payload: res?.data?.data });
        }
      } else {
        callback?.(false, res?.data);
      }
    } catch (error) {
      callback?.(false, error);
    }
  };

export const getExperienceChart =
  (userId, directSales, month, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getExperienceChart(userId, directSales, month);

      if (res?.status === 200) {
        callback?.(true, res?.data?.data);
      } else {
        callback?.(false, res?.data);
      }
    } catch (error) {
      callback?.(false, error);
    }
  };

export const getIncomeChart =
  (userId, directSales, month, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getIncomeChart(userId, directSales, month);

      if (res?.status === 200) {
        callback?.(true, res?.data?.data);
      } else {
        callback?.(false, res?.data);
      }
    } catch (error) {
      callback?.(false, error);
    }
  };
export const getCollaboratorChart =
  (userId, rank, month, tab, level, type, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getCollaboratorChart(userId, rank, month, tab, level, type);

      console.log('aaa-11: ', res);

      if (res?.status === 200) {
        callback?.(true, res?.data?.data);
      } else {
        callback?.(false, res?.data);
      }
    } catch (error) {
      callback?.(false, error);
    }
  };
export const getLegendaryChart = (userId, month, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getLegendaryChart(userId, month);

    if (res?.status === 200) {
      callback?.(true, res?.data?.data);
      const myUid = getState().myUser?.uid;
      const isMine = userId === myUid;
      if (isMine) {
        dispatch({ type: SET_LEGEND_CHART, payload: res?.data?.data });
      }
    } else {
      callback?.(false, res?.data);
    }
  } catch (error) {
    callback?.(false, error);
  }
};
export const getWorkingChart = (userId, type, month, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getWorkingChart(userId, type, month);

    if (res?.status === 200) {
      console.log(`aaa-53: \u001B`, res?.data?.data);
      callback?.(true, res?.data?.data);
    } else {
      callback?.(false, res?.data);
    }
  } catch (error) {
    callback?.(false, error);
  }
};
export const getFilterCollaborator = (rank, userId, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getFilterCollaborator(rank, userId);

    if (res?.status === 200) {
      callback?.(true, res?.data?.data);
    } else {
      callback?.(false, res?.data);
    }
  } catch (error) {
    callback?.(false, error);
  }
};
export const getListCollaborator =
  (userId, filters, month, page, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getListCollaborator(userId, filters, month, page);

      console.log('aaa-10:', JSON.stringify(res));

      if (res?.status === 200) {
        callback?.(true, res?.data?.data?.list || []);
      } else {
        callback?.(false, res?.data);
      }
    } catch (error) {
      callback?.(false, error);
    }
  };
export const getListCollaboratorPending =
  (userId, page, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getListCollaboratorPending(userId, page);

      if (res?.status === 200) {
        callback?.(true, res?.data?.data || []);
      } else {
        callback?.(false, res?.data);
      }
    } catch (error) {
      callback?.(false, error);
    }
  };

export const getFilterRating = (userId, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getFilterRating(userId);

    if (res?.status === 200) {
      dispatch({ type: SET_FILTER_RATING, payload: res?.data?.data || {} });
      callback?.(true, res?.data?.data || {});
    } else {
      callback?.(false, res?.data);
    }
  } catch (error) {
    callback?.(false, error);
  }
};

export const getListRating = (userId, tab, skill, page, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListRating(userId, tab, skill, page);

    if (res?.status === 200) {
      callback?.(true, res?.data?.data?.listRating || {});
    } else {
      callback?.(false, res?.data);
    }
  } catch (error) {
    callback?.(false, error);
  }
};
export const ratingUser =
  (userId, toUserId, star, comment, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.ratingUser(userId, toUserId, star, comment);

      if (res?.data?.data) {
        callback?.(true, res?.data?.data || {});
      } else {
        callback?.(false, {}, res?.data?.message);
      }
    } catch (error) {
      callback?.(false, {}, error?.message);
    }
  };
export const getRatingUser = (userID, toUserID, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getRatingUser(userID, toUserID);

    if (res?.data?.data) {
      callback?.(true, res?.data?.data || {});
    } else {
      callback?.(false, {}, res?.data?.message);
    }
  } catch (error) {
    callback?.(false, {}, error?.message);
  }
};

export const setTabIndexCollaborator = (index) => {
  return (dispatch) => {
    dispatch({ type: SET_TAB_INDEX_COLLABORATOR, payload: index });
  };
};
