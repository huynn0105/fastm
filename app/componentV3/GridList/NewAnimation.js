import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { ICON_PATH } from '../../assets/path';
import AnimatedLottieView from 'lottie-react-native';

const NewAnimation = memo(() => {
  return (
    <View style={styles.container}>
      <AnimatedLottieView autoPlay loop source={ICON_PATH.newAnimation} style={styles.icon} />
    </View>
  );
});

export default NewAnimation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -2,
    left: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});
