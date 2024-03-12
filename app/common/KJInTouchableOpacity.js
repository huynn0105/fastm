import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
} from 'react-native';

// --------------------------------------------------

class KJInTouchableOpacity extends PureComponent {

  onPress = () => {
    if (this.props.onPress) {
      requestAnimationFrame(() => {
        this.props.onPress();
      });
    }
  }

  onPressIn = () => {
    if (this.props.onPressIn) {
      requestAnimationFrame(() => {
        this.props.onPressIn();
      });
    }
  }

  render() {
    const {
      containerStyle,
      style,
    } = this.props;
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[containerStyle, style]}
        activeOpacity={this.props.activeOpacity}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

// --------------------------------------------------

KJInTouchableOpacity.defaultProps = {
  activeOpacity: 0.2,
  onPressIn: () => { },
  onPress: () => { },
};

export default KJInTouchableOpacity;
