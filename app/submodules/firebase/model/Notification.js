/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

// Extra Data example JSON:
// type:0,
// category: "admin",
// "extra_data": {
//   "title": "[Cập nhật] D.Sách QDE SCORE 100 - 16/04/2018",
//   "body": "Chọn để xem và tải file excel Danh sách QDE SCORE 100",
//   "screen_title": "",
//   "url": "http://appay.vn/cap-nhat-danh-sach-qde-score-100-06-04-2018/",
//   "img_url": "https://appay-rc.cloudcms.vn/data/post/image/90_20180406115154.png",
//   "tags": [
//       "important",
//       "promotion"
//   ]
// }

import moment from 'moment/min/moment-with-locales';

// --------------------------------------------------

export const NOTIFICATION_TYPES = {
  UNKNOWN: '-999',
  PLAIN_TEXT: '1',
  WEB_LINK: '2',
  WEB_STACK: '3',
  PLAIN_TEXT_WEB_LINK: '4',
  OPEN_VIEW: '5',
  CONFIRM_CTV: '6',
  NEWS_DETAILS: '10',
  MONEY_HISTORY: '11',
  POINTS_HISTORY: '12',
  EMPLOYEE_CARD: '13',
  FEEDBACK: '14',
  CHAT_MESSAGE: '70',
  CHAT_THREAD_CHANGE: '71',
  FORCE_LOGOUT: '1000',
  SHOW_LOGOUT_POPUP: '9999',
  CHANGE_PASS: '2000',
};

export const NOTIFICATION_CATEGORIES = {
  UNKNOWN: 'unknown',
  ADMIN: 'admin',
  SYSTEM: 'system',
  CHAT: 'chat',
};

// --------------------------------------------------
// Notification.js
// --------------------------------------------------

export default class Notification {
  static objectFromJSON(json) {
    const object = new Notification();

    const payload = json.data || {};
    const type = parseInt(payload.type, 10);
    const category = json.category;
    const extraData = payload.extra_data;

    object.uid = json.ID;
    object.type = type;
    object.category = category;
    object.title = extraData.title;
    object.details = extraData.body;
    object.image = extraData.img_url;
    object.extraData = extraData;
    object.createTime = json.createdDate;
    object.tags = extraData.tags;

    if (object.tags === undefined) {
      object.tags = [];
    }

    // by default object fetched from backend is not deleted
    object.isDeleted = false;

    // delete isRead so that it is not updated by Realm
    delete object.isRead;

    return object;
  }

  static objectFromJSONFB(json) {
    const object = new Notification();

    const payload = json.data || {};
    const type = payload.type;
    const category = payload.category;
    const extraData = payload.extra_data;

    object.uid = payload.notification_id;
    object.type = type;
    object.category = category;
    object.title = extraData?.title;
    object.details = extraData?.body;
    object.image = extraData?.img_url;
    object.url = extraData?.url;
    object.extraData = extraData;
    object.createTime = json?.createdDate;
    object.tags = extraData?.tags;
    object.read = payload?.read;
    object.flag = payload?.flag;
    object.subCategory = payload?.subCategory;

    if (object.tags === undefined) {
      object.tags = [];
    }

    // by default object fetched from backend is not deleted
    object.isDeleted = false;

    // delete isRead so that it is not updated by Realm
    delete object.isRead;

    return object;
  }

  // Standardlize notification for ios/android
  // -> use for firebase version 4.x
  static objectFromNotificationPayload(payload) {
    const object = new Notification();

    let notiData = {};
    let notiTitle = '';
    let notiDetails = '';
    if (payload.data !== undefined) {
      notiData = payload.data;
      notiTitle = payload.title || '';
      notiDetails = payload.body || '';
    } else if (payload._data !== undefined) {
      // eslint-disable-line
      notiData = payload._data; // eslint-disable-line
      notiTitle = payload._title || ''; // eslint-disable-line
      notiDetails = payload._body || ''; // eslint-disable-line
    }

    // check type
    const type = notiData.type;
    object.type = type;

    // category
    const category = notiData.category;
    if (!category || category.length === 0) {
      return null;
    }
    object.category = category;

    // notification id
    const notificationID = parseInt(notiData.notification_id, 10);
    if (notificationID && !isNaN(notificationID)) {
      object.uid = `${notificationID}`;
    }

    // basic info
    object.title = notiTitle;
    object.details = notiDetails;
    object.createTime = moment().unix();

    // extra data
    if (notiData.extra_data || notiData.extraDataJSON) {
      object.extraData = JSON.parse(notiData.extra_data || notiData.extraDataJSON);
    } else {
      object.extraData = {};
    }

    if (notiData.event) {
      object.event = JSON.parse(notiData.event);
    } else {
      object.event = [];
    }

    //---
    return object;
  }

  // --------------------------------------------------

  createTimeMoment() {
    if (!this.mCreateTimeMoment) {
      this.mCreateTimeMoment = moment(this.createTime, 'X');
    }
    return this.mCreateTimeMoment;
  }

  createTimeString(format = 'DD/MM/YYYY') {
    return this.createTimeMoment().format(format);
  }

  createTimeAgoString() {
    const time = this.createTimeMoment().fromNow();
    return time.replace(' trước', '').replace('một', '1');
  }

  imageURI() {
    if (!this.image || this.image.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.image };
  }

