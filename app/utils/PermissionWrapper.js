import { checkMicro, requestMicro } from './Permission';

export function checkMicroPermission() {
  return new Promise((resolve, reject) => {
    return checkMicro()
      .then(isAuthorized => {
        if (isAuthorized) {
          resolve(isAuthorized)
        } else {
          return requestMicro();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
