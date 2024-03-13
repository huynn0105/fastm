import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../theme/Color';
import AppText from '../componentV3/AppText';
import Indicator from '../componentV3/Indicator/Indicator';

const ButtonText = memo((props) => {
  const {
    width = 'auto',
    height = 40,
    fontSize = 14,
    lineHeight = 20,
    buttonColor = Colors.primary2,
    titleColor = Colors.primary5,
    borderColor,
    style,
    titleStyle,
    title,
    onPress,
    onLongPress,
    top = 0,
    bottom = 0,
    disabled,
    isLoading,
    ...rest
  } = props;
  return (
    <TouchableWithoutFeedback disabled={disabled} onLongPress={onLongPress} onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            height,
            width,
            borderColor: borderColor || buttonColor,
            backgroundColor: buttonColor,
            marginTop: top,
            marginBottom: bottom,
            borderWidth: 1,
          },
          style,
        ]}
      >
        <AppText
          {...rest}
          style={[
            { fontSize, lineHeight, color: titleColor, opacity: isLoading ? 0 : 1 },
            titleStyle,
          ]}
        >
          {title}
        </AppText>
        {isLoading ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Indicator color={titleColor} />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ButtonText;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
});
