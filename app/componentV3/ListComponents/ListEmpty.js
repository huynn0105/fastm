import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import AppText from '../AppText';
import Colors from '../../theme/Color';

const ListEmpty = memo((props) => {
  const { title, isMascot, style } = props;
  return (
    <View style={[styles.container].concat(style)}>
      <Image
        style={isMascot ? styles.mascot : styles.icon}
        source={isMascot ? IMAGE_PATH.mascotSleep : ICON_PATH.block}
      />
      {title ? <AppText style={styles.title}>{title}</AppText> : null}
    </View>
  );
});

export default ListEmpty;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    marginVertical: 12,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    textAlign: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
  },
});
