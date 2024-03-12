import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import Colors from '../../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';

import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';

const BoxAddBank = ({ onPress, onPressAddMomo, haveMomo, haveBankAccount }) => {
  const onStaticPressAddBank = useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  // const onStaticPressAddMomo = useCallback(() => {
  //   if (onPress) {
  //     onPressAddMomo();
  //   }
  // }, [onPressAddMomo]);

  return (
    <View>
      <View
        style={{
          backgroundColor: Colors.primary5,
          borderRadius: 8,
          marginBottom: SH(12),
        }}
      >
        {!haveMomo && !haveBankAccount ? (
          <View style={{ paddingVertical: SH(16), justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={ICON_PATH.iconNull}
              style={{ width: SW(24), height: SH(24), resizeMode: 'contain' }}
            />
            <AppText
              style={[
                styles.subIndicatorHeader,
                { opacity: 1, color: Colors.gray2, marginTop: SH(8) },
              ]}
            >
              Chưa có tài khoản được thêm
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={{ backgroundColor: '#15157A', borderRadius: 10 }}>
        <TouchableOpacity onPress={onStaticPressAddBank}>
          <View style={styles.headerContainer}>
            <Image source={ICON_PATH.add_bank} style={styles.icAdd} />
            <View style={styles.content}>
              <AppText semiBold style={styles.indicatorHeader}>
                Liên kết tài khoản của bạn
              </AppText>
              <AppText style={styles.subIndicatorHeader}>
                Liên kết tài khoản ngân hàng/thẻ ghi nợ của bạn để rút tiền về từ MFast
              </AppText>
            </View>
            <View style={styles.icNextContainer}>
              <Image source={ICON_PATH.next1} style={styles.icNext} />
            </View>
          </View>
        </TouchableOpacity>
        {/* {!haveMomo ? (
          <TouchableOpacity onPress={onStaticPressAddMomo}>
            <View style={styles.headerContainer}>
              <Image source={ICON_PATH.add_momo} style={styles.icAdd} />
              <View style={styles.content}>
                <AppText semiBold style={styles.indicatorHeader}>
                  Liên kết ví điện tử MoMo
                </AppText>
                <AppText style={styles.subIndicatorHeader}>
                  Liên kết với ví MoMo của bạn để rút tiền về từ MFast
                </AppText>
              </View>
              <View style={styles.icNextContainer}>
                <Image source={ICON_PATH.next1} style={styles.icNext} />
              </View>
            </View>
          </TouchableOpacity>
        ) : null} */}
      </View>
    </View>
  );
};

export default BoxAddBank;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  icAdd: {
    width: SW(32),
    height: SH(32),
    resizeMode: 'contain',
  },
  icNext: {
    width: 20,
    height: 20,
  },
  icNextContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorHeader: {
    fontSize: SH(14),
    lineHeight: SH(20),
    letterSpacing: 0,
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
  bgImageHeader: {
    width: SCREEN_WIDTH - 32,
    borderRadius: 8,
  },
});
