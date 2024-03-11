import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';

import PropTypes from 'prop-types';

import KJInTouchableOpacity from '../KJInTouchableOpacity';

const _ = require('lodash');

// --------------------------------------------------

class ImageButton extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    if (this.props.onPress) {
      requestAnimationFrame(() => {
        this.props.onPress();
      });
    }
  };
  onPressIn = () => {
    if (this.props.onPressIn) {
      requestAnimationFrame(() => {
        this.props.onPressIn();
      });
    }
  };
  render() {
    const { style, imageSource, imageStyle, imageResizeMode } = this.props;
    return (
      <KJInTouchableOpacity
        testID={this.props.testID}
        style={[styles.container, style]}
        activeOpacity={0.2}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
      >
        <Image
          style={[styles.image, imageStyle]}
          source={imageSource}
          resizeMode={imageResizeMode}
        />
      </KJInTouchableOpacity>
    );
  }
}

// --------------------------------------------------

ImageButton.propTypes = {
  imageSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  imageStyle: Image.propTypes.style,
  imageResizeMode: PropTypes.string,
  onPress: PropTypes.func,
};

ImageButton.defaultProps = {
  imageResizeMode: 'contain',
  onPress: () => {},
};

export default ImageButton;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f000',
  },
  image: {
    alignSelf: 'center',
    backgroundColor: '#ff00',
    resizeMode: 'contain',
  },
});
