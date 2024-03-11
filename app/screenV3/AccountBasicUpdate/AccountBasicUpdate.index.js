import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import isEmpty from 'lodash/isEmpty';

import GroupCheckBox from '../../componentV3/GroupCheckBox';
import SubmitButton from '../../componentV3/Button/SubmitButton';
import CustomTextField from '../../componentV3/CustomTextField';
import ModalOTP from '../../componentV3/ModalOTP';
import LoadingModal from '../../componentV3/LoadingModal';
import WrapperCustomTextField from '../../componentV3/WrapperCustomTextField';
import PickerSelector from '../../componentV3/PickerSelector';
import AppText from '../../componentV3/AppText';

import { useActions } from '../../hooks/useActions';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getArrDistrictSelector } from '../../redux/selectors/districtSelector';
import { findDistrictsByText } from '../../redux/actions/customerForm';
import {
  checkDuplicateEmail,
  updateUserMetaStep,
} from '../../redux/actions/actionsV3/userMetaData';
import {
  dispatchSendEmailOTP,
  dispatchVerifyEmailOTP,
} from '../../redux/actions/actionsV3/sendEmalOTP';
import {
  getCommonLoadingSelector,
  getIsLoadingUpdateUserMeta,
} from '../../redux/selectors/commonLoadingSelector';

import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
// isvalid
import { isEmailValid } from '../../utils/Utils';

import DigitelClient from '../../network/DigitelClient';
import { TrackingEvents } from '../../constants/keys';

import styles from './AccountBasicUpdate.styles';

import { GENDER_LIST } from '../../constants/keys';
import { ScrollView } from 'react-native-gesture-handler';
import { logEvent } from '../../tracking/Firebase';

