
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import VideoCell from './VideoCell';

// --------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;

const SECTION_PADDING_SIDE = 1;
const SECTION_CONTENT_WIDTH = SCREEN_WIDTH - 3 - (SECTION_PADDING_SIDE * 2);

const IDEAL_CELL_HORZ_SPACING = 1;
const IDEAL_CELL_VERT_SPACING = 1;
const CELL_WIDTH = (SECTION_CONTENT_WIDTH - (2 * IDEAL_CELL_HORZ_SPACING)) / 3;
const CELL_HEIGHT = (SECTION_CONTENT_WIDTH - (2 * IDEAL_CELL_VERT_SPACING)) / 3;

const IDEAL_NUM_COLUMS = SECTION_CONTENT_WIDTH / (CELL_WIDTH + (IDEAL_CELL_HORZ_SPACING * 2));
const NUM_COLUMS = IDEAL_NUM_COLUMS < 3 ? IDEAL_NUM_COLUMS : 3;
const SECTION_SPACING = (SECTION_CONTENT_WIDTH - (NUM_COLUMS * CELL_WIDTH));
const CELL_HORZ_SPACING = SECTION_SPACING / (NUM_COLUMS - 1) / 2;
const CELL_VERT_SPACING = IDEAL_CELL_VERT_SPACING;

// --------------------------------------------------

const _ = require('lodash');

// --------------------------------------------------
// ImagesRow
// --------------------------------------------------

class VideosRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onVideoPress = (video, index) => {
    this.props.onVideoPress(video, index);
  }
  // --------------------------------------------------
  renderCellFunc = (item) => {
    const video = item.item;
    const index = item.index;
    return (
      <VideoCell
        containerStyle={{
          width: CELL_WIDTH + CELL_HORZ_SPACING,
          height: CELL_HEIGHT + CELL_VERT_SPACING,
        }}
        videoPlayerStyle={{
          borderRadius: 0,
        }}
        videoStyle={{
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
        }}
        index={index}
        video={video}
        onPress={this.onVideoPress}
      />
    );
  }
  render() {
    const videos = this.props.videos;
    return (
      <View style={styles.container}>
        <FlatList
          style={[
            styles.videosList,
            { paddingLeft: SECTION_PADDING_SIDE, paddingRight: SECTION_PADDING_SIDE },
          ]}
          numColumns={3}
          keyExtractor={item => item.videoID}
          renderItem={this.renderCellFunc}
          data={videos}
        />
      </View>
    );
  }
}

VideosRow.defaultProps = {
  videos: [],
  onVideoPress: () => { },
};

VideosRow.propsTypes = {
  videos: PropTypes.arrayOf(Object),
  onVideoPress: PropTypes.func,
};

export default VideosRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6EBFF',
    paddingTop: 8,
    paddingBottom: 12,
  },
  videosList: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#E6EBFF',
  },
});

// --------------------------------------------------
// const images = [
//   {
//     imageID: '1',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/200',
//   },
//   {
//     imageID: '2',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/200',
//   },
//   {
//     imageID: '3',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/300',
//   },
//   {
//     imageID: '4',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/150',
//   },
//   {
//     imageID: '5',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/200',
//   },
//   {
//     imageID: '6',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/300',
//   },
//   {
//     imageID: '7',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/250',
//   },
//   {
//     imageID: '8',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/200',
//   },
//   {
//     imageID: '9',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/200',
//   },
//   {
//     imageID: '10',
//     senderDeviceID: '1',
//     serverImageURL: 'https://via.placeholder.com/400',
//     serverThumbImageURL: 'https://via.placeholder.com/200',
//   },
// ];
