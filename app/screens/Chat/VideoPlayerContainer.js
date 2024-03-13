import React, { Component } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import VideoPlayer from './VideoPlayer';

// --------------------------------------------------
// MessageImage
// --------------------------------------------------

class VideoPlayerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  onPress = () => {};
  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress();
    }
  };
  onFullScreenPress = () => {
    if (this.state.modalVisible === false) {
      this.setState({
        modalVisible: true,
      });
    }
  };
  onClosePress = () => {
    this.setState({
      modalVisible: false,
    });
  };

  renderModalVideoPlayer = () => {
    return (
      this.props.video !== 'video' && (
        <Modal
          // style={this.state.modalVisible ? {} : {
          //   width: this.state.screenWidth,
          //   height: this.state.screenWidth,
          // }}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
          }}
        >
          <VideoPlayer
            style={
              this.state.modalVisible
                ? {
                    width: '100%',
                    height: '100%',
                  }
                : {}
            }
            uploadingProgress={this.props.uploadingProgress}
            video={this.props.video}
            isMine={this.props.isMine}
            onLongPress={this.onLongPress}
            canClose={this.state.modalVisible}
            fullscreenMode
            onClosePress={this.onClosePress}
            onFullScreenPress={this.onFullScreenPress}
          />
        </Modal>
      )
    );
  };

  render() {
    return (
      <View style={[styles.container, this.props.videoPlayerStyle]}>
        {this.renderModalVideoPlayer()}
        <TouchableOpacity onPress={this.onPress} onLongPress={this.onLongPress}>
          <VideoPlayer
            style={this.props.videoStyle}
            uploadingProgress={this.props.uploadingProgress}
            video={this.props.video}
            isMine={this.props.isMine}
            onLongPress={this.onLongPress}
            setPlayerRef={(ref) => {
              this.player = ref;
            }}
            fullscreenMode={false}
            onFullScreenPress={this.onFullScreenPress}
            previewMode={this.props.previewMode}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

VideoPlayerContainer.defaultProps = {
  onImagePress: () => {},
};

export default VideoPlayerContainer;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    margin: 2,
    // borderColor: '#0000',
    // borderWidth: 1.0,
    borderRadius: Platform.OS === 'android' ? 20 : 24,
    overflow: 'hidden',
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
