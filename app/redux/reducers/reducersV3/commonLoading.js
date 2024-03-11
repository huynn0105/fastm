import {
  SET_LOADING_ADDBANKING,
  SET_LOADING_COMMON,
  SET_LOADING_GET_U_META,
  SET_LOADING_PHONE_OTP,
  SET_LOADING_TAX_NUMBER,
  SET_LOADING_UPDATE_USER_META,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  isLoading: false,
  isSendingPhoneOtp: false,
  isLoadingAddBank: false,
  isLoadingUserMeta: false,
  isLoadingTaxNumber: false,
  isLoadingGetUMeta: false,
};

export function commonLoading(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_COMMON: {
      const { isLoading } = action;
      return {
        ...state,
        isLoading,
      };
    }
    case SET_LOADING_PHONE_OTP: {
      const { isSendingPhoneOtp } = action;
      return {
        ...state,
        isSendingPhoneOtp,
      };
    }
    case SET_LOADING_ADDBANKING: {
      const { isLoading } = action;
      return {
        ...state,
        isLoadingAddBank: isLoading,
      };
    }
    case SET_LOADING_UPDATE_USER_META: {
      const { isLoading } = action;
      return {
        ...state,
        isLoadingUserMeta: isLoading,
      };
    }
    case SET_LOADING_TAX_NUMBER: {
      const { isLoading } = action;
      return {
        ...state,
        isLoadingTaxNumber: isLoading,
      };
    }
    case SET_LOADING_GET_U_META: {
      const { isLoading } = action;
      return {
        ...state,
        isLoadingGetUMeta: isLoading,
      };
    }
    default:
      return state;
  }
}
