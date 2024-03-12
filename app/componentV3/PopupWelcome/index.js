import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { isIphoneX } from 'react-native-iphone-x-helper';
import isIphone12 from '../../utils/iphone12Helper';
import Colors from '../../theme/Color';
import AppText from '../AppText';


import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { SH } from '../../constants/styles';

const offset = isIphone12() || isIphoneX() ? SH(30) : SH(16);


const PopupWelcome = ({ onClose, isVisible, contentUserGuildHome, onNextStep }) => {

  const onStaticClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const onStaticBackdropPress = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);


  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        onBackdropPress={onStaticBackdropPress}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.wrapper}>
            <View style={styles.contentWrapper}>
              <Image 
                source={IMAGE_PATH.bannerWelcome}
                style={{
                  width: '60%',
                  top: -40,
                  position: 'absolute',
                }}
                resizeMode="contain"
              />
              <View style={{ height: 110 }} />
              <View>
                <AppText
                  style={styles.title}
                >
                  Chào mừng đến với MFast
                </AppText>
                <AppText
                  semiBold
                  style={styles.desc}
                >
                  Không làm mất thời gian vủa bạn, hãy cùng MFast
                  <AppText semiBold style={styles.descHighlight}>
                    {` kiếm ngay 235.000đ đầu tiên `}
                  </AppText>
                  nào
                </AppText>
              </View>
            </View>
            <View style={styles.footerGroup}>
              <View style={styles.bottomLeft}>
                <TouchableOpacity onPress={onStaticClose} style={styles.bottomLeft}>
                  <AppText medium style={styles.labelLeftBtn}>Đóng</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.bottomRight}>
                <TouchableOpacity onPress={() => {}} style={styles.bottomRight}>
                  <AppText SemiBold style={styles.labelBtn}>Kiếm ngay 235.000đ</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PopupWelcome;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  safe: {
    flex: 1,
    marginTop: offset
  },
  wrapper: {
    flex: 1,
    marginTop: 120,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  contentWrapper: {
    padding: SH(16),
    paddingTop: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 16,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,

  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 24,
  },
  desc: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#0a0a28'
  },
  descHighlight: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#00cd95'
  },
  footerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomLeft: {
    flex: 1,
    height: 56,
    width: '100%',
    backgroundColor: '#e6ebff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    flex: 1,
    width: '100%',
    height: 56,
    backgroundColor: '#e6ebff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 16,
  },
  labelLeftBtn: {
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary3,
  },
  labelBtn: {
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
  },
});
