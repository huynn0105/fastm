import ReactMoE from 'react-native-moengage';

export const listenPopupMoengage = () => {
  ReactMoE.setEventListener('inAppCampaignShown', (inAppInfo) => {
    console.log(`\u001B[34m -> file: callbackPopupMoengage.js:5 -> inAppInfo:`, inAppInfo);
  });
  ReactMoE.setEventListener('inAppCampaignClicked', (inAppInfo) => {
    console.log(`\u001B[34m -> file: callbackPopupMoengage.js:9 -> inAppInfo:`, inAppInfo);
  });
  ReactMoE.setEventListener('inAppCampaignDismissed', (inAppInfo) => {
    console.log(`\u001B[34m -> file: callbackPopupMoengage.js:13 -> inAppInfo:`, inAppInfo);
  });
  ReactMoE.setEventListener('inAppCampaignCustomAction', (inAppInfo) => {
    console.log(`\u001B[34m -> file: callbackPopupMoengage.js:17 -> inAppInfo:`, inAppInfo);
  });
};

export const removeListenPopupMoengage = () => {
  ReactMoE.removeEventListener('inAppCampaignShown');
  ReactMoE.removeEventListener('inAppCampaignClicked');
  ReactMoE.removeEventListener('inAppCampaignDismissed');
  ReactMoE.removeEventListener('inAppCampaignCustomAction');
};
