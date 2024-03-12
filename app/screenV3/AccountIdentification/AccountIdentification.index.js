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
import styles from './AccountIdentification.style';

// constants
import {
  LABEL_STEP_ACCOUNT_IDENTIFY,
  INDICATOR_STYLES,
  STEP_STATUS,
  PAGE_ACCOUNT_IDENTIFY,
  KEY_PAGE,
} from './AccountIdentification.contants';
import { ENUM_COUNTRY_ID_STATUS } from '../../models/userMeta';

import DigitelClient from '../../network/DigitelClient';
import Colors from '.././../theme/Color';
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

import {
  checkLivenessFPT,
  updateUserMetaStep,
  updateUserMetaData,
} from '../../redux/actions/actionsV3/userMetaData';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';
import { getCommonLoadingSelector } from '../../redux/selectors/commonLoadingSelector';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';

import { TrackingEvents } from '../../constants/keys';
import { logEvent, logEventAgent } from '../../tracking/Firebase';
import BankingAccount from './BankingAccount/BankingAccount';
import { showAlert } from '../../utils/UIUtils';
import ViewPager from '@react-native-community/viewpager';
import FakeModalLoading from '../../componentV3/LoadingModal/FakeModalLoading';
import { getBIDVData } from '../../redux/actions/actionsV3/banking';

