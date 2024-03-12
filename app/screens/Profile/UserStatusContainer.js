import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import { User } from '../../models';

const _ = require('lodash');

// --------------------------------------------------

class UserStatusContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  render() {
    const {
      user, style, statusTextStyle, timeTextStyle,
    } = this.props;
    return (
      <View
        style={[styles.container, style]}
      >
        <View
          style={[styles.statusContainer]}
        >
          <View
            style={[styles.statusIcon, { backgroundColor: user.statusColor() }]}
          />
          <Text
            style={[styles.statusText, statusTextStyle]}
          >
            {`${user.statusString()}`}
          </Text>
        </View>

        <View
          style={styles.timeContainer}
        >
          <Image
            style={styles.timeIcon}
            source={require('./img/clock.png')}
          />
          <Text
            style={[styles.timeText, timeTextStyle]}
          >
            {`Tham gia: ${user.createTimeAgoString()}`}
          </Text>
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIcon: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#808080',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#808080',
    backgroundColor: '#0000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  timeIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#808080',
    backgroundColor: '#0000',
  },
});

// --------------------------------------------------

UserStatusContainer.propTypes = {
  user: PropTypes.instanceOf(User),
};

UserStatusContainer.defaultProps = {

};

export default UserStatusContainer;
