import { Platform, PermissionsAndroid } from 'react-native';
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import ReactNativeContacts from 'react-native-contacts';

export const checkContact = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then((granted) => {
          return resolve(granted);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      check(PERMISSIONS.IOS.CONTACTS)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
      // ReactNativeContacts.checkPermission((err, result) => {
      //   return resolve(result === 'authorized');
      // });
    }
  });
};

export const checkWriteContact = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)
        .then((granted) => {
          return resolve(granted);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
      // ReactNativeContacts.checkPermission((err, result) => {
      //   return resolve(result === 'authorized');
      // });
    }
  });
};

export const requestContact = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then((granted) => {
          return resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      request(PERMISSIONS.IOS.CONTACTS)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const requestWriteContact = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS, {
        title: 'MFast',
        message: 'Thêm danh bạ cho trò chuyện',
      })
        .then((granted) => {
          return resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      ReactNativeContacts.requestPermission((err, result) => {
        return resolve(result === 'authorized');
      });
    }
  });
};

export const checkLocation = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then((granted) => {
          return resolve(granted);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const requestLocation = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then((granted) => {
          return resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const checkPhoto = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const requestPhoto = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        title: 'MFast',
        message: 'Truy cập bộ nhớ hình ảnh',
      })
        .then((granted) => {
          return resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const checkCamera = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const requestCamera = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'MFast',
        message: 'Truy cập máy ảnh',
      })
        .then((granted) => {
          return resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const checkPhotoAndCamera = () => {
  return new Promise((resolve) => {
    return checkPhoto()
      .then((granted) => {
        if (granted) {
          return checkCamera();
        } else {
          return false;
        }
      })
      .then((granted) => {
        resolve(granted);
      });
  });
};

export const checkAndRequestCamera = async () => {
  const enable = await checkCamera();
  if (!enable) {
    return await requestCamera();
  }
  return enable;
};

export const checkAndRequestPhoto = async () => {
  const enable = await checkPhoto();
  if (!enable) {
    return await requestPhoto();
  }
  return enable;
};

export const checkAndRequestLocation = async () => {
  const enable = await checkLocation();
  if (!enable) {
    return await requestLocation();
  }
  return enable;
};

export const checkMicro = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
        .then((granted) => {
          return resolve(granted);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      check(PERMISSIONS.IOS.MICROPHONE)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const requestMicro = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'MFast',
        message: 'Truy cập Micro',
      })
        .then((granted) => {
          return resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      request(PERMISSIONS.IOS.MICROPHONE)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    }
  });
};

export const checkAndRequestMicro = async () => {
  const enable = await checkMicro();
  if (!enable) {
    return await requestMicro();
  }
  return enable;
};

export const requestSMS = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.READ_SMS)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
};

export const checkCallLog = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.READ_CALL_LOG)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
};
export const requestCallLog = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.READ_CALL_LOG)
        .then((result) => {
          resolve(result === RESULTS.GRANTED);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
};

export const checkPostNotification = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then((result) => {
          resolve(result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
};

export const requestPostNotification = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then((result) => {
          resolve(result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
};

export const checkAndRequestPostNotification = async () => {
  const enable = await checkPostNotification();
  if (!enable) {
    return await requestPostNotification();
  }
  return enable;
};
