/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'DisableInputToolbar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// DisableInputToolbar
// --------------------------------------------------

class DisableInputToolbar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <AppText style={styles.title}>
          {title}
        </AppText>
      </View>
    );
  }
}

export default DisableInputToolbar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#fff',
  },
  title: {
    color: '#808080',
    fontSize: 15,
    fontWeight: '300',
  },
});
