import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '../../theme/Color';

import AppText from '../../componentV3/AppText';
import { SH } from '../../constants/styles';

const ItemBox = ({ label, content, vertical }) => {
  return (
    <View
      style={[
        styles.itemBoxContainer,
        vertical && { flexDirection: 'column', alignItems: 'flex-start' },
      ]}
    >
      <AppText style={styles.itemLabel}>{label || '---'}</AppText>
      <AppText style={styles.itemContent} semiBold>
        {content || '---'}
      </AppText>
    </View>
  );
};
export default ItemBox;

const styles = StyleSheet.create({
  itemBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    flex: 1,
  },
  itemLabel: {
    color: Colors.gray5,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  itemContent: {
    flex: 2,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primary4,
  },
});
