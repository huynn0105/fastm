// /* eslint-disable no-else-return */
// import { LoginManager, AccessToken } from 'react-native-fbsdk';

export const METHOD = {
  FACEBOOK: 'facebook',
  PHONE: 'phone',
};

const loginFacebook = () => {
  //   return new Promise((resolve, reject) => {
  //     LoginManager.logOut();
  //     LoginManager.logInWithReadPermissions(['public_profile', 'email'])
  //       .then(
  //         (result) => {
  //           if (result.isCancelled) {
  //             reject();
  //           } else {
  //             AccessToken.getCurrentAccessToken()
  //               .then((data) => {
  //                 resolve(data.accessToken.toString());
  //               })
  //               .catch(reject);
  //           }
  //         },
  //         () => {
  //           reject();
  //         }
  //       )
  //       .catch(() => {
  //         reject();
  //       });
  //   });
};

const loginService = (platform, data) => {
  if (platform === METHOD.FACEBOOK) {
    return loginFacebook();
  }
  return Promise.resolve(data);
};

export { loginService };
