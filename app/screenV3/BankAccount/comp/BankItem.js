import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Colors from '../../../theme/Color';

import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';

const BankItem = ({
  item,
  bankNumber,
  bankName,
  status,
  message,
  onPressItem,
  isMomo,
  phoneNumber,
  onPressAddBank,
  onPressAddMomo,
  disabled,
  disabledMessage,
  icon,
  isDefault,
}) => {
  const onStaticPress = useCallback(() => {
    if (typeof onPressItem === 'function') {
      onPressItem(item);
    }
  }, [onPressItem, item]);

  const renderBankItem = () => {
    return (
      <TouchableOpacity onPress={onStaticPress} disabled={disabled}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: disabled
                ? Colors.neutral3
                : item?.bank_link
                ? Colors.secondBlue
                : Colors.primary5,
            },
          ]}
        >
          <View style={styles.rowDetail}>
            <View style={styles.containerIconStyle}>
              <Image source={icon ? { uri: icon } : ICON_PATH.add_bank2} style={styles.iconStyle} />
            </View>
            <View style={{ marginLeft: SW(12) }}>
              <AppText
                medium
                style={[
                  styles.bankNameText,
                  disabled && { opacity: 0.6 },
                  item?.bank_link && { color: Colors.primary5 },
                ]}
              >
                {bankName}
              </AppText>
              {item?.bank_link ? (
                <AppText style={[styles.smallTextStyle, { color: Colors.primary5, opacity: 0.6 }]}>
                  Tài khoản {bankName} đã sẵn sàng để liên kết
                </AppText>
              ) : disabled ? (
                disabledMessage ? (
                  <AppText style={styles.smallTextStyle}>{disabledMessage}</AppText>
                ) : null
              ) : (
                <AppText style={styles.smallTextStyle}>
                  Số tài khoản:
                  <AppText semiBold style={[styles.indicatorHeader, { color: Colors.gray1 }]}>
                    {` ${bankNumber}`}
                  </AppText>
                </AppText>
              )}
            </View>
          </View>
          {isDefault ? (
            <View style={styles.detailContainer}>
              <AppText style={styles.smallTextStyle}>{`Ưu tiên`}</AppText>
              <Image
                source={ICON_PATH.tick2}
                style={{ tintColor: Colors.gray5, width: 16, height: 16, marginLeft: 4 }}
              />
            </View>
          ) : null}
          {item?.bank_link ? (
            <View style={styles.detailContainer}>
              <AppText
                style={[styles.smallTextStyle, { color: Colors.primary5 }]}
              >{`Liên kết ngay`}</AppText>
              <Image
                source={ICON_PATH.arrow_right}
                style={{ tintColor: Colors.primary5, width: 16, height: 16, marginLeft: 4 }}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return <View>{renderBankItem()}</View>;
};

export default BankItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    flexDirection: 'row',
    minHeight: SH(68),
    // alignItems: 'center',
  },
  bankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 1,
  },
  rowDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    opacity: 0.69,
    fontSize: SH(14),
    lineHeight: SH(20),
    letterSpacing: 0,
    color: Colors.primary4,
    marginRight: 10,
  },
  desc: {
    flex: 1,
    fontSize: SH(14),
    lineHeight: SH(20),
    letterSpacing: 0,
    color: Colors.primary4,
  },
  errorMess: {
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(20),
    letterSpacing: 0,
    color: Colors.accent3,
  },
  successDesc: {
    fontSize: SH(14),
    lineHeight: SH(20),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary2,
  },
  txtDetail: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: '#404d6f',
  },
  icNext: {
    width: 18,
    height: 18,
  },
  successTxt: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent1,
  },
  failureTxt: {
    fontSize: SH(14),
    lineHeight: SH(20),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
  },
  penddingTxt: {
    fontSize: SH(14),
    lineHeight: SH(20),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent2,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#15157A',
  },
  icAdd: {
    width: SW(32),
    height: SH(32),
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  indicatorHeader: {
    fontSize: SH(14),
    lineHeight: SH(20),
    // letterSpacing: 0,
    color: Colors.primary5,
  },
  subIndicatorHeader: {
    opacity: 0.8,
    fontSize: SH(13),
    lineHeight: SH(18),
    letterSpacing: 0,
    color: Colors.primary5,
    marginTop: SH(4),
  },
  icNextContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: SW(30),
    height: SH(30),
    resizeMode: 'contain',
  },
  containerIconStyle: {
    width: SW(44),
    height: SW(44),
    backgroundColor: Colors.actionBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SW(22),
  },
  detailContainer: {
    position: 'absolute',
    right: SW(12),
    top: SH(12),
    flexDirection: 'row',
  },
  bankNameText: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  smallTextStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
  },
});
