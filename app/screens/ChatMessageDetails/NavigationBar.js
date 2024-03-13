/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

import KJButton from 'app/components/common/KJButton';
import BaseNavigationBar from 'app/components/NavigationBar';

/* eslint-disable */
const LOG_TAG = 'ChatMessageDetails/NavigationBar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onBackPress = () => {
    this.props.onBackPress();
  }
  // --------------------------------------------------
  render() {
    const { title } = this.props;
    return (
      <View>
        <BaseNavigationBar
          containerStyle={{
            backgroundColor: '#E6EBFF',
          }}
          title={title}
          titleStyle={{ color: '#333' }}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/back.png')}
              leftIconStyle={{ marginLeft: 0 }}
              onPress={this.onBackPress}
            />,
          ]}
          rightButtons={[]}
        />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  title: PropTypes.string,
  onBackPress: PropTypes.func,
};

NavigationBar.defaultProps = {
  title: 'Chi tiết',
  onBackPress: () => { },
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  barButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
});
