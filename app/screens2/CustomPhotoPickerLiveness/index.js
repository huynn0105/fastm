import { CameraRoll } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import React from 'react';

import DigitelClient from '../../network/DigitelClient';

const REDUCE_QUALITY = 90;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

export function pickPhoto({ title = 'Điều chỉnh hình vào giữa khung', width, height, callback }) {
  ImageCropPicker.openPicker({
    width,
    height,
    cropping: true,
    mediaType: 'photo',
    cropperChooseText: 'Cắt hình',
    cropperCancelText: 'Hủy',
    cropperToolbarTitle: title,
  }).then(async (image) => {
    if (image.path) {
      resizeAndSaveImage(image.path, callback);
    }
  });
}

export function capturePhoto({
  navigation,
  title = '',
  detail = '(Di chuyển vào giữa khung)',
  width,
  height,
  cameraTitleHtml,
  cameraDetailHtml,
  callback,
  callbackDontPick,
  typeIdCard,
  cameraType,
}) {
  navigation.navigate('CustomCameraLiveness', {
    title,
    detail,
    typeIdCard,
    cameraTitleHtml,
    cameraDetailHtml,
    ratio: width / height,
    cameraType,
    callback: async (image) => {
      if (image.uri) {
        resizeAndSaveImage(image.uri, callback);
      }
    },
    callbackDontPick,
  });
}

export function captureVideo({
  navigation,
  title = '',
  detail = '(Di chuyển vào giữa khung)',
  width,
  height,
  cameraTitleHtml,
  cameraDetailHtml,
  callback,
  callbackDontPick,
  typeIdCard,
  cameraType,
}) {
  navigation.navigate('CustomCameraLiveness', {
    title,
    detail,
    typeIdCard,
    cameraTitleHtml,
    cameraDetailHtml,
    width,
    height,
    ratio: width / height,
    cameraType,
    callback: async (video) => {
      if (video.uri) {
        callback(video);
      }
    },
    callbackDontPick,
  });
}

async function resizeAndSaveImage(imageURI, callback) {
  const response = await ImageResizer.createResizedImage(
    imageURI,
    MAX_WIDTH,
    MAX_HEIGHT,
    'JPEG',
    REDUCE_QUALITY,
  );
  callback(response);
}

export class PhotoPickerLiveness extends React.PureComponent {
  constructor(props) {
    super(props);

    this.callback = () => {};
    this.callbackDontPick = () => {};
    this.cameraTitle = '';
    this.cameraDetail = '';
    this.galleryTitle = '';
    this.width = 300;
    this.height = 400;
    this.typeIdCard = null;
    this.cameraType = null;
  }
  handleCapturePhoto = ({ uri }) => {
    DigitelClient.uploadImage(uri).then(this.callback);
  };
  handleCaptureVideo = ({ uri }) => {
    this.callback(uri);
  };
  openCamera = () => {
    capturePhoto({
      navigation: this.navigation,
      title: this.cameraTitle,
      detail: this.cameraDetail,
      width: this.width,
      height: this.height,
      typeIdCard: this.typeIdCard,
      cameraTitleHtml: this.cameraTitleHtml,
      cameraDetailHtml: this.cameraDetailHtml,
      callback: this.handleCapturePhoto,
      callbackDontPick: this.callbackDontPick,
      cameraType: this.cameraType,
    });
  };
  openPhoto = () => {
    pickPhoto({
      title: this.galleryTitle,
      width: this.width,
      height: this.height,
      callback: this.handleCapturePhoto,
      callbackDontPick: this.callbackDontPick,
    });
  };

  openVideoSelfie = () => {
    captureVideo({
      navigation: this.navigation,
      title: this.cameraTitle,
      detail: this.cameraDetail,
      width: this.width,
      height: this.height,
      typeIdCard: this.typeIdCard,
      cameraTitleHtml: this.cameraTitleHtml,
      cameraDetailHtml: this.cameraDetailHtml,
      callback: this.handleCaptureVideo,
      callbackDontPick: this.callbackDontPick,
      cameraType: this.cameraType,
    });
  };

  show = (
    {
      cameraTitle,
      cameraDetail,
      galleryTitle,
      callback,
      width,
      height,
      navigation,
      callbackDontPick,
      cameraTitleHtml,
      cameraDetailHtml,
      typeIdCard,
      cameraType,
    },
    mediaType = 'any',
  ) => {
    this.callback = callback;
    this.callbackDontPick = callbackDontPick;
    this.navigation = navigation;
    this.cameraTitle = cameraTitle || '';
    this.cameraTitleHtml = cameraTitleHtml;
    this.cameraDetailHtml = cameraDetailHtml;
    this.cameraDetail = cameraDetail || '';
    this.galleryTitle = galleryTitle || '';
    this.width = width || 300;
    this.height = height || 400;
    this.typeIdCard = typeIdCard;
    this.cameraType = cameraType;
    if (mediaType === 'any') {
      this.actionSheet.show();
    } else if (mediaType === 'camera') {
      this.openCamera();
    } else if (mediaType === 'video') {
      this.openVideoSelfie();
    }
  };

  render() {
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        title={'Thêm ảnh'}
        options={['Đóng', 'Chụp hình mới', 'Chọn từ Album']}
        cancelButtonIndex={0}
        onPress={(index) => {
          if (index === 1) {
            this.openCamera();
          } else if (index === 2) {
            this.openPhoto();
          }
        }}
      />
    );
  }
}
