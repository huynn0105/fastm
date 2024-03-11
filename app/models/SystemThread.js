/**
 * Chat SystemThread
 * - stored in realm db, primary key is dbUID
 */

// --------------------------------------------------
// SystemThread
// --------------------------------------------------
export default class SystemThread {

  // Static Methods
  // --------------------------------------------------

  static objectFromJSON(json) {
    const object = new SystemThread();

    // parse
    object.dbUID = json.uid;
    object.uid = json.uid;
    object.type = json.type;
    object.title = json.title;
    return object;
  }

  static adminThread() {
    const object = new SystemThread();

    object.dbUID = 'thread_admin';
    object.uid = 'thread_admin';
    object.type = 'admin';
    object.title = 'Trợ lý tin tức';
    object.isFavorite = true;
    object.isNotificationOn = true;
    return object;
  }

  static systemThread() {
    const object = new SystemThread();

    object.dbUID = 'thread_system';
    object.uid = 'thread_system';
    object.type = 'system';
    object.title = 'Trợ lý riêng của bạn';
    object.isFavorite = true;
    object.isNotificationOn = true;
    return object;
  }

  titleString() {
    return this.title;
  }

  statusString() {
    return '';
  }

  photoImageURI() {
    return this.photoImagePlaceholder();
  }

  photoImagePlaceholder() {
    return this.type === 'system' ? require('./img/elly.png') : require('./img/anna.png');
  }

  totalUnReadMessages() {
    return 0;
  }

  updateTimeAgoString() {
    const time = this.messages.length > 0 ? this.messages[0].notification.createTimeAgoString() : '';
    return time.replace(' trước', '');
  }

  updatedTime() {
    return this.messages.length > 0 ? this.messages[0].notification.mCreateTimeMoment : 0;
  }

  lastMessage() {
    const messages = this.messages;
    if (messages && messages.length > 0) {
      return messages[0].notification;
    }
    return undefined;
  }

  static lastMessage(messages) {
    if (messages && messages.length > 0) {
      return messages[0].notification;
    }
    return undefined;
  }
}

// REALM SCHEMA
// --------------------------------------------------

SystemThread.schema = {
  name: 'SystemThread',
  primaryKey: 'uid',
  properties: {
    dbUID: { type: 'string' },
    uid: { type: 'string' },
    type: { type: 'string', optional: true, default: '0' },
    title: { type: 'string', optional: true, default: '' },
    isFavorite: { type: 'bool', optional: true, default: true },
    isNotificationOn: { type: 'bool', optional: true, default: true },
  },
};