  imagePlaceholder() {
    return require('./img/noti_default.png');
  }

  isImportant() {
    return this.tags.reduce((result, item) => result === true || item === 'important', false);
  }

  isPromotion() {
    return this.tags.reduce((result, item) => result === true || item === 'promotion', false);
  }

  getDisplayTextForLastMessage = () => {
    return this.title;
  };

  static sampleData(category: string): {} {
    if (category === 'admin') {
      return {
        status: true,
        data: [
          {
            ID: '86',
            data: {
              notification_id: 86,
              type: 2,
              category: 'admin',
              extra_data: {
                title: 'Test 2',
                body: 'test',
                screen_title: '',
                url: 'http://appay.vn/dsa-information-285/',
                img_url: '',
                tags: ['important', 'promotion'],
              },
            },
            category: 'admin',
            createdDate: 1528283152,
          },
        ],
        data_pagination: {
          total_rows: '1',
          per_page: '10',
          page: '1',
        },
      };
    } else if (category === 'system') {
      return {
        status: true,
        data: [
          {
            ID: '6',
            data: {
              notification_id: 6,
              type: 3,
              category: 'system',
              extra_data: {
                title: 'Khách hàng mới !!!',
                body: 'Khách hàng Lead500, ở Hồ Chí Minh - Q. 3 có nhu cầu. Vui lòng liên hệ tư vấn trong vòng 30 phút. Người giới thiệu: PreDSA Test2',
                screen_title: 'FE Credit',
                unbackable_urls: ['https://appay-rc.cloudcms.vn/fe_credit/main/?subscriptionID=17'],
                urls_stack: [
                  'https://appay-rc.cloudcms.vn/fe_credit/main/?subscriptionID=17',
                  'https://appay-rc.cloudcms.vn/fe_credit/main/app_modify/?app_id=95924',
                ],
              },
            },
            category: 'system',
            createdDate: 1528194482,
          },
        ],
        data_pagination: {
          total_rows: '1',
          per_page: '10',
          page: '1',
        },
      };
    }
    return {};
  }
}

// REALM SCHEMA
// --------------------------------------------------

Notification.schema = {
  name: 'Notification',
  primaryKey: 'uid',
  properties: {
    uid: { type: 'string' },
    type: { type: 'string', optional: true, default: '0' },
    category: { type: 'string', optional: true, default: '' },
    title: { type: 'string', optional: true, default: '' },
    details: { type: 'string', optional: true, default: '' },
    image: { type: 'string', optional: true, default: '' },
    extraDataJSON: { type: 'string', optional: true, default: '{}' },
    createTime: { type: 'int', optional: true, default: 0 },
    isRead: { type: 'bool', optional: true, default: false },
    read: { type: 'bool', optional: true, default: false },
    isDeleted: { type: 'bool', optional: true, default: false },
    tagsJSON: { type: 'string', optional: true, default: '[]' },
  },
};

/**
 * Create a computed property to be able to store extraData in Realm
 * Don't use arrow function here, it will make computed property not working properly
 * Because of the context
 * https://github.com/tc39/proposal-object-values-entries/issues/18
 */
Object.defineProperty(Notification.prototype, 'extraData', {
  get: function () {
    // eslint-disable-line
    return this.extraDataJSON ? JSON.parse(this.extraDataJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.extraDataJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Notification.prototype, 'tags', {
  get: function () {
    // eslint-disable-line
    return this.tagsJSON ? JSON.parse(this.tagsJSON) : [];
  },
  set: function (value) {
    // eslint-disable-line
    this.tagsJSON = value ? JSON.stringify(value) : '[]';
  },
});

// OLD CODES: KEEP FOR REFERENCES
// --------------------------------------------------

// Standardlize notification for ios/android
// -> disabled, use for firebase version 3.x
/*
static objectFromNotificationPayload(payload) {
  const object = new Notification();

  // check type
  const type = parseInt(payload.type, 10);
  if (!type || isNaN(type)) {
    Utils.warn(`${LOG_TAG}.objectFromNotificationPayload type invalid`);
    return null;
  }
  object.type = type;

  // category
  const category = payload.category;
  if (!category || category.length === 0) {
    Utils.warn(`${LOG_TAG}.objectFromNotificationPayload category invalid`);
    return null;
  }
  object.category = category;

  // notification id
  const notificationID = parseInt(payload.notification_id, 10);
  if (notificationID && !isNaN(notificationID)) {
    object.uid = `${notificationID}`;
  }

  // extra data
  if (payload.extra_data) {
    object.extraData = JSON.parse(payload.extra_data);
  } else {
    object.extraData = {};
  }

  // for ios
  if (Platform.OS === 'ios') {
    const aps = payload.aps;
    if (!aps || !aps.alert) { return null; }
    object.title = aps.alert.title || '';
    object.details = aps.alert.body || '';
  }

  // for android
  if (Platform.OS === 'android') {
    const fcm = payload.fcm;
    if (!fcm) { return null; }
    object.title = fcm.title || '';
    object.details = fcm.body || '';
    // incase open from background
    if (payload.opened_from_tray) {
      object.title = object.extraData.title || ' ';
      object.details = object.extraData.body || ' ';
    }
  }

  object.createTime = moment().unix();
  return object;
}
*/
