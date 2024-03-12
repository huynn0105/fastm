import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Colors from '../../../theme/Color';

import { ICON_PATH } from '../../../assets/path';

import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';

const SectionHeaderAccount = ({ title, note }) => {
  return (
    <View style={styles.headerWrapper}>
      <AppText style={styles.title}>{title}</AppText>
      {note ? (
        <Tooltip
          skipAndroidStatusBar={true}
          pointerColor="#fff"
          overlayColor="rgba(0, 0, 0, 0.4)"
          backgroundColor="#fff"
          containerStyle={{ flex: 1, height: 'auto' }}
          width={200}
          popover={<AppText>{note}</AppText>}
        >
          <View style={styles.noteContainer}>
            <AppText style={styles.note}>Chú thích</AppText>
            <Image source={ICON_PATH.note} />
          </View>
        </Tooltip>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SW(16),
    paddingTop: SH(18),
    paddingBottom: SH(10),
    backgroundColor: Colors.actionBackground,
  },
  title: {
    fontSize: SH(14),
    lineHeight: SH(25),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    textTransform: 'uppercase',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    opacity: 0.6,
    fontSize: SH(14),
    lineHeight: SH(20),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
    marginRight: SW(6),
  },
});

export default SectionHeaderAccount;
