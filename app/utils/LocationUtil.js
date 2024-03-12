import Geolocation from '@react-native-community/geolocation';
import { Alert } from 'react-native';
import { checkLocation, requestLocation } from './Permission';
import { IS_ANDROID } from './Utils';
// import Utils from 'app/utils/Utils';
import IntentLauncher from 'react-native-intent-launcher';
import { PERMISSION_CHECK, checkAndRequestPermission } from './permissionV3';
import DeviceInfo from 'react-native-device-info';
import { AppState } from 'react-native';
import CodePush from 'react-native-code-push';

const GET_LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 5000,
};

export function checkWithoutRequestPermissionLocation(callback) {
  checkLocation().then((isAuthozied) => {
    if (isAuthozied) {
      getPosition(callback);
    }
  });
}

function cb(nextAppState) {
  if (nextAppState === 'active') {
    DeviceInfo.isLocationEnabled().then((enabled) => {
      if (enabled) {
        CodePush.restartApp();
      }
    });
    AppState.removeEventListener('change', cb);
  }
}

function showAlertForGPSPermission() {
  Alert.alert(
    'MFast',
    'Vui lòng bật định vị để tiếp tục.',
    [
      {
        text: 'Đóng',
      },
      {
        text: 'Đồng ý',
        onPress: () => {
          if (IS_ANDROID) {
            IntentLauncher.startActivity({
              action: 'android.settings.LOCATION_SOURCE_SETTINGS',
            });

            //! Fix for same android devices can't get location after enable GPS
            AppState.addEventListener('change', cb);
          } else {
            IntentLauncher.startActivity({
              action: 'android.settings.LOCATION_SOURCE_SETTINGS',
            });
          }
        },
      },
    ],
    {
      cancelable: false,
    },
  );
}

export function checkAndRequestPermissionLocation(callback) {
  checkLocation()
    .then((isAuthorized) => {
      if (isAuthorized) {
        getPosition(callback);
        return Promise.reject();
      } else {
        return requestLocation();
      }
    })
    .then((isAuthorized) => {
      if (isAuthorized) {
        getPosition(callback);
      } else {
        callback(null);
      }
    });
}

export function getPosition(callback = () => {}) {
  getLocationIOS(callback);
}

function getLocationIOS(callback) {
  Geolocation.getCurrentPosition(
    (position) => {
      callback(parseLocation(position));
    },
    () => {
      if (callback) {
        callback(null);
      }
      showAlertForGPSPermission();
    },
    GET_LOCATION_OPTIONS,
  );
}

function getPositionAndroid(callback) {
  Geolocation.getCurrentPosition(
    (position) => {
      callback(parseLocation(position));
    },
    () => {
      if (callback) {
        callback(null);
      }
    },
    GET_LOCATION_OPTIONS,
  );
}

function parseLocation(position) {
  if (position && position.coords && position.coords.latitude) {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    const realLocation = position.mocked ? null : location;
    return realLocation;
  }
  return null;
}

export function getLocationRequired(message) {
  return new Promise(async (resolve) => {
    try {
      const granted = await checkAndRequestPermission(PERMISSION_CHECK.LOCATION, message);
      if (!granted) return resolve();
      checkAndRequestPermissionLocation((location) => {
        resolve(location);
      });
    } catch (error) {
      resolve();
    }
  });
}
