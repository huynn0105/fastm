import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import { isIphoneX } from 'react-native-iphone-x-helper';
import isIphone12 from '../../utils/iphone12Helper';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { SH } from '../../constants/styles';
import { useSelector } from 'react-redux';
import DPDControl from '../../screenV3/Home/DPDControl';
import FinancesVertList from '../../screenV3/Home/FinancesVertList';
import { DEEP_LINK_BASE_URL, MFConfigs } from '../../constants/configs';
import { useActions } from '../../hooks/useActions';
import { homeNavigate } from '../../redux/actions';
import HeaderSection from '../../screenV3/Home/HeaderSection';

const isSafe = isIphone12() || isIphoneX();
const offset = isIphone12() || isIphoneX() ? SH(30) : SH(16);

const PopupUserGuildHome = ({ onClose, contentUserGuildHome, onNextStep, hasDPD, navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // const DPD = useSelector((state) => state.DPD?.finance);
  const DPD = useSelector((state) => state.DPD);

  const listFinance = useSelector((state) => state.listFinance);
  const actions = useActions({
    homeNavigate,
  });
  useEffect(() => {}, []);

  useEffect(() => {
    if (activeIndex > 0) {
      const heightOffset = !hasDPD
        ? (Platform.OS === 'android' ? SH(78) : isIphone12() || isIphoneX() ? SH(49) : SH(0)) -
          (isSafe ? 0 : 6)
        : (Platform.OS === 'android' ? SH(163) : isIphone12() || isIphoneX() ? SH(113) : SH(25)) -
          (isSafe ? 0 : 6);
      const temp = heightOffset;
      setOffsetY(temp);
    } else {
      const temp =
        (Platform.OS === 'android' ? SH(41) : SH(50)) +
        (isIphone12() || isIphoneX() ? SH(128) : SH(150));
      setOffsetY(temp);
    }
  }, [activeIndex]);

  const onStaticClose = useCallback(() => {
    if (onClose) {
      setIsVisible(false);
      onClose();
    }
  }, [onClose]);

  const onStaticBackdropPress = useCallback(() => {
    if (onClose) {
      setIsVisible(false);
      onClose();
    }
  }, [onClose]);

  const ChildComponent = contentUserGuildHome?.[activeIndex]?.childComponent;

  const onPressNextStep = () => {
    console.log('hic');
    if (activeIndex + 1 < contentUserGuildHome?.length) {
      setActiveIndex(activeIndex + 1);
      onNextStep(activeIndex + 1);
    } else {
      setActiveIndex(0);
      onStaticClose();
    }
  };

  const isDeepLink = (url) => {
    return url && (url.startsWith(`${DEEP_LINK_BASE_URL}://`) || url.startsWith('tel:'));
  };
  const onPressItemFinance = (item) => {
    if (isDeepLink(item.url)) {
      Linking.openURL(item.url);
      return false;
    }
    navigation.navigate('WebView', {
      mode: 0,
      title: item.title || '',
      url: item.url,
    });
  };

  const renderBadLoan = (isGuild = false) => {
    return (
      <View>
        {!!DPD && <DPDControl navigation={navigation} />}
        <FinancesVertList data={listFinance?.items} onPressItem={onPressItemFinance} />
      </View>
    );
  };

  const renderTouchArea = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPressNextStep}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          zIndex: 100,
          position: 'absolute',
          // backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <View>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onStaticClose}>
              <View style={styles.closeButton}>
                <AppText style={{ color: '#fff', marginRight: 8 }}>Bỏ qua</AppText>
                <Image source={ICON_PATH.close2} style={{ height: 36, width: 36 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // const offsetTop = ((offset * 2) + 74) - (isSafe ? 0 : 6);
  // console.log("TCL: offsetTop", offsetTop)

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
            <View
              style={[
                styles.body,
                {
                  // backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  top: offsetY,
                },
              ]}
            >
              <View style={styles.cursorInforContainer}>
                <Image style={{ height: 66, width: 64 }} source={IMAGE_PATH.cursor} />
                <AppText
                  semiBold
                  style={{
                    top: -14,
                    color: '#fff',
                    flex: 1,
                    fontSize: 14,
                    marginLeft: 8,
                    lineHeight: 22,
                  }}
                >
                  {contentUserGuildHome?.[activeIndex]?.title}
                </AppText>
              </View>
              {activeIndex === 0 ? renderBadLoan() : ChildComponent ? <ChildComponent /> : null}
            </View>
            <View style={styles.footerContainer}>
              <AppText
                semiBold
                style={{
                  color: '#fff',
                  fontSize: 14,
                  paddingHorizontal: 80,
                  textAlign: 'center',
                }}
              >
                {activeIndex < contentUserGuildHome?.length - 1
                  ? 'Nhấn vào màn hình để tiếp tục'
                  : 'Nhấn vào màn hình để bắt đầu tạo thu nhập trên MFast'}
              </AppText>
              <View
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {contentUserGuildHome?.map((i, index) => (
                  <View
                    style={{
                      marginHorizontal: 4,
                      width: 6,
                      height: 6,
                      borderRadius: 6,
                      backgroundColor: '#fff',
                      opacity: index === activeIndex ? 1 : 0.5,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          {renderTouchArea()}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PopupUserGuildHome;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  safe: {
    flex: 1,
    marginTop: offset,
  },
  wrapper: {
    flex: 1,
  },
  container: {
    width: '100%',
    backgroundColor: Colors.neutral5,
    borderRadius: 10,
  },
  body: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cursorInforContainer: {
    height: 70,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  footerContainer: {
    marginBottom: 60,
  },
});
