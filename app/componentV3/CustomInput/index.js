import React, { useCallback, forwardRef } from 'react';
import { StyleSheet, View, TextInput, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import { fonts } from '../../constants/configs';

const CustomInput = (
  {
    value,
    onChangeText,
    onClearText,
    error = false,
    errorMessage = '',
    textInputStyle = {},
    ...otherProps
  },
  ref,
) => {
  const onStaticChangeText = useCallback(
    (value) => {
      if (onChangeText) {
        onChangeText(value);
      }
    },
    [onChangeText],
  );

  return (
    <View style={styles.wrraper}>
      <View style={styles.formInputContainer}>
        <TextInput
          {...otherProps}
          ref={ref}
          value={value}
          autoCorrect={false}
          placeholderTextColor={'rgb(36, 37, 61, 0.4)'}
          onChangeText={onStaticChangeText}
          style={[styles.input, error && styles.errorInput, textInputStyle]}
        />
        {!!value && onClearText && (
          <View style={styles.clearContainer}>
            <TouchableWithoutFeedback onPress={onClearText}>
              <Image source={ICON_PATH.delete1} style={styles.ic} />
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
      {error && (
        <View style={styles.row}>
          <Image source={ICON_PATH.warning} style={styles.icWra} />
          <AppText style={styles.txtWarn}>{errorMessage}</AppText>
        </View>
      )}
    </View>
  );
};

export default forwardRef(CustomInput);

const styles = StyleSheet.create({
  wrraper: {
    width: '100%',
  },
  formInputContainer: {
    width: '100%',
    justifyContent: 'center',
    marginVertical: 12,
  },
  input: {
    borderRadius: 4,
    backgroundColor: '#edffe8',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.neutral4,
    fontSize: SH(16),
    fontFamily: fonts.regular,
    lineHeight: SH(17),
    // letterSpacing: 0,
    color: Colors.primary4,
    paddingHorizontal: SW(16),
  },
  errorInput: {
    backgroundColor: '#ffe6e9',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: Colors.accent3,
  },
  clearContainer: {
    position: 'absolute',
    right: 12,
  },
  ic: {
    width: 20,
    height: 20,
  },
  icWra: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  txtWarn: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
