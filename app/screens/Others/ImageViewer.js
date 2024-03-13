import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import ImageZoom from 'react-native-image-pan-zoom';

import ImageButton from 'common/buttons/ImageButton';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ImageViewerScreen.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

// --------------------------------------------------
// ImageViewer
// --------------------------------------------------

class ImageViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImageHidden: true,
      imageWidth: null,
      imageHeight: null,
    };
  }
  componentDidMount() {
    this.loadImage();
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.onClosePress();
  }
  // --------------------------------------------------
  loadImage() {
    if (this.props.imageUri.length > 0) {
      Image.getSize(this.props.imageUri, (w, h) => {
        const width = SCREEN_SIZE.width;
        const height = (h / w) * width;
        this.revealImage(width, height);
      }, () => {
        this.revealImage(SCREEN_SIZE.width, SCREEN_SIZE.height);
      });
    }
  }
  revealImage(width, height) {
    this.setState({
      isImageHidden: false,
      imageWidth: width,
      imageHeight: height,
    });
  }
  // --------------------------------------------------
  renderImage() {
    if (this.state.isImageHidden) {
      return null;
    }
    return (
      <ImageZoom
        cropWidth={SCREEN_SIZE.width}
        cropHeight={SCREEN_SIZE.height}
        imageWidth={this.state.imageWidth}
        imageHeight={this.state.imageHeight}
      >
        <Image
          style={{
            width: this.state.imageWidth,
            height: this.state.imageHeight,
          }}
          source={{ uri: this.props.imageUri }}
        />
      </ImageZoom>
    );
  }
  renderCloseButton() {
    return (
      <ImageButton
        style={styles.closeButton}
        imageStyle={styles.closeButtonIcon}
        imageSource={require('./img/close.png')}
        onPressIn={this.onClosePress}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderImage()}  
        {this.renderCloseButton()}
      </View>
    );
  }
}

ImageViewer.propsTypes = {
  imageUri: PropTypes.string,
  onClosePress: PropTypes.func,
};

ImageViewer.defaultProps = {
  imageUri: '',
  onClosePress: () => { },
};

export default ImageViewer;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 0,
    width: 44,
    height: 44,
    backgroundColor: '#0000',
  },
  closeButtonIcon: {
    width: 32,
    height: 32,
  },
});
