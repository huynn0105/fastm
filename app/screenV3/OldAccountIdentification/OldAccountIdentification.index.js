import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Text, View, Platform, Alert, Keyboard } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// components
import PersonalInformation from './PersonalInformation/PersonalInformation.index';
import EmailVerify from './EmailVerify/EmailVerify.index';
import IdentityCard from './IdentityCard/IdentityCard.index';
import ContractCollaborators from './ContractCollaborators/ContractCollaborators.index';
import LoadingModal from '../../componentV3/LoadingModal';
import ModalOTP from '../../componentV3/ModalOTP';
import PopupInReview from './comp/PopupInReview';
import AppText from '../../componentV3/AppText';
// style
import styles from './OldAccountIdentification.style';

// constants
import {
  LABEL_STEP_ACCOUNT_IDENTIFY,
  INDICATOR_STYLES,
  STEP_STATUS,
  PAGE_ACCOUNT_IDENTIFY,
  KEY_PAGE,
} from './OldAccountIdentification.contants';
import { ENUM_COUNTRY_ID_STATUS } from '../../models/userMeta';

import DigitelClient from '../../network/DigitelClient';
import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { useActions } from '../../hooks/useActions';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import {
  getObjectDistrictSelector,
  getArrDistrictSelector,
} from '../../redux/selectors/districtSelector';
import { findDistrictsByText } from '../../redux/actions/customerForm';
import {
  dispatchSendEmailOTP,
  dispatchVerifyEmailOTP,
} from '../../redux/actions/actionsV3/sendEmalOTP';
import {
  dispatchSendPhoneOTP,
  dispatchVerifyPhoneOTP,
} from '../../redux/actions/actionsV3/sendPhoneOTP';

import { updateUserMetaStep } from '../../redux/actions/actionsV3/userMetaData';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';
import {
  getIsLoadingPhoneOTP,
  getCommonLoadingSelector,
  getIsLoadingUpdateUserMeta,
} from '../../redux/selectors/commonLoadingSelector';

import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';
import { TrackingEvents } from '../../constants/keys';
import { logEvent, logEventWithAttibute } from '../../tracking/Firebase';

