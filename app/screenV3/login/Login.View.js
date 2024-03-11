import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import React, { useEffect } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import BottomActionSheet from '../../components2/BottomActionSheet';
import CustomButton, { BUTTON_COLOR, BUTTON_SIZE } from '../../components2/CustomButton';
import { Loading } from '../../components2/LoadingComponent';
import PCustomTextInput from '../../components2/PCustomTextInput';
import AppText from '../../componentV3/AppText';
import { AsyncStorageKeys } from '../../constants/keys';
import { SH, SW } from '../../constants/styles';
import { useActions } from '../../hooks/useActions';
import { icons } from '../../img';
import DigitelClient from '../../network/DigitelClient';
import { checkUsingPasscode } from '../../redux/actions/actionsV3/userConfigs';
import { loginByPassCode, loginExternal, myUser } from '../../redux/actions/user';
import PopupBeforeLogin from '../../screens2/Login/PopupBeforeLogin';
import Colors from '../../theme/Color';
import { logEvent } from '../../tracking/Firebase';
import { checkBiometric, touchIdAuthenticate } from '../../utils/biometrics';
import { METHOD } from '../../utils/FacebookWrapper';
import { IS_ANDROID, SCREEN_WIDTH } from '../../utils/Utils';
import HeaderBar from './components/HeaderBar';
import IntroduceModal from './components/IntroduceModal';
import PassCodeModal from './components/PasscodeModal';
import styles from './Login.styles';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import CheckBoxSquare from '../../componentV3/CheckBoxSquare';

