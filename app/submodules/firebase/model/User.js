/**
example JSON

"ID": "24",
"accessToken": "2eddcc57df21f98e4ce7fe2831859c5177b30...",
"firebaseToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ...",
"fullName": "Trần Anh Quân",
"idNumber": "024351339",
"idIssuedDate": 1413046800,
"idIssuedBy": "TP. HCM",
"dob": 655664400,
"sex": "male",
"mobilePhone": "0982746822",
"email": "tranquan221b@gmail.com",
"address": "191/2 Dương Văn Dương",
"bankNumber": "0122788820",
"bankName": "ACB",
"bankBrand": "Tân Sơn Nhì",
"money": "0",
"point": "0"

*/

import moment from 'moment/min/moment-with-locales';
import { prettyNumberString, prettyMoneyString } from '../utils/Utils';
import { getAvatarPlaceholder, hidePhoneNumber } from '../utils/UIUtils';

const removeDiacritics = require('diacritics').remove;

// --------------------------------------------------
// User
// --------------------------------------------------

export default class User {

  static PRESENCE_STATUS = {
    UNKNOWN: 'unknown',
    ONLINE: 'online',
    OFFLINE: 'offline',
    BUSY: 'busy',
    AWAY: 'away',
  };

  static PRESENCE_STATUS_COLOR = {
    UNKNOWN: '#7c7c7c',
    ONLINE: '#69E387',
    OFFLINE: '#7c7c7c',
    BUSY: '#ff0000',
    AWAY: '#7c7c7c',
  };

  static PRESENCE_STATUS_STRING = {
    UNKNOWN: 'Không hoạt động',
    ONLINE: 'Đang hoạt động',
    OFFLINE: 'Không hoạt động',
    BUSY: 'Đang bận',
    AWAY: 'Không ở gần',
  };

  get phoneNumber() {
    return this.mPhoneNumber;
  }

  set phoneNumber(value) {
    this.mPhoneNumber = value;
    this.standardPhoneNumber = User.standardizePhoneNumber(value);
  }

  // Static Methods
  // --------------------------------------------------

  /**
   * Setup my user
   */
  static mMyUser = {};
  static setupMyUser(user) {
    User.mMyUser = user;
  }

  /**
   * Parse object from firebase
   * @param {Object} json 
   */
  static objectFromJSON(json) {
    // invalid User
    if (!json.uid) {
      return null;
    }
    
    const user = new User();

    // parse
    Object.assign(user, json);
    user.dbUID = json.uid;
    
    // --
    return user;
  }

  /**
   * Parse object from login api
   * @param {Object} json 
   */
  static objectFromLoginJSON(json) {
    // invalid User
    if (!json.uid) {
      return null;
    }
    
    const user = new User();

    // parse
    user.uid = json.uid;
    user.dbUID = json.uid;
    user.accessToken = json.accessToken;
    user.firebaseToken = json.firebaseToken;
    user.cmnd = json.idNumber;
    user.cmndIssuedDate = json.idIssuedDate;
    user.cmndIssuedPlace = json.idIssuedBy;

    user.email = json.email;
    user.fullName = json.fullName;
    user.phoneNumber = json.mobilePhone;
    user.dateOfBirth = json.dob;
    user.gender = json.sex;
    user.address = json.address;

    user.bankAccount = json.bankNumber;
    user.bankAccountName = json.bankOwnerName;
    user.bankName = json.bankName;
    user.bankBranch = json.bankBranch;

    user.user_type = json.user_type;

    const totalMoney = parseInt(json.money, 10);
    const totalPoint = parseInt(json.point, 10);
    user.totalMoney = isNaN(totalMoney) ? 0 : totalMoney;
    user.totalPoint = isNaN(totalPoint) ? 0 : totalPoint;

    user.avatarImage = json.avatarImage;
    user.wallImage = json.wallImage;
    user.createTime = json.createdDate;

    user.SIPAccount = json.SIPAccount;
    user.SIPPassword = json.SIPPassword;
    user.SIPServer = json.SIPServer;

    return user;
  }

  /**
   * Standardize phoneNumber in order to filter appay contacts from device contacts
   * - user will have a props: `standardPhoneNumber` which is exactly `maxDigits` digits
   * - if the phoneNumber longer than `maxDigits` digits, the firsts one will be trimmed
   * - if the phoneNumber shorter thant `maxDigits` digits, 0 will be prepend
   */
  static standardizePhoneNumber(phoneNumber = '', maxDigits = 9) {
    // remove non-digits
    let standardPhoneNumber = phoneNumber.replace(/\D/g, '');
    // prepend zero if phone number too short
    while (standardPhoneNumber.length < maxDigits) {
      standardPhoneNumber = '0'.concat(standardPhoneNumber);
    }
    // trim
    const index = standardPhoneNumber.length - maxDigits;
    return standardPhoneNumber.slice(index);
  }

  static getPresenceStatusColor(status) {
    if (status === User.PRESENCE_STATUS.ONLINE) {
      return User.PRESENCE_STATUS_COLOR.ONLINE;
    }
    if (status === User.PRESENCE_STATUS.OFFLINE) {
      return User.PRESENCE_STATUS_COLOR.OFFLINE;
    }
    if (status === User.PRESENCE_STATUS.BUSY) {
      return User.PRESENCE_STATUS_COLOR.BUSY;
    }
    return User.PRESENCE_STATUS_COLOR.UNKNOWN;
  }

