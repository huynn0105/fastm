import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';

import SubmitButton from '../Button/SubmitButton';
import WebviewPopup from './webview';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Svg from 'react-native-svg';
import { Ellipse } from 'react-native-svg';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import ButtonText from '../../common/ButtonText';
import * as Animatable from 'react-native-animatable';
import { SCREEN_WIDTH } from '../../utils/Utils';

const GuildPageSlider = ({ isVisible = true, onCloseModal, onDone }) => {
  const [isVisibleWebview, setIsVisibleWebview] = useState(false);

  const [indexCurrent, setIndexCurrent] = useState(0);

  const animatableRef = useRef();

  const onStaticCloseModal = useCallback(() => {
    if (onCloseModal) {
      onCloseModal();
    }
  }, [onCloseModal]);

  const onNextPress = (isLogin = true) => {
    if (indexCurrent < 2) {
      animatableRef.current.fadeOut(300);
      setTimeout(() => {
        setIndexCurrent(indexCurrent + 1);
        requestAnimationFrame(() => {
          animatableRef.current?.fadeIn(300);
        });
      }, 200);
    } else {
      //
      if (onDone) {
        onDone(isLogin);
      }
    }
  };

  // const onPressFB = () => {
  //     url = Platform.OS === 'android' ? 'fb://page/100904784888246' : 'fb://profile/100904784888246';
  //     Linking.openURL(url);
  // }

  // const onPressWebsite = () => {
  //     Linking.openURL('https://www.mfast.vn');
  // }

  // const onPressEmail = () => {
  //     Linking.openURL('mailto:hotro@mfast.vn?subject=MFast: Yêu cầu hỗ trợ');
  // }

  const onCloseModalWebview = () => {
    setIsVisibleWebview(false);
  };

  const onPressSkip = () => {
    if (onDone) {
      onDone(true);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        {Array.apply(0, new Array(3)).map((_, index) => {
          const isActive = indexCurrent >= index;
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                setIndexCurrent((prev) => {
                  if (prev === index) return prev;
                  animatableRef.current.fadeIn(500);
                  return index;
                });
              }}
            >
              <View
                style={{
                  width: SW(98),
                  marginHorizontal: SW(4),
                  height: 6,
                  borderRadius: 32,
                  backgroundColor: isActive ? Colors.primary2 : Colors.gray4,
                }}
              />
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    );
  };
  const renderStep = () => {
    let title =
      indexCurrent === 0
        ? `BÙNG NỔ\nTHU NHẬP`
        : indexCurrent === 1
        ? `VỮNG CHẮC\nSỰ NGHIỆP`
        : indexCurrent === 2
        ? 'MỪNG MFAST\nBÉN DUYÊN\nCÙNG BẠN'
        : '';
    let desc =
      indexCurrent === 0
        ? `Thu nhập 9 chữ số mỗi tháng với hơn 10 công việc có sẵn trên MFast`
        : indexCurrent === 1
        ? `Trở thành đại lý tài chính, bảo hiểm tất cả trong 1 từ con số 0`
        : indexCurrent === 2
        ? ``
        : '';
    let image =
      indexCurrent === 0
        ? IMAGE_PATH.slide1
        : indexCurrent === 1
        ? IMAGE_PATH.slide2
        : indexCurrent === 2
        ? IMAGE_PATH.slide3
        : null;

    const titleSlipt = title.split('\n');
    return (
      <Animatable.View ref={animatableRef} style={{ justifyContent: 'center', marginTop: 40 }}>
        {titleSlipt?.map((text, index) => {
          return (
            <AppText
              key={index}
              bold
              style={{
                textAlign: 'center',
                fontSize: 32,
                lineHeight: 55,
                color: Colors.primary2,
                letterSpacing: -0.5,
                top: index ? -8 : 0,
              }}
            >
              {text}
            </AppText>
          );
        })}
        <AppText
          medium
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
            color: Colors.gray1,
            marginHorizontal: 54,
            top: -4,
          }}
        >
          {desc}
        </AppText>
        <Image
          source={image}
          style={{
            width: SW(indexCurrent === 2 ? 197 : 375),
            height: SW(indexCurrent === 2 ? 354 : 375),
            marginTop: 20,
            resizeMode: 'contain',
          }}
        />
      </Animatable.View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{ padding: 0, margin: 0 }}
      onBackdropPress={onStaticCloseModal}
      onModalHide={onStaticCloseModal}
      animationInTiming={1}
      animationOutTiming={1}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.guildWrapper}>
          <View style={{ position: 'absolute', width: '100%' }}>
            <View style={{ backgroundColor: Colors.primary5, height: 280 }} />
            <Svg height="70" width="100%">
              <Ellipse cx="50%" cy="-50%" rx="60%" ry="100" fill={Colors.primary5} />
            </Svg>
          </View>
          {renderStepIndicator()}
          {renderStep()}
          <View style={{ position: 'absolute', bottom: 60, width: '100%' }}>
            {indexCurrent === 2 ? (
              <>
                <ButtonText
                  fontSize={18}
                  lineHeight={26}
                  height={58}
                  title={'Đăng nhập ngay'}
                  semiBold
                  onPress={onNextPress}
                  style={{ alignSelf: 'center', paddingHorizontal: 32 }}
                />
                <AppText
                  onPress={() => onNextPress(false)}
                  semiBold
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: Colors.primary2,
                    textAlign: 'center',
                    marginTop: 20,
                  }}
                >
                  Trải nghiệm trước
                </AppText>
              </>
            ) : (
              <View style={styles.btnWrapper}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={onPressSkip}
                >
                  <AppText
                    semiBold
                    style={{ fontSize: 18, lineHeight: 26, color: Colors.gray5, marginRight: 8 }}
                  >
                    Bỏ qua
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={onNextPress}
                >
                  <AppText
                    semiBold
                    style={{ fontSize: 18, lineHeight: 26, color: Colors.primary2, marginRight: 8 }}
                  >
                    Tiếp tục
                  </AppText>
                  <View>
                    <Image source={ICON_PATH.arrow_right2} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <WebviewPopup isVisibleWebview={isVisibleWebview} onCloseModal={onCloseModalWebview} />
      </SafeAreaView>
    </Modal>
  );
};

export default GuildPageSlider;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  guildWrapper: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 32,
  },
});
