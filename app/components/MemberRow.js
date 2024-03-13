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
  Alert,
  TouchableOpacity,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import Strings from 'app/constants/strings';
import CharAvatar from 'app/components/CharAvatar';
import KJButton from 'app/components/common/KJButton';
import AppText from '../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from 'app/constants/colors';
const LOG_TAG = 'ContactRow.js';
/* eslint-enable */

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const AVATAR_SIZE = 46;
const AVATAR_CONTENT_SPACING = 10;

const _ = require('lodash');

// --------------------------------------------------
// MemberRow
// --------------------------------------------------

class MemberRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onRowPress = () => {
    if (this.props.onRowPress) {
      this.props.onRowPress(this.props.user);
    }
  }

  onDeletePress = () => {
    Alert.alert(
      Strings.remove_member_chat_title,
      `Bạn có muốn xoá "${this.props.user.fullName}"?`,
      [
        {
          text: 'OK',
          onPress: () => {
            this.props.onDeletePress(this.props.user);
          },
        },
        {
          text: 'Không',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }
  // --------------------------------------------------
  renderAvatar() {
    const { user } = this.props;
    // const presenceStatusColor = user.presenceStatusColor();
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={{ uri: isEmpty(user.avatarImage) ?  '' : user.avatarImage }}
          defaultName={user.fullName}
        />
      </View>
    );
  }
  renderContent() {
    const { user, isAdmin } = this.props;
    const isMe = user.isMe() ? ' (Tôi)' : '';
    const isAdminStr = isAdmin ? ' (Admin)' : '';
    return (
      <AppText style={styles.titleText}>
        {`${user.fullName}${isMe}${isAdminStr}`}
      </AppText>
    );
  }
  renderDeleteButton() {
    const { isDeleteButtonHidden } = this.props;
    if (isDeleteButtonHidden) { return null; }
    return (
      <KJButton
        containerStyle={styles.deleteButton}
        title={'Xóa'}
        titleStyle={styles.deleteButtonTitle}
        onPress={this.onDeletePress}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onRowPress}
          activeOpacity={0.2}
        >
          <View style={styles.rowContainer}>
            {this.renderAvatar()}
            {this.renderContent()}
            {this.renderDeleteButton()}
          </View>
        </TouchableOpacity>
        {/* <View style={styles.separator} /> */}
      </View>
    );
  }
}

MemberRow.defaultProps = {
  isDeleteButtonHidden: false,
  onDeletePress: () => { },
};

export default MemberRow;

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
    backgroundColor: colors.container_background,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.container_background,
  },
  avatarContainer: {

    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.container_background,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
  },
  titleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
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
  deleteButton: {
    flex: 0,
    width: 48,
    height: 26,
    borderColor: '#d0021b',
    borderWidth: 1.0,
    borderRadius: 4.0,
  },
  deleteButtonTitle: {
    fontSize: 14,
    color: '#d0021b',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
});
