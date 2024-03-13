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
const LOG_TAG = 'ChatInbox/index.js';
/* eslint-enable */

// --------------------------------------------------
// ChatInboxScreen
// --------------------------------------------------

class ChatInboxScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 20 }}>
          ChatInboxScreen
        </Text>
      </View>
    );
  }
}

ChatInboxScreen.defaultProps = {

};

export default ChatInboxScreen;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
