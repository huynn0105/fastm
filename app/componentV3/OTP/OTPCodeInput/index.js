import React, { useCallback, useState, forwardRef } from 'react';
import { StyleSheet, Text, View, TextInput, Platform } from 'react-native';

import isEmpty from 'lodash/isEmpty';

import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';

const styles = StyleSheet.create({
  container: {
    width: SW(40),
    height: SH(40),
    marginRight: SW(12),
    justifyContent: 'center',
  },
  inputOTP: {
    width: SW(44),
    height: SH(44),
    fontSize: SH(18),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  blurOTPInput: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.neutral4,
    backgroundColor: Colors.neutral5,
  },
  focusOTPInput: {
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#D6DCF7',
    borderColor: Colors.primary2,
  },
});

const OTPCodeInput = forwardRef((props, ref) => {
  const { id, value, onPrevious, onTextChange } = props;
  /* <------------------- State -------------------> */
  const [isFocus, setIsFocus] = useState(false);

  /* <-------------------  -------------------> */
  const onFocus = useCallback(() => {
    setIsFocus(true);
  }, [setIsFocus]);

  const onBlur = useCallback(() => {
    setIsFocus(false);
  }, [setIsFocus]);

  /* <------------------- Change -------------------> */
  const onChangeText = useCallback(
    (val) => {
      onTextChange(val);
    },
    [onTextChange],
  );

  const onKeyPress = useCallback(
    (e) => {
      const keyPress = e?.nativeEvent?.key;
      if (keyPress === 'Backspace') {
        if (isEmpty(value)) {
          onPrevious(id);
        } else {
          onTextChange('');
        }
      } else {
        onTextChange(keyPress);
      }
    },
    [id, value, onPrevious, onTextChange],
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        value={value || ''}
        maxLength={1}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="next"
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric' })}
        style={[styles.inputOTP, isFocus ? styles.focusOTPInput : styles.blurOTPInput]}
      />
    </View>
  );
});

export default OTPCodeInput;
