/**
 * Chat Message
 * - stored in realm db, primary key is dbUID
 */
import moment from 'moment/min/moment-with-locales';
import {
  MESSAGE_IMAGE_KEYS,
  MESSAGE_VIDEO_KEYS,
  MESSAGE_AUDIO_KEYS,
} from '../network/FirebaseDataKeys';

import Native from '../Bridge';
import DeviceInfo from 'react-native-device-info';

// for encrypt mess

const sha1 = require('sha1');

// --------------------------------------------------
// Message Type: refer from FirebaseDatabase.js
// --------------------------------------------------
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGES: 'images',
  LOCATION: 'location',
  NOTICE: 'notice',
  STICKER: 'sticker',
  VIDEOS: 'videos',
  AUDIOS: 'audios',
};

// --------------------------------------------------
// Message
// --------------------------------------------------
export default class Message {
  // Static Methods
  // --------------------------------------------------

  static mMyUser = {};
  static mMyDeviceID = DeviceInfo.getUniqueId();

  static setupMyUser(user) {
    Message.mMyUser = user;
  }

  static newStickerMessage(text) {
    const message = new Message();
    message.text = 'Vừa gửi sticker';
    message.htmlText = text;
    message.type = MESSAGE_TYPES.STICKER;
    return message;
  }

  static newTextMessage(text, tagData) {
    const message = new Message();
    message.text = text;
    message.type = MESSAGE_TYPES.TEXT;
    message.tagData = tagData;
    return message;
  }

  static newTextMessageAndQuote(text, { quotedText, quotedType, quotedID }, tagData) {
    const message = new Message();
    message.text = text;
    message.quotedText = quotedText;
    message.quotedType = quotedType;
    message.quotedID = quotedID;
    message.type = MESSAGE_TYPES.TEXT;
    message.tagData = tagData;
    return message;
  }

  static newImagesMessage(localURIs) {
    // map list of localURIs to dict of imageURL
    const imageURLs = localURIs
      .map((uri) => {
        const imageName = uri.replace(/^.*[\\/]/, '');
        const imageID = sha1(imageName);
        const imageURL = {};
        imageURL[MESSAGE_IMAGE_KEYS.IMAGE_ID] = imageID;
        imageURL[MESSAGE_IMAGE_KEYS.SENDER_DEVICE_ID] = Message.mMyDeviceID;
        imageURL[MESSAGE_IMAGE_KEYS.SENDER_LOCAL_URI] = uri;
        return imageURL;
      })
      .reduce((acc, image) => {
        acc[image.imageID] = image;
        return acc;
      }, {});
    // create message
    const message = new Message();
    message.imageURLs = imageURLs;
    message.type = MESSAGE_TYPES.IMAGES;

    // get image size
    if (localURIs && localURIs.length >= 1) {
      return new Promise((resolve) => {
        const source = localURIs[0];
        Native.getImageSize(source, (w, h) => {
          message.width = w;
          message.height = h;
          resolve(message);
        });
      });
    }

    return Promise.resolve(message);
  }

  static newVideosMessage(localURIs) {
    // map list of localURIs to dict of videoURL
    const videoURLs = localURIs
      .map((uri) => {
        const videoName = uri.replace(/^.*[\\/]/, '');
        const videoID = sha1(videoName);
        const videoURL = {};
        videoURL[MESSAGE_VIDEO_KEYS.VIDEO_ID] = videoID;
        videoURL[MESSAGE_VIDEO_KEYS.SENDER_DEVICE_ID] = Message.mMyDeviceID;
        videoURL[MESSAGE_VIDEO_KEYS.SENDER_LOCAL_URI] = uri;
        return videoURL;
      })
      .reduce((acc, video) => {
        acc[video.videoID] = video;
        return acc;
      }, {});
    // create message
    const message = new Message();
    message.videoURLs = videoURLs;
    message.type = MESSAGE_TYPES.VIDEOS;

    // get video size
    if (localURIs && localURIs.length >= 1) {
      return new Promise((resolve) => {
        resolve(message);
      });
    }

    return Promise.resolve(message);
  }

