/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
* Props can be overwrite
* - containerStyle
* - title, titleStyle
* - leftIconSource, leftIconStyle
* - rightIconSource, rightIconStyle
*/

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import KJTouchableOpacity from './KJTouchableOpacity';

import AppText from '../../componentV3/AppText';

const _ = require('lodash');

// --------------------------------------------------
// KJButton
// --------------------------------------------------

class KJButton extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // --------------------------------------------------
  onPress = () => {
    this.props.onPress();
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle,
      title, titleStyle,
      leftIconSource, leftIconStyle,
      rightIconSource, rightIconStyle,
    } = this.props;
    return (
      <KJTouchableOpacity
        testID={this.props.testID}
        containerStyle={[styles.container, containerStyle]}
        onPress={this.onPress}
      >
        {
          !leftIconSource ? null :
            <Image
              style={[styles.icon, leftIconStyle]}
              source={leftIconSource}
              resizeMode="contain"
            />
        }
        {
          !this.props.title ? null :
            <AppText
              style={[styles.title, titleStyle]}
            >
              {title}
            </AppText>
        }
        {
          this.props.rightIconSource === null ? null :
            <Image
              style={[styles.icon, rightIconStyle]}
              source={rightIconSource}
              resizeMode="contain"
            />
        }
        {this.props.children}
      </KJTouchableOpacity>
    );
  }
}

// --------------------------------------------------

KJButton.propTypes = {
  onPress: PropTypes.func,
};

KJButton.defaultProps = {
  onPress: () => { },
};

export default KJButton;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  title: {
    backgroundColor: '#0000',
    color: '#202020',
    fontSize: 15,
    fontWeight: '300',
  },
  icon: {
    alignSelf: 'center',
  },
});
