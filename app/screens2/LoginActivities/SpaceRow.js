import React, { PureComponent } from 'react';
import { View } from 'react-native';
import colors from '../../constants/colors';
import Colors from '../../theme/Color';

// --------------------------------------------------

class SpaceRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[
          {
            height: 8,
            backgroundColor: Colors.neutral5,
          },
          props.style,
        ]}
      />
    );
  }
}

SpaceRow.defaultProps = {
  isSeperatorHidden: false,
};

export default SpaceRow;
