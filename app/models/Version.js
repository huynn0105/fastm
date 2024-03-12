// @flow

// "data": {
//   "ios_action": "alert_update",
//   "ios_message": "test 1",
//   "ios_appStore": "https://itunes.apple.com/app/appay/id1317177765",
//   "android_action": "force_update",
//   "android_message": "test 2",
//   "android_appStore": "https://play.google.com/store/apps/details?id=com.digipay.mfast"
// }

export default class Version {

  iosVersion = '';
  iosAction = '';
  iosMessage = '';
  iosAppStore = '';
  androidVersion = '';
  androidAction = '';
  androidMessage = '';
  androidAppStore = '';

  static objectFromJSON(json: {
    ios_version: string,
    ios_action: string,
    ios_message: string,
    ios_appStore: string,
    android_version: string,
    android_action: string,
    android_message: string,
    android_appStore: string,
  }) {
    const object = new Version();
    object.iosVersion = json.ios_version;
    object.iosAction = json.ios_action;
    object.iosMessage = json.ios_message;
    object.iosAppStore = json.ios_appStore;

    object.androidVersion = json.android_version;
    object.androidAction = json.android_action;
    object.androidMessage = json.android_message;
    object.androidAppStore = json.android_appStore;
    return object;
  }

  getInfo(os: string): {
    version: string,
    message: string,
    appstore: string,
    forceToUpdate: boolean,
    isShowUpdate: boolean,
  } {
    return os === 'ios' ?
      {
        version: this.iosVersion,
        message: this.iosMessage,
        appstore: this.iosAppStore,
        forceToUpdate: this.iosAction === APP_UPDATE_ACTION.force_update,
        isShowUpdate:
          (this.iosAction === APP_UPDATE_ACTION.force_update ||
            this.iosAction === APP_UPDATE_ACTION.alert_update),
      }
      :
      {
        version: this.androidVersion,
        message: this.androidMessage,
        appstore: this.androidAppStore,
        forceToUpdate: this.androidAction === APP_UPDATE_ACTION.force_update,
        isShowUpdate:
          (this.androidAction === APP_UPDATE_ACTION.force_update ||
            this.androidAction === APP_UPDATE_ACTION.alert_update),
      };
  }


  // const updateInfoDummy = {
  //   android_action: "force_update",
  //   android_appStore: "https://play.google.com/store/apps/details?id=com.digipay.mfast",
  //   android_message: "Vui lòng cập nhật để trải nghiệm những tính năng mới nhất",
  //   android_version: "1.2.2",
  //   ios_action: "force_update",
  //   ios_appStore: "https://apps.apple.com/app/id1494079210",
  //   ios_message: "Vui lòng cập nhật để trải nghiệm những tính năng mới nhất",
  //   ios_version: "1.2.2",
  // }

  static sampleData(): {} {
    return {
      status: true,
      data: {
        ios_version: '2.1',
        ios_action: 'do_nothing',
        ios_message: 'testtest 1',
        ios_appStore: 'https://itunes.apple.com/app/appay/id1317177765',
        android_version: '2.1',
        android_action: 'do_nothing',
        android_message: 'testtest 2',
        android_appStore: 'https://play.google.com/store/apps/details?id=com.digipay.mfast',
      },
    };
  }
}

export const APP_UPDATE_ACTION = {
  do_nothing: 'do_nothing',
  alert_update: 'alert_update',
  force_update: 'force_update',
};
