import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';
import KJImage from 'app/components/common/KJImage';

const SCREEN_SIZE = Dimensions.get('window');

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'CustomView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// HeaderViewNews
// --------------------------------------------------

class HeaderViewNews extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const giftedMessage = this.props.currentMessage;
    const read = giftedMessage.notification.read;
    return (
      <View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
        >
          <View style={styles.imageContainer}>
            <KJImage
              style={styles.image}
              source={{ uri: giftedMessage.notification.image }}
            />
          </View>
          <AppText style={read ? styles.title : styles.unreadTitle}>
            {giftedMessage.title}
          </AppText>
        </View>
        {/* <View style={styles.separator} /> */}
      </View>
    );
  }
}

// --------------------------------------------------

HeaderViewNews.defaultProps = {
  currentMessage: {},
};

HeaderViewNews.propTypes = {
  currentMessage: PropTypes.instanceOf(Object),
};

export default HeaderViewNews;

const styles = StyleSheet.create({
  title: {
    color: '#111',
    fontSize: 15,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'left',
  },
  unreadTitle: {
    color: '#0078e3',
    fontSize: 15,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'left',
  },
  separator: {
    backgroundColor: '#E7E7E7',
    height: 1,
  },
  imageContainer: {
    width: '100%',
    height: ((SCREEN_SIZE.width - 42) * 0.9) * (16.0 / 30),
    borderTopRightRadius: 10,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderTopRightRadius: 10,
  },
});
