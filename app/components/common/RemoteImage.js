import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';

const _ = require('lodash');

// import * as Progress from 'react-native-progress';
// import { createImageProgress } from 'react-native-image-progress';
// const Image = createImageProgress(FastImage);

class RemoteImage extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const props = this.props;
    const flatStyle = StyleSheet.flatten(props.style);
    const imageBorderWidth = flatStyle.borderWidth || 0;
    const imageWidth = flatStyle.width - (imageBorderWidth * 2);
    const imageHeight = flatStyle.height - (imageBorderWidth * 2);
    const imageSource = props.source;
    return (
      <View
        style={[flatStyle, {
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <FastImage
          {...props}
          imageStyle={[props.style, {
            width: imageWidth,
            height: imageHeight,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            backgroundColor: '#0000',
            alignSelf: 'center',
            borderColor: '#0000',
            borderWidth: 0,
            resizeMode: 'contain',
          }]}
          resizeMode={FastImage.resizeMode.contain}
          source={imageSource}
        />
      </View>
    );
  }
}

RemoteImage.defaultProps = {
  style: {},
};

export default RemoteImage;
