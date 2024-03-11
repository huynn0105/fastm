import TouchID from 'react-native-touch-id';

const optionalConfigObject = {
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
};

export const isSupportedFaceId = () => {
  return TouchID.isSupported(optionalConfigObject).then((biometryType) => {
    if (biometryType === 'FaceID') {
      return true;
    } else {
      return false;
    }
  });
};

export const checkBiometric = async () => {
  try {
    const biometric = await TouchID.isSupported(optionalConfigObject);
    return biometric;
  } catch (error) {
    return false;
  }
};

export const touchIdAuthenticate = () =>
  new Promise((resolve, reject) => {
    TouchID.authenticate('', optionalConfigObject)
      .then((success) => {
        resolve(success);
      })
      .catch((err) => {
        reject(err);
      });
  });
