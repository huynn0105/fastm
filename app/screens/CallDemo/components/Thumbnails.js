import React, { Component } from 'react';
import { TouchableHighlight, View, ListView, Dimensions, StyleSheet } from 'react-native';
import { RTCView } from 'react-native-webrtc';

const window = Dimensions.get('window');

export default class Thumbnails extends Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: dataSource.cloneWithRows(props.streams.filter(stream => stream.id !== props.activeStreamId)),
    };
  }

  componentWillReceiveProps(nextProps) {
    const b = nextProps.streams !== this.props.streams || nextProps.activeStreamId !== this.props.activeStreamId;
    if (b) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.streams.filter(stream => stream.id !== nextProps.activeStreamId)),
      });
    }
  }

  handleThumbnailPress(streamId) {
    // this.props.setActive(streamId);
  }

  renderRow(stream, sectionId, rowId) {
    const thumbnailStyles = [styles.thumbnail];
    if (rowId === this.props.activeStreamId) {
      thumbnailStyles.push(styles.activeThumbnail);
    }
    return (
      // <TouchableHighlight
      //   style={styles.thumbnailContainer}
      //   onPress={() => this.handleThumbnailPress(stream.id)}
      // >
      <View
        style={styles.thumbnailContainer}
      >
        {
            <RTCView streamURL={stream.url} style={thumbnailStyles} />
        }
      </View>

      // </TouchableHighlight> 
    );
  }

  render() {
    if (this.props.streams.length <= 1) {
      return null;
    }
    return (
      <ListView
        style={styles.container}
        horizontal
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)} // eslint-disable-line
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: window.height,
    width: window.width,
    bottom: 0,
    left: 0,
  },
  thumbnailContainer: {
    paddingLeft: 2,
  },
  thumbnail: {
    width: (window.width),
    height: (window.height),
  },
  activeThumbnail: {
    borderColor: '#CCC',
    borderWidth: 2,
  },
});
