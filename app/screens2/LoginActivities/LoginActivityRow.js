import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import PropTypes from 'prop-types';

import { LoginActivity } from '../../models';
import colors from '../../constants/colors';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';

const _ = require('lodash');

class LoginActivityRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderSeperator = () => {
    return (
      <View
        style={{
          height: 1.0,
          backgroundColor: '#E2E2E2',
        }}
      />
    );
  };

  renderTitle = () => {
    return (
      <View style={[styles.column, { flex: 0 }]}>
        <AppText style={styles.title}>{'Lúc: '}</AppText>
        <AppText style={styles.title}>{'Dòng máy: '}</AppText>
        <AppText style={styles.title}>{'Địa điểm: '}</AppText>
      </View>
    );
  };

  renderValue = (time, phoneModel, location) => {
    return (
      <View style={[styles.column, { flex: 3 }]}>
        <AppText style={styles.value}>{time}</AppText>
        <AppText style={styles.value}>{phoneModel}</AppText>
        <AppText style={styles.value}>{location === null ? '--' : location}</AppText>
      </View>
    );
  };

  renderTitleOS = () => {
    return (
      <View style={[styles.column, { flex: 0 }]}>
        <AppText style={styles.title}> </AppText>
        <AppText style={styles.title}>{'OS: '}</AppText>
        <AppText style={styles.title}> </AppText>
      </View>
    );
  };

  renderValueOS = (os) => {
    return (
      <View style={[styles.column, { flex: 1.5 }]}>
        <AppText style={styles.value}> </AppText>
        <AppText style={styles.value}>{os}</AppText>
        <AppText style={styles.value}> </AppText>
      </View>
    );
  };

  render() {
    const { loginActivity } = this.props;
    return (
      <View style={styles.row}>
        <View style={styles.container}>
          {this.renderTitle()}
          {this.renderValue(
            loginActivity.formattedDateTime,
            loginActivity.deviceModel,
            loginActivity.lat,
          )}
          {this.renderTitleOS()}
          {this.renderValueOS(`${loginActivity.os} - ${loginActivity.osVersion}`)}
        </View>
      </View>
    );
  }
}

LoginActivityRow.propTypes = {
  loginActivity: PropTypes.instanceOf(LoginActivity),
};

LoginActivityRow.defaultProps = {};

export default LoginActivityRow;

const styles = StyleSheet.create({
  row: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Colors.neutral5,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    paddingTop: 12,
    paddingBottom: 12,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 13,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 4,
  },
  value: {
    fontSize: 13,
    paddingTop: 3,
    paddingBottom: 3,
  },
});
