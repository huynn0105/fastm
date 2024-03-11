import React, { memo, useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

// components
import { PhotoPicker } from '../../screens2/CustomPhotoPicker';
import PopupPreviewImage from '../PopupPreviewImage';
// fetch
import DigitelClient from '../../network/DigitelClient';
// permissions
import {
  checkAndRequestPermission,
  PERMISSION_CHECK,
  PERMISSION_REQUEST_MESSAGE,
} from '../../utils/permissionV3';
import { PhotoPickerLiveness } from '../../screens2/CustomPhotoPickerLiveness';
import { SERVICE_TYPE } from './constants';
import CameraOptions from '../../constants/cameraObjKeys';

function withCameraPicker(WrapperComponent) {
  return memo((props) => {
    /* <------------------- Props -------------------> */
    const { navigation } = props;

    /* <------------------- Ref -------------------> */
    const photoPickerRef = useRef(null);
    const serviceType = useRef(SERVICE_TYPE.FPT); //"BLUE_INFO" || FPT
    const idNumber = useRef(''); //"BLUE_INFO" || FPT

    /* <------------------- State -------------------> */
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [idTypeProcess, setIdTypeProcess] = useState(null);
    const [arrImg, setArrImg] = useState([]);
    const [isVisiblePreviewImage, setIsVisiblePreviewImage] = useState(false);

    /* <------------------- actions -------------------> */
    const checkPermissonCamera = useCallback(async () => {
      const graned = await checkAndRequestPermission(
        PERMISSION_CHECK.CAMERA,
        PERMISSION_REQUEST_MESSAGE.CAMERA,
      );
      return graned;
    }, []);

    const onHandlerCameraPicker = useCallback(
      (options, callbackData) => {
        photoPickerRef?.current?.show(
          {
            ...options,
            navigation,
            callback: (imgURL) => {
              if (typeof callbackData === 'function') {
                callbackData(imgURL);
              }
            },
            callbackDontPick: () => {
              if (typeof callbackData === 'function') {
                callbackData();
              }
            },
          },
          'camera',
        );
      },
      [photoPickerRef],
    );

    const onHandlerVideoSelfie = useCallback(
      (options, callbackData) => {
        photoPickerRef?.current?.show(
          {
            ...options,
            navigation,
            callback: (imgURL) => {
              if (typeof callbackData === 'function') {
                callbackData(imgURL);
              }
            },
            callbackDontPick: () => {
              if (typeof callbackData === 'function') {
                callbackData();
              }
            },
          },
          'video',
        );
      },
      [photoPickerRef],
    );

    const onOpenCamera = async (options, callbackData) => {
      const graned = await checkPermissonCamera();
      if (graned) {
        onHandlerCameraPicker(options, callbackData);
      }
    };

    /* <------------------- valid -------------------> */
    const isValid = useCallback((data) => {
      return !(!data || data === 'N/A');
    }, []);

    /* <------------------- valid -------------------> */
    const getDataFromImage = useCallback(
      async (photoUrl, idType, sideType) => {
        const extraData = {};

        if (serviceType.current === SERVICE_TYPE.BLUE_INFO) {
          extraData.side = sideType;
          extraData.version = 1;
          if (sideType === '2') {
            extraData.idNumber = idNumber.current;
          }
        }

        const response = await DigitelClient.submitORCIdentify(photoUrl, extraData);
        //check cccd co gan chip
        if (!response.status) {
          setErrorMessage(response.message);
          setError(true);
          return;
        }
        const payload = response?.data;
        if (!payload || payload?.id_check !== 'REAL' || idType !== payload?.id_type) {
          setError(true);
          return;
        }
        setErrorMessage('');
        setError(false);
        const pload = {};

        if (isValid(payload?.id)) {
          pload.countryIdNumber = payload?.id;
          idNumber.current = payload?.id;
        }
        if (isValid(payload?.oldIdNumber)) {
          pload.countryOldIdNumber = payload?.oldIdNumber;
        }
        if (isValid(payload?.name)) {
          pload.countryIdName = payload?.name;
        }
        if (isValid(payload?.dob)) {
          pload.countryIdDateOfBirth = payload?.dob;
        }
        if (isValid(payload?.issue_by)) {
          pload.countryIdIssuedBy = payload?.issue_by;
        }
        if (isValid(payload?.issue_date)) {
          pload.countryIdIssuedDate = payload?.issue_date;
        }
        if (isValid(payload?.address)) {
          pload.countryIdAddress = payload?.address;
        }
        if (isValid(payload?.sex)) {
          pload.gender = payload?.sex;
        }
        if (isValid(payload?.home)) {
          pload.countryIdHomeAddress = payload?.home;
        }
        return pload;
      },
      [isValid],
    );

    const processORCIdentify = useCallback(
      async (inforVerify, callback) => {
        if (inforVerify?.imgURL && callback) {
          setError(false);
          setIsProcessing(true);
          setIdTypeProcess(inforVerify?.typeIdCard);
          const idType = inforVerify?.typeIdCard === 'BACK' ? '1' : '0';
          const sideType =
            inforVerify?.typeIdCard === CameraOptions.frontCitizenCard.typeIdCard ? '1' : '2';
          const data = await getDataFromImage(inforVerify?.imgURL, idType, sideType);
          setIsProcessing(false);
          setIdTypeProcess(null);
          callback(inforVerify, data);
        }
      },
      [getDataFromImage],
    );

    const onClosePreviewImage = useCallback(() => {
      setArrImg([]);
      setIsVisiblePreviewImage(false);
    }, []);

    const onOpenPreviewImage = useCallback(() => {
      setIsVisiblePreviewImage(true);
    }, []);

    const setArrImagePreview = useCallback((payload) => {
      setArrImg(payload);
    }, []);

    const onRecordSelfie = async (options, callbackData) => {
      const graned = await checkPermissonCamera();
      if (graned) {
        onHandlerVideoSelfie(options, callbackData);
      }
    };

    const onSetServiceType = (type) => {
      serviceType.current = type;
    };

    /* <------------------- Render -------------------> */
    return (
      <View style={styles.wrapper}>
        <WrapperComponent
          {...props}
          idTypeProcess={idTypeProcess}
          errorVerifyORC={error}
          errorVerifyMessage={errorMessage}
          isProcessingORC={isProcessing}
          cameraActionsProps={{ onOpenCamera, processORCIdentify, onRecordSelfie }}
          previewImageProps={{ onOpenPreviewImage, setArrImagePreview }}
          setServiceType={onSetServiceType}
        />
        {props?.checkLiveness && typeof props?.checkLiveness === 'function' ? (
          <PhotoPickerLiveness ref={photoPickerRef} />
        ) : (
          <PhotoPicker ref={photoPickerRef} />
        )}
        <PopupPreviewImage
          onClose={onClosePreviewImage}
          isVisible={isVisiblePreviewImage}
          arrayImg={arrImg}
        />
      </View>
    );
  });
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default withCameraPicker;
