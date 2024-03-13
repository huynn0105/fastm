import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../AppText';
import Colors from '../../theme/Color';

const ListLoading = memo((props) => {
  const { style, title, titleStyle } = props;
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator color={Colors.gray5} />
      {title ? <AppText style={[styles.title, titleStyle]}>{title}</AppText> : null}
    </View>
  );
});

export default ListLoading;

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 12 },
  title: {
    marginVertical: 12,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    textAlign: 'center',
  },
});
