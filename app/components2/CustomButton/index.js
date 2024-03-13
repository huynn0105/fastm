import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewPropTypes,
} from 'react-native';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
import { fonts } from '../../constants/configs';

const LARGE_BUTTON_HEIGHT = 54;
const REGULAR_BUTTON_HEIGHT = 46;
const SMALL_BUTTON_HEIGHT = 36;

export const BUTTON_COLOR = {
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  OUTLINE: 'OUTLINE',
};

export const BUTTON_SIZE = {
  LARGE: 'LARGE',
  REGULAR: 'REGULAR',
  SMALL: 'SMALL',
};

export const BUTTON_TEXT_SIZE = {
  LARGE: 'LARGE',
  REGULAR: 'REGULAR',
  SMALL: 'SMALL',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  commonButton: {
    alignItems: 'center',
  },
  blueButton: {
    backgroundColor: Colors.primary1,
  },
  greenButton: {
    backgroundColor: Colors.primary2,
  },
  outlineButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.primary3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 24,
    marginRight: 24,
  },
  text: {
    textAlign: 'center',
  },
  iconButton: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  rightIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  disabled: {
    backgroundColor: Colors.neutral3,
    borderWidth: 0,
  },
  disabledText: {
    color: Colors.gray5,
  },
});

const BACKGROUND_COLOR = {
  BLUE: styles.blueButton,
  GREEN: styles.greenButton,
  OUTLINE: styles.outlineButton,
};

const SIZE = {
  LARGE: LARGE_BUTTON_HEIGHT,
  REGULAR: REGULAR_BUTTON_HEIGHT,
  SMALL: SMALL_BUTTON_HEIGHT,
};

const TEXT_SIZE = {
  LARGE: TextStyles.button1,
  REGULAR: TextStyles.button2,
  SMALL: TextStyles.button2,
};

export default class CustomButton extends PureComponent {
  renderLeftIcon(icon, iconSize, disabled) {
    const iconSizeStyle = { width: iconSize, height: iconSize };
    const iconDisabledStyle = disabled ? { tintColor: Colors.primary3 } : {};
    return icon ? (
      <Image
        style={[styles.iconButton, iconSizeStyle, iconDisabledStyle]}
        resizeMode="center"
        source={icon}
      />
    ) : null;
  }

  renderRightIcon(icon, iconSize, disabled) {
    const iconSizeStyle = { width: iconSize, height: iconSize };
    const iconDisabledStyle = disabled ? { tintColor: Colors.primary3 } : {};
    return icon ? (
      <Image
        style={[styles.rightIcon, iconSizeStyle, iconDisabledStyle]}
        resizeMode="center"
        source={icon}
      />
    ) : null;
  }

  renderButtonContent = (sizeType, title, textColor, icon, rightIcon, iconSize, disabled) => {
    return (
      <View style={styles.content}>
        {this.renderLeftIcon(icon, iconSize, disabled)}
        <AppText
          semiBold
          style={[
            styles.text,
            { fontSize: 18, lineHeight: 26 },
            { color: textColor },
            disabled ? styles.disabledText : {},
          ]}
        >
          {title}
        </AppText>
        {this.renderRightIcon(rightIcon, iconSize, disabled)}
      </View>
    );
  };

  render() {
    const {
      containerStyle,
      buttonColor,
      sizeType,
      title,
      textColor,
      icon,
      rightIcon,
      disabled,
      onPress,
    } = this.props;
    let { buttonStyle } = this.props;

    const iconSize = sizeType === BUTTON_SIZE.SMALL ? 20 : 24;
    // button style
    const buttonHeight = SIZE[sizeType] || REGULAR_BUTTON_HEIGHT;
    const buttonBackgroundColor = BACKGROUND_COLOR[buttonColor] || styles.blueButton;
    const buttonDisabledStyle = disabled ? styles.disabled : {};
    buttonStyle = {
      ...styles.commonButton,
      ...buttonBackgroundColor,
      height: buttonHeight,
      borderRadius: buttonHeight / 2,
      ...buttonStyle,
      ...buttonDisabledStyle,
    };
    const Button = disabled ? View : TouchableOpacity;
    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <Button
          style={buttonStyle}
          activeOpacity={0.2}
          onPress={onPress}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          {this.renderButtonContent(
            sizeType,
            title,
            textColor,
            icon,
            rightIcon,
            iconSize,
            disabled,
          )}
        </Button>
      </Animated.View>
    );
  }
}

CustomButton.propTypes = {
  containerStyle: ViewPropTypes.style,
  buttonStyle: ViewPropTypes.style,
  title: PropTypes.string,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};

CustomButton.defaultProps = {
  title: 'Default',
  textColor: Colors.primary5,
  icon: '',
  rightIcon: '',
  buttonColor: BUTTON_COLOR.BLUE,
  sizeType: BUTTON_SIZE.REGULAR,
};
