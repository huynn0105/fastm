import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import { SH } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { useSelector } from 'react-redux';
import { TAB_TYPE } from '../Customer.constants';
import FastImage from 'react-native-fast-image';

const ButtonCountCustomerWaiting = memo((props) => {
  const { isHideWhenNodata, style, navigation, onPress, ...rest } = props;
  const countCustomer = useSelector(
    (state) => state?.customerReducer?.totalNum[TAB_TYPE.PAGE] || 0,
  );

  if (isHideWhenNodata && (!countCustomer || Number(countCustomer) <= 0)) {
    return null;
  }

  return (
    <TouchableOpacity
      {...rest}
      style={[styles.container, style]}
      onPress={() => {
        if (onPress) {
          onPress?.(countCustomer > 0);
        } else {
          if (countCustomer > 0) {
            navigation.navigate('CustomerDetail', {
              group: TAB_TYPE.PAGE,
              title: 'Khách hàng chưa phân loại',
            });
          } else {
            navigation?.navigate('AdLinkScreen');
          }
        }
      }}
    >
      <FastImage source={ICON_PATH.customer} resizeMode={'contain'} style={styles.image} />
      {countCustomer > 0 ? (
        <AppText style={styles.text}>
          Có
          <AppText semiBold style={styles.number}>
            {` ${countCustomer} `}
          </AppText>
          khách hàng tới từ các liên kết tiếp thị đang chờ bạn đánh giá, phân loại
        </AppText>
      ) : (
        <AppText style={styles.text}>
          Sử dụng công cụ liên kết tiếp thị để tiếp cận không giới hạn khách hàng tiềm năng
        </AppText>
      )}
      <Image source={ICON_PATH.arrow_right} style={styles.arrowRight} />
      <Image source={ICON_PATH.mfastWhite} style={styles.logo} />
    </TouchableOpacity>
  );
});

export default ButtonCountCustomerWaiting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue3,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255, 0.7)',
    flex: 1,
  },
  number: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 1,
    color: Colors.thirdGreen,
  },
  image: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 8,
  },
  arrowRight: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.primary5,
    opacity: 0.6,
    marginLeft: 30,
  },
  logo: {
    position: 'absolute',
    opacity: 0.1,
    width: 32,
    height: 32,
    right: 32,
  },
});
