/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import moment from 'moment';
import * as Progress from 'react-native-progress';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import RemoteImage from 'app/components/common/RemoteImage';



// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'MessageImage.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

const IMAGE_WIDTH = SCREEN_SIZE.width * 0.5;

const IMAGE_WIDTH_MAX = SCREEN_SIZE.width * 0.6;

const _ = require('lodash');

// --------------------------------------------------
// MessageImage
// --------------------------------------------------

class MessageImage extends Component {
  constructor(props) {
    super(props);

    let { width, height } = this.props.currentMessage.message;
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

    this.state = {
      widthImage: (width),
      heightImage: (height),
      isSelected: false,
      image: this.props.currentMessage.image || 'placeholder',
      canUploading: true,
      downloadingProgress: -1,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isMine } = this.props;
    const nextMessage = nextProps.currentMessage;
    if (isMine) {
      if (this.state.image === 'placeholder' && nextMessage.image) {
        this.setState({
          image: nextMessage.image,
        });
      }
      this.setCanUploadingFrom(nextProps.uploadingProgress);
    }
    else if (!isMine) {
      if (nextMessage.image !== this.state.image) {
        this.setState({
          image: nextMessage.image,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isMine } = this.props;
    if (isMine) {
      if (
        nextState.canUploading !== this.state.canUploading ||
        nextState.image !== this.state.image ||
        this.props.uploadingProgress < nextProps.uploadingProgress) {
        return true;
      }
    }
    else if (!isMine) {
      return (!(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    }
    return false;
  }

  onPress = () => {
    this.props.onImagePress(this.props.currentMessage);
  }
  onLongPress = () => {
    this.props.onImageLongPress(
      this.props.currentMessage,
      this.messageViewRef,
      this,
    );
  }

  setIsSelected = (selected) => {
    this.setState({
      isSelected: selected,
    });
  }

  setCanUploadingFrom = (uploadingProgress) => {
    if (uploadingProgress && uploadingProgress === 100) {
      setTimeout(() => {
        if (this.state.canUploading) {
          this.setState({
            canUploading: false,
          });
        }
      }, 1000);
    }
  }

  checkIsSelected = () => {
    return this.state.isSelected;
  }

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
  }

  updateDownloadingProgress = ({ nativeEvent }) => {
    const progress = (nativeEvent.loaded / nativeEvent.total) * 100;
    if (this.state.downloadingProgress !== progress) {
      if (process === 100) {
        this.setState({
          downloadingProgress: 99,
        });
        setTimeout(() => {
          this.setState({
            downloadingProgress: progress,
          });
        }, 200);
      }
      else {
        this.setState({
          downloadingProgress: progress,
        });

      }
    }
  }

  showDownloading = () => {
    return this.state.downloadingProgress !== -1 && this.state.downloadingProgress !== 100;
  }

  showLoading = () => {
    const { isMine, uploadingProgress } = this.props;
    return (
      (isMine && uploadingProgress && this.state.canUploading)
    );
  }

  renderNameAndTime(isMine, currentMessage, prevMessage, name) {
    const time = currentMessage.message.formatedTimeInHour();
    const isInSameUser = isSameUser(currentMessage, prevMessage);
    const isInSameDay = isSameDay(currentMessage, prevMessage);
    const isIn30Min = is30Min(currentMessage, prevMessage);
    const showName = !isInSameUser || !isInSameDay;
    return (
      !isMine &&
      !(isInSameUser && isInSameDay &&
        isIn30Min) &&
      <AppText style={{
        fontSize: 10,
        color: '#555',
        marginBottom: 2,
        marginTop: showName ? 0 : 4,
        marginLeft: 2,
      }}
      >
        {showName ? `${name}, ${time}` : `${time}`}
      </AppText>
    );
  }

  render() {
    const { currentMessage, prevMessage, imageProps, isMine, name, isSingleThread, uploadingProgress } = this.props;
    const isRead = this.checkIsRead(currentMessage);
    // --
    return (
      <View
        ref={ref => { this.messageViewRef = ref; }}
        style={[styles.container]}
        onLayout={() => { }}
      >
        {/* {
          this.renderNameAndTime(
            isMine,
            currentMessage,
            prevMessage,
            isSingleThread ? currentMessage.message.getAuthorShortName() : name,
          )
        } */}
        <View style={!isRead ? styles.border : {}}>
          <TouchableOpacity
            onPress={this.onPress}
            onLongPress={this.onLongPress}
          >
            <Animated.View
              style={[styles.image, {
                width: this.state.widthImage,
                height: this.state.heightImage,
                borderColor: '#0000',
                borderWidth: 1,
              },
              this.checkIsSelected() ? styles.selectedBubble : {},
              ]}
            >
              {
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0002',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {
                    this.state.image !== 'placeholder' &&
                    <RemoteImage
                      {...imageProps}
                      style={[styles.image, {
                        position: 'absolute',
                        resizeMode: 'contain',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }]}
                      source={{ uri: this.state.image }}
                      onProgress={this.updateDownloadingProgress}
                    />
                  }
                  {
                    this.showLoading() &&
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#0005',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Progress.Circle
                        progress={uploadingProgress / 100}
                        size={42}
                        borderColor={'#fff'}
                        fill={'#fff'}
                        color={'#fff'}
                        showsText
                        thickness={1}
                        textStyle={{
                          fontWeight: '400',
                          fontSize: 12,
                        }}
                      />
                    </View>
                  }
                  {
                    this.showDownloading() &&
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#0005',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Progress.Circle
                        progress={this.state.downloadingProgress / 100}
                        size={42}
                        borderColor={'#fff'}
                        fill={'#fff'}
                        color={'#fff'}
                        showsText
                        thickness={1}
                        textStyle={{
                          fontWeight: '400',
                          fontSize: 12,
                        }}
                      />
                    </View>
                  }
                  {
                    // this.showLoading() &&
                    // <View
                    //   style={{ width: 24, height: 24 }}
                    // >
                    //   <LottieView
                    //     style={{ flex: 1, width: 24, height: 24 }}
                    //     source={require('./img/loading.json')}
                    //     autoPlay
                    //     loop
                    //   />
                    // </View>
                  }
                </View>

              }
            </Animated.View>

          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

MessageImage.defaultProps = {
  onImagePress: () => { },
};

export default MessageImage;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    borderRadius: Platform.OS === 'ios' ? 6 : 3,
    margin: 2,
    borderColor: '#0000',
    borderWidth: 1.0,
  },
  border: {
    borderColor: '#3BF9',
    borderWidth: 1.0,
    borderRadius: Platform.OS === 'ios' ? 6 : 3,
  },
  image: {
    borderRadius: Platform.OS === 'ios' ? 6 : 1,
  },
  tempImage: {
    position: 'absolute',
    margin: 2,
    resizeMode: 'contain',
    opacity: 0,
  },
  selectedBubble: {
    borderColor: '#ff9900',
    borderWidth: 1,
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
    return ((currentMessage.message.createTime - prevMessage.message.createTime) / (1000 * 60)) <= 30;
  }
  return false;
}

function isSameUser(currentMessage = {}, diffMessage = {}) {
  return !!(
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id // eslint-disable-line
  );
}
