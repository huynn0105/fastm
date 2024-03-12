import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import Colors from '../../../theme/Color';

import { IMAGE_PATH } from '../../../assets/path';
import ButtonText from '../../../common/ButtonText';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';

const Item = ({ icon, boldText, normalText, isLastItem }) => {
  return (
    <View style={styles.itemContainer}>
      <View>
        <Image source={icon} style={styles.ic} />
        {!isLastItem ? (
          <View
            style={{
              position: 'absolute',
              left: SW(17),
              height: SH(20),
              width: 2,
              top: SH(36),
              backgroundColor: Colors.primary5,
              zIndex: 0,
            }}
          />
        ) : null}
      </View>
      <AppText style={styles.normalTxt}>
        <AppText
          bold
          style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.primary2 }}
        >{`${boldText} `}</AppText>
        {normalText}
      </AppText>
    </View>
  );
};

const IndicatorBoxVerify = ({ onPress }) => {
  const onStaticPress = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: Colors.primary5,
        marginBottom: 24,
        marginTop: 8,
      }}
    >
      <Image source={IMAGE_PATH.eKYC} />
      <AppText
        bold
        style={{
          textAlign: 'center',
          fontSize: 14,
          lineHeight: 20,
          color: Colors.sixRed,
          marginTop: 16,
        }}
      >
        Bạn chưa định danh tài khoản.
      </AppText>
      <AppText
        style={{
          textAlign: 'center',
          fontSize: 13,
          lineHeight: 18,
          color: '#3c3c53',
          marginTop: 8,
        }}
      >
        Thông tin định danh giúp bảo vệ tài khoản, rút tiền và được mở các tính năng, nghiệp vụ bán
        hàng nâng cao
      </AppText>
      <ButtonText onPress={onStaticPress} title="Định danh ngay" top={16} bottom={4} height={40} />
    </View>
  );
};

export default IndicatorBoxVerify;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SH(16),
  },
  ic: {
    width: SW(36),
    height: SH(36),
    resizeMode: 'contain',
  },
  normalTxt: {
    flex: 1,
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,
    marginLeft: 16,
  },
});
