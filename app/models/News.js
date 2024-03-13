/**
Sample JSON:

"postID": "1",
"categoryID": "1",
"postTitle": "Chương trình thi đua T8/2017",
"postContent": "Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017",
"postImage": "https://crm.digitel.vn/files/contests/vZBPd1jt.jpg",
"createdDate": 1507190995
*/

import moment from 'moment/min/moment-with-locales';
import { utf8Decode } from '../utils/Utils';

const base64 = require('base-64');

export default class News {

  static objectFromJSON(json) {
    const object = new News();

    // const bytes = base64.decode(json.postContent);
    // const htmlContent = utf8Decode(bytes);

    const sortPosition = parseInt(json.sortPosition, 10);
    const isHighlight = (json.isHighlight && json.isHighlight === '1') || false;

    object.uid = json.postID;
    object.categoryID = json.categoryID;
    object.title = json.postTitle || json.title;
    object.details = json.postDescription;
    object.detailsURL = json.webURL || json.url;
    // object.htmlContent = htmlContent;
    object.image = json.postImage || json.image;
    object.sortPosition = isNaN(sortPosition) ? 9999 : sortPosition;
    object.isHighlight = isHighlight;
    const checkInvalidViews = (views) => {
      return views === '-1' || views === '0';
    };
    object.totalViews = checkInvalidViews(json.countView) ? '' : `${json.countView}`;

    object.createTime = json.createdDate;

    // by default object fetched from backend is not deleted
    object.isDeleted = false;

    // delete isRead so that it is not updated by Realm
    delete object.isRead;

    return object;
  }

  static CategoryIDs = {
    NOTICE: '1',
    KNOWLEDGE: '2',
  }

  // UI Logic
  // --------------------------------------------------

  isNoticeNews() {
    return this.categoryID === '1';
  }

  isKnowledgeNews() {
    return this.categoryID === '2';
  }

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
    return this.createTimeMoment().fromNow();
  }

  imageURI() {
    if (!this.image || this.image.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.image };
  }

  imagePlaceholder() {
    return require('../img/placeholder.jpg');
  }

}

// REALM SCHEMA
// --------------------------------------------------

News.schema = {
  name: 'News',
  primaryKey: 'uid',
  properties: {
    uid: { type: 'string' },
    categoryID: { type: 'string', optional: true, default: '' },
    title: { type: 'string', optional: true, default: '' },
    details: { type: 'string', optional: true, default: '' },
    detailsURL: { type: 'string', optional: true, default: '' },
    htmlContent: { type: 'string', optional: true, default: '' },
    image: { type: 'string', optional: true, default: '' },
    isHighlight: { type: 'bool', optional: true, default: false },
    sortPosition: { type: 'int', optional: true, default: 9999 },
    totalViews: { type: 'string', optional: true, default: '' },
    createTime: { type: 'int', optional: true, default: 0 },
    isRead: { type: 'bool', optional: true, default: false },
    isDeleted: { type: 'bool', optional: true, default: false },
  },
};
