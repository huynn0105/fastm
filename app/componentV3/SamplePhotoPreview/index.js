import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, Keyboard } from 'react-native';

import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';
import AppText from '../AppText';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';

const SamplePhotoPreview = ({ isVisible, onCloseAvatarSamplePress, typeSample = 'CMND' }) => {
  const onPressClose = useCallback(() => {
    if (onCloseAvatarSamplePress) {
      onCloseAvatarSamplePress();
    }
  }, [onCloseAvatarSamplePress]);

  const renderDesc = useCallback(() => {
    if (typeSample === 'CMND') {
      return (
        <AppText style={styles.indicatorDesc}>
          (Hình bắt buộc phải <AppText style={styles.txtWraning}> hiển thị đầy đủ 4 góc</AppText> ,
          rõ nét và không bị nhoè)
        </AppText>
      );
    }
    if (typeSample === 'TAX') {
      return (
        <AppText style={styles.indicatorDesc}>
          (Tải mẫu và điền thông tin như hình dưới đây)
        </AppText>
      );
    }
    if (typeSample === 'CERT') {
      return <View style={{ marginBottom: SH(16) }} />;
    }
    return (
      <AppText style={styles.indicatorDesc}>
        (Hình chụp phải <AppText style={styles.txtBlod}>rõ gương mặt và không bị nhòe</AppText>,{' '}
        <AppText style={styles.txtWraning}>KHÔNG ĐƯỢC đeo kính, đội mũ</AppText> khi chụp. Hình phải
        chụp bằng camera thường,{' '}
        <AppText style={styles.txtWraning}>không dùng App chụp ảnh</AppText>)
      </AppText>
    );
  }, [typeSample]);

  const renderTitle = useCallback(() => {
    if (typeSample === 'CMND') {
      return (
        <AppText bold style={styles.indicatorLabel}>
          Mẫu chụp 2 mặt CMND
        </AppText>
      );
    }
    if (typeSample === 'TAX') {
      return (
        <AppText bold style={styles.indicatorLabel}>
          Mẫu chụp bản cam kết
        </AppText>
      );
    }
    if (typeSample === 'CERT') {
      return (
        <AppText bold style={styles.indicatorLabel}>
          Mẫu chụp bản chứng chỉ đại lý bảo hiểm
        </AppText>
      );
    }
    return (
      <AppText bold style={styles.indicatorLabel}>
        Mẫu chụp chân dung
      </AppText>
    );
  }, [typeSample]);

  const renderPhotoTemp = useCallback(() => {
    if (typeSample === 'CMND') {
      return <Image style={styles.photoCmnd} source={IMAGE_PATH.sample_cmnd} />;
    }
    if (typeSample === 'TAX') {
      return <Image style={styles.photoTax} source={IMAGE_PATH.sample_tax} />;
    }
    if (typeSample === 'CERT') {
      return <Image style={styles.photoCert} source={IMAGE_PATH.sampleInsCert} />;
    }
    return <Image style={styles.photo} source={IMAGE_PATH.sample_selfie} />;
  }, [typeSample]);

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalWrapper}>
        <TouchableOpacity style={styles.modalContainer} onPress={onPressClose}>
          {renderTitle()}
          {renderDesc()}
          {renderPhotoTemp()}
          <Image style={styles.ic} source={ICON_PATH.close2} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SamplePhotoPreview;

const styles = StyleSheet.create({
  indicatorLabel: {
    fontSize: SH(14),
    lineHeight: SH(20),
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary5,
    marginBottom: 10,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  photo: {
    // flex: 1,
    width: SW(343),
    height: SH(265),
  },
  photoTax: {
    width: SCREEN_WIDTH - 32,
    aspectRatio: 343 / 389,
  },
  photoCmnd: {
    // flex: 1,
    width: SCREEN_WIDTH - 32,
    aspectRatio: 343 / 494,
  },
  photoCert: {
    width: SCREEN_WIDTH - SW(10),
    height: SH(240),
    resizeMode: 'contain',
  },
  ic: {
    width: 36,
    height: 36,
    marginTop: 42,
    marginBottom: 16,
  },
  indicatorDesc: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary5,
    marginBottom: 40,
    marginHorizontal: 10,
  },
  txtBlod: {
    fontWeight: 'bold',
  },
  txtWraning: {
    fontWeight: 'bold',
    color: 'rgb(255, 82, 82)',
  },
});
