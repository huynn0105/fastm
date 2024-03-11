import React, { useCallback, useState, useEffect, memo } from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import PopupDownloadTemp from '../../../componentV3/PopupDownloadTemp';
import SamplePhotoPreview from '../../../componentV3/SamplePhotoPreview';
import AppText from '../../../componentV3/AppText';
import withCameraPicker from '../../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../../constants/cameraObjKeys';

import { useActions } from '../../../hooks/useActions';
import {
  dispatchSendTaxCommit,
  dispatchUpdateTaxCommittedPhoto,
  dispatchSaveInsuranceCert,
  insuranceUserESign,
} from '../../../redux/actions/actionsV3/tax';

import { STATE } from '../Tax/Tax.contants';

import styles from './Cert.styles';
import Colors from '../../../theme/Color';

import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { logEvent } from '../../../tracking/Firebase';
import { STATUS_APPLY_TAX } from '../Tax/Tax.index';
import { SH, SW } from '../../../constants/styles';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';
import DashedVertical from '../../../componentV3/DashedVertical/DashedVertical';
import WebView from 'react-native-webview';
import CheckBoxSquare from '../../../componentV3/CheckBoxSquare';
import { useDispatch, useSelector } from 'react-redux';
import { requestOTP } from '../../../redux/actions/otp';
import Loading from '../../../componentV3/LoadingModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import DigitelClient from '../../../network/DigitelClient';

const isHtml = (str) => {
  return /<[a-z][\s\S]*>/i.test(str);
};

