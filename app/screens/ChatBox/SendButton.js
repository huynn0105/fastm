/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Send } from 'react-native-gifted-chat';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'SendButton.js';
/* eslint-enable */

// --------------------------------------------------
// SendButton
// --------------------------------------------------

class SendButton extends PureComponent {
  render() {
    return (
      <Send
        {...this.props}
      >
        <View style={styles.buttonContainer}>
          <Icon name="send" size={14} color="#FFF" />
        </View>
      </Send>
    );
  }
}

SendButton.defaultProps = {

};

export default SendButton;

// --------------------------------------------------

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
    paddingRight: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F8EF7',
  },
});
