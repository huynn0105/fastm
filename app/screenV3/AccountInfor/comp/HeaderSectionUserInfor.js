import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Colors from '../../../theme/Color';

import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { SH, SW } from '../../../constants/styles';

const HeaderSectionUserInfor = ({ label, onPressEdit, id }) => {
  const _onPressEdit = useCallback(() => {
    if (onPressEdit && id) {
      onPressEdit(id);
    }
  }, [onPressEdit, id]);

  return (
    <View style={styles.headerContainer}>
      <AppText semiBold style={styles.label}>
        {label || '---'}
      </AppText>
      {onPressEdit ? (
        <TouchableOpacity onPress={_onPressEdit}>
          <View style={styles.rightContainer}>
            <Image source={ICON_PATH.edit1} style={styles.ic} />
          </View>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

export default HeaderSectionUserInfor;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginHorizontal: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ic: {
    width: SW(18),
    height: SH(18),
    resizeMode: 'contain',
  },
  indicatorEdit: {
    fontSize: SH(14),
    lineHeight: SH(18),
    fontWeight: 'normal',
    fontStyle: 'normal',
    // letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary2,
    marginRight: 6,
  },
});
