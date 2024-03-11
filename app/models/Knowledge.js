/**
Sample JSON:

"ackID": "5",
"ackTitle": "Acknowledgements Title A",
"ackDescription": "This is a short description about ...",
"ackURL": "http://google.com",
"ackImage": "data/acknowledgement/image/5.jpg",
"createdDate": 1510826683
*/

import moment from 'moment/min/moment-with-locales';

export default class Knowledge {

  static objectFromJSON(json) {
    const object = new Knowledge();

    const sortPosition = parseInt(json.sortPosition, 10);
    const isHighlight = (json.isHighlight && json.isHighlight === '1') || false;

    // parse
    object.uid = json.ackID || json.title;
    object.title = json.ackTitle || json.title;
    object.details = json.ackDescription || json.description;
    object.detailsURL = json.ackURL || json.link;
    object.image = json.ackImage || json.image;
    object.sortPosition = isNaN(sortPosition) ? 9999 : sortPosition;
    object.isHighlight = isHighlight;
    object.createTime = json.createdDate;

    // by default object fetched from backend is not deleted
    object.isDeleted = false;

    // delete isRead so that it is not updated by Realm
    delete object.isRead;

    return object;
  }

  // UI Logic
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

Knowledge.schema = {
  name: 'Knowledge',
  primaryKey: 'uid',
  properties: {
    uid: { type: 'string' },
    title: { type: 'string', optional: true, default: '' },
    details: { type: 'string', optional: true, default: '' },
    detailsURL: { type: 'string', optional: true, default: '' },
    image: { type: 'string', optional: true, default: '' },
    isHighlight: { type: 'bool', optional: true, default: false },
    sortPosition: { type: 'int', optional: true, default: 9999 },
    createTime: { type: 'int', optional: true, default: 0 },
    isRead: { type: 'bool', optional: true, default: false },
    isDeleted: { type: 'bool', optional: true, default: false },
  },
};
