import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../theme/Color';
import { ICON_PATH } from '../../assets/path';

const StarAnimation = memo(() => {
  return (
    <View style={styles.container}>
      <Image source={ICON_PATH.starGif} style={styles.icon} />
    </View>
  );
});

export default StarAnimation;

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary5,
    position: 'absolute',
    top: -4,
    right: -4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
