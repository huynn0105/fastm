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
  Image,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'EmptyDateView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// EmptyDataView
// --------------------------------------------------

class EmptyDataView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onRefreshPress = () => {
    this.props.onRefreshPress();
  }
  render() {
    const { 
      title, refreshButtonTitle,
      containerStyle, imageStyle, titleStyle,
      showIconEmtpy,
      canReload,
      isSmile,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
      {
        <Image
          style={[styles.image, imageStyle, { opacity: showIconEmtpy ? 1 : 0 }]}
          source={isSmile ? require('./img/empty_smile.png') : require('./img/empty_data.png')}
        />
      }
      {
        <AppText style={[styles.title, titleStyle, { opacity: showIconEmtpy ? 1 : 0 }]}>
          {title}
        </AppText>
      }
      {
        canReload &&
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={this.onRefreshPress}
        >
          <Icon name="reload" size={22} color={'#97CDFC'} />
          <AppText style={styles.refreshButtonTitle}>
            {refreshButtonTitle}
          </AppText>
        </TouchableOpacity>
      }
      </View>
    );
  }
}

EmptyDataView.defaultProps = {
  showIconEmtpy: true,
  title: 'Không có dữ liệu',
  refreshButtonTitle: 'Tải lại',
  canReload: true,
  onRefreshPress: () => {},

  isSmile: false,
};

export default EmptyDataView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#0000',
  },
  image: {
    width: 160,
    height: 128,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    marginLeft: 32,
    marginRight: 32,
  },
  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    padding: 4,
    backgroundColor: '#fff',
    borderColor: '#97CDFC',
    borderWidth: 1,
    borderRadius: 12,
  },
  refreshButtonTitle: {
    marginLeft: 4,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#7f7f7f',
  },
});
