/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import { EMOJI_CATEGORIES } from 'app/components/EmojiPicker/Toolbar';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Bubble } from 'react-native-gifted-chat';
import LinkPreview from 'react-native-link-preview';
import ParsedText from 'react-native-parsed-text';
import AppText from '../../componentV3/AppText';
import { DeepLinkPaths, EndpointJoinGroupMfast } from '../../constants/configs';
import { MESSAGE_TYPES } from '../../submodules/firebase/model/Message';
import { REACTION_IMAGE } from './ReactionView';

const LOG_TAG = 'MessageBubble.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

// --------------------------------------------------
// MessageBubble
// --------------------------------------------------

class MessageBubble extends Component {
  state = {
    read: false,
    previewData: null,
    isSelected: false,
  };

  componentDidMount() {
    const text = this.props.currentMessage.message.text;
    const urlRegex = /(\b(https|http)?:\/\/[^\s]+)/g;
    const arrWords = text.replace(/^\s+|\s+$/g, '').split(/\s+/);

    let url = '';
    for (let i = 0; i < arrWords.length; i += 1) {
      const word = arrWords[i];
      if (word.match(urlRegex)) {
        url = word;
        break;
      }
    }

    if (url !== '') {
      LinkPreview.getPreview(text)
        .then((data) => {
          this.setState({
            previewData: {
              text,
              image: data?.images?.[0] || '',
              title: data.title || '',
              description: data.description || '',
              hostName: this.extractHostname(data.url),
            },
          });
        })
        .catch((error) => {
          this.setState({
            previewData: {
              text,
              image: '',
              title: '',
              description: '',
              hostName: this.extractHostname(url),
            },
          });
        });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onReactionTapped = () => {
    if (this.props.onReactionBtnPress) {
      this.props.onReactionBtnPress(this.reactionBtnRef, this.props.currentMessage.message);
    }
  };

  onReactionResultsPress = () => {
    if (this.props.onReactionResultsPress) {
      this.props.onReactionResultsPress(this.props.currentMessage.message);
    }
  };

  onMessagePress = () => {
    if (this.props.onMessagePress && this.state.previewData) {
      this.props.onMessagePress(this.props.currentMessage);
    }
  };

  onMessageLongPress = () => {
    if (this.props.onMessageLongPress) {
      this.props.onMessageLongPress(null, this.props.currentMessage, this.messageViewRef, this);
    }
  };

  extractHostname(url) {
    let hostname;
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
  }

  checkDiffRead = (currentMessage, prevMessage) => {
    return this.checkIsRead(currentMessage) !== this.checkIsRead(prevMessage);
  };

  checkCurrentIsRead = () => {
    return this.checkIsRead(this.props.currentMessage);
  };

  checkIsRead = (message) => {
    const { isMine } = this.props;
    if (isMine) {
      return true;
    }

    if (this.state.read) {
      return true;
    }

    if (!message || !message.message) {
      return true;
    }
    const { readtime } = this.props;
    if (readtime !== -1 && readtime < message.message.createTime) {
      return false;
    }
    return true;
  };

  setIsSelected = (selected) => {
    this.setState({
      isSelected: selected,
    });
  };

  checkIsSelected = () => {
    return this.state.isSelected;
  };

  checkHasReactions = () => {
    const message = this.props.currentMessage.message;
    return message.reaction && Object.keys(message.reaction).length > 0;
  };

  renderPreview = (data, isMine) => {
    const selectedStyle = isMine ? styles.rightSelectedBubble : styles.leftSelectedBubble;
    return (
      <View
        ref={(ref) => {
          this.messageViewRef = ref;
        }}
        style={[
          {
            width: SCREEN_SIZE.width * 0.7,
            borderRadius: 6,
            backgroundColor: isMine ? '#188CDF' : '#fff',
            paddingBottom: 8,
            marginTop: 2,
            marginBottom: 4,
            paddingRight: 1,
            borderColor: '#0000',
            borderWidth: 1,
          },
          this.checkIsSelected() ? selectedStyle : {},
        ]}
        onLayout={() => {}}
      >
        <KJTouchableOpacity onPress={this.onMessagePress} onLongPress={this.onMessageLongPress}>
          <ParsedText
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: isMine ? '#fff' : '#111',
              marginBottom: 8,
              marginTop: 4,
              paddingLeft: 8,
              paddingRight: 8,
            }}
            parse={[
              {
                type: 'url',
                style: {
                  fontSize: 15,
                  textDecorationLine: 'underline',
                },
                onPress: (url) => {
                  if (url.startsWith(EndpointJoinGroupMfast)) {
                    const threadID = url.split('/')?.[3];
                    url = `${DeepLinkPaths.JOIN_GROUP}?threadID=${threadID}`;
                  }
                  Linking.openURL(url).catch((err) => {});
                },
              },
            ]}
          >
            {data?.text}
          </ParsedText>
          {data?.image?.length ? (
            <KJImage
              style={{
                width: SCREEN_SIZE.width * 0.7 - 2,
                height: SCREEN_SIZE.width * 0.5,
                marginBottom: 4,
              }}
              source={{ uri: data.image }}
              resizeMode="cover"
            />
          ) : null}
          {data?.title?.length ? (
            <AppText
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: isMine ? '#fff' : '#188CDF',
                marginBottom: 8,
                marginTop: 4,
                paddingLeft: 8,
                paddingRight: 8,
              }}
              numberOfLines={2}
            >
              {data?.title}
            </AppText>
          ) : null}
          {data?.description?.length ? (
            <AppText
              style={{
                fontSize: 12,
                fontWeight: '300',
                color: isMine ? '#fff' : '#666',
                marginBottom: 4,
                paddingLeft: 8,
                paddingRight: 8,
              }}
              numberOfLines={2}
            >
              {data.description}
            </AppText>
          ) : null}
          {data?.hostName?.length ? (
            <AppText
              style={{
                fontSize: 12,
                fontWeight: '300',
                color: isMine ? '#ddd' : '#aaa',
                marginBottom: 4,
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              {data.hostName}
            </AppText>
          ) : null}
        </KJTouchableOpacity>
      </View>
    );
  };

