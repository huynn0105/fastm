import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { RTCView } from 'react-native-webrtc';

const window = Dimensions.get('window');

export default class FullScreenVideo extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {
          <RTCView streamURL={this.props.streamURL} style={styles.video} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: (window.width / 3) * 1.3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  video: {
    marginBottom: 24,
    width: window.width / 3,
    height: (window.width / 3) * 1.3,
  },
});
