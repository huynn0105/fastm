import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';

import colors from '../../theme/Color';
import PropTypes from 'prop-types';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

class HeaderRow extends PureComponent {
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          justifyContent: 'center',
          backgroundColor: '#fff',
        }, props.style]}
      >
        <AppText
          style={[{
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 16,
            lineHeight: 20,
            fontWeight: 'bold',
            color: colors.primary4,
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

HeaderRow.propTypes = {
  title: PropTypes.string.isRequired,
  titleStyle: PropTypes.object,
};

HeaderRow.defaultProps = {
  isSeperatorHidden: false,
};

export default HeaderRow;
