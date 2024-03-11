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

import KJImage from 'app/components/common/KJImage';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'UserWall.js';
/* eslint-enable */

const WALL_HEIGHT = 160;

// --------------------------------------------------
// UserWall
// --------------------------------------------------

class UserWall extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <View style={styles.container}>
        <KJImage
          style={[styles.wallImage]}
          source={require('./img/homeBG.png')}
          resizeMode={'cover'}
        />
      </View>
    );
  }
}

export default UserWall;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: WALL_HEIGHT,
    overflow: 'hidden',
    marginTop: -92,
  },
  wallImage: {
    flex: 1,
    position: 'absolute',
    top: 19,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 0,
  },
});
