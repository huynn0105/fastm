/* eslint-disable */
import { isPhoneX } from 'app/utils/Utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../componentV3/AppText';
import KJTouchableOpacity from './KJTouchableOpacity';

const LOG_TAG = 'NavigationBar.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');
const IS_PHONE_X = isPhoneX();
const IPHONE_X_OFFSET = IS_PHONE_X ? 12 : 0;

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.backgroundOpacity = new Animated.Value(props.backgroundOpacity);
    this.titleOpacity = new Animated.Value(props.titleOpacity);
  }
  componentWillReceiveProps(nextProps) {
    if (this.backgroundOpacity._value !== nextProps.backgroundOpacity) {
      // eslint-disable-line
      this.animateBackground(nextProps.backgroundOpacity);
    }
    if (this.titleOpacity._value !== nextProps.titleOpacity) {
      // eslint-disable-line
      this.animateTitle(nextProps.titleOpacity);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onTitlePress = () => {
    this.props.onTitlePress();
  };
  animateBackground(value) {
    // console.warn(`${LogTAG} animateBackground`, value);
    Animated.spring(this.backgroundOpacity, {
      toValue: value,
      // duration: 350,
      // easing: Easing.linear,
    }).start();
  }
  animateTitle(value) {
    // console.warn(`${LogTAG} animateTitle`, value);
    Animated.spring(this.titleOpacity, {
      toValue: value,
      // duration: 350,
      // easing: Easing.linear,
    }).start();
  }
  // --------------------------------------------------
  render() {
    const { leftButton, rightButton, leftButtonBadge, rightButtonBadge, title, titleStyle } =
      this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.gradientContainer]} />

        <Animated.View style={[styles.gradientContainer, { opacity: this.backgroundOpacity }]}>
          <LinearGradient
            style={styles.gradient}
            startPoint={{ x: 0.5, y: 0.0 }}
            endPoint={{ x: 0.5, y: 1.0 }}
            locations={[0.0, 0.65, 1.0]}
            colors={['#009DF7EE', '#009DF780', '#009DF700']}
          />
        </Animated.View>

        <View style={styles.leftItem}>{leftButton}</View>
        {leftButtonBadge && leftButtonBadge.length > 0 ? (
          <AppText style={[styles.badge, styles.leftBadge]}>{leftButtonBadge}</AppText>
        ) : null}

        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, titleStyle, { opacity: this.titleOpacity }]}>
            {title}
          </Animated.Text>
        </View>

        <View style={styles.rightItem}>{rightButton}</View>
        {rightButtonBadge && rightButtonBadge.length > 0 ? (
          <AppText style={[styles.badge, styles.rightBadge]}>{rightButtonBadge}</AppText>
        ) : null}

        <KJTouchableOpacity style={styles.titleButton} onPress={this.onTitlePress} />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onTitlePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onTitlePress: () => {},
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 20 + IPHONE_X_OFFSET,
    paddingBottom: 8,
    height: 62 + IPHONE_X_OFFSET,
    backgroundColor: '#f000',
    zIndex: 999,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff0',
  },
  gradient: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#f000',
  },
  leftItem: {
    position: 'absolute',
    top: 16 + IPHONE_X_OFFSET,
    left: 6,
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
  rightItem: {
    position: 'absolute',
    top: 14 + IPHONE_X_OFFSET,
    right: 6,
    width: 44,
    height: 44,
  },
  titleButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: (SCREEN_SIZE.width - 96) / 2,
    right: (SCREEN_SIZE.width - 96) / 2,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 64,
    marginRight: 64,
  },
  title: {
    flex: 0,
    alignSelf: 'center',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    paddingLeft: 5,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#FF503E',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
  },
  leftBadge: {
    left: 34,
    top: 20 + IPHONE_X_OFFSET,
  },
  rightBadge: {
    right: 12,
    top: 18 + IPHONE_X_OFFSET,
  },
});
