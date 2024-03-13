/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import KJButton from 'app/components/common/KJButton';
import BaseNavigationBar from 'app/components/NavigationBar';
import colors from 'app/constants/colors';

/* eslint-disable */
import Utils from 'app/utils/Utils';
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
  onPinMessagePress = () => {
    this.props.onPinMessagePress();
  }
  // --------------------------------------------------
  render() {
    return (
      <View>
        <BaseNavigationBar
          containerStyle={{
            backgroundColor: colors.navigation_bg,
          }}
          title={'Ghim thông báo'}
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
          rightButtons={[
            <TouchableOpacity
              style={{
                padding: 4,
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this.onPinMessagePress}
            >
              <Text
                style={{
                  color: '#39B5FC',
                  fontWeight: '700',
                }}
              >
                {'Ghim'}
              </Text>
            </TouchableOpacity>,
          ]}
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