const Cert = ({
  navigation,
  cameraActionsProps,
  email,
  countryIdNumber,
  taxNumber,
  taxCommittedPhoto,
  onPressRegulationTax,
  previewImageProps,
  jumpTo,
  taxRegisterStatus,
  taxCommittedPhotoStatus,
  statusApplyTaxNumber,
  inforCert,
}) => {
  const myPhone = useSelector((state) => state?.myUser?.mPhoneNumber);
  const isSendingOTP = useSelector((state) => state?.sendingOTP);

  const [isVisibleSample, setIsVisibleSample] = useState(false);
  const [pathImage, setPathImage] = useState(null);
  const [statusCert, setStatusCert] = useState('FAILURE');
  const [isAgree, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insCertificateNumber, setInsCertificateNumber] = useState(
    inforCert?.ins_certificate_number || '',
  );
  const [insCertificateProvide, setInsCertificateProvide] = useState(
    inforCert?.ins_certificate_provide || '',
  );
  const [insCertificateDate, setInsCertificateDate] = useState(
    inforCert?.ins_certificate_date || '',
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const actions = useActions({
    dispatchSendTaxCommit,
    dispatchUpdateTaxCommittedPhoto,
    dispatchSaveInsuranceCert,
    insuranceUserESign,
  });

  useEffect(() => {
    if (inforCert?.path !== pathImage) {
      setPathImage(inforCert?.path);
    }
    if (inforCert?.status_ins !== statusCert) {
      setStatusCert(inforCert?.status_ins);
    }
    if (inforCert?.ins_certificate_number !== insCertificateNumber && !insCertificateNumber) {
      setInsCertificateNumber(inforCert?.ins_certificate_number);
    }
    if (inforCert?.ins_certificate_provide !== insCertificateProvide && !insCertificateProvide) {
      setInsCertificateProvide(inforCert?.ins_certificate_provide);
    }
    if (inforCert?.ins_certificate_date !== insCertificateDate && !insCertificateDate) {
      setInsCertificateDate(inforCert?.ins_certificate_date);
    }
  }, [inforCert]);

  const onSubmit = useCallback(() => {
    if (pathImage) {
      const callBack = (res) => {
        setStatusCert('PENDING');
        Alert.alert(
          'Cập nhật Chứng chỉ bảo hiểm',
          `${res?.message || ''}`,
          [
            {
              text: 'Đóng',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      };
      actions.dispatchSaveInsuranceCert(
        pathImage,
        insCertificateNumber,
        insCertificateProvide,
        insCertificateDate,
        callBack,
      );
    }
    //
  }, [actions, insCertificateDate, insCertificateNumber, insCertificateProvide, pathImage]);

  const onPressOpenPickerGalaxy = useCallback(() => {
    if (pathImage) {
      previewImageProps.setArrImagePreview([pathImage]);
      previewImageProps.onOpenPreviewImage();
      return;
    }
    cameraActionsProps.onOpenCamera(CameraOptions.insCert, (imgUrl) => {
      setPathImage(imgUrl);
    });
  }, [pathImage, cameraActionsProps, previewImageProps]);

  const onPressRemovePathImage = useCallback(() => {
    setPathImage(null);
  }, []);

  const onPressViewTermTax = useCallback(() => {
    if (onPressRegulationTax) {
      onPressRegulationTax();
    }
    //
  }, [onPressRegulationTax]);

  const onSamplePress = useCallback(() => {
    setIsVisibleSample(!isVisibleSample);
  }, [isVisibleSample]);

  const renderResultTaxCommitted = useCallback(() => {
    const taxCommittedPhotoMessage = inforCert?.tax_committed_photo_message;

    if (statusCert === 'PENDING') {
      return (
        <View style={styles.resultContainer}>
          <View style={styles.indicatorContainer}>
            <AppText style={styles.indicatorLabel}>{`Kết quả duyệt`}</AppText>
            <View style={styles.raw}>
              <Image source={ICON_PATH.pending2} style={styles.icPending} />
              <AppText bold style={styles.indicatorStatus}>
                Chờ duyệt
              </AppText>
            </View>
          </View>
          <View style={{ flex: 1, marginTop: 4 }}>
            {isHtml(taxCommittedPhotoMessage) ? (
              <View style={{ flex: 1, marginTop: 12 }}>
                <HTMLView html={taxCommittedPhotoMessage} />
              </View>
            ) : (
              <AppText style={[styles.indicatorDesc, { marginTop: 4 }]}>
                {taxCommittedPhotoMessage ||
                  '- Yêu cầu của bạn đã được ghi nhận, MFast sẽ tiến hành kiểm tra và thông báo ngay khi có kết quả'}
              </AppText>
            )}
          </View>
        </View>
      );
    }
    if (statusCert === 'FAILURE') {
      return (
        <View style={styles.resultContainerFailure}>
          <View style={styles.indicatorContainer}>
            <AppText style={styles.indicatorLabelFailure}>{`Kết quả duyệt`}</AppText>
            <View style={styles.raw}>
              <Image source={ICON_PATH.close3} style={styles.icFailure} />
              <AppText bold style={styles.indicatorStatusFailure}>
                Thất bại
              </AppText>
            </View>
          </View>
          {isHtml(taxCommittedPhotoMessage) ? (
            <View style={{ flex: 1, marginTop: 12 }}>
              <HTMLView html={taxCommittedPhotoMessage} />
            </View>
          ) : (
            <AppText style={[styles.indicatorDescFailure, { marginTop: 4 }]}>
              {taxCommittedPhotoMessage ||
                '- Vui lòng cập nhật lại thông tin chứng chỉ bảo hiểm và chụp lại ảnh.'}
            </AppText>
          )}
        </View>
      );
    }
    if (statusCert === 'SUCCESS') {
      return (
        <View style={styles.resultContainerSuccess}>
          <View style={styles.indicatorContainer}>
            <AppText style={styles.indicatorLabelFailure}>{`Kết quả duyệt`}</AppText>
            <View style={styles.raw}>
              <Image
                source={ICON_PATH.tick1}
                style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: Colors.green5 }}
              />
              <AppText style={styles.indicatorStatusSuccess}>Thành công</AppText>
            </View>
          </View>
          <View style={{ flex: 1, marginTop: 4 }}>
            {isHtml(taxCommittedPhotoMessage) ? (
              <View style={{ flex: 1, marginTop: 12 }}>
                <HTMLView html={taxCommittedPhotoMessage} />
              </View>
            ) : (
              <AppText style={[styles.indicatorDescSuccess, { marginTop: 4 }]}>
                {taxCommittedPhotoMessage || '- Thành công'}
              </AppText>
            )}
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.resultContainerSuccess, { flexDirection: 'row' }]}>
        <Image source={ICON_PATH.tips} style={{ width: 32, height: 32, marginRight: 12 }} />
        <AppText
          style={[styles.topIndicatorRight, { color: Colors.gray5, lineHeight: 20, flex: 1 }]}
        >
          Hoàn tất quy trình để được giảm{' '}
          <AppText
            style={[styles.topIndicatorRight, { color: Colors.green5, lineHeight: 20 }]}
            bold
          >
            5% thuế thu nhập cá nhân
          </AppText>{' '}
          từ thu nhập của các dự án bảo hiểm
        </AppText>
      </View>
    );
  }, [inforCert?.tax_committed_photo_message, statusCert]);

  const onGetDisabled = useCallback(() => {
    if (!inforCert?.path) {
      return !pathImage || !insCertificateNumber || !insCertificateDate || !insCertificateProvide;
    }
    return (
      inforCert?.path === pathImage ||
      !pathImage ||
      !insCertificateNumber ||
      !insCertificateDate ||
      !insCertificateProvide
    );
  }, [inforCert?.path, insCertificateDate, insCertificateNumber, insCertificateProvide, pathImage]);

  const onGetLabel = useCallback(() => {
    if (!inforCert?.path) {
      return 'Cập nhật chứng chỉ';
    }
    return 'Cập nhật';
  }, [inforCert?.path, pathImage]);

  const onJumToTabTax = useCallback(() => {
    if (jumpTo) {
      jumpTo('tax');
    }
  }, [jumpTo]);
  const renderImportLawCommitted = useCallback(() => {
    const disabledUpdate = statusCert === 'PENDING' || statusCert === 'SUCCESS';

    return (
      <View>
        <DashedVertical style={{ left: styles.circleNumber.width / 2, top: 2 }} />
        <View style={[styles.row, { justifyContent: 'flex-start', marginBottom: 12 }]}>
          <View style={styles.circleNumber}>
            <AppText style={styles.number} bold>
              1
            </AppText>
          </View>
          <View>
            <AppText style={styles.topIndicatorLeft}>Hình chụp bản chứng chỉ bảo hiểm</AppText>
            <AppText style={styles.topIndicatorRight} onPress={onSamplePress}>
              Xem mẫu
            </AppText>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onPressOpenPickerGalaxy}>
          <View style={styles.imageContainer}>
            {!pathImage?.length ? (
              <>
                <Image source={ICON_PATH.imageInput} style={styles.icAdd} />
                <AppText
                  style={{ fontSize: 13, lineHeight: 18, color: Colors.gray5, marginTop: 8 }}
                >
                  Thêm hình
                </AppText>
              </>
            ) : (
              <View style={{ width: '100%', height: '100%' }}>
                <FastImage source={{ uri: pathImage }} style={styles.pathImage} />
                {pathImage && !disabledUpdate && (
                  <TouchableOpacity style={styles.iconContainer} onPress={onPressRemovePathImage}>
                    <View>
                      <Image source={ICON_PATH.delete2} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View style={{ marginLeft: 44, marginTop: 16 }}>
          <CustomInput
            title="Số chứng chỉ"
            placeholder="Nhập số chứng chỉ"
            editable={!disabledUpdate}
            value={insCertificateNumber}
            onChangeText={setInsCertificateNumber}
          />
          <CustomInput
            title="Nơi cấp"
            placeholder="Nhập nơi cấp"
            containerStyle={{ marginTop: 12 }}
            editable={!disabledUpdate}
            value={insCertificateProvide}
            onChangeText={setInsCertificateProvide}
          />
          <CustomInput
            title="Ngày cấp"
            placeholder="Chọn ngày cấp"
            containerStyle={{ marginTop: 12 }}
            editable={false}
            onPress={() => setIsDatePickerVisible(true)}
            disabled={disabledUpdate}
            value={insCertificateDate}
          />
        </View>
        <View style={[styles.btContainer, { marginTop: SH(24), marginLeft: 44 }]}>
          {inforCert?.status_ins !== 'PENDING' && inforCert?.status_ins !== 'SUCCESS' ? (
            <SubmitButton disabled={onGetDisabled()} label={onGetLabel()} onPress={onSubmit} />
          ) : null}
        </View>
      </View>
    );
  }, [
    statusCert,
    onSamplePress,
    onPressOpenPickerGalaxy,
    pathImage,
    onPressRemovePathImage,
    insCertificateNumber,
    insCertificateProvide,
    insCertificateDate,
    inforCert?.status_ins,
    onGetDisabled,
    onGetLabel,
    onSubmit,
  ]);

  const dispatch = useDispatch();

  const onSubmitESign = useCallback(() => {
    dispatch(
      requestOTP(myPhone, false, () => {
        navigation.navigate('OtpConfirm', {
          userPhoneNumber: myPhone,
          onOtpSubmitCallback: (otpCode, handleError) => {
            setIsLoading(true);
            actions?.insuranceUserESign(otpCode, (isSuccess, result, errorCode) => {
              setIsLoading(false);
              if (isSuccess) {
                navigation.pop();
                navigation.navigate('StatusESign', {
                  params: {
                    status: 'SUCCESS',
                  },
                });
              } else {
                if (errorCode === 'WRONG_OTP') {
                  handleError(result);
                } else {
                  navigation.navigate('StatusESign', {
                    params: {
                      status: 'ERROR',
                      message: result,
                      onRetry: () => {
                        navigation?.pop();
                        onSubmitESign();
                      },
                    },
                  });
                }
              }
            });
          },

          onOtpResendCallback: (funcCallbackCountDownTime) => {
            dispatch(
              requestOTP(myPhone, true, () => {
                funcCallbackCountDownTime();
              }),
            );
          },

          onOtpCancelCallback: () => {},
        });
      }),
    );
  }, [dispatch, myPhone, navigation]);

  const renderMissingTaxNumber = useCallback(() => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={IMAGE_PATH.updateLaw} style={styles.updateImage} />
        <AppText style={styles.labelInput}>
          {`Vui lòng cập nhật Mã số thuế trước khi tải lên\n bản Cam kết thuế`}
        </AppText>
        <View style={styles.btContainer}>
          <SubmitButton
            disabled={taxRegisterStatus === STATE.PENDING}
            bgColor={Colors.primary2}
            label={'Về trang Mã số thuế'}
            onPress={onJumToTabTax}
            customStyle={{ width: SW(204), height: SH(48) }}
          />
        </View>
      </View>
    );
  }, [taxRegisterStatus, onJumToTabTax]);

  const renderESign = useCallback(() => {
    return (
      <View>
        <View style={[styles.row, { justifyContent: 'flex-start' }]}>
          <View style={styles.circleNumber}>
            <AppText style={styles.number} bold>
              2
            </AppText>
          </View>
          <View>
            <AppText style={styles.topIndicatorLeft}>Ký hợp đồng đại lý bảo hiểm</AppText>
            <AppText style={styles.topIndicatorRight}></AppText>
          </View>
        </View>
        {inforCert?.status_ins === 'SUCCESS' ? (
          <View style={{ marginLeft: 44 }}>
            <View
              style={{
                width: '100%',
                aspectRatio: 299 / 411,
                borderRadius: 8,
                backgroundColor: Colors.neutral5,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: Colors.gray4,
                overflow: 'hidden',
              }}
            >
              {inforCert?.path_esign?.length ? (
                <WebView
                  source={{
                    uri: `${inforCert?.path_esign}?accessToken=${DigitelClient.defaultParams.accessToken}`,
                  }}
                  style={{ borderRadius: 8 }}
                  nestedScrollEnabled={true}
                />
              ) : null}
            </View>
            {!inforCert?.status_esign ? (
              <>
                <CheckBoxSquare
                  label={'Tôi đồng ý với các điều khoản và điều kiện được nêu trong hợp đồng trên'}
                  labelStyle={{ flex: 1 }}
                  style={{ alignItems: 'flex-start' }}
                  numberOfLines={99}
                  onChangeValue={setIsAgree}
                />
                <SubmitButton
                  disabled={!isAgree}
                  label={'Ký hợp đồng ngay'}
                  onPress={onSubmitESign}
                  customStyle={{ marginTop: 16, alignSelf: 'center', paddingHorizontal: 24 }}
                />
              </>
            ) : null}
          </View>
        ) : (
          <View
            style={{
              marginLeft: 44,
              borderRadius: 8,
              backgroundColor: Colors.neutral5,
              padding: 12,
              flexDirection: 'row',
            }}
          >
            <Image source={ICON_PATH.clock3} style={{ width: 24, height: 24, marginRight: 8 }} />
            <AppText
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: Colors.gray5,
                flex: 1,
              }}
            >
              Cung cấp hình chứng chỉ đại lý bảo hiểm và chờ duyệt trước khi ký hợp đồng.
            </AppText>
          </View>
        )}
      </View>
    );
  }, [
    inforCert?.path_esign,
    inforCert?.status_esign,
    inforCert?.status_ins,
    isAgree,
    onSubmitESign,
  ]);

  // return renderESign();

  return (
    <View style={styles.wrapper}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <View style={styles.container}>
          <View style={{ backgroundColor: Colors.primary5, padding: 16 }}>
            {/* {!taxNumber || statusApplyTaxNumber === STATUS_APPLY_TAX.FAILURE ? (
              renderMissingTaxNumber()
            ) : ( */}
            <>
              {renderResultTaxCommitted()}
              {renderImportLawCommitted()}
              {renderESign()}
            </>
            {/* )} */}
          </View>
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <AppText style={styles.bottonIndicator}>Thông tin khác</AppText>
            <TouchableWithoutFeedback onPress={onPressViewTermTax}>
              <View style={styles.bottomBoxContainer}>
                <AppText style={styles.indicatorBottom}>
                  Quy định khấu trừ và tạm giữ thuế Thu nhập{'\n'}cá nhân đối với thu nhập trên
                  MFast
                </AppText>
                <Image source={ICON_PATH.arrow_right_green} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <SamplePhotoPreview
        isVisible={isVisibleSample}
        onCloseAvatarSamplePress={onSamplePress}
        typeSample="CERT"
      />
      <DateTimePicker
        isVisible={isDatePickerVisible}
        locale={'vi-VN'}
        customHeaderIOS={() => null}
        maximumDate={new Date()}
        onConfirm={(d) => {
          console.log('\u001B[36m -> file: Cert.index.js:546 -> d', d);
          setIsDatePickerVisible(false);
          setInsCertificateDate(moment(d).format('DD/MM/YYYY'));
        }}
        onCancel={() => {
          setIsDatePickerVisible(false);
        }}
        date={
          insCertificateDate
            ? new Date(moment(insCertificateDate, 'DD/MM/YYYY').valueOf())
            : new Date()
        }
        mode="date"
        confirmTextIOS={'Xác nhận'}
        cancelTextIOS={'Hủy'}
      />
      <Loading visible={!!isSendingOTP || isLoading} />
    </View>
  );
};

export default withCameraPicker(Cert);

const CustomInput = memo((props) => {
  const { title, containerStyle, style, onPress, disabled, ...rest } = props;
  return (
    <View
      style={[{ borderBottomWidth: 1, borderBottomColor: Colors.gray4 }].concat(containerStyle)}
    >
      <AppText style={{ fontSize: 13, lineHeight: 18, color: Colors.gray5 }}>{title}</AppText>
      <TextInput
        style={[
          {
            fontSize: 14,
            lineHeight: 20,
            color: Colors.gray1,
            marginTop: 2,
            marginBottom: 8,
          },
          {},
        ]}
        {...rest}
      />
      {disabled || !onPress ? null : (
        <TouchableWithoutFeedback onPress={onPress} disable={disabled || !onPress}>
          <View style={{ width: '100%', height: '100%', position: 'absolute' }} />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
});
