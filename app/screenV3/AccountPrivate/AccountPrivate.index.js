import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LIST_PRIVATE } from './AccountPrivate.contants';
import AppText from '../../componentV3/AppText';
import { TouchableOpacity } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import styles from './AccountPrivate.styles';
import useOnPress from '../../hooks/useOnPress';
import ModalDeleteAccount from '../../componentV3/ModalDeleteAccount/ModalDeleteAccount';
import DeleteAccountCountDown from '../../componentV3/DeleteAccountCountDown/DeleteAccountCountDown';

const AccountPrivate = ({ navigation }) => {
  const modalDeleteAccountRef = useRef();

  const onPressItem = useCallback((action) => {
    if (action) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useOnPress({ action });
    }
  }, []);

  const renderItemPrivate = useCallback(
    (item) => {
      return (
        <TouchableOpacity onPress={() => onPressItem(item?.action)}>
          <View style={styles.wrapperItem} key={item?.label}>
            <Image
              source={item?.iconLeft}
              style={[styles.icLeft, item.tintColor && { tintColor: item.tintColor }]}
            />
            <View style={styles.content}>
              <AppText style={styles.label}>{item?.label}</AppText>
              <AppText style={styles.desc}>{item?.desc}</AppText>
            </View>
            <View style={styles.icRightContainer}>
              <Image source={ICON_PATH.arrow_right} style={styles.icRight} />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onPressItem],
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        {LIST_PRIVATE.map(renderItemPrivate)}
        <View style={{ alignItems: 'center' }}>
          <DeleteAccountCountDown
            type={'SETTING_PAGE'}
            onPressDelete={() => {
              modalDeleteAccountRef?.current?.open();
            }}
          />
        </View>
      </ScrollView>
      <ModalDeleteAccount
        ref={modalDeleteAccountRef}
        onFinish={() => {
          navigation?.goBack();
        }}
      />
    </View>
  );
};
export default AccountPrivate;
