/**
 * 
 * A component return can listen to tap event
 * 
          <TouchableText
            style={}
            text="please press me"
            onPress={() => {}}
          />
 * 
 */

import React, { Component } from 'react';
import {
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';

const _ = require('lodash');

class TouchableText extends Component {
  constructor(props) {
    super(props);
    this.state = { textOpacity: 1 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress() {
    this.setState({ textOpacity: 0.5 });
    setTimeout(() => {
      this.setState({ textOpacity: 1 });
    }, 50);
    setTimeout(() => {
      this.props.onPress();
    }, 10);
  }

  onPressOut() {
    if (this.props.animated) {
      this.setState({ textOpacity: 1 });
    }
    this.props.onPress();
  }

  render() {
    return (
      <AppText
        style={[this.props.style, {
          opacity: this.state.textOpacity,
          textDecorationLine: 'underline',
        }]}
        selectionColor="rgba(0,0,0,0.5)"
        suppressHighlighting
        onPress={() => { this.onPress(); }}
      >
        {this.props.text}
      </AppText>
    );
  }
}

TouchableText.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  animated: PropTypes.bool,
};

TouchableText.defaultProps = {
  onPress: () => { },
  text: '',
  animated: true,
};

export default TouchableText;
