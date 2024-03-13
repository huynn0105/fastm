/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import CharAvatar from 'app/components/CharAvatar';
import colors from '../../constants/colors';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
import { hardFixUrlAvatar } from '../../redux/actions/user';
const LOG_TAG = 'MemberCell.js';
/* eslint-enable */

const AVATAR_SIZE = 60;

const _ = require('lodash');

// --------------------------------------------------
// MemberCell
// --------------------------------------------------

class MemberCell extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onPress = () => {
    Utils.log(`${LOG_TAG} onPress`);
    this.props.onPress(this.props.user);
  };
  // --------------------------------------------------
  renderAvatar() {
    const { user } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={{ uri: hardFixUrlAvatar(user.avatar)?.uri }}
          defaultName={user.fullName}
        />
        {this.renderRemoveIcon()}
      </View>
    );
  }
  renderRemoveIcon() {
    return (
      <View
        style={{
          flex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
          top: 0,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: '#fff',
        }}
      >
        <Icon
          style={{
            backgroundColor: '#0000',
          }}
          name="md-close-circle"
          size={18}
          color="#0099E0"
          backgroundColor="#0000"
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderAvatar()}
        <TouchableOpacity style={styles.button} onPress={this.onPress} />
      </View>
    );
  }
}

MemberCell.defaultProps = {
  onPress: () => {},
};

export default MemberCell;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 6,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.separator,
  },
  avatarContainer: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.separator,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#E6EBFF',
    backgroundColor: '#E6EBFF',
  },
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
  },
});
