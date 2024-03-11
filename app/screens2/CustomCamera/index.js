import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RNCamera } from 'react-native-camera';

import ImagePicker from 'react-native-image-crop-picker';

import CameraMark from './comps/CameraMark';
import Header from './comps/Header';
import FooterAction from './comps/FooterAction';
import FooterRotate from './comps/FooterRotate';

import styles from './CustomCamera.styles';
import { CAMERA_HEIGHT, CAMERA_WIDTH } from './CustomCamera.contants';

import { showInfoAlert } from '../../utils/UIUtils';
import { checkAndRequestCamera } from '../../utils/Permission';

const CustomCamera = ({ navigation }) => {
  const cameraRef = useRef(null);

  const [caWith, setCaWidth] = useState(CAMERA_WIDTH);
  const [caHeight, setCaHeigth] = useState(CAMERA_HEIGHT);
  const [caType, setCaType] = useState(RNCamera.Constants.Type.back);
  const [imgUri, setImgUri] = useState(null);

  useEffect(() => {
    checkAndRequestCamera().then((granted) => {
      if (!granted) {
        navigation.goBack();
        showInfoAlert(
          'MFAST chưa có quyền truy cập Camera của bạn. Hãy cho phép truy câp Camera trong Cài đặt của điện thoại',
        );
      }
    });

    const params = navigation?.state?.params;
    if (params?.ratio) {
      const { cameraHeight, cameraWidth } = getCameraSize(params?.ratio);
      setCaWidth(cameraWidth);
      setCaHeigth(cameraHeight);
    }
    if (params?.cameraType === 'FRONT') {
      setCaType(RNCamera.Constants.Type.front);
    }
  }, [navigation]);

  const getCameraSize = useCallback((ratio, w, h) => {
    let cameraHeight = h || CAMERA_HEIGHT;
    let cameraWidth = cameraHeight * ratio;
    if (cameraWidth > w || CAMERA_WIDTH) {
      cameraWidth = w || CAMERA_WIDTH;
      cameraHeight = cameraWidth / ratio;
    }
    return { cameraHeight, cameraWidth };
  }, []);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressGoBack = useCallback(() => {
    const params = navigation?.state?.params;
    if (params?.callbackDontPick && typeof params?.callbackDontPick === 'function') {
      params?.callbackDontPick();
    }
    navigation.goBack();
    return true;
  }, [navigation]);

  const onCapturePress = useCallback(async () => {
    try {
      const image = await cameraRef.current?.takePictureAsync({
        orientation: 'portrait',
      });
      let imageRatio = 1;
      const params = navigation?.state?.params;
      if (params?.ratio) {
        imageRatio = params?.ratio;
      }
      const size = getCameraSize(imageRatio, image?.width, image?.height);
      ImagePicker.openCropper({
        path: image?.uri,
        width: size?.cameraWidth,
        height: size?.cameraHeight,
        cropperChooseText: 'Hoàn Thành',
        cropperCancelText: 'Huỷ bỏ',
        cropperToolbarTitle: 'Chỉnh sửa hình ảnh',
      }).then((img) => {
        setImgUri(img?.path);
        onFinishPress(img?.path);
      });
    } catch (error) {
      //
    }
  }, [cameraRef, caWith, caHeight, navigation]);

  const onRotateCameraPress = useCallback(() => {
    try {
      if (caType === RNCamera.Constants.Type.back) {
        setCaType(RNCamera.Constants.Type.front);
      } else {
        setCaType(RNCamera.Constants.Type.back);
      }
    } catch (err) {
      showInfoAlert('chuyển camera thất bại, bạn vui lòng thử lại');
    }
  }, [caType]);
  const onFinishPress = useCallback(
    async (imgParam) => {
      try {
        const params = navigation?.state?.params;
        if (params?.callback && typeof params?.callback === 'function') {
          params?.callback({ uri: imgParam || imgUri });
        }
        onCancelPress();
      } catch (err) {
        showInfoAlert('Chỉnh sửa thất bại, bạn vui lòng thử lại');
      }
    },
    [navigation, imgUri, onCancelPress],
  );

  const onRotateImageLeftPress = useCallback(() => {}, []);

  const onRotateImageRightPress = useCallback(() => {}, []);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.wrapper}>
        <View style={styles.wrapperCamera}>
          <View style={styles.containerCamera}>
            {imgUri ? (
              <FastImage
                style={{ flex: 1, width: caWith }}
                resizeMode="contain"
                source={{ uri: `file://${imgUri}` }}
              />
            ) : (
              <View style={{ width: caWith, height: caHeight, overflow: 'hidden' }}>
                <RNCamera
                  ref={cameraRef}
                  type={caType}
                  ratio={'16:9'}
                  captureAudio={false}
                  style={{ flex: 1 }}
                  androidCameraPermissionOptions={{
                    title: 'Mfast',
                    message: 'MFast truy cập Camera để bạn có thể cập nhật hình ảnh.',
                    buttonPositive: 'Đồng ý',
                    buttonNegative: 'Đóng',
                  }}
                />
              </View>
            )}
          </View>
        </View>
        <CameraMark cameraHeight={caHeight} cameraWidth={caWith} />
        <Header {...navigation?.state?.params} />
        <View style={{ flex: 1 }} />
        {imgUri ? (
          <FooterRotate
            onCancelPress={onPressGoBack}
            onFinishPress={onFinishPress}
            onRotateImageLeftPress={onRotateImageLeftPress}
            onRotateImageRightPress={onRotateImageRightPress}
          />
        ) : (
          <FooterAction
            onCancelPress={onPressGoBack}
            onCapturePress={onCapturePress}
            onRotateCameraPress={onRotateCameraPress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomCamera;
