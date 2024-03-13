import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { ICON_PATH } from '../../assets/path';
import AppText from '../AppText';
import { SH } from '../../constants/styles';
import Colors from '../../theme/Color';

const CheckBoxSquare = memo((props) => {
  const {
    isSelected,
    onChangeValue,
    label,
    textColor,
    disabled,
    style,
    numberOfLines = 1,
    isError,
    isTextSmall,
    value,
    labelStyle,
    checkboxStyle,
  } = props;
  const [selected, setSelected] = useState(isSelected);

  const onPressCheckBox = useCallback(() => {
    if (typeof value !== 'undefined') {
      onChangeValue?.(!value);
    } else {
      setSelected((prevState) => {
        onChangeValue?.(!prevState);
        return !prevState;
      });
    }
  }, [onChangeValue, value]);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  return (
    <TouchableWithoutFeedback disabled={disabled} onPress={onPressCheckBox}>
      <View style={[styles.itemContainer, style]}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onPressCheckBox}
          style={[
            styles.checkboxContainer,
            checkboxStyle,
            (typeof value !== 'undefined' ? value : selected) && styles.checkboxActiveContainer,
            disabled && { backgroundColor: Colors.neutral4, borderColor: Colors.neutral4 },
            isError && styles.checkboxErrorContainer,
          ]}
        >
          {(typeof value !== 'undefined' ? value : selected) ? (
            <Image source={ICON_PATH.tick2} style={styles.iconTick} />
          ) : null}
        </TouchableOpacity>
        <AppText
          numberOfLines={numberOfLines}
          style={[
            isTextSmall ? styles.itemValueSmall : styles.itemValue,
            textColor && { color: textColor },
            labelStyle,
          ]}
        >
          {label}
        </AppText>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default CheckBoxSquare;

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 16,
    color: Colors.gray5,
    lineHeight: 22,
  },
  itemValueSmall: {
    fontSize: 14,
    color: Colors.gray5,
    lineHeight: 20,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    backgroundColor: Colors.primary5,
    borderWidth: 1,
    borderColor: Colors.neutral4,
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActiveContainer: {
    backgroundColor: Colors.primary2,
    borderColor: Colors.primary2,
  },
  checkboxErrorContainer: {
    borderColor: Colors.fiveRed,
  },
  iconTick: {
    width: SH(24),
    height: SH(24),
    resizeMode: 'contain',
    tintColor: Colors.primary5,
  },
});
