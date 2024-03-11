/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Styles from 'app/constants/styles';
import KJImage from 'app/components/common/KJImage';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'GetContactsView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// GetContactsView
// --------------------------------------------------

class GetContactsView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onPress = () => {
    this.props.onPress();
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPress}
          activeOpacity={0.2}
        >
          <View style={styles.rowContainer}>
            <KJImage
              style={styles.iconImage}
              source={require('./img/sync.png')}
              defaultSource={require('./img/sync.png')}
              resizeMode="cover"
            />
            <AppText style={styles.titleText}>
              {'Đồng bộ danh bạ của bạn'}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default GetContactsView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: colors.navigation_bg,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.navigation_bg,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  titleText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
    fontWeight: '300',
  },
});
