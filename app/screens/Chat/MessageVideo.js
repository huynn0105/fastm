import React, { Component } from 'react';
import moment from 'moment';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  Text,
  Modal,
} from 'react-native';

import VideoPlayer from './VideoPlayer';
import ViewPlayerContainer from './VideoPlayerContainer';
import AppText from '../../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'MessageImage.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

const IMAGE_WIDTH_MAX = SCREEN_SIZE.width * 0.6;

const _ = require('lodash');

// --------------------------------------------------
// MessageImage
// --------------------------------------------------

class MessageVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: false,
      modalVisible: false,
      playingModal: false,
      video: 'video',
    };
  }
  componentWillReceiveProps(nextProps) {
    const { isMine } = this.props;
    const nextMessage = nextProps.currentMessage;
    if (isMine) {
      if (this.state.video === 'video' && nextMessage.video) {
        this.setState({
          video: nextMessage.video,
        });
      }
    }
    else {
      if (nextMessage.video !== 'video') {
        this.setState({
          video: nextMessage.video,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isMine } = this.props;
    if (isMine) {
      if (
        nextState.isSelected !== this.state.isSelected ||
        nextState.video !== this.state.video ||
        nextState.playingModal !== this.state.playingModal ||
        nextState.modalVisible !== this.state.modalVisible
      ) {
        return true;
      }
    }
    else if (!isMine) {
      return (!(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    }
    return false;
  }
  componentWillUnmount() {
    if (this.player) {
      this.setState({
        playing: false,
      });
    }
  }
  onPress = () => {
  }
  onLongPress = () => {
    this.props.onImageLongPress(
      this.props.currentMessage,
      this.messageViewRef,
      this,
    );
  }
  onFullScreenPress = () => {
    if (this.state.modalVisible === false) {
      this.setState({
        modalVisible: true,
      });
    }
    // else {
    //   this.setState({
    //     modalVisible: false,
    //   });
    // }
  }
  onClosePress = () => {
    this.setState({
      modalVisible: false,
    });
  }
  setIsSelected = (selected) => {
    this.setState({
      isSelected: selected,
    });
  }

  // setCanUploadingFrom = (uploadingProgress) => {
  //   if (uploadingProgress && uploadingProgress === 100) {
  //     setTimeout(() => {
  //       if (this.state.canUploading) {
  //         this.setState({
  //           canUploading: false,
  //         });
  //       }
  //     }, 500);
  //   }
  // }

  // canShowLoading = () => {
  //   const { isMine, uploadingProgress } = this.props;
  //   return (
  //     (isMine && uploadingProgress && this.state.canUploading)
  //   );
  // }

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

  renderModalVideoPlayer2 = () => {
    return (
      this.state.video !== 'video' &&
      <Modal
        style={this.state.modalVisible ? {} : {
          width: this.state.screenWidth,
          height: this.state.screenWidth,
        }}
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
        }}
      >
        <VideoPlayer
          style={this.state.modalVisible ? {
            width: '100%',
            height: '100%',
          } : {}}
          uploadingProgress={this.props.uploadingProgress}
          video={this.state.video}
          isMine={this.props.isMine}
          onLongPress={this.onLongPress}
          canClose={this.state.modalVisible}
          fullscreenMode={this.state.modalVisible}
          onClosePress={this.onClosePress}
          onFullScreenPress={this.onFullScreenPress}
        />
      </Modal>
    );
  }

  render() {
    const { currentMessage, prevMessage, isMine, name, isSingleThread } = this.props;
    const isRead = this.checkIsRead(currentMessage);
    // --
    return (
      <View
        ref={ref => { this.messageViewRef = ref; }}
        style={[styles.container]}
        onLayout={() => { }}
      >
        {/* {
          this.renderModalVideoPlayer()
        } */}
        {
          // this.renderModalVideoPlayer2()
        }
        {
          this.renderNameAndTime(
            isMine,
            currentMessage,
            prevMessage,
            isSingleThread ? currentMessage.message.getAuthorShortName() : name,
          )
        }
        <View style={[!isRead ? styles.border : {}, {
          borderRadius: 20,
          overflow: 'hidden',
        }]}
        >
          <TouchableOpacity
            onPress={this.onPress}
            onLongPress={this.onLongPress}
          >
            <Animated.View
              style={[styles.image, {
                width: this.state.screenWidth,
                height: this.state.heightScaled,
              },
              this.checkIsSelected() ? styles.selectedBubble : {},
              ]}
            >
              {/* <VideoPlayer
                uploadingProgress={this.props.uploadingProgress}
                video={this.state.video}
                isMine={this.props.isMine}
                onLongPress={this.onLongPress}
                setPlayerRef={ref => {
                  this.player = ref;
                }}
                fullscreenMode={false}
                onFullScreenPress={this.onFullScreenPress}
              /> */}
              <ViewPlayerContainer
                uploadingProgress={this.props.uploadingProgress}
                video={this.state.video}
                isMine={this.props.isMine}
                onLongPress={this.onLongPress}
                // setPlayerRef={ref => {
                //   this.player = ref;
                // }}
                // fullscreenMode={false}
                // onFullScreenPress={this.onFullScreenPress}
              />
            </Animated.View>

          </TouchableOpacity>
        </View>
      </View >
    );
  }
}

MessageVideo.defaultProps = {
  onImagePress: () => { },
};

export default MessageVideo;

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
