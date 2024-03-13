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
  Image,
  TouchableOpacity,
} from 'react-native';

import CharAvatar from 'app/components/CharAvatar';
import colors from '../../constants/colors';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactRow.js';
/* eslint-enable */

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const AVATAR_SIZE = 46;
const AVATAR_CONTENT_SPACING = 10;

const _ = require('lodash');

// --------------------------------------------------
// ContactRow
// --------------------------------------------------

class ContactRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onPress = () => {
    this.props.onPress(this.props.thread);
  }
  renderAvatar() {
    const { thread } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={thread.photoImageURI()}
          defaultSource={thread.photoImagePlaceholder()}
          defaultName={thread.titleString()}
        />
      </View>
    );
  }
  renderContent() {
    const { thread } = this.props;
    return (
      <Text style={styles.title}>
        {`${thread.titleString()}`}
      </Text>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPress}
          activeOpacity={0.2}
        >
          <View style={styles.rowContainer}>
            {this.renderAvatar()}
            {this.renderContent()}
          </View>

          <View style={styles.separator} />
        </TouchableOpacity>
      </View>
    );
  }
}

ContactRow.defaultProps = {
  isSelected: true,
  onPress: () => { },
};

export default ContactRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.navigation_bg,
  },
  avatarContainer: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 16,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  contentContainer: {
    flex: 0,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: colors.navigation_bg,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#fff',
    backgroundColor: '#ff0',
  },
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#0001',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
});
