// @flow

import { SET_POPUP_BRAND, SET_SHOW_POPUP_BRAND } from '../actions/types';

const initState = {
    isShow: false,
    data: null,
}

export function popupBrand(state = initState, action) {
    switch (action.type) {
      case SET_POPUP_BRAND:
        return {
            ...state,
            data: action.payload
        };
      case SET_SHOW_POPUP_BRAND: 
        return {
            ...state,
            isShow: !!action?.isShow
        }
      default:
        return state;
    }
  }
  