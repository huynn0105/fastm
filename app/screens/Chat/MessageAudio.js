import React, { Component } from 'react';

import {
  View,
  Dimensions,
} from 'react-native';

import AudioPlayer from './AudioPlayer';
// import { showInfoAlert } from '../../utils/UIUtils';

const SCREEN_SIZE = Dimensions.get('window');

class MessageAudio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      audio: '',
    };
  }

  componentDidMount() {
    const currentMessage = this.props.currentMessage;
    if (currentMessage.audio && currentMessage.audio !== 'audio') {
      this.setState({
        audio: currentMessage.audio,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextMessage = nextProps.currentMessage;
    const currentMessage = this.props.currentMessage;
    if (currentMessage.audio !== nextMessage.audio && nextMessage.audio !== 'audio') {
      this.setState({
        audio: nextMessage.audio,
      });
    }
  }


  onLongPress = () => {
    if (this.props.onImageLongPress) {
      this.props.onImageLongPress(
        this.props.currentMessage,
        this.messageViewRef,
        this,
      );
    }
  }

  setIsSelected = (selected) => {
    this.setState({
      isSelected: selected,
    });
  }

  render() {
    const { isMine } = this.props;
    const { isSelected } = this.state;

    return (
      <View
        ref={ref => { this.messageViewRef = ref; }}
        style={{
          borderWidth: 1,
          borderColor: isSelected ? '#ff9900' : '#0000',
        }}
      >
        <AudioPlayer
          onLongPress={this.onLongPress}
          audio={this.state.audio}
          isMine={isMine}
          width={SCREEN_SIZE.width * 0.4}
        />
      </View>
    );
  }
}

export default MessageAudio;
