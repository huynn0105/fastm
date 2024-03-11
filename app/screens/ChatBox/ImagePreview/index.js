/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import KJButton from 'app/components/common/KJButton';
import AppText from '../../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ImagePreview/index.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ImagePreview
// --------------------------------------------------

class ImagePreview extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onBackPress = () => {
    this.props.onBackPress();
  }
  onNextPress = () => {
    this.props.onNextPress(this.props.imageURI);
  }
  // --------------------------------------------------
  renderImageViewer() {
    const { imageURI } = this.props;
    const images = [
      { url: imageURI },
    ];
    return (
      <ImageViewer
        imageUrls={images}
        renderIndicator={() => null}
        onSwipeDown={this.onBackPress}
      />
    );
  }
  renderBackButton() {
    return (
      <KJButton
        containerStyle={styles.backButton}
        title={'Chọn lại'}
        titleStyle={styles.backButtonTitle}
        leftIconSource={require('./img/arrow_left.png')}
        leftIconStyle={{ marginLeft: 0 }}
        onPress={this.onBackPress}
      />
    );
  }
  renderNextButton() {
    return (
      <View style={styles.nextButtonContainer}>
        <KJButton
          containerStyle={styles.nextButton}
          onPress={this.onNextPress}
        >
          <Icon name="send" size={22} color="#4F8EF7" />
        </KJButton>
        <AppText 
          style={styles.nextButtonTitle}
        >
          {'Gửi'}
        </AppText>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderImageViewer()}
        {this.renderBackButton()}
        {this.renderNextButton()}
      </View>
    );
  }
}

ImagePreview.propTypes = {
  imageURI: PropTypes.string,
  onBackPress: PropTypes.func,
  onNextPress: PropTypes.func,
};

ImagePreview.defaultProps = {
  imageURI: '',
  onBackPress: () => {},
  onNextPress: () => {},
};

export default ImagePreview;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 8 + 12,
    left: 8,
    width: null,
    height: 44,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 22,
    backgroundColor: '#0001',
  },
  backButtonTitle: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  nextButton: {
    width: 48,
    height: 48,
    paddingLeft: 4,
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  nextButtonTitle: {
    marginTop: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
