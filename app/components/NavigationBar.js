/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
/**
 * A base navigation bar
 * - has left buttons, right buttons and text title
 * - can custom title by renderTitle props
 * - override props: containerStyle, titleStyle
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator} from 'react-native';

import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

/* eslint-disable */
import { isPhoneX } from '../utils/Utils';
import iphone12Helper from '../utils/iphone12Helper';

import colors from '../constants/colors';
import AppText from '../componentV3/AppText';
/* eslint-enable */

const IS_PHONE_X = isPhoneX();
const IPHONE_X_OFFSET = IS_PHONE_X ? 12 : 0;

const BAR_BUTTON_SIZE = 44;
const BAR_PADDING_TOP = Platform.OS === 'android' ? 0 : (20 + IPHONE_X_OFFSET);
const BAR_HEIGHT = Platform.OS === 'android' ? 44 : (64 + IPHONE_X_OFFSET);
const OFFSET_IP12 = iphone12Helper() ? 12 : 0;

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  renderLeftButtons() {
    return (
      <View style={styles.leftButtonsContainer}>
        {this.props.leftButtons}
      </View>
    );
  }
  renderRightButtons() {
    return (
      <View style={styles.rightButtonsContainer}>
        {this.props.rightButtons}
      </View>
    );
  }
  renderTitle() {
    const { leftButtons, rightButtons, barButtonSize, loading } = this.props;
    const margin = Math.abs(leftButtons.length - rightButtons.length) * barButtonSize;
    const marginLeft = leftButtons.length > rightButtons.length ? 0 : margin;
    const marginRight = rightButtons.length > leftButtons.length ? 0 : margin;
    const { title, titleStyle } = this.props;
    return (
      <View style={[styles.titleContainer, { marginLeft, marginRight }]}>
        {
          // loading &&
          <Animatable.View
            style={{ marginRight: 4, marginBottom: 1 }}
            animation={loading ? 'zoomIn' : 'zoomOut'}
            duration={200}
            useNativeDriver
          >
            <ActivityIndicator
              // style={{}}
              animating
              color="#404040"
              size="small"
            />
          </Animatable.View>
        }
        {
          this.props.renderTitle ? this.props.renderTitle() :
            <AppText style={[styles.titleText, titleStyle]}>
              {title}
            </AppText>
        }
        {
          // loading &&
          <Animatable.View
            style={{ marginRight: 4, marginBottom: 1 }}
            animation={'zoomOut'}
            duration={0}
            useNativeDriver
          >
            <ActivityIndicator
              // style={{}}
              animating
              color="#0000"
              size="small"
            />
          </Animatable.View>
        }
      </View>
    );
  }
  render() {
    const {
      containerStyle,
      isSeparatorHidden,
    } = this.props;
    return (
        <View style={[styles.container, containerStyle]}>
          <View style={styles.rowContainer}>
            {this.renderLeftButtons()}
            {this.renderTitle()}
            {this.renderRightButtons()}
          </View>
          {
            isSeparatorHidden ? null :
              <View style={styles.separator} />
          }
        </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  barButtonSize: PropTypes.number,
  renderTitle: PropTypes.func,
  isSeparatorHidden: PropTypes.bool,
};

NavigationBar.defaultProps = {
  barButtonSize: BAR_BUTTON_SIZE,
  renderTitle: null,
  leftButtons: [], // eslint-disable-line
  rightButtons: [], // eslint-disable-line
  isSeparatorHidden: false,
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: BAR_PADDING_TOP + OFFSET_IP12,
    paddingBottom: 0,
    height: BAR_HEIGHT,
    backgroundColor: colors.navigation_bg,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#0000',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#0000',
  },
  leftButtonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000',
    paddingLeft: 4,
  },
  rightButtonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000',
    paddingRight: 4,
  },
  titleText: {
    flex: 0,
    alignSelf: 'center',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#202020',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 0,
    marginRight: 0,
  },
});
