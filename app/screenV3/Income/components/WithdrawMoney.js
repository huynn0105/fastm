import {
  Alert,
  FlatList,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  UIManager,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { fonts } from '../../../constants/configs';
import {
  getAppVersion,
  getDeviceTrackingInfo,
  prettyNumberString,
  prettyStringWithout,
} from '../../../utils/Utils';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { useDispatch, useSelector } from 'react-redux';
import {
  getInfoWithdrawalMoney,
  sendOTPWithdrawMoney,
  withdrawMoney,
  checkWithdrawalMoney,
} from '../../../redux/actions/actionsV3/banking';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import Indicator from '../../../componentV3/Indicator/Indicator';
import { getMyuserSelector } from '../../../redux/selectors/userSelector';
import ButtonText from '../../../common/ButtonText';
import { SH, SW } from '../../../constants/styles';
import { checkAndRequestPermissionLocation } from '../../../utils/LocationUtil';
import { LOCATION_KEY } from '../../../screens2/Others/CommunicationKey';
import DigitelClient from '../../../network/DigitelClient';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';
import { logEventAgent } from '../../../tracking/Firebase';
import { checkTrackingAgentPermissions } from '../../../utils/dataTrackingAgennt';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';
import { PERMISSION_CHECK, checkAndRequestPermission } from '../../../utils/permissionV3';
import strings from '../../../constants/strings';
import { openAccountIdentification } from '../../../redux/actions/actionsV3/navigationAction';

const HFlatList = HPageViewHoc(FlatList);
const HScrollView = HPageViewHoc(ScrollView);

const LIST_MONEY_DEFAULT = [50000, 100000, 200000, 500000, 1000000];

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const WithdrawMoney = memo(
  forwardRef((props, ref) => {
    const { index, navigation, showLoading, hideLoading } = props;
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const appInfo = useSelector((state) => state.appInfo);

    const myUser = useSelectorShallow(getMyuserSelector);

    const [idBankSelected, setIdBankSelected] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [money, setMoney] = useState('');
    const [error, setError] = useState({});
    const [infoWithdrawal, setInfoWithdrawalMoney] = useState({});
    const [fee, setFee] = useState('');
    const [isAllowWithdrawal, setIsAllowWithdrawal] = useState(false);
    const [errors, setErrors] = useState([]);

    const disabledButtonWithdraw = useMemo(() => {
      const lowerMinimumMoney = prettyStringWithout(money) < 30000;
      const isError = error?.isError;
      const haveBank = idBankSelected;
      return isError || lowerMinimumMoney || !haveBank || !isAllowWithdrawal;
    }, [money, error?.isError, idBankSelected, isAllowWithdrawal]);

    const containerStyle = useMemo(
      () => [styles.container, { marginBottom: insets.bottom }],
      [insets.bottom],
    );

    useImperativeHandle(ref, () => ({}));

    const onChangeText = useCallback((txt) => {
      setMoney(prettyNumberString(prettyStringWithout(txt)));
    }, []);

    const renderItemDefault = useCallback(({ item }) => {
      const moneyFormat = prettyNumberString(prettyStringWithout(item));

      return (
        <TouchableWithoutFeedback onPress={() => setMoney(moneyFormat)}>
          <View style={styles.itemDefaultContainer}>
            <AppText style={styles.itemDefaultText}>{moneyFormat}</AppText>
          </View>
        </TouchableWithoutFeedback>
      );
    }, []);

    const renderItem = useCallback(
      ({ item }) => {
        return (
          <ItemBank
            item={item}
            isSelected={idBankSelected === item?.ID}
            onPress={setIdBankSelected}
            money={money}
            fee={fee}
            disabled={!isAllowWithdrawal}
          />
        );
      },
      [fee, idBankSelected, isAllowWithdrawal, money],
    );

    const onGetInfoWithdrawMoney = useCallback(() => {
      setIsLoading(true);
      dispatch(
        getInfoWithdrawalMoney((isSuccess, _result) => {
          if (isSuccess) {
            const idBankDefault = _result?.banking_picked?.find(
              (item) => item?.bank_default === '1',
            )?.ID;

            setIdBankSelected(idBankDefault);
            setInfoWithdrawalMoney(_result);
          }
          setIsLoading(false);
        }),
      );
    }, [dispatch]);
    const onCheckWithdrawalMoney = useCallback(() => {
      setIsLoading(true);
      dispatch(
        checkWithdrawalMoney((_isAllow, _errors) => {
          setIsLoading(false);
          setIsAllowWithdrawal(_isAllow);
          setErrors(_errors);
        }),
      );
    }, [dispatch]);

    const onSentOPTWithdrawMoney = useCallback(async () => {
      const granted = await checkAndRequestPermission(
        PERMISSION_CHECK.LOCATION,
        strings.location_access_error,
      );
      if (!granted) return;
      checkAndRequestPermissionLocation(async (location) => {
        if (location === null) {
          return;
        }
        // const isTrackingPermission = await checkTrackingAgentPermissions();
        // if (!isTrackingPermission) {
        //   return;
        // }
        // logEventAgent({ mobilephone: myUser?.mPhoneNumber });
        showLoading();
        dispatch(
          sendOTPWithdrawMoney(myUser?.mPhoneNumber, (isSuccess, results) => {
            if (isSuccess) {
              hideLoading();
              navigation?.navigate('OtpConfirm', {
                resendTime: results?.resendTime,
                allowRetryEmail: results?.allow_retry_email,
                userPhoneNumber: myUser?.mPhoneNumber,
                onOtpSubmitCallback: (otp, handleWrongOTP) => {
                  onSubmitWithdrawMoney(otp, handleWrongOTP, location);
                },
                onOtpResendCallback: (onSuccess, type) => {
                  showLoading();
                  dispatch(
                    sendOTPWithdrawMoney(
                      myUser?.mPhoneNumber,
                      (isSuccess, results) => {
                        if (isSuccess) {
                          onSuccess(results?.resendTime, results?.allow_retry_email);
                        }
                        hideLoading();
                      },
                      1,
                      type,
                    ),
                  );
                },
              });
            }
          }),
        );
      });
    }, [
      dispatch,
      hideLoading,
      myUser?.mPhoneNumber,
      navigation,
      onSubmitWithdrawMoney,
      showLoading,
    ]);

    const onGetFee = useCallback(async () => {
      try {
        if (!disabledButtonWithdraw) {
          showLoading();
          const res = await DigitelClient.getFeeWithdrawMoney(prettyStringWithout(money));
          setFee(res?.data?.withdrawal_fee);
        } else {
          setFee('');
        }
      } catch (err) {
      } finally {
        hideLoading();
      }
    }, [disabledButtonWithdraw, hideLoading, money, showLoading]);

    const onSubmitWithdrawMoney = useCallback(
      async (otp, handleWrongOTP, location) => {
        showLoading();
        setIdBankSelected((prevIdBank) => {
          setMoney((prevMoney) => {
            const trackingInfo = getDeviceTrackingInfo();
            dispatch(
              withdrawMoney(
                myUser?.mPhoneNumber,
                otp,
                prevIdBank,
                prettyStringWithout(prevMoney),
                {
                  key: LOCATION_KEY,
                  location,
                  os: Platform.OS,
                  appVersion: getAppVersion(),
                  ...trackingInfo,
                },
                (isSuccess, _result) => {
                  hideLoading();
                  if (isSuccess) {
                    navigation?.pop();
                    Alert.alert('Thông báo', _result);
                    setMoney('');
                  } else {
                    handleWrongOTP?.(_result);
                  }
                },
              ),
            );
            return prevMoney;
          });

          return prevIdBank;
        });
      },
      [dispatch, hideLoading, myUser?.mPhoneNumber, navigation, showLoading],
    );

    useEffect(() => {
      onCheckWithdrawalMoney();
      onGetInfoWithdrawMoney();
      // onRefresh();
    }, []);

    useEffect(() => {
      navigation.addListener('willFocus', (payload) => {
        onCheckWithdrawalMoney();
      });
    }, []);

    useEffect(() => {
      setError(() => {
        let isError;
        let message;

        if (
          (Number(prettyStringWithout(money) || 0) || 0) >
          (Number(infoWithdrawal?.availability_money || 0) || 0)
        ) {
          isError = true;
          message = 'Số tiền rút không được vượt quá số dư khả dụng';
        }
        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            100,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity,
          ),
        );
        return {
          isError,
          message,
        };
      });
    }, [infoWithdrawal?.availability_money, money]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onGetFee();
      }, 500);
      return () => {
        timeout && clearTimeout(timeout);
      };
    }, [onGetFee]);

    const renderError = () => {
      if (isAllowWithdrawal) return null;
      return (
        <View style={{ width: '100%' }}>
          {errors?.map((item) => {
            if (!item?.html) return;
            return <HTMLView html={item?.html} style={{ marginBottom: 4, marginTop: 0 }} />;
          })}
        </View>
      );
    };

    const isNeedKYC = useMemo(() => {
      const isErrorFromServer = errors?.findIndex((item) => item?.type === 'needKYC');
      return !isAllowWithdrawal && isErrorFromServer !== -1;
    }, [errors, isAllowWithdrawal]);

    const renderKYC = () => {
      const errorMessageKYC = errors?.find((item) => item?.type === 'needKYC')?.text;

      return (
        <HScrollView index={index} style={containerStyle} showsVerticalScrollIndicator={false}>
          <View
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: Colors.primary5,
              alignItems: 'center',
              marginTop: 80,
              marginBottom: 12,
              marginHorizontal: 16,
            }}
          >
            <Image
              source={IMAGE_PATH.mascotFindCard}
              style={{ width: 124, height: 124, position: 'absolute', top: -48 }}
            />
            <AppText
              medium
              style={{
                textAlign: 'center',
                fontSize: 16,
                lineHeight: 24,
                color: Colors.gray1,
                marginTop: 80,
              }}
            >
              {errorMessageKYC || 'Bạn cần định danh tài khoản trước\nđể sử dụng tính năng này'}
            </AppText>
          </View>
          <ButtonText
            onPress={() => {
              dispatch(openAccountIdentification(navigation.navigate));
            }}
            title="Định danh tài khoản ngay"
            top={16}
            bottom={4}
            height={48}
            fontSize={16}
            lineHeight={24}
            medium
            style={{ alignSelf: 'center' }}
          />
        </HScrollView>
      );
    };

    if (isNeedKYC) {
      return renderKYC();
    }

    return (
      <>
        <HFlatList
          key={`${!!isAllowWithdrawal}`}
          index={index}
          data={infoWithdrawal?.banking_picked}
          renderItem={renderItem}
          style={containerStyle}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {isLoading ? (
                <Indicator style={isLoading ? styles.indicator : styles.hideIndicator} />
              ) : null}
              {renderError()}
              <View
                pointerEvents={isAllowWithdrawal ? 'auto' : 'none'}
                style={!isAllowWithdrawal && { opacity: 0.6 }}
              >
                <AppText semiBold style={styles.title}>
                  {`1.    Nhập số tiền cần rút`}
                </AppText>
                <View style={styles.moneyContainer}>
                  <AppText style={styles.title}>{`Số dư khả dụng:`}</AppText>
                  <Image
                    source={ICON_PATH.tick2}
                    style={{ marginRight: 2, marginLeft: 4, tintColor: '#00c28e' }}
                  />
                  <AppText semiBold style={[styles.title, { color: Colors.gray1 }]}>
                    {infoWithdrawal?.availability_money
                      ? prettyNumberString(infoWithdrawal?.availability_money)
                      : '0'}{' '}
                    vnđ
                  </AppText>
                </View>
                <View
                  style={[styles.inputContainer, error?.isError && { borderColor: Colors.sixRed }]}
                >
                  <TextInput
                    placeholder="Nhập số tiền"
                    style={styles.input}
                    placeholderTextColor={Colors.gray8}
                    keyboardType={'numeric'}
                    onChangeText={onChangeText}
                    value={money}
                  />
                  <AppText style={styles.noteInput}>( >= 30.000 vnđ)</AppText>
                </View>
                {error?.isError ? (
                  <View style={styles.errorContainer}>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        tintColor: Colors.sixRed,
                        top: 2,
                      }}
                      source={ICON_PATH.warning}
                    />
                    <AppText style={styles.error}>{error?.message}</AppText>
                  </View>
                ) : null}
                <View style={styles.listDefaultContainer}>
                  <FlatList
                    data={LIST_MONEY_DEFAULT}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItemDefault}
                  />
                </View>
                <AppText semiBold style={styles.title}>
                  {`2.    Chọn tài khoản ngân hàng`}
                </AppText>
              </View>
            </>
          }
          ListFooterComponent={
            <View style={{ alignItems: 'center' }}>
              <ButtonText
                onPress={onSentOPTWithdrawMoney}
                disabled={disabledButtonWithdraw}
                title={'Tiếp tục'}
                top={20}
                height={50}
                fontSize={16}
                lineHeight={24}
                medium
                buttonColor={disabledButtonWithdraw ? Colors.neutral3 : Colors.primary2}
                titleColor={disabledButtonWithdraw ? Colors.gray5 : Colors.primary5}
              />
              <AppText style={[styles.itemDefaultText, { marginTop: 16 }]}>
                Chi tiết biểu phí rút tiền,{' '}
                <AppText
                  onPress={() =>
                    appInfo?.withdrawalFeeUrl && Linking.openURL(appInfo?.withdrawalFeeUrl)
                  }
                  semiBold
                  style={[styles.itemDefaultText, { color: Colors.primary2 }]}
                >
                  xem tại đây
                </AppText>
              </AppText>
            </View>
          }
          ListEmptyComponent={
            isLoading ? null : (
              <View
                pointerEvents={isAllowWithdrawal ? 'auto' : 'none'}
                style={[styles.itemEmptyContainer, !isAllowWithdrawal && { opacity: 0.6 }]}
              >
                <Image style={styles.iconEmpty} source={ICON_PATH.block} />
                <AppText style={styles.textEmpty}>{'Bạn chưa thêm tài khoản ngân hàng'}</AppText>
              </View>
            )
          }
        />
      </>
    );
  }),
);

