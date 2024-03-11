import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../theme/Color';
import { SH } from '../../constants/styles';

const ShimmerLoading = memo(() => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}></View>
      </View>
      <View style={styles.container}>
        <View style={styles.row}></View>
      </View>
    </>
  );
});

export default ShimmerLoading;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.primary5,
    height: SH(100),
    marginTop: SH(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
