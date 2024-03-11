import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';

const ButtonCheckBox = memo((props) => {
  const { placeholder, value, onPress, style } = props;
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <AppText semiBold={value?.length} style={value?.length ? styles.value : styles.placeholder}>
        - {value || placeholder} -
      </AppText>
      <Image source={ICON_PATH.select} style={styles.icon} resizeMode={'contain'} />
    </TouchableOpacity>
  );
});

export default ButtonCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: SW(16),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutral5,
    borderRadius: SH(8),
    height: SH(40),
    marginBottom: SH(16),
    marginTop: SH(8),
  },
  placeholder: {
    fontSize: 13,
    color: Colors.gray5,
    marginLeft: SW(16),
  },
  value: {
    fontSize: 13,
    color: Colors.gray1,
    marginLeft: SW(16),
  },
  icon: {
    width: SH(20),
    height: SH(20),
    marginRight: SW(3),
  },
});
