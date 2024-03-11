/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */ 

/**
 * Props can be overwrite
 * - containerStyle
 * - activeOpacity
 * - delayTime
 */

import React, { Component } from 'react';
import {
  TouchableOpacity,
} from 'react-native';

const _ = require('lodash');
// --------------------------------------------------
// KJTouchableOpacity
// --------------------------------------------------

class KJTouchableOpacity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTouchDelay: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }
  }


  // --------------------------------------------------
  onPress = () => {
    const {
      delayTime,
    } = this.props;
    // ignore touch
    if (this.state.isTouchDelay) return;
    // make toucha un-available in 500ms 
    // so that user cannot tap rapidly and cause un-expected behaviour
    this.setState({ isTouchDelay: true });
    this.delayTimer = setTimeout(() => {
      this.setState({ isTouchDelay: false });
      this.delayTimer = null;
    }, delayTime);
    // press
    requestAnimationFrame(() => {
      this.props.onPress();
    });
  }
  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress();
    }
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle,
      activeOpacity,
      disabled,
      style,
    } = this.props;
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[containerStyle, style]}
        activeOpacity={activeOpacity}
        onPress={this.onPress}
        disabled={disabled}
        onLongPress={this.onLongPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

// --------------------------------------------------

KJTouchableOpacity.defaultProps = {
  delayTime: 500,
  activeOpacity: 0.2,
  onPress: () => { },
};

export default KJTouchableOpacity;
