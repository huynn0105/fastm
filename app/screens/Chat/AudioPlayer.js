import React, { Component } from 'react';

import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import Sound from 'react-native-sound';
import { showInfoAlert } from '../../utils/UIUtils';
import AppText from '../../componentV3/AppText';
class AudioPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      didLoadAudio: false,
      duration: 0,
      currentTime: 0,
      playing: false,
      isSelected: false,
    };

    this.sound = undefined;
    this.timer = undefined;
  }

  componentDidMount() {
    const { audio } = this.props;
    if (audio && audio !== 'audio') {
      this.mLoadSound(audio);
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextAudio = nextProps.audio;
    const currentAudio = this.props.audio;
    if (currentAudio !== nextAudio && nextAudio !== 'audio') {
      this.mLoadSound(nextAudio);
    }
  }

  componentWillUnmount() {
    this.mRelease();
  }

  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress();
    }
  }

  mOnTick = () => {
    if (this.sound) {
      this.sound.getCurrentTime((seconds) => {
        if (this.state.playing) {
          this.setState({
            currentTime: seconds,
          });
        }
      });
    }
  }

  mOnPlayPress = () => {
    if (!this.state.didLoadAudio) { return; }
    if (this.state.playing) { this.mStop(); }
    else { this.mPlay(); }
  }

  mLoadSound = (path) => {
    if (this.state.didLoadAudio) { return; }
    if (path && path !== '' && path !== 'audio') {
      this.sound = new Sound(path, '', (error) => {
        if (error) { return; }
        this.setState({
          didLoadAudio: true,
          duration: this.sound.getDuration(),
        });
      });
    }
  }

  mStopTimer = (timer) => {
    if (timer) { clearInterval(timer); }
  }

  mStartTimer = () => {
    this.mStopTimer(this.timer);
    this.timer = setInterval(this.mOnTick, 30);
  }

  mPlay = () => {
    if (this.sound) {
      this.setState({
        playing: true,
      });
      this.mStartTimer();
      this.sound.play((success) => {
        if (success) {
          this.mStop();

          // android doesn't reset current time with getCurrentTime
          setTimeout(() => {
            this.setState({
              currentTime: 0,
            });
          }, 100);
        } else {
          showInfoAlert('Có lỗi xảy ra');
          this.sound.reset();
        }
      });
    }
  }

  mStop = () => {
    this.setState({
      playing: false,
    });
    this.mStopTimer();
    if (this.sound) { this.sound.pause(); }
  }

  mRelease = () => {
    this.mStop();
    if (this.sound) { this.sound.release(); }
  }

  mTimeString = () => {
    let remaindingTime = this.state.duration - this.state.currentTime;
    if (remaindingTime < 0) { remaindingTime = 0; }
    return this.mToHHMMSS(remaindingTime);
  }

  mCurrentTime = () => {
    const { duration, currentTime } = this.state;
    let currentPercent = currentTime / duration;
    if (currentPercent > 1) { currentPercent = 1; }
    if (currentPercent < 0) { currentPercent = 0; }
    return currentPercent;
  }

  mToHHMMSS = (secs) => {
    const secNum = parseInt(secs, 10);
    const hours = Math.floor(secNum / 3600) % 24;
    const minutes = Math.floor(secNum / 60) % 60;
    const seconds = secNum % 60;
    return [hours, minutes, seconds]
      .map(v => ((v < 10) ? (`0${v}`) : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }

  render() {
    const { playing, didLoadAudio, isSelected } = this.state;
    const { isMine, width } = this.props;

    let iconPlay = playing ? require('./img/pause_btn.png') : require('./img/play_btn.png');
    if (isMine) {
      iconPlay = playing ? require('./img/pause_btn_white.png') : require('./img/play_btn_white.png');
    }

    return (
      <View>
        <TouchableOpacity
          ref={ref => { this.messageViewRef = ref; }}
          onPress={this.mOnPlayPress}
          onLongPress={this.onLongPress}
          style={{
            width,
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 8,
            paddingLeft: 6,
            paddingRight: 6,
            backgroundColor: isMine ? '#fff0' : '#fff',
            borderColor: '#ff9900',
            borderWidth: isSelected ? 1 : 0,
          }}
        >
          {
            didLoadAudio ?
              <Image
                style={{ width: 24, height: 24, opacity: didLoadAudio ? 1 : 0.25 }}
                source={iconPlay}
              />
              :
              <ActivityIndicator
                style={{
                  alignSelf: 'center',
                }}
                size="small"
                color={isMine ? '#fff' : '#333'}
              />
          }
          <View style={{ flex: 1, marginTop: 18, marginLeft: 4, marginRight: 12 }}>
            <PlayingSlider
              playingPercent={this.mCurrentTime()}
              playablePercent={1}
              colorFull={isMine ? '#fff6' : '#d8d8d8'}
              colorCurrent={isMine ? '#fff' : '#0080DC'}
            />
            <AppText style={{ marginTop: 4, fontSize: 12, color: isMine ? '#fff' : '#333' }}>
              {this.mTimeString()}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default AudioPlayer;

const PlayingSlider = ({ playingPercent, playablePercent, colorFull, colorCurrent }) => (
  <View
    style={{
      height: 2,
      width: '100%',
      bottom: 0,
      left: 0,
    }}
  >
    <View style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: `${playablePercent * 100}%`,
      backgroundColor: colorFull,
    }}
    />
    <View style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: `${playingPercent * 100}%`,
      backgroundColor: colorCurrent,
    }}
    />
  </View>
);