  static getPresenceStatusString(status) {
    if (status === User.PRESENCE_STATUS.ONLINE) {
      return User.PRESENCE_STATUS_STRING.ONLINE;
    }
    if (status === User.PRESENCE_STATUS.OFFLINE) {
      return User.PRESENCE_STATUS_STRING.OFFLINE;
    }
    if (status === User.PRESENCE_STATUS.BUSY) {
      return User.PRESENCE_STATUS_STRING.BUSY;
    }
    return User.PRESENCE_STATUS_STRING.UNKNOWN;
  }

  // UI Logic
  // --------------------------------------------------

  isMe() {
    return this.uid === User.mMyUser.uid;
  }

  avatarImageURI() {
    if (!this.avatarImage || this.avatarImage.length === 0) {
      return null;
    }
    return { uri: this.avatarImage };
  }

  wallImageURI() {
    if (!this.wallImage || this.wallImage.length === 0) {
      return this.wallImagePlaceholder();
    }
    return { uri: this.wallImage };
  }

  avatarImagePlaceholder() {
    return getAvatarPlaceholder(this.gender);
  }

  wallImagePlaceholder() {
    return require('./img/placeholder_wall1.jpg');
  }

  hiddenPhoneNumer() {
    if (!this.mHiddenPhoneNumber) {
      this.mHiddenPhoneNumber = hidePhoneNumber(this.phoneNumber);
    }
    return this.mHiddenPhoneNumber;
  }

  shortName() {
    if (!this.mShortName) {
      const words = this.fullName.split(' ');
      this.mShortName = words.length > 0 ? words[words.length - 1] : this.fullName;
    }
    return this.mShortName;
  }

  fullNameNoDiacritics() {
    if (!this.mFullNameNoDiacritics) {
      this.mFullNameNoDiacritics = removeDiacritics(this.fullName);
    }
    return this.mFullNameNoDiacritics;
  }

  cmndIssuedDateMoment() {
    if (!this.mCMNDIssuedDateMoment) {
      this.mCMNDIssuedDateMoment = moment(this.cmndIssuedDate, 'X');
    }
    return this.mCMNDIssuedDateMoment;
  }

  cmndIssuedDateString(format = 'DD/MM/YYYY') {
    return this.cmndIssuedDateMoment().format(format);
  }

  cmndIssuedPlaceString() {
    return this.cmndIssuedPlace ? this.cmndIssuedPlace : ' ';
  }

  dateOfBirthMoment() {
    if (!this.mDateOfBirthMoment) {
      this.mDateOfBirthMoment = moment(this.dateOfBirth, 'X');
    }
    return this.mDateOfBirthMoment;
  }

  dateOfBirthString(format = 'DD/MM/YYYY') {
    return this.dateOfBirthMoment().format(format);
  }

  genderString() {
    if (this.gender === 'male') return 'Nam';
    if (this.gender === 'female') return 'Nữ';
    return ' ';
  }

  totalMoneyPrettyString() {
    return prettyMoneyString(this.totalMoney);
  }

  totalPointPrettyString() {
    return prettyNumberString(this.totalPoint);
  }

  createTimeMoment() {
    if (!this.mCreateTimeMoment) {
      this.mCreateTimeMoment = moment(this.createTime, 'X');
    }
    return this.mCreateTimeMoment;
  }

  createTimeAgoString() {
    if (moment().diff(this.createTimeMoment(), 'years') > 1) {
      return this.createTimeMoment().format('DD/MM/YYYY');
    }
    return this.createTimeMoment().fromNow();
  }

  statusColor() {
    return '#38B7FC';
  }

  statusString() {
    return 'Đang hoạt động';
  }

  presenceStatusColor() {
    return User.getPresenceStatusColor(this.presenceStatus);
  }

  presenceStatusString() {
    return User.getPresenceStatusString(this.presenceStatus);
  }
}

// REALM SCHEMA
// --------------------------------------------------

User.schema = {
  name: 'User',
  primaryKey: 'dbUID',
  properties: {
    dbUID: { type: 'string' },
    uid: { type: 'string' },
    
    cmnd: { type: 'string', optional: true, default: '' },
    cmndIssuedDate: { type: 'int', optional: true, default: 0 },
    cmndIssuedPlace: { type: 'string', optional: true, default: '' },
    
    email: { type: 'string', optional: true, default: '' },
    fullName: { type: 'string', optional: true, default: '' },
    phoneNumber: { type: 'string', optional: true, default: '' },
    dateOfBirth: { type: 'string', optional: true, default: '' },
    gender: { type: 'string', optional: true, default: '' },
    address: { type: 'string', optional: true, default: '' },
    
    bankAccount: { type: 'string', optional: true, default: '' },
    bankAccountName: { type: 'string', optional: true, default: '' },
    bankName: { type: 'string', optional: true, default: '' },
    bankBranch: { type: 'string', optional: true, default: '' },
    
    totalMoney: { type: 'int', optional: true, default: 0 },
    totalPoint: { type: 'int', optional: true, default: 0 },
    avatarImage: { type: 'string', optional: true, default: '' },
    wallImage: { type: 'string', optional: true, default: '' },
    
    createTime: { type: 'int', optional: true, default: 0 },
    
    isFavorite: { type: 'bool', optional: true, default: false },
    isDeleted: { type: 'bool', optional: true, default: false },
  },
};
