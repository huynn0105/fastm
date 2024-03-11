import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';

const ItemContact = memo((props) => {
  const { item, index, onPress } = props;

  const _onPress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  return (
    <TouchableWithoutFeedback onPress={_onPress}>
      <View style={[styles.container, index === 0 && { marginTop: 0, paddingTop: 0 }]}>
        <Image source={{ uri: item?.icon }} style={styles.icon} />
        <AppText style={styles.title}>{item?.label}</AppText>
        <AppText medium style={[styles.title, { flex: 0, color: Colors.primary2 }]}>
          {item?.rightLabel}
        </AppText>
        {index === 0 ? null : <View style={styles.divider} />}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemContact;

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 12,
    marginTop: 12,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
    flex: 1,
  },
  divider: {
    position: 'absolute',
    height: 1,
    backgroundColor: Colors.neutral5,
    right: 0,
    left: 36,
    top: 0,
  },
});
