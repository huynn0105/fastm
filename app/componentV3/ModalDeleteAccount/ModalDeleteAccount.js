import {
  Image,
  Keyboard,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Colors from '../../theme/Color';
import AppText from '../AppText';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import AnimatedLottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkDeleteAccountV2,
  checkHasDeleteAccount,
  deleteAccountV2,
} from '../../redux/actions/actionsV3/userConfigs';
import { requestOTP } from '../../redux/actions/otp';
import BottomActionSheet from '../../components2/BottomActionSheet';
import { fonts } from '../../constants/configs';
import ButtonText from '../../common/ButtonText';
import { IS_ANDROID, SCREEN_HEIGHT } from '../../utils/Utils';
import TextStyles from '../../theme/TextStyle';
import { formatPhoneNumber } from '../../utils/phoneHelper';
import CodeInput from '../../components2/CodeInput';
import OTPRetry from '../OTP/OTPRetry/OTPRetry';
import Loading from '../../components2/LoadingComponent';
import { showAlert } from '../../utils/UIUtils';
import ViewStatus from '../../common/ViewStatus';
import { STATUS_ENUM } from '../../common/ViewStatus';
import { isEmpty } from 'lodash';
import { ERROR_CODE } from '../../network/ErrorCode';

const ModalDeleteAccount = memo(
  forwardRef((props, ref) => {
    const { onFinish } = props;

    const bottomSheetRef = useRef();

    const phone = useSelector((state) => state?.myUser?.mPhoneNumber);

    const [step, setStep] = useState(0);
    const [value, setValue] = useState('');

    useImperativeHandle(ref, () => ({
      ...bottomSheetRef.current,
      open: (title) => {
        setStep(0);
        bottomSheetRef.current?.open(title);
      },
    }));

    const isDisabledButton = useMemo(() => !value?.length, [value?.length]);

    const onCheckAccount = useCallback(() => {
      bottomSheetRef.current?.open('Kiểm tra huỷ tài khoản');
      setStep(1);
    }, []);

    const dispatch = useDispatch();

    const onConfirmOTP = useCallback(() => {
      bottomSheetRef.current?.open('Xác nhận huỷ tài khoản');
      setStep(2);
    }, []);

    return (
      <BottomActionSheet
        headerText={'Hủy tài khoản'}
        haveCloseButton
        avoidKeyboard={step === 2}
        ref={bottomSheetRef}
        render={() => {
          return (
            <View>
              {step === 0 ? (
                <ConfirmDelete
                  value={value}
                  setValue={setValue}
                  isDisabledButton={isDisabledButton}
                  onConfirm={onCheckAccount}
                  onCancel={() => {
                    bottomSheetRef.current.close();
                  }}
                />
              ) : step === 1 ? (
                <CheckDelete
                  onCancel={() => {
                    bottomSheetRef.current.close();
                  }}
                  onConfirm={onConfirmOTP}
                  dispatch={dispatch}
                />
              ) : (
                <ConfirmPhone phone={phone} reason={value} onFinish={onFinish} />
              )}
            </View>
          );
          // return (
          //   isFocus,
          //   value,
          //   setValue,
          //   setIsFocus,
          //   isDisabledButton,
          //   onConfirmedDelete,
          //   bottomSheetRef,
          // );
        }}
      />
    );
  }),
);

export default ModalDeleteAccount;

