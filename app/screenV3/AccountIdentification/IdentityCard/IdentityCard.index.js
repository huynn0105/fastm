import React, { useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
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
import commonStyle from '../../../constants/styles';

import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { SH, SW } from '../../../constants/styles';
import Video from 'react-native-video';
import { AsyncStorageKeys } from '../../../constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppInfoDefault, fonts } from '../../../constants/configs';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../../redux/selectors/userMetaDataSelectors';
import _ from 'lodash';

const IDCheck = {
  AGREED: 'AGREED',
  WRONG_INFOR: 'WRONG_INFOR',
};

export const STATUS_LIVENESS_CHECK = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

let TIME_FAIL_EKYC = 3;

function IdentityCard({
  onHandlerNextStep,
  previewImageProps,
  cameraActionsProps,
  isProcessingORC,
  errorVerifyORC,
  idTypeProcess,
  errorMessageCMND,
  errorVerifyMessage,
  onChangeErrorMessageCMND,
  checkLiveness,
  navigation,
  myUser,
  lockEkyc,
  lockEkycAfter3Times,
  disabled,
}) {
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);

  // state
  const [frontCMNDUrl, setFrontCMNDUrl] = useState(null);
  const [backCMNDUrl, setBackCMNDUrl] = useState(null);
  const [orcInfor, setORCInfor] = useState({});
  const [videoUri, setVideoUri] = useState('');

  const [isVisibleSample, setIsVisibleSample] = useState(false);
  const [idChecked, setIdCheck] = useState(null);
  const [note, setNote] = useState('');

  const [errorFrontImg, setErrorFrontImg] = useState(false);
  const [errorBackImg, setErrorBackImg] = useState(false);

  const [errorMessFrontImg, setErrorMessFrontImg] = useState('');
  const [errorMessBackImg, setErrorMessBackImg] = useState('');

  const [faceMatch, setFaceMatch] = useState(false);
  const [messageFaceMatch, setMessageFaceMatch] = useState('');
  const [isLoadingFaceMatch, setIsLoadingFaceMatch] = useState(false);

  const [isLockEkyc, setIsLockEkyc] = useState(userMetaData?.isLockedKyc);

  const [manualCheck, setManualCheck] = useState(false);

  const actionSheetRef = useRef(null);

  useEffect(() => {
    setFrontCMNDUrl((prev) => prev || userMetaData?.countryIdPhotoFront);
    setBackCMNDUrl((prev) => prev || userMetaData?.countryIdPhotoBack);
    setVideoUri(
      (prev) => prev || userMetaData?.videoSelfie || userMetaData?.livenessWithIdNumberPending,
    );
    setNote(userMetaData?.countryIdNote);
    if (userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING) {
      setIdCheck(IDCheck.WRONG_INFOR);
    }
    if (userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.FAILURE) {
      setIdCheck(IDCheck.WRONG_INFOR);
    }
    if (userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
      setIdCheck(IDCheck.AGREED);
    }
    const defaultORC = {};
    if (userMetaData?.countryIdDateOfBirth) {
      defaultORC.countryIdDateOfBirth = userMetaData?.countryIdDateOfBirth;
    }
    if (userMetaData?.countryIdIssuedBy) {
      defaultORC.countryIdIssuedBy = userMetaData?.countryIdIssuedBy;
    }
    if (userMetaData?.countryIdIssuedDate) {
      defaultORC.countryIdIssuedDate = userMetaData?.countryIdIssuedDate;
    }
    if (userMetaData?.countryIdName) {
      defaultORC.countryIdName = userMetaData?.countryIdName;
    }
    if (userMetaData?.countryIdNumber) {
      defaultORC.countryIdNumber = userMetaData?.countryIdNumber;
    }
    if (userMetaData?.countryIdAddress) {
      defaultORC.countryIdAddress = userMetaData?.countryIdAddress;
    }
    if (userMetaData?.countryIdHomeAddress) {
      defaultORC.countryIdHomeAddress = userMetaData?.countryIdHomeAddress;
    }

    // if (Object.keys(defaultORC)?.length > 0) {
    //   setORCInfor((prevState) => ({ ...(prevState || {}), ...(defaultORC || {}) }));
    // }
  }, [
    userMetaData?.countryIdAddress,
    userMetaData?.countryIdDateOfBirth,
    userMetaData?.countryIdHomeAddress,
    userMetaData?.countryIdIssuedBy,
    userMetaData?.countryIdIssuedDate,
    userMetaData?.countryIdName,
    userMetaData?.countryIdNote,
    userMetaData?.countryIdNumber,
    userMetaData?.countryIdPhotoBack,
    userMetaData?.countryIdPhotoFront,
    userMetaData?.countryIdStatus,
    userMetaData?.livenessWithIdNumberPending,
    userMetaData?.videoSelfie,
  ]);

  useEffect(() => {
    const checkIsManualEkyc = async () => {
      const isManual = await AsyncStorage.getItem(AsyncStorageKeys.MANUAL_CHECK_EKYC);
      if (!isManual || isManual === '0') {
        setManualCheck(false);
      } else {
        setManualCheck(true);
      }
    };
    checkIsManualEkyc();
    // if (!isLockEkyc) {
    //   setTimeout(() => {
    //     if (videoUri?.length > 0) {
    //       checkFaceMatch(videoUri, frontCMNDUrl);
    //     }
    //   }, 1000);
    // }
  }, [
    checkFaceMatch,
    frontCMNDUrl,
    isLockEkyc,
    userMetaData,
    userMetaData.livenessWithIdNumberStatus,
    videoUri,
  ]);
  useEffect(() => {
    setIsLockEkyc(userMetaData?.isLockedKyc);
  }, [userMetaData]);
  useEffect(() => {
    TIME_FAIL_EKYC = 3;
    if (
      userMetaData?.livenessDocFrontUrl?.length > 0 &&
      userMetaData?.livenessDocBackUrl?.length > 0
    ) {
      setFrontCMNDUrl(userMetaData?.livenessDocFrontUrl);
      setBackCMNDUrl(userMetaData?.livenessDocBackUrl);
      setVideoUri(userMetaData?.livenessWithIdNumberPending || userMetaData?.videoSelfie);
      setTimeout(() => {
        cameraActionsProps.processORCIdentify(
          { imgURL: userMetaData?.livenessDocFrontUrl, ...CameraOptions.frontCitizenCard },
          (inforVerifyFront, payloadFront) => {
            if (__DEV__) {
              console.log(`front1`, payloadFront);
            }
            callbackCameraPicker(inforVerifyFront, payloadFront);
            cameraActionsProps.processORCIdentify(
              { imgURL: userMetaData?.livenessDocBackUrl, ...CameraOptions.backCitizenCard },
              (inforVerifyBack, payloadBack) => {
                if (__DEV__) {
                  console.log(`back1`, payloadBack);
                }
                callbackCameraPicker(inforVerifyBack, payloadBack);
              },
            );
          },
        );
      }, 100);
    }
  }, []);

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
        videoSelfie: videoUri,
        livenessWithIdNumberStatus: '',
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
    // onHandlerNextStep();
  }, [onHandlerNextStep, orcInfor, frontCMNDUrl, backCMNDUrl, videoUri, idChecked, note]);

  const callbackCameraPicker = useCallback((inforVerify, payload) => {
    setORCInfor((prevState) => {
      const newState = { ...(prevState || {}), ...(payload || {}) };

      return newState;
    });
  }, []);

  const onPressImportImage = useCallback(
    (type) => {
      if (isProcessingORC) return;
      if (isLockEkyc) return;
      if (userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
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
            if (videoUri) {
              setTimeout(() => {
                checkFaceMatch(videoUri, frontImgURL);
              }, 1000);
            }
            if (!backCMNDUrl) {
              cameraActionsProps.onOpenCamera(CameraOptions.backCitizenCard, (backImgUrl) => {
                setBackCMNDUrl(backImgUrl);
              });
            } else {
              cameraActionsProps.processORCIdentify(
                { imgURL: frontImgURL, ...CameraOptions.frontCitizenCard },
                (inforVerifyFront, payloadFront) => {
                  if (__DEV__) {
                    console.log(`front2`, payloadFront);
                  }
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
          });

          break;
        default:
          break;
      }
    },
    [
      isProcessingORC,
      isLockEkyc,
      userMetaData?.countryIdStatus,
      previewImageProps,
      getArrImagePreview,
      frontCMNDUrl,
      cameraActionsProps,
      backCMNDUrl,
      videoUri,
      checkFaceMatch,
      callbackCameraPicker,
    ],
  );

  useEffect(() => {
    if (frontCMNDUrl && backCMNDUrl) {
      cameraActionsProps.processORCIdentify(
        { imgURL: frontCMNDUrl, ...CameraOptions.frontCitizenCard },
        (inforVerifyFront, payloadFront) => {
          if (__DEV__) {
            console.log(`front3`, payloadFront);
          }
          callbackCameraPicker(inforVerifyFront, payloadFront);
          cameraActionsProps.processORCIdentify(
            { imgURL: backCMNDUrl, ...CameraOptions.backCitizenCard },
            (inforVerifyBack, payloadBack) => {
              if (__DEV__) {
                console.log(`back3`, payloadBack);
              }
              callbackCameraPicker(inforVerifyBack, payloadBack);
            },
          );
        },
      );
    }
  }, [backCMNDUrl, callbackCameraPicker, frontCMNDUrl]);

  const onPressRemove = useCallback(
    (type, callback) => {
      switch (type) {
        case 'FRONT':
          onChangeErrorMessageCMND('');
          setFrontCMNDUrl(null);
          if (!backCMNDUrl) {
            setORCInfor({});
          }
          if (callback) {
            callback();
          }
          break;
        case 'BACK':
          onChangeErrorMessageCMND('');
          setBackCMNDUrl(null);
          if (!frontCMNDUrl) {
            setORCInfor({});
          }
          if (callback) {
            callback();
          }
          break;
        default:
          break;
      }
    },
    [onChangeErrorMessageCMND, backCMNDUrl, frontCMNDUrl],
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
      // !idChecked ||
      !videoUri ||
      !faceMatch ||
      isLoadingFaceMatch ||
      errorBackImg ||
      errorFrontImg ||
      !!errorMessageCMND ||
      !orcInfor?.countryIdNumber ||
      !orcInfor?.countryIdName ||
      disabled
    );
  }, [
    idChecked,
    frontCMNDUrl,
    backCMNDUrl,
    isProcessingORC,
    errorVerifyORC,
    videoUri,
    faceMatch,
    isLoadingFaceMatch,
    errorBackImg,
    errorFrontImg,
    errorMessageCMND,
    orcInfor?.countryIdNumber,
    orcInfor?.countryIdName,
    disabled,
  ]);

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

  const renderContentPending = useCallback((status, noteText) => {
    const iconName =
      status === STATUS_LIVENESS_CHECK.PENDING
        ? ICON_PATH.statusPending
        : status === STATUS_LIVENESS_CHECK.SUCCESS
        ? ICON_PATH.statusSuccess
        : ICON_PATH.statusError;
    const textColor =
      status === STATUS_LIVENESS_CHECK.PENDING
        ? Colors.accent2
        : status === STATUS_LIVENESS_CHECK.SUCCESS
        ? Colors.secondGreen
        : '#ea4848';

    const label =
      status === STATUS_LIVENESS_CHECK.PENDING
        ? 'Chờ kiểm tra'
        : status === STATUS_LIVENESS_CHECK.SUCCESS
        ? 'Thành công'
        : 'Thất bại';
    return (
      <View
        style={[
          styles.containerStatusBarStyle,
          { borderColor: textColor, backgroundColor: `${textColor}33` },
        ]}
      >
        <View style={styles.rowViewSeparate}>
          <AppText style={[commonStyle.commonText, { color: Colors.gray5 }]}>
            Trạng thái hỗ trợ và ghi chú:
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={iconName} style={styles.ic} />
            <AppText
              semiBold
              style={[styles.statusTextStyle, { color: textColor, marginLeft: SW(8) }]}
            >
              {label}
            </AppText>
          </View>
        </View>
        {noteText?.length ? (
          <View style={styles.containerStatusNote}>
            <AppText style={commonStyle.commonTitleText}>{`- ${noteText}`}</AppText>
          </View>
        ) : null}
      </View>
    );
  }, []);

  const renderStatusManual = useCallback(() => {
    try {
      if (
        !userMetaData?.livenessWithIdNumberStatus ||
        disabled ||
        (!userMetaData?.livenessWithIdNumberNote && !userMetaData?.liveness_with_id_number_log)
      ) {
        return null;
      }
      let livenessLog = userMetaData?.liveness_with_id_number_log;

      try {
        livenessLog = JSON.parse(livenessLog);
      } catch (err) {}

      return renderContentPending(
        userMetaData?.livenessWithIdNumberStatus,
        userMetaData?.livenessWithIdNumberNote?.length > 0
          ? userMetaData?.livenessWithIdNumberNote
          : livenessLog,
      );
    } catch (error) {
      if (__DEV__) {
        console.log('error json parse', error);
      }
    }
  }, [
    disabled,
    renderContentPending,
    userMetaData?.livenessWithIdNumberNote,
    userMetaData?.livenessWithIdNumberStatus,
    userMetaData?.liveness_with_id_number_log,
  ]);

  const checkFaceMatch = useCallback(
    // eslint-disable-next-line no-shadow
    (videoUri, frontCMNDUrl) => {
      setIsLoadingFaceMatch(true);
      checkLiveness(videoUri, frontCMNDUrl, async (response) => {
        setIsLoadingFaceMatch(false);
        if (
          response?.status &&
          response?.data?.code === '200' &&
          response?.data?.face_match?.isMatch &&
          response?.data?.is_live
        ) {
          setFaceMatch(true);
          setVideoUri(response?.data?.path_video);
          setMessageFaceMatch('');
          setManualCheck(false);

          await AsyncStorage.setItem(AsyncStorageKeys.MANUAL_CHECK_EKYC, '0');
        } else {
          setVideoUri(response?.data?.path_video);
          setFaceMatch(false);
          setMessageFaceMatch(
            response?.message ||
              'Hình chân dung không khớp với hình trên CCCD,\n vui lòng thử chụp lại',
          );
          if (TIME_FAIL_EKYC > 0) {
            TIME_FAIL_EKYC -= 1;
          }
          if (TIME_FAIL_EKYC === 0) {
            setIsLockEkyc(true);
            lockEkycAfter3Times(response?.data?.path_video, frontCMNDUrl, backCMNDUrl, orcInfor);
          }
          // if (TIME_FAIL_EKYC === 1) {
          //   setManualCheck(true);
          //   await AsyncStorage.setItem(AsyncStorageKeys.MANUAL_CHECK_EKYC, '1');
          // }
        }
      });
    },
    [backCMNDUrl, checkLiveness, lockEkycAfter3Times, orcInfor],
  );

  const recordVideoSelfie = useCallback(() => {
    if (isLockEkyc) return;
    setMessageFaceMatch('');
    cameraActionsProps.onRecordSelfie(CameraOptions.videoSelfie, (uri) => {
      setVideoUri(uri);
      if (frontCMNDUrl) {
        setTimeout(() => {
          checkFaceMatch(uri, frontCMNDUrl);
        }, 1000);
      }
    });
  }, [isLockEkyc, cameraActionsProps, frontCMNDUrl, checkFaceMatch]);

  const reCapture = useCallback(() => {
    if (errorFrontImg) {
      onPressRemove('FRONT', () => {
        // onPressImportImage('FRONT');
        if (backCMNDUrl?.length === 0) {
          onPressImportImage('FRONT');
        }
      });

      return;
    } else if (errorBackImg) {
      onPressRemove('BACK', () => {
        if (backCMNDUrl?.length === 0) {
          onPressImportImage('BACK');
        }
        // onPressImportImage('BACK');
      });

      return;
    } else {
      setVideoUri('');
      setTimeout(() => {
        recordVideoSelfie();
      }, 500);
      return;
    }
  }, [
    errorFrontImg,
    errorBackImg,
    onPressRemove,
    backCMNDUrl?.length,
    onPressImportImage,
    recordVideoSelfie,
  ]);

  const goToSupport = () => {
    setNote(
      'Tôi đã định danh tài khoản nhiều lần nhưng vẫn không được, nhờ admin hỗ trợ kiểm tra!',
    );
    actionSheetRef?.current?.open();
  };

  const setLockEkyc = useCallback(async () => {
    setIsLockEkyc(true);
    lockEkyc(videoUri, frontCMNDUrl, backCMNDUrl, orcInfor, note);
    actionSheetRef.current.close();
    await AsyncStorage.setItem(AsyncStorageKeys.MANUAL_CHECK_EKYC, '0');
  }, [backCMNDUrl, frontCMNDUrl, lockEkyc, orcInfor, videoUri, note]);

  const _onChangeNote = useCallback((text) => {
    setNote(text);
  }, []);

  const closeActionSheet = useCallback(() => {
    actionSheetRef?.current?.close();
  }, []);

  const renderContentSupport = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} key={'1'}>
        <View style={[styles.containerActionSheet, { paddingBottom: SH(32) }]}>
          <View style={{ alignItems: 'center' }}>
            <Image source={IMAGE_PATH.supportManual} style={styles.imageSupportManual} />
            <View style={{ marginTop: SH(12), marginBottom: SH(20) }}>
              <AppText
                style={{
                  fontSize: SH(16),
                  lineHeight: SH(22),
                  color: Colors.gray5,
                  textAlign: 'center',
                }}
              >
                Thông tin được đọc từ hình và video mà bạn cung cấp. Để hoàn tất định danh vui lòng
                thử thao tác lại hoặc tạo một yêu cầu để được MFast hỗ trợ
              </AppText>
            </View>
          </View>
          <KeyboardAwareScrollView extraHeight={SH(40)}>
            <TextInput
              value={note}
              onChangeText={_onChangeNote}
              style={{
                minHeight: SH(80),
                borderRadius: 8,
                borderColor: Colors.gray4,
                borderWidth: 0.75,
                width: '100%',
                backgroundColor: Colors.primary5,
                paddingHorizontal: SW(12),
                paddingTop: SH(12),
                fontFamily: fonts.regular,
                color: Colors.gray1,
                textAlignVertical: 'top',
              }}
              multiline={true}
            />
          </KeyboardAwareScrollView>
          <View
            style={{
              marginTop: SH(20),
              flexDirection: 'row',
              // backgroundColor: Colors.actionBackground,
            }}
          >
            <View
              style={{
                width: SW(166),
                height: SH(48),
                borderRadius: 27,
                borderColor: Colors.gray5,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: SW(6),
              }}
            >
              <TouchableOpacity onPress={closeActionSheet}>
                <AppText
                  medium
                  style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.gray5 }}
                >
                  Quay lại
                </AppText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: SW(166),
                height: SH(48),
                borderRadius: 27,
                borderColor: Colors.primary2,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: SW(6),
                backgroundColor: Colors.primary2,
              }}
            >
              <TouchableOpacity onPress={setLockEkyc}>
                <AppText
                  medium
                  style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.primary5 }}
                >
                  Yêu cầu hỗ trợ
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [_onChangeNote, closeActionSheet, note, setLockEkyc]);

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.wrapper}>
        <View style={[styles.wrapper, {}]}>
          {/* <AppText>1</AppText> */}
          {renderStatusManual()}
          <View style={styles.importCMNDContainer}>
            <View style={styles.titleContainer}>
              <AppText style={styles.topIndicator}>Hình chụp 2 mặt CMND/CCCD</AppText>
            </View>
            <View style={styles.identifyCardContainer}>
              <IdentifyCardImport
                type="FRONT"
                disabledRemove={
                  userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS || isLockEkyc
                }
                isProcessing={isProcessingORC && idTypeProcess === 'FRONT'}
                onPress={onPressImportImage}
                sourceUrl={isLockEkyc ? userMetaData?.livenessDocFrontUrl : frontCMNDUrl}
                onPressRemove={onPressRemove}
              />
              <IdentifyCardImport
                type="BACK"
                disabledRemove={
                  userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS || isLockEkyc
                }
                isProcessing={isProcessingORC && idTypeProcess === 'BACK'}
                onPress={onPressImportImage}
                sourceUrl={isLockEkyc ? userMetaData?.livenessDocBackUrl : backCMNDUrl}
                onPressRemove={onPressRemove}
              />
            </View>

            {!errorFrontImg &&
              !errorBackImg &&
              frontCMNDUrl?.length > 0 &&
              backCMNDUrl?.length > 0 &&
              !isProcessingORC && (
                <View
                  style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
                >
                  <Image source={ICON_PATH.check_success} style={styles.iconSuccess} />
                  <AppText
                    style={[
                      styles.smallText,
                      {
                        color: Colors.secondGreen,
                        marginLeft: SW(4),
                      },
                    ]}
                  >
                    Hình chụp 2 mặt CMND/CCCD hợp lệ
                  </AppText>
                </View>
              )}
            {isProcessingORC && (
              <View style={styles.rowView}>
                <ActivityIndicator color={Colors.neutral2} size={'small'} />
                <AppText style={[styles.smallText, { marginLeft: SW(4) }]}>
                  Đang kiểm tra điều kiện
                </AppText>
              </View>
            )}
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
          </View>
          <View style={{ alignItems: 'center' }}>
            {!videoUri?.length ? (
              <React.Fragment>
                <AppText style={styles.topIndicator}>Video quay chân dung bản thân</AppText>
                <TouchableOpacity onPress={recordVideoSelfie}>
                  <Image
                    source={IMAGE_PATH.selfieImage}
                    style={{
                      width: SW(180),
                      height: SH(180),
                      resizeMode: 'contain',
                      marginTop: SH(12),
                    }}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ) : (
              <View>
                <View
                  style={{
                    position: 'absolute',
                    top: SH(8),
                    right: 0,
                    zIndex: 9999,
                    opacity:
                      userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS || isLockEkyc
                        ? 0
                        : 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (isLoadingFaceMatch) return;
                      setVideoUri('');
                    }}
                  >
                    <Image
                      source={ICON_PATH.delete2}
                      style={{ width: SW(24), height: SH(24), resizeMode: 'contain' }}
                    />
                  </TouchableOpacity>
                </View>
                <Video
                  source={{
                    uri: videoUri,
                  }}
                  style={{
                    width: SW(234),
                    height: SW(234),
                    borderRadius: SW(234) / 2,
                  }}
                  repeat={false}
                  resizeMode="cover"
                />
              </View>
            )}
            {messageFaceMatch?.length > 0 ? (
              <View
                style={{
                  marginTop: SH(8),
                  flexDirection: 'row',
                  // alignItems: 'center',
                  paddingHorizontal: SW(33),
                }}
              >
                <Image source={ICON_PATH.iconFail} style={styles.iconFail} />
                <AppText
                  style={[
                    styles.smallText,
                    {
                      color: Colors.secondRed,
                      textAlign: 'center',
                      marginTop: SH(4),
                    },
                  ]}
                >
                  {messageFaceMatch}
                </AppText>
              </View>
            ) : null}
            {videoUri?.length > 0 && !isLoadingFaceMatch && faceMatch && (
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: SH(11),
                }}
              >
                <Image source={ICON_PATH.check_success} style={styles.iconSuccess} />
                <AppText
                  style={[
                    styles.smallText,
                    {
                      color: Colors.secondGreen,
                      marginLeft: SW(4),
                    },
                  ]}
                >
                  Chân dung hợp lệ
                </AppText>
              </View>
            )}
            {isLoadingFaceMatch && (
              <View style={[styles.rowView, { marginTop: SH(11) }]}>
                <ActivityIndicator color={Colors.neutral2} size={'small'} />
                <AppText style={[styles.smallText, { marginLeft: SW(4) }]}>
                  Đang so sánh chân dung và hình CMND/CCCD
                </AppText>
              </View>
            )}
            {(errorFrontImg || errorBackImg || messageFaceMatch?.length > 0) &&
            !isLockEkyc &&
            userMetaData?.countryIdStatus !== ENUM_COUNTRY_ID_STATUS.SUCCESS ? (
              <View style={{ marginTop: SH(8), flexDirection: 'row', alignItems: 'center' }}>
                <Image source={ICON_PATH.iconCamera} style={styles.iconFail} />
                <TouchableOpacity onPress={reCapture}>
                  <AppText
                    semiBold
                    style={[styles.smallText, { color: Colors.primary2, marginLeft: SW(8) }]}
                  >
                    Chụp hình lại
                  </AppText>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {isLockEkyc && (
            <View style={{ paddingHorizontal: SW(16), marginTop: SH(24) }}>
              <AppText style={[styles.txtChecked, { color: Colors.gray5, textAlign: 'center' }]}>
                MFast không nhận diện được các thông tin mà bạn cung cấp, vui lòng bấm vào tác vụ
                dưới đây để được hỗ trợ định danh tài khoản.
              </AppText>
            </View>
          )}
          {(isLockEkyc || manualCheck) && userMetaData?.livenessWithIdNumberStatus !== 'PENDING' ? (
            <TouchableOpacity
              style={{
                marginTop: SH(16),
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: SW(343),
                backgroundColor: Colors.highLightColor,
                height: SH(40),
                justifyContent: 'space-between',
                borderRadius: 8,
                paddingHorizontal: SW(16),
                marginHorizontal: SW(16),
              }}
              onPress={goToSupport}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={ICON_PATH.iconQuestion} style={styles.iconFail} />
                <AppText
                  semiBold
                  style={[styles.smallText, { color: Colors.primary5, marginLeft: SW(8) }]}
                >
                  Tôi đã chụp nhiều lần vẫn không được
                </AppText>
              </View>
              <Image
                source={ICON_PATH.arrow_right}
                style={[styles.iconFail, { tintColor: Colors.primary5 }]}
              />
            </TouchableOpacity>
          ) : null}

          {!isLockEkyc ? (
            <View style={styles.inforVerifyContainer}>
              <View
                style={{
                  marginTop: SH(32),
                  marginBottom: SH(16),
                }}
              >
                <AppText
                  style={[styles.topIndicator, { color: Colors.gray5, textAlign: 'center' }]}
                >
                  {`Hướng dẫn quy trình định danh tài khoản,\n xem chi tiết`}
                  <AppText
                    onPress={() => {
                      navigation?.navigate('WebView', {
                        mode: 0,
                        url: AppInfoDefault.guideAccountIdentification,
                        title: 'Hướng dẫn định danh tài khoản',
                      });
                    }}
                    semiBold
                    style={[styles.topIndicator, { color: Colors.primary2 }]}
                  >
                    {' '}
                    {`tại đây >>`}
                  </AppText>
                </AppText>
              </View>
              {!!errorMessageCMND && !disabled && (
                <View style={styles.errorDupContainer}>
                  <Image source={ICON_PATH.warning} />
                  <AppText style={styles.txtErrorDup}>{errorMessageCMND}</AppText>
                </View>
              )}
              {disabled ? null : (
                <SubmitButton
                  onPress={onSubmit}
                  label={idChecked === IDCheck.WRONG_INFOR ? 'Yêu cầu hỗ trợ' : 'Tiếp tục'}
                  disabled={checkDisabledSubmitButton()}
                />
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
      <SamplePhotoPreview
        isVisible={isVisibleSample}
        onCloseAvatarSamplePress={onSamplePress}
        typeSample="CMND"
      />
      <BottomActionSheet
        ref={(ref) => {
          actionSheetRef.current = ref;
        }}
        render={() => {
          return renderContentSupport();
        }}
        headerText={'Yêu cầu hỗ trợ'}
        haveCloseButton
        avoidKeyboard
      />
    </View>
  );
}

export default withCameraPicker(IdentityCard);
