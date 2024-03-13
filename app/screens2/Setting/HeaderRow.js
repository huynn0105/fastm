import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

class HeaderRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          justifyContent: 'center',
        }, props.style]}
      >
        <AppText
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
        </AppText>
      </View>
    );
  }
}

// --------------------------------------------------

export default HeaderRow;
