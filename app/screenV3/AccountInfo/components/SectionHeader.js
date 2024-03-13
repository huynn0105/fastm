import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';

const SectionHeader = memo((props) => {
  const { title, note } = props;
  if (!title) return null;
  return (
    <AppText style={styles.title} semiBold>
      {title}
    </AppText>
  );
});

export default SectionHeader;

const styles = StyleSheet.create({
  title: { fontSize: 14, lineHeight: 20, color: Colors.gray5 },
});
