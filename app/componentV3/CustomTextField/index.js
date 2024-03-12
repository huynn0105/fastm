import React, { forwardRef, useCallback, useState, useRef, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { TextField } from 'rn-material-ui-textfield';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import { IS_ANDROID } from '../../utils/Utils';

const styles = StyleSheet.create({});

const CustomTextField = (props, ref) => {
  const {
    containerStyle,
    textFieldContainerStyle,
    textFieldInputStyle,
    textFieldValue,
    textFieldLabel,
    textFieldLabelTextStyle,
    autoCapitalize,
    keyboardType,
    description,
    showError,
    errorMessage,
    rightIcon,
    leftIcon,
    editable,
    rightComponent,
    labelFontSize,
    onChangeTextFieldText,
    onTextFieldFocus,
    onTextFieldBlur,
    returnKeyType,
    onSubmitEditing = () => {},
    subNote,
    isRequired,
    maxLength,
  } = props;

  const refStatisInput = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const tintColor = showError ? Colors.sixRed : Colors.gray5;
  const marginLeft = leftIcon ? 28 : 0;
  const refPickerInput = useRef(null);

  useEffect(() => {
    const refPublicInput = ref?.current;
    if (!refPublicInput) {
      const refStatic = ref?.current;
      if (refStatic) {
        refStatic.setValue(textFieldValue);
      }
    }
  }, [refStatisInput, ref, textFieldValue]);

  const onChangeText = useCallback(
    (text) => {
      if (typeof onChangeTextFieldText === 'function') {
        onChangeTextFieldText(text);
      }
    },
    [onChangeTextFieldText],
  );

  const _onTextFieldFocus = useCallback(() => {
    setIsFocused(true);
    if (typeof onTextFieldFocus === 'function') {
      onTextFieldFocus();
    }
  }, [setIsFocused, onTextFieldFocus]);

  const _onTextFieldBlur = useCallback(() => {
    setIsFocused(false);
    if (typeof onTextFieldBlur === 'function') {
      onTextFieldBlur();
    }
  }, [setIsFocused, onTextFieldBlur]);

  const renderRightIcon = useCallback(() => {
    let rightIconTintColor = null;
    if (isFocused) {
      rightIconTintColor = showError ? Colors.sixRed : Colors.primary1;
    }
    return (
      <Image
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          right: 0,
          bottom: 14,
          tintColor: rightIconTintColor,
        }}
        source={rightIcon}
        resizeMode="stretch"
      />
    );
  }, [rightIcon, isFocused, showError]);

  const renderLeftIcon = useCallback(() => {
    let leftIconTintColor = null;
    if (isFocused) {
      leftIconTintColor = showError ? Colors.sixRed : Colors.primary1;
    }
    return (
      <Image
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          left: 0,
          bottom: 14,
          tintColor: leftIconTintColor,
        }}
        source={leftIcon}
        resizeMode="stretch"
      />
    );
  }, [leftIcon, isFocused, showError]);

  const renderErrorMessage = useCallback(() => {
    return errorMessage ? (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          style={{ width: 16, height: 16, tintColor: Colors.sixRed }}
          source={ICON_PATH.warning}
        />
        <AppText
          style={{ marginLeft: 4, ...TextStyles.normalTitle, fontSize: 11, color: Colors.sixRed }}
        >
          {errorMessage}
        </AppText>
      </View>
    ) : null;
  }, [errorMessage]);

  const renderDescription = useCallback(() => {
    return description ? (
      <View style={{ marginTop: 2 }}>
        <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6 }}>{description}</AppText>
      </View>
    ) : null;
  }, [description]);

  useEffect(() => {
    const refInput = ref?.current || refPickerInput?.current;
    if (refInput) {
      refInput.setValue(textFieldValue);
    }
  }, [ref, textFieldValue]);

  return (
    <View style={{ ...containerStyle }}>
      <View>
        {leftIcon && renderLeftIcon(leftIcon)}
        <TextField
          ref={ref || refPickerInput}
          style={{ ...textFieldInputStyle, marginLeft }}
          containerStyle={{
            flex: 1,
            ...textFieldContainerStyle,
          }}
          fontSize={SH(14)}
          lineWidth={IS_ANDROID ? 1 : 0.5}
          activeLineWidth={IS_ANDROID ? 1 : 0.5}
          disabledLineWidth={IS_ANDROID ? 1 : 0.5}
          animationDuration={180}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          value={textFieldValue}
          label={textFieldLabel}
          labelFontSize={labelFontSize || 14}
          autoCorrect={false}
          labelOffset={{ y0: 0, y1: 0 }}
          contentInset={{ top: 0, input: 4 }}
          labelTextStyle={{
            ...textFieldLabelTextStyle,
            marginLeft,
            paddingTop: 0,
            position: 'absolute',
            left: '100%',
          }}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          baseColor={Colors.gray5}
          tintColor={tintColor}
          onChangeText={onChangeText}
          onFocus={_onTextFieldFocus}
          onBlur={_onTextFieldBlur}
          editable={editable}
          maxLength={maxLength}
        />
        {rightComponent && rightComponent()}
        {rightIcon && renderRightIcon(rightIcon)}
      </View>
      {showError ? renderErrorMessage(errorMessage) : renderDescription(description)}
      {isRequired ? (
        <View
          style={{
            position: 'absolute',
            right: SW(110),
            top: textFieldValue?.length > 0 ? 0 : SH(20),
          }}
        >
          <AppText style={{ color: Colors.secondRed, fontSize: SH(14) }}>*</AppText>
        </View>
      ) : null}
    </View>
  );
};

export default forwardRef(CustomTextField);
