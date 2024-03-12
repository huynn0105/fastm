import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
// components
import CustomTextField from '../../../componentV3/CustomTextField';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import WrapperCustomTextField from '../../../componentV3/WrapperCustomTextField';
import PickerSelector from '../../../componentV3/PickerSelector';
import AppText from '../../../componentV3/AppText';

// style
import styles from './PersonalInformation.style';

// isvalid
import { isEmailValid } from 'app/utils/Utils';

import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { useSelector } from 'react-redux';
import commonStyle from '../../../constants/styles';

import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../../redux/selectors/userMetaDataSelectors';
import BoxIdentifyV2 from '../../../componentV3/BoxIdentifyV2';
import {
  dispatchSendEmailOTP,
  dispatchVerifyEmailOTP,
} from '../../../redux/actions/actionsV3/sendEmalOTP';
import { updateUserMetaStep } from '../../../redux/actions/actionsV3/userMetaData';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import EmailVerifyView from '../comp/EmailVerifyView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useActions } from '../../../hooks/useActions';
import { checkDuplicateEmail } from '../../../redux/actions/actionsV3/userMetaData';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { TextInput } from 'react-native-gesture-handler';
import { fonts } from '../../../constants/configs';
import { useKeyboard } from '@react-native-community/hooks';
import { STATUS_LIVENESS_CHECK } from '../IdentityCard/IdentityCard.index';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { LIST_GENDER } from '../AccountIdentification.contants';
import moment from 'moment';

const TYPE_MODAL = {
  EDIT_KYC_INFOR: 'EDIT_KYC_INFOR',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
};

