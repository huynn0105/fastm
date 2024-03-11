/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import CharAvatar from 'app/components/CharAvatar';
import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------
import colors from '../../constants/colors';



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
    this.props.onPress(this.props.user);
  };
  onAddPress = () => {
    if (this.props.onAddPress) {
      this.props.onAddPress(this.props.user);
    }
  };
  onChatPress = () => {
    if (this.props.onChatPress) {
      this.props.onChatPress(this.props.user);
    }
  };
  renderAvatar() {
    const { user } = this.props;
    const uri = user.avatarImage ? user.avatarImage : '';
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar avatarStyle={styles.avatarImage} source={{ uri }} defaultName={user.fullName} />
      </View>
    );
  }
  renderRowInfo = (icon, title) => {
    return (
      <View
        style={{
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
        <AppText
          style={{
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          {title}
        </AppText>
      </View>
    );
  };
  renderContent() {
    const { user } = this.props;
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 2,
          paddingBottom: 0,
        }}
      >
        <AppText
          style={{
            fontSize: 17,
            paddingBottom: 4,
          }}
        >
          {user.fullName}
        </AppText>
        {this.renderRowInfo(require('./img/phoneNumber.png'), user.mPhoneNumber)}
      </View>
    );
  }
  renderIsMine() {
    return <AppText style={styles.addText}>{'Liên hệ của bạn'}</AppText>;
  }
  renderContact() {
    const { isExist } = this.props;
    return isExist ? (
      <TouchableOpacity onPress={this.onChatPress}>
        <View style={styles.addButton}>
          <AppText style={styles.addText}>{'Trò chuyện'}</AppText>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={this.onAddPress}>
        <View style={styles.addButton}>
          <AppText style={styles.addText}>{'Thêm'}</AppText>
        </View>
      </TouchableOpacity>
    );
  }
  renderSelected() {
    const { isMine } = this.props;
    return isMine ? this.renderIsMine() : this.renderContact();
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

ContactRow.defaultProps = {
  isSelected: true,
  onPress: () => {},
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
    backgroundColor: '#E0E0E1',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
  addButton: {
    paddingLeft: 4,
    paddingRight: 4,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1.0,
    borderColor: colors.app_theme_darker,
    backgroundColor: colors.navigation_bg,
  },
  addText: {
    color: colors.app_theme_darker,
    fontSize: 12,
  },
});
