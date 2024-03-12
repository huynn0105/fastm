/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import { User } from 'app/models';

const MALE_AVATAR_DEFAULT_IMAGE = require('./img/avatar1.png');
const FEMALE_AVATAR_DEFAULT_IMAGE = require('./img/avatar2.png');
const WALL_DEFAULT_IMAGE = require('./img/wall1.jpg');

// --------------------------------------------------
// UserView
// --------------------------------------------------

export default class UserView {
  
  // --------------------------------------------------
  
  static getAvatarPlaceholderImage(gender) {
    return gender === 'male' ? MALE_AVATAR_DEFAULT_IMAGE : FEMALE_AVATAR_DEFAULT_IMAGE;
  }

  static getWallPlaceholderImage() {
    return WALL_DEFAULT_IMAGE;
  }

  // --------------------------------------------------

  user = new User();

  constructor(user) {
    this.user = user;
  }

  getAvatarImage() {
    if (!this.user.avatarImage || this.user.avatarImage.length === 0) {
      return UserView.getAvatarPlaceholderImage();
    }
    return { uri: this.user.avatarImage };
  }

  getWallImage() {
    if (!this.user.wallImage || this.user.wallImage.length === 0) {
      return UserView.getWallPlaceholderImage();
    }
    return { uri: this.user.wallImage };
  }
}
