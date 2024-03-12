import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

const _ = require('lodash');

// --------------------------------------------------

class InfoRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  render() {
    const {
      title, details,
      containerStyle, titleStyle, detailsStyle,
      isSeperatorHidden,
    } = this.props;
    return (
      <View
        style={[{
          paddingTop: 12,
        }, containerStyle]}
      >
        <Text
          style={[styles.title, titleStyle]}
        >
          {title}
        </Text>

        <Text
          style={[styles.details, detailsStyle]}
        >
          {details}
        </Text>

        {
          isSeperatorHidden ? null :
          <View style={styles.separator} />
        }

      </View>
    );
  }
}

// --------------------------------------------------

InfoRow.propTypes = {
  title: PropTypes.string,
  details: PropTypes.string,
  titleStyle: Text.propTypes.style,
  detailsStyle: Text.propTypes.style,
  isSeperatorHidden: PropTypes.bool,
};

InfoRow.defaultProps = {
  title: ' ',
  details: ' ',
  isSeperatorHidden: false,
};

export default InfoRow;

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: '#9d9d9d',
  },
  details: {
    marginTop: 4,
    fontSize: 14,
    color: '#202020',
  },
  separator: {
    height: 1,
    marginTop: 2,
    backgroundColor: '#E9E9E9',
  },
});
