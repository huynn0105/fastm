import { Platform, Alert } from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

import { openSettings } from 'react-native-permissions';
import strings from '../constants/strings';

export function showAlertForRequestPermission(message) {
  Alert.alert(
    'MFast',
    message,
    [
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
    ],
    {
      cancelable: false,
    },
  );
}

/*
  permission type
*/
export const PERMISSION_CHECK = {
  CAMERA: Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  }),
  PHOTO: Platform.select({
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  }),
  MICROPHONE: Platform.select({
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios: PERMISSIONS.IOS.MICROPHONE,
  }),
  LOCATION: Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  }),
};

export const PERMISSION_REQUEST_MESSAGE = {
  CAMERA: strings.camera_access_error,
  PHOTO: strings.camera_access_error,
  MICROPHONE: strings.micro_access_error_android,
  LOCATION: strings.location_access_error,
};

// only check permission
export const checkPermission = async (permisssion) => {
  if (!permisssion) {
    return;
  }
  const resCheck = await check(permisssion);
  if (resCheck === RESULTS.GRANTED) {
    return true;
  }
  return false;
};

// only request permission
export const requestPermission = async (
  permisssion,
  message = 'Vui lòng cấp quyền truy cập để tiếp tục.',
) => {
  if (!permisssion) {
    return;
  }
  const resRequest = await request(permisssion);
  if (resRequest === RESULTS.GRANTED) {
    return true;
  } else {
    showAlertForRequestPermission(message);
    return false;
  }
};

// check and request
export const checkAndRequestPermission = async (
  permisssion,
  message = 'Vui lòng cấp quyền truy cập để tiếp tục.',
) => {
  try {
    if (!permisssion) {
      return;
    }
    const resCheck = await check(permisssion);
    if (resCheck === RESULTS.GRANTED) {
      return true;
    }
    const resRequest = await request(permisssion);
    if (resRequest === RESULTS.GRANTED) {
      return true;
    } else {
      showAlertForRequestPermission(message);
      return false;
    }
  } catch (error) {
    showAlertForRequestPermission(message);
    return false;
  }
};
