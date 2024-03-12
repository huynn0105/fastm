import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
const _ = require('lodash');

// --------------------------------------------------

class LoadMoreView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    // hidden
    if (this.props.isHidden) return null;
    // visible
    const {
      style, isLoading,
      title, titleStyle,
      indicatorStyle,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          isLoading ?
          <ActivityIndicator
            style={[styles.indicator, indicatorStyle]}
            animating
            color="#404040"
            size="small"
          />
          :
          <AppText style={[styles.title, titleStyle]}>
            {title}
          </AppText>
        }
      </View>
    );
  }
}

// --------------------------------------------------

LoadMoreView.propTypes = {
  isHidden: PropTypes.bool,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
};

LoadMoreView.defaultProps = {
  isHidden: false,
  isLoading: true,
  title: 'đã tải tất cả tin',
};

export default LoadMoreView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 44,
  },
  title: {
    flex: 0,
    alignSelf: 'center',
    color: '#909090',
    fontSize: 16,
    fontWeight: '400',
  },
  indicator: {
    alignSelf: 'center',
  },
});
