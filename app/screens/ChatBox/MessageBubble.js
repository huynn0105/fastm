/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';

import { StyleSheet } from 'react-native';

import { Bubble } from 'react-native-gifted-chat';
import * as Animatable from 'react-native-animatable';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'MessageBubble.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// MessageBubble
// --------------------------------------------------

class MessageBubble extends Component {
  state = {
    read: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const read = this.props.currentMessage.notification.read;

    return (
      <Animatable.View duration={300} animation={'fadeIn'} useNativeDriver>
        <Bubble
          {...this.props}
          wrapperStyle={{
            left: [
              read ? styles.leftBubble : styles.leftUnreadBubble,
              this.props.isLastMessage ? { marginBottom: 64 } : {},
            ],
            right: styles.rightBubble,
          }}
          containerToNextStyle={{
            left: {
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 0,
            },
            right: {
              borderBottomRightRadius: 10,
              borderTopRightRadius: 0,
            },
          }}
          containerToPreviousStyle={{
            left: { borderTopLeftRadius: 3 },
            right: { borderTopRightRadius: 3 },
          }}
          bottomContainerStyle={{
            left: { justifyContent: 'flex-start' },
          }}
          textStyle={{
            left: { fontSize: 13, color: '#333' },
            right: { fontSize: 10, color: '#333' },
          }}
          textTimeStyle={{
            left: { fontSize: 10, color: '#888' },
          }}
        />
      </Animatable.View>
    );
  }
}

MessageBubble.defaultProps = {};

export default MessageBubble;

// --------------------------------------------------

const styles = StyleSheet.create({
  leftBubble: {
    backgroundColor: '#FFF',
    borderColor: '#E7E7E7',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    minWidth: 180,
  },
  rightBubble: {
    backgroundColor: '#188CDF',
    borderRadius: 10,
  },
  leftUnreadBubble: {
    backgroundColor: '#FFF',
    borderColor: '#07e8',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    minWidth: 180,
  },

  leftBubbleImage: {
    backgroundColor: '#0000',
    borderRadius: 6,
  },
  rightBubbleImage: {
    backgroundColor: '#0000',
    borderRadius: 6,
  },
  leftUnreadBubbleImage: {
    backgroundColor: '#0000',
    borderRadius: 6,
    borderColor: '#39B5FC',
    borderWidth: 1.0,
  },
});
