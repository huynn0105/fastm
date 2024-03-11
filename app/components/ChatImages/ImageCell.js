/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

const DEFAULT_CELL_SIZE = 64;

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ChatSettings/ImageCell.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ImageCell
// --------------------------------------------------

class ImageCell extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.image, this.props.index);
  }
  // --------------------------------------------------
  render() {
    const { image, containerStyle, imageStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <KJTouchableOpacity
          onPress={this.onPress}
        >
          <KJImage
            style={[styles.image, imageStyle]}
            source={{ uri: image.serverImageURL }}
            resizeMode={'cover'}
          />
        </KJTouchableOpacity>
      </View>
    );
  }
}

ImageCell.defaultProps = {
  index: -1,
  image: {},
  containerStyle: {},
  imageStyle: {},
  onPress: () => {},
};

ImageCell.propTypes = {
  index: PropTypes.number,
  image: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  imageStyle: PropTypes.instanceOf(Object),
  onPress: PropTypes.func,
};

export default ImageCell;

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
  image: {
    flex: 0,
    alignSelf: 'center',
    width: DEFAULT_CELL_SIZE,
    height: DEFAULT_CELL_SIZE,
    backgroundColor: '#fff',
  },
});
