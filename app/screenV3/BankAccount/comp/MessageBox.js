import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';

import { STATE } from '../Tax/Tax.contants';

import { ICON_PATH } from '../../../assets/path';

const MessageBox = ({ state, message }) => {
  const getDesc = useCallback(() => {
    return message || '';
  }, [state]);

  const getStatusLabel = useCallback(() => {
    return state === STATE.PENDING ? 'Chờ duyệt' : 'Thất bại';
  }, [state]);

  const getIconSource = useCallback(() => {
    return state === STATE.PENDING ? ICON_PATH.pending : ICON_PATH.failure;
  }, [state]);
  if (state === 'INIT') return <View />;
  return (
    <View style={state === STATE.PENDING ? styles.pending : styles.failure}>
      <View style={styles.row}>
        <AppText style={styles.label}>Kết quả duyệt MST cá nhân</AppText>
        <View style={styles.row}>
          <Image source={getIconSource()} style={styles.ic} />
          <AppText
            style={[
              styles.status,
              state === STATE.PENDING ? styles.colorPending : styles.colorFailure,
            ]}
          >
            {getStatusLabel()}
          </AppText>
        </View>
      </View>
      <AppText
        style={[styles.desc, state === STATE.PENDING ? styles.colorPending : styles.colorFailure]}
      >
        {getDesc()}
      </AppText>
    </View>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  success: {
    borderRadius: 6,
    backgroundColor: '#d3ffe4',
    padding: 12,
    marginBottom: 24,
  },
  pending: {
    borderRadius: 6,
    backgroundColor: '#ffeee0',
    padding: 12,
    marginBottom: 24,
  },
  failure: {
    borderRadius: 6,
    backgroundColor: '#ffe1e5',
    padding: 12,
    marginBottom: 24,
  },
  colorFailure: {
    color: Colors.accent3,
  },
  colorSuccess: {
    color: Colors.accent1,
  },
  colorPending: {
    color: Colors.accent2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    opacity: 0.6,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.accent1,
  },
  desc: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent1,
    marginTop: 11,
  },
  ic: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
});
