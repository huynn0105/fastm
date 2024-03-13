import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from 'react-native';

import FormUpdatePhoneNumber from './FormUpdatePhoneNumber';

import LoadingModal from '../../componentV3/LoadingModal';
import CheckBox from '../../componentV3/CheckBox';
import styles from './AccountAdvancedUpdate.styles';
import ModalOTP from '../../componentV3/ModalOTP';

// selectors
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { getIsLoadingPhoneOTP } from '../../redux/selectors/commonLoadingSelector';

// actions
import { useActions } from '../../hooks/useActions';
import {
  dispatchSendPhoneOTP,
  dispatchVerifyPhoneOTP,
  dispatchVerifyUpdatePhoneOTP,
} from '../../redux/actions/actionsV3/sendPhoneOTP';

import { updateCMNDUser } from '../../redux/actions/actionsV3/userMetaData';
import { logout } from '../../redux/actions';

import DigitelClient from '../../network/DigitelClient';
import { TrackingEvents } from '../../constants/keys';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import BottomActionSheet from '../../components2/BottomActionSheet';
import { useRef } from 'react';
import { ICON_PATH } from '../../assets/path';
import {
  dispatchSendEmailOTP,
  dispatchVerifyEmailOTP,
} from '../../redux/actions/actionsV3/sendEmalOTP';

const KEY_ACTION = {
  phoneNumber: 'PHONE_NUMBER',
  identifyCard: 'IDENTIFY_CARD',
};

