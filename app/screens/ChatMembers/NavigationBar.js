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
import colors from 'app/constants/colors';

/* eslint-disable */
const LOG_TAG = 'ChatSettings/NavigationBar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onClosePress = () => {
    this.props.onClosePress();
  }
  // --------------------------------------------------
  render() {
    return (
      <View>
        <BaseNavigationBar
          containerStyle={{
            backgroundColor: colors.navigation_bg,
          }}
          title={'Thành viên'}
          // titleStyle={{ color: '#000' }}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/close.png')}
              leftIconStyle={{ marginLeft: 0 }}
              onPress={this.onClosePress}
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
  onClosePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onClosePress: () => { },
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