function OldAccountIdentification({ navigation }) {
  const pageRef = useRef(null);

  //
  const objectDistricts = useSelectorShallow(getObjectDistrictSelector);
  const isLoading = useSelectorShallow(getCommonLoadingSelector);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const myUser = useSelectorShallow(getMyuserSelector);
  const isLoadingPhoneOTP = useSelectorShallow(getIsLoadingPhoneOTP);
  const appInfor = useSelectorShallow(getAppInforSelector);
  const isProcessingMetaData = useSelectorShallow(getIsLoadingUpdateUserMeta);
  const arrDistricts = useSelectorShallow(getArrDistrictSelector);

  const actions = useActions({
    findDistrictsByText,
    dispatchSendEmailOTP,
    dispatchVerifyEmailOTP,
    updateUserMetaStep,
    dispatchSendPhoneOTP,
    dispatchVerifyPhoneOTP,
  });

  /* <------------------- State -------------------> */
  const [initStep, setInitStep] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const [persionalInfor, setPersionalInfor] = useState(null);
  const [citizenIdentify, setCitizenIdentify] = useState(null);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [byPassStep, setByPassStep] = useState(0);
  const [timerOTPEmail, setTimerOTPEmail] = useState(null);
  const [errorMessageOTPEmail, setErrorMessageOTPEmail] = useState('');
  const [timerOTPPhone, setTimerOTPPhone] = useState(null);
  const [errorMessageOTPPhone, setErrorMessageOTPPhone] = useState('');
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);
  const [isCTVConfirmed, setIsCTVConfirmed] = useState(false);
  const [countryIdStatus, setCountryIdStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMessageCMND, setErrorMessageCMND] = useState('');

  useEffect(() => {
    if (userMetaData) {
      const currentVerifiedEmail = !!userMetaData?.isVerifiedEmail;
      if (!currentVerifiedEmail) {
        setByPassStep(0);
        setInitStep(0);
        hanlderScrollPage(0);
        return;
      }
      if (userMetaData?.isCTVConfirmed) {
        setIsVerifiedPhone(true);
        setShowModalOTP(true);
        return;
      }
      if (userMetaData?.countryIdStatus || currentVerifiedEmail) {
        if (
          userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING ||
          currentVerifiedEmail
        ) {
          setByPassStep(2);
          setInitStep(2);
          hanlderScrollPage(2);
        }
        if (userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
          setByPassStep(3);
          setInitStep(3);
          hanlderScrollPage(3);
        }
        return;
      }
      setInitStep(0);
    } else {
      setInitStep(0);
    }
  }, [hanlderScrollPage, setByPassStep]);

  useEffect(() => {
    setPersionalInfor({
      email: userMetaData?.email || '',
      gender: userMetaData?.gender,
      address: userMetaData?.address || '',
      district: userMetaData?.district || '',
    });
    setCitizenIdentify({
      countryIdDateOfBirth: userMetaData?.countryIdDateOfBirth || '',
      countryIdIssuedBy: userMetaData?.countryIdIssuedBy || '',
      countryIdIssuedDate: userMetaData?.countryIdIssuedDate || '',
      countryIdName: userMetaData?.countryIdName || '',
      countryIdNumber: userMetaData?.countryIdNumber || '',
      countryIdPhotoBack: userMetaData?.countryIdPhotoBack || '',
      countryIdPhotoFront: userMetaData?.countryIdPhotoFront || '',
      countryIdNote: userMetaData?.countryIdNote || '',
      countryIdStatus: userMetaData?.countryIdStatus,
      countryIdAddress: userMetaData?.countryIdAddress,
    });
    if (userMetaData?.countryIdStatus === 'FAILURE') {
      setErrorMessageCMND(
        userMetaData?.countryIdRequestMessage || 'Duyệt thất bại vui lòng thử chụp ảnh lại!',
      );
    }
    setIsVerifiedEmail(!!userMetaData?.isVerifiedEmail);
    setIsCTVConfirmed(!!userMetaData?.isCTVConfirmed);
    setCountryIdStatus(userMetaData?.countryIdStatus);
  }, []);

  /* <------------------- Change -------------------> */

  const onStepPress = useCallback(
    (position) => {
      const pos = parseInt(position);
      if (pos <= byPassStep) {
        Keyboard.dismiss();
        hanlderScrollPage(pos);
      }
    },
    [pageRef, byPassStep, hanlderScrollPage],
  );

  const onRequestLocation = useCallback(() => {
    checkAndRequestPermissionLocation((location) => {
      setLocation(location);
    });
  }, []);

  const addEventFinishKyc = useCallback(() => {
    if ((location?.latitude, location?.longitude)) {
      DigitelClient.trackEvent(TrackingEvents.FINISH_KYC, location?.latitude, location?.longitude);
      logEvent(TrackingEvents.FINISH_KYC, {
        // latitude: location?.latitude,
        // longitude: location?.longitude,
      });
    }
  }, [location]);

  const hanlderScrollPage = useCallback(
    (position) => {
      if (typeof position !== 'number' || position < 0) return;
      setCurrentStep(position);
      if (Platform.OS === 'android') {
        pageRef?.current?.scrollTo(position);
      }
    },
    [pageRef, setCurrentStep],
  );

  /* <------------------- NextStep -------------------> */
  const payloadEdit = (userUpdate) => {
    const { email, district, address, gender } = userUpdate;
    const payload = {};
    const genderValue = gender;
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
  };

  const onNextStepVerifyEmail = useCallback(
    (payload) => {
      Keyboard.dismiss();
      hanlderScrollPage(1);
      setPersionalInfor(payload);
      const editer = payloadEdit(payload);
      if (!isEmpty(editer)) {
        setTimeout(() => {
          actions.updateUserMetaStep(editer);
        }, 250);
      }
      setTimeout(() => {
        if (editer.email || !isVerifiedEmail) {
          sendEmailOTP(payload?.email);
        }
      }, 200);
    },
    [
      myUser,
      currentStep,
      setCurrentStep,
      actions,
      isVerifiedEmail,
      hanlderScrollPage,
      userMetaData,
      payloadEdit,
    ],
  );

  const onNextStepVerifyIdentityCard = useCallback(
    (payload) => {
      hanlderScrollPage(2);
    },
    [currentStep, setCurrentStep, hanlderScrollPage],
  );

  const onNextStepContractCollaborators = useCallback(
    (payload) => {
      setCitizenIdentify(payload);
      const callback = (response) => {
        if (response.status) {
          setErrorMessageCMND('');
          if (payload.countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING) {
            setCountryIdStatus(ENUM_COUNTRY_ID_STATUS.PENDING);
            return;
          }
          hanlderScrollPage(3);
        } else {
          setErrorMessageCMND(response?.message || 'Có lỗi xảy ra vui lòng thử lại.');
        }
      };
      if (payload.countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING) {
        setErrorMessageCMND('');
        actions.updateUserMetaStep(payload, callback);
      } else {
        if (!userMetaData?.countryIdStatus) {
          setErrorMessageCMND('');
          actions.updateUserMetaStep(payload, callback);
        } else {
          setErrorMessageCMND('');
          hanlderScrollPage(3);
        }
      }
    },
    [actions, userMetaData],
  );

  const onNextStepVerifyPhone = useCallback(() => {
    if (userMetaData?.isVerifiedEmail && userMetaData?.countryIdNumber) {
      setTimeout(() => {
        setShowModalOTP(true);
      }, 300);
      setTimeout(() => {
        sendPhoneOTP(myUser?.mPhoneNumber);
      }, 600);
    } else {
      Alert.alert(
        'Định danh',
        'Bạn vẫn chưa điền đầy đủ các thông tin, vui lòng kiểm tra lại các bước.',
        [
          {
            text: 'Đóng',
            onPress: () => {},
            style: 'cancel',
          },
        ],
      );
    }
  }, [myUser, sendPhoneOTP, userMetaData]);

  const onBackModal = useCallback(() => {
    setShowModalOTP(!showModalOTP);
    if (isVerifiedPhone) {
      navigation.replace('AccountInforScreen');
    }
  }, [showModalOTP, setShowModalOTP, isVerifiedPhone, navigation]);

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
      if (persionalInfor?.email && otpCode) {
        const callback = (payload) => {
          if (!payload?.status) {
            setErrorMessageOTPEmail(payload?.message || '');
          } else {
            setErrorMessageOTPEmail('');
            actions.updateUserMetaStep({
              email: persionalInfor?.email,
            });

            const data = {
              user_id: myUser?.uid,
              phoneNumber: myUser?.mPhoneNumber,
              fullName: myUser?.fullName,
              email: persionalInfor?.email,
            };
            logEventWithAttibute(data);
            setIsVerifiedEmail(true);
            setByPassStep(2);
            hanlderScrollPage(2);
          }
        };
        actions.dispatchVerifyEmailOTP(persionalInfor?.email, otpCode, callback);
      }
    },
    [actions, persionalInfor, hanlderScrollPage],
  );

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
        actions.dispatchSendPhoneOTP(mobilePhone, null, callback, 1);
      }
    },
    [actions, setErrorMessageOTPPhone, setTimerOTPPhone],
  );

  const verifyPhoneOTP = useCallback(
    async (otpCode) => {
      if (myUser?.mPhoneNumber && otpCode) {
        const callback = (payload) => {
          if (!payload?.status) {
            setErrorMessageOTPPhone(payload?.data?.err_msg || '');
            setIsVerifiedPhone(false);
          } else {
            setErrorMessageOTPPhone('');
            setIsVerifiedPhone(true);
            actions.updateUserMetaStep({ isCTVConfirmed: true });
            addEventFinishKyc();
          }
        };
        actions.dispatchVerifyPhoneOTP(myUser?.mPhoneNumber, otpCode, callback);
      }
    },
    [actions, myUser, addEventFinishKyc],
  );

  const onPressPreviewInputEmail = useCallback(() => {
    hanlderScrollPage(0);
  }, [hanlderScrollPage]);

  const onHandlerCountdownDone = useCallback(() => {
    setTimerOTPEmail(null);
  }, [setTimerOTPEmail]);

  const onHandlerCountdownDoneOTPPhone = useCallback(() => {
    setTimerOTPPhone(null);
  }, [setTimerOTPPhone]);

  /* <------------------- Components -------------------> */
  const renderStepIndicator = useCallback((params) => {
    let bGColor = ['rgb(40, 158, 255)', 'rgb(0, 91, 243)'];
    let colorLabel = { color: Colors.primary5 };
    if (params?.stepStatus === STEP_STATUS.unfinished) {
      bGColor = [Colors.neutral4, Colors.neutral4];
      colorLabel = { color: Colors.primary3 };
    }
    return (
      <LinearGradient
        colors={bGColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.linearGradient}
      >
        <View style={styles.stepIndicatorContainer}>
          {params?.stepStatus === STEP_STATUS.finished ? (
            <Icon name="check" size={16} color={'#fff'} />
          ) : (
            <AppText style={[styles.txtLabelIndicator, colorLabel]}>
              {(params?.position || 0) + 1}
            </AppText>
          )}
        </View>
      </LinearGradient>
    );
  }, []);

  const renderLabel = useCallback(({ position, label, currentPosition }) => {
    const currentStyle =
      position === currentPosition
        ? { fontWeight: '500', color: Colors.primary4 }
        : { opacity: 0.6 };
    return <AppText style={[styles.txtLabel, currentStyle]}>{label}</AppText>;
  }, []);

  const onSearchDistricts = useCallback(
    (keyword) => {
      actions.findDistrictsByText(objectDistricts, keyword);
    },
    [actions, objectDistricts],
  );

  const onChangeErrorMessageCMND = useCallback(() => {
    setErrorMessageCMND('');
  }, []);

  /* render step page */
  const renderViewPagerPage = useCallback(
    (page) => {
      let rawView = <View />;
      switch (page?.key) {
        case KEY_PAGE.personalInformation:
          rawView = (
            <PersonalInformation
              listDistrict={arrDistricts}
              persionalInfor={persionalInfor}
              onHandlerNextStep={onNextStepVerifyEmail}
              onSearchDistricts={onSearchDistricts}
              navigation={navigation}
            />
          );
          break;
        case KEY_PAGE.emailVerify:
          rawView = (
            <EmailVerify
              timer={timerOTPEmail}
              errorMessageOTP={errorMessageOTPEmail}
              onResendOTP={sendEmailOTP}
              submitVerifyOTP={verifyEmailOTP}
              email={persionalInfor?.email}
              isVerifiedEmail={isVerifiedEmail}
              onPressPreviewInputEmail={onPressPreviewInputEmail}
              onHandlerNextStep={onNextStepVerifyIdentityCard}
              onHandlerCountdownDone={onHandlerCountdownDone}
            />
          );
          break;
        case KEY_PAGE.identityCard:
          rawView = (
            <IdentityCard
              countryIdStatus={countryIdStatus}
              citizenIdentify={citizenIdentify}
              navigation={navigation}
              errorMessageCMND={errorMessageCMND}
              onHandlerNextStep={onNextStepContractCollaborators}
              onChangeErrorMessageCMND={onChangeErrorMessageCMND}
            />
          );
          break;
        default:
          rawView = (
            <ContractCollaborators
              isCTVConfirmed={isCTVConfirmed}
              onFocus={currentStep === 3}
              ctvUserMFastUrl={appInfor?.ctvUserMFastUrl}
              countryIdNumber={userMetaData?.countryIdNumber}
              accessToken={myUser?.accessToken}
              onHandlerNextStep={onNextStepVerifyPhone}
              onRequestLocation={onRequestLocation}
            />
          );
          break;
      }
      return (
        <View key={page?.key} style={styles.pageWrapper}>
          {rawView}
        </View>
      );
    },
    [
      onChangeErrorMessageCMND,
      errorMessageCMND,
      onRequestLocation,
      appInfor,
      myUser,
      countryIdStatus,
      isCTVConfirmed,
      timerOTPEmail,
      navigation,
      currentStep,
      persionalInfor,
      arrDistricts,
      citizenIdentify,
      errorMessageOTPEmail,
      isVerifiedEmail,
      onNextStepVerifyEmail,
      onSearchDistricts,
      onNextStepVerifyIdentityCard,
    ],
  );

  const onGobackMain = useCallback(() => {
    setCountryIdStatus(null);
    navigation.goBack();
  }, [navigation]);

  const onGoBackOTP = useCallback(() => {
    setShowModalOTP(false);
    if (isVerifiedPhone) {
      navigation.replace('AccountInforScreen');
    }
  }, [navigation, isVerifiedPhone]);

  const stepNumber = useCallback(
    () => (Platform.OS === 'android' ? initStep : currentStep),
    [initStep, currentStep],
  );

  const renderPages = useCallback(() => {
    if (initStep < 0) {
      return <View />;
    }
    return (
      <Swiper
        ref={pageRef}
        width={SCREEN_WIDTH}
        autoplay={false}
        loop={false}
        index={stepNumber()}
        scrollEnabled={false}
        showsPagination={false}
        style={styles.swipperWrapper}
        keyboardShouldPersistTaps={'handled'}
      >
        {PAGE_ACCOUNT_IDENTIFY.map(renderViewPagerPage)}
      </Swiper>
    );
  }, [initStep, stepNumber, renderViewPagerPage]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.stepContainer}>
        <StepIndicator
          onPress={onStepPress}
          currentPosition={currentStep}
          customStyles={INDICATOR_STYLES}
          labels={LABEL_STEP_ACCOUNT_IDENTIFY}
          renderLabel={renderLabel}
          renderStepIndicator={renderStepIndicator}
          stepCount={LABEL_STEP_ACCOUNT_IDENTIFY?.length || 1}
        />
      </View>
      {renderPages()}
      <ModalOTP
        isLoadingPhoneOTP={isLoadingPhoneOTP}
        isVisible={showModalOTP}
        verifyInfor={{
          by: 'SĐT',
          to: myUser?.mPhoneNumber,
        }}
        isVerified={isVerifiedPhone}
        onCloseModal={onBackModal}
        timer={timerOTPPhone}
        onResendOTP={sendPhoneOTP}
        errorMessageOTP={errorMessageOTPPhone}
        onSubmitVerify={verifyPhoneOTP}
        onHandlerCountdownDone={onHandlerCountdownDoneOTPPhone}
        onGobackMain={onGoBackOTP}
      />
      <LoadingModal visible={isLoading} />
      <PopupInReview
        isVisible={countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING}
        onGobackMain={onGobackMain}
      />
    </View>
  );
}

export default OldAccountIdentification;
