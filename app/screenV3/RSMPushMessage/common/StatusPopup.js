import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { styles } from '../RSMPushMessage.style';
import { TYPE_MODAL } from '../RSMPushMessage.View';

const StatusPopup = forwardRef((params, ref) => {
  const { type, onGoToListCTV, onResendMessage, goToHistory } = params;
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  useImperativeHandle(ref, () => ({
    openModal() {
      setIsVisible(true);
    },
    closeModal() {
      setIsVisible(false);
    },
  }));

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const goToHistoryTab = useCallback(() => {
    toggleModal();
    goToHistory();
  }, [isVisible]);
  const renderContent = useCallback(() => {
    switch (type) {
      case TYPE_MODAL.LOADING: {
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
      case TYPE_MODAL.SUCCESS: {
        return (
          <View style={styles.backgroundPopup}>
            <Image source={ICON_PATH.statusSuccess} style={styles.imageStyle} />
            <View style={{ marginTop: SH(16), marginBottom: SH(12) }}>
              <AppText medium style={[styles.headerPopupTextStyle, { color: Colors.success }]}>
                Gửi thông báo thành công
              </AppText>
            </View>
            <View style={{ marginBottom: SH(20), paddingHorizontal: SW(16) }}>
              <AppText style={[styles.popupTextStyle, { textAlign: 'center' }]}>
                MFast sẽ gửi thông báo lần lượt đến CTV trong danh sách. Quá trình này sẽ mất vài
                phút để hoàn thành.
              </AppText>
            </View>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={goToHistoryTab}>
                <AppText style={styles.popupTextStyle}>Lịch sử gửi</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={onGoToListCTV}>
                <AppText semiBold style={[styles.popupTextStyle, { color: Colors.primary2 }]}>
                  Về trang CTV
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      case TYPE_MODAL.ERROR: {
        return (
          <View style={styles.backgroundPopup}>
            <Image source={ICON_PATH.statusError} style={styles.imageStyle} />
            <View style={{ marginTop: SH(16), marginBottom: SH(12) }}>
              <AppText medium style={[styles.headerPopupTextStyle, { color: Colors.secondRed }]}>
                Gửi thông báo thất bại
              </AppText>
            </View>
            <View style={{ marginBottom: SH(20), paddingHorizontal: SW(16) }}>
              {/* <AppText style={[styles.popupTextStyle, { textAlign: 'center' }]}>
                Gửi thông báo thất bại
              </AppText> */}
              <AppText style={[styles.popupTextStyle, { textAlign: 'center', marginTop: SH(12) }]}>
                Đã có lỗi xảy ra, vui lòng kiểm tra và thử lại sau
              </AppText>
            </View>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
                <AppText style={styles.popupTextStyle}>Để sau</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={onResendMessage}>
                <AppText semiBold style={[styles.popupTextStyle, { color: Colors.primary2 }]}>
                  Gửi lại thông báo
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      case TYPE_MODAL.LIMIT_SEND: {
        return (
          <View style={styles.backgroundPopup}>
            <Image source={ICON_PATH.statusError} style={styles.imageStyle} />
            <View style={{ marginTop: SH(16), marginBottom: SH(12) }}>
              <AppText medium style={[styles.headerPopupTextStyle, { color: Colors.secondRed }]}>
                Gửi thông báo thất bại
              </AppText>
            </View>
            <View style={{ marginBottom: SH(20), paddingHorizontal: SW(16) }}>
              {/* <AppText style={[styles.popupTextStyle, { textAlign: 'center' }]}>
                Gửi thông báo thất bại
              </AppText> */}
              <AppText style={[styles.popupTextStyle, { textAlign: 'center', marginTop: SH(12) }]}>
                Bạn đã gửi thông báo quá số lượng cho phép trong ngày. Vui lòng thử lại vào ngày mai
              </AppText>
            </View>
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
                <AppText style={styles.popupTextStyle}>Đóng</AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      default: {
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
    }
  }, [type]);
  return (
    <Modal
      ref={(ref) => {
        modalRef.current = ref;
      }}
      isVisible={isVisible}
    >
      {renderContent()}
    </Modal>
  );
});

export default StatusPopup;
