import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';

const ItemSectionHeader = memo((props) => {
  const { item, onPress } = props;

  const onPressItem = useCallback(() => {
    onPress?.(item?.action);
  }, [item, onPress]);

  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View style={styles?.container}>
        <View>
          <Image source={{ uri: item?.icon, cache: 'force-cache' }} style={styles.icon} />
          {item?.isPending ? <Image source={ICON_PATH.clock3} style={styles.iconPending} /> : null}
        </View>
        <AppText style={styles?.text}>{item?.label}</AppText>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemSectionHeader;

const styles = StyleSheet.create({
  container: {
    width: '25%',
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    color: Colors.gray1,
  },
  iconPending: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    position: 'absolute',
    bottom: 0,
    right: -6,
    borderWidth: 1,
    borderColor: Colors.primary5,
  },
});