export default WithdrawMoney;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  moneyContainer: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorContainer: {
    marginLeft: 20,
    marginTop: 8,
    flexDirection: 'row',
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.sixRed,
    marginLeft: 4,
    flex: 1,
  },
  inputContainer: {
    marginLeft: 20,
    marginTop: 8,
    height: 48,
    backgroundColor: Colors.primary5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.neutral5,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.gray1,
  },
  noteInput: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray8,
    marginLeft: 12,
  },
  listDefaultContainer: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  itemDefaultContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemDefaultText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray8,
  },
  itemBankContainer: {
    position: 'relative',
    minHeight: 60,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  itemBankImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.gray4,
    zIndex: 1,
  },
  itemBankImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  itemBankInfoContainer: {
    backgroundColor: Colors.primary5,
    flex: 1,
    marginLeft: 44 / 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary5,
    paddingLeft: 33,
    paddingRight: 12,
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  itemBankName: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
  },
  itemBankNameActive: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemBankNumber: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  indicator: {
    marginVertical: 12,
  },
  itemEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 11,
  },
  iconEmpty: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
});

const ItemBank = memo((props) => {
  const { item, isSelected, onPress, money, fee, disabled } = props;

  return (
    <TouchableWithoutFeedback
      disabled={item?.disabled || disabled}
      onPress={() => {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            100,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity,
          ),
        );
        onPress?.(item?.ID);
      }}
    >
      <View style={[styles.itemBankContainer, { opacity: disabled ? 0.6 : 1 }]}>
        <View
          style={[styles.itemBankImageContainer, isSelected && { borderColor: Colors.primary2 }]}
        >
          <Image
            style={styles.itemBankImage}
            source={item?.icon ? { uri: item?.icon } : ICON_PATH.bankDefault}
          />
        </View>
        <View
          style={[
            styles.itemBankInfoContainer,
            item?.disabled && { backgroundColor: Colors.neutral3 },
            isSelected && { borderColor: Colors.primary2, backgroundColor: '#e0ecff' },
          ]}
        >
          <View>
            <AppText style={isSelected ? styles.itemBankNameActive : styles.itemBankName}>
              {item?.bank_name}
            </AppText>
            {isSelected ? (
              <AppText style={styles.itemBankNumber}>
                {item?.bank_fullName} - xxx{item?.bank_accountNumber?.slice(-4)}
              </AppText>
            ) : null}
            {isSelected ? (
              <>
                <View
                  style={{
                    width: SW(275),
                    height: 1,
                    backgroundColor: Colors.primary5,
                    marginVertical: 8,
                  }}
                />
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <AppText style={[styles.itemDefaultText, { color: Colors.gray5, flex: 0.6 }]}>
                    Phí giao dịch:
                  </AppText>
                  <AppText style={[styles.itemDefaultText, { color: Colors.gray1, flex: 1 }]}>
                    {fee || 0} vnđ
                  </AppText>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <AppText style={[styles.itemDefaultText, { color: Colors.gray5, flex: 0.6 }]}>
                    Số tiền giao dịch:
                  </AppText>
                  <AppText
                    style={[styles.itemDefaultText, { color: Colors.gray1, flex: 1 }]}
                    semiBold
                  >
                    {money || 0} vnđ
                  </AppText>
                </View>
              </>
            ) : null}
          </View>

          {item?.disabled ? null : (
            <View
              style={{
                position: 'absolute',
                right: 12,
                flexDirection: 'row',
                alignItems: 'center',
                top: 16,
              }}
            >
              {isSelected ? (
                <AppText
                  style={{ fontSize: 12, lineHeight: 16, color: Colors.primary2, marginRight: 4 }}
                  medium
                >
                  Đã chọn
                </AppText>
              ) : null}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 24 / 2,
                  borderWidth: 1.5,
                  borderColor: isSelected ? Colors.primary2 : Colors.neutral3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSelected ? (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 12 / 2,
                      backgroundColor: Colors.primary2,
                    }}
                  />
                ) : null}
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});
