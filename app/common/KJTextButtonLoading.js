import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AnimateLoadingButton from 'react-native-animate-loading-button';

import colors from 'app/constants/colors';

import {
  Text,
  TouchableHighlight,
} from 'react-native';

import PropTypes from 'prop-types';

const _ = require('lodash');

// --------------------------------------------------

class KJTextButton extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress();
  }
  render() {
    const {
      disabled,
      buttonStyle,
      text, textStyle,
      testID,
      backgroundColor,
    } = this.props;
    let { radientColor } = this.props;

    if (!radientColor || radientColor.length < 2) {
      radientColor = ['#13a7e2', '#0663c8'];

      if (backgroundColor && backgroundColor !== '') {
        radientColor = [backgroundColor, backgroundColor];
      }
    }

    return (
      <TouchableHighlight
        testID={testID}
        style={[buttonStyle, { backgroundColor: '#0000' }]}
        disabled={disabled}
        onPress={this.onPress}
        underlayColor={'#fff'}
      >
        <LinearGradient
          colors={radientColor}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: buttonStyle.height,
            borderRadius: buttonStyle.borderRadius,
            paddingLeft: 16 + 18,
            paddingRight: 16 + 18,
          }}
        >
          <AnimateLoadingButton
            ref={this.props.refButton}
            title={this.props.title}
            titleFontSize={this.props.fontSize}
            titleColor={this.props.color}
            backgroundColor="#0000"
            onPress={this.onPress}
          />
        </LinearGradient>
      </TouchableHighlight>
    );
  }
}

// --------------------------------------------------

KJTextButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};

export default KJTextButton;
