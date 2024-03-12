import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ICON_PATH } from '../../../assets/path';

const BackgroundHeader = memo((props) => {
  const { insetTop } = props;

  const linerContainerStyle = useMemo(() => [{ height: insetTop + 56 }], [insetTop]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgb(31, 114, 255)', 'rgb(40, 34, 200)']}
        style={linerContainerStyle}
      />
      <Image source={ICON_PATH.mfastLogoName} style={styles.brandLogoName} />
    </View>
  );
});

export default BackgroundHeader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },

  brandLogoName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 86,
    height: 24,
  },
});
