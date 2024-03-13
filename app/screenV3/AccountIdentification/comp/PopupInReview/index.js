import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import AppText from '../../../../componentV3/AppText';
import Colors from '../../../../theme/Color';

import { ICON_PATH } from '../../../../assets/path';

const PopupInReview = ({ isVisible, onGobackMain }) => {
  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.wrapper}>
            <View style={styles.container}>
              <View style={styles.body}>
                <Image source={ICON_PATH.success} style={styles.ic} />
                <AppText style={styles.title}>
                  Yêu cầu cập nhật thông tin CMND của bạn đang được xử lý.
                </AppText>
                <AppText style={styles.desc}>
                  Hệ thống sẽ thông báo ngay khi thông tin được cập nhật chính xác để bạn tiếp tục
                  kí hợp đồng dịch vụ. Xin cảm ơn!
                </AppText>
              </View>
              <TouchableOpacity onPress={onGobackMain}>
                <View style={styles.bottom}>
                  <AppText style={styles.labelBtn}>Về trang cá nhân</AppText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PopupInReview;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  safe: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: Colors.neutral5,
    borderRadius: 10,
  },
  body: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ic: {
    width: 64,
    height: 64,
    marginTop: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
  },
  desc: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    marginTop: 12,
  },
  bottom: {
    width: '100%',
    height: 56,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBtn: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
  },
});
