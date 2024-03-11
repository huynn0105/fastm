// @flow

import DigitelClient from '../../network/DigitelClient';

import { SET_POPUP_BRAND, SET_SHOW_POPUP_BRAND } from './types';

export function setPopupBrand(payload) {
  return {
    type: SET_POPUP_BRAND,
    payload,
  };
}

export function setShowPopupBrand(bool) {
  return {
    type: SET_SHOW_POPUP_BRAND,
    isShow: bool,
  };
}

export function getPopupBrand() {
  return (dispatch) => {
    DigitelClient.getPopupBrand()
      .then((payload) => {
        dispatch(setPopupBrand(payload));
      })
      .catch();
  };
}

export function getPopupBrandAfterLogin() {
  return (dispatch) => {
    DigitelClient.getPopupBrand()
      .then((payload) => {
        dispatch(setPopupBrand(payload));
        dispatch(setShowPopupBrand(!!payload?.isShowPopup));
      })
      .catch();
  };
}
