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
import { showQuestionAlert } from 'app/utils/UIUtils';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

import colors from '../../constants/colors';

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

  onRemovePress = () => {
    showQuestionAlert(
      `Bạn có muốn bỏ chặn ${this.props.user.fullName}?`, 'Đồng ý', 'Đóng',
      () => {
        this.props.onRemovePress(this.props.user.uid);
      },
    );
  }
  renderAvatar() {
    const { user } = this.props;
    const uri = user.avatarImage ? user.avatarImage : '';
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={{ uri }}
          defaultName={user.fullName}
        />
      </View>
    );
  }
  renderRowInfo = (icon, title) => {
    return (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2,
      }}
      >
        <Image
          style={{
            width: 12,
            height: 12,
            marginRight: 6,
          }}
          source={icon}
          resizeMode="contain"
        />
        <AppText style={{
          fontSize: 12,
          opacity: 0.8,
        }}
        >
          {title}
        </AppText >

      </View >
    );
  }
  renderContent() {
    const { user } = this.props;
    return (
      <View style={{
        flex: 1,
        paddingTop: 2,
        paddingBottom: 0,
      }}
      >
        <AppText style={{
          fontSize: 17,
          paddingBottom: 4,
        }}
        >
          {user.fullName}
        </AppText >
        {this.renderRowInfo(
          require('./img/phoneNumber.png'),
          user.phoneNumber,
        )}
      </View >
    );
  }
  renderSelected() {
    return (
      <TouchableOpacity
        onPress={this.onRemovePress}
      >
        <View
          style={styles.addButton}
        >
          <AppText style={styles.addText}>
            Bỏ chặn
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.rowContainer}>
          {this.renderAvatar()}
          {this.renderContent()}
          {this.renderSelected()}
        </View>

        <View style={styles.separator} />
      </View>
    );
  }
}

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
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.navigation_bg,
  },
  avatarContainer: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 10,
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
    height: 1,
    backgroundColor: '#ddd',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
  addButton: {
    width: 64,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1.0,
    borderColor: '#4a4a4a',
    backgroundColor: colors.navigation_bg,
  },
  addText: {
    color: '#4a4a4a',
    fontSize: 12,
  },
});
