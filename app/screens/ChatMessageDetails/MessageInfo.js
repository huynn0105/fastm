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
  Platform,
  Dimensions,
} from 'react-native';

import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

import { Message } from '../../submodules/firebase/model';
import { MESSAGE_TYPES } from '../../submodules/firebase/model/Message';
import CharAvatar from '../../components/CharAvatar';
import RemoteImage from '../../components/common/RemoteImage';
import ViewPlayerContainer from '../Chat/VideoPlayerContainer';
import AudioPlayer from '../Chat/AudioPlayer';
import AppText from '../../componentV3/AppText';

const MESSAGE_SIDE_PADDING = 44;
const AVATAR_SIZE = 42;

const SCREEN_SIZE = Dimensions.get('window');

const IMAGE_WIDTH = SCREEN_SIZE.width * 0.3;
const IMAGE_WIDTH_MAX = SCREEN_SIZE.width * 0.4;

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'MessageDetails.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// MessageInfo
// --------------------------------------------------

class MessageInfo extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  renderMessageAuthor() {
    const { message } = this.props;
    const authorName = message.isMeAuthor() ? `Tôi (${message.authorFullName})` : message.authorFullName;
    const messageTime = `Gửi lúc: ${message.createTimeMoment().format('DD/MM/YYYY hh:mm')}`;
    const textAlign = message.isMeAuthor() ? 'right' : 'left';
    return (
      <View style={styles.authorContainer}>
        <AppText style={[styles.authorName, { textAlign }]}>
          {authorName}
        </AppText>
        <AppText style={[styles.messageTime, { textAlign }]}>
          {messageTime}
        </AppText>
      </View>
    );
  }
  renderMessageContent() {
    const { message } = this.props;
    const messageContainerStyle = message.isMeAuthor() ?
      { justifyContent: 'flex-end', paddingLeft: MESSAGE_SIDE_PADDING } :
      { justifyContent: 'flex-start', paddingRight: MESSAGE_SIDE_PADDING };
    const messageBubbleStyle = message.isMeAuthor() ?
      { backgroundColor: '#0089FA' } :
      { backgroundColor: '#fff' };
    // ---
    return (
      <View style={[styles.messageContainer, messageContainerStyle]}>
        <View style={[styles.messageBubble, messageBubbleStyle]}>
          {this.renderMessageContentWithType(message.type)}
        </View>
      </View>
    );
  }

  renderMessageContentWithType(type) {
    let messageContent = null;
    const { message } = this.props;
    switch (type) {
      case MESSAGE_TYPES.IMAGES:
        messageContent = this.renderMessageImage;
        break;
      case MESSAGE_TYPES.VIDEOS:
        messageContent = this.renderMessageVideo;
        break;
      case MESSAGE_TYPES.LOCATION:
        messageContent = this.renderMessageLocation;
        break;
      case MESSAGE_TYPES.AUDIOS:
        messageContent = this.renderMessageAudio;
        break;
      default:
        messageContent = this.renderMessageText;
    }
    return messageContent(message);
  }

  renderMessageText(message) {
    const messageText = message.getDisplayText();
    const textAlign = message.isMeAuthor() ? 'right' : 'left';
    const messageTextStyle = message.isMeAuthor() ?
      { color: '#fff' } :
      { color: '#202020' };
    return (
      <AppText style={[styles.messageText, messageTextStyle, { textAlign }]}>
        {messageText}
      </AppText>
    );
  }

  renderMessageImage(message) {
    let { width, height } = message;
    const tempWidth = width;
    const tempHeight = height;
    if (width < IMAGE_WIDTH) {
      width = IMAGE_WIDTH;
      height = (IMAGE_WIDTH / tempWidth) * tempHeight;
    }
    if (width > IMAGE_WIDTH_MAX) {
      width = IMAGE_WIDTH_MAX;
      height = (IMAGE_WIDTH_MAX / tempWidth) * tempHeight;
    }
    return (
      <RemoteImage
        style={{
          width,
          height,
          resizeMode: 'contain',
          borderRadius: Platform.OS === 'ios' ? 6 : 1,
        }}
        source={{ uri: message.getDisplayImage() }}
      />
    );
  }

  renderMessageVideo(message) {
    return (
      <View
        style={{
          width: IMAGE_WIDTH_MAX,
          height: IMAGE_WIDTH_MAX,
        }}
      >
        <ViewPlayerContainer
          video={message.getDisplayVideo()}
          isMine={message.isMeAuthor()}
          videoPlayerStyle={{
            borderRadius: 12.0,
            margin: 0,
          }}
          videoStyle={{
            width: IMAGE_WIDTH_MAX,
            height: IMAGE_WIDTH_MAX,
          }}
        />
      </View>
    );
  }

  renderMessageLocation(message) {
    const lat = message.location.latitude;
    const lon = message.location.longitude;
    return (
      <View
        style={{
          width: IMAGE_WIDTH_MAX,
          height: IMAGE_WIDTH_MAX,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <MapView
          style={{
            width: IMAGE_WIDTH_MAX,
            height: IMAGE_WIDTH_MAX,
          }}
          region={{
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      </View>
    );
  }

  renderMessageAudio(message) {
    return (
      <View style={{ borderRadius: 12, overflow: 'hidden' }} >
        <AudioPlayer
          audio={message.getDisplayAudio()}
          isMine={message.isMeAuthor()}
          width={SCREEN_SIZE.width * 0.4}
        />
      </View>
    );
  }

  renderAvatar() {
    const { message } = this.props;
    return (
      <View style={{ flexDirection: 'row' }}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={message.authorAvatarImage ? { uri: message.authorAvatarImage } : ''}
          defaultName={message.authorFullName}
        />
      </View>
    );
  }
  render() {
    const { containerStyle, message } = this.props;
    if(!message) return <View />;
    const content = message.isMeAuthor() ? 'flex-end' : 'flex-start';
    return (
      <View style={[styles.container, { flexDirection: 'row', justifyContent: content }]}>
        {!message.isMeAuthor() && this.renderAvatar()}
        <View style={[containerStyle]}>
          {this.renderMessageAuthor()}
          {this.renderMessageContent()}
        </View>
      </View>
    );
  }
}

MessageInfo.propTypes = {
  message: PropTypes.instanceOf(Message),
};

MessageInfo.defaultProps = {
  message: {},
};

export default MessageInfo;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 20,
    paddingBottom: 32,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#E6EBFF',
  },
  authorContainer: {
    padding: 6,
    backgroundColor: '#0000',
  },
  authorName: {
    color: '#202020',
    backgroundColor: '#0000',
    fontSize: 14,
    fontWeight: '400',
  },
  messageTime: {
    marginTop: 4,
    color: '#A2A2A2',
    backgroundColor: '#0000',
    fontSize: 11,
    fontWeight: '400',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#0000',
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 12.0,
    borderColor: '#ECECEC',
    borderWidth: 0.5,
  },
  messageText: {
    margin: 10,
    color: '#202020',
    backgroundColor: '#0000',
    fontSize: 14,
    fontWeight: '400',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
});
