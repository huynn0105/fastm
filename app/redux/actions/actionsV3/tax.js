import DigitelClient from '../../../network/DigitelClient';
import { getUserMetaData } from './userMetaData';
import { setLoadingTaxNumber } from './commonLoading';

import { TrackingEvents } from '../../../constants/keys';
import { logEvent } from '../../../tracking/Firebase';

export function dispatchSendTaxCommit(email, callBack) {
  console.log('TCL: dispatchSendTaxCommit -> email', email);
  return (dispatch, getState) => {
    DigitelClient.sendTaxCommit(email)
      .then((response) => {
        if (callBack) {
          callBack(response);
        }
      })
      .catch((error) => {
        if (callBack) {
          callBack(error);
        }
      });
  };
}

export function dispatchUpdateTaxCommittedPhoto(path, callBack) {
  return (dispatch, getState) => {
    DigitelClient.sendTaxCommitPhoto(path)
      .then((response) => {
        if (response.status) {
          DigitelClient.trackEvent(TrackingEvents.FINISH_TAX_COMMITTED);
          logEvent(TrackingEvents.FINISH_TAX_COMMITTED);
          dispatch(getUserMetaData());
        }
        if (callBack) {
          callBack(response);
        }
      })
      .catch((error) => {
        if (callBack) {
          callBack(error);
        }
      });
  };
}

export function dispatchCheckTaxNumber(taxNumber, callBack) {
  return (dispatch, getState) => {
    dispatch(setLoadingTaxNumber(true));
    DigitelClient.checkTaxNumber(taxNumber)
      .then((response) => {
        dispatch(setLoadingTaxNumber(false));
        if (callBack) {
          callBack(response);
        }
      })
      .catch((error) => {
        dispatch(setLoadingTaxNumber(false));
        if (callBack) {
          callBack(error);
        }
      });
  };
}

export function dispatchGetTaxNumber() {
  return (dispatch, getState) => {
    dispatch(setLoadingTaxNumber(true));
    DigitelClient.getTaxNumber()
      .then((response) => {
        dispatch(setLoadingTaxNumber(false));
        if (response.status) {
          // dispatch(getUserMetaData());
        }
        return response;
      })
      .catch((error) => {
        dispatch(setLoadingTaxNumber(false));
        return error;
      });
  };
}

export function dispatchSaveInsuranceCert(
  path,
  ins_certificate_number,
  ins_certificate_provide,
  ins_certificate_date,
  callback,
) {
  return (dispatch) => {
    return DigitelClient.saveInsCert(
      path,
      ins_certificate_number,
      ins_certificate_provide,
      ins_certificate_date,
    )
      .then((data) => {
        if (data) {
          callback(data);
        }
      })
      .catch((error) => {});
  };
}

export function getInsuranceCertPath(callback) {
  return (dispatch) => {
    return DigitelClient.getPathInsCert()
      .then((data) => {
        if (data) {
          callback(data);
        }
      })
      .catch((error) => {});
  };
}

export function insuranceUserESign(otpCode, callback) {
  return async (dispatch) => {
    try {
      const res = await DigitelClient.insuranceUserESign(otpCode);
      if (res?.data?.status) {
        callback(true, res?.data?.data);
      } else {
        callback(false, res?.data?.message, res?.data?.code);
      }
    } catch (error) {
      callback(false, error?.message, error?.status);
    }
  };
}