const AccountAdvancedUpdate = ({ navigation }) => {
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const isLoadingPhoneOTP = useSelectorShallow(getIsLoadingPhoneOTP);

  // state
  const [idChecked, setIsChecked] = useState(KEY_ACTION.phoneNumber);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoadinng] = useState(false);
  const [errorCheckPhone, setErrorCheckPhone] = useState(false);
  const [errorMessageCheckPhone, setErrorMessageCheckPhone] = useState(false);
  const [selectedIndexItem, setSelectedIndexItem] = useState(-1);
  const [typeValidate, setTypeValidate] = useState('phone');

  const [tempCMND, setTempCMND] = useState(null);

  // otp modal
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [timerOTPPhone, setTimerOTPPhone] = useState(null);
  const [errorMessageOTPPhone, setErrorMessageOTPPhone] = useState('');
  const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);

  //ref

  const actionSheetRef = useRef(null);

  // actions
  const actions = useActions({
    dispatchSendPhoneOTP,
    dispatchVerifyUpdatePhoneOTP,
    updateCMNDUser,
    logout,
    dispatchSendEmailOTP,
    dispatchVerifyEmailOTP,
    dispatchVerifyPhoneOTP,
  });

  //
  useEffect(() => {
    // get status update cmnd.
    actions.updateCMNDUser(null, (response) => {
      if (response.status) {
        setTempCMND(response.data);
      }
    });
  }, [actions]);

  const callbackTempCMND = useCallback((response) => {
    Alert.alert(
      'Cập nhật thông tin định danh',
      `${response?.message || ''}`,
      [
        {
          text: 'Đóng',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
    if (response.status) {
      setTempCMND(response.data);
    }
  }, []);

  const isValidPhoneNumber = useCallback(async (phone) => {
    const response = await DigitelClient.checkDuplicatePhoneNumber(phone);

    if (response) {
      if (response.status) {
        setPhoneNumber(phone);
      } else {
        setPhoneNumber('');
      }
      setErrorCheckPhone(!response.status);
      setErrorMessageCheckPhone(response.message);
    } else {
      setErrorCheckPhone(true);
      setErrorMessageCheckPhone('Có lỗi xảy ra vui lòng thử lại!');
    }
    return !!response.status;
  }, []);

  const sendPhoneOTP = useCallback(
    async (mobilePhone) => {
      if (mobilePhone) {
        const callback = (payload) => {
          if (!payload?.resendTime) {
            setErrorMessageOTPPhone(payload?.message || '');
          } else {
            setIsVerifiedPhone(false);
            setErrorMessageOTPPhone('');
            setTimerOTPPhone(payload?.resendTime);
          }
        };
        actions.dispatchSendPhoneOTP(mobilePhone, null, callback, 1, 'profile');
      }
    },
    [actions, setErrorMessageOTPPhone, setTimerOTPPhone],
  );

  const verifyPhoneOTP = useCallback(
    async (otpCode) => {
      if (phoneNumber && otpCode) {
        const callback = (payload) => {
          if (payload?.status) {
            updatePhoneNumber(phoneNumber);
          }
          // if (!payload?.status) {
          //   setErrorMessageOTPPhone(payload?.message || '');
          //   setIsVerifiedPhone(false);
          // } else {
          //   setIsVerifiedPhone(true);
          //   trackEventAdvance();
          //   setErrorMessageOTPPhone('');

          // }
        };
        actions.dispatchVerifyPhoneOTP(userMetaData?.mobilePhone, otpCode, callback);
      }
    },
    [actions, phoneNumber, trackEventAdvance],
  );

  const onBackModal = useCallback(() => {
    setShowModalOTP(!showModalOTP);
  }, [showModalOTP, setShowModalOTP]);

  const onHandlerCountdownDoneOTPPhone = useCallback(() => {
    setTimerOTPPhone(null);
  }, [setTimerOTPPhone]);

  const onGobackMain = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressSelect = useCallback((id) => {
    setIsChecked(id);
  }, []);

  const onSubmitUpdatePhoneNumber = useCallback(
    async (phoneNumber) => {
      const isValid = await isValidPhoneNumber(phoneNumber);

      if (isValid) {
        actionSheetRef.current.open();
        // setShowModalOTP(true);
        // sendPhoneOTP('0919339894');
      }
    },
    [isValidPhoneNumber],
  );

  const callPhoneOTP = () => {
    setTypeValidate('phone');
    actionSheetRef.current.close();
    setTimeout(() => {
      setShowModalOTP(true);
      sendPhoneOTP(userMetaData?.mobilePhone);
    }, 1000);
  };

  const callMailOTP = (email) => {
    actions.dispatchSendEmailOTP(email, (payload) => {
      if (!payload?.resendTime) {
        setErrorMessageOTPPhone(payload?.message || '');
      } else {
        setIsVerifiedPhone(false);
        setErrorMessageOTPPhone('');
        setTimerOTPPhone(payload?.resendTime);
      }
    });
  };

  const updatePhoneNumber = (phoneNumber) => {
    actions.dispatchVerifyUpdatePhoneOTP(phoneNumber, (payload) => {
      if (!payload.status) {
        setErrorMessageOTPPhone(payload?.message || '');
        setIsVerifiedPhone(false);
      } else {
        setIsVerifiedPhone(true);
        trackEventAdvance();
        setErrorMessageOTPPhone('');
        actions.logout(true);
      }
    });
  };

  const verifyMailOTP = (otpCode) => {
    actions.dispatchVerifyEmailOTP(userMetaData?.email, otpCode, (payload) => {
      if (payload?.status) {
        updatePhoneNumber(phoneNumber);
      }
    });
  };

  const sendMailOTP = () => {
    actionSheetRef.current.close();
    setTypeValidate('email');
    setTimeout(() => {
      setShowModalOTP(true);
      callMailOTP(userMetaData?.email);
    }, 500);
  };

  const onSubmitUpdateCMND = useCallback(
    (payload) => {
      trackEventAdvance();
      actions.updateCMNDUser(payload, callbackTempCMND);
    },
    [actions, callbackTempCMND, trackEventAdvance],
  );

  const trackEventAdvance = useCallback(() => {
    DigitelClient.trackEvent(TrackingEvents.UPDATE_METADATA_ADVANCE);
  }, []);

  const renderBottomSheet = () => {
    return (
      <View style={{}}>
        <View
          style={{
            backgroundColor: Colors.actionBackground,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: SH(46),
            paddingHorizontal: SW(16),
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
          }}
        >
          <Image
            source={ICON_PATH.close1}
            style={{ width: SW(16), height: SH(16), resizeMode: 'contain', opacity: 0 }}
          />
          <AppText style={styles.textStyleBasic}>Xác thực nhu cầu</AppText>
          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current.close();
            }}
          >
            <Image
              source={ICON_PATH.close1}
              style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: Colors.primary5, paddingHorizontal: SW(16) }}>
          <View style={{ marginTop: SH(12) }}>
            <AppText style={styles.textStyleBasic}>
              MFast sẽ gửi mã OTP để xác thực nhu cầu thay đổi số điện thoại của bạn. Vui lòng chọn
              1 trong 2 phương thức nhận dưới đây:
            </AppText>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => callPhoneOTP()}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: SH(16),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image source={ICON_PATH.iconPhone} style={styles.iconColorStyle} />
                <View style={{ marginLeft: SW(12) }}>
                  <AppText
                    medium
                    style={{ color: '#00bd8a', fontSize: SH(16), lineHeight: SH(23) }}
                  >
                    Số điện thoại đang sử dụng
                  </AppText>

                  <AppText medium style={[styles.textStyleBasic, { color: Colors.gray1 }]}>
                    {userMetaData?.mobilePhone}
                    {/* {myUser?.mPhoneNumber} */}
                  </AppText>
                </View>
              </View>
              <View>
                <Image
                  source={ICON_PATH.arrow_right_green}
                  style={{
                    width: SW(16),
                    height: SH(16),
                    resizeMode: 'contain',
                    tintColor: '#00bd8a',
                  }}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 0.5,
                backgroundColor: Colors.neutral3,
                marginVertical: SH(16),
                opacity: 0.75,
              }}
            />
            {userMetaData?.email?.length > 0 ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={sendMailOTP}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image source={ICON_PATH.iconMail} style={styles.iconColorStyle} />
                  <View style={{ marginLeft: SW(12) }}>
                    <AppText
                      medium
                      style={{ color: Colors.primary2, fontSize: SH(16), lineHeight: SH(23) }}
                    >
                      Email định đã danh tài khoản
                    </AppText>

                    <AppText medium style={[styles.textStyleBasic, { color: Colors.gray1 }]}>
                      {userMetaData?.email}
                      {/* {myUser?.mPhoneNumber} */}
                    </AppText>
                  </View>
                </View>
                <View>
                  <Image
                    source={ICON_PATH.arrow_right_green}
                    style={{
                      width: SW(16),
                      height: SH(16),
                      resizeMode: 'contain',
                      tintColor: Colors.primary2,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={{ height: SH(56) }} />
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        scrollIndicatorInsets={{ right: 0.5 }}
        style={styles.scrollWrapper}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.wrapperCheckbox}>
          <View style={{ marginBottom: SH(13) }}>
            <AppText style={styles.textStyleBasic}>Thông tin bạn cần thay đổi:</AppText>
          </View>
          {/* <AppText style={styles.txtTitle}>
                        Thông tin bạn cần thay đổi:
                    </AppText> */}
          {/* <CheckBox
                        id={KEY_ACTION.phoneNumber}
                        isChecked={idChecked === KEY_ACTION.phoneNumber}
                        label="Số điện thoại đăng nhập"
                        onPress={onPressSelect}
                    />
                    <CheckBox
                        id={KEY_ACTION.identifyCard}
                        isChecked={idChecked === KEY_ACTION.identifyCard}
                        label="Thông tin CMND"
                        onPress={onPressSelect}
                    />
                    {(idChecked === KEY_ACTION.identifyCard && tempCMND?.countryIdStatus) && (
                        <View style={styles.indicatorBox}>
                                <IndicatorBoxStatus
                                    status={tempCMND?.countryIdStatus || 'INIT'}
                                    message={tempCMND?.countryIdNote || ''}
                                />
                        </View>
                    )
                    } */}
          {/* <CheckBox
            id={KEY_ACTION.phoneNumber}
            isChecked={true}
            label="Số điện thoại đăng nhập"
            onPress={onPressSelect}
          /> */}
          <TouchableWithoutFeedback>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: SW(24),
                  height: SW(24),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: Colors.primary2,
                  borderWidth: 1,
                  borderRadius: SW(12),
                }}
              >
                <View
                  style={{
                    width: SW(16),
                    height: SW(16),
                    borderRadius: SW(8),
                    backgroundColor: Colors.primary2,
                  }}
                />
              </View>
              <AppText
                bold
                style={{
                  fontSize: SH(16),
                  lineHeight: SH(19),
                  color: Colors.gray1,
                  marginLeft: SW(10),
                }}
              >
                Số điện thoại đăng nhập
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ marginTop: SH(25) }}>
            <AppText style={styles.textStyleBasic}>Thông tin cần cung cấp:</AppText>
          </View>
        </View>

        <View>
          {/* {idChecked === KEY_ACTION.phoneNumber ? ( */}
          <FormUpdatePhoneNumber
            navigation={navigation}
            userMetaData={userMetaData}
            errorCheckPhone={errorCheckPhone}
            errorMessageCheckPhone={errorMessageCheckPhone}
            onSubmitUpdatePhoneNumber={onSubmitUpdatePhoneNumber}
          />
          {/* ) : (
                        <FormUpdateIdentityCard
                            navigation={navigation}
                            userMetaData={userMetaData}
                            onSubmitUpdateCMND={onSubmitUpdateCMND}
                            tempCMND={tempCMND}
                        /> 

                    )} */}
        </View>
      </ScrollView>
      <ModalOTP
        isLoadingPhoneOTP={isLoadingPhoneOTP}
        isVisible={showModalOTP}
        verifyInfor={{
          by: 'SĐT',
          to: userMetaData?.mobilePhone,
        }}
        lableSuccess={'Yêu cầu cập nhật số ĐT thành công !!!'}
        descSuccess={'Đăng nhập lại để tiếp tục sử dụng.'}
        isVerified={isVerifiedPhone}
        onCloseModal={onBackModal}
        timer={timerOTPPhone}
        onResendOTP={typeValidate === 'phone' ? sendPhoneOTP : sendMailOTP}
        errorMessageOTP={errorMessageOTPPhone}
        onSubmitVerify={typeValidate === 'phone' ? verifyPhoneOTP : verifyMailOTP}
        onHandlerCountdownDone={onHandlerCountdownDoneOTPPhone}
        onGobackMain={onGobackMain}
        type={typeValidate}
        email={userMetaData?.email}
      />
      <BottomActionSheet
        ref={(ref) => {
          actionSheetRef.current = ref;
        }}
        render={renderBottomSheet}
        canClose={true}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default AccountAdvancedUpdate;
