import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { ICON_PATH } from '../../../assets/path';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';

const ItemContest = memo((props) => {
  const { item } = props;

  return (
    <View style={styles.container}>
      <Image source={ICON_PATH.gift} style={styles.icon} />
      <HTMLView html={item} style={styles?.html} />
    </View>
  );
});

export default ItemContest;

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, flexDirection: 'row' },
  icon: {
    tintColor: '#00b886',
    width: 24,
    height: 24,
    marginTop: 12,
    marginRight: 8,
  },
  html: { flex: 1 },
});
