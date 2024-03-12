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
} from 'react-native';
// --------------------------------------------------
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
/* eslint-disable */
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
      containerStyle, imageStyle,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
      {
        <Image
          style={styles.image, imageStyle}
          source={require('./img/emptyChat.png')}
        />
      }
      {
        <AppText style={styles.title}>
          Kết nối thêm bạn bè, đồng nghiệp để cùng trò chuyện và trao đổi công việc trên MFast nhé !!!
        </AppText>
      }
      </View>
    );
  }
}

EmptyDataView.defaultProps = {
  showIconEmtpy: true,
  title: '',
  onRefreshPress: () => {},

  isSmile: false,
};

export default EmptyDataView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#0000',
    paddingTop: 40
  },
  image: {
    width: 180,
    height: 137,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    opacity: 0.8,
    color: Colors.primary4,
    lineHeight: 20
  }
});
