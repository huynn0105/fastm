import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
export default class LinkButton extends PureComponent {
  renderRightIcon = (rightIcon) => (
    <Image
      style={{ width: 24, height: 24, marginLeft: 4 }}
      resizeMode="contain"
      source={rightIcon}
    />
  );

  render() {
    const {
      containerStyle,
      textStyle,
      text,
      underline,
      disabled,
      rightIcon = undefined,
      onPress,
    } = this.props;
    const underlinedTextStyle = underline ? styles.textUnderLine : {};
    const Button = disabled ? View : TouchableOpacity;
    const disabledTextStyle = disabled ? styles.disabled : {};
    return (
      <Button
        style={containerStyle}
        activeOpacity={0.2}
        onPress={onPress}
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[styles.text, underlinedTextStyle, textStyle, disabledTextStyle]}>
            {text}
          </AppText>
          {rightIcon !== undefined ? this.renderRightIcon(rightIcon) : null}
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  disabled: {
    color: Colors.neutral3,
  },
  textUnderLine: {
    textDecorationLine: 'underline',
  },
});
