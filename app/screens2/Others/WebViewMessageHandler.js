// import { Platform } from 'react-native';

// import {
//   LOCATION_KEY,
//   CONTACT_KEY,
//   CONFIG_KEY,
//   CUSTOM_BACK_KEY,
//   NUMBER_BACK_KEY,
//   TITLE_KEY,
//   PHOTO_PICKER_KEY
// } from './CommunicationKey';

// import { ERROR_CODE } from '../../network/ErrorCode';
// import { getAppVersion } from '../../utils/Utils';
// import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';
// import store from '../../redux/store/store';
// import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';

// class WebViewMessageHandler {
//   constructor(callbackMessage) {
//     this.calbackMessage = callbackMessage;
//   }

//   sendMessageToWebview = (message) => {
//     this.calbackMessage(message);
//   };

//   onMessage = async (event) => {
//     try {
//       // work around for encode data
//       let data = event.nativeEvent.data;
//       for (let i = 0; i < 5; i += 1) {
//         if (data.includes('%')) {
//           data = decodeURIComponent(data);
//         } else {
//           break;
//         }
//       }
//       const dataJSON = JSON.parse(data);
//       switch (dataJSON.key) {
//         case ERROR_CODE.REQUIRED_LOGIN:
//           this.handleLoginRequest();
//           break;
//         case LOCATION_KEY:
//           this.handleLocationRequest(dataJSON);
//           break;
//         case CONTACT_KEY:
//           this.handleContactRequest(dataJSON);
//           break;
//         case CONFIG_KEY:
//           this.handleConfig(dataJSON);
//           break;
//         case TITLE_KEY:
//           this.updateTitle(dataJSON.title);
//           break;
//         case CUSTOM_BACK_KEY:
//           this.handleCanBackURL(dataJSON);
//           break;
//         case NUMBER_BACK_KEY:
//           this.handleNumberBack(dataJSON);
//           break;
//         case PHOTO_PICKER_KEY:
//           this.handlePhotoPicker(dataJSON);
//           break;
//         default:
//           break;
//       }
//     } catch (err) {} // eslint-disable-line
//   };

//   //* * handle logic */

//   handleLoginRequest = () => {
//     this.currentKey = ERROR_CODE.REQUIRED_LOGIN;
//     BroadcastManager.shared().notifyObservers(
//       BroadcastManager.NAME.API.ERROR_OTP,
//       ERROR_CODE.REQUIRED_LOGIN
//     );
//   };

//   handleLocationRequest = async (dataJSON) => {
//     const location = await this.fetchLocation(dataJSON.uid);
//     this.sendMessageToWebview({
//       key: LOCATION_KEY,
//       uid: dataJSON.uid,
//       location,
//       os: Platform.OS,
//       appVersion: getAppVersion()
//     });
//   };

//   handleContactRequest = async () => {
//     const contacts = Object.keys(store.getState().allContacts).map(
//       (key) => store.getState().allContacts[key]
//     );
//     this.sendMessageToWebview({
//       key: CONTACT_KEY,
//       data: contacts,
//       os: Platform.OS,
//       appVersion: getAppVersion()
//     });
//   };

//   //* * stuff func */

//   fetchLocation = () => {
//     return new Promise((resolve) => {
//       checkAndRequestPermissionLocation((location) => {
//         resolve(location);
//       });
//     });
//   };
// }

// export default WebViewMessageHandler;
