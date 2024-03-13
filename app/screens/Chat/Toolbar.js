import Strings from 'app/constants/strings';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MapView from 'react-native-maps';
import KJButton from '../../components/common/KJButton';
import RemoteImage from '../../components/common/RemoteImage';
import EmojiPicker from '../../components/EmojiPicker';
import AppText from '../../componentV3/AppText';
import { MESSAGE_TYPES } from '../../submodules/firebase/model/Message';
import audioRecorder from '../../utils/AudioWrapper';
import { checkMicroPermission } from '../../utils/PermissionWrapper';
import { showAlertForRequestPermission, showInfoAlert } from '../../utils/UIUtils';
import ViewPlayerContainer from '../Chat/VideoPlayerContainer';
import AudioPlayer from './AudioPlayer';
import RichInput from './RichInput';

const SPLIT_QUOTED = '>>>';

const SCREEN_SIZE = Dimensions.get('window');

const SHOWING_STATE = {
  NONE: 'NONE',
  EMOJI: 'EMOJI',
  ADDITIONAL: 'ADDITIONAL',
};

const SHOWING_HEIGHT = {
  NONE: 0,
  EMOJI: 216,
  ADDITIONAL: 100,
};

const RECORD = {
  NONE: 0,
  WAITING: 1,
  RECODING: 2,
  CANCEL: 3,
};

