import React, { PureComponent } from 'react';
import {
  View,
} from 'react-native';

// --------------------------------------------------

class SpaceRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          height: 8,
        }, props.style]}
      />
    );
  }
}

SpaceRow.defaultProps = {
  isSeperatorHidden: false,
};

export default SpaceRow;
