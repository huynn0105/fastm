import React, { Component } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import PropTypes from 'prop-types';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'CustomView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// MessageView
// --------------------------------------------------

class MessageView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.currentMessage);
    }
  };

  render() {
    const giftedMessage = this.props.currentMessage;
    const read = giftedMessage.notification.read;
    const headerText =
      giftedMessage?.notification?.type === '70'
        ? `${giftedMessage?.notification?.title.substr(0, 10)}(${
            giftedMessage?.notification?.uid
          }) ${giftedMessage?.notification?.title.substr(10)}`
        : giftedMessage?.title || '';
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AppText semiBold style={read ? styles.title : styles.unreadTitle}>
            {headerText}
          </AppText>
          <KJTouchableOpacity style={styles.title} onPress={this.onPress}>
            <Image
              source={read ? require('../img/checked.png') : require('../img/uncheck.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </KJTouchableOpacity>
        </View>
        {/* <View style={styles.separator} /> */}
      </View>
    );
  }
}

// --------------------------------------------------

MessageView.defaultProps = {
  currentMessage: {},
};

MessageView.propTypes = {
  currentMessage: PropTypes.instanceOf(Object),
};

export default MessageView;

const styles = StyleSheet.create({
  title: {
    color: '#111',
    fontSize: 13,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    maxWidth: '90%',
  },
  unreadTitle: {
    color: '#0078e3',
    fontSize: 13,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    maxWidth: '90%',
  },
  separator: {
    backgroundColor: '#E7E7E7',
    height: 1,
  },
});
