/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/* eslint-disable */
import { isPhoneX } from 'app/utils/Utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import KJButton from '../../components/common/KJButton';
import SearchBar from '../../components/SearchBar';

const IS_PHONE_X = isPhoneX();
const IPHONE_X_OFFSET = IS_PHONE_X ? 12 : 0;

const BAR_PADDING_TOP = Platform.OS === 'android' ? 0 : 20 + IPHONE_X_OFFSET;

const LOG_TAG = 'ContactsList/NavigationBar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusingSearch: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onAddPress = () => {
    this.props.onAddPress();
  };
  onSearchTextChanged = (text) => {
    if (this.props.onSearchTextChanged) {
      this.props.onSearchTextChanged(text);
    }
  };
  onFocusingSearchBar = (focused) => {
    this.setState({
      focusingSearch: focused,
    });
  };
  // --------------------------------------------------
  render() {
    return (
      <View style={{ backgroundColor: '#E6EBFF', marginBottom: 6 }}>
        <SearchBar
          style={{
            marginTop: BAR_PADDING_TOP,
          }}
          loading={this.props.loading}
          onSearchTextChanged={this.onSearchTextChanged}
          onFocusing={this.onFocusingSearchBar}
          placeholder={'Tìm kiếm liên hệ'}
        />
        <Animatable.View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: BAR_PADDING_TOP,
          }}
          animation={this.state.focusingSearch ? 'slideOutRight' : 'slideInRight'}
          useNativeDriver
        >
          <KJButton
            containerStyle={styles.barButton}
            leftIconSource={require('./img/add.png')}
            leftIconStyle={{ marginLeft: -12 }}
            onPress={this.onAddPress}
          />
        </Animatable.View>
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onInboxPress: PropTypes.func,
  onAddPress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onInboxPress: () => {},
  onAddPress: () => {},
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  barButton: {
    paddingLeft: 24,
    width: 60,
    height: 44,
    backgroundColor: '#f000',
  },
});
