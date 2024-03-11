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

import KJButton from 'app/components/common/KJButton';
import * as Animatable from 'react-native-animatable';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'Accessory.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// Accessory
// --------------------------------------------------

class Accessory extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onClosePress = () => {
    this.props.onClosePress();
  }

  onEmojiPress = () => {
    this.props.onEmojiPress();
  }
  onCameraPress = () => {
    this.props.onCameraPress();
  }
  onPhotoPress = () => {
    this.props.onPhotoPress();
  }
  onLocationPress = () => {
    this.props.onLocationPress();
  }
  // --------------------------------------------------
  render() {
    return (
      <Animatable.View
        style={styles.container}
        animation="fadeIn"
        useNativeDriver
      >
        <View
          style={styles.itemContainer}
        >
          <KJButton
            containerStyle={[styles.barButton, styles.emojiButton]}
            leftIconSource={require('./img/emoji.png')}
            onPress={this.onEmojiPress}
            leftIconStyle={{
              width: 26,
              height: 26,
              marginBottom: 16,
            }}
          />
          <KJButton
            containerStyle={[styles.barButton, styles.cameraButton]}
            leftIconSource={require('./img/camera.png')}
            onPress={this.onCameraPress}
            leftIconStyle={{
              width: 28,
              height: 28,
              marginBottom: 16,
            }}
          />
          <KJButton
            containerStyle={[styles.barButton, styles.photoButton]}
            leftIconSource={require('./img/photo.png')}
            onPress={this.onPhotoPress}
            leftIconStyle={{
              width: 28,
              height: 28,
              marginBottom: 16,
            }}
          />
          <KJButton
            containerStyle={[styles.barButton, styles.locationButton]}
            leftIconSource={require('./img/location.png')}
            onPress={this.onLocationPress}
            leftIconStyle={{
              width: 28,
              height: 28,
              marginBottom: 16,
            }}
          />
        </View>
        {
          this.props.canClose &&
          <View>
            <KJButton
              containerStyle={[styles.barButton, styles.closeButton]}
              leftIconSource={require('./img/removeQuoted.png')}
              onPress={this.onClosePress}
              leftIconStyle={{
                width: 20,
                height: 20,
                marginBottom: 16,
                opacity: 0.5,
              }}
            />
          </View>
        }
      </Animatable.View >
    );
  }
}

Accessory.defaultProps = {
  onEmojiPress: () => { },
  onCameraPress: () => { },
  onPhotoPress: () => { },
  onLocationPress: () => { },
};

export default Accessory;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#0000',
  },
  itemContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#0000',
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#0000',
  },
  barButton: {
    width: 56,
    height: 56,
    marginLeft: 4,
    marginRight: 8,
  },
  emojiButton: {
  },
  cameraButton: {
    width: 56,
  },
  photoButton: {
    width: 56,
  },
  locationButton: {
    width: 56,
  },
  closeButton: {
    width: 48,
  },
});
