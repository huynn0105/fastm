/**
 * Chat Thread
 * - stored in realm db, primary key is dbUID
 */

import moment from 'moment/min/moment-with-locales';

import User from './User';

// --------------------------------------------------
// Thread Type: refer from FirebaseDatabase.js
// --------------------------------------------------
export const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
  PUBLIC: 'public',
};

// --------------------------------------------------
// Thread
// --------------------------------------------------
export default class Thread {

  // Static Methods
  // --------------------------------------------------

  static mMyUser = {};
  static setupMyUser(user) {
    Thread.mMyUser = user;
  }

  static objectFromJSON(json) {
    const object = new Thread();

    // invalid message
    if (!json) {
      return null;
    }

    // parse
    object.dbUID = json.uid;
    object.uid = json.uid;
    object.type = json.type;
    object.title = json.title;
    object.photoImage = json.photoImage;
    object.backgroundImage = json.backgroundImage;
    object.adminID = json.adminID;
    object.users = json.users;
    object.usersDetails = json.usersDetails;
    object.readTimes = json.readTimes;
    object.createTime = json.createTime;
    object.updateTime = json.updateTime;
    object.isDeleted = json.isDeleted || false;

    object.pinnedText = json.pinnedText;
    object.password = json.password;

    // isNotificationOn
    const isNotificationOns = json.isNotificationOns || {};
    object.isNotificationOn = isNotificationOns[`user_${Thread.mMyUser.uid}`] !== undefined ? 
      isNotificationOns[`user_${Thread.mMyUser.uid}`] : true;

    // isFavorite
    const isFavorites = json.isFavorites || {};
    object.isFavorite = isFavorites[`user_${Thread.mMyUser.uid}`] !== undefined ?
      isFavorites[`user_${Thread.mMyUser.uid}`] : false;
    
    // is deleted
    const isDeletedByUsers = json.isDeletedByUsers || {};
    object.isDeletedByMe = isDeletedByUsers[`user_${Thread.mMyUser.uid}`] !== undefined ?
    isDeletedByUsers[`user_${Thread.mMyUser.uid}`] : false;

    object.isDeletedBySomeone = Object.keys(isDeletedByUsers).length > 0;

    return object;
  }

  mGetDefaultSingleThreadTitle() {
    const targetUser = this.getSingleThreadTargetUser();
    return targetUser ? (targetUser.fullName || '') : 'Chat';
  }

  mGetDefaultGroupThreadTitle() {
    const users = this.getUsersDetailsArray();
    const names = users.map((user) => {
      const words = user.fullName.trim().split(' ');
      return words.length > 0 ? words[words.length - 1] : user.fullName.trim();
    });
    const title = names.join(', ');
    return title;
  }

  // UI Logic
  // --------------------------------------------------

  isSingleThread() {
    return this.type === THREAD_TYPES.SINGLE;
  }

  isGroupThread() {
    return this.type === THREAD_TYPES.GROUP;
  }

  isPublicThread() {
    return this.type === THREAD_TYPES.PUBLIC;
  }

