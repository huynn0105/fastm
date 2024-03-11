
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import VideoPlayerContainer from '../../screens/Chat/VideoPlayerContainer';

const DEFAULT_CELL_SIZE = 64;

const _ = require('lodash');

// --------------------------------------------------
// ImageCell
// --------------------------------------------------

class VideoCell extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.video, this.props.index);
  }
  // --------------------------------------------------
  render() {
    const { video, containerStyle, videoStyle, videoPlayerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <KJTouchableOpacity
          onPress={this.onPress}
        >
          <VideoPlayerContainer
            style={[styles.video]}
            videoPlayerStyle={videoPlayerStyle}
            videoStyle={videoStyle}
            video={video.serverImageURL}
            onLongPress={this.onLongPress}
          // fullscreenMode={false}
          // onFullScreenPress={this.onFullScreenPress}
          />
        </KJTouchableOpacity>
      </View>
    );
  }
}

VideoCell.defaultProps = {
  index: -1,
  video: {},
  containerStyle: {},
  videoStyle: {},
  onPress: () => { },
};

VideoCell.propTypes = {
  index: PropTypes.number,
  video: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  videoStyle: PropTypes.instanceOf(Object),
  onPress: PropTypes.func,
};

export default VideoCell;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: DEFAULT_CELL_SIZE,
    height: DEFAULT_CELL_SIZE,
    backgroundColor: '#fff',
  },
  video: {
    flex: 0,
    alignSelf: 'center',
    width: DEFAULT_CELL_SIZE,
    height: DEFAULT_CELL_SIZE,
    backgroundColor: '#fff',
  },
});