  static newAudiosMessage(localURIs) {
    // map list of localURIs to dict of audioURL
    const audioURLs = localURIs
      .map((uri) => {
        const audioName = uri.replace(/^.*[\\/]/, '');
        const audioID = sha1(audioName);
        const audioURL = {};
        audioURL[MESSAGE_AUDIO_KEYS.AUDIO_ID] = audioID;
        audioURL[MESSAGE_AUDIO_KEYS.SENDER_DEVICE_ID] = Message.mMyDeviceID;
        audioURL[MESSAGE_AUDIO_KEYS.SENDER_LOCAL_URI] = uri;
        return audioURL;
      })
      .reduce((acc, audio) => {
        acc[audio.audioID] = audio;
        return acc;
      }, {});
    // create message
    const message = new Message();
    message.audioURLs = audioURLs;
    message.type = MESSAGE_TYPES.AUDIOS;

    // get audio size
    if (localURIs && localURIs.length >= 1) {
      return new Promise((resolve) => {
        resolve(message);
      });
    }

    return Promise.resolve(message);
  }

  static newLocationMessage(location) {
    const message = new Message();
    message.location = location;
    message.type = MESSAGE_TYPES.LOCATION;
    return message;
  }

  static newNoticeMessage(text) {
    const message = new Message();
    message.text = text;
    message.type = MESSAGE_TYPES.NOTICE;
    return message;
  }

  /**
   * ImageID is sha1 of image name
   */
  static genImageIDFromImageURI(uri) {
    const imageName = uri.replace(/^.*[\\/]/, '');
    const imageID = sha1(imageName);
    return imageID;
  }

  static getImagePlaceholderURL() {
    return 'placeholder';
  }

  /**
   * Return senderLocalURI if senderDeviceID is current device
   */
  static getLocalImageURI(imageInfo) {
    const deviceID = imageInfo[MESSAGE_IMAGE_KEYS.SENDER_DEVICE_ID];
    if (deviceID && deviceID === Message.mMyDeviceID) {
      const localURI = imageInfo[MESSAGE_IMAGE_KEYS.SENDER_LOCAL_URI];
      if (localURI && localURI.length > 0) {
        return localURI;
      }
    }
    return null;
  }
  static getLocalVideoURI(videoInfo) {
    const deviceID = videoInfo[MESSAGE_VIDEO_KEYS.SENDER_DEVICE_ID];
    if (deviceID && deviceID === Message.mMyDeviceID) {
      const localURI = videoInfo[MESSAGE_VIDEO_KEYS.SENDER_LOCAL_URI];
      if (localURI && localURI.length > 0) {
        return localURI;
      }
    }
    return null;
  }

  /**
   * return thumb image url if having
   */
  static getThumbImageURL(imageInfo) {
    const thumbImageURL = imageInfo[MESSAGE_IMAGE_KEYS.SERVER_THUMB_IMAGE_URL];
    if (thumbImageURL && thumbImageURL.length > 0) {
      return thumbImageURL;
    }
    return null;
  }

  /**
   * return image url if having
   */
  static getImageURL(imageInfo) {
    const imageURL = imageInfo[MESSAGE_IMAGE_KEYS.SERVER_IMAGE_URL];
    if (imageURL && imageURL.length > 0) {
      return imageURL;
    }
    return null;
  }
  static getVideoURL(videoInfo) {
    const videoURL = videoInfo[MESSAGE_VIDEO_KEYS.SERVER_VIDEO_URL];
    if (videoURL && videoURL.length > 0) {
      return videoURL;
    }
    return null;
  }
  static getAudioURL(audioInfo) {
    const audioURL = audioInfo[MESSAGE_AUDIO_KEYS.SERVER_AUDIO_URL];
    if (audioURL && audioURL.length > 0) {
      return audioURL;
    }
    return null;
  }

