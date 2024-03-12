import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { SH } from '../../../constants/styles';

const styles = StyleSheet.create({
  container: {
    height: 46,
    flexDirection: 'row',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary2,
  },
  label: {
    fontSize: SH(14),
    lineHeight: SH(20),
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary5,
  },
});

const SecondaryButton = ({ label, onPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={styles.container}>
        <AppText style={styles.label}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