const Login = ({ params, navigation }) => {
  const appInfor = useSelectorShallow(getAppInforSelector);

  const [showPopup, setShowPopup] = React.useState(false);
  const [urlContent, setUrlContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [haveFaceID, setHaveFaceID] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [usePasscode, setUsePasscode] = React.useState(false);
  const [hideQuickLogin, setHideQuickLogin] = React.useState(false);
  const [tryTime, setTryTime] = React.useState(3);
  const [isConsent, setIsConsent] = React.useState(false);

  const _referencePhoneTextInput = React.useRef(null);
  const actionSheetRef = React.useRef(null);

  const onChangePhoneNumber = (text) => {
    const phoneNumber = text.split(' ').join('');
    setPhoneNumber(phoneNumber);
  };

  const actions = useActions({
    loginExternal,
    myUser,
    loginByPassCode,
    checkUsingPasscode,
  });

  const onFinish = async (passCode) => {
    Keyboard.dismiss();
    setIsLoading(true);
    setTimeout(() => {
      actionSheetRef.current.close();
    }, 1);
    const onSuccess = () => {
      closeLogin();
      setIsLoading(false);
      // actions.loginExternal(METHOD.PHONE, truePasscode?.mPhoneNumber);
    };
    const onError = () => {
      if (tryTime === 0) {
        setIsLoading(false);
        actionSheetRef.current.open();
        resetUsePasscode();
        setUsePasscode(false);
        return;
      }

      setTryTime(tryTime - 1);
      setIsLoading(false);
      actionSheetRef.current.open();
      setErrorMessage(
        'Mật khẩu không chính xác, vui lòng thử lại hoặc đổi sang hình thức đăng nhập khác',
      );
    };

    // await checkTrackingAgentPermissions(false);
    // logEventAgent({ mobilephone: phoneNumber });
    actions.loginByPassCode(phoneNumber, md5(passCode), onSuccess, onError);
  };

  const resetUsePasscode = async () => {
    try {
      const myLastUser = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
      const _myLastUser = JSON.parse(myLastUser);
      const newUser = {
        ..._myLastUser,
        usePasscode: false,
      };
      await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(newUser));
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (tryTime === 0) {
  //     setUsePasscode(false);
  //     resetUsePasscode();
  //   }
  // }, [tryTime]);

  // const myUser = useSelector((state) => state.myUsers);

  const checkFaceID = async () => {
    try {
      // let _haveFaceID = await isSupportedFaceId();
      const checkBio = await checkBiometric();

      if (!checkBio) {
        setHideQuickLogin(true);
      } else {
        if (checkBio === 'FaceID') {
          setHideQuickLogin(false);
          setHaveFaceID(true);
        } else {
          setHideQuickLogin(false);
        }
      }
    } catch (error) {}
  };

  const getData = async () => {
    try {
      const myLastUser = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
      const _myLastUser = JSON.parse(myLastUser);

      setPhoneNumber(
        _myLastUser?.mPhoneNumber ? _myLastUser?.mPhoneNumber : _myLastUser?.mobilePhone,
      );
    } catch (error) {
      if (__DEV__) {
        console.log('error', error);
      }
    }
  };
  useEffect(() => {
    checkFaceID();
    setTimeout(() => {
      getData();
    }, 1);
  }, []);

  // useEffect(() => {
  //   if (_myUser.isLoggedIn) {
  //     // navigation.dismiss();
  //   }
  // }, [_myUser]);

  const checkCondition = async () => {
    try {
      const myLastUser = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
      const _myLastUser = JSON.parse(myLastUser);
      if (
        (_myLastUser?.mPhoneNumber === phoneNumber || _myLastUser?.mobilePhone === phoneNumber) &&
        _myLastUser?.usePasscode
      ) {
        setUsePasscode(true);
        if (_myLastUser?.useQuickLogin && !hideQuickLogin) {
          touchIdAuthenticate().then((success) => {
            setIsLoading(true);
            actions.loginByPassCode(
              phoneNumber,
              _myLastUser?.passcode,
              () => {
                closeLogin();
                setIsLoading(false);
              },
              () => {
                setIsLoading(false);
              },
            );
          });
        } else {
          actionSheetRef.current.open();
        }
      } else {
        //test commit
        _referencePhoneTextInput.current.focus();
      }
    } catch (error) {}
  };

  useEffect(() => {
    setIsLoading(true);
    if (phoneNumber?.length === 10) {
      // const onSuccess = async () => {
      setIsLoading(false);
      checkCondition();

      // };
      // const onError = () => {
      //   setIsLoading(false);
      //   _referencePhoneTextInput?.current.focus();
      //   setUsePasscode(false);
      // };
      // actions.checkUsingPasscode(phoneNumber, onSuccess, onError);
    } else {
      setIsLoading(false);
      setUsePasscode(false);
      // _referencePhoneTextInput?.current.focus();
    }
  }, [phoneNumber]);

  const closeLogin = () => {
    navigation.dismiss();
  };

  const onLoginByOTP = async () => {
    if (phoneNumber.length < 10) {
      return;
    }

    // const payload = await DigitelClient.getPopupTermWhenUserLogin(phoneNumber);

    // const isShow = !!payload?.is_show;

    // if (isShow) {
    //   Keyboard.dismiss();
    // } else {
    actions.loginExternal(METHOD.PHONE, phoneNumber, closeLogin);
    // }

    // setShowPopup(isShow);
    // setUrlContent(payload?.html_content);
  };

  const onPressClosePopup = () => {
    setShowPopup(false);
  };

  const onHandlerSubmitTerm = () => {
    onPressClosePopup();
    DigitelClient.submitConfirmTermWhenUserLogin(phoneNumber);
    setTimeout(() => {
      actions.loginExternal(METHOD.PHONE, phoneNumber);
    }, 200);
  };

  const loginByTouchID = async () => {
    try {
      const myLastUser = await AsyncStorage.getItem(AsyncStorageKeys.LAST_USER_INFO);
      const _myLastUser = JSON.parse(myLastUser);
      if (
        _myLastUser?.useQuickLogin &&
        (_myLastUser?.mPhoneNumber === phoneNumber || _myLastUser?.mobilePhone === phoneNumber) &&
        !hideQuickLogin
      ) {
        // await checkTrackingAgentPermissions(false);
        // logEventAgent({ mobilephone: phoneNumber });
        touchIdAuthenticate()
          .then((success) => {
            setIsLoading(true);
            actions.loginByPassCode(
              phoneNumber,
              _myLastUser?.passcode,
              () => {
                closeLogin();
                setTimeout(() => {
                  setIsLoading(false);
                }, 1);
              },
              () => {
                setIsLoading(false);
              },
            );
          })
          .catch((err) => {
            setIsLoading(false);
          });
      } else {
        actionSheetRef.current.open();
      }
    } catch (error) {}
  };
  const appInfo = useSelector((state) => state.appInfo);

  const onPolicyPress = () => {
    navigation.navigate('WebView', {
      mode: 0,
      title: 'Điều khoản sử dụng',
      url: appInfo?.termsOfUsageUrl,
    });
  };

  const onPrivacyPress = () => {
    navigation.navigate('WebView', {
      mode: 0,
      title: 'Chính sách bảo mật',
      url: appInfo?.privacyPolicyUrl,
    });
  };

  const disabledNextButton =
    !phoneNumber || phoneNumber?.length !== 10 || phoneNumber.charAt(0) !== '0' || !isConsent;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.neutral5 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? SH(10) : SH(35)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: SH(24) }}>
          <View>
            <HeaderBar
              goBack={() => {
                navigation.pop();
              }}
            />
            <View style={{ marginBottom: SH(16), alignItems: 'center', marginTop: SH(30) }}>
              <AppText style={{ fontSize: SH(16), lineHeight: SH(22), color: '#767676' }}>
                Nhập số điện thoại để đăng nhập
              </AppText>
            </View>
            <View style={{ marginBottom: 12 }}>
              <PCustomTextInput
                textInputRef={(ref) => {
                  _referencePhoneTextInput.current = ref;
                }}
                // autoFocus
                containerStyle={{
                  marginHorizontal: SW(16),
                  backgroundColor: Colors.primary5,
                  borderRadius: 27,
                  paddingHorizontal: SW(16),
                }}
                // autoFocus
                inputStyle={{
                  textAlign: 'center',
                  fontSize: 20,
                  height: '100%',
                }}
                placeholder={'Số điện thoại'}
                keyboardType={'phone-pad'}
                isShownLeftIcon={false}
                isShownTitle
                // isShownError={isShownPhoneInputError}
                errorMessage={'Độ dài số điện thoại không đúng'}
                // onFocusListener={this._onPhoneInputFocus}
                onChangeText={onChangePhoneNumber}
                maxLength={10}
                value={phoneNumber}
                isShownClearTextButton={true}
                placeHolderTextColor={Colors.neutral3}
                numberOfLines={1}
                multiline={IS_ANDROID && true}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginHorizontal: SW(16),
                marginBottom: SH(16),
              }}
            >
              <CheckBoxSquare
                style={{ marginTop: 0 }}
                isSelected={isConsent}
                onChangeValue={setIsConsent}
              />
              <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1, flex: 1 }}>
                Tôi đã đọc và đồng ý với cam kết về{' '}
                <AppText
                  style={{ fontSize: 14, lineHeight: 20, color: Colors.primary2 }}
                  onPress={() => Linking.openURL(appInfo?.consentUrl)}
                >
                  điều khoản chia sẻ thông tin
                </AppText>
              </AppText>
            </View>
            <CustomButton
              // containerStyle={{
              //   opacity: nextButtonOpacity,
              // }}
              buttonStyle={{ width: SCREEN_WIDTH - SW(32) }}
              disabled={disabledNextButton}
              title={'Đăng nhập bằng OTP'}
              buttonColor={BUTTON_COLOR.GREEN}
              sizeType={BUTTON_SIZE.LARGE}
              onPress={onLoginByOTP}
              textColor={disabledNextButton ? Colors.gray5 : Colors.primary5}
            />
            <View style={{ marginTop: SH(16), alignItems: 'center' }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  logEvent(`press_try_first`);
                  navigation.pop();
                }}
              >
                <View>
                  <AppText medium style={{ fontSize: 16, lineHeight: 24, color: Colors.primary2 }}>
                    Trải nghiệm trước, đăng nhập sau
                  </AppText>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ marginTop: 40, alignItems: 'center' }}>
              <AppText style={{ fontSize: 14, lineHeight: SH(20), color: Colors.gray5 }}>
                Hoặc đăng nhập nhanh bằng:
              </AppText>
            </View>
            <View
              style={{
                marginTop: SH(16),
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                style={{ marginRight: !hideQuickLogin ? SW(28) : 0, alignItems: 'center' }}
                onPress={() => {
                  actionSheetRef.current.open();
                }}
              >
                <Image source={icons.passcode} style={styles.iconStyle} />
                <AppText
                  style={{
                    fontSize: SH(14),
                    lineHeight: SH(20),
                    color: Colors.primary4,
                    marginTop: SH(10),
                  }}
                >
                  Mật khẩu
                </AppText>
              </TouchableOpacity>
              {!hideQuickLogin ? (
                <TouchableOpacity style={{ marginLeft: SW(28) }} onPress={loginByTouchID}>
                  <Image
                    source={haveFaceID ? icons.faceID : icons.touchID}
                    style={styles.iconStyle}
                  />
                  <AppText
                    medium
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      color: Colors.primary4,
                      marginTop: SH(10),
                    }}
                  >
                    {haveFaceID ? 'Face ID' : 'Touch ID'}
                  </AppText>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: SW(32) }}>
            <AppText
              allowFontScaling
              style={[styles.headerTextStyle1, { color: Colors.gray5 }]}
              numberOfLines={1}
            >
              Bằng việc đăng nhập vào MFast, bạn đã đồng ý với
            </AppText>
            <AppText onPress={onPrivacyPress} style={styles.headerTextStyle2}>
              Chính sách Bảo mật
              <AppText style={[styles.headerTextStyle1, { color: Colors.gray5 }]}> & </AppText>
              <AppText onPress={onPolicyPress} style={styles.headerTextStyle2}>
                Điều khoản dịch vụ
              </AppText>
            </AppText>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <BottomActionSheet
        ref={(ref) => {
          actionSheetRef.current = ref;
        }}
        render={() => {
          return (
            <View>
              {usePasscode ? (
                <PassCodeModal
                  onFinish={(passCode) => {
                    onFinish(passCode);
                  }}
                  onCloseModal={() => actionSheetRef.current.close()}
                  errorMessage={errorMessage}
                  resetError={() => {
                    setErrorMessage('');
                  }}
                />
              ) : (
                <IntroduceModal
                  onFinish={() => {
                    actionSheetRef.current.close();
                  }}
                  onCloseModal={() => actionSheetRef.current.close()}
                />
              )}
            </View>
          );
        }}
        canClose={true}
      />
      {showPopup ? (
        <PopupBeforeLogin
          urlContent={urlContent}
          onPressClose={onPressClosePopup}
          onHandlerSubmit={onHandlerSubmitTerm}
          // onReadMoreTermPress={this.onReadMoreTermPress}
          // onReadMorePolicyPress={this.onReadMorePolicyPress}
        />
      ) : null}
      <Loading visible={isLoading} />
    </KeyboardAvoidingView>
  );
};

export default Login;