function PersonalInformation({
  onHandlerNextStep,
  listDistrict,
  navigation,
  supportManual,
  disabled,
  errorMessageCMND,
}) {
  /* <------------------- Ref -------------------> */
  const emaiRef = useRef(null);
  const districtRef = useRef(null);
  const addressRef = useRef(null);

  /* <------------------- State -------------------> */
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [oldIdNumber, setOldIdNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);
  const [errorMessageOTPEmail, setErrorMessageOTPEmail] = useState('');
  const [typeModal, setTypeModal] = useState(TYPE_MODAL.VERIFY_EMAIL);
  const actionSheetRef = useRef(null);
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessageOldId, setErrorMessageOldId] = useState('');
  const [note, onChangeNote] = useState('');
  const [indexGender, setIndexGender] = useState();

  const appInfo = useSelector((state) => state.appInfo);
  const actions = useActions({
    dispatchSendEmailOTP,
    updateUserMetaStep,
    dispatchVerifyEmailOTP,
    checkDuplicateEmail,
  });

  const userMetaData = useSelectorShallow(getUserMetaDataSelector);

  const isRequiredOldNumberId = useMemo(() => {
    const year = moment(userMetaData?.countryIdDateOfBirth, 'DD-MM-YYYY').year();

    return year <= 1996;
  }, [userMetaData?.countryIdDateOfBirth]);

  const sendEmailOTP = useCallback(
    async (onSuccess) => {
      if (email) {
        const callback = (payload) => {
          if (!payload?.resendTime) {
            setErrorMessageOTPEmail(payload?.message || '');
          } else {
            setErrorMessageOTPEmail('');
            onSuccess?.();
          }
        };
        actions.dispatchSendEmailOTP(email, callback);
      }
    },
    [actions, email],
  );

  useEffect(() => {
    if (userMetaData?.gender) {
      setGender(userMetaData?.gender);
    }
    if (userMetaData?.email) {
      setEmail(userMetaData?.email);
    }
    if (userMetaData?.district) {
      districtRef?.current?.setValue(userMetaData?.district);
      setDistrict(userMetaData?.district);
    }
    if (userMetaData?.address) {
      setAddress(userMetaData?.address);
    }
    if (userMetaData?.countryOldIdNumber) {
      setOldIdNumber(userMetaData?.countryOldIdNumber);
    }
  }, [
    userMetaData?.address,
    userMetaData?.countryOldIdNumber,
    userMetaData?.district,
    userMetaData?.email,
    userMetaData?.gender,
  ]);

  /* <------------------- Click -------------------> */
  const onPressSelectGender = useCallback(
    (index) => {
      setGender(index);
    },
    [setGender],
  );

  /* <------------------- Change -------------------> */
  const onChangeEmail = useCallback((value) => {
    setEmail(value);
  }, []);

  const onChangeAddress = useCallback((value) => {
    setAddress(value);
  }, []);

  const submitData = useCallback(() => {
    const isValidEmail = isEmailValid(email);
    const isValidDistrict = !isEmpty(district);
    if (!isValidEmail || !isValidDistrict) {
      return;
    }

    const payload = {
      isVerifiedEmail: true,
      email,
      district,
      address,
      gender: gender,
      countryOldIdNumber: oldIdNumber,
      countryIdNumber: userMetaData?.countryIdNumber,
    };
    if (typeof onHandlerNextStep === 'function') {
      onHandlerNextStep(payload);
    }
  }, [
    email,
    district,
    address,
    gender,
    oldIdNumber,
    userMetaData?.countryIdNumber,
    onHandlerNextStep,
  ]);

  /* <------------------- Submit -------------------> */
  const onSubmit = useCallback(() => {
    // setShowModalOTP(true);
    setErrorMessageEmail('');
    setErrorMessageOldId('');
    const isValidEmail = isEmailValid(email);
    if (!isValidEmail) {
      setErrorMessageEmail('Email không đúng định dạng!');
      return;
    }
    if (countryIdNumber?.length > 9) {
      // is cmnd

      const isInvalidNotRequired =
        !isRequiredOldNumberId && oldIdNumber.length && oldIdNumber.length < 9;

      const isInvalidRequired =
        isRequiredOldNumberId && (!oldIdNumber.length || oldIdNumber.length < 9);
      if (isInvalidNotRequired || isInvalidRequired) {
        setErrorMessageOldId('Số CMND phải đủ 9 số');
        return;
      }
    }

    setTypeModal(TYPE_MODAL.VERIFY_EMAIL);
    actions.checkDuplicateEmail(email, (response) => {
      if (!response) {
        setErrorMessageEmail(
          'Email này đã tồn tại trên hệ thống, vui lòng kiểm tra lại hoặc sử dụng địa chỉ email khác.',
        );
      } else {
        setTimeout(() => {
          sendEmailOTP(() => {
            setTimeout(() => {
              actionSheetRef.current.open();
            }, 100);
          });
        }, 250);
      }
    });
  }, [actions, email, isRequiredOldNumberId, oldIdNumber.length, sendEmailOTP]);

  const onSubmitVerify = (otp) => {
    verifyEmailOTP(otp);
  };

  const onEnableButtonSubmit = useCallback(() => {
    return (
      !isEmpty(email) &&
      !isEmpty(district) &&
      !isEmpty(address) &&
      !isEmpty(gender) &&
      userMetaData?.livenessWithIdNumberStatus !== 'PENDING' &&
      !disabled
    );
  }, [email, district, address, gender, userMetaData?.livenessWithIdNumberStatus, disabled]);

  const onPressSelectDistrict = useCallback(() => {
    setIsVisiblePicker(true);
  }, []);

  const onPressItemDistrict = useCallback((item) => {
    try {
      setDistrict(item?.value);
      districtRef?.current?.setValue(item?.value);
      setTimeout(() => {
        setIsVisiblePicker(false);
      }, 500);
    } catch (error) {
      console.log('co gi error k', error);
    }
  }, []);

  const onSubmitEditingDistrict = useCallback(() => {
    addressRef?.current?.focus();
  }, []);

  const onClosePicker = useCallback(() => {
    setIsVisiblePicker(false);
  }, []);

  const openTermAndPrivacyView = () => {
    const title = 'Điều khoản sử dụng';
    const url = appInfo.termsOfUsageUrl;
    navigation.navigate('WebView', { mode: 0, title, url });
  };
  const verifyEmailOTP = useCallback(
    async (otpCode) => {
      if (email && otpCode) {
        const callback = (payload) => {
          if (!payload?.status) {
            setErrorMessageOTPEmail(payload?.message || '');
          } else {
            actionSheetRef.current.close();
            setErrorMessageOTPEmail('');
            submitData();
          }
        };
        actions.dispatchVerifyEmailOTP(email, otpCode, callback);
      }
    },
    [email, actions, submitData],
  );

  const goToSupport = useCallback(() => {
    onChangeNote(
      'Tôi chụp hình định danh nhưng thông tin tài khoản hiển thị không đúng, nhờ admin hỗ trợ kiểm tra!',
    );
    supportManual(note);
    actionSheetRef.current.close();
  }, [note, supportManual]);

  const _onChangeNote = useCallback((text) => {
    onChangeNote(text);
  }, []);
  const keyboard = useKeyboard();

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
  }, [
    disabled,
    renderContentPending,
    userMetaData?.livenessWithIdNumberNote,
    userMetaData?.livenessWithIdNumberStatus,
    userMetaData?.liveness_with_id_number_log,
  ]);

  const renderEditInfor = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: Colors.actionBackground,
            paddingHorizontal: SW(16),
            paddingBottom: SH(32),
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Image
              source={IMAGE_PATH.editInfor}
              style={{ width: SW(160), height: SH(120), resizeMode: 'contain' }}
            />
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
          <View style={{ marginTop: SH(20) }}>
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
                // paddingTop: SH(12),
                fontFamily: fonts.regular,
                color: Colors.gray1,
                fontSize: SH(14),
                textAlignVertical: 'top',
              }}
              multiline={true}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: SH(26),
            }}
          >
            <TouchableOpacity
              style={{
                width: SW(166),
                height: SH(48),
                borderWidth: 1,
                borderColor: Colors.gray5,
                borderRadius: 27,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                actionSheetRef?.current?.close();
              }}
            >
              <AppText medium style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.gray5 }}>
                Quay lại
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: SW(166),
                height: SH(48),
                borderRadius: 27,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: SW(11),
                backgroundColor: Colors.primary2,
              }}
              onPress={goToSupport}
            >
              <AppText
                medium
                style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.primary5 }}
              >
                Yêu cầu hỗ trợ
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [_onChangeNote, goToSupport, note]);

  /* <------------------- Render -------------------> */

  const timeDeleteAccount = userMetaData?.isCTVConfirmed ? '6' : '3';
  const {
    countryIdName,
    countryIdDateOfBirth,
    countryIdNumber,
    countryOldIdNumber,
    countryIdIssuedDate,
  } = userMetaData;

  const requestSupport = useCallback(() => {
    if (userMetaData?.livenessWithIdNumberStatus === 'PENDING') {
      Alert.alert(
        'Thông báo',
        'Bạn có 1 yêu cầu hỗ trợ của bạn đang được xử lý',
        [{ text: 'Đóng' }],
        {
          cancelable: false,
        },
      );
      return;
    }
    setTypeModal(TYPE_MODAL.EDIT_KYC_INFOR);
    onChangeNote(
      'Tôi chụp hình định danh nhưng thông tin tài khoản hiển thị không đúng, nhờ admin hỗ trợ kiểm tra!',
    );
    actionSheetRef.current?.open();
  }, [userMetaData.livenessWithIdNumberStatus]);

  return (
    <View style={{ flex: 1, width: SCREEN_WIDTH }} key={'2'}>
      <KeyboardAwareScrollView
        extraHeight={SH(40)}
        style={styles.wrapper}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid={true}
      >
        {renderStatusManual()}
        <View style={styles.wrapper}>
          <View style={[styles.formWrapper, { marginTop: SH(32) }]}>
            <BoxIdentifyV2
              fullName={countryIdName}
              dob={countryIdDateOfBirth}
              countryId={countryIdNumber}
              countryOldId={countryOldIdNumber}
              countryIdDate={countryIdIssuedDate}
              gender={userMetaData?.gender || ''}
              requestSupport={requestSupport}
              hideEdit={disabled || userMetaData?.livenessWithIdNumberStatus === 'SUCCESS'}
            />
            <View style={{ marginTop: SH(24) }}>
              <AppText style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.gray1 }}>
                Thông tin thêm
              </AppText>
            </View>
            <View style={styles.containerBoxIdentify}>
              {(!userMetaData?.gender || userMetaData?.gender === 'other') && (
                <View style={styles.rowViewStart}>
                  <AppText style={styles.fieldTitleText}>
                    Giới tính
                    <AppText style={{ ...styles.fieldTitleText, color: Colors.sixRed }}>*</AppText>
                  </AppText>
                  <View style={styles.rowViewStart}>
                    {LIST_GENDER.map((_gender, index) => {
                      const isSelected = indexGender === index;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setIndexGender(index);
                            setGender(LIST_GENDER[index].label);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: 24,
                            }}
                          >
                            <View
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: Colors.primary2,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {isSelected ? (
                                <View
                                  style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 9,
                                    backgroundColor: Colors.primary2,
                                  }}
                                />
                              ) : null}
                            </View>
                            <AppText
                              medium={isSelected}
                              style={[
                                styles.titleText,
                                { marginLeft: 8, color: isSelected ? Colors.gray1 : Colors.gray5 },
                              ]}
                            >
                              {_gender.label}
                            </AppText>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
              {!countryOldIdNumber && countryIdNumber?.length > 9 ? (
                <CustomTextField
                  autoCapitalize={'words'}
                  textFieldLabel={
                    <AppText style={styles.fieldTitleText}>
                      Số CMND cũ
                      {isRequiredOldNumberId ? (
                        <AppText style={{ ...styles.fieldTitleText, color: Colors.sixRed }}>
                          *
                        </AppText>
                      ) : null}
                    </AppText>
                  }
                  textFieldValue={oldIdNumber}
                  errorMessage={errorMessageOldId}
                  showError={errorMessageOldId?.length > 0}
                  textFieldContainerStyle={styles.textFieldContainerStyle}
                  containerStyle={{ marginBottom: 24, marginTop: 20 }}
                  onChangeTextFieldText={setOldIdNumber}
                  editable={!disabled}
                  keyboardType={'numeric'}
                  maxLength={9}
                />
              ) : null}
              <CustomTextField
                autoCapitalize={'words'}
                textFieldLabel={
                  <AppText style={styles.fieldTitleText}>
                    Email
                    <AppText style={{ ...styles.fieldTitleText, color: Colors.sixRed }}>*</AppText>
                  </AppText>
                }
                textFieldValue={email}
                errorMessage={errorMessageEmail}
                showError={errorMessageEmail?.length > 0}
                textFieldContainerStyle={styles.textFieldContainerStyle}
                containerStyle={{ marginBottom: 24, marginTop: 20 }}
                onChangeTextFieldText={onChangeEmail}
                editable={!disabled}
              />
              <WrapperCustomTextField
                ref={districtRef}
                textFieldLabel={
                  <AppText style={styles.fieldTitleText}>
                    Quận/Huyện - Tỉnh/Thành phố
                    <AppText style={{ ...styles.fieldTitleText, color: Colors.sixRed }}>*</AppText>
                  </AppText>
                }
                textFieldValue={district}
                returnKeyType="next"
                textFieldContainerStyle={styles.textFieldContainerStyle}
                containerStyle={{ marginVertical: 10 }}
                errorMessage="Nhập kí tự tìm kiếm và chọn từ danh sách hiện ra\n(vd: Q. 3 - Ho Chi Minh hoặc H. Dong Anh - Ha Noi)"
                onSubmitEditing={onSubmitEditingDistrict}
                onPress={onPressSelectDistrict}
                subNote={`Nhập kí tự tìm kiếm và chọn từ danh sách hiện ra\n(vd: Q.3 - Ho Chi Minh hoặc H. Dong Anh - Ha Noi)`}
                disabled={disabled}
              />
              <CustomTextField
                autoCapitalize={'words'}
                textFieldLabel={
                  <AppText style={styles.fieldTitleText}>
                    Địa chỉ liên hệ
                    <AppText style={{ ...styles.fieldTitleText, color: Colors.sixRed }}>*</AppText>
                  </AppText>
                }
                showError={false}
                textFieldValue={address}
                textFieldContainerStyle={styles.textFieldContainerStyle}
                containerStyle={{ marginBottom: 24, marginTop: 12 }}
                onChangeTextFieldText={onChangeAddress}
                editable={!disabled}
              />
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            {!!errorMessageCMND && !disabled && (
              <View style={styles.errorDupContainer}>
                <Image source={ICON_PATH.warning} />
                <AppText style={styles.txtErrorDup}>{errorMessageCMND}</AppText>
              </View>
            )}
            {disabled ? null : (
              <SubmitButton
                label={'Tiếp tục'}
                disabled={!onEnableButtonSubmit()}
                onPress={onSubmit}
              />
            )}
            <View style={{ marginTop: SH(24) }}>
              <AppText bold style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray2 }}>
                Lưu ý:
              </AppText>

              <AppText
                style={{
                  fontSize: SH(13),
                  lineHeight: SH(18),
                  color: Colors.gray2,
                  marginTop: SH(8),
                }}
              >
                Tài khoản MFast sẽ tự động đóng, số dư tiền và các thông tin đi kèm cũng sẽ huỷ theo{' '}
                <AppText style={{ fontSize: SH(13), lineHeight: SH(19), color: Colors.secondRed }}>
                  {`khi không sử dụng trong ${timeDeleteAccount} tháng`}
                </AppText>
                <AppText style={{ fontSize: SH(13), lineHeight: SH(19) }}>. Chi tiết tại </AppText>
                <AppText
                  style={{ fontSize: SH(13), lineHeight: SH(19), color: Colors.primary2 }}
                  onPress={openTermAndPrivacyView}
                >
                  điều khoản sử dụng.
                </AppText>
              </AppText>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <PickerSelector
        title={'Huyện / Tỉnh'}
        data={listDistrict}
        onPressItem={onPressItemDistrict}
        onCloseModal={onClosePicker}
        isVisible={isVisiblePicker}
      />
      <BottomActionSheet
        ref={(ref) => {
          actionSheetRef.current = ref;
        }}
        render={() => {
          return (
            <>
              {typeModal === TYPE_MODAL.VERIFY_EMAIL ? (
                <EmailVerifyView
                  email={email}
                  onSubmitVerify={onSubmitVerify}
                  errorMessageOTPEmail={errorMessageOTPEmail}
                  sendOTP={() => sendEmailOTP(email)}
                />
              ) : (
                renderEditInfor()
              )}
            </>
          );
        }}
        canClose={true}
        headerText={typeModal === TYPE_MODAL.VERIFY_EMAIL ? 'Xác thực Email' : 'Cập nhật thông tin'}
        haveCloseButton={true}
        avoidKeyboard={typeModal !== TYPE_MODAL.VERIFY_EMAIL}
      />
    </View>
  );
}

export default PersonalInformation;
