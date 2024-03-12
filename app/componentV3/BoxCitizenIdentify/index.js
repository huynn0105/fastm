import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '../../theme/Color';

import ItemBox from './ItemBox';

import AppText from '../../componentV3/AppText';

const BoxCitizenIdentify = ({
  gender,
  countryIdDateOfBirth,
  countryIdNumber,
  countryIdName,
  countryIdIssuedDate,
  countryIdIssuedBy,
  isShowWraning,
  styleContainer,
}) => {
  return (
    <View>
      <View style={[styles.formContainer, styleContainer]}>
        <ItemBox label="Họ tên:" content={countryIdName} />
        {!!gender && <ItemBox label="Giới tính:" content={gender} />}
        {!!countryIdDateOfBirth && <ItemBox label="Ngày sinh:" content={countryIdDateOfBirth} />}
        <ItemBox label="Số CMND/ CCCD:" content={countryIdNumber} />
        {!!countryIdIssuedDate && <ItemBox label="Ngày cấp:" content={countryIdIssuedDate} />}
        {!!countryIdIssuedBy && <ItemBox label="Nơi cấp:" content={countryIdIssuedBy} />}
        {isShowWraning && (
          <>
            <View style={styles.dividers} />
            <View style={styles.waringContainer}>
              <AppText style={styles.labelWarning}>Lưu ý:</AppText>
              <AppText style={styles.descWraning}>
                Tài khoản ngân hàng phải được đăng ký với thông tin chủ tài khoản trên.
              </AppText>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default BoxCitizenIdentify;

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  dividers: {
    height: 1,
    width: '100%',
    marginBottom: 12,
    marginTop: 4,
    backgroundColor: Colors.neutral4,
  },
  waringContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  labelWarning: {
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
  },
  descWraning: {
    flex: 1,
    opacity: 0.8,
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.primary4,
    marginLeft: 6,
  },
  divider: {},
});
