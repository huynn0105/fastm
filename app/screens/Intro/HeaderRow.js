import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

// --------------------------------------------------

class HeaderRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          justifyContent: 'center',
          height: 40,
          backgroundColor: '#f2f2f2',
        }, props.style]}
      >
        <Text
          style={[{
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: 16,
            color: '#8C8D99'
          }, props.titleStyle]}
        >
          {props.title}
        </Text>
      </View>
    );
  }
}

// --------------------------------------------------

HeaderRow.propTypes = {
  title: PropTypes.string.isRequired,
  titleStyle: PropTypes.object,
};

HeaderRow.defaultProps = {
  isSeperatorHidden: false,
};

export default HeaderRow;
