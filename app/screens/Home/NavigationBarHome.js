import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Animated,
  Easing,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';

import KJTouchableOpacity from 'app/common/KJTouchableOpacity';
import colors from 'app/constants/colors';


/* eslint-disable */
import { isPhoneX } from 'app/utils/Utils';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

const IS_PHONE_X = isPhoneX();
const IPHONE_X_OFFSET = IS_PHONE_X ? 12 : 0;

const BAR_PADDING_TOP = Platform.OS === 'android' ? 0 : (17 + IPHONE_X_OFFSET);
const BAR_HEIGHT = Platform.OS === 'android' ? 44 : (64 + IPHONE_X_OFFSET);

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
    if (this.backgroundOpacity._value !== nextProps.backgroundOpacity) { // eslint-disable-line
      this.animateBackground(nextProps.backgroundOpacity);
    }
    if (this.titleOpacity._value !== nextProps.titleOpacity) { // eslint-disable-line
      this.animateTitle(nextProps.titleOpacity);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onTitlePress = () => {
    this.props.onTitlePress();
  }
  animateBackground(value) {
    // console.warn(`${LogTAG} animateBackground`, value);
    Animated.timing(
      this.backgroundOpacity,
      {
        toValue: value,
        duration: 350,
        easing: Easing.linear,
      },
    ).start();
  }
  animateTitle(value) {
    // console.warn(`${LogTAG} animateTitle`, value);
    Animated.timing(
      this.titleOpacity,
      {
        toValue: value,
        duration: 350,
        easing: Easing.linear,
      },
    ).start();
  }
  // --------------------------------------------------
  render() {
    const {
      leftButton,
      rightButton,
      right2Button,
      leftButtonBadge,
      rightButtonBadge,
      right2ButtonBadge,
      titleView,
      scrollY,
      username,
    } = this.props;

    const scaleTitle = scrollY.interpolate({
      inputRange: [0, 100, 300, 600],
      outputRange: [1, 1, 0.5, 0.5],
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, 100, 200, 600],
      outputRange: [0, 0, -30, -30],
    });
    const opacityTitle = scrollY.interpolate({
      inputRange: [0, 100, 200, 600],
      outputRange: [1, 1, 0, 0],
    });

    const translateYUsername = scrollY.interpolate({
      inputRange: [0, 100, 300, 600],
      outputRange: [-50, -50, 0, 0],
    });
    const scaleUsername = scrollY.interpolate({
      inputRange: [0, 100, 350, 600],
      outputRange: [0.8, 0.8, 1, 1],
    });
    const opacityUsername = scrollY.interpolate({
      inputRange: [0, 100, 400, 600],
      outputRange: [0, 0, 1, 1],
    });

    return (
      <View style={styles.container}>
        <View style={[styles.gradientContainer]} />

        <View style={styles.leftItem}>
          {leftButton}
        </View>
        {
          leftButtonBadge && leftButtonBadge.length > 0 ?
            <Text style={[styles.badge, styles.leftBadge]}>
              {leftButtonBadge}
            </Text>
            : null
        }

        <View
          style={styles.titleContainer}
        >
          <Animated.View style={{
            opacity: opacityTitle,
            transform: [{
              scaleX: scaleTitle,
            }, {
              scaleY: scaleTitle,
            }, {
              translateY,
            }],
            position: 'absolute',
          }}
          >
            {titleView}
          </Animated.View>

          <Animated.Text style={{
            opacity: opacityUsername,
            transform: [{
              scaleX: scaleUsername,
            }, {
              scaleY: scaleUsername,
            }, {
              translateY: translateYUsername,
            }],
            position: 'absolute',
            fontSize: 16,
            fontWeight: '700',
            color: '#000',
          }}
          >
            {username}
          </Animated.Text>
        </View>

        <View style={styles.rightItem}>
          {rightButton}
        </View>
        {
          rightButtonBadge && rightButtonBadge.length > 0 ?
            <Text style={[styles.badge, styles.rightBadge]}>
              {rightButtonBadge}
            </Text>
            : null
        }

        <View style={styles.right2Item}>
          {right2Button}
        </View>
        {
          right2ButtonBadge && right2ButtonBadge.length > 0 ?
            <Text style={[styles.badge, styles.right2Badge]}>
              {right2ButtonBadge}
            </Text>
            : null
        }

        <KJTouchableOpacity
          style={styles.titleButton}
          onPress={this.onTitlePress}
          activeOpacity={1.0}
        />

      </View >
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onTitlePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onTitlePress: () => { },
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: BAR_PADDING_TOP,
    paddingBottom: 0,
    height: BAR_HEIGHT,
    backgroundColor: colors.navigation_bg,
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
    top: BAR_PADDING_TOP,
    left: 6,
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
  rightItem: {
    position: 'absolute',
    top: BAR_PADDING_TOP,
    right: 10,
    width: 44,
    height: 44,
  },
  right2Item: {
    position: 'absolute',
    top: BAR_PADDING_TOP,
    right: 6 + 44 + 6,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 64,
    marginRight: 64,
    marginTop: Platform.OS === 'ios' ? 15 : 12,
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
    left: 36,
    top: 2 + BAR_PADDING_TOP,
  },
  rightBadge: {
    right: 4,
    top: 2 + BAR_PADDING_TOP,
  },
  right2Badge: {
    right: 12 + 44 + 6,
    top: 18 + BAR_PADDING_TOP,
  },
});