const ConfirmDelete = memo((props) => {
  const { value, setValue, isDisabledButton, onConfirm, onCancel } = props;

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const subKeyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setIsFocus(true);
    });
    const subKeyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsFocus(false);
    });

    return () => {
      subKeyboardShow.remove();
      subKeyboardHide.remove();
    };
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <View style={{ alignItems: 'center', padding: 16, backgroundColor: Colors.neutral5 }}>
        <Image source={ICON_PATH.mfastDelete} style={{ width: 64, height: 64 }} />
        <AppText style={{ fontSize: 18, lineHeight: 26, marginTop: 12 }} semiBold>
          Yêu cầu hủy tài khoản MFast
        </AppText>
        <TextInput
          style={{
            borderWidth: 1,
            width: '100%',
            height: 80,
            marginTop: 16,
            fontSize: 16,
            fontFamily: fonts.medium,
            color: Colors.gray1,
            textAlignVertical: 'top',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            borderColor: isFocus ? Colors.primary2 : Colors.gray4,
            backgroundColor: Colors.primary5,
          }}
          value={value}
          onChangeText={setValue}
          onTouchStart={() => setIsFocus(true)}
          placeholder="Nhập lý do hủy"
          multiline
        />
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <ButtonText
            title={'Xác nhận hủy'}
            style={{ flex: 1, marginRight: 12 }}
            height={48}
            fontSize={16}
            disabled={isDisabledButton}
            buttonColor={isDisabledButton ? Colors.neutral3 : Colors.sixRed}
            titleColor={isDisabledButton ? Colors.gray5 : Colors.primary5}
            onPress={onConfirm}
          />
          <ButtonText
            title={'Suy nghĩ lại'}
            style={{ flex: 1 }}
            height={48}
            fontSize={16}
            onPress={onCancel}
          />
        </View>
        {IS_ANDROID && isFocus ? null : (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fbdada',
              width: '100%',
              marginTop: 32,
              borderRadius: 8,
              padding: 12,
              marginBottom: 100,
            }}
          >
            <Image
              source={ICON_PATH.infoCircle}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1, flex: 1 }}>
              Tài khoản sẽ được{' '}
              <AppText bold style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
                hủy sau 30 ngày
              </AppText>{' '}
              kể từ lúc yêu cầu. Sau thời gian này, thông tin giao dịch, thông tin cá nhân, số dư
              MFast đều sẽ bị xóa và không thể khôi phục
            </AppText>
          </View>
        )}
      </View>
    </ScrollView>
  );
});

const CheckDelete = memo((props) => {
  const { onCancel, onConfirm, dispatch } = props;

  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(
      checkHasDeleteAccount((isSuccess, message) => {
        if (isSuccess) {
          onConfirm?.();
        } else {
          setStep(1);
          setErrorMessage(message);
        }
      }),
    );
  }, []);

  return (
    <View
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: Colors.neutral5,
      }}
    >
      {step === 0 ? (
        <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
          <AnimatedLottieView
            source={ICON_PATH.loadingLottie}
            style={{
              width: 56,
              height: 56,
            }}
            loop
            autoPlay
          />
          <AppText
            style={{
              fontSize: 16,
              lineHeight: 24,
              textAlign: 'center',
              marginTop: 16,
              color: Colors.gray5,
            }}
          >{`Hệ thống đang xử lý,\nvui lòng không thoát lúc này`}</AppText>
        </View>
      ) : (
        <>
          <View style={{ margin: 16, alignItems: 'center' }}>
            <Image source={ICON_PATH.statusError} />
            <AppText
              style={{
                textAlign: 'center',
                marginTop: 16,
                fontSize: 16,
                lineHeight: 22,
                color: Colors.sixRed,
                marginBottom: 8,
              }}
              semiBold
            >
              {errorMessage ||
                'Tài khoản của bạn không thể hủy do đang vi phạm chính sách của MFast'}
            </AppText>
          </View>
          <ButtonText
            onPress={onCancel}
            title={'Đã hiểu và quay lại'}
            style={{ alignSelf: 'center', marginBottom: 100 }}
            height={48}
            fontSize={16}
            top={8}
          />
        </>
      )}
    </View>
  );
});