  renderImgMess = (needRadient = false) => {
    const { isMine, currentMessage } = this.props;
    return (
      <Animatable.View duration={350} animation={'fadeIn'} useNativeDriver>
        <View
          style={{
            height: inFiveMin(currentMessage.message.createTime) ? 4 : 2,
          }}
        />
        <Bubble
          {...this.props}
          wrapperStyle={{
            left: styles.leftBubbleImage,
            right: styles.rightBubbleImage,
          }}
          containerToNextStyle={{
            left: { borderBottomLeftRadius: 3 },
            right: { borderBottomRightRadius: 3 },
          }}
          containerToPreviousStyle={{
            left: { borderTopLeftRadius: 3 },
            right: { borderTopRightRadius: 3 },
          }}
          bottomContainerStyle={{
            left: { height: 0 },
            right: { height: 0 },
          }}
          textTimeStyle={{
            left: { fontSize: 10, color: '#888' },
          }}
          needRadient={needRadient && isMine}
          radientColors={['#21adff', '#0082e0']}
          onLongPress={this.onMessageLongPress}
        />
        {this.checkHasReactions() && <View style={{ height: 18 }} />}
        {this.checkHasReactions() && (
          <View
            style={[
              {
                position: 'absolute',
                bottom: 0,
              },
              isMine ? { right: 0 } : { left: 0 },
            ]}
          >
            {this.renderReactionResults(currentMessage.message, isMine)}
          </View>
        )}
        {!isMine && inFiveMin(currentMessage.message.createTime) && (
          <KJTouchableOpacity
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              right: 54,
              top: -4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.onReactionTapped}
          >
            <Image
              ref={(ref) => {
                this.reactionBtnRef = ref;
              }}
              style={{
                width: 26,
                height: 26,
              }}
              source={require('./img/ic_emoji.png')}
            />
          </KJTouchableOpacity>
        )}
      </Animatable.View>
    );
  };

  renderReactionResults = (message) => {
    const reactionRawList = message.reaction;

    const reactionList = Object.keys(reactionRawList).map((key) => reactionRawList[key]);
    const reactionCountList = {};
    for (let i = 0; i < reactionList.length; i += 1) {
      reactionCountList[reactionList[i]] = 1 + (reactionCountList[reactionList[i]] || 0);
    }

    const reactionImageDict = REACTION_IMAGE;

    return (
      <TouchableOpacity onPress={this.onReactionResultsPress}>
        <View
          style={{
            flexDirection: 'row',
            height: 22,
            paddingLeft: 2,
            paddingRight: 2,
            shadowOffset: { width: 0.0, height: 1 },
            shadowColor: '#808080',
            shadowOpacity: 0.5,
            shadowRadius: 1.0,
            borderRadius: 13,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            margin: Platform.OS === 'ios' ? 0 : 2,
            elevation: 1,
          }}
        >
          {Object.keys(reactionCountList).map((reaction) => (
            <View
              style={{
                height: 18,
                marginLeft: 1,
                marginRight: 1,
                shadowOffset: { width: 0.0, height: 0.5 },
                shadowColor: '#808080',
                shadowOpacity: 0.3,
                shadowRadius: 0.5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 0,
              }}
            >
              <Animatable.Image
                style={{
                  width: 18,
                  height: 18,
                }}
                source={reactionImageDict[reaction]}
                animation={'bounceIn'}
                useNativeDriver
              />
              {reactionCountList[reaction] > 1 && (
                <AppText
                  style={{
                    marginLeft: 1,
                    marginRight: 1,
                    fontSize: 10,
                    color: '#0082e0',
                    fontWeight: '200',
                    flex: 0,
                  }}
                >
                  {reactionCountList[reaction]}
                </AppText>
              )}
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  renderTextMess() {
    const {
      isMine = true,
      name,
      currentMessage,
      prevMessage,
      animated,
      isSingleThread,
    } = this.props;
    const CustomView = animated ? Animatable.View : View;
    const messageReadStyle = this.checkIsRead(currentMessage)
      ? styles.leftBubble
      : styles.leftUnreadBubble;
    const isRead = this.checkIsRead(currentMessage);

    return (
      <CustomView
        duration={isRead ? 300 : 350}
        animation={isRead ? 'fadeIn' : isMine ? 'fadeInRight' : 'fadeInLeft'} // eslint-disable-line
        useNativeDriver
      >
        {/* {
          this.renderNameAndTime(
            isMine,
            currentMessage,
            prevMessage,
            isSingleThread ? currentMessage.message.getAuthorShortName() : name,
          )
        } */}
        {
          <View
            style={{
              paddingTop: inFiveMin(currentMessage.message.createTime) ? 4 : 0,
            }}
            ref={(ref) => {
              this.messageViewRef = ref;
            }}
            onLayout={() => {}}
          >
            <View>
              {currentMessage.message.updateTime !== currentMessage.message.createTime && (
                <Image
                  style={[
                    {
                      position: 'absolute',
                      bottom: 0,
                      top: 0,
                      height: '100%',
                      width: 18,
                    },
                    isMine ? { left: 32 } : { right: 46 },
                  ]}
                  resizeMode="contain"
                  source={require('./img/edited.png')}
                />
              )}
              {this.state.previewData !== null ? (
                this.renderPreview(this.state.previewData, isMine)
              ) : (
                <Bubble
                  {...this.props}
                  wrapperStyle={{
                    left: this.checkIsSelected() ? styles.leftSelectedBubble : messageReadStyle,
                    right: this.checkIsSelected() ? styles.rightSelectedBubble : styles.rightBubble,
                  }}
                  containerToNextStyle={{
                    left: {
                      borderBottomLeftRadius: 3,
                      borderTopLeftRadius: 0,
                    },
                    right: {
                      borderBottomRightRadius: 3,
                      borderTopRightRadius: 0,
                    },
                  }}
                  containerToPreviousStyle={{
                    left: { borderTopLeftRadius: 3 },
                    right: { borderTopRightRadius: 3 },
                  }}
                  textTimeStyle={{
                    left: { fontSize: 10, color: '#888' },
                  }}
                  customTextStyle={[
                    {
                      fontSize: 15,
                      paddingTop: 4,
                      paddingRight: 4,
                      paddingBottom: 8,
                    },
                    currentMessage.message.isRecalled ? { fontStyle: 'italic' } : {},
                    isMine ? {} : { color: '#444' },
                  ]}
                  needRadient={isMine}
                  radientColors={['#21adff', '#0082e0']}
                  onLongPress={this.onMessageLongPress}
                />
              )}
            </View>
            {this.checkHasReactions() && <View style={{ height: 18 }} />}
            {this.checkHasReactions() && (
              <View
                style={[
                  {
                    position: 'absolute',
                    bottom: 4,
                  },
                  isMine ? { right: 0 } : { left: 0 },
                ]}
              >
                {this.renderReactionResults(currentMessage.message, isMine)}
              </View>
            )}
            {!isMine && inFiveMin(currentMessage.message.createTime) && (
              <KJTouchableOpacity
                style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  right: this.state.previewData !== null ? -6 : 68,
                  top: -4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this.onReactionTapped}
              >
                <Image
                  ref={(ref) => {
                    this.reactionBtnRef = ref;
                  }}
                  style={{
                    width: 26,
                    height: 26,
                  }}
                  source={require('./img/ic_emoji.png')}
                />
              </KJTouchableOpacity>
            )}
          </View>
        }
      </CustomView>
    );
  }

  renderStickerMess = () => {
    const { name, currentMessage, prevMessage, isMine, isSingleThread } = this.props;

    const contents = currentMessage.message.htmlText.split('_');
    let type = '';
    if (contents.length >= 2) {
      type = contents[0];
    }
    let icon = '';

    let data = [];
    if (EMOJI_CATEGORIES[type]) {
      data = EMOJI_CATEGORIES[type].data;
    }
    for (let i = 0; i < data.length; i += 1) {
      if (currentMessage.message.htmlText === data[i].uid) {
        icon = data[i].icon;
      }
    }
    if (icon !== '') {
      const isRead = this.checkIsRead(currentMessage);
      return (
        <Animatable.View
          duration={isRead ? 300 : 350}
          animation={isRead ? 'fadeIn' : isMine ? 'fadeInRight' : 'fadeInLeft'} // eslint-disable-line
          useNativeDriver
        >
          {/* {
            this.renderNameAndTime(
              isMine,
              currentMessage,
              prevMessage,
              isSingleThread ? currentMessage.message.getAuthorShortName() : name,
            )
          } */}
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
              marginRight: 20,
              marginLeft: 4,
              marginBottom: 16,
              marginTop: 16,
            }}
            source={icon}
          />
        </Animatable.View>
      );
    }
    return null;
  };

  renderNameAndTime(isMine, currentMessage, prevMessage, name) {
    const time = currentMessage.message.formatedTimeInHour();
    const isInSameUser = isSameUser(currentMessage, prevMessage);
    const isInSameDay = isSameDay(currentMessage, prevMessage);
    const isIn30Min = is30Min(currentMessage, prevMessage);
    const showName = true;
    return (
      !isMine &&
      !(isInSameUser && isInSameDay && isIn30Min) && (
        <AppText
          style={{
            fontSize: 10,
            color: '#555',
            marginBottom: 2,
            marginTop: 4,
            marginLeft: 2,
          }}
        >
          {showName ? `${name}, ${time}` : `${time}`}
        </AppText>
      )
    );
  }

  render() {
    const { type, name, currentMessage, prevMessage, isMine, isSingleThread } = this.props;
    let content = null;
    let needRadient = false;
    switch (type) {
      case MESSAGE_TYPES.IMAGES:
        content = this.renderImgMess.bind(this);
        break;
      case MESSAGE_TYPES.STICKER:
        content = this.renderStickerMess.bind(this);
        break;
      case MESSAGE_TYPES.VIDEOS:
        content = this.renderImgMess.bind(this);
        break;
      case MESSAGE_TYPES.AUDIOS:
        needRadient = true;
        content = this.renderImgMess.bind(this);
        break;
      default:
        content = this.renderTextMess.bind(this);
    }
    return (
      <View>
        {this.renderNameAndTime(
          isMine,
          currentMessage,
          prevMessage,
          isSingleThread ? currentMessage.message.getAuthorShortName() : name,
        )}
        {content?.(needRadient)}
      </View>
    );
  }
}

MessageBubble.defaultProps = {
  animated: true,
};

export default MessageBubble;

// --------------------------------------------------

const styles = StyleSheet.create({
  leftBubble: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E7E7',
    borderWidth: 1,
    borderRadius: 14,
    marginRight: 76,
  },
  rightBubble: {
    borderRadius: 14,
    borderColor: '#0000',
    borderWidth: 1,
  },
  leftUnreadBubble: {
    backgroundColor: '#FFF',
    borderColor: '#3BF9',
    borderWidth: 1,
    borderRadius: 14,
    marginRight: 76,
  },

  leftSelectedBubble: {
    backgroundColor: '#FFF',
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 14,
    marginRight: 76,
  },

  rightSelectedBubble: {
    borderRadius: 14,
    borderColor: '#ff9900',
    borderWidth: 1,
  },

  leftBubbleImage: {
    backgroundColor: '#0000',
    borderRadius: 6,
  },
  rightBubbleImage: {
    backgroundColor: '#0000',
    borderRadius: 6,
  },
  leftUnreadBubbleImage: {
    backgroundColor: '#0000',
    borderRadius: 6,
    borderColor: '#39B5FC',
    borderWidth: 1.0,
  },
});

function isSameDay(currentMessage = {}, diffMessage = {}) {
  if (!diffMessage.createdAt) {
    return false;
  }

  const currentCreatedAt = moment(currentMessage.createdAt);
  const diffCreatedAt = moment(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

function is30Min(currentMessage, prevMessage) {
  if (prevMessage && prevMessage.message) {
    return (currentMessage.message.createTime - prevMessage.message.createTime) / (1000 * 60) <= 30;
  }
  return false;
}

function isSameUser(currentMessage = {}, diffMessage = {}) {
  return !!(
    (diffMessage.user && currentMessage.user && diffMessage.user._id === currentMessage.user._id) // eslint-disable-line
  );
}

const inFiveMin = (updateTime) => {
  const currentTime = Math.floor(Date.now());
  return currentTime - updateTime <= 5 * (60 * 1000);
};
