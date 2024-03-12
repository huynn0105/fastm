/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import CharAvatar from 'app/components/CharAvatar';
import KJInTouchableOpacity from 'app/common/KJInTouchableOpacity';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'UserAvatar.js';
/* eslint-enable */

const AVATAR_SIZE = 54;

const _ = require('lodash');

// --------------------------------------------------
// UserAvatar
// --------------------------------------------------

class UserAvatar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onAvatarPress = () => {
    this.props.onAvatarPress();
  }
  render() {
    const {
      user,
      avatarStyle,
      showHomeContent,
    } = this.props;
    return (
      <View style={styles.container} testID="test_UserAvatar">
        {
          showHomeContent &&
          <Animatable.View
            animation="fadeIn"
            duration={300}
            useNativeDriver
          >
            <KJInTouchableOpacity
              onPressIn={this.onAvatarPress}
            >
              <CharAvatar
                avatarStyle={[styles.avatarImage, avatarStyle]}
                source={user.avatarImageURI()}
                defaultSource={user.avatarImagePlaceholder()}
                defaultName={user.fullName}
                textStyle={styles.textReadStyle}
              />
            </KJInTouchableOpacity>
          </Animatable.View>
        }
      </View>
    );
  }
}

UserAvatar.defaultProps = {
  onAvatarPress: () => { },
  showHomeContent: true,
};

export default UserAvatar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -55,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    backgroundColor: '#0000',
    zIndex: 1,
  },
  avatarImage: {
    flex: 0,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  textReadStyle: {
    fontSize: 22,
    fontWeight: '500',
  },
});
