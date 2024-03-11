/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';

import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import KJButton from 'app/components/common/KJButton';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ImagesViewer/index.js';
/* eslint-enable */

// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

// --------------------------------------------------
// ImagesViewer
// --------------------------------------------------

class ImagesViewer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onBackPress = () => {
    this.props.onBackPress();
  }
  // --------------------------------------------------
  renderLoadingFunc = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: SCREEN_SIZE.height,
          backgroundColor: '#0000',
        }}
      >
        <ActivityIndicator
          style={{
            alignSelf: 'center',
          }}
          size="small"
          color="#fff"
        />
      </View>
    );
  }
  renderImageViewer() {
    const { beginIndex, imageURLs } = this.props;
    const urls = imageURLs.map(item => {
      return { url: item };
    });
    return (
      <ImageViewer
        imageUrls={urls}
        index={beginIndex}
        loadingRender={this.renderLoadingFunc}
        renderIndicator={() => null}
        onSwipeDown={this.onBackPress}
      />
    );
  }
  renderBackButton() {
    return (
      <KJButton
        containerStyle={styles.backButton}
        onPress={this.onBackPress}
      >
        <Icon name="close" size={28} color="#FFF" />
      </KJButton>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderImageViewer()}
        {this.renderBackButton()}
      </View>
    );
  }
}

ImagesViewer.defaultProps = {
  beginIndex: 0,
  imageURLs: [],
  onBackPress: () => { },
};

ImagesViewer.propTypes = {
  beginIndex: PropTypes.number,
  imageURLs: PropTypes.arrayOf(String),
  onBackPress: PropTypes.func,
};

export default ImagesViewer;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20 + 12,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0002',
  },
  backButtonTitle: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
