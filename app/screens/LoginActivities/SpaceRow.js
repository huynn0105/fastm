import React, { PureComponent } from 'react';
import {
  View,
} from 'react-native';
import colors from '../../constants/colors';

// --------------------------------------------------

class SpaceRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          height: 8,
          backgroundColor: colors.navigation_bg,
        }, props.style]}
      />
    );
  }
}

SpaceRow.defaultProps = {
  isSeperatorHidden: false,
};

export default SpaceRow;
