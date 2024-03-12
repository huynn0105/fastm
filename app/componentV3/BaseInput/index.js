import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { fonts } from '../../constants/configs';
import styles, { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import AppText from '../AppText';

const BaseInput = ({
  placeholder = '',
  placeholderTextColor = Colors.gray1,
  containerStyle,
  isRequired,
  _onChangeText,
  value,
  errorMessageEmail,
}) => {
  const [text, setText] = useState(value);
  const onChangeText = (text) => {
    setText(text);
    _onChangeText(text);
  };
  useEffect(() => {
    setText(value);
  }, [value]);
  return (
    <View style={[_styles.containerTextInput, containerStyle]}>
      {text?.length === 0 ? (
        <View style={_styles.placeholderView}>
          <AppText style={styles.commonTitleText}>
            {placeholder}
            {isRequired ? <AppText style={{ color: Colors.accent3 }}>{` *`}</AppText> : null}
          </AppText>
        </View>
      ) : null}
      <TextInput
        onChangeText={onChangeText}
        // placeholder={placeholder}
        style={[_styles.commonTitleText, _styles.textInput, {}]}
        value={text}
      />
      {errorMessageEmail?.length > 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SH(8) }}>
          <Image style={{ width: SW(16), height: SH(16) }} source={ICON_PATH.warning} />
          <AppText
            style={{
              marginLeft: SW(4),
              fontSize: SH(12),
              lineHeight: SH(16),
              color: Colors.secondRed,
            }}
          >
            {errorMessageEmail}
          </AppText>
        </View>
      ) : null}
    </View>
  );
};
const _styles = StyleSheet.create({
  textInput: {
    borderBottomColor: Colors.neutral4,
    borderBottomWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? SH(6) : 0,
    fontFamily: fonts.regular,
  },
  containerTextInput: {
    minHeight: SH(48),
    marginTop: SH(12),
  },
  placeholderView: {
    position: 'absolute',
    top: SH(0),
    opacity: 0.6,
    left: SW(4),
  },
  commonTitleText: {
    fontSize: SH(14),
    lineHeight: SH(16),
    color: Colors.gray1,
  },
});

export default BaseInput;
