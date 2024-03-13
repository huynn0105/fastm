import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../constants/colors';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';
const _ = require('lodash');

class LoginActivitySectionHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    return (
      <View style={styles.container}>
        <AppText style={styles.title}>{this.props.title}</AppText>
      </View>
    );
  }
}

LoginActivitySectionHeader.propTypes = {
  title: PropTypes.string,
};

LoginActivitySectionHeader.defaultProps = {
  title: '',
};

export default LoginActivitySectionHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingTop: 12,
    paddingBottom: 2,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: '#0076ff',
    fontSize: 16,
  },
});
