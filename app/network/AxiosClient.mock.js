// @flow

import { Version, Notification, Contest, UserApp, UserAppLight, Help, ShopItem, DELMob } from 'app/models';
import { Configs, isMockAPI, isProduction } from 'app/constants/configs';
import AxiosClient from './AxiosClient';

const loadMock = () => {
  const MockAdapter = require('axios-mock-adapter');
  const mock = new MockAdapter(AxiosClient.shared(), { delayResponse: 500 });

  mock.onGet(`${Configs.apiBaseURL}/main/version`).reply(200, Version.sampleData());

  mock.onGet(`${Configs.apiBaseURL}/main/promotions`).reply(200, {
  });

  mock.onGet(`${Configs.apiBaseURL}/main/notification_list`).reply(function (param) {
    return [200, Notification.sampleData(param.params.category)];
  });

  mock.onGet(`${Configs.apiBaseURL}/main/contests`).reply(function (param) {
    return [200, Contest.sampleData()];
    // return [200, Contest.sampleDataEmpty()];
    // return [200, Contest.sampleDataFail()];
  });
  mock.onGet(`${Configs.apiBaseURL}/main/tools`).reply(function (param) {
    return [200, Help.sampleData()];
    // return [200, Help.sampleDataEmpty()];
    // return [200, Help.sampleDataFail()];
  });
  mock.onGet(`${Configs.apiBaseURL}/fe_del/dpd_2`).reply(function (param) {
    return [200, { status: false, data: [] }];
    // return [200, Contest.sampleDataEmpty()];
    // return [200, Contest.sampleDataFail()];
  });
  mock.onGet(`${Configs.apiBaseURL}/fe_del/dpd_3`).reply(function (param) {
    return [200, { status: Math.floor((Math.random() * 2) + 1) === 1 ?  true : false, data: DELMob.fakeData() }];
    // return [200, { status: true, data: DELMob.fakeData() }];
  });

  mock.onGet(`${Configs.apiBaseURL}/user/app_list`).reply(function (param) {
    return [200, UserApp.sampleData()];
  });
  mock.onGet(`${Configs.apiBaseURL}/user/app_list_period`).reply(function (param) {
    return [200, UserAppLight.sampleData()];
  });

  mock.onGet(`${Configs.apiBaseURL}/main/shop_items`).reply(function (param) {
    return [200, ShopItem.sampleData()];
  });

  mock.onGet(`${Configs.apiBaseURL}/main/app-info`).reply(200, {
    "status": true,
    "data": {
      "ios": {
        "version": "1.2.0",
        "details": "Cập nhật game show \"Say Appay, bay cùng Worldcup\"",
        "appstore": "https://itunes.apple.com/app/appay/id1317177765",
        "forceToUpdate": false
      },
      "android": {
        "version": "1.2.0",
        "details": "Cập nhật game show \"Say Appay, bay cùng Worldcup\"",
        "appstore": "https://play.google.com/store/apps/details?id=com.digipay.mfast",
        "forceToUpdate": false
      },
      "contactEmail": "hotro@appay.vn",
      "contactPhoneNumber": "0899909789",
      "contactPhoneNumberPretty": "08999.09789",
      "introduceUrl": "https://appay.cloudcms.vn/introduce-appay",
      "termsOfUsageUrl": "https://appay.cloudcms.vn/terms-of-use",
      "privacyPolicyUrl": "https://appay.cloudcms.vn/privacy-policy",
      "zaloFanpageURL": "https://zalo.me/797336384152903597",
      "zaloFanpageText": "APPAY Fanpage",
      "workingHourLine1": "T2 đến T6: 8:30 - 18:00",
      "workingHourLine2": "T7: 8:00 - 12:00",
      "faqUrl": "http://appay.vn/category/cau-hoi-thong-dung/",
      "addBankURL": "https://appay.cloudcms.vn/fe_credit/banking/add",
      "muasamTheCao": "https://appay.cloudcms.vn/none",
      "muasamBaoHiemXeMay": "https://appay.cloudcms.vn/none",
      "muasamBaoHiemSucKhoe": "https://appay.cloudcms.vn/none",
      "appContestText": "Thang 7 mock",
      "appContestImage": "https://appay-rc.cloudcms.vn/assets/img/contests/predsa.png"
    }
  });

  // mock.onGet(`${Configs.apiBaseURL}/main/app-freeze`).reply(function (param) {
  //   const random = Math.floor((Math.random() * 10) + 1) % 2;
  //   console.log(random);
  //   return [200, { status: random, freeze_page: "https://appay-rc.cloudcms.vn/freeze" }];
  // });

  mock.onAny().passThrough();
};

if (isProduction === false) {
  if (isMockAPI) {
    loadMock();
  }
}
