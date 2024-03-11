import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useMemo } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';

const IconUpDown = memo((props) => {
  const { up, value, size = 16, style } = props;
  const color = useMemo(() => (up ? Colors.thirdGreen : Colors.sixRed), [up]);
  const rotate = useMemo(
    () => ({
      transform: [
        {
          rotate: up ? '180deg' : '0deg',
        },
      ],
    }),
    [up],
  );

  return (
    <View style={[styles.container, style]}>
      <Image
        source={ICON_PATH.downArrow}
        style={[styles.icon, rotate, { tintColor: color }, { width: size, height: size }]}
      />
      {value ? (
        <AppText semiBold style={[styles.value, { color }]}>
          {value}%
        </AppText>
      ) : null}
    </View>
  );
});

export default IconUpDown;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 13,
    lineHeight: 18,
  },
  icon: {
    resizeMode: 'contain',
    marginRight: 2,
  },
});
