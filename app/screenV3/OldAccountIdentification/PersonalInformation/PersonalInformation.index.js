import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
// components
import GroupCheckBox from '../../../componentV3/GroupCheckBox';
import CustomTextField from '../../../componentV3/CustomTextField';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import WrapperCustomTextField from '../../../componentV3/WrapperCustomTextField';
import PickerSelector from '../../../componentV3/PickerSelector';
import AppText from '../../../componentV3/AppText';

// style
import styles from './PersonalInformation.style';

// isvalid
import { isEmailValid } from 'app/utils/Utils';

import { GENDER_LIST } from './PersonalInformation.constants';
import { SH } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { useSelector } from 'react-redux';

import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../../redux/selectors/userMetaDataSelectors';
import { useActions } from '../../../hooks/useActions';
import { checkDuplicateEmail } from '../../../redux/actions/actionsV3/userMetaData';

function PersonalInformation({ persionalInfor, onHandlerNextStep, listDistrict, navigation }) {
  /* <------------------- Ref -------------------> */
  const emaiRef = useRef(null);
  const districtRef = useRef(null);
  const addressRef = useRef(null);

  /* <------------------- State -------------------> */
  const [gender, setGender] = useState(0);
  const [email, setEmail] = useState('');
  const [showErrorEmail, setShowErrorEmail] = useState(false);
  const [showErrorDup, setShowErrorDup] = useState(false);
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);

  const appInfo = useSelector((state) => state.appInfo);
  const actions = useActions({
    checkDuplicateEmail,
  });

  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  useEffect(() => {
    if (persionalInfor) {
      const { gender, email, district, address } = persionalInfor;
      if (gender) {
        let indexGender = GENDER_LIST.findIndex((item) => gender === item?.value);
        if (indexGender < 0) {
          indexGender = 0;
        }
        setGender(indexGender);
      }
      if (email) {
        emaiRef?.current?.setValue(email);
        emaiRef?.current?.blur();
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
  }, [persionalInfor]);

  useEffect(() => {
    if (isEmpty(persionalInfor?.email)) {
      emaiRef?.current?.focus();
    }
  }, [emaiRef, persionalInfor]);

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

  /* <------------------- Submit -------------------> */
  const onSubmit = useCallback(() => {
    const isValidEmail = isEmailValid(email);
    const isValidDistrict = !isEmpty(district);
    const genderValue = GENDER_LIST[gender];
    setShowErrorDup(false);
    setShowErrorEmail(!isValidEmail);
    if (!isValidEmail || !isValidDistrict) {
      return;
    }
    actions.checkDuplicateEmail(email, (check) => {
      if (!check) {
        setShowErrorDup(!check);
      } else {
        const payload = {
          email,
          district,
          address,
          gender: genderValue?.value,
        };
        if (typeof onHandlerNextStep === 'function') {
          onHandlerNextStep(payload);
        }
      }
    });
  }, [email, district, address, gender]);

  const onEnableButtonSubmit = useCallback(() => {
    return !isEmpty(email) && !isEmpty(district) && !isEmpty(address);
  }, [email, district, address]);

  const onPressSelectDistrict = useCallback(() => {
    addressRef?.current?.blur();
    emaiRef?.current?.blur();
    setTimeout(() => {
      setIsVisiblePicker(true);
    });
  }, []);

  const onPressItemDistrict = useCallback((item) => {
    setIsVisiblePicker(false);
    setDistrict(item?.value);
    districtRef?.current?.setValue(item?.value);
    setTimeout(() => {
      addressRef?.current?.focus();
    }, 500);
  }, []);

  const onSubmitEditingEmail = useCallback(() => {
    emaiRef?.current?.blur();
    setIsVisiblePicker(true);
  }, []);

  const onSubmitEditingDistrict = useCallback(() => {
    addressRef?.current?.focus();
  }, []);

  const renderIndicatorDistrict = useCallback(() => {
    if (!district) return <View />;
    return (
      <View style={styles.indicatorDistrictContainer}>
        <AppText style={styles.indicatorDistrictTxt} numberOfLines={1}>
          {district}
        </AppText>
      </View>
    );
  }, [district]);

  const onClosePicker = useCallback(() => {
    setIsVisiblePicker(false);
  }, []);

  const openTermAndPrivacyView = () => {
    const title = 'Điều khoản sử dụng';
    const url = appInfo.termsOfUsageUrl;
    navigation.navigate('WebView', { mode: 0, title, url });
  };

  /* <------------------- Render -------------------> */

  const timeDeleteAccount = userMetaData?.isCTVConfirmed ? '6' : '3';
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.wrapper} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.wrapper}>
          <View style={styles.formWrapper}>
            <View style={styles.genderContainer}>
              <AppText style={styles.labelGender}>Giới tính *</AppText>
              <GroupCheckBox
                checkBoxItems={GENDER_LIST}
                selectedIndex={gender}
                onPress={onPressSelectGender}
              />
            </View>
            <CustomTextField
              ref={emaiRef}
              autoCapitalize={'words'}
              textFieldLabel={'Email *'}
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
              onSubmitEditing={onSubmitEditingEmail}
            />
            <WrapperCustomTextField
              ref={districtRef}
              textFieldLabel={'Quận/Huyện - Tỉnh/Thành phố *'}
              textFieldValue={district}
              returnKeyType="next"
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginVertical: 10 }}
              errorMessage="Nhập kí tự tìm kiếm và chọn từ danh sách hiện ra\n(vd: Q. 3 - Ho Chi Minh hoặc H. Dong Anh - Ha Noi)"
              onSubmitEditing={onSubmitEditingDistrict}
              onPress={onPressSelectDistrict}
              subNote={`Nhập kí tự tìm kiếm và chọn từ danh sách hiện ra\n(vd: Q.3 - Ho Chi Minh hoặc H. Dong Anh - Ha Noi)`}
            />
            <CustomTextField
              ref={addressRef}
              textFieldValue={address}
              showError={false}
              textFieldInputStyle={{ flex: 1, marginRight: 130, paddingRight: 6 }}
              textFieldLabel={'Địa chỉ liên hệ *'}
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginVertical: 10 }}
              onChangeTextFieldText={onChangeAddress}
              rightComponent={renderIndicatorDistrict}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <SubmitButton
              label={'Tiếp tục'}
              disabled={!onEnableButtonSubmit()}
              onPress={onSubmit}
            />
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
      </ScrollView>
      <PickerSelector
        title={'Huyện / Tỉnh'}
        data={listDistrict}
        onPressItem={onPressItemDistrict}
        onCloseModal={onClosePicker}
        isVisible={isVisiblePicker}
      />
    </View>
  );
}

export default PersonalInformation;
