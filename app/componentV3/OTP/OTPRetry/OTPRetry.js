import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import AppText from '../../AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';

const OTPRetry = memo((props) => {
  const { title, titleCountDown, options, onPressOption, disabled, countDownSecs } = props;

  const renderOption = useCallback(
    (option) => {
      const titleOption =
        option === 'voice'
          ? 'Cuộc gọi'
          : option === 'sms'
          ? 'Tin nhắn'
          : option === 'email'
          ? 'Email'
          : null;
      const icon =
        option === 'voice'
          ? ICON_PATH.icPhone
          : option === 'sms'
          ? ICON_PATH.icChat
          : option === 'email'
          ? ICON_PATH.icMail
          : null;
      const color =
        option === 'voice'
          ? '#e0ecff'
          : option === 'sms'
          ? '#d6fff4'
          : option === 'email'
          ? '#fdecd8'
          : null;

      return (
        <TouchableWithoutFeedback
          key={option}
          disabled={disabled}
          onPress={() => onPressOption?.(option)}
        >
          <View style={[styles.optionContainer, { opacity: disabled ? 0.5 : 1 }]}>
            <View style={[styles.optionIconContainer, { backgroundColor: color }]}>
              <Image source={icon} style={styles.optionIcon} />
            </View>
            <AppText style={styles.optionTitle}>{titleOption}</AppText>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [disabled, onPressOption],
  );

  if (countDownSecs > 0) {
    return (
      <View style={styles.container}>
        <AppText style={styles.title} medium>
          {titleCountDown}
          <AppText
            bold
            style={[
              styles.title,
              {
                color: Colors.gray1,
              },
            ]}
          >
            {countDownSecs}s
          </AppText>
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.title} medium>
        {title}
      </AppText>
      <View style={styles.optionsContainer}>
        {options?.length ? options?.map(renderOption) : null}
      </View>
    </View>
  );
});

export default OTPRetry;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.gray5,
    fontSize: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 8,
  },
  optionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    width: 28,
    height: 28,
  },
  optionTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 8,
  },
});
