import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import ActionButtonItem from './ActionButtonItem';

import {
  shadowStyle,
  alignItemsMap,
  getTouchableComponent,
  isAndroid,
  touchableBackground,
  DEFAULT_ACTIVE_OPACITY,
} from './shared';
import AppText from '../../componentV3/AppText';

const _ = require('lodash');

export default class ActionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resetToken: props.resetToken,
      active: props.active,
    };

    this.anim = new Animated.Value(props.active ? 1 : 0);
    this.timeout = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.resetToken !== this.state.resetToken) {
      if (nextProps.active === false && this.state.active === true) {
        if (this.props.onReset) this.props.onReset();
        Animated.spring(this.anim, { toValue: 0 }).start();
        setTimeout(
          () =>
            this.setState({ active: false, resetToken: nextProps.resetToken }),
          250,
        );
        return;
      }

      if (nextProps.active === true && this.state.active === false) {
        Animated.spring(this.anim, { toValue: 1 }).start();
        this.setState({ active: true, resetToken: nextProps.resetToken });
        return;
      }

      this.setState({
        resetToken: nextProps.resetToken,
        active: nextProps.active,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  // STYLESHEET GETTERS

  getOrientation() {
    return { alignItems: alignItemsMap[this.props.position] };
  }

  getOffsetXY() {
    return {
      // paddingHorizontal: this.props.offsetX,
      paddingVertical: this.props.offsetY + (this.props.activeTabbar ? 0 : 49),
    };
  }

  getOverlayStyles() {
    return [
      styles.overlay,
      {
        elevation: this.props.elevation,
        zIndex: this.props.zIndex,
        justifyContent: this.props.verticalOrientation === 'up'
          ? 'flex-end'
          : 'flex-start',
      },
    ];
  }

  mRenderMainButton() {
    const animatedViewStyle = {
      transform: [
        // {
        // scale: this.anim.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [1, this.props.outRangeScale],
        // }),
        // },
        {
          rotate: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${this.props.degrees}deg`],
          }),
        },
      ],
    };

    const wrapperStyle = {
      backgroundColor: this.anim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.buttonColor,
          this.props.btnOutRange || this.props.buttonColor,
        ],
      }),
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      margin: 4,
    };

    const buttonStyle = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const Touchable = getTouchableComponent(this.props.useNativeFeedback);
    const position = this.props.position === 'left' ? { left: this.props.offsetX } : { left: this.props.offsetX };
    const parentStyle = isAndroid &&
      this.props.fixNativeFeedbackRadius
      ? {
        ...position,
        zIndex: this.props.zIndex,
        borderRadius: this.props.size / 2,
        width: this.props.size,
      }
      : { marginHorizontal: this.props.offsetX, zIndex: this.props.zIndex };

    return (
      <View style={[
        parentStyle,
        // !this.props.hideShadow && shadowStyle,
        // !this.props.hideShadow && this.props.shadowStyle,
      ]}
      >
        <Touchable
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          testID={this.props.testID}
          background={touchableBackground(
            this.props.nativeFeedbackRippleColor,
            this.props.fixNativeFeedbackRadius,
          )}
          activeOpacity={this.props.activeOpacity}
          onLongPress={this.props.onLongPress}
          onPressIn={() => {
            if (this.state.active === false) {
              this.props.onPress(this.state.active);
            }
            if (this.props.children) this.animateButton();
          }}
          // onPressIn={this.props.onPressIn}
          onPressOut={this.props.onPressOut}
        >
          <View
            style={[shadowStyle, {
              justifyContent: 'center',
              alignItems: alignItemsMap[this.props.position],
            }, this.props.buttonStyle]}
          >
            <Animated.View
              style={[shadowStyle, wrapperStyle, this.props.buttonStyle]}
            >
              <Animated.View style={[buttonStyle, animatedViewStyle]}>
                {this.mRenderButtonIcon()}
              </Animated.View>
            </Animated.View>
            {this.renderTitle()}
          </View>
        </Touchable>
      </View>
    );
  }

  mRenderButtonIcon() {
    const { icon, renderIcon, btnOutRangeTxt, buttonTextStyle, buttonText } = this.props;
    if (renderIcon) return renderIcon(this.state.active);
    if (icon) {
      return icon;
    }

    const textColor = buttonTextStyle.color || 'rgba(100,100,100,1)';

    return (
      <Animated.Text
        style={[
          styles.btnText,
          buttonTextStyle,
          {
            color: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [textColor, btnOutRangeTxt || textColor],
            }),
          },
        ]}
      >
        {buttonText}
      </Animated.Text>
    );
  }

  mRenderActions() {
    const { children, verticalOrientation } = this.props;

    // if (!this.state.active) return null;

    const actionButtons = !Array.isArray(children) ? [children] : children;

    const actionStyle = {
      flex: 1,
      alignSelf: 'stretch',
      // backgroundColor: 'purple',
      justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
      paddingTop: this.props.verticalOrientation === 'down'
        ? this.props.spacing
        : 0,
      zIndex: this.props.zIndex,
    };

    return (
      <View
        style={[actionStyle, {
          display: (!this.state.active) ? 'none' : 'flex',
        }]}
        pointerEvents={'box-none'}
      >
        {actionButtons.map((actionButton, idx) => (
          <ActionButtonItem
            key={`key_${idx}`} // eslint-disable-line
            anim={this.anim}
            {...this.props}
            {...actionButton.props}
            parentSize={this.props.size}
            btnColor={this.props.btnOutRange}
            onPressIn={() => {
              if (this.props.autoInactive) {
                this.timeout = setTimeout(this.reset.bind(this), 200);
              }
              actionButton.props.onPress();
            }}
          />
        ))}
      </View>
    );
  }

  mRenderTappableBackground() {
    return (
      (this.state.active && !this.props.backgroundTappable) ?
        <TouchableOpacity
          activeOpacity={1}
          style={this.getOverlayStyles()}
          onPressIn={this.reset.bind(this)} // eslint-disable-line
        />
        : null
    );
  }

  // Animation Methods

  animateButton(animate = true) {
    if (this.state.active) {
      this.reset();
      return;
    }

    if (animate) {
      Animated.spring(this.anim, {
        toValue: 1,
      }).start();
    } else {
      this.anim.setValue(1);
    }

    this.setState({ active: true, resetToken: this.state.resetToken });
  }

  reset(animate = true) {
    this.props.onPress(true);
    if (this.props.onReset) this.props.onReset();

    if (animate) {
      Animated.spring(this.anim, {
        toValue: 0,
      }).start();
    } else {
      this.anim.setValue(0);
    }

    setTimeout(
      () => this.setState({ active: false, resetToken: this.state.resetToken }),
      250,
    );
  }

  renderTitle = () => {
    return (
      <Animated.View
        style={[styles.textContainer, {
          opacity: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }]}
      >
        <AppText style={[styles.text, this.props.textStyle]}>
          {this.props.title}
        </AppText>
      </Animated.View>
    );
  }

  render() {
    return (
      <Animatable.View
        animation="fadeIn"
        delay={200}
        duration={250}
        useNativeDriver
        pointerEvents="box-none"
        style={[this.getOverlayStyles(), this.props.style]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            this.getOverlayStyles(),
            {
              backgroundColor: this.props.bgColor,
              opacity: this.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, this.props.bgOpacity],
              }),
            },
          ]}
        >
          {this.props.backdrop}
        </Animated.View>
        <View
          pointerEvents="box-none"
          style={[
            this.getOverlayStyles(),
            this.getOrientation(),
            this.getOffsetXY(),
          ]}
        >
          {
            this.mRenderTappableBackground()}

          {this.props.verticalOrientation === 'up' &&
            this.props.children &&
            this.mRenderActions()}
          {this.mRenderMainButton()}
          {this.props.verticalOrientation === 'down' &&
            this.props.children &&
            this.mRenderActions()}
        </View>
      </Animatable.View>
    );
  }

}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  resetToken: PropTypes.any, // eslint-disable-line
  active: PropTypes.bool,

  position: PropTypes.string,
  elevation: PropTypes.number,
  zIndex: PropTypes.number,

  hideShadow: PropTypes.bool,
  shadowStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),

  renderIcon: PropTypes.func,

  bgColor: PropTypes.string,
  bgOpacity: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonTextStyle: Text.propTypes.style,
  buttonText: PropTypes.string,

  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  degrees: PropTypes.number,
  verticalOrientation: PropTypes.oneOf(['up', 'down']),
  backgroundTappable: PropTypes.bool,
  activeOpacity: PropTypes.number,

  useNativeFeedback: PropTypes.bool,
  fixNativeFeedbackRadius: PropTypes.bool,
  nativeFeedbackRippleColor: PropTypes.string,

  activeTabbar: PropTypes.bool,

  testID: PropTypes.string,
};

ActionButton.defaultProps = {
  resetToken: null,
  active: false,
  bgColor: '#0008',
  bgOpacity: 1,
  buttonColor: '#fff',
  buttonTextStyle: {},
  buttonText: '+',
  spacing: 16,
  outRangeScale: 1, // eslint-disable-line
  autoInactive: true,
  onPress: () => { },
  onPressIn: () => { },
  onPressOn: () => { }, // eslint-disable-line
  backdrop: false,
  degrees: 45,
  position: 'right',
  offsetX: 10,
  offsetY: 10,
  size: 56,
  verticalOrientation: 'up',
  backgroundTappable: false,
  useNativeFeedback: true,
  activeOpacity: DEFAULT_ACTIVE_OPACITY,
  fixNativeFeedbackRadius: false,
  nativeFeedbackRippleColor: 'rgba(255,255,255,0.75)',
  zIndex: 1000,
  activeTabbar: true,
  testID: undefined,
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  btnText: {
    marginTop: -4,
    fontSize: 48,
    backgroundColor: 'transparent',
  },
  textContainer: {
    position: 'relative',
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 0,
    fontSize: 13,
    color: '#f24654',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '700',
    width: 64,
  },
});