const AccountBasicUpdate = ({ navigation }) => {
  //
  const arrDistricts = useSelectorShallow(getArrDistrictSelector);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const isLoading = useSelectorShallow(getCommonLoadingSelector);
  const isLoadingUpdate = useSelectorShallow(getIsLoadingUpdateUserMeta);

  const actions = useActions({
    findDistrictsByText,
    updateUserMetaStep,
    dispatchSendEmailOTP,
    dispatchVerifyEmailOTP,
    checkDuplicateEmail,
  });

  useEffect(() => {
    if (userMetaData) {
      const { email, gender, address, district } = userMetaData;
      if (gender) {
        let indexGender = GENDER_LIST.findIndex((item) => gender === item?.value);
        if (indexGender < 0) {
          indexGender = 0;
        }
        setGender(indexGender);
      }
      if (email) {
        emaiRef?.current?.setValue(email);
        setEmail(email);
      }
      if (district) {
        districtRef?.current?.setValue(district);
        setDistrict(district);
      }
      if (address) {
        addressRef?.current?.setValue(address);
        setAddress(address);
      }
    }
  }, []);

  /* <------------------- Ref -------------------> */
  const emaiRef = useRef(null);
  const districtRef = useRef(null);
  const addressRef = useRef(null);

  /* <------------------- State -------------------> */
  const [gender, setGender] = useState(0);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [isShowListDisTrict, setIsShowListDisTrict] = useState(false);
  const [showErrorDistrict, setShowErrorDistrict] = useState(false);
  const [email, setEmail] = useState('');
  const [showErrorEmail, setShowErrorEmail] = useState(false);
  const [showErrorDup, setShowErrorDup] = useState(false);
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);
  //
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [timerOTPEmail, setTimerOTPEmail] = useState(null);
  const [errorMessageOTPEmail, setErrorMessageOTPEmail] = useState('');
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);

  /* <------------------- Click -------------------> */
  const onPressSelectGender = useCallback(
    (index) => {
      setGender(index);
    },
    [setGender],
  );

  const onChangeEmail = useCallback((value) => {
    setEmail(value);
  }, []);

  const onChangeAddress = useCallback((value) => {
    setAddress(value);
  }, []);

  const onPressItemDistrict = useCallback((item) => {
    setDistrict(item?.value);
    districtRef?.current?.setValue(item?.value);
    setIsVisiblePicker(false);
  }, []);

  const _checkDupEmail = (email, callback) => {
    actions.checkDuplicateEmail(email, callback);
  };

  /* <------------------- Submit -------------------> */
  const onSubmit = useCallback(() => {
    const callback = (resopnse) => {
      if (resopnse.status) {
        navigation.goBack();
      }
    };
    const isValidEmail = isEmailValid(email);
    const isValidDistrict = !isEmpty(district);
    setShowErrorEmail(!isValidEmail);
    setShowErrorDup(false);
    if (!isValidEmail || !isValidDistrict) {
      return;
    }

    const payload = payloadEdit();
    if (isEmpty(payload)) {
      return;
    }
    if (payload.email) {
      _checkDupEmail(payload.email, (check) => {
        if (!check) {
          setShowErrorDup(!check);
        } else {
          setIsVerifiedEmail(false);
          setShowModalOTP(true);
          sendEmailOTP(payload.email);
          delete payload.email;
          setTimeout(() => {
            if (!isEmpty(payload)) {
              trackEventBasic();
              actions.updateUserMetaStep(payload);
            }
          }, 1000);
        }
      });
    } else {
      trackEventBasic();
      actions.updateUserMetaStep(payload, callback);
    }
  }, [email, district, address, gender, payloadEdit, sendEmailOTP, trackEventBasic, navigation]);

  const trackEventBasic = useCallback(() => {
    DigitelClient.trackEvent(TrackingEvents.UPDATE_METADATA_BASIC);
    logEvent(TrackingEvents.UPDATE_METADATA_BASIC);
  }, []);

  const sendEmailOTP = useCallback(
    async (email) => {
      if (email) {
        const callback = (payload) => {
          if (!payload?.resendTime) {
            setErrorMessageOTPEmail(payload?.message || '');
          } else {
            setErrorMessageOTPEmail('');
            setTimerOTPEmail(payload?.resendTime);
          }
        };
        actions.dispatchSendEmailOTP(email, callback);
      }
    },
    [actions, setTimerOTPEmail],
  );

  const verifyEmailOTP = useCallback(
    async (otpCode) => {
      if (email && otpCode) {
        const callback = (payload) => {
          if (!payload?.status) {
            setErrorMessageOTPEmail(payload?.message || '');
          } else {
            setErrorMessageOTPEmail('');
            actions.updateUserMetaStep({ email });
            setIsVerifiedEmail(true);
          }
        };
        actions.dispatchVerifyEmailOTP(email, otpCode, callback);
      }
    },
    [actions, email],
  );

  const onHandlerCountdownDoneOTPEmail = useCallback(() => {
    setTimerOTPEmail(null);
  }, [setTimerOTPEmail]);

  const onBackModal = useCallback(() => {
    setShowModalOTP(!showModalOTP);
  }, [showModalOTP, setShowModalOTP]);

  const onGobackMain = useCallback(() => {
    onBackModal();
    navigation.goBack();
  }, [onBackModal, navigation]);

  const payloadEdit = useCallback(() => {
    const payload = {};
    const genderValue = GENDER_LIST?.[gender]?.value;
    if (genderValue !== userMetaData?.gender && genderValue) {
      payload.gender = genderValue;
    }
    if (email !== userMetaData?.email && email) {
      payload.email = email;
    }
    if (address !== userMetaData?.address && address) {
      payload.address = address;
    }
    if (district !== userMetaData?.district && district) {
      payload.district = district;
    }
    return payload;
  }, [email, district, address, gender, userMetaData]);

  const onEnableButtonSubmit = useCallback(() => {
    const payload = payloadEdit();
    return !isEmpty(payload) && !isEmpty(email) && !isEmpty(district) && !isEmpty(address);
  }, [email, district, address, gender, userMetaData]);

  const onPressSelectDistrict = useCallback(() => {
    addressRef?.current?.blur();
    emaiRef?.current?.blur();
    setTimeout(() => {
      setIsVisiblePicker(true);
    });
  }, []);

  const onClosePicker = useCallback(() => {
    setIsVisiblePicker(false);
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
      <ScrollView style={styles.wrapper} keyboardShouldPersistTaps="handled">
        <View style={styles.wrapper}>
          <View style={styles.formWrapper}>
            <View style={styles.genderContainer}>
              <AppText style={styles.labelGender}>Giới tính</AppText>
              <GroupCheckBox
                checkBoxItems={GENDER_LIST}
                selectedIndex={gender}
                onPress={onPressSelectGender}
              />
            </View>
            <CustomTextField
              ref={emaiRef}
              autoCapitalize={'words'}
              textFieldLabel={'Email'}
              keyboardType={'email-address'}
              showError={showErrorEmail || showErrorDup}
              textFieldValue={email}
              returnKeyType="next"
              errorMessage={
                showErrorDup
                  ? 'Email này đã tồn tại trên hệ thống, vui lòng kiểm tra lại hoặc sử dụng địa chỉ email khác '
                  : 'Email không hợp lệ.'
              }
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginBottom: 10, marginTop: 20 }}
              onChangeTextFieldText={onChangeEmail}
            />
            <CustomTextField
              ref={addressRef}
              textFieldValue={address}
              showError={false}
              containerStyle={{ marginVertical: 10, marginBottom: 10, marginTop: 20 }}
              textFieldLabel={'Địa chỉ liên hệ'}
              textFieldContainerStyle={styles.textFieldContainerStyle}
              onChangeTextFieldText={onChangeAddress}
            />
            <WrapperCustomTextField
              ref={districtRef}
              textFieldLabel={'Quận/Huyện - Tỉnh/Thành phố *'}
              textFieldValue={district}
              returnKeyType="next"
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginVertical: 10 }}
              errorMessage="Nhập kí tự tìm kiếm và chọn từ danh sách hiện ra\n(vd: Q. 3 - Ho Chi Minh hoặc H. Dong Anh - Ha Noi)"
              onPress={onPressSelectDistrict}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <SubmitButton
              label={'Cập nhật'}
              disabled={!onEnableButtonSubmit()}
              onPress={onSubmit}
            />
          </View>
        </View>
      </ScrollView>
      <LoadingModal visible={isLoadingUpdate} />
      <ModalOTP
        verifyInfor={{
          by: 'Email',
          to: email,
        }}
        label={!isVerifiedEmail ? 'Xác thực Email' : 'Quay lại'}
        lableSuccess={'Cập nhật email'}
        descSuccess={'Yêu cầu đổi email của bạn thành công'}
        isLoadingPhoneOTP={isLoading}
        isVisible={showModalOTP}
        isVerified={isVerifiedEmail}
        onCloseModal={onBackModal}
        timer={timerOTPEmail}
        onResendOTP={sendEmailOTP}
        errorMessageOTP={errorMessageOTPEmail}
        onSubmitVerify={verifyEmailOTP}
        onGobackMain={onGobackMain}
        onHandlerCountdownDone={onHandlerCountdownDoneOTPEmail}
      />
      <PickerSelector
        title={'Huyện / Tỉnh'}
        data={arrDistricts}
        onPressItem={onPressItemDistrict}
        onCloseModal={onClosePicker}
        isVisible={isVisiblePicker}
      />
    </KeyboardAvoidingView>
  );
};

export default AccountBasicUpdate;
