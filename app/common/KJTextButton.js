import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

import { Text } from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
const _ = require('lodash');

// --------------------------------------------------

class KJTextButton extends Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  onPress = () => {
    this.props.onPress();
  };
  render() {
    const { disabled, buttonStyle, text, textStyle, testID, backgroundColor } = this.props;
    let { radientColor } = this.props;

    if (!radientColor || radientColor.length < 2) {
      radientColor = ['#13a7e2', '#0663c8'];

      if (backgroundColor && backgroundColor !== '') {
        radientColor = [backgroundColor, backgroundColor];
      }
    }

    return (
      <KJTouchableOpacity
        testID={testID}
        style={[buttonStyle, { backgroundColor: '#0000' }]}
        disabled={disabled}
        onPress={this.onPress}
      >
        <LinearGradient
          colors={radientColor}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: buttonStyle.height,
            borderRadius: buttonStyle.borderRadius,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <AppText style={textStyle}>{text}</AppText>
        </LinearGradient>
      </KJTouchableOpacity>
    );
  }
}

// --------------------------------------------------

KJTextButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};

export default KJTextButton;
