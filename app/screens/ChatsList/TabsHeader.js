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
} from 'react-native';

import colors from 'app/constants/colors';
import Styles from 'app/constants/styles';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'TabsHeader.js';
/* eslint-enable */

const TAB_ALL_THREADS_INDEX = 0;
const TAB_GROUP_THREADS_INDEX = 1;

const _ = require('lodash');

// --------------------------------------------------
// TabsHeader
// --------------------------------------------------

class TabsHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: TAB_ALL_THREADS_INDEX,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onTabPress = (index) => {
    this.setState({
      selectedIndex: index,
    }, () => {
      this.props.onTabSelected(index);
    });
  }
  // --------------------------------------------------
  render() {
    const { selectedIndex } = this.state;
    const { totalThreadsUnRead, totalGroupThreadsUnRead } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <TabSection
            title={'Tin nhắn'}
            badge={totalThreadsUnRead}
            isSelected={selectedIndex === TAB_ALL_THREADS_INDEX}
            onPress={() => this.onTabPress(TAB_ALL_THREADS_INDEX)}
          />
          <TabSection
            title={'Nhóm'}
            badge={totalGroupThreadsUnRead}
            isSelected={selectedIndex === TAB_GROUP_THREADS_INDEX}
            onPress={() => this.onTabPress(TAB_GROUP_THREADS_INDEX)}
          />
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

const TabSection = (props) => {
  const tabTitleStyle = props.isSelected ? 
    styles.tabTitleHighlighted : styles.tabTitle;
  const isBadgeHidden = props.badge === 0;
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabTitleContainer}>
        <AppText style={tabTitleStyle}>
          {props.title}
        </AppText>
        {
          isBadgeHidden ? null :
          <View style={styles.badgeContainer}>
            <AppText style={styles.badgeBracket}>
              {' ( '}
            </AppText>
            <AppText style={styles.badgeNumber}>
              {props.badge}
            </AppText>
            <AppText style={styles.badgeBracket}>
              {' ) '}
            </AppText>
          </View>
        }
      </View>
      {
        props.isSelected ? 
          <View
            style={styles.tabIndicatorHighlighted}
          /> :
          <View
            style={styles.tabIndicatorNormal}
          />
      }
      <KJTouchableOpacity
        containerStyle={Styles.button_overlay}
        onPress={props.onPress}
      />
    </View>
  );
};

// --------------------------------------------------

TabsHeader.defaultProps = {
  totalThreadsUnRead: 0,
  totalGroupThreadsUnRead: 0,
  onTabSelected: () => { },
};

export default TabsHeader;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 36,
    backgroundColor: colors.navigation_bg,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  tabContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  tabTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#0000',
  },
  tabIndicatorNormal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  tabIndicatorHighlighted: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: '#00A0F3',
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#7f7f7f',
  },
  tabTitleHighlighted: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A0F3',
  },
  badgeContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  badgeBracket: {
    fontSize: 14,
    fontWeight: '300',
    color: '#7f7f7f',
  },
  badgeNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF503E',
  },
});
