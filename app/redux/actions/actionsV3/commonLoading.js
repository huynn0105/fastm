
import {
  SET_LOADING_COMMON,
  SET_LOADING_PHONE_OTP,
  SET_LOADING_ADDBANKING,
  SET_LOADING_UPDATE_USER_META,
  SET_LOADING_TAX_NUMBER,
  SET_LOADING_GET_U_META
} from './actionTypes';

export function setCommonLoading(isLoading) {
    return {
      type: SET_LOADING_COMMON,
      isLoading,
    };
}


export function setLoadingPhoneOtp(isSendingPhoneOtp) {
  return {
    type: SET_LOADING_PHONE_OTP,
    isSendingPhoneOtp,
  };
}


export function setLoadingAddBanking(isLoading) {
  return {
    type: SET_LOADING_ADDBANKING,
    isLoading,
  };
}


export function setLoadingUserMeta(isLoading) {
  return {
    type: SET_LOADING_UPDATE_USER_META,
    isLoading,
  };
}


export function setLoadingTaxNumber(isLoading) {
  return {
    type: SET_LOADING_TAX_NUMBER,
    isLoading,
  };
}

export function setLoadingGetUMeta(isLoading) {
  return {
    type: SET_LOADING_GET_U_META,
    isLoading,
  };
}