import React from 'react';
import { useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import HTML from 'react-native-render-html';
import { IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';

import { SH, SW } from '../../constants/styles';
import { useActions } from '../../hooks/useActions';
import DigitelClient from '../../network/DigitelClient';
import { getUserConfigs } from '../../redux/actions/actionsV3/userConfigs';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';

import Colors from '../../theme/Color';

const PopupReEKYC = ({ navigation, data }) => {
  const actions = useActions({
    getUserMetaData,
    getUserConfigs,
  });
  const [isVisible, setIsVisible] = useState(true);

  const pressRightButton = async (rightApi, url) => {
    if (rightApi && rightApi?.length > 0) {
      const status = await DigitelClient.reEkycApi(rightApi);
      if (status) {
        actions.getUserMetaData();
        actions.getUserConfigs();
        setTimeout(() => {
          Linking.openURL(url);
        }, 100);
      }
    } else {
      Linking.openURL(url);
    }
    setIsVisible(false);
  };

  const pressLeftButton = async (leftApi, url) => {
    if (leftApi && leftApi?.length > 0) {
      const status = await DigitelClient.reEkycApi(leftApi);
      if (status) {
        actions.getUserMetaData();
        actions.getUserConfigs();
        setTimeout(() => {
          Linking.openURL(url);
        }, 100);
      }
    } else {
      Linking.openURL(url);
    }
    setIsVisible(false);
  };
  const renderListButton = () => {
    const {
      leftButtonUrl,
      leftButtonTitle,
      rightButtonTitle,
      rightButtonUrl,
      leftButtonApi,
      rightButtonApi,
    } = data;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#e6ebff',
            height: SH(50),
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            pressLeftButton(leftButtonApi, leftButtonUrl);
          }}
        >
          <AppText
            semiBold
            style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.primary2 }}
          >
            {leftButtonTitle}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#e6ebff',
            height: SH(50),
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            pressRightButton(rightButtonApi, rightButtonUrl);
          }}
        >
          <AppText
            semiBold
            style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.primary2 }}
          >
            {rightButtonTitle}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Modal isVisible={isVisible} useNativeDriver style={{}}>
      <View
        style={{
          // flex: 1,
          backgroundColor: Colors.neutral5,
          borderRadius: 10,
          alignItems: 'center',
          overflow: 'hidden',
          //   paddingVertical: SH(20),
        }}
      >
        <View style={{ paddingVertical: SH(16) }}>
          <Image
            source={IMAGE_PATH.imageEKYC}
            style={{ width: SW(140), height: SH(105), resizeMode: 'contain' }}
          />
        </View>
        <View style={{ marginBottom: SH(12) }}>
          <AppText style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.gray2 }}>
            Cập nhật thông tin tài khoản
          </AppText>
        </View>
        <View style={{ paddingHorizontal: SW(16), marginBottom: SH(20) }}>
          <AppText
            style={{
              fontSize: SH(14),
              lineHeight: SH(20),
              color: Colors.gray1,
              textAlign: 'center',
            }}
          >
            Nhằm đảm bảo quyền lợi của bạn trong quá trình sử dụng MFast. Vui lòng bổ sung 1 vài
            thông tin để hoàn tất định danh tài khoản.
          </AppText>
        </View>
        {renderListButton()}
        {/* <WebViewScreen /> */}
      </View>
    </Modal>
  );
};

export default PopupReEKYC;