  static getDisplayImageURL(imageInfo, priority = null) {
    // 1. get by priority
    // try to get thumb image first
    if (priority === 'thumb') {
      const thumbImageURL = Message.getThumbImageURL(imageInfo);
      if (thumbImageURL) {
        return thumbImageURL;
      }
    }
    // try to get full first
    else if (priority === 'full') {
      const imageURL = Message.getImageURL(imageInfo);
      if (imageURL) {
        return imageURL;
      }
    }
    // try to get local first
    else if (priority === 'local') {
      const localURI = Message.getLocalImageURI(imageInfo);
      if (localURI) {
        return localURI;
      }
    }
    // --
    // 2. default priority
    // try to get thumb image
    const thumbImageURL = Message.getThumbImageURL(imageInfo);
    if (thumbImageURL) {
      return thumbImageURL;
    }
    // try to get image
    const imageURL = Message.getImageURL(imageInfo);
    if (imageURL) {
      return imageURL;
    }
    // try to get image
    const localURI = Message.getLocalImageURI(imageInfo);
    if (localURI) {
      return localURI;
    }
    // placeholder
    return '';
  }
  static getDisplayVideoURL(videoInfo) {
    const videoURL = Message.getVideoURL(videoInfo);
    if (videoURL) {
      return videoURL;
    }
    const localURI = Message.getLocalVideoURI(videoInfo);
    if (localURI) {
      return localURI;
    }
    return '';
  }
  static getDisplayAudioURL(videoInfo) {
    const videoURL = Message.getAudioURL(videoInfo);
    if (videoURL) {
      return videoURL;
    }
    return '';
  }

  /**
   * Parse Message object from json
   * @param {Object} json object from firebase database
   */
  static objectFromJSON(json) {
    const object = new Message();

    // invalid message
    if (!json.uid || !json.threadID) {
      return null;
    }

    // parse
    object.dbUID = `${json.threadID}_${json.uid}`;
    object.uid = json.uid;
    object.threadID = json.threadID;
    object.type = json.type;
    object.authorID = json.authorID;
    object.authorFullName = json.authorFullName || '';
    object.authorAvatarImage = json.authorAvatarImage || '';
    object.text = json.text || '';

    // for encrypt mess
    // if (json.text && json.isEncrypted) {
    //   const encryptor = new Encryptor('1234567812345678');
    //   const detext = encryptor.decrypt(json.text);
    //   object.text = detext.toString(CryptoJS.enc.Utf8);
    // }

    object.quotedID = json.quotedID;
    object.quotedText = json.quotedText;
    object.quotedType = json.quotedType;

    object.htmlText = json.htmlText || '';
    object.imageURLs = json.imageURLs || {};
    object.videoURLs = json.videoURLs || {};
    object.audioURLs = json.audioURLs || {};
    object.location = json.location || {};
    object.createTime = json.createTime || 0;
    object.updateTime = json.updateTime || 0;
    object.isDeleted = json.isDeleted;
    object.isDeletedBy = json.isDeletedBy;
    object.isReceivedBy = json.isReceivedBy;

    object.reaction = json.reaction;

    object.isRecalled = json.isRecalled ? json.isRecalled : false;
    if (object.isRecalled) {
      object.text = 'Tin nhắn đã được thu hồi';
      object.type = MESSAGE_TYPES.TEXT;
    }

    object.width = json.width;
    object.height = json.height;

    object.hide = object.isDeletedBy[`user_${Message.mMyUser.uid}`] === true;
    object.isReceived = json.isReceivedBy !== undefined;

    object.type_createTime = json.type_createTime;

    if (json.tagDataJSON) {
      object.tagData = JSON.parse(json.tagDataJSON);
    }

    return object;
  }

  isReceivedByMe() {
    return this.isReceivedBy[`user_${Message.mMyUser.uid}`] === true;
  }

