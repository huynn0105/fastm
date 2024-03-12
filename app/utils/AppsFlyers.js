import appsFlyer from 'react-native-appsflyer';
import { showInfoAlert } from './UIUtils';

export const initAppsFlyers = () => {
  appsFlyer.onInstallConversionData((res) => {
    if (!res || !res.data) return;
    try {
      if (JSON.parse(res.data.is_first_launch) == true) {
        if (res.data.af_status === 'Non-organic') {
          var media_source = res.data.media_source;
          var campaign = res.data.campaign;
          // showInfoAlert(
          //   'This is first launch and a Non-Organic install. Media source: ' +
          //     media_source +
          //     ' Campaign: ' +
          //     campaign,
          // );
          flyersTrackEvent(FLYERS_EVENT.INSTALL_NON_ORGANIC);
        } else if (res.data.af_status === 'Organic') {
          // showInfoAlert('This is first launch and a Organic Install');
          flyersTrackEvent(FLYERS_EVENT.INSTALL_ORGANIC);
        }
      } else {
        // showInfoAlert('This is not first launch');
      }
    } catch (err) {
      // showInfoAlert(JSON.stringify(err));
    }
  });

  appsFlyer.initSdk(
    {
      devKey: 'KSrBj8SaGRMW3PgRphgpFa',
      isDebug: false, // set to true if you want to see data in the logs
      appId: 'id1494079210', // iOS app id
    },
    (result) => {
      if (__DEV__) {
        console.log(result);
      }
    },
    (error) => {},
  );
};

export const flyersTrackEvent = (eventName = '', eventValues = {}) => {
  try {
    appsFlyer.logEvent(
      eventName,
      eventValues,
      (res) => {
        if (__DEV__) {
          console.log(res);
        }
      },
      (err) => {
        if (__DEV__) {
          console.log(err);
        }
      },
    );
  } catch (error) {
    if (__DEV__) {
      console.log(error);
    }
  }
};

export const flyersUserID = (userID) => {
  try {
    appsFlyer.setCustomerUserId(userID, (res) => {
      if (__DEV__) {
        console.log(res);
      }
    });
  } catch (error) {}
};

export const appsFlyerUninstall = (token) => {
  try {
    appsFlyer.updateServerUninstallToken(token, (res) => {});
  } catch (error) {}
};

export const FLYERS_EVENT = {
  INSTALL_ORGANIC: 'install_organic',
  INSTALL_NON_ORGANIC: 'install_non_organic',
  NON_USER_LANDING: 'non_user_landing',
  USER_LANDING: 'user_landing',
  REGISTER: 'register',

  // mfastmobile://event?type=type&product=product
  // type: transaction_insurance, transaction_pl, transaction_service, completed_transaction_insurance, completed_transaction_pl, completed_transaction_service
  // product:

  TRANSACTION_INSURANCE: 'transaction_insurance',
  TRANSACTION_PL: 'transaction_pl',
  TRANSACTION_SERVICE: 'transaction_service',
  COMPLETED_TRANSACTION_INSURANCE: 'completed_transaction_insurance',
  COMPLETED_TRANSACTION_PL: 'completed_transaction_pl',
  COMPLETED_TRANSACTION_SERVICE: 'completed_transaction_service',
};
