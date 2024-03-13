/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Strings from 'app/constants/strings';
import { showAlertForRequestPermission } from 'app/utils/UIUtils';
/* eslint-disable */
import Utils from 'app/utils/Utils';
import { Platform } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import Permissions from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import { uploadImage } from '../submodules/firebase/FirebaseStorage';
import {
  checkCamera,
  checkPhoto,
  checkPhotoAndCamera,
  requestCamera,
  requestPhoto,
} from '../utils/Permission';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const LOG_TAG = 'ImageHelper.js';
/* eslint-enable */

// --------------------------------------------------
// ImageUtils
// --------------------------------------------------

export default class ImageUtils {
  /**
   * Help to pick an image -> resize -> upload to firebase storage
   * - onStep will call with step: 'pick', 'resize', 'upload'
   * - onSuccess will call with null if user cancell
   * - onError will be call with err if any issue happen
   * @param {number} resizeMaxWidth
   * @param {number} resizeMaxHeight
   * @param {callback} onStep: (step) => {}
   * @param {callback} onProgress: (step, percent) => {}
   * @param {callback} onError: (step, err) => {}
   * @param {callback} onSuccess: (downloadURL) => {}
   */
  static pickAndUploadImage(
    source = null,
    resizeMaxWidth = 512,
    resizeMaxHeight = 512,
    onStep,
    onProgress,
    onError,
    onSuccess,
    containVideo,
  ) {
    if (onStep) {
      onStep('pick');
    }
    ImageUtils.pickImage(source, containVideo, '')
      .then((response) => {
        // user cancel
        if (!response) {
          if (onSuccess) {
            onSuccess(null);
          }
          return;
        }
        // resize image
        if (onStep) {
          onStep('resize');
        }

        ImageUtils.createResizedImage(response[0].uri, resizeMaxWidth, resizeMaxHeight)
          .then((imageURI) => {
            // upload image
            if (onStep) {
              onStep('upload');
            }
            uploadImage(
              imageURI,
              onProgress,
              (err) => {
                if (onError) {
                  onError('upload', err);
                }
              },
              onSuccess,
            );
          })
          .catch((err) => {
            if (onError) {
              onError('resize', err);
            }
          });
      })
      .catch((err) => {
        if (onError) {
          onError('pick', err);
        }
      });
  }
  /**
   * Help to pick a picture from device album
   * @returns a Promise resolve with image uri
   */
  static pickImage(source = null, containVideo, title = '', multiple = false, mediaType = 'any') {
    return new Promise((resolve) => {
      const checkPermission = source === 'camera' ? checkCamera : checkPhoto;
      return (
        checkPermission()
          .then((isAuthorized) => {
            if (isAuthorized) {
              resolve(
                multiple
                  ? this.pickMultiImage(source, mediaType, containVideo)
                  : this.pickImageWithAuth(source, title, containVideo, mediaType),
              );
              return Promise.reject();
            } else {
              const requestPermission = source === 'camera' ? requestCamera : requestPhoto;
              return requestPermission();
            }
          })
          // .then((isAuthorized) => {
          //   if (isAuthorized) {
          //     return requestCamera();
          //   } else {
          //     return false;
          //   }
          // })
          .then((isAuthorized) => {
            if (isAuthorized) {
              resolve(
                multiple
                  ? this.pickMultiImage(source, mediaType, containVideo)
                  : this.pickImageWithAuth(source, title, containVideo, mediaType),
              );
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            // resolve(false);
          })
      );
    });
  }

  static pickImageWithAuth(source = null, title = '', containVideo, mediaType = 'photo') {
    return new Promise((resolve, reject) => {
      // options
      const options = {
        title,
        mediaType,
        cancelButtonTitle: 'Đóng',
        takePhotoButtonTitle: 'Chụp hình mới',
        chooseFromLibraryButtonTitle: 'Chọn từ Album',
        cameraType: 'back',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      // handler
      const responseHandler = (response) => {
        if (response.error) {
          reject(response.error);
        } else if (response.didCancel) {
          resolve(null);
        } else {
          resolve(
            response?.assets?.map((item) => ({
              ...item,
              uri: Platform.OS === 'ios' ? item?.uri?.replace('file://', '') : item?.uri,
            })),
          );
        }
      };
      // pick
      if (source === 'camera') {
        launchCamera(options, responseHandler);
      } else {
        launchImageLibrary(options, responseHandler);
      }
    });
  }
  /**
   * Create a resized image with aspect ratio satisfy max width, max height
   * @param {string} fileURI
   * @param {number} width
   * @param {number} height
   * @returns a Promise solve with new image uri
   */
  static createResizedImage(fileURI, maxWidth, maxHeight, quality = 70) {
    return ImageResizer.createResizedImage(fileURI, maxWidth, maxHeight, 'JPEG', quality)
      .then((response) => {
        // Utils.log(`${LOG_TAG}.createResizedImage.response: `, response);
        return response.uri;
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} resizeImage error: `, error);
        return Promise.reject(error);
      });
  }

  static saveImage(url, type = 'image') {
    return Permissions.request('photo').then((response) => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      if (response === 'authorized') {
        return type === 'image' ? this.mSaveToCameraRoll(url) : this.mSaveVideoToCameraRoll(url);
      }
      showAlertForRequestPermission(
        Platform.OS === 'ios' ? Strings.camera_access_error : Strings.camera_access_error_android,
      );
      return new Promise((resolve, reject) => {
        reject();
      });
    });
  }

  static mSaveToCameraRoll(url) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        RNFetchBlob.config({
          fileCache: true,
          appendExt: 'png',
        })
          .fetch('GET', url, {})
          .then((res) => {
            CameraRoll.save(`file://${res.path()}`, { type: 'photo' })
              .then(() => {
                resolve(true);
              })
              .catch((err) => {
                console.log(`\u001B[34m -> file: ImageUtils.js:239 -> ImageUtils -> err:`, err);
                reject(err);
              });
          });
      } else {
        CameraRoll.save(url, {
          type: 'photo',
        })
          .then(() => resolve(true))
          .catch((error) => {
            console.log('error', error);
            reject(error);
          });
      }
    });
  }

  static mSaveVideoToCameraRoll(url) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'mp4',
      })
        .fetch('GET', url, {})
        .then((res) => {
          CameraRoll.saveToCameraRoll(res.path(), 'video')
            .then(() => {
              resolve(true);
            })
            .catch((err) => {
              reject(err);
            });
        });
    });
  }

  static pickMultiImage(source = null, mediaType = 'any', containVideo) {
    return new Promise((resolve, reject) => {
      if (source === 'camera') {
        launchCamera({ mediaType: 'mixed', includeBase64: false }, (image) => {
          resolve(
            [image].map((imageItem) => {
              return {
                ...imageItem,
                uri: imageItem.uri,
                type: imageItem?.width ? 'photo' : 'video',
              };
            }),
          );
          // resolve({ uri: image.uri, ...image });
        });
        // ImageCropPicker.openCamera({ mediaType: 'any', cropping: false }).then((image) => {
        //   console.log(
        //     'image ne',
        //     [image].map((imageItem) => ({ ...imageItem, uri: imageItem.path })),
        //   );
        //   // resolve();
        // });
      } else {
        ImageCropPicker.openPicker({
          multiple: true,
          mediaType,
          compressVideoPreset: '1280x720',
          includeBase64: false,
        }).then((images) => {
          resolve(images.map((imageItem) => ({ ...imageItem, uri: imageItem.path })));
        });
      }
    });
  }

  static isImage(url) {
    const imageTypes = ['jpg', 'jpeg', 'png', 'tiff'];
    for (let i = 0; i < imageTypes.length; i += 1) {
      if (url.toLowerCase().includes(imageTypes[i])) {
        return true;
      }
    }
    return false;
  }
}
