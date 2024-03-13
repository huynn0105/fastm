import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { TouchableWithoutFeedback } from 'react-native';

const ButtonOrderStatus = memo((props) => {
  const { item, onPress } = props;

  const _onPress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  return (
    <TouchableWithoutFeedback onPress={_onPress}>
      <View style={styles.container}>
        <Image source={{ uri: item?.icon }} style={styles.icon} />
        <AppText style={styles.title}>
          {item?.stageName}
          {'\n'}({item?.count})
        </AppText>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ButtonOrderStatus;

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    textAlign: 'center',
    marginTop: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