let interval;
const ConfirmPhone = memo((props) => {
  const { phone, reason, onFinish } = props;
  const dispatch = useDispatch();
  const [countDown, setCountDown] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({});

  const startCountDown = useCallback((_countDown) => {
    setCountDown(_countDown);
    interval = setInterval(() => {
      setCountDown((prevState) => {
        const newState = prevState - 1;
        if (newState === 0) {
          clearInterval(interval);
        }
        return newState;
      });
    }, 1000);
  }, []);

  const onRequestOtp = useCallback(
    (type = 'voice', isResend = false) => {
      setIsLoading(true);
      dispatch(
        requestOTP(
          phone,
          isResend,
          (result) => {
            const data = result?.data;
            setIsLoading(false);
            if (data.status) {
              startCountDown(data?.wait_retry);
            } else {
              showAlert('Đã xảy ra lỗi', data?.message);
            }
          },
          type,
        ),
      );
    },
    [dispatch, phone, startCountDown],
  );

  const onVerifyOTP = useCallback(
    (otp_code) => {
      setIsLoading(true);
      dispatch(
        deleteAccountV2({ otp_code, reason }, (isSuccess, message, errorCode) => {
          setResult({
            isSuccess,
            isWrongOtp: errorCode === ERROR_CODE.WRONG_OTP,
            message,
          });
          setIsLoading(false);
          if (isSuccess) {
            dispatch(checkDeleteAccountV2());
          }
        }),
      );
    },
    [dispatch, reason],
  );

  useEffect(() => {
    onRequestOtp();

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!isEmpty(result) && (result.isSuccess || (!result?.isSuccess && !result?.isWrongOtp))) {
    return (
      <View style={{ backgroundColor: Colors.neutral5, width: '100%', padding: 16 }}>
        <View
          style={{
            backgroundColor: Colors.primary5,
            borderRadius: 10,
            paddingTop: 96,
            paddingBottom: 20,
            paddingHorizontal: 16,
            alignItems: 'center',
            marginTop: 56,
          }}
        >
          <Image
            source={result?.isSuccess ? IMAGE_PATH.mascotCry : IMAGE_PATH.mascotError}
            style={{
              width: 140,
              height: 140,
              position: 'absolute',
              top: -56,
            }}
          />
          <AppText
            semiBold
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: result?.isSuccess ? Colors.gray1 : Colors.sixRed,
              marginHorizontal: 16,
              lineHeight: 26,
            }}
          >
            {result?.isSuccess
              ? 'Yêu cầu hủy tài khoản của bạn đã được ghi nhận'
              : 'Yêu cầu hủy tài khoản của bạn thất bại'}
          </AppText>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: Colors.gray4,
              width: '100%',
              borderStyle: 'dashed',
              marginVertical: 12,
            }}
          />
          <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1 }}>
            {result?.isSuccess ? (
              <>
                <AppText bold style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
                  Tài khoản sẽ được hủy trong vòng 30 ngày.
                </AppText>
                {
                  '\nSau thời gian này, thông tin giao dịch, thông tin cá nhân, số dư MFast đều sẽ bị xóa và không thể khôi phục'
                }
              </>
            ) : (
              result?.message
            )}
          </AppText>
        </View>
        {result?.isSuccess ? (
          <ButtonText
            title={'Về trang cá nhân'}
            height={48}
            fontSize={16}
            style={{ alignSelf: 'center', marginTop: 24, marginBottom: 100 }}
            onPress={onFinish}
          />
        ) : (
          <View style={{ height: 100 }} />
        )}
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Colors.neutral5, width: '100%', padding: 16 }}>
      <View
        style={{
          backgroundColor: Colors.primary5,
          borderRadius: 10,
          paddingVertical: 20,
          marginBottom: 98,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText
            style={{ textAlign: 'center', color: Colors.gray5, fontSize: 14, lineHeight: 22 }}
          >
            {'Nhập mã xác thực '}
            <AppText
              style={{ textAlign: 'center', color: Colors.gray1, fontSize: 14, lineHeight: 22 }}
              bold
            >
              4 chữ số
            </AppText>
            {' đã được gửi tới\nsố ĐT '}
            <AppText style={{ ...TextStyles.heading4, color: 'black' }} bold>
              {formatPhoneNumber(phone)}
            </AppText>
          </AppText>
        </View>
        <View style={{ marginTop: 20 }}>
          <CodeInput onCodeInputSubmit={onVerifyOTP} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 8,
            opacity: !result?.isSuccess && result?.isWrongOtp ? 1 : 0,
            marginHorizontal: 16,
          }}
        >
          <Image source={ICON_PATH.warning} />
          <AppText style={{ marginLeft: 6, ...TextStyles.normalTitle, color: Colors.accent3 }}>
            {result?.message || 'Mã OTP không chính xác!'}
          </AppText>
        </View>
        <View
          style={{
            marginTop: 8,
            justifyContent: 'center',
          }}
        >
          <OTPRetry
            title={`Nếu không nhận được mã xác thực,\nvui lòng bấm gửi lại qua`}
            titleCountDown={`Nếu không nhận được mã xác thực,\nbấm gửi lại sau `}
            options={['voice', 'sms']}
            onPressOption={(type) => {
              onRequestOtp(type, true);
            }}
            countDownSecs={countDown}
          />
        </View>
      </View>
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <ViewStatus status={STATUS_ENUM.LOADING} />
        </View>
      ) : null}
    </View>
  );
});