function AccountIdentification({ navigation }) {
  const pageRef = useRef(null);
  const timeCallApiError = useRef(3);

  //
  const objectDistricts = useSelectorShallow(getObjectDistrictSelector);
  const isCommonLoading = useSelectorShallow(getCommonLoadingSelector);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);

  const myUser = useSelectorShallow(getMyuserSelector);
  const appInfor = useSelectorShallow(getAppInforSelector);
  const bidvData = useSelectorShallow((state) => state?.banking?.bidvData);

  const arrDistricts = useSelectorShallow(getArrDistrictSelector);

  const actions = useActions({
    findDistrictsByText,
    dispatchSendEmailOTP,
    dispatchVerifyEmailOTP,
    updateUserMetaStep,
    dispatchSendPhoneOTP,
    checkLivenessFPT,
    dispatchVerifyPhoneOTP,
    updateUserMetaData,
    getUserMetaData,
    getBIDVData,
  });

  /* <------------------- State -------------------> */
  const [currentStep, setCurrentStep] = useState(0);
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [byPassStep, setByPassStep] = useState(-1);
  const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);
  const [isCTVConfirmed, setIsCTVConfirmed] = useState(false);
  const [countryIdStatus, setCountryIdStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMessageCMND, setErrorMessageCMND] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isFetching) return;
    if (userMetaData?.isCTVConfirmed) {
      setIsVerifiedPhone(true);
      setShowModalOTP(true);
      return;
    }
    if (
      userMetaData?.isBanking &&
      userMetaData?.isVerifiedEmail &&
      userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS
    ) {
      setByPassStep(3);
      handlerScrollPage(3);
      return;
    }
    if (userMetaData?.isVerifiedEmail) {
      setByPassStep(2);
      handlerScrollPage(2);
      return;
    }

    if (userMetaData?.countryIdStatus === ENUM_COUNTRY_ID_STATUS.SUCCESS) {
      setByPassStep(1);
      handlerScrollPage(1);
      return;
    }
    setCurrentStep(0);
    setByPassStep(0);
    handlerScrollPage(0);
    if (userMetaData?.countryIdStatus === 'FAILURE') {
      setErrorMessageCMND(
        userMetaData?.countryIdRequestMessage || 'Duyệt thất bại vui lòng thử chụp ảnh lại!',
      );
    }
  }, [
    handlerScrollPage,
    isFetching,
    userMetaData?.countryIdRequestMessage,
    userMetaData?.countryIdStatus,
    userMetaData?.isBanking,
    userMetaData?.isCTVConfirmed,
    userMetaData?.isVerifiedEmail,
  ]);

  useEffect(() => {
    setIsCTVConfirmed(!!userMetaData?.isCTVConfirmed);
    setCountryIdStatus(userMetaData?.countryIdStatus);
  }, [userMetaData?.countryIdStatus, userMetaData?.isCTVConfirmed]);

  useEffect(() => {
    setIsFetching(true);
    actions.getBIDVData();
    actions.getUserMetaData(
      () => {
        setIsFetching(false);
      },
      () => {
        setIsFetching(false);
      },
    );
  }, [actions]);

  /* <------------------- Change -------------------> */

  const onStepPress = useCallback(
    (position) => {
      const pos = Number(position);
      if (pos <= byPassStep) {
        Keyboard.dismiss();
        handlerScrollPage(pos);
      }
    },
    [byPassStep, handlerScrollPage],
  );

  const onRequestLocation = useCallback((_location) => {
    setLocation(_location);
  }, []);

  const addEventFinishKyc = useCallback(() => {
    if ((location?.latitude, location?.longitude)) {
      DigitelClient.trackEvent(TrackingEvents.FINISH_KYC, location?.latitude, location?.longitude);
      logEvent(TrackingEvents.FINISH_KYC, {});
    }
  }, [location]);

  const handlerScrollPage = useCallback((position) => {
    if (typeof position !== 'number' || position < 0) return;
    setCurrentStep(position);
    requestAnimationFrame(() => {
      pageRef?.current?.setPage(position);
    });
  }, []);

  /* <------------------- NextStep -------------------> */

  const onNextStepAccountBanking = useCallback(
    (payload) => {
      setIsLoading(true);
      setErrorMessageCMND('');
      actions.updateUserMetaStep(payload, (res) => {
        if (res?.status) {
          Keyboard.dismiss();
          handlerScrollPage(userMetaData?.isBanking ? 3 : 2);
          setByPassStep(userMetaData?.isBanking ? 3 : 2);
          setIsLoading(false);
        } else {
          setErrorMessageCMND(res?.message);
          setIsLoading(false);
        }
      });
    },
    [actions, handlerScrollPage, userMetaData?.isBanking],
  );

  const onNextStepPersonalInformation = useCallback(
    (payload) => {
      setIsLoading(true);
      const callback = (response) => {
        setIsLoading(false);
        if (response.status) {
          setErrorMessageCMND('');
          if (payload.countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING) {
            setCountryIdStatus(ENUM_COUNTRY_ID_STATUS.PENDING);
            return;
          }

          handlerScrollPage(1);
        } else {
          if (response?.errorCode === 'NAME_NOT_MATCH') {
            if (timeCallApiError.current > 0) {
              timeCallApiError.current--;
            }
            if (timeCallApiError.current === 0) {
              setLockedKycAfter3Times(
                payload?.videoSelfie,
                payload?.countryIdPhotoFront,
                payload?.countryIdPhotoBack,
                payload,
              );
            }
          }
          setErrorMessageCMND(response?.message || 'Có lỗi xảy ra vui lòng thử lại.');
        }
      };
      if (payload.countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING) {
        setErrorMessageCMND('');
        actions.updateUserMetaStep(payload, callback, false);
      } else {
        if (userMetaData?.countryIdStatus === '0' || !userMetaData?.countryIdStatus) {
          setErrorMessageCMND('');
          actions.updateUserMetaStep(payload, callback, false);
        } else {
          setErrorMessageCMND('');
          setIsLoading(false);
          handlerScrollPage(1);
        }
      }
    },
    [actions, handlerScrollPage, userMetaData?.countryIdStatus],
  );

  const onNextStepVerifyPhone = useCallback(async () => {
    if (userMetaData?.isVerifiedEmail && userMetaData?.countryIdNumber) {
      setIsLoading(true);
      actions.dispatchSendPhoneOTP(
        myUser?.mPhoneNumber,
        'voice',
        (payload) => {
          if (payload?.status) {
            setIsVerifiedPhone(false);
            navigation.navigate('OtpConfirm', {
              resendTime: payload?.resendTime,
              allowRetryEmail: payload?.allow_retry_email,
              userPhoneNumber: myUser?.mPhoneNumber,
              onOtpSubmitCallback: (otp, handleWrongOTP) => {
                verifyPhoneOTP(otp, handleWrongOTP);
              },
              onOtpResendCallback: (onSuccess, type) => {
                resendPhoneOTP(onSuccess, type);
              },
            });
          } else {
            showAlert(payload?.message || '', 'Thông báo');
          }
          setIsLoading(false);
        },
        0,
        'ekyc',
      );
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
  }, [
    actions,
    myUser?.mPhoneNumber,
    navigation,
    resendPhoneOTP,
    userMetaData?.countryIdNumber,
    userMetaData?.isVerifiedEmail,
    verifyPhoneOTP,
  ]);

  const onNextStepContractCollaborators = useCallback(() => {
    actions.updateUserMetaData({ isBanking: true });
    handlerScrollPage(3);
    setByPassStep(3);
  }, [actions, handlerScrollPage]);

  const onBackModal = useCallback(() => {
    setShowModalOTP(!showModalOTP);
    if (isVerifiedPhone) {
      navigation.replace('AccountInforScreen');
    }
  }, [showModalOTP, setShowModalOTP, isVerifiedPhone, navigation]);

  const resendPhoneOTP = useCallback(
    async (onSuccess, type) => {
      if (myUser?.mPhoneNumber) {
        setIsLoading(true);
        const callback = (payload) => {
          if (payload?.status) {
            onSuccess?.(payload?.resendTime, payload?.allow_retry_email);
            setIsVerifiedPhone(false);
          } else {
            showAlert(payload?.message || '', 'Thông báo');
          }
          setIsLoading(false);
        };
        actions.dispatchSendPhoneOTP(myUser?.mPhoneNumber, type, callback, 1, 'ekyc');
      }
    },
    [actions, myUser?.mPhoneNumber],
  );

  const verifyPhoneOTP = useCallback(
    async (otpCode, handleWrongOTP) => {
      if (myUser?.mPhoneNumber && otpCode) {
        const callback = (payload) => {
          if (payload?.status) {
            navigation.pop();
            actions.updateUserMetaStep({ isCTVConfirmed: true }, (res) => {
              setIsLoading(false);
              if (res?.status) {
                setIsVerifiedPhone(true);
                addEventFinishKyc();
                setTimeout(() => {
                  setShowModalOTP(true);
                }, 500);
              } else {
                showAlert(res?.message, 'Thông báo');
              }
            });
          } else {
            handleWrongOTP?.(payload?.data?.err_msg || '');
            setIsLoading(false);
          }
        };
        setIsLoading(true);
        actions.dispatchVerifyPhoneOTP(myUser?.mPhoneNumber, otpCode, callback);
      }
    },
    [myUser?.mPhoneNumber, actions, navigation, addEventFinishKyc],
  );

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
      position === currentPosition ? { color: Colors.primary4 } : { opacity: 0.6 };
    return (
      <AppText semiBold style={[styles.txtLabel, currentStyle]}>
        {label}
      </AppText>
    );
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

  const _checkLivenessFPT = useCallback(
    (uri, cmndPath, callback) => {
      actions.checkLivenessFPT(uri, cmndPath, (payload) => {
        if (payload) {
          callback(payload);
        }
      });
    },
    [actions],
  );

  const setLockedKyc = useCallback(
    (videoUri, frontDocUrl, backDocUrl, orcInfor, note) => {
      setTimeout(() => {
        const payload = {
          isLockedKyc: true,
          livenessWithIdNumberStatus: 'PENDING',
          livenessWithIdNumberNote: note,
        };
        setIsLoading(true);
        actions.updateUserMetaStep(
          payload,
          (data) => {
            setIsLoading(false);
            if (__DEV__) {
              console.log('213214', data);
            }
          },
          600,
        );
      });
    },
    [actions],
  );
  const setLockedKycAfter3Times = useCallback(
    (videoUri, frontDocUrl, backDocUrl, orcInfor) => {
      requestAnimationFrame(() => {
        setIsLoading(true);
        const payload = {
          isLockedKyc: true,
          livenessWithIdNumberPending: videoUri,
          livenessDocFrontUrl: frontDocUrl,
          livenessDocBackUrl: backDocUrl,
          liveness_country_id_number: orcInfor?.countryIdNumber,
          liveness_country_id_name: orcInfor?.countryIdName,
          liveness_gender: orcInfor?.gender,
          liveness_country_id_date_of_birth: orcInfor?.countryIdDateOfBirth,
          liveness_country_id_issued_date: orcInfor?.countryIdIssuedDate,
          liveness_country_id_issued_by: orcInfor?.countryIdIssuedBy,
          liveness_country_id_address: orcInfor?.countryIdAddress,
          livenessCountryIdHomeAddress: orcInfor?.countryIdHomeAddress,
        };
        actions.updateUserMetaStep(payload, (data) => {
          setIsLoading(false);
          if (__DEV__) {
            console.log('213214', data);
          }
        });
      });
    },
    [actions],
  );

  const _supportManual = useCallback(
    (note) => {
      setTimeout(() => {
        setIsLoading(true);
        const payload = {
          livenessWithIdNumberStatus: 'PENDING',
          isLockedKyc: false,
          livenessWithIdNumberNote: note,
        };
        actions.updateUserMetaStep(payload, (data) => {
          setIsLoading(false);
          if (__DEV__) {
            console.log('213214', data);
          }
        });
      }, 600);
    },
    [actions],
  );

  /* render step page */
  const renderViewPagerPage = useCallback(
    (page) => {
      let rawView = <View />;

      switch (page?.key) {
        case KEY_PAGE.personalInformation:
          rawView = (
            <PersonalInformation
              key="2"
              listDistrict={arrDistricts}
              onHandlerNextStep={onNextStepAccountBanking}
              onSearchDistricts={onSearchDistricts}
              userMetaData={userMetaData}
              navigation={navigation}
              myUser={myUser}
              supportManual={_supportManual}
              disabled={byPassStep !== 1}
              errorMessageCMND={errorMessageCMND}
            />
          );
          break;
        case KEY_PAGE.identityCard:
          rawView = (
            <IdentityCard
              key="1"
              navigation={navigation}
              errorMessageCMND={errorMessageCMND}
              onHandlerNextStep={onNextStepPersonalInformation}
              onChangeErrorMessageCMND={onChangeErrorMessageCMND}
              checkLiveness={_checkLivenessFPT}
              myUser={myUser}
              lockEkyc={setLockedKyc}
              lockEkycAfter3Times={setLockedKycAfter3Times}
              disabled={byPassStep !== 0}
            />
          );
          break;
        case KEY_PAGE.bankingAccount:
          rawView = (
            <BankingAccount
              key="3"
              selfieUrl={userMetaData?.selfiePhoto}
              navigation={navigation}
              onHandlerNextStep={onNextStepContractCollaborators}
              isBanking={userMetaData?.isBanking}
              openBank={bidvData}
              fullName={userMetaData?.countryIdName}
            />
          );
          break;
        default:
          rawView = (
            <ContractCollaborators
              key="4"
              isCTVConfirmed={isCTVConfirmed}
              onFocus={currentStep === 3}
              ctvUserMFastUrl={appInfor?.ctvUserMFastUrl}
              countryIdNumber={userMetaData?.countryIdNumber}
              accessToken={myUser?.accessToken}
              onHandlerNextStep={onNextStepVerifyPhone}
              onRequestLocation={onRequestLocation}
              myUser={myUser}
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
      _checkLivenessFPT,
      _supportManual,
      appInfor?.ctvUserMFastUrl,
      arrDistricts,
      byPassStep,
      currentStep,
      errorMessageCMND,
      isCTVConfirmed,
      myUser,
      navigation,
      onChangeErrorMessageCMND,
      onNextStepAccountBanking,
      onNextStepContractCollaborators,
      onNextStepPersonalInformation,
      onNextStepVerifyPhone,
      onRequestLocation,
      onSearchDistricts,
      setLockedKyc,
      setLockedKycAfter3Times,
      userMetaData,
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

  return (
    <>
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
        <ViewPager
          ref={pageRef}
          width={SCREEN_WIDTH}
          scrollEnabled={false}
          showsPagination={false}
          style={styles.swipperWrapper}
          keyboardShouldPersistTaps={'handled'}
        >
          {PAGE_ACCOUNT_IDENTIFY.map(renderViewPagerPage)}
        </ViewPager>
        <LoadingModal visible={isCommonLoading || isLoading} />
        <PopupInReview
          isVisible={countryIdStatus === ENUM_COUNTRY_ID_STATUS.PENDING}
          onGobackMain={onGobackMain}
        />
        <ModalOTP
          isVisible={showModalOTP}
          verifyInfor={{
            by: 'SĐT',
            to: myUser?.mPhoneNumber,
          }}
          isVerified={isVerifiedPhone}
          onCloseModal={onBackModal}
          onGobackMain={onGoBackOTP}
        />
      </View>
      <FakeModalLoading visible={isFetching} />
    </>
  );
}

export default AccountIdentification;
