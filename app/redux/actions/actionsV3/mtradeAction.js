import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import DigitelClient from '../../../network/DigitelClient';
import {
  ADD_ITEM_LIST_MTRADE_CARD,
  ADD_ITEM_LIST_MTRADE_PRODUCT_HISTORY,
  REMOVE_ITEM_LIST_MTRADE_CARD,
  RESET_FILTER,
  RESET_TEXT_SEARCH,
  SET_FILTER,
  SET_LIST_MAIN_BANNER,
  SET_LIST_MAIN_PRODUCT,
  SET_LIST_MTRADE_BANNER,
  SET_LIST_MTRADE_CARD,
  SET_LIST_MTRADE_CATEGORY,
  SET_LIST_MTRADE_FILTER,
  SET_LIST_MTRADE_LOCATION,
  SET_LOCATION,
  SET_MORE_LIST_MTRADE_CARD,
  SET_MTRADE_BONUS,
  SET_MTRADE_CODE,
  SET_TEXT_SEARCH,
} from './actionTypes';

export const getListMainBanner = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMainBanner();
    console.log('aaa-24:', res);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({ type: SET_LIST_MAIN_BANNER, payload: data });
    }
    callback?.(status, data);
  } catch (err) {
    if (__DEV__) {
      const data = [...new Array(Math.floor(Math.random() * 20)).keys()].map((_, i) => {
        return {
          id: `${i}`,
          image: 'https://picsum.photos/200/300',
        };
      });
      dispatch({ type: SET_LIST_MAIN_BANNER, payload: data });
    }
    callback?.(false, err?.message);
  }
};

export const getListMainProduct = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMainProduct();
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({ type: SET_LIST_MAIN_PRODUCT, payload: data });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', err);
    callback?.(false, err?.message);
  }
};

export const getListMTradeBanner = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeBanner();
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({ type: SET_LIST_MTRADE_BANNER, payload: data });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', err);
    callback?.(false, err?.message);
  }
};
export const getListMTradeCategory = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeCategory();
    const status = res?.data?.status;
    const data = status ? res?.data?.data?.list : res?.data?.message || res?.message;
    if (status) {
      dispatch({ type: SET_LIST_MTRADE_CATEGORY, payload: data });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', err);
    callback?.(false, err?.message);
  }
};
export const getListMTradeFilter = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeFilter();
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({ type: SET_LIST_MTRADE_FILTER, payload: data });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', err);
    callback?.(false, err?.message);
  }
};

export const resetFilter = () => (dispatch) => {
  dispatch({ type: RESET_FILTER });
};
export const setFilter = (newFilter) => (dispatch) => {
  dispatch({ type: SET_FILTER, payload: newFilter });
};
export const resetTextSearch = () => (dispatch) => {
  dispatch({ type: RESET_TEXT_SEARCH });
};
export const setTextSearch = (text) => (dispatch) => {
  dispatch({ type: SET_TEXT_SEARCH, payload: text });
};

export const getListMTradeProduct = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeProduct(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;

    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};

export const resetListMTradeProduct = () => (dispatch) => {
  dispatch({ type: SET_LIST_MAIN_PRODUCT, payload: [] });
};

export const getListMTradeTextSearch = (text, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeTextSearch(text);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;

    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getListMTradeLocation = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeLocation();
    const status = res?.data?.status;
    const data = status ? res?.data?.data?.list : res?.data?.message || res?.message;
    if (status) {
      dispatch({ type: SET_LIST_MTRADE_LOCATION, payload: data });
      dispatch({ type: SET_LOCATION, payload: res?.data?.data?.activeProvince });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};

export const setMTradeLocation = (provinceCode, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.setMTradeLocation(provinceCode);
    const status = res?.data?.status;
    if (status) {
      dispatch({ type: SET_LOCATION, payload: provinceCode });
    }
    callback?.(status);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};

export const setLocation = (text) => (dispatch) => {
  dispatch({ type: SET_LOCATION, payload: text });
};

export const getMTradeDetailProduct = (productCode, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getMTradeDetailProduct(productCode);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({
        type: ADD_ITEM_LIST_MTRADE_PRODUCT_HISTORY,
        payload: { ...data, image: data?.productImg?.[0] },
      });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};

export const getMTradeCreateOrder = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getMTradeCreateOrder(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.payment_url : res?.data?.message || res?.message;

    callback?.(status, data, res?.data?.invalid_sku || []);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};

export const getListMTradeCard = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeCard(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({
        type: payload?.page > 1 ? SET_MORE_LIST_MTRADE_CARD : SET_LIST_MTRADE_CARD,
        payload: data,
      });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getMTradeCode = (callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getMTradeCode();
    const status = res?.data?.status;
    const data = res?.data;
    dispatch({
      type: SET_MTRADE_CODE,
      payload: data,
    });
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const addMTradeCard = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.addMTradeCard(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data?.item : res?.data?.message || res?.message;
    if (status) {
      dispatch({
        type: ADD_ITEM_LIST_MTRADE_CARD,
        payload: {
          ...data,
          ID: res?.data?.data?.cartID,
          name: `${data?.name} - ${data?.attribute?.option}`,
          productImg: data?.image,
          productCode: payload?.code,
          productID: payload?.productID,
          quantity: payload?.quantity,
        },
      });
    }
    callback?.(status, data, res?.data?.errorCode);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const deleteMTradeCard = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.removeMTradeCard(payload);
    const status = res?.data?.status;
    const data = res?.data?.message || res?.message;
    if (status) {
      dispatch({
        type: REMOVE_ITEM_LIST_MTRADE_CARD,
        payload: { ...payload },
      });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getMTradeBonus = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getMTradeBonus(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({
        type: SET_MTRADE_BONUS,
        payload: data,
      });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getMTradeIndirectBonus = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getMTradeBonus(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    if (status) {
      dispatch({
        type: SET_MTRADE_BONUS,
        payload: data,
      });
    }
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getListMTradeIndirectBonus = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeIndirectBonus(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data?.indirect_bonus : res?.data?.message || res?.message;

    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getListMTradeOrder = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getListMTradeOrder(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data?.orders : res?.data?.message || res?.message;
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getMTradeBonusByCollaborator = (payload, callback) => async (dispatch, getState) => {
  try {
    const res = await DigitelClient.getMTradeBonusByCollaborator(payload);
    const status = res?.data?.status;
    const data = status ? res?.data?.data : res?.data?.message || res?.message;
    callback?.(status, data);
  } catch (err) {
    console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
    callback?.(false, err?.message);
  }
};
export const getMTradeDetailProductByAttribute =
  (payload, callback) => async (dispatch, getState) => {
    try {
      const res = await DigitelClient.getMTradeDetailProductByAttribute(payload);
      const status = res?.data?.status;
      const data = status ? res?.data?.data : res?.data?.message || res?.message;
      callback?.(status, data);
    } catch (err) {
      console.log('\u001B[36m -> file: mtradeAction.js:15 -> err', JSON.stringify(err));
      callback?.(false, err?.message);
    }
  };
