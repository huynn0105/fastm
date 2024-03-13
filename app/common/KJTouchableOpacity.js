import React, { Component } from 'react';
import {
  TouchableOpacity,
} from 'react-native';

const _ = require('lodash');

// --------------------------------------------------

class KJTouchableOpacity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTouchDelay: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    if (this.state.isTouchDelay) return;

    this.setState({ isTouchDelay: true });
    setTimeout(() => {
      this.setState({ isTouchDelay: false });
    }, this.props.delay);

    requestAnimationFrame(() => {
      this.props.onPress();
    });
  }
  render() {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={this.props.style}
        activeOpacity={this.props.activeOpacity}
        onPress={this.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

// --------------------------------------------------

KJTouchableOpacity.defaultProps = {
  delay: 500,
  activeOpacity: 0.2,
  onPress: () => { },
};

export default KJTouchableOpacity;
