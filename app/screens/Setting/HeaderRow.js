import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';
import colors from '../../constants/colors';

// --------------------------------------------------

class HeaderRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          justifyContent: 'center',
          backgroundColor: colors.navigation_bg,
        }, props.style]}
      >
        <Text
          style={[{
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#8C8D99',
            paddingTop: 12,
            paddingBottom: 5,
          }, props.titleStyle]}
        >
          {props.title}
        </Text>
      </View>
    );
  }
}

// --------------------------------------------------

export default HeaderRow;
