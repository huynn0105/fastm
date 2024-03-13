import React, {useCallback, useState} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native'

import Modal from 'react-native-modal';


import { isIphoneX } from 'react-native-iphone-x-helper';
import isIphone12 from '../../utils/iphone12Helper';
import { SCREEN_WIDTH } from '../../utils/Utils';
import colors from '../../theme/Color';
import {IMAGE_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const CONTAINER_WIDTH = SCREEN_WIDTH / 3.5;
export const CONTAINER_HEIGHT = SCREEN_WIDTH / 5.06;
const xStep1 = (isIphone12() || isIphoneX() ? 30 : 16) + 72;

const xStep2 = xStep1 + 190 + (Platform.OS === 'ios' ? (isIphone12() || isIphoneX())? 10 : 5 : 0)

const yStep3 = 22 + CONTAINER_WIDTH;


const ModalStepGuild = ({onClose, isVisible}) => {
    const [step, setStep] = useState(1);

    const onStaticBackdropPress = useCallback(
        () => {
            if(step < 3) {
                setStep(step + 1);
                return;
            }
            if(onClose) {
                onClose();
            }
        },
        [onClose, step],
    )

    const onStaticClose = useCallback(() => {
        if(onClose) {
            onClose();
        }
    },
    [onClose],
    );

    return (
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        onBackdropPress={onStaticBackdropPress}
      >
        <View style={{ flex: 1 }}>
          {step === 3 && (
            <View style={{ top: xStep1, left: 16 }}>
              <Image source={IMAGE_PATH.guide3} />
              <AppText style={styles.txtTitle}>
                Nơi cập nhật tiền thu nhập của bạn từng phút.
              </AppText>
            </View>
          )}
          {step === 2 && (
            <View style={{ top: xStep2, left: 14 }}>
              <Image source={IMAGE_PATH.guide2} style={styles.imgStep2} />
              <AppText style={styles.txtTitle}>
                Mua bảo hiểm cho khách hàng và nhận thu nhập tại đây.
              </AppText>
            </View>
          )}
          {step === 1 && (
            <View style={{ top: xStep2, left: yStep3 }}>
              <Image source={IMAGE_PATH.guide1} style={styles.imgStep2} />
              <AppText
                style={[
                  styles.txtTitle,
                  { left: -40, textAlign: 'center', width: SCREEN_WIDTH / 2 },
                ]}
              >
                Giới thiệu khách hàng có nhu cầu vay vốn tại đây.
              </AppText>
            </View>
          )}
        </View>
        <TouchableWithoutFeedback onPress={onStaticBackdropPress}>
          <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }} />
        </TouchableWithoutFeedback>
        <View style={styles.skipContainer}>
          <AppText style={styles.guildTxt}>Nhấn vào màn hình để xem tiếp hướng dẫn</AppText>
          <TouchableOpacity onPress={onStaticClose}>
            <View>
              <Image source={IMAGE_PATH.skipBtn} />
              <AppText style={styles.textSkip}>Bỏ qua</AppText>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
}

export default ModalStepGuild

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        padding: 0
    },
    txtTitle: {
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0,
        color: colors.primary5,
        marginTop: 14,
        width: SCREEN_WIDTH * 0.8,
    },
    imgStep2: {
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT
    },
    skipContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
    },
    guildTxt: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: colors.primary5,
        marginBottom: 40,   
    },
    textSkip: {
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
        color: colors.primary5,
        marginTop: 8,
    }
})
