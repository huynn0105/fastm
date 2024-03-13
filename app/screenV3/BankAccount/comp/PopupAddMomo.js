import React, { useCallback } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import CommonPopup from '../../../componentV3/CommonPopup';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { STATUS_ADD_MOMO } from '../BankAccount.index';
import styles from '../BankAccount.style';
import commonStyle from '../../../constants/styles';

const PopupAddMomo = ({
  onPressAddMomo,
  phoneNumber,
  closePopup,
  status,
  onGoToWallet,
  onPressOpenMomo,
  errorMessageMomo,
}) => {
  const renderStatusView = useCallback(() => {
    switch (status) {
      case STATUS_ADD_MOMO.LOADING: {
        return (
          <View style={styles.backgroundPopup}>
            {/* <View style={{paddingTop}}> */}
            <Image source={ICON_PATH.loadingSpinner} style={styles.loadingIconStyle} />
            <View style={{ marginTop: SH(16) }}>
              <AppText
                style={[styles.headerPopupTextStyle, { color: Colors.gray5, textAlign: 'center' }]}
              >
                Hệ thống đang xử lý, vui lòng không thoát MFast lúc này
              </AppText>
            </View>
            {/* </View> */}
          </View>
        );
      }
      case STATUS_ADD_MOMO.SUCCESS: {
        return (
          <View style={styles.backgroundPopup}>
            <Image source={ICON_PATH.statusSuccess} style={styles.imageStyle} />
            <View style={{ marginTop: SH(16), marginBottom: SH(12) }}>
              <AppText medium style={[styles.headerPopupTextStyle, { color: Colors.success }]}>
                Liên kết với ví MoMo thành công
              </AppText>
            </View>
            <View style={{ marginBottom: SH(20), paddingHorizontal: SW(16) }}>
              <AppText style={[styles.popupTextStyle, { textAlign: 'center' }]}>
                Giờ đây bạn có thể rút tiền từ MFast về ví MoMo bất kỳ lúc nào.
              </AppText>
            </View>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={closePopup}>
                <AppText style={styles.popupTextStyle}>Để sau</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={onGoToWallet}>
                <AppText semiBold style={[styles.popupTextStyle, { color: Colors.primary2 }]}>
                  Rút tiền ngay
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      case STATUS_ADD_MOMO.ERROR: {
        return (
          <View style={styles.backgroundPopup}>
            <Image source={ICON_PATH.statusError} style={styles.imageStyle} />
            <View style={{ marginTop: SH(16), marginBottom: SH(12) }}>
              <AppText medium style={[styles.headerPopupTextStyle, { color: Colors.secondRed }]}>
                Liên kết thất bại
              </AppText>
            </View>
            <View style={{ marginBottom: SH(20), paddingHorizontal: SW(16) }}>
              <AppText style={[styles.popupTextStyle, { textAlign: 'center' }]}>
                {errorMessageMomo}
              </AppText>
              <AppText style={[styles.popupTextStyle, { textAlign: 'center', marginTop: SH(12) }]}>
                Tạo tài khoản MoMo trên MFast để nhận thu nhập lên tới{' '}
                <AppText style={[styles.popupTextStyle, { color: Colors.success }]}>
                  80.000đ
                </AppText>
              </AppText>
            </View>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={closePopup}>
                <AppText style={styles.popupTextStyle}>Để sau</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={onPressOpenMomo}>
                <AppText semiBold style={[styles.popupTextStyle, { color: Colors.primary2 }]}>
                  Tạo tài khoản
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      default: {
        return (
          <View style={styles.backgroundPopup}>
            <Image source={IMAGE_PATH.mfastMomo} style={styles.imageStyle} />
            <View style={{ marginTop: SH(16), marginBottom: SH(12) }}>
              <AppText medium style={styles.headerPopupTextStyle}>
                Liên kết với ví điện tử MoMo
              </AppText>
            </View>
            <View style={{ marginBottom: SH(20), paddingHorizontal: SW(16) }}>
              <AppText style={commonStyle.mediumText}>Để liên kết thành công bạn cần:</AppText>
              <View style={{ marginVertical: SH(8) }}>
                <AppText style={styles.popupTextStyle}>
                  1. Số điện thoại đăng ký tài khoản MFast và MoMo phải là:
                  <AppText semiBold style={[styles.popupTextStyle, { color: Colors.secondRed }]}>
                    {` ${phoneNumber}`}
                  </AppText>
                </AppText>
              </View>
              <AppText style={styles.popupTextStyle}>
                2. Ví điện tử MoMo đã liên kết tài khoản ngân hàng thành công
              </AppText>
            </View>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={closePopup}>
                <AppText style={styles.popupTextStyle}>Để sau</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={onPressAddMomo}>
                <AppText semiBold style={[styles.popupTextStyle, { color: Colors.primary2 }]}>
                  Liên kết ngay
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
  }, [
    status,
    closePopup,
    onGoToWallet,
    errorMessageMomo,
    onPressOpenMomo,
    phoneNumber,
    onPressAddMomo,
  ]);
  return (
    // <CommonPopup isVisible={isVisible}>
    renderStatusView()
    // </CommonPopup>
  );
};

export default PopupAddMomo;