  isMeInGroupThread() {
    const users = this.getUsersArray();
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      if (user.uid === Thread.mMyUser.uid) {
        return true;
      }
    }
    return false;
  }

  isChatDisabled() {
    if (this.isGroupThread()) {
      return this.isMeInGroupThread() === false;
    }
    return false;
  }

  chatDisabledReason() {
    return 'Bạn đã rời khỏi nhóm';
  }

  /**
   * return the current users in the chat
   * - not count who already removed or left
   * - not contain many info, must combine with userDetails to get full info
   */
  getUsersArray() {
    const object = this.users;
    const keys = Object.keys(object);
    if (!this.mUsersArray || this.mUsersArray.length !== keys.length) {
      this.mUsersArray = keys.map(key => {
        const userJSON = object[key];
        return Object.assign(new User(), userJSON);
      });
    }
    return this.mUsersArray;
  }

  /**
   * return all users details has joined the chat, 
   * - even if they don't in the chat now
   */
  getUsersDetailsArray() {
    const object = this.usersDetails;
    const keys = Object.keys(object);
    if (!this.mUsersDetailsArray || this.mUsersDetailsArray.length !== keys.length) {
      this.mUsersDetailsArray = keys.map(key => {
        const userJSON = object[key];
        return Object.assign(new User(), userJSON);
      });
    }
    return this.mUsersDetailsArray;
  }

  /**
   * return the current users details which still in the chat
   * - not count who already removed or left
   */
  getMembersArray() {
    const details = this.usersDetails;
    const keys = Object.keys(this.users);
    return keys.map(key => {
      const userJSON = details[key];
      return Object.assign(new User(), userJSON);
    });
  }

  getSingleThreadTargetUser() {
    // check
    if (!this.isSingleThread()) {
      return null;
    }
    // get target
    if (!this.mSingleThreadTargetUser) {
      const users = this.getUsersDetailsArray();
      const myUserID = Thread.mMyUser.uid;
      this.mSingleThreadTargetUser = users[0].uid === myUserID ? users[1] : users[0];
    }
    return this.mSingleThreadTargetUser;
  }

  createTimeMoment() {
    if (!this.mCreateTimeMoment) {
      this.mCreateTimeMoment = moment(this.createTime, 'x');
    }
    return this.mCreateTimeMoment;
  }

  updateTimeMoment() {
    if (!this.mUpdateTimeMoment) {
      this.mUpdateTimeMoment = moment(this.updateTime, 'x');
    }
    return this.mUpdateTimeMoment;
  }

  createTimeString(format = 'DD/MM/YYYY') {
    return this.createTimeMoment().format(format);
  }

  createTimeAgoString() {
    return this.createTimeMoment().fromNow();
  }

  updateTimeString(format = 'DD/MM/YYYY') {
    return this.updateTimeMoment().format(format);
  }

  // work around for wrong local timezone
  updateTimeAgoString() {
    return this.updateTimeMoment().fromNow()
    .replace(' trước', '')
    .replace(' tới', '')
    .replace('một', '1');
  }

  titleString() {
    // single
    if (this.type === THREAD_TYPES.SINGLE) {
      if (!this.mSingleThreadTitle) {
        this.mSingleThreadTitle = this.mGetDefaultSingleThreadTitle();
      }
      return this.mSingleThreadTitle;
    }
    // group
    if (this.type === THREAD_TYPES.GROUP) {
      if (!this.title || this.title.length === 0) {
        if (!this.mGroupThreadTitle) {
          this.mGroupThreadTitle = this.mGetDefaultGroupThreadTitle();
        }
        return this.mGroupThreadTitle;
      }
    }
    // others
    return this.title;
  }

  statusString() {
    // single -> will be handle on ui, because to get the contact status
    // I must import ContactsManager, which make the model complex
    if (this.type === THREAD_TYPES.SINGLE) {
      return '';
    }
    // group
    if (this.type === THREAD_TYPES.GROUP) {
      const totalMembers = this.getUsersArray().length;
      return `${totalMembers} người tham gia`;
    }
    // others
    return '';
  }

  photoImageURI() {
    // single
    if (this.isSingleThread()) {
      const targetUser = this.getSingleThreadTargetUser();
      return targetUser.avatarImageURI();
    }
    // group
    if (!this.photoImage || this.photoImage.length === 0) {
      return this.photoImagePlaceholder();
    }
    return { uri: this.photoImage };
  }

  photoImagePlaceholder() {
    return require('./img/thread.png');
  }

  backgroundImageURI() {
    if (!this.backgroundImage || this.backgroundImage.length === 0) {
      return null;
    }
    return { uri: this.backgroundImage };
  }

  totalUnReadMessages() {
    return 0;
  }
}

// REALM SCHEMA
// --------------------------------------------------

Thread.schema = {
  name: 'Thread',
  primaryKey: 'dbUID',
  properties: {
    dbUID: { type: 'string' },
    uid: { type: 'string' },
    type: { type: 'string' },
    title: { type: 'string', optional: true, default: '' },
    photoImage: { type: 'string', optional: true, default: '' },
    backgroundImage: { type: 'string', optional: true, default: '' },
    adminID: { type: 'string', optional: true, default: '' },
    usersJSON: { type: 'string', optional: true, default: '{}' },
    usersDetailsJSON: { type: 'string', optional: true, default: '{}' },
    readTimesJSON: { type: 'string', optional: true, default: '{}' },
    createTime: { type: 'int', optional: true, default: 0 },
    updateTime: { type: 'int', optional: true, default: 0 },
    isFavorite: { type: 'bool', optional: true, default: false },
    isNotificationOn: { type: 'bool', optional: true, default: true },
    isDeleted: { type: 'bool', optional: true, default: false },
    isDeletedByMe: { type: 'bool', optional: true, default: false },
    isDeletedBySomeone: { type: 'bool', optional: true, default: false },
    pinnedText: { type: 'string', optional: true, default: '' },
    password: { type: 'string', optional: true }
  },
};

/**
 * store users in Realm
 */
Object.defineProperty(Thread.prototype, 'users', {
  get: function () { // eslint-disable-line
    return this.usersJSON ? JSON.parse(this.usersJSON) : {};
  },
  set: function (value) { // eslint-disable-line
    this.usersJSON = value ? JSON.stringify(value) : '{}';
  },
});

/**
 * store usersDetails in Realm
 */
Object.defineProperty(Thread.prototype, 'usersDetails', {
  get: function () { // eslint-disable-line
    return this.usersDetailsJSON ? JSON.parse(this.usersDetailsJSON) : {};
  },
  set: function (value) { // eslint-disable-line
    this.usersDetailsJSON = value ? JSON.stringify(value) : '{}';
  },
});

/**
 * store readTimes in Realm
 */
Object.defineProperty(Thread.prototype, 'readTimes', {
  get: function () { // eslint-disable-line
    return this.readTimesJSON ? JSON.parse(this.readTimesJSON) : {};
  },
  set: function (value) { // eslint-disable-line
    this.readTimesJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Thread.prototype, 'comparableObj', {
  get: function () { // eslint-disable-line
    const object = Object.assign({}, this);
    object.readTimesJSON = this.readTimes;
    object.usersDetailsJSON = this.usersDetails;
    object.usersJSON = this.users;
    return object;
  },
});
