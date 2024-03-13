import React, { PureComponent } from 'react';
import {
  View,
} from 'react-native';
import colors from 'app/constants/colors';

// --------------------------------------------------

class SpaceRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          height: 16,
          backgroundColor: colors.separator,
        }, props.style]}
      />
    );
  }
}

SpaceRow.defaultProps = {
  isSeperatorHidden: false,
};

export default SpaceRow;
