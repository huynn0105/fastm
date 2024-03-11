import React, { Component } from 'react';
import {
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

const _ = require('lodash');

export default class KJImageButton extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    return (
      <KJTouchableOpacity
        style={this.props.buttonStyle}
        onPress={this.props.onPress}
      >
        <Image
          style={this.props.imageStyle}
          source={this.props.image}
          resizeMode={this.props.resizeMode}
        />
      </KJTouchableOpacity>
    );
  }
}

KJImageButton.propTypes = {
  image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  onPress: PropTypes.func,
};
