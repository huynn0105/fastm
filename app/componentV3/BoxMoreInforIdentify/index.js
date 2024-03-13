import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styles, { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import AppText from '../AppText';
import BaseInput from '../BaseInput';
import CustomTextField from '../CustomTextField';

const BoxMoreInforIdentify = ({ params }) => (
  <View style={_styles.container}>
    <AppText style={styles.commonTitleText}>Thông tin thêm</AppText>
    <View style={_styles.containerBoxIdentify}>
      <BaseInput placeholder="Email" isRequired />
      <BaseInput placeholder="Địa chỉ liên hệ" isRequired />
    </View>
  </View>
);

const _styles = StyleSheet.create({
  container: {
    marginTop: SH(24),
  },
  containerBoxIdentify: {
    backgroundColor: Colors.primary5,
    // padding: SW(16),
    paddingHorizontal: SW(16),
    paddingTop: SH(16),
    borderRadius: 8,
    marginTop: SH(8),
  },
});

export default BoxMoreInforIdentify;
