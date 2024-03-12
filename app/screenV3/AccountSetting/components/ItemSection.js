import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';
import { useCallback } from 'react';
import Colors from '../../../theme/Color';

const ItemSection = memo((props) => {
  const { item, index, onPress } = props;

  const onPressItem = useCallback(() => {
    onPress?.(item?.action);
  }, [item, onPress]);

  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View style={styles.container}>
        <Image source={{ uri: item?.icon, cache: 'force-cache' }} style={styles.icon} />
        <View style={[styles.titleContainer, !index && { borderTopColor: Colors.transparent }]}>
          <AppText style={styles.text}>{item?.label}</AppText>
          {item?.rightLabel ? (
            <AppText medium style={styles.textRight}>
              {item?.rightLabel}
            </AppText>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral5,
    height: '100%',
    marginHorizontal: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
    fontWeight: '400',
  },
  textRight: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primary2,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
