import Contacts from 'react-native-contacts';
// import CallLogs from 'react-native-call-log';
// import { InstalledApps } from 'react-native-launcher-kit';
import DeviceInfo from 'react-native-device-info';
import { Alert, Platform } from 'react-native';
import { IS_ANDROID } from './Utils';
import { checkCallLog, checkContact, requestCallLog, requestContact } from './Permission';
import { openSettings } from 'react-native-permissions';
import moment from 'moment';

export const getContacts = () => {
  return new Promise((resolve, reject) => {
    checkContact().then((granted) => {
      if (granted) {
        Contacts.getAll()
          .then((contacts) => {
            resolve(contacts);
          })
          .catch((error) => {
            resolve(null);
          });
      } else {
        resolve(null);
      }
    });
  });
};

// const getSMS = () => {
//   requestSMS().then((granted) => {
//     const filter = {
//       box: 'inbox',

//       // minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
//       // maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
//       // bodyRegex: '(.*)How are you(.*)', // content regex to match
//       // /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
//       // read: 0, // 0 for unread SMS, 1 for SMS already read
//       // _id: 1234, // specify the msg id
//       // thread_id: 12, // specify the conversation thread_id
//       // address: '+1888------', // sender's phone number
//       // body: 'How are you', // content to match
//       // /** the next 2 filters can be used for pagination **/
//       // indexFrom: 0, // start from index 0
//       // maxCount: 10, // count of SMS to return each time
//     };

//     SmsAndroid.list(
//       JSON.stringify(filter),
//       (fail) => {
//         showDevAlert(
//           `\u001B[34m -> file: Collaborator.View.js:357 -> fail: ${JSON.stringify(fail)}`,
//         );
//       },
//       (count, smsList) => {
//         console.log(`\u001B[34m -> file: Collaborator.View.js:378 -> smsList:`, smsList);
//         showDevAlert(`\u001B[34m -> file: Collaborator.View.js:377 -> smsList: ${smsList}`);
//       },
//     );
//   });
// };

// const getCallLog = () => {
//   return new Promise((resolve, reject) => {
//     checkCallLog().then((granted) => {
//       if (granted) {
//         const filter = {
//           minTimestamp: moment().subtract(6, 'months').unix(), // (Number or String) timestamp in milliseconds since UNIX epoch
//           // maxTimestamp: 1571835033, // (Number or String) timestamp in milliseconds since UNIX epoch
//           // phoneNumbers: '+1234567890', // (String or an Array of String)
//         };

//         CallLogs.load(-1, filter)
//           .then((callLogs) => {
//             resolve(callLogs);
//           })
//           .catch((error) => {
//             resolve([]);
//           });
//       } else {
//         resolve([]);
//       }
//     });
//   });
// };

// const getAllAppName = () => {
//   const data = InstalledApps.getApps();
//   return data.map((item) => ({ label: item.label, packageName: item.packageName }));
// };

const getDeviceInfo = () => {
  const data = {
    os: Platform.OS,
    osVersion: DeviceInfo.getSystemVersion(),
    appVersion: DeviceInfo.getVersion(),
    deviceUDID: DeviceInfo.getUniqueId(),
    deviceModel: DeviceInfo.getDeviceId(),
  };

  return data;
};

export const getPayloadTrackingAgent = async (payload = {}) => {
  const _payload = {
    event: 'APP_LAUNCH',
    ...getDeviceInfo(),
    ...payload,
  };

  try {
    const contacts = await getContacts();
    _payload.agent_contact = contacts || [];

    // if (IS_ANDROID) {
    //   const callLogs = await getCallLog();
    //   _payload.agent_call_history = callLogs;

    //   const appsName = getAllAppName();
    //   _payload.agent_install_app = appsName;
    // }

    return _payload;
  } catch (error) {
    return _payload;
  }
};

const showAlertForRequestPermission = (permissions = 'quyền') => {
  setTimeout(() => {
    Alert.alert('MFast', `Cho phép MFast truy cập ${permissions} để nhận OTP`, [
      {
        text: 'Đóng',
        onPress: () => {},
      },
      {
        text: 'Đồng ý',
        onPress: () => {
          openSettings();
        },
      },
    ]);
  }, 100);
};

export const checkTrackingAgentPermissions = (isShowAlert = true) => {
  return new Promise(async (resolve, reject) => {
    const grantedContacts = await requestContact();
    // if (IS_ANDROID) {
    //   const grantedCallLogs = await requestCallLog();
    //   if (!grantedContacts && !grantedCallLogs) {
    //     isShowAlert && showAlertForRequestPermission('Danh bạ, Lịch sử cuộc gọi');
    //     resolve(false);
    //     return;
    //   }

    //   if (!grantedCallLogs) {
    //     isShowAlert && showAlertForRequestPermission('Lịch sử cuộc gọi');
    //     resolve(false);
    //     return;
    //   }
    // }

    if (!grantedContacts) {
      isShowAlert && showAlertForRequestPermission('Danh bạ');
      resolve(false);
      return;
    }

    resolve(true);
  });
};
