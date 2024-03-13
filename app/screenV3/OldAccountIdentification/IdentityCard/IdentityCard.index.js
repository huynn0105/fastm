import React, { useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';

import { ENUM_COUNTRY_ID_STATUS } from '../../../models/userMeta';

import IdentifyCardImport from '../../../componentV3/IdentifyCardImport';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import SamplePhotoPreview from '../../../componentV3/SamplePhotoPreview';
import withCameraPicker from '../../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../../constants/cameraObjKeys';
import AppText from '../../../componentV3/AppText';

import styles from './IdentityCard.style';

import Colors from '.././../../theme/Color';

import { ICON_PATH } from '../../../assets/path';

const IDCheck = {
  AGREED: 'AGREED',
  WRONG_INFOR: 'WRONG_INFOR',
};

function ItemVerifyCMND({ key, label, value, isProcessing }) {
  return (
    <View style={styles.itemVerifyContainer} key={key}>
      <AppText style={styles.labelTxt}>{label}</AppText>
      {isProcessing ? (
        <ActivityIndicator size="small" color={Colors.neutral3} />
      ) : (
        <AppText style={styles.valueTxt}>{value || '---'}</AppText>
      )}
    </View>
  );
}

function IdentityCard({
  citizenIdentify,
  onHandlerNextStep,
  previewImageProps,
  cameraActionsProps,
  isProcessingORC,
  errorVerifyORC,
  idTypeProcess,
  countryIdStatus,
  errorMessageCMND,
  errorVerifyMessage,
  onChangeErrorMessageCMND,
}) {
  // state
  const [frontCMNDUrl, setFrontCMNDUrl] = useState(null);
  const [backCMNDUrl, setBackCMNDUrl] = useState(null);
  const [orcInfor, setORCInfor] = useState({});
  const [timeRemoveImage, setTimeRemoveImage] = useState(0);
  const [isVisibleSample, setIsVisibleSample] = useState(false);
  const [idChecked, setIdCheck] = useState(null);
  const [note, onChangeNote] = useState('');

  const [errorFrontImg, setErrorFrontImg] = useState(false);
  const [errorBackImg, setErrorBackImg] = useState(false);

  const [errorMessFrontImg, setErrorMessFrontImg] = useState('');
  const [errorMessBackImg, setErrorMessBackImg] = useState('');

  const [errorMissCountryId, setErrorMissCountryId] = useState(false);

  useEffect(() => {
    if (citizenIdentify) {
      const { countryIdPhotoFront, countryIdPhotoBack, countryIdNote, countryIdStatus } =
        citizenIdentify;
      if (countryIdPhotoFront) {
        setFrontCMNDUrl(countryIdPhotoFront);
      }
      if (countryIdPhotoBack) {
        setBackCMNDUrl(countryIdPhotoBack);
      }
      if (countryIdNote) {
        onChangeNote(countryIdNote);
      }
      if (countryIdStatus) {
        if (countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING) {
          setTimeRemoveImage(3);
          setIdCheck(IDCheck.WRONG_INFOR);
        }
        if (countryIdStatus === ENUM_COUNTRY_ID_STATUS.FAILURE) {
          setTimeRemoveImage(3);
          setIdCheck(IDCheck.WRONG_INFOR);
        }
        if (countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
          setIdCheck(IDCheck.AGREED);
        }
      }
      setORCInfor({
        countryIdDateOfBirth: citizenIdentify?.countryIdDateOfBirth || '',
        countryIdIssuedBy: citizenIdentify?.countryIdIssuedBy || '',
        countryIdIssuedDate: citizenIdentify?.countryIdIssuedDate || '',
        countryIdName: citizenIdentify?.countryIdName || '',
        countryIdNumber: citizenIdentify?.countryIdNumber || '',
        countryIdAddress: citizenIdentify?.countryIdAddress || '',
      });
    } else {
      setFrontCMNDUrl(null);
      setBackCMNDUrl(null);
      setORCInfor({});
    }
  }, [citizenIdentify, onChangeErrorMessageCMND]);

  useEffect(() => {
    if (
      backCMNDUrl &&
      frontCMNDUrl &&
      orcInfor &&
      !isProcessingORC &&
      !errorFrontImg &&
      !errorBackImg
    ) {
      setErrorMissCountryId(!orcInfor?.countryIdNumber);
    } else {
      setErrorMissCountryId(false);
    }
  }, [backCMNDUrl, frontCMNDUrl, orcInfor, isProcessingORC, errorFrontImg, errorBackImg]);

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

  const onSubmit = useCallback(() => {
    if (onHandlerNextStep) {
      const payload = {
        ...orcInfor,
        countryIdPhotoFront: frontCMNDUrl,
        countryIdPhotoBack: backCMNDUrl,
      };
      // confirmed state
      if (idChecked === IDCheck.WRONG_INFOR) {
        payload.countryIdStatus = ENUM_COUNTRY_ID_STATUS.PENDING;
        // update note if have
        if (note) {
          payload.countryIdNote = note;
        }
      } else {
        payload.countryIdStatus = ENUM_COUNTRY_ID_STATUS.SUCCESS;
      }
      onHandlerNextStep(payload);
    }
  }, [orcInfor, note, idChecked, backCMNDUrl, frontCMNDUrl]);

  const callbackCameraPicker = useCallback(
    (inforVerify, payload) => {
      if (payload) {
        const newPay = { ...(orcInfor || {}), ...payload };
        setORCInfor(newPay);
      }
    },
    [orcInfor],
  );

  const onPressImportImage = useCallback(
    (type) => {
      if (isProcessingORC) return;
      if (countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
        previewImageProps.setArrImagePreview(getArrImagePreview(type));
        previewImageProps.onOpenPreviewImage();
        return;
      }
      switch (type) {
        case 'FRONT':
          if (frontCMNDUrl) {
            previewImageProps.setArrImagePreview(getArrImagePreview(type));
            previewImageProps.onOpenPreviewImage();
            return;
          }
          cameraActionsProps.onOpenCamera(CameraOptions.frontCitizenCard, (frontImgURL) => {
            setFrontCMNDUrl(frontImgURL);
            if (!backCMNDUrl) {
              cameraActionsProps.onOpenCamera(CameraOptions.backCitizenCard, (backImgUrl) => {
                setBackCMNDUrl(backImgUrl);
                cameraActionsProps.processORCIdentify(
                  { imgURL: frontImgURL, ...CameraOptions.frontCitizenCard },
                  (inforVerifyFront, payloadFront) => {
                    callbackCameraPicker(inforVerifyFront, payloadFront);
                    cameraActionsProps.processORCIdentify(
                      { imgURL: backImgUrl, ...CameraOptions.backCitizenCard },
                      (inforVerifyBack, payloadBack) => {
                        callbackCameraPicker(inforVerifyBack, { ...payloadBack, ...payloadFront });
                      },
                    );
                  },
                );
              });
            } else {
              cameraActionsProps.processORCIdentify(
                { imgURL: frontImgURL, ...CameraOptions.frontCitizenCard },
                (inforVerifyFront, payloadFront) => {
                  callbackCameraPicker(inforVerifyFront, payloadFront);
                },
              );
            }
          });
          break;
        case 'BACK':
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
      countryIdStatus,
      orcInfor,
      cameraActionsProps,
      isProcessingORC,
      callbackCameraPicker,
      frontCMNDUrl,
      backCMNDUrl,
    ],
  );

  const onPressRemove = useCallback(
    (type) => {
      switch (type) {
        case 'FRONT':
          onChangeErrorMessageCMND('');
          setTimeRemoveImage(timeRemoveImage + 1);
          setFrontCMNDUrl(null);
          if (!backCMNDUrl) {
            setORCInfor({});
          }
          break;
        case 'BACK':
          onChangeErrorMessageCMND('');
          setTimeRemoveImage(timeRemoveImage + 1);
          setBackCMNDUrl(null);
          if (!frontCMNDUrl) {
            setORCInfor({});
          }
          break;
        default:
          break;
      }
    },
    [timeRemoveImage, onChangeErrorMessageCMND, backCMNDUrl, frontCMNDUrl],
  );

  const onSamplePress = useCallback(() => {
    setIsVisibleSample(!isVisibleSample);
  }, [isVisibleSample]);

  const checkDisabledSubmitButton = useCallback(() => {
    if (idChecked === IDCheck.WRONG_INFOR) {
      return isEmpty(frontCMNDUrl) || isEmpty(backCMNDUrl) || isProcessingORC;
    }
    return (
      isEmpty(frontCMNDUrl) ||
      isEmpty(backCMNDUrl) ||
      isProcessingORC ||
      errorVerifyORC ||
      !idChecked ||
      errorBackImg ||
      errorFrontImg ||
      !!errorMessageCMND ||
      !orcInfor?.countryIdNumber ||
      !orcInfor?.countryIdName
    );
  }, [
    errorMessageCMND,
    orcInfor,
    frontCMNDUrl,
    backCMNDUrl,
    isProcessingORC,
    errorVerifyORC,
    idChecked,
    errorBackImg,
    errorFrontImg,
  ]);

  const onPressAgree = useCallback(() => {
    if (idChecked === IDCheck.AGREED) {
      setIdCheck(null);
    } else {
      setIdCheck(IDCheck.AGREED);
    }
  }, [idChecked]);
  const onPressWrongInfor = useCallback(() => {
    if (idChecked === IDCheck.WRONG_INFOR) {
      setIdCheck(null);
    } else {
      setIdCheck(IDCheck.WRONG_INFOR);
    }
  }, [idChecked]);

  const renderCheckBox = useCallback(() => {
    if (
      !citizenIdentify ||
      (citizenIdentify && countryIdStatus !== ENUM_COUNTRY_ID_STATUS.SUCCESS)
    ) {
      return (
        <View style={styles.checkboxContainer}>
          {countryIdStatus === ENUM_COUNTRY_ID_STATUS.FAILURE ? null : (
            <TouchableOpacity onPress={onPressAgree}>
              <View style={styles.sendSupportContainer}>
                <Image
                  source={
                    idChecked === IDCheck.AGREED ? ICON_PATH.checkbox_ac : ICON_PATH.checkbox_round
                  }
                  style={styles.icCheck}
                />
                <AppText
                  style={idChecked === IDCheck.AGREED ? styles.txtChecked : styles.txtCheckNormal}
                >
                  Tôi xác nhận thông tin trên là chính xác
                </AppText>
              </View>
            </TouchableOpacity>
          )}
          {frontCMNDUrl && backCMNDUrl && timeRemoveImage > 2 && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={onPressWrongInfor}>
                <View style={styles.sendSupportContainer}>
                  <View style={{ height: '100%', alignItems: 'flex-start' }}>
                    <Image
                      source={
                        idChecked === IDCheck.WRONG_INFOR
                          ? ICON_PATH.checkbox_ac
                          : ICON_PATH.checkbox_round
                      }
                      style={styles.icCheck}
                    />
                  </View>
                  <AppText
                    style={
                      idChecked === IDCheck.WRONG_INFOR ? styles.txtChecked : styles.txtCheckNormal
                    }
                  >
                    Thông tin trên không chính xác, yêu cầu hỗ trợ cập nhật lại.
                  </AppText>
                </View>
              </TouchableOpacity>
              {idChecked === IDCheck.WRONG_INFOR && (
                <View style={{ flex: 1, marginLeft: 30 }}>
                  <TextInput
                    multiline={true}
                    placeholder="Ghi chú (nếu có)"
                    style={styles.note}
                    value={note}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeNote(text)}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      );
    }
    return <View />;
  }, [
    idChecked,
    note,
    frontCMNDUrl,
    backCMNDUrl,
    !errorVerifyORC,
    timeRemoveImage,
    citizenIdentify,
  ]);

  const renderSuccessReview = useCallback(() => {
    if (citizenIdentify && countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
      return (
        <View style={styles.successContainer}>
          <Image source={ICON_PATH.success} style={styles.ic} />
          <AppText style={styles.successTxt}>Đã cập nhật thông tin</AppText>
        </View>
      );
    }
    return <View />;
  }, [citizenIdentify, countryIdStatus]);

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

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.wrapper}>
        <View style={[styles.wrapper, { paddingBottom: 250 }]}>
          <View style={styles.importCMNDContainer}>
            <View style={styles.titleContainer}>
              <AppText style={styles.topIndicator}>
                Hình chụp
                <AppText style={{ fontWeight: 'bold' }}>{' 2 mặt '}</AppText>
                CMND/CCCD
              </AppText>
              <AppText onPress={onSamplePress} style={styles.suggestIndicator}>
                Xem mẫu
              </AppText>
            </View>
            <View style={styles.identifyCardContainer}>
              <IdentifyCardImport
                type="FRONT"
                disabledRemove={countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS}
                isProcessing={isProcessingORC && idTypeProcess === 'FRONT'}
                onPress={onPressImportImage}
                sourceUrl={frontCMNDUrl}
                onPressRemove={onPressRemove}
              />
              <IdentifyCardImport
                type="BACK"
                disabledRemove={countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS}
                isProcessing={isProcessingORC && idTypeProcess === 'BACK'}
                onPress={onPressImportImage}
                sourceUrl={backCMNDUrl}
                onPressRemove={onPressRemove}
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
            {errorMissCountryId && (
              <View style={styles.errorContainer}>
                <Image source={ICON_PATH.warning} />
                <AppText style={styles.indicatorError}>Không tìm thấy số CMND/CCCD</AppText>
              </View>
            )}
          </View>
          <View style={styles.inforVerifyContainer}>
            <AppText style={styles.importIndicator}>
              Thông tin tương ứng <AppText style={{ fontWeight: 'bold' }}>từ hình chụp</AppText>
            </AppText>
            <View style={styles.boxVerify}>
              <ItemVerifyCMND
                label="Họ tên"
                value={orcInfor?.countryIdName}
                isProcessing={isProcessingORC}
              />
              <View style={styles.divider} />
              {/* <ItemVerifyCMND
                                label="Ngày sinh"
                                value={orcInfor?.countryIdDateOfBirth}
                                isProcessing={isProcessingORC}
                            />
                            <View style={styles.divider} /> */}
              <ItemVerifyCMND
                label="Số CMND/ CCCD"
                value={orcInfor?.countryIdNumber}
                isProcessing={isProcessingORC}
              />
              <View style={styles.divider} />
              <ItemVerifyCMND
                label="Ngày cấp"
                value={orcInfor?.countryIdIssuedDate}
                isProcessing={isProcessingORC}
              />
              <View style={styles.divider} />
              <ItemVerifyCMND
                label="Nơi cấp"
                value={orcInfor?.countryIdIssuedBy}
                isProcessing={isProcessingORC}
              />
              {/* <View style={styles.divider} />
                            <ItemVerifyCMND
                                label="Địa chỉ thường trú"
                                value={orcInfor?.countryIdAddress}
                                isProcessing={isProcessingORC}
                            /> */}
            </View>
            {renderSuccessReview()}
            {renderCheckBox()}
            {!!errorMessageCMND && (
              <View style={styles.errorDupContainer}>
                <Image source={ICON_PATH.warning} />
                <AppText style={styles.txtErrorDup}>{errorMessageCMND}</AppText>
              </View>
            )}
            <View style={styles.indicatorBottomContainer}>
              <AppText style={styles.wraningIndicator}>Lưu ý:</AppText>
              <AppText style={styles.descWraningIndicator}>
                - <AppText style={styles.wraningIndicator}>Thông tin không chính xác </AppText>có
                thể ảnh hưởng đến các quyền lợi về khấu trừ thuế và chi trả thu nhập trên MFast.
              </AppText>
              <AppText style={styles.descWraningIndicator}>
                - Nếu thông tin từ hình chụp trên không đúng, vui lòng thử chụp lại (chụp cận cảnh,
                rõ nét, hiển thị đủ 4 góc CMND).
              </AppText>
            </View>
            <SubmitButton
              disabled={checkDisabledSubmitButton()}
              onPress={onSubmit}
              label={
                idChecked === IDCheck.WRONG_INFOR ? 'Yêu cầu hỗ trợ' : 'Bước cuối: Hợp đồng dịch vụ'
              }
            />
          </View>
        </View>
      </ScrollView>
      <SamplePhotoPreview
        isVisible={isVisibleSample}
        onCloseAvatarSamplePress={onSamplePress}
        typeSample="CMND"
      />
    </View>
  );
}

export default withCameraPicker(IdentityCard);
