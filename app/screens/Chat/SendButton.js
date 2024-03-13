/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
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
          <Image
            style={{
              width: 40,
              height: 40,
            }}
            source={require('./img/send.png')}
          />
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
    marginRight: 10,
    paddingRight: 2,
    width: 40,
    height: 40,
  },
});
