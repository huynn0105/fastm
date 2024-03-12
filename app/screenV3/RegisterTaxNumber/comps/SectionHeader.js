import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { SH } from '../../../constants/styles';

const SectionHeader = ({ preTitle, boldTitle }) => {
  return (
    <View style={styles.headerWrapper}>
      <AppText style={styles.title}>
        {preTitle}
        <AppText style={styles.boldTitle}>{boldTitle}</AppText>
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 14,
    backgroundColor: Colors.neutral5,
  },
  title: {
    fontSize: SH(14),
    lineHeight: SH(20),
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary1,
    textTransform: 'uppercase',
  },
  boldTitle: {
    fontWeight: 'bold',
  },
});

export default SectionHeader;
