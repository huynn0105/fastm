import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import AppText from '../../componentV3/AppText';
import { SH } from '../../constants/styles';

const LOG_TAG = 'MessageImage.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

const IMAGE_WIDTH_MAX = SCREEN_SIZE.width * 0.6;

// --------------------------------------------------
// MessageImage
// --------------------------------------------------

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    const fullscreenMode = this.props.fullscreenMode;
    // const height = fullscreenMode ? SCREEN_SIZE.height : IMAGE_WIDTH_MAX * 1.5;
    const width = fullscreenMode ? SCREEN_SIZE.width : IMAGE_WIDTH_MAX;
    this.interval;
    this.state = {
      screenWidth: width,
      heightScaled: width,
      canUploading: true,
      downloadingProgress: -1,
      duration: 0,
      playableDuration: 0,
      currentTime: 0,
      playing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isMine } = this.props;
    if (isMine) {
      this.setCanUploadingFrom(nextProps.uploadingProgress);
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.setState({
        playing: false,
      });
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onPlayPress = () => {
    if (Platform.OS === 'ios') {
      this.onFullScreenPress();
      this.setState({
        playing: true,
      });
    } else {
      if (this.props.fullscreenMode) {
        this.setState({
          playing: true,
        });
      }
      this.onFullScreenPress();
    }
  };
  onPress = () => {
    if (this.props.previewMode) {
      return;
    }
    if (Platform.OS === 'ios') {
      this.onFullScreenPress();
      if (!this.state.playing) {
        this.setState({
          playing: true,
        });
      }
    } else {
      if (this.props.fullscreenMode) {
        this.setState({
          playing: !this.state.playing,
        });
      }
      this.onFullScreenPress();
    }
  };
  onFullScreenPress = () => {
    // if (Platform.OS === 'ios') {
    //   if (this.player) {
    //     this.player.presentFullscreenPlayer();
    //   }
    // } else {
    if (this.props.onFullScreenPress) {
      this.props.onFullScreenPress();
    }
    // }
  };
  onClosePress = () => {
    if (this.props.onClosePress) {
      this.props.onClosePress();
    }
  };
  onLongPress = () => {
    if (this.props.previewMode) {
      return;
    }
    if (this.props.onLongPress) {
      this.props.onLongPress();
    }
    // this.props.onImageLongPress(
    //   this.props.currentMessage,
    //   this.messageViewRef,
    //   this,
    // );
  };
  onBuffer = () => {};
  onError = () => {};
  onLoadStart = () => {
    this.updateDownloadingProgress(0);

    // Fake progress
    if (this?.state?.downloadingProgress < 50) {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.updateDownloadingProgress(
            this.state.downloadingProgress + Math.floor(Math.random() * 10),
          );
        }, 400);
      }
    } else {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  };
  onLoad = (response) => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.updateDownloadingProgress(100, response.duration);
    setTimeout(() => {
      if (this.props.fullscreenMode) {
        this.onPress();
      }
    });
  };
  onProgress = (payload) => {
    this.setState({
      playableDuration: payload.playableDuration,
      currentTime: payload.currentTime,
    });
  };
  onEnd = () => {
    this.player.seek(0);
    setTimeout(() => {
      this.setState({
        playing: false,
      });
    }, 100);
  };

  onFullscreenPlayerWillDismiss = () => {
    this.setState({
      playing: false,
    });
  };

  setCanUploadingFrom = (uploadingProgress) => {
    if (uploadingProgress && uploadingProgress === 100) {
      setTimeout(() => {
        if (this.state.canUploading) {
          this.setState({
            canUploading: false,
          });
        }
      }, 500);
    }
  };

  updateDownloadingProgress = (progress, duration) => {
    const durationState = progress === 100 ? { duration } : {};
    if (this.state.downloadingProgress !== progress) {
      this.setState({
        downloadingProgress: progress,
        ...durationState,
      });
    }
  };

  canShowLoading = () => {
    const { isMine, uploadingProgress } = this.props;
    return isMine && uploadingProgress && this.state.canUploading;
  };

  canShowDownloading = () => {
    return this.state.downloadingProgress !== -1 && this.state.downloadingProgress !== 100;
  };

  canShowPlayControls = () => {
    return this.state.duration !== 0 && this.state.playing === false;
  };

  toHHMMSS = (secs) => {
    const secNum = parseInt(secs, 10);
    const hours = Math.floor(secNum / 3600) % 24;
    const minutes = Math.floor(secNum / 60) % 60;
    const seconds = secNum % 60;
    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? `0${v}` : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };
  durationText = () => {
    return this.toHHMMSS(this.state.duration);
  };
  currentTimeText = () => {
    return this.toHHMMSS(this.state.currentTime);
  };
  playablePercent = () => {
    return this.state.playableDuration / this.state.duration;
  };
  playingPercent = () => {
    return this.state.currentTime / this.state.duration;
  };

  renderVideoPlayer = (setPlayerRef, playing) => {
    const { uploadingProgress } = this.props;

    return (
      <View>
        {
          <TouchableWithoutFeedback onPress={this.onPress} onLongPress={this.onLongPress}>
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0002',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {this.props.video &&
              this.props.video !== '' &&
              this.props.video !== 'video' &&
              this.props.video.length > 0 &&
              this.props?.fullscreenMode ? (
                <Video
                  source={{ uri: this.props.video }}
                  ref={(ref) => {
                    this.player = ref;
                    if (setPlayerRef) {
                      setPlayerRef(ref);
                    }
                  }}
                  onBuffer={this.onBuffer}
                  onError={this.videoError}
                  style={[
                    styles.image,
                    {
                      position: 'absolute',
                      resizeMode: 'contain',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: '#fff0',
                    },
                  ]}
                  progressUpdateInterval={500}
                  onLoadStart={this.onLoadStart}
                  onLoad={this.onLoad}
                  onProgress={this.onProgress}
                  onEnd={this.onEnd}
                  onFullscreenPlayerWillDismiss={this.onFullscreenPlayerWillDismiss}
                  paused={!playing}
                  resizeMode={'cover'}
                  useTextureView={Platform.OS === 'android'}
                />
              ) : null}
              {(!this.props.previewMode || this.props?.fullscreenMode) && (
                <PlayControl
                  onPress={this.onPlayPress}
                  show={!this.props?.fullscreenMode || this.canShowPlayControls()}
                />
              )}
              {!this.props.previewMode && (
                <Time
                  show={this.state.duration !== 0}
                  text={this.durationText()}
                  style={{
                    right: 4,
                    bottom: 4,
                  }}
                />
              )}
              {!this.props.previewMode && (
                <Time
                  show={this.state.currentTime !== 0}
                  text={this.currentTimeText()}
                  style={{
                    left: 4,
                    bottom: 4,
                  }}
                />
              )}
              {
                // <FullscreenIcon
                //   show={this.state.playing && !this.props.fullscreenMode}
                //   onPress={this.onFullScreenPress}
                // />
              }
              <CloseIcon show={this.props.canClose} onPress={this.onClosePress} />
              <DownloadingPercent
                show={this.canShowLoading()}
                downloadingProgress={uploadingProgress}
              />
              <DownloadingPercent
                show={this.canShowDownloading()}
                downloadingProgress={this.state.downloadingProgress}
              />
            </View>
          </TouchableWithoutFeedback>
        }
        {
          <PlayingSlider
            playingPercent={this.playingPercent()}
            playablePercent={this.playablePercent()}
          />
        }
      </View>
    );
  };

  render() {
    // --
    return (
      <View
        style={[
          {
            width: this.state.screenWidth,
            height: this.state.heightScaled,
          },
          this.props.style,
        ]}
      >
        {this.renderVideoPlayer(this.props.setPlayerRef, this.state.playing)}
      </View>
    );
  }
}