  // Logic
  // --------------------------------------------------

  isMeAuthor() {
    return this.authorID === Message.mMyUser.uid;
  }
  isTextMessage() {
    return this.type === MESSAGE_TYPES.TEXT;
  }
  isImagesMessage() {
    return this.type === MESSAGE_TYPES.IMAGES;
  }
  isVideosMessage() {
    return this.type === MESSAGE_TYPES.VIDEOS;
  }
  isAudiosMessage() {
    return this.type === MESSAGE_TYPES.AUDIOS;
  }
  isNoticeMessage() {
    return this.type === MESSAGE_TYPES.NOTICE;
  }
  isLocationMessage() {
    return this.type === MESSAGE_TYPES.LOCATION;
  }
  isStickerMessage() {
    return this.type === MESSAGE_TYPES.STICKER;
  }

  setAuthorWithUser(user) {
    this.authorID = user.uid;
    this.authorFullName = user.fullName || '';
    this.authorAvatarImage = user.avatarImage || '';
  }

  // UI Logic
  // --------------------------------------------------

  isToday() {
    return moment(this.createTime).isSame(moment(), 'day');
  }

  formatedTimeInHour() {
    const format = this.isToday() ? 'HH:mm' : 'HH:mm DD/MM';
    return this.createTimeMoment().format(format);
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

  getAuthorShortName() {
    if (!this.mAuthorShortName) {
      const names = this.authorFullName.split(' ');
      this.mAuthorShortName = names.length > 0 ? names[names.length - 1] : this.authorFullName;
    }
    return this.mAuthorShortName;
  }

  getDisplayText() {
    if (this.isLocationMessage() || this.isImagesMessage()) {
      return '';
    }
    return this.text;
  }

  getImageFromQuotedText() {
    const components = this.quotedText.split('>>>');
    let imageURL = '';
    if (components !== undefined && components.length === 2) {
      imageURL = components[1];
    }
    return imageURL.trim();
  }

  getDisplayImage() {
    const imageIDs = Object.keys(this.imageURLs);
    const imageID = imageIDs[0];
    const imageInfo = this.imageURLs[imageID];
    if (imageIDs.length === 0) {
      if (this.quotedType === MESSAGE_TYPES.IMAGES) {
        return this.getImageFromQuotedText();
      }
      return '';
    } else {
      // eslint-disable-line
      return Message.getDisplayImageURL(imageInfo, 'full');
    }
  }

  getDisplayVideo() {
    const videoIDs = Object.keys(this.videoURLs);
    const videoID = videoIDs[0];
    const videoInfo = this.videoURLs[videoID];
    if (videoIDs.length === 0) {
      return Message.getImagePlaceholderURL();
    } else {
      // eslint-disable-line
      return Message.getDisplayVideoURL(videoInfo, 'full');
    }
  }

  getDisplayAudio() {
    const audioIDs = Object.keys(this.audioURLs);
    const audioID = audioIDs[0];
    const audioInfo = this.audioURLs[audioID];
    if (audioIDs.length === 0) {
      return Message.getImagePlaceholderURL();
    } else {
      // eslint-disable-line
      return Message.getDisplayAudioURL(audioInfo, 'full');
    }
  }

  getDisplayTextForLastMessage() {
    // author
    let author = this.isMeAuthor() ? 'Bạn: ' : `${this.getAuthorShortName()}: `;
    if (this.isNoticeMessage()) {
      author = '';
    }
    // message
    let message = this.text;
    if (this.isLocationMessage()) {
      message = '[Vừa chia sẻ vị trí]';
    } else if (this.isImagesMessage()) {
      message = '[Vừa chia sẻ ảnh]';
    } else if (this.isVideosMessage()) {
      message = '[Vừa chia sẻ video]';
    } else if (this.isAudiosMessage()) {
      message = '[Vừa chia sẻ tin nhắn thoại]';
    }
    // ---
    return `${author}${message}`;
  }
}

// REALM SCHEMA
// --------------------------------------------------

Message.schema = {
  name: 'Message',
  primaryKey: 'dbUID',
  properties: {
    dbUID: { type: 'string' },
    uid: { type: 'string' },
    threadID: { type: 'string' },
    type: { type: 'string' },
    authorID: { type: 'string', optional: true, default: '' },
    authorFullName: { type: 'string', optional: true, default: '' },
    authorAvatarImage: { type: 'string', optional: true, default: '' },
    text: { type: 'string', optional: true, default: '' },
    quotedID: { type: 'string', optional: true, default: '' },
    quotedType: { type: 'string', optional: true, default: '' },
    quotedText: { type: 'string', optional: true, default: '' },
    htmlText: { type: 'string', optional: true, default: '' },
    imageURLsJSON: { type: 'string', optional: true, default: '{}' },
    videoURLsJSON: { type: 'string', optional: true, default: '{}' },
    audioURLsJSON: { type: 'string', optional: true, default: '{}' },
    locationJSON: { type: 'string', optional: true, default: '{}' },
    createTime: { type: 'int', optional: true, default: 0 },
    updateTime: { type: 'int', optional: true, default: 0 },
    isDeleted: { type: 'bool', optional: true, default: false },
    isDeletedByJSON: { type: 'string', optional: true, default: '{}' },
    isRecalled: { type: 'bool', optional: true, default: false },
    width: { type: 'int', optional: true, default: 0 },
    height: { type: 'int', optional: true, default: 0 },
    hide: { type: 'bool', optional: true, default: false },
    reactionJSON: { type: 'string', optional: true, default: '{}' },
    isReceivedByJSON: { type: 'string', optional: true, default: '{}' },
    isReceived: { type: 'bool', optional: true, default: false },
    type_createTime: { type: 'string', optional: true, default: '' },
    tagDataJSON: { type: 'string', optional: true, default: '[]' },
  },
};

/**
 * store imageURLs in Realm
 */
Object.defineProperty(Message.prototype, 'imageURLs', {
  get: function () {
    // eslint-disable-line
    return this.imageURLsJSON ? JSON.parse(this.imageURLsJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.imageURLsJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Message.prototype, 'videoURLs', {
  get: function () {
    // eslint-disable-line
    return this.videoURLsJSON ? JSON.parse(this.videoURLsJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.videoURLsJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Message.prototype, 'audioURLs', {
  get: function () {
    // eslint-disable-line
    return this.audioURLsJSON ? JSON.parse(this.audioURLsJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.audioURLsJSON = value ? JSON.stringify(value) : '{}';
  },
});

/**
 * store location: lat, lon in Realm
 */
Object.defineProperty(Message.prototype, 'location', {
  get: function () {
    // eslint-disable-line
    return this.locationJSON ? JSON.parse(this.locationJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.locationJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Message.prototype, 'isDeletedBy', {
  get: function () {
    // eslint-disable-line
    return this.isDeletedByJSON ? JSON.parse(this.isDeletedByJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.isDeletedByJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Message.prototype, 'reaction', {
  get: function () {
    // eslint-disable-line
    return this.reactionJSON ? JSON.parse(this.reactionJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.reactionJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Message.prototype, 'isReceivedBy', {
  get: function () {
    // eslint-disable-line
    return this.isReceivedByJSON ? JSON.parse(this.isReceivedByJSON) : {};
  },
  set: function (value) {
    // eslint-disable-line
    this.isReceivedByJSON = value ? JSON.stringify(value) : '{}';
  },
});

Object.defineProperty(Message.prototype, 'tagData', {
  get: function () {
    // eslint-disable-line
    return this.tagDataJSON ? JSON.parse(this.tagDataJSON) : [];
  },
  set: function (value) {
    // eslint-disable-line
    this.tagDataJSON = value ? JSON.stringify(value) : '[]';
  },
});
