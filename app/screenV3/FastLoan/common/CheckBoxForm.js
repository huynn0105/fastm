import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const CheckBoxForm = memo((props) => {
  const { style, data, value, title, isRequire, onValueChange } = props;

  const onPress = useCallback(
    (v) => () => {
      onValueChange(v);
    },
    [onValueChange],
  );

  const renderCheckBox = useCallback(
    (item) => {
      const isChecked = value?.includes(item.value);

      return (
        <View style={styles.checkBoxContainer} key={item?.value}>
          <TouchableOpacity
            onPress={onPress(item.value)}
            style={[
              styles.checkBox,
              isChecked && { backgroundColor: 'transparent', borderColor: Colors.action },
            ]}
          >
            <View style={[styles.circle, isChecked && { backgroundColor: Colors.action }]} />
          </TouchableOpacity>
          <AppText bold={isChecked} style={styles.text && isChecked && { color: Colors.accent7 }}>
            {item?.label}
          </AppText>
        </View>
      );
    },
    [onPress, value],
  );

  return (
    <View style={style}>
      <AppText style={styles.title}>
        {title}
        {isRequire && <AppText style={styles.require}> {` *`}</AppText>}
      </AppText>
      <View style={[styles.row, { marginTop: SH(5) }]}>{data.map(renderCheckBox)}</View>
    </View>
  );
});

export default CheckBoxForm;

const styles = StyleSheet.create({
  title: { fontSize: SH(12), color: Colors.gray5 },
  require: { fontSize: SH(12), color: Colors.accent3 },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: SH(24),
    height: SH(24),
    borderRadius: SH(12),
    borderWidth: SH(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.neutral4,
    backgroundColor: Colors.primary5,
    marginRight: SW(8),
  },
  circle: {
    width: SH(14),
    height: SH(14),
    borderRadius: SH(7),
    backgroundColor: Colors.primary5,
  },
  text: {
    fontSize: SH(14),
    color: Colors.gray5,
  },
});
