/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropsTypes from 'prop-types';
import AppText from '../../componentV3/AppText';

// --------------------------------------------------

const EMOJI_SIZE = 40;
const EMOJI_FONT_SIZE = EMOJI_SIZE / 4 * 3;

const _ = require('lodash');

// --------------------------------------------------
// EmojiView
// --------------------------------------------------

class EmojiView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    // console.log(`EmojiView.onPress: ${this.props.emoji}`);
    this.props.onPress(this.props.emoji);
  }
  render() {
    const { 
      emoji, 
      emojiSize,
      emojiFontSize,
      emojiPadding,
     } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container, 
          { paddingLeft: emojiPadding, paddingRight: emojiPadding }
        ]}
        onPress={this.onPress}
      >
        <AppText 
          style={[
            styles.emoji,
            { width: emojiSize, height: null, fontSize: emojiFontSize }
          ]}
        >
          {emoji}
        </AppText>
      </TouchableOpacity>
    );
  }
}

EmojiView.propsTypes = {
  emoji: PropsTypes.string,
  onPress: PropsTypes.func,
};

EmojiView.defaultProps = {
  emojiSize: EMOJI_SIZE,
  emojiFontSize: EMOJI_SIZE / 4 * 3,
  emojiPadding: 2,
  emoji: '',
  onPress: () => {},
};

export default EmojiView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0'
  },
  emoji: {
    textAlign: 'center',
    opacity: 1.0,
    color: '#000',
    backgroundColor: '#f000'
  }
});
