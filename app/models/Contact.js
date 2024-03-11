// {
//   "avatar": "https://firebasestorage.googleapis.com/v0/b/digitelprod.appspot.com/o/images%2Fprofile_avatar%2F8_1528212256.jpg?alt=media&token=9b62cc70-a38c-453c-80e1-cb044b26610f",
//   "fullName": "APPAY TRAINER",
//   "uid": "8"
// },

import store from '../redux/store/store';

const removeDiacritics = require('diacritics').remove;

export default class Contact {
  uid = '';
  avatar = '';
  fullName = '';

  static objectFromJSON(json) {
    return Object.assign(new Contact(), json);
  }

  isMe() {
    return store.getState().myUser.uid === this.uid;
  }

  fullNameNoDiacritics() {
    return this.fullName ? removeDiacritics(this.fullName) : '';
  }
  avatarImageURI() {
    return this.avatar ? { uri: this.avatar } : null;
  }
}
