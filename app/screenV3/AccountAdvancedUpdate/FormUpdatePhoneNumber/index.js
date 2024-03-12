import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, View, Image } from 'react-native';
import isEmpty from 'lodash/isEmpty';

import IdentifyCardImport from '../../../componentV3/IdentifyCardImport';
import CustomInput from '../../../componentV3/CustomInput';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import AppText from '../../../componentV3/AppText';
import withCameraPicker from '../../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../../constants/cameraObjKeys';

import { KEY_MAP } from '../AccountAdvancedUpdate.contants';

import styles from './styles';

import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';
import { SERVICE_TYPE } from '../../../componentV3/HOCs/constants';
import { showAlert } from '../../../utils/UIUtils';

const FormUpdatePhoneNumber = (
  {
    onSubmitUpdatePhoneNumber,
    cameraActionsProps,
    isProcessingORC,
    errorVerifyORC,
    idTypeProcess,
    previewImageProps,
    userMetaData,
    errorCheckPhone,
    errorVerifyMessage,
    errorMessageCheckPhone,
    setServiceType,
  },
  ref,
) => {
  // state
  const [frontCMNDUrl, setFrontCMNDUrl] = useState(null);
  const [backCMNDUrl, setBackCMNDUrl] = useState(null);
  const [isMatch, setIsMatch] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [errorFrontImg, setErrorFrontImg] = useState(false);
  const [errorBackImg, setErrorBackImg] = useState(false);

  const [errorMessFrontImg, setErrorMessFrontImg] = useState('');
  const [errorMessBackImg, setErrorMessBackImg] = useState('');

  const [citizenCardInfor, setCitizenCardInfor] = useState({});

  // ref
  const phoneNumberRef = useRef(null);

  const isValid = useCallback((val1, val2) => {
    if (isEmpty(val1) || isEmpty(val2)) return false;
    return val1?.toLowerCase() === val2?.toLowerCase();
  }, []);

  useEffect(() => {
    if (
      !isEmpty(citizenCardInfor) &&
      frontCMNDUrl &&
      backCMNDUrl &&
      userMetaData &&
      !isProcessingORC &&
      !errorVerifyORC
    ) {
      const result = KEY_MAP.every((key) => isValid(citizenCardInfor[key], userMetaData[key]));
      setIsMatch(result);
    }
  }, [frontCMNDUrl, backCMNDUrl, citizenCardInfor, userMetaData, isProcessingORC, errorVerifyORC]);

  useEffect(() => {
    if (idTypeProcess === 'FRONT') {
      setErrorFrontImg(errorVerifyORC);
      setErrorMessFrontImg(errorVerifyMessage);
    }
    if (idTypeProcess === 'BACK') {
      setErrorBackImg(errorVerifyORC);
      setErrorMessBackImg(errorVerifyMessage);
    }
  }, [isProcessingORC, idTypeProcess, errorVerifyORC, errorVerifyMessage]);

  useEffect(() => {
    setServiceType(SERVICE_TYPE.BLUE_INFO);
  }, [setServiceType]);

  const onChangePhoneNumber = useCallback(
    (value) => {
      setPhoneNumber(value);
    },
    [phoneNumber],
  );

  const onClearText = useCallback(() => {
    setPhoneNumber('');
  }, [setPhoneNumber]);

  const callbackCameraPicker = useCallback(
    (inforVerify, payload) => {
      if (payload) {
        const newPay = { ...(citizenCardInfor || {}), ...payload };
        setCitizenCardInfor(newPay);
      }
    },
    [citizenCardInfor],
  );

  const onDisabled = useCallback(() => {
    return (
      !isMatch || isEmpty(phoneNumber) || phoneNumber?.length < 10 || !frontCMNDUrl || !backCMNDUrl
    );
  }, [isMatch, phoneNumber, frontCMNDUrl, backCMNDUrl]);

  const onPressImportImage = useCallback(
    (type, isForkOpenCamera) => {
      if (isProcessingORC) return;
      switch (type) {
        case 'FRONT':
          if (frontCMNDUrl && !isForkOpenCamera) {
            previewImageProps.setArrImagePreview(getArrImagePreview(type));
            previewImageProps.onOpenPreviewImage();
            return;
          }
          cameraActionsProps.onOpenCamera(CameraOptions.frontCitizenCard, (frontImgURL) => {
            setFrontCMNDUrl(frontImgURL);
            // if (!backCMNDUrl) {
            //   cameraActionsProps.onOpenCamera(CameraOptions.backCitizenCard, (backImgUrl) => {
            //     setBackCMNDUrl(backImgUrl);
            //     cameraActionsProps.processORCIdentify(
            //       { imgURL: frontImgURL, ...CameraOptions.frontCitizenCard },
            //       (inforVerifyFront, payloadFront) => {
            //         callbackCameraPicker(inforVerifyFront, payloadFront);
            //         cameraActionsProps.processORCIdentify(
            //           { imgURL: backImgUrl, ...CameraOptions.backCitizenCard },
            //           (inforVerifyBack, payloadBack) => {
            //             callbackCameraPicker(inforVerifyBack, { ...payloadFront, ...payloadBack });
            //           },
            //         );
            //       },
            //     );
            //   });
            // } else {
            cameraActionsProps.processORCIdentify(
              { imgURL: frontImgURL, ...CameraOptions.frontCitizenCard },
              (inforVerifyFront, payloadFront) => {
                callbackCameraPicker(inforVerifyFront, payloadFront);
              },
            );
            // }
          });
          break;
        case 'BACK':
          if (!frontCMNDUrl || !citizenCardInfor?.countryIdNumber) {
            showAlert(
              !frontCMNDUrl
                ? 'Vui lòng chụp mặt trước CMND/CCCD đầu tiên'
                : 'Vui lòng chụp lại mặt trước CMND/CCCD',
              'MFast',
              [
                {
                  text: 'Quay lại',
                },
                {
                  text: !frontCMNDUrl ? 'Chụp mặt trước' : 'Chụp lại mặt trước',
                  onPress: () => {
                    if (!frontCMNDUrl) {
                      onPressImportImage('FRONT');
                    } else {
                      onPressRemove('FRONT');
                      onPressImportImage('FRONT', true);
                    }
                  },
                },
              ],
            );
            return;
          }
          if (backCMNDUrl) {
            previewImageProps.setArrImagePreview(getArrImagePreview(type));
            previewImageProps.onOpenPreviewImage();
            return;
          }
          cameraActionsProps.onOpenCamera(CameraOptions.backCitizenCard, (backImgUrl) => {
            setBackCMNDUrl(backImgUrl);
            cameraActionsProps.processORCIdentify(
              { imgURL: backImgUrl, ...CameraOptions.backCitizenCard },
              (inforVerifyBack, payloadBack) => {
                callbackCameraPicker(inforVerifyBack, payloadBack);
              },
            );
          });
          break;
        default:
          break;
      }
    },
    [
      cameraActionsProps,
      isProcessingORC,
      callbackCameraPicker,
      frontCMNDUrl,
      backCMNDUrl,
      citizenCardInfor,
      getArrImagePreview,
    ],
  );

  const getArrImagePreview = useCallback(
    (previewType) => {
      const arr = [];
      if (frontCMNDUrl) {
        arr.push(frontCMNDUrl);
      }
      if (backCMNDUrl) {
        arr.push(backCMNDUrl);
      }
      if (previewType === 'BACK') {
        arr.reverse();
      }
      return arr;
    },
    [frontCMNDUrl, backCMNDUrl],
  );

  const onPressRemove = useCallback((type) => {
    switch (type) {
      case 'FRONT':
        setIsMatch(false);
        setFrontCMNDUrl(null);
        break;
      case 'BACK':
        setIsMatch(false);
        setBackCMNDUrl(null);
        break;
      default:
        break;
    }
  }, []);

  const onStatisSubmit = useCallback(() => {
    if (onSubmitUpdatePhoneNumber && phoneNumber) {
      onSubmitUpdatePhoneNumber(phoneNumber);
    }
  }, [phoneNumber, onSubmitUpdatePhoneNumber]);
  const renderMatchCMND = useCallback(() => {
    if (
      !isProcessingORC &&
      frontCMNDUrl &&
      backCMNDUrl &&
      !errorVerifyORC &&
      !errorFrontImg &&
      !errorBackImg
    ) {
      if (isMatch) {
        return (
          <View style={styles.errorContainer}>
            <AppText style={styles.indicatorSuccess}>{`Hình chụp CMND/ CCCD hợp lệ`}</AppText>
          </View>
        );
      }
      return (
        <View style={styles.errorContainer}>
          <AppText style={styles.indicatorError}>
            {`Hình chụp CMND/ CCCD không khớp, Vui lòng thử chụp lại (chụp cận cảnh, rõ nét, hiển thị đủ 4 góc CMND)`}
          </AppText>
        </View>
      );
    }
    return <View />;
  }, [
    isMatch,
    isProcessingORC,
    frontCMNDUrl,
    backCMNDUrl,
    errorVerifyORC,
    errorFrontImg,
    errorBackImg,
  ]);

  return (
    <View>
      <View style={styles.formWrapper}>
        <AppText style={styles.label1}>Hình chụp CMND/CCCD đã định danh tài khoản</AppText>
        <View style={styles.identifyCardContainer}>
          <IdentifyCardImport
            type="FRONT"
            isProcessing={isProcessingORC && idTypeProcess === 'FRONT'}
            onPress={onPressImportImage}
            sourceUrl={frontCMNDUrl}
            onPressRemove={onPressRemove}
            offset={12}
            width={SW(163) * 0.93}
            height={SH(111) * 0.93}
          />
          <IdentifyCardImport
            type="BACK"
            isProcessing={isProcessingORC && idTypeProcess === 'BACK'}
            onPress={onPressImportImage}
            sourceUrl={backCMNDUrl}
            onPressRemove={onPressRemove}
            offset={12}
            width={SW(163) * 0.93}
            height={SH(111) * 0.93}
          />
        </View>
        {errorFrontImg && (
          <View style={styles.errorContainer}>
            <Image source={ICON_PATH.warning} />
            <AppText style={styles.indicatorError}>
              {errorMessFrontImg || 'Hình chụp mặt trước CMND/ CCCD không đúng'}
            </AppText>
          </View>
        )}
        {errorBackImg && (
          <View style={styles.errorContainer}>
            <Image source={ICON_PATH.warning} />
            <AppText style={styles.indicatorError}>
              {errorMessBackImg || 'Hình chụp mặt sau CMND/ CCCD không đúng'}
            </AppText>
          </View>
        )}
        {renderMatchCMND()}
        <AppText style={styles.label1}>Số điện thoại đăng nhập mới</AppText>
        <CustomInput
          ref={phoneNumberRef}
          value={phoneNumber}
          error={errorCheckPhone}
          errorMessage={errorMessageCheckPhone}
          placeholder="Nhập SĐT"
          onChangeText={onChangePhoneNumber}
          onClearText={onClearText}
          keyboardType="decimal-pad"
          textInputStyle={{ backgroundColor: Colors.primary5, borderRadius: 8, height: SH(46) }}
        />
      </View>
      <View style={styles.indicatorBottomContainer}>
        <AppText bold style={styles.wraningIndicator}>
          Lưu ý:
        </AppText>
        <AppText style={styles.descWraningIndicator}>
          Nếu thông tin tự điền từ hình chụp trên không đúng, vui lòng thử chụp lại (chụp cận cảnh,
          rõ nét, hiển thị đủ 4 góc CMND)
        </AppText>
      </View>
      <View key="BOTTOM-BUTTON" style={styles.buttonWrapper}>
        <SubmitButton disabled={onDisabled()} onPress={onStatisSubmit} label={'Cập nhật'} />
      </View>
    </View>
  );
};

export default withCameraPicker(FormUpdatePhoneNumber);
