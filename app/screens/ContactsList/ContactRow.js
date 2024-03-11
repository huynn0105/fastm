/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import CharAvatar from 'app/components/CharAvatar';
import KJTouchableHighlight from 'app/components/common/KJTouchableHighlight';
import { User } from 'app/models';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../theme/Color';
const LOG_TAG = 'ContactRow.js';
/* eslint-enable */

const _ = require('lodash');

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const AVATAR_SIZE = 46;
const AVATAR_CONTENT_SPACING = 10;

// --------------------------------------------------
// ContactRow
// --------------------------------------------------

type Props = {
  user: User,
  onPress: Function,
  onLongPress: Function,
  onPressCall: Function,
}

type State = {
  opacity: number,
}

class ContactRow extends Component<Props, State> {

  static defaultProps = {
    userPresenceStatus: null,
    isSeparatorHidden: false,
    onPress: () => { },
    onLongPress: () => { },
  };

  state = {
    opacity: 1,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.user);
  }
  onLongPress = () => {
    this.props.onLongPress(this.props.user);
    this.animateSelected();
  }

  onPressCall = () => {
    // call(this.props.user.phoneNumber);
    this.animateSelected();

    // return;

    // showQuestionAlert(
    //   `Gọi SIP ${this.props.user.fullName} ${this.props.user.phoneNumber}?`, 'Đồng ý', 'Đóng',
    //   () => {
        this.props.onPressCall(this.props.user);
    //   },
    // );
  }

  animateSelected = () => {
    this.setState({ opacity: 0.3 });
    setTimeout(() => {
      this.setState({ opacity: 1 });
    }, 100);
  }

  renderAvatar() {
    const { user } = this.props;
    // const presenceStatusColor = User.getPresenceStatusColor(userPresenceStatus);
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={user.avatarImageURI()}
          defaultSource={user.avatarImagePlaceholder()}
          defaultName={user.fullName}
        />
        {/* // hide status */}
        {/* <View
          style={[
            styles.status,
            { backgroundColor: presenceStatusColor },
          ]}
        /> */}
      </View>
    );
  }
  renderContent() {
    const { user } = this.props;
    return (
      <Text style={styles.titleText}>
        {`${user.fullName}`}
      </Text>
    );
  }
  render() {
    // const { isSeparatorHidden } = this.props;
    return (
      <View style={[styles.container, { opacity: this.state.opacity }]}>
        <View
          style={{ flex: 1 }}
        >
          <KJTouchableHighlight
            touchableHighlightProps={{
              underlayColor: '#2228',
            }}
            onPress={this.onPress}
            onLongPress={this.onLongPress}
          >
            <View style={styles.rowContainer}>
              {this.renderAvatar()}
              {this.renderContent()}
            </View>
          </KJTouchableHighlight>
          <View
            style={styles.callWrapper}
          >
            <KJTouchableHighlight
              touchableHighlightProps={{
                underlayColor: '#0000',
              }}
              onPress={this.onPressCall}
              onLongPress={this.onLongPress}
            >
              <View style={styles.callContainer}>
                <Image
                  style={{ width: 20, height: 20, opacity: 0.8 }}
                  source={require('./img/phoneCall.png')}
                />
              </View>
            </KJTouchableHighlight>
          </View>
        </View>
        {/* {
          isSeparatorHidden ? null :
            <View style={styles.separator} />
        } */}

      </View>
    );
  }
}

export default ContactRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: 'stretch',
    alignContent: 'stretch',
    backgroundColor: colors.neutral5,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.neutral5,
  },
  avatarContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff0',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
  },
  titleText: {
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
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
  callWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_LEFT,
    height: AVATAR_SIZE + (2 * 12),
  },
});
