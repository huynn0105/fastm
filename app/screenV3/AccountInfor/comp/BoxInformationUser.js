import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import Colors from '../../../theme/Color';

import AppText from '../../../componentV3/AppText';
import { SH } from '../../../constants/styles';

const BoxInformationUser = ({ listData, myUser }) => {
  if (!listData || listData?.length <= 0) return <View />;

  const getValue = useCallback(
    (keyObj) => {
      if (!keyObj || !myUser) return '---';
      let value = myUser?.[keyObj];
      if (!value) return '---';
      if (value === 'male') return 'Nam';
      if (value === 'female') return 'Nữ';
      return value;
    },
    [myUser],
  );

  const renderItem = useCallback(
    (item) => {
      if (item?.keyObj === 'countryOldIdNumber' && !myUser?.[item?.keyObj]) {
        return <View />;
      }
      return (
        <View key={item?.keyObj} style={styles.item}>
          <AppText style={styles.label}>{item?.label}</AppText>
          <AppText style={styles.value}>{getValue(item?.keyObj)}</AppText>
        </View>
      );
    },
    [getValue, myUser],
  );

  return <View style={styles.boxInforContainer}>{listData.map(renderItem)}</View>;
};

export default BoxInformationUser;

const styles = StyleSheet.create({
  boxInforContainer: {
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  item: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  label: {
    opacity: 0.6,
    fontSize: SH(13),
    lineHeight: SH(22),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  value: {
    flex: 1,
    fontSize: SH(13),
    lineHeight: SH(22),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
    marginLeft: 30,
  },
});
