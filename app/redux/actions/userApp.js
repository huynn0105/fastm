import {
  IS_GETTING_USER_APP_LIST,
  USER_APP_LIST,
} from '../actions/types';

import DigitelClient from '../../network/DigitelClient';

const _ = require('lodash');

export function isGettingUserAppList(isProcessing) {
  return {
    type: IS_GETTING_USER_APP_LIST,
    payload: isProcessing,
  };
}

export function userAppList(apps) {
  return {
    type: USER_APP_LIST,
    payload: apps,
  };
}

export function requestUserAppList() {
  return (dispatch, getState) => {
    dispatch(isGettingUserAppList(true));
    return DigitelClient.getUserAppList()
      .then(items => {
        dispatch(isGettingUserAppList(false));

        if (!_.isEqual(getState().userAppList, items)) {
          dispatch(userAppList(items));
        }
      })
      .catch(response => {
        dispatch(isGettingUserAppList(false));
      });
  };
}

const fakeData = () => {
  return [
    {
      "productName": "Vay theo lương",
      "requestAmount": "200.000.000",
      "tenureRequested": "12 tháng",
      "lastProcessText": "Cần chuẩn bị giấy tờ",
      "detailURL": "https://appay-rc.cloudcms.vn/fe_credit/main/app_single/?app_id=36207"
    },
    {
      "productName": "Vay theo lương ck",
      "requestAmount": "20.000.000",
      "tenureRequested": "2 tháng",
      "lastProcessText": "Cần chuẩn bị giấy tờ",
      "detailURL": "https://appay-rc.cloudcms.vn/fe_credit/main/app_single/?app_id=36207"
    },
  ];
}
