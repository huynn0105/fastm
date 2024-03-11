/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import { TypingAnimation } from 'react-native-typing-animation';

import colors from 'app/constants/colors';
import KJImage from 'app/components/common/KJImage';
import CharAvatar from 'app/components/CharAvatar';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ThreadRow.js';
/* eslint-enable */

const ROW_PADDING_LEFT = 16;
const ROW_PADDING_RIGHT = 16;
const PHOTO_SIZE = 54;
const PHOTO_CONTENT_SPACING = 10;
const TITLE_MAX_LINES = 1;
const LAST_MESSAGE_MAX_LINES = 1;

// --------------------------------------------------
// ThreadRow
// --------------------------------------------------

class ThreadRow extends PureComponent {
  onLongPress = () => {
    requestAnimationFrame(() => {
      this.props.onLongPress(this.props.thread);
    });
  }

  onPress = () => {
    requestAnimationFrame(() => {
      this.props.onPress(this.props.thread);
    });
  }
  // --------------------------------------------------
  renderPhoto() {
    const { thread, totalUnReadMessages } = this.props;
    const isNotificationOn = thread.isNotificationOn;
    return (
      <View
        style={styles.photoContainer}
      >
        <CharAvatar
          avatarStyle={styles.photoImage}
          source={thread.photoImageURI()}
          defaultSource={thread.photoImagePlaceholder()}
          defaultName={thread.titleString()}
        />
        {
          totalUnReadMessages <= 0 ? null :
            <AppText
              style={isNotificationOn ? styles.badge : styles.badgeBlue}
            >
              {`${totalUnReadMessages}`}
            </AppText>
        }
      </View>
    );
  }
  renderContent() {
    const { thread, lastMessage, totalUnReadMessages, isSystem, typingUsers } = this.props;
    if(!lastMessage) return <View />;
    const lastMessageString =
      lastMessage ? lastMessage.getDisplayTextForLastMessage() : '...';
    const isUnread = totalUnReadMessages > 0;
    const titleStyle =
      isUnread ? styles.titleBoldText : styles.titleText;
    const titleSystemStyle =
      isUnread ? styles.titleBoldTextSystem : styles.titleTextSystem;
    const lastMessageStyle =
      isUnread ? styles.lastMessageBoldText : styles.lastMessageText;
    return (
      <View style={styles.contentContainer} >
        <AppText
          style={isSystem ? titleStyle : titleStyle}
          numberOfLines={TITLE_MAX_LINES}
        >
          {`${thread.titleString()}`}
        </AppText>
        {
          typingUsers.length > 0 ?
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  height: 16,
                  marginTop: 4,
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: '#e8e8e8',
                  width: 32,
                  borderRadius: 8,
                }}
              >
                <TypingAnimation
                  dotColor={'#999'}
                  dotMargin={5}
                  dotAmplitude={2.5}
                  dotRadius={2}
                  dotX={12}
                  dotY={4}
                />
              </View>
            </View>
            :
            <View
              style={{
                height: 20,
                marginTop: 2,
              }}
            >
              <AppText
                style={lastMessageStyle}
                numberOfLines={LAST_MESSAGE_MAX_LINES}
              >
                {`${lastMessageString}`}
              </AppText>
            </View>

        }
      </View>
    );
  }
  renderExtraInfo() {
    const { thread, blocked, lastUpdated } = this.props;
    const isFavorite = thread.isFavorite;
    const isNotificationOn = thread.isNotificationOn;
    return (
      <View style={styles.extraInfoContainer}>
        <AppText style={styles.timeText}>
          {lastUpdated}
        </AppText>
        <View style={styles.statusContainer}>
          {
            // !isFavorite ? null :
            //   <KJImage
            //     style={styles.statusIcon}
            //     source={require('./img/pinned.png')}
            //     defaultSource={require('./img/pinned.png')}
            //     resizeMode="contain"
            //   />
          }
          {
            isNotificationOn ? null :
              <KJImage
                style={styles.statusIcon}
                source={require('./img/mute.png')}
                defaultSource={require('./img/mute.png')}
                resizeMode="contain"
              />
          }
          {
            blocked ?
              <KJImage
                style={styles.statusIcon}
                source={require('./img/close.png')}
                defaultSource={require('./img/close.png')}
                resizeMode="contain"
              />
              : null
          }
        </View>
      </View>
    );
  }
  render() {
    return (
      <View
        testID={this.props.testID}
      >
        <TouchableHighlight
          style={{
            height: 68,
            // backgroundColor: 'blue',
          }}
          // delayTime={10}
          underlayColor={'#2228'}
          onPress={this.onPress}
          onLongPress={this.onLongPress}
        >
          <View style={styles.rowContainer}>
            {this.renderPhoto()}
            {this.renderContent()}
            {this.renderExtraInfo()}
          </View>
        </TouchableHighlight>
        {/* {
          isSeparatorHidden ? null :
            <View style={styles.separator} />
        } */}
      </View >
    );
  }
}

ThreadRow.defaultProps = {
  lastMessage: {},
  totalUnReadMessages: 0,
  isSeparatorHidden: false,
  typingUsers: [],
};

export default ThreadRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
    // backgroundColor: 'red',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.navigation_bg,
    // backgroundColor: 'green',
  },
  photoContainer: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 7,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  photoImage: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 0,
    paddingLeft: 5,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#FF503E',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
  },
  badgeBlue: {
    position: 'absolute',
    right: 5,
    top: 0,
    paddingLeft: 5,
    paddingRight: 4,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 8,
    color: '#0080DC',
    backgroundColor: '#fff',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
    borderColor: '#0080DC',
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000d',
  },
  titleBoldText: {
    fontSize: 15,
    fontWeight: '700',
  },
  titleTextSystem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0076ff',
  },
  titleBoldTextSystem: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0076ff',
  },
  lastMessageText: {
    marginTop: 2,
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  lastMessageBoldText: {
    marginTop: 2,
    color: '#000',
    fontSize: 13,
    fontWeight: '400',
  },
  extraInfoContainer: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 6,
    marginLeft: 4,
    backgroundColor: '#0000',
  },
  timeText: {
    color: '#7f7f7f',
    fontSize: 10,
    fontWeight: '300',
  },
  statusContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  statusIcon: {
    flex: 0,
    flexDirection: 'row',
    marginLeft: 8,
    width: 14,
    height: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: PHOTO_SIZE + PHOTO_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
});
