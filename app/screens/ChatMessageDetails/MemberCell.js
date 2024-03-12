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

import PropTypes from 'prop-types';

import { User } from 'app/models';

import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import CharAvatar from 'app/components/CharAvatar';

const DEFAULT_CELL_SIZE = 46;

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ChatMessageDetails/MemberCell.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// MemberCell
// --------------------------------------------------

class MemberCell extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onPress = () => {
    this.props.onPress(this.props.user);
  }
  // --------------------------------------------------
  render() {
    const { user, containerStyle, imageStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <KJTouchableOpacity
          activeOpacity={0.65}
          onPress={this.onPress}
        >
          <CharAvatar
            avatarStyle={[styles.avatarImage, imageStyle]}
            source={user.avatarImageURI()}
            defaultName={user.fullName}
          />
        </KJTouchableOpacity>
      </View>
    );
  }
}

MemberCell.propTypes = {
  user: PropTypes.instanceOf(User),
  containerStyle: PropTypes.instanceOf(Object),
  imageStyle: PropTypes.instanceOf(Object),
  onPress: PropTypes.func,
};

MemberCell.defaultProps = {
  user: {},
  containerStyle: {},
  imageStyle: {},
  onPress: () => { },
};

export default MemberCell;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: DEFAULT_CELL_SIZE,
    height: DEFAULT_CELL_SIZE,
    backgroundColor: '#fff',
  },
  avatarImage: {
    flex: 0,
    width: DEFAULT_CELL_SIZE,
    height: DEFAULT_CELL_SIZE,
    borderRadius: DEFAULT_CELL_SIZE / 2.0,
    backgroundColor: '#fff',
  },
});
