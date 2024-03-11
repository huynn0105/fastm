import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
const options = {
  // title: strings.image_picker.image_picker_title,
  // takePhotoButtonTitle: strings.image_picker.take_picture_on_camera_text,
  // chooseFromLibraryButtonTitle: strings.image_picker.choose_picture_from_library,
  // cancelButtonTitle: strings.image_picker.cancel_button_text,
  mediaType: 'photo',
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 1,
  selectionLimit: 0,
};
const width = 2048;
const height = 2048;

export const imagePicker = (multiple = true, cropping = true) =>
  new Promise((resolve, reject) => {
    ImageCropPicker.openPicker({
      multiple: multiple,
      mediaType: 'video',
      cropping,
      compressImageMaxHeight: height,
      compressImageMaxWidth: width,
      width,
      height,
    })
      .then(async (images) => {
        if (images) {
          if (multiple) {
            const newList = images;
            const resultList = newList.map((e) => ({ ...e, uri: e.path }));
            // resolve(resultList);
            const result = await Promise.all(
              resultList.map((e) =>
                ImageResizer.createResizedImage(e.uri, width, height, 'JPEG', 100, 0),
              ),
            );
            // const result = [...resultList];

            resolve(result);
          } else {
            // resolve([{ ...images, uri: images.path }]);
            ImageResizer.createResizedImage(images.path, width, height, 'JPEG', 100, 0)
              .then((data) => {
                resolve([{ ...images, uri: data.uri }]);
              })
              .catch((err) => reject(err?.message || ''));
          }
        } else {
        }
      })
      .catch((error) => {
        reject(error?.message);
      });
  });

export const launchCamera = () =>
  new Promise((resolve, reject) => {
    ImageCropPicker.openCamera({
      // width: 300,
      // height: 400,
      includeExif: true,
      compressImageMaxHeight: height,
      compressImageMaxWidth: width,
      cropping: true,
      width,
      height,
      cropperToolbarTitle: '사진 편집',
      cropperCancelText: '취소',
      cropperChooseText: '선택',
    })
      .then((image) => {
        ImageResizer.createResizedImage(image.path, width, height, 'JPEG', 100, 0)
          .then((data) => {
            resolve([{ uri: data.uri }]);
          })
          .catch((err) => reject(err?.message || ''));

        // if (
        //   image?.exif &&
        //   image?.exif?.Orientation &&
        //   image?.exif?.Orientation === '6'
        // ) {
        //   ImageResizer.createResizedImage(
        //     image.path,
        //     image.width,
        //     image.height,
        //     'JPEG',
        //     100,
        //     0,
        //   )
        //     .then((data) => {
        //       resolve([{uri: data.uri}]);
        //     })
        //     .catch((err) => reject(err?.message || ''));
        // } else {
        //   resolve([{...image, uri: image.path}]);
        // }
      })
      .catch((error) => {
        reject(error?.message);
      });
  });
