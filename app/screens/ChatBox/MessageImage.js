/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import RemoteImage from 'app/components/common/RemoteImage';


// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'MessageImage.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

const IMAGE_WIDTH = SCREEN_SIZE.width * 0.5;
const IMAGE_HEIGHT = IMAGE_WIDTH;

const IMAGE_WIDTH_MAX = SCREEN_SIZE.width * 0.6;

const _ = require('lodash');

// --------------------------------------------------
// MessageImage
// --------------------------------------------------

class MessageImage extends Component {
  constructor(props) {
    super(props);

    let { width, height } = this.props.currentMessage.message;
    const tempWidth = width;
    const tempHeight = height;

    if (!width) {
      this.state = {
        widthImage: new Animated.Value(IMAGE_WIDTH),
        heightImage: new Animated.Value(IMAGE_HEIGHT),
        showBorder: false,
      };
      const source = this.props.currentMessage.thumbImage;
      this.ajustSize(source);
    }
    else {
      if (width < IMAGE_WIDTH) {
        width = IMAGE_WIDTH;
        height = (IMAGE_WIDTH / tempWidth) * tempHeight;
      }
      if (width > IMAGE_WIDTH_MAX) {
        width = IMAGE_WIDTH_MAX;
        height = (IMAGE_WIDTH_MAX / tempWidth) * tempHeight;
      }

      this.state = {
        widthImage: (width),
        heightImage: (height),
        showBorder: true,
      };
    }
    this.didResizeImage = false;
  }

  componentWillReceiveProps(nextProps) {
    const source = nextProps.currentMessage.thumbImage;
    this.ajustSize(source);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  ajustSize(source) { // eslint-disable-line
    if (!this.props.currentMessage.message.width) {
      if (source.indexOf('placeholder') < 0) {
        Image.getSize(source, (width, height) => {
          setTimeout(() => {
            if (this.state.heightImage !== height || this.state.widthImage !== width) {
              this.onHeightChange(width, height);
            }
          }, 0);
        });
      }
    }
  }

  onPress = () => {
    this.props.onImagePress(this.props.currentMessage);
  }
  onLongPress = () => {
    this.props.onImageLongPress(this.props.currentMessage);
  }
  onHeightChange = (tempWidth, tempHeight) => {
    if (tempHeight !== 0) {
      this.didResizeImage = true;

      let height = tempHeight;
      let width = tempWidth;
      if (width < IMAGE_WIDTH) {
        width = IMAGE_WIDTH;
        height = (IMAGE_WIDTH / tempWidth) * tempHeight;
      }
      if (width > IMAGE_WIDTH_MAX) {
        width = IMAGE_WIDTH_MAX;
        height = (IMAGE_WIDTH_MAX / tempWidth) * tempHeight;
      }
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(this.state.widthImage, {
            toValue: width,
            duration: 200,
          }),
          Animated.timing(this.state.heightImage, {
            toValue: height,
            duration: 200,
          }),
        ]).start(() => {
          setTimeout(() => {
            this.setState({
              showBorder: true,
            });
            this.didResizeImage = false;
          }, 200);
        });
      }, 0);
    }
  }

  render() {
    const { currentMessage, imageProps } = this.props;
    // --
    return (
      <View style={[styles.container, this.state.showBorder ? styles.border : {}]}>
        <TouchableOpacity
          onPress={this.onPress}
          onLongPress={this.onLongPress}
        >
          <Animated.View
            style={[styles.image, {
              width: this.state.widthImage,
              height: this.state.heightImage,
            }]}
          >
            <RemoteImage
              {...imageProps}
              style={[styles.image, {
                position: 'absolute',
                resizeMode: 'contain',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }]}
              source={{ uri: currentMessage.image }}
            />
          </Animated.View>

        </TouchableOpacity>
      </View>
    );
  }
}

MessageImage.defaultProps = {
  onImagePress: () => { },
};

export default MessageImage;

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
    borderColor: '#e0e0e0',
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
});