const MIN_DURATION = 2;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingState: SHOWING_STATE.NONE,
      record: RECORD.NONE,
      duration: 0,
      pan: new Animated.ValueXY(),
    };
    this.movedRecordButton = false;
    this.canCancel = false;
    this.recordPath = '';
  }

  componentWillMount() {
    this.mVal = { x: 0, y: 0 };
    this.state.pan.addListener((value) => {
      this.mVal = value;
    });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        this.movedRecordButton = !(gestureState.dx === 0 && gestureState.dy === 0);
        return this.movedRecordButton;
      },
      onPanResponderMove: Animated.event([null, { dx: this.state.pan.x }]),
      onPanResponderRelease: this.onUnholdRecord,
      onPanResponderTerminate: this.onUnholdRecord,
    });
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  onMorePress = () => {
    this.updateShowState(SHOWING_STATE.ADDITIONAL);
  };

  onLocationPress = () => {
    if (this.props.onAccessoryLocationPress) {
      this.props.onAccessoryLocationPress();
    }
  };

  onMicroPress = () => {
    this.setState({ record: RECORD.WAITING });
  };

  onCloseRecord = () => {
    this.setState({ record: RECORD.NONE });
  };

  onHoldRecord = () => {
    this.resetRecord();
    this.startTimer();
    this.setState({ record: RECORD.RECODING });
    this.startRecordAudio();
  };

  onUnholdRecord = () => {
    const stopRecordAsync = async () => {
      await this.stopRecordAudio();

      setTimeout(() => {
        if (this.canCancel) {
          this.resetRecord();
        } else {
          this.sendRecord();
        }
      }, 200);
    };
    stopRecordAsync();
  };

  onAccessoryEmojiPress = () => {
    this.updateShowState(SHOWING_STATE.EMOJI);
  };

  onTick = () => {
    this.setState({ duration: this.state.duration + 1 });
  };

  startRecordAudio() {
    checkMicroPermission()
      .then((isAuthorized) => {
        // eslint-disable-line
        if (isAuthorized) {
          audioRecorder.onFinished(({ success, audioFileURL, duration }) => {
            if (duration < MIN_DURATION) {
              showInfoAlert('Thời gian tin thoại quá ngắn');
            } else if (success) {
              this.recordPath = audioFileURL;
            } else {
              showInfoAlert('Thu âm không thành công');
            }
          });

          audioRecorder.startRecordAudio(new Date().getTime());
        } else {
          return Promise.reject();
        }
      })
      .catch(() => {
        showAlertForRequestPermission(Strings.micro_access_error_android);
      });
  }

  async stopRecordAudio() {
    await audioRecorder.stopRecordAudio();
  }

  sendRecord = () => {
    if (this.recordPath !== '') {
      const recordPath = this.recordPath;
      setTimeout(() => {
        this.setState({ record: RECORD.NONE });
        this.updateShowState(SHOWING_STATE.ADDITIONAL);
      }, 50);

      if (this.props.onSendAudio) {
        this.props.onSendAudio(recordPath);
      }
    }
    this.resetRecord();
  };

  resetRecord = () => {
    this.movedRecordButton = false;
    this.canCancel = false;
    this.stopTimer();
    this.state.pan.setValue({ x: 0, y: 0 });
    this.setState({
      duration: 0,
      record: RECORD.WAITING,
    });
    this.recordPath = '';
  };

  startTimer = () => {
    if (this.timer) {
      this.stopTimer();
    }
    this.timer = setInterval(this.onTick, 1000);
  };

  stopTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
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

  updateShowState(showingState) {
    if (this.state.showingState !== showingState) {
      this.setState({ showingState });
    } else {
      this.setState({ showingState: SHOWING_STATE.NONE });
    }
    setTimeout(() => {
      this.toolbarBottomChanged(SHOWING_HEIGHT[this.state.showingState], true);
    });
  }

  toolbarBottomChanged(height, forceUpdate = false) {
    this.props.onToolbarBottomChanged({ height, forceUpdate });
  }

  hide() {
    if (this.state.showingState !== SHOWING_STATE.NONE) {
      this.setState({ showingState: SHOWING_STATE.NONE });
      this.toolbarBottomChanged(SHOWING_HEIGHT[SHOWING_STATE.NONE]);
    }
  }

  dismiss() {
    if (this.state.showingState !== SHOWING_STATE.NONE) {
      this.setState({ showingState: SHOWING_STATE.NONE });
      this.toolbarBottomChanged(SHOWING_HEIGHT[SHOWING_STATE.NONE], true);
    }
  }

  movedDistancePercentage = () => {
    const movedValue = this.state.pan.x._value; // eslint-disable-line
    return (-1 * movedValue) / (SCREEN_SIZE.width / 3.25);
  };

  recordNote = (isRecording, canCancel) => {
    let note = 'Nhấn giữ để bắt đầu ghi âm';
    if (isRecording) {
      note = canCancel ? 'Thả để hủy' : 'Thả để gửi \nVuốt sang trái để huỷ';
    }
    return note;
  };

  renderRecord = () => {
    return (
      <Animatable.View
        style={{
          height: 100,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
        animation={'fadeIn'}
        duration={350}
        useNativeDriver
      >
        {this.renderTimeRecord()}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <AppText style={{ color: '#666', flex: 0, width: '100%', textAlign: 'left' }}>
            {this.recordNote(this.state.record === RECORD.RECODING, this.canCancel)}
          </AppText>
        </View>
        {this.renderRecordingButton()}
      </Animatable.View>
    );
  };

  renderRecordingWave = (color, delay) => {
    return (
      <Animatable.View
        style={{
          width: 60,
          height: 60,
          position: 'absolute',
          backgroundColor: color,
          borderRadius: 60 / 2,
        }}
        delay={delay}
        animation="zoomFadeOut"
        duration={2500}
        easing="ease-out"
        iterationCount="infinite"
      />
    );
  };

  renderRecordingButton = () => {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    this.canCancel = this.movedDistancePercentage() > 1;
    const recordingColor = this.canCancel ? '#e6472b88' : '#39B5FC55';
    return (
      <Animated.View {...this.panResponder.panHandlers} style={panStyle}>
        <Animatable.View
          style={{
            margin: 20,
          }}
          animation={'bounceIn'}
          useNativeDriver
        >
          {this.state.record === RECORD.RECODING && this.renderRecordingWave(recordingColor, 0)}
          {this.state.record === RECORD.RECODING && this.renderRecordingWave(recordingColor, 1000)}
          <View
            style={{
              borderColor: recordingColor,
              borderRadius: 30,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              flex: 0,
            }}
            animation={'bounceIn'}
            useNativeDriver
          >
            <TouchableOpacity
              style={{
                width: 58,
                height: 58,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPressIn={this.onHoldRecord}
              onPressOut={() => {
                if (!this.movedRecordButton) {
                  this.onUnholdRecord();
                }
              }}
            >
              <Image
                style={{ width: 36, height: this.canCancel ? 30 : 36 }}
                source={
                  this.canCancel ? require('./img/trashcan.png') : require('./img/microphone.png')
                }
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </Animated.View>
    );
  };

  renderTimeRecord = () => {
    return (
      <View
        style={{
          margin: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 0,
          width: 50,
        }}
      >
        {this.state.record === RECORD.RECODING ? (
          <AppText>{this.toHHMMSS(this.state.duration)}</AppText>
        ) : (
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.onCloseRecord}
          >
            <Image
              style={{ width: 20, height: 20, opacity: 0.5 }}
              source={require('./img/close.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderAdditionalButton = (title, icon, onPress) => {
    return (
      <Animatable.View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 24,
          marginRight: 24,
          marginBottom: 2,
        }}
        animation={'bounceIn'}
        useNativeDriver
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onPress}
          activeOpacity={0.25}
        >
          <Image
            style={{ width: 30, height: 30, marginBottom: 4 }}
            source={icon}
            resizeMode={'contain'}
          />
          <AppText
            style={{
              color: '#838491',
              fontSize: 13,
            }}
          >
            {title}
          </AppText>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  renderAdditionalArea = () => {
    return this.state.record === RECORD.NONE ? this.renderAdditionalButtons() : this.renderRecord();
  };

  renderAdditionalButtons = () => {
    return (
      <View
        style={{
          height: 100,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this.renderAdditionalButton(
          'Gửi vị trí',
          require('./img/location.png'),
          this.onLocationPress,
        )}
        {this.renderAdditionalButton('Ghi âm', require('./img/microphone.png'), this.onMicroPress)}
      </View>
    );
  };

  renderMoreButton() {
    const { inputHasText, onAccessoryCameraPress, onAccessoryPhotoPress } = this.props;
    return (
      <Animatable.View
        style={{
          flexDirection: 'row',
        }}
        animation={inputHasText ? 'bounceOut' : 'fadeIn'}
        useNativeDriver
      >
        <KJButton
          containerStyle={[styles.barButton, styles.cameraButton]}
          leftIconSource={require('./img/camera.png')}
          onPress={onAccessoryCameraPress}
          leftIconStyle={{
            width: 22,
            height: 22,
          }}
        />
        <KJButton
          containerStyle={[styles.barButton, styles.photoButton]}
          leftIconSource={require('./img/photo.png')}
          onPress={onAccessoryPhotoPress}
          leftIconStyle={{
            width: 22,
            height: 22,
          }}
        />
        <KJButton
          containerStyle={[styles.barButton, styles.locationButton]}
          leftIconSource={
            this.state.showingState === SHOWING_STATE.ADDITIONAL
              ? require('./img/selected_more.png')
              : require('./img/more.png')
          }
          onPress={this.onMorePress}
          leftIconStyle={{
            width: 22,
            height: 22,
            marginBottom: 2,
          }}
        />
      </Animatable.View>
    );
  }
  renderInput() {
    const {
      setRichInputRef,
      inputToolbarProps,
      inputHasText,
      showRecommendTagWithName,
      changedTagData,
    } = this.props;

    return (
      <View
        style={{
          width: inputHasText ? SCREEN_SIZE.width - 46 * 1 : SCREEN_SIZE.width - 46 * 4,
        }}
      >
        <RichInput
          ref={setRichInputRef}
          inputToolbarProps={inputToolbarProps}
          showRecommendTagWithName={showRecommendTagWithName}
          changedTagData={changedTagData}
        />
      </View>
    );
  }
  renderEmojiButton() {
    return (
      <KJButton
        containerStyle={[styles.barButton, styles.emojiButton]}
        leftIconSource={
          this.state.showingState === SHOWING_STATE.EMOJI
            ? require('./img/emoji_selected.png')
            : require('./img/emoji.png')
        }
        onPress={this.onAccessoryEmojiPress}
        leftIconStyle={{
          width: 20,
          height: 20,
        }}
      />
    );
  }
  renderEmojiPicker = () => {
    return (
      <Animatable.View
        animation={this.state.showingState === SHOWING_STATE.EMOJI ? 'slideInUp' : 'slideOutDown'}
        duration={150}
        useNativeDriver
      >
        <EmojiPicker
          onEmojiSelected={this.props.onEmojiPickerEmojiSelected}
          onKeyboardSelected={this.props.onEmojiPickerKeyboardSelected}
          onDeletePressed={this.props.onEmojiDeletePressed}
          onStickerPressed={this.props.onStickerPressed}
        />
      </Animatable.View>
    );
  };

  renderQuoteInput(quoted, quotedType, removeQuotedPress) {
    const arrText = quoted.split(SPLIT_QUOTED);
    let author = '';
    let text = '';
    if (arrText.length >= 2) {
      author = arrText[0];
      text = arrText[1];
    }
    return (
      <View style={styles.quotedBackground}>
        {this.renderQuotedContent(text, quotedType, author)}
        <TouchableOpacity style={styles.quotedClose} onPress={removeQuotedPress}>
          <Image
            style={{
              height: 14,
              width: 14,
            }}
            source={require('./img/removeQuoted.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderQuotedContent(content, type, author) {
    let quote = null;
    switch (type) {
      case MESSAGE_TYPES.IMAGES:
        quote = this.renderQuoteInputImage;
        break;
      case MESSAGE_TYPES.VIDEOS:
        quote = this.renderQuoteInputVideo;
        break;
      case MESSAGE_TYPES.AUDIOS:
        quote = this.renderQuoteInputAudio;
        break;
      case MESSAGE_TYPES.LOCATION:
        quote = this.renderQuoteInputLocation;
        break;
      default:
        quote = this.renderQuoteInputText;
    }
    return quote(content.trim(), author);
  }

  renderQuoteInputText(text, author) {
    return (
      <View style={{ flex: 1 }}>
        <AppText style={styles.quotedAuthor} numberOfLines={1}>
          {author}
        </AppText>
        <AppText style={styles.quotedText} numberOfLines={1}>
          {text}
        </AppText>
      </View>
    );
  }

  renderQuoteInputImage(imageURL, author) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: '100%', justifyContent: 'center' }}>
          <RemoteImage
            style={{
              width: 50,
              height: 50,
              marginLeft: 8,
              resizeMode: 'cover',
            }}
            source={{ uri: imageURL }}
          />
        </View>
        <AppText style={styles.quotedAuthor} numberOfLines={1}>
          {author}
        </AppText>
      </View>
    );
  }

  renderQuoteInputVideo(videoURL, author) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: '100%', marginLeft: 8, justifyContent: 'center' }}>
          <ViewPlayerContainer
            video={videoURL}
            isMine={false}
            videoPlayerStyle={{
              margin: 0,
              borderRadius: 0,
            }}
            videoStyle={{
              width: 50,
              height: 50,
            }}
            previewMode
          />
        </View>
        <AppText style={styles.quotedAuthor} numberOfLines={1}>
          {author}
        </AppText>
      </View>
    );
  }

  renderQuoteInputAudio(audioURL, author) {
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <AppText style={[styles.quotedAuthor, { marginTop: 10 }]} numberOfLines={1}>
          {author}
        </AppText>
        <View style={{ position: 'absolute', top: 18, left: 8, zIndex: -2 }}>
          <AudioPlayer audio={audioURL} isMine={false} width={SCREEN_SIZE.width * 0.4} />
        </View>
      </View>
    );
  }

  renderQuoteInputLocation(location, author) {
    const latlon = location.split('-');
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: '100%', marginLeft: 8, justifyContent: 'center' }}>
          <View
            style={{
              width: 50,
              height: 50,
              overflow: 'hidden',
            }}
          >
            <MapView
              style={{
                width: 50,
                height: 50,
              }}
              region={{
                latitude: parseFloat(latlon[0]),
                longitude: parseFloat(latlon[1]),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            />
          </View>
        </View>
        <AppText style={styles.quotedAuthor} numberOfLines={1}>
          {author}
        </AppText>
      </View>
    );
  }

  render() {
    const { quoted, quotedType, didAddQuotedPadding, removeQuotedPress } = this.props;
    const { showingState } = this.state;
    return (
      <View style={{ flex: 0, backgroundColor: '#fff' }}>
        {didAddQuotedPadding && this.renderQuoteInput(quoted, quotedType, removeQuotedPress)}
        <View
          style={{
            paddingHorizontal: 6,
            flexDirection: 'row',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {this.renderEmojiButton()}
          {this.renderInput()}
          {this.renderMoreButton()}
        </View>
        {showingState === SHOWING_STATE.ADDITIONAL && this.renderAdditionalArea()}
        {this.renderEmojiPicker()}
      </View>
    );
  }
}

export default Toolbar;

const styles = StyleSheet.create({
  barButton: {
    width: 42,
    height: 54,
  },
  emojiButton: {
    width: 42,
  },
  cameraButton: {
    paddingRight: 0,
  },
  photoButton: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  locationButton: {
    paddingRight: 8,
  },
  quotedBackground: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1.0,
    borderColor: '#eee',
  },
  quotedAuthor: {
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666',
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 4,
    height: 16,
  },
  quotedText: {
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
    marginLeft: 12,
    height: 20,
  },
  quotedClose: {
    height: 32,
    width: 32,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
