import React, { memo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const PopupCancelInvitation = memo(({ isShow, onConfirm, onCancel }) => {
  return (
    <Modal
      isVisible={isShow}
      style={{
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: SW(343),
          alignItems: 'center',
          backgroundColor: Colors.primary5,
          borderRadius: SW(16),
          overflow: 'hidden',
        }}
      >
        <Image
          source={ICON_PATH.iconBell2}
          style={{ marginTop: SH(24), width: SH(56), height: SH(56) }}
        />
        <AppText
          style={{
            marginTop: SH(24),
            fontSize: SH(16),
            lineHeight: SH(22),
            textAlign: 'center',
            color: Colors.gray1,
          }}
        >
          {`Xác nhận huỷ lời mời kết bạn đối với\n`}
          <AppText semiBold style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.gray1 }}>
            iamptvinh
          </AppText>
        </AppText>
        <View
          style={{
            width: '100%',
            height: SH(50),
            backgroundColor: Colors.neutral6,
            flexDirection: 'row',
            marginTop: SH(24),
          }}
        >
          <TouchableOpacity
            onPress={onConfirm}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <AppText
              medium
              style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.secondRed }}
            >
              Huỷ lời mời
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancel}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <AppText
              semiBold
              style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.action }}
            >
              Quay lại
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

export default PopupCancelInvitation;

const styles = StyleSheet.create({});
