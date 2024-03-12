/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Props can be overwrite
 * - touchableHighlightProps
 * - delayTime
 * - onPress
 */

import React, { Component } from 'react';
import {
  TouchableHighlight,
} from 'react-native';

const _ = require('lodash');

// --------------------------------------------------
// KJTouchableHighlight
// --------------------------------------------------

class KJTouchableHighlight extends Component {
  constructor(props) {
    super(props);

    this.isTouchDelay = false;
  }
  componentWillUnmount() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // --------------------------------------------------
  onPress = () => {
    const {
      delayTime,
    } = this.props;
    // ignore touch
    if (this.isTouchDelay) { return; }
    // make touch un-available in a while
    // so that user cannot tap rapidly and cause un-expected behaviour
    this.isTouchDelay = true;
    this.delayTimer = setTimeout(() => {
      this.isTouchDelay = false;
      this.delayTimer = null;
    }, delayTime);
    // press
    requestAnimationFrame(() => {
      this.props.onPress();
    });
  }
  // --------------------------------------------------
  render() {
    const props = { ...this.props.touchableHighlightProps, children: null };
    return (
      <TouchableHighlight
        {...props}
        onPress={this.onPress}
        onLongPress={this.props.onLongPress}
      >
        {this.props.children}
      </TouchableHighlight>
    );
  }
}

// --------------------------------------------------

KJTouchableHighlight.defaultProps = {
  delayTime: 500,
  touchableHighlightProps: {},
  onPress: () => {},
};

export default KJTouchableHighlight;