VideoPlayer.defaultProps = {
  onImagePress: () => {},
};

export default VideoPlayer;

const PlayingSlider = ({ playingPercent, playablePercent }) => (
  <View
    style={{
      position: 'absolute',
      height: 2,
      width: '100%',
      bottom: 0,
      left: 0,
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: `${playablePercent * 100}%`,
        backgroundColor: '#3BF3',
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: `${playingPercent * 100}%`,
        backgroundColor: '#0080DC',
      }}
    />
  </View>
);

const DownloadingPercent = ({ downloadingProgress, show }) =>
  show ? (
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
        progress={downloadingProgress / 100}
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
  ) : null;

const FullscreenIcon = ({ onPress, show }) =>
  show ? (
    <View
      style={{
        position: 'absolute',
        right: 4,
        top: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0003',
        borderRadius: 2,
        padding: 2,
      }}
    >
      <TouchableOpacity stype={{ padding: 4 }} onPress={onPress}>
        <Image
          style={{
            width: 26,
            height: 26,
          }}
          source={require('./img/fullSize.png')}
        />
      </TouchableOpacity>
    </View>
  ) : null;

const CloseIcon = ({ onPress, show }) =>
  show ? (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        left: 4,
        top: Platform.OS === 'ios' ? SH(30) : 4,
        zIndex: 100,
      }}
    >
      <View
        style={{
          backgroundColor: '#0007',
          borderRadius: 22,
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            width: 18,
            height: 18,
          }}
          source={require('./img/close_white.png')}
        />
      </View>
    </TouchableOpacity>
  ) : null;

const Time = ({ text, show, style }) =>
  show ? (
    <View
      style={[
        {
          position: 'absolute',
          // left: 4,
          // bottom: 4,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0005',
          paddingRight: 4,
          paddingLeft: 4,
          borderRadius: 2,
        },
        style,
      ]}
    >
      <AppText
        style={{
          color: '#fff',
        }}
      >
        {text}
      </AppText>
    </View>
  ) : null;

const PlayControl = ({ onPress, show }) =>
  show ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0005',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity stype={{ padding: 4 }} onPress={onPress}>
          <Image
            style={{
              width: 46,
              height: 46,
            }}
            source={require('./img/iconPlay.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  ) : null;

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
