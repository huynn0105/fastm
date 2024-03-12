import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../componentV3/AppText';
import Tooltip from 'react-native-walkthrough-tooltip';
import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import { SH, SW } from '../../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import CheckBoxSquare from '../../componentV3/CheckBoxSquare';
import { formatPhoneNumber } from '../../utils/phoneHelper';
import { DATA_FINANCE_RADIO_BUTTON, DATA_RADIO_BUTTON, LINK_GUIDE } from './CreateAdLink.constants';
import ItemProductInsurance from './common/ItemProductInsurance';
import {
  createAdLink,
  editAdLink,
  getPosterLink,
  getUserAdLink,
  getViewLink,
  removeAdLink,
} from '../../redux/actions/actionsV3/customerAction';
import LoadingModal from '../../componentV3/LoadingModal';
import { showAlert } from '../../utils/UIUtils';
import { Switch } from 'react-native-switch';
import PopupStatus from '../../componentV3/PopupStatus';
import { TYPE_MODAL } from '../RSMPushMessage/RSMPushMessage.View';
import PopupAdImage from '../AdLink/components/PopupAdImage';
import BottomActionSheet from '../../components2/BottomActionSheet';
import { TAB_TYPE } from '../Customer/Customer.constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CharAvatar from '../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../redux/actions/user';
import Rating from '../Collaborator/common/Rating';
import CustomRadioButton from '../../componentV3/RadioButton/RadioButton.View';

const EDGES = ['right', 'bottom', 'left'];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const onLayoutAnimationCreateLink = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      200,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity,
    ),
  );
};

const CreateAdLink = memo((props) => {
  const { navigation } = props;
  const itemLink = navigation.getParam('item');

  const onRefreshList = navigation.getParam('onRefreshList');
  const onUpdateItem = navigation.getParam('onUpdateItem');

  const dispatch = useDispatch();
  const popupStatusRef = useRef();
  const bottomSheetRef = useRef();
  const bottomSheetUserRef = useRef();

  const [listInsuranceActive, setListInsuranceActive] = useState([]);
  const [financeActive, setFinanceActive] = useState('');

  const [listInsuranceDiscount, setListInsuranceDiscount] = useState([]);

  const [toolTipVisible, setToolTipVisible] = React.useState(false);
  const [toolTipNameVisible, setToolTipNameVisible] = React.useState(false);
  const [toolTipInsuranceVisible, setToolTipInsuranceVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const myUser = useSelector((state) => state?.myUser);

  const [isPhoneZalo, setIsPhoneZalo] = useState(false);
  const [phoneZalo, setPhoneZalo] = useState(myUser?.mPhoneNumber);

  const [isPhoneNumber, setIsPhoneNumber] = useState(true);

  const [isLinkMessenger, setIsLinkMessenger] = useState(false);
  const [linkMessenger, setLinkMessenger] = useState('');

  const [adLinkName, setAdLinkName] = useState('');
  const [name, setName] = useState(myUser?.fullName);
  const [product, setProduct] = useState();

  const [listInsurance, setListInsurance] = useState([]);

  const [detail, setDetail] = useState({});

  const [active, setActive] = useState(itemLink?.active || '1');

  const [dataAdImage, setDataAdImage] = useState({});

  const [isResetHighestDiscount, setIsResetHighestDiscount] = useState(false);

  const [errors, setErrors] = useState({});

  const [userHandler, setUserHandler] = useState({});

  const [disableChangeDiscount, setDisableChangeDiscount] = useState(false);

  const onCloseTooltip = useCallback(() => {
    setToolTipVisible(false);
  }, []);
  const onOpenTooltip = useCallback(() => {
    setToolTipVisible(true);
  }, []);

  const onCloseTooltipName = useCallback(() => {
    setToolTipNameVisible(false);
  }, []);
  const onOpenTooltipName = useCallback(() => {
    setToolTipNameVisible(true);
  }, []);
  const onCloseTooltipInsurance = useCallback(() => {
    setToolTipInsuranceVisible(false);
  }, []);
  const onOpenTooltipInsurance = useCallback(() => {
    setToolTipInsuranceVisible(true);
  }, []);

  const onChangeIsLinkMessenger = useCallback((value) => {
    onLayoutAnimationCreateLink();
    setIsLinkMessenger(value);
  }, []);

  const onChangeIsPhoneZalo = useCallback((value) => {
    onLayoutAnimationCreateLink();
    setIsPhoneZalo(value);
  }, []);

  const onChangeIsPhoneNumber = useCallback((value) => {
    onLayoutAnimationCreateLink();
    setIsPhoneNumber(value);
  }, []);

  const onPressGuide = useCallback(() => {
    Linking.openURL(LINK_GUIDE).catch((err) => {});
  }, []);

  const renderRadioButton = useCallback(
    (item, _, __, isChild) => {
      const isSelected = isChild ? financeActive === item?.key : product === item?.key;
      const error = errors?.[isChild ? 'financeActive' : 'product'];

      const disabled = itemLink?.id;
      const label = item?.label;
      const note = item?.note;
      return (
        <CustomRadioButton
          label={label}
          note={note}
          disabled={disabled}
          isSelected={isSelected}
          error={error}
          onPress={() => {
            if (isChild) {
              setErrors((prev) => {
                if (prev?.financeActive?.length) {
                  const newState = { ...prev };
                  delete newState.financeActive;
                  return newState;
                }
                return prev;
              });
              onLayoutAnimationCreateLink();
              setFinanceActive(item?.key);
            } else {
              onLayoutAnimationCreateLink();
              setErrors((prev) => {
                if (prev?.product?.length) {
                  const newState = { ...prev };
                  delete newState.product;
                  return newState;
                }
                return prev;
              });
              setProduct(item?.key);
            }
          }}
        ></CustomRadioButton>
      );
    },
    [errors, financeActive, itemLink?.id, product],
  );

  const renderItemInsurance = useCallback(
    (item) => {
      return (
        <ItemProductInsurance
          isError={errors?.listInsuranceActive?.length}
          disabled={itemLink?.id}
          key={item?.ID}
          item={item}
          disabledDiscount={disableChangeDiscount}
          isSelected={listInsuranceActive.includes(item?.ID)}
          onSelected={(isSelected) => {
            setErrors((prev) => {
              if (prev?.listInsuranceActive?.length) {
                const newState = { ...prev };
                delete newState.listInsuranceActive;
                return newState;
              }
              return prev;
            });
            setListInsuranceActive((prevState) => {
              let newState = [...prevState];
              if (isSelected) {
                newState?.push(item?.ID);
              } else {
                newState = newState.filter((ID) => ID !== item?.ID);
              }

              return newState;
            });
          }}
          initDiscount={listInsuranceDiscount?.[item?.ID] || 0}
          onChangeDiscount={(discount) => {
            setListInsuranceDiscount((prevState) => {
              const newState = { ...prevState };
              newState[item?.ID] = discount;
              return newState;
            });
          }}
        />
      );
    },
    [
      disableChangeDiscount,
      errors?.listInsuranceActive?.length,
      itemLink?.id,
      listInsuranceActive,
      listInsuranceDiscount,
    ],
  );

  const onShareLink = useCallback(async (link) => {
    try {
      await Share.share({
        message: link,
      });
    } catch (error) {
      if (__DEV__) {
        console.log('error', error);
      }
    }
  }, []);

  const onPressStatus = useCallback(
    (id, status, isFinance) => {
      if (status) {
        navigation?.popToTop();
        navigation?.navigate('Customer', {
          params: {
            initTabType: isFinance ? TAB_TYPE.LOAN : TAB_TYPE.INSURANCE,
            initFilter: {
              page_qc: [id],
              status: status,
            },
            initTabIndex: 1,
          },
        });
      } else {
        navigation?.navigate('CustomerDetail', {
          group: TAB_TYPE.PAGE,
          idLink: id,
          title: 'Khách hàng chưa phân loại',
        });
      }
    },
    [navigation],
  );

  const onGetPosterLink = useCallback(
    (id) => {
      setIsLoading(true);
      dispatch(
        getPosterLink(id, (isSuccess, result) => {
          setIsLoading(false);
          if (isSuccess) {
            setDataAdImage(result);
            bottomSheetRef.current.open();
          } else {
            showAlert('Không thể tải dữ liệu');
          }
        }),
      );
    },
    [dispatch],
  );

  const renderInfoLink = useCallback(() => {
    const disabled = itemLink?.active !== '1';

    return (
      <View style={[styles.boxContainer, { paddingBottom: SH(12) }]}>
        <View style={styles.row}>
          <Image style={styles.itemImage} source={{ uri: itemLink?.icon }} />
          <AppText style={styles.itemTitle} medium numberOfLines={1}>
            {itemLink?.customer_label}
          </AppText>
        </View>
        <AppText
          style={[
            styles.itemInfoValue,
            { color: Colors.gray5, marginTop: SH(8), marginBottom: SH(12) },
          ]}
        >
          {itemLink?.link_review}
        </AppText>
        <View style={[styles.row, { marginTop: 5 }]}>
          <TouchableOpacity
            style={styles.itemInfo}
            disabled={!itemLink?.total_follow > 0}
            onPress={() => {
              onPressStatus(itemLink?.id, undefined, itemLink?.finance === '1');
            }}
          >
            <AppText style={styles.itemInfoTitle}>Quan tâm</AppText>
            <View style={styles.row}>
              <AppText semiBold style={[styles.itemInfoValue, { color: Colors.purple3 }]}>
                {itemLink?.total_follow || 0}
              </AppText>
              {itemLink?.total_follow > 0 ? (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={[styles.itemArrow, { tintColor: Colors.purple3 }]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemInfo}
            disabled={!itemLink?.total_attended > 0}
            onPress={() => {
              onPressStatus(itemLink?.id, '2', itemLink?.finance === '1');
            }}
          >
            <AppText style={styles.itemInfoTitle}>Tham gia</AppText>
            <View style={styles.row}>
              <AppText semiBold style={[styles.itemInfoValue, { color: Colors.sixOrange }]}>
                {itemLink?.total_attended || 0}
              </AppText>
              {itemLink?.total_attended > 0 ? (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={[styles.itemArrow, { tintColor: Colors.sixOrange }]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!itemLink?.total_success > 0}
            style={styles.itemInfo}
            onPress={() => {
              onPressStatus(itemLink?.id, '1', itemLink?.finance === '1');
            }}
          >
            <AppText style={styles.itemInfoTitle}>Thành công</AppText>
            <View style={styles.row}>
              <AppText semiBold style={[styles.itemInfoValue, { color: Colors.green5 }]}>
                {itemLink?.total_success || 0}
              </AppText>
              {itemLink?.total_success > 0 ? (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={[styles.itemArrow, { tintColor: Colors.green5 }]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.row,
            {
              borderTopWidth: 1,
              marginTop: SH(8),
              paddingTop: SH(12),
              borderTopColor: Colors.neutral5,
            },
          ]}
        >
          <TouchableOpacity
            disabled={disabled}
            onPress={() => {
              onGetPosterLink(itemLink?.id);
            }}
            style={styles.row}
          >
            <Image
              source={ICON_PATH.outlinePicture}
              style={[
                styles.itemInfoIcon,
                { marginLeft: 0 },
                disabled && { tintColor: Colors.gray3 },
              ]}
            />
            <AppText
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: disabled ? Colors.gray3 : Colors.gray5,
              }}
            >
              Brochure
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onShareLink(itemLink?.link_review)}
            style={[styles.row, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
            disabled={disabled}
          >
            <AppText
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: disabled ? Colors.gray3 : Colors.gray5,
              }}
            >
              Gửi link
            </AppText>
            <Image
              style={[
                styles.itemInfoIcon,
                { marginRight: 0 },
                disabled && { tintColor: Colors.gray3 },
              ]}
              source={ICON_PATH.outlineSend}
            />
          </TouchableOpacity>
          <View style={styles.row}>
            <AppText
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: Colors.gray5,
                marginRight: SW(8),
                marginLeft: SW(4),
              }}
            >
              Hoạt động
            </AppText>
            <Switch
              value={active === '1'}
              onValueChange={(value) => {
                value = value ? '1' : '0';
                setActive(value);
              }}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={0}
              circleSize={30}
              backgroundActive={Colors.primary2}
              backgroundInactive={Colors.gray5}
              circleActiveColor={'transparent'}
              circleInActiveColor={'transparent'}
              switchLeftPx={3}
              switchRightPx={3}
              switchWidthMultiplier={1.7}
              renderInsideCircle={() => (
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 26,
                    backgroundColor: Colors.primary5,
                  }}
                />
              )}
            />
          </View>
        </View>
      </View>
    );
  }, [
    active,
    itemLink?.active,
    itemLink?.customer_label,
    itemLink?.finance,
    itemLink?.icon,
    itemLink?.id,
    itemLink?.link_review,
    itemLink?.total_attended,
    itemLink?.total_follow,
    itemLink?.total_success,
    onGetPosterLink,
    onPressStatus,
    onShareLink,
  ]);

  const onGetData = useCallback(() => {
    setIsLoading(true);
    dispatch(
      getViewLink(itemLink?.id, (isSuccess, result) => {
        if (isSuccess) {
          const listTemp = Object.values(result?.listInsurance || {});
          const objTemp = {};

          listTemp.forEach((item) => {
            objTemp[item?.ID] = result?.detail?.insurance_config_arr?.[item?.ID] || 0;
          });
          setDisableChangeDiscount(!!result?.discount_customizable);
          setListInsuranceDiscount(objTemp);
          setListInsuranceActive(Object.keys(result?.detail?.insurance_config_arr || {}));
          if (result?.detail) {
            setAdLinkName(result?.detail?.customer_label);
            setName(result?.detail?.full_name);
            setPhoneZalo(result?.detail?.social_phone);
            setIsPhoneZalo(result?.detail?.social_zalo);
            setLinkMessenger(result?.detail?.social_facebook);

            if (result?.detail?.social_array?.includes('phone')) {
              setIsPhoneNumber(true);
            }
            if (result?.detail?.social_array?.includes('facebook')) {
              setIsLinkMessenger(true);
            }
            if (result?.detail?.social_array?.includes('zalo')) {
              setIsPhoneZalo(true);
            }
            if (result?.detail?.finance === '1') {
              setProduct('finance');
              setFinanceActive(result?.detail?.next_handler);
              if (result?.detail?.next_handler === 'other') {
                setUserHandler(result?.detail?.user_handler || {});
              }
            } else {
              setProduct('insurrance');
            }

            setDetail(result?.detail);
          }
          setListInsurance(listTemp);
        }
        setIsLoading(false);
      }),
    );
  }, [dispatch, itemLink?.id]);

  const onGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const onCreateAdLink = useCallback(() => {
    const payload = {};
    const errorsTemp = {};

    if (!product) {
      errorsTemp.product = 'Thông tin này là bắt buộc';
    }
    payload.necessity = product;

    if (!adLinkName) {
      errorsTemp.adLinkName = 'Thông tin này là bắt buộc';
    }
    payload.customer_label = adLinkName;
    if (!name) {
      errorsTemp.name = 'Thông tin này là bắt buộc';
    }
    payload.full_name = name;

    if (!isPhoneZalo && !isLinkMessenger && !isPhoneNumber) {
      errorsTemp.contact = 'Thông tin này là bắt buộc';
    }
    const social = [];
    if (isPhoneNumber) {
      social.push('phone');
    }
    if (isPhoneZalo) {
      social.push('zalo');
    }
    if (isLinkMessenger) {
      social.push('facebook');
    }
    payload.social = social;
    payload.description = '';

    payload.social_zalo = phoneZalo || '';
    payload.social_facebook = linkMessenger || '';
    if (product === 'finance') {
      if (!financeActive?.length) {
        errorsTemp.financeActive = 'Thông tin này là bắt buộc';
      }
      payload.next_handler = financeActive;
      if (financeActive === 'other') {
        if (userHandler?.ID) {
          payload.user_handler = userHandler?.ID;
        } else {
          errorsTemp.userHandler = 'Thông tin này là bắt buộc';
        }
      }
    }
    if (payload.necessity === 'insurrance') {
      if (listInsuranceActive?.length === 0) {
        errorsTemp.listInsuranceActive = 'Thông tin này là bắt buộc';
      }
      payload.insurance_list = listInsuranceActive;
      payload.insurance_discount = listInsuranceDiscount;
    }
    if (Object.keys(errorsTemp).length > 0) {
      onLayoutAnimationCreateLink();
      setErrors(errorsTemp);
      return;
    } else {
      setErrors({});
    }
    const actionCreate = () => {
      popupStatusRef?.current?.open({
        type: TYPE_MODAL.LOADING,
        content: (
          <AppText style={{ color: Colors.gray5 }}>
            Đang cập nhật thay đổi, vui lòng không thoát ứng dụng lúc này
          </AppText>
        ),
      });
      dispatch(
        createAdLink(payload, (isSuccess, result) => {
          if (isSuccess) {
            onRefreshList?.();
            popupStatusRef?.current?.open({
              type: TYPE_MODAL.SUCCESS,
              title: 'Cập nhật thành công',
              content: <AppText style={{ color: Colors.gray5 }}>{result}</AppText>,
              titleButtonRight: 'Hoàn tất',
              onPressRight: () => {
                popupStatusRef?.current?.close();
                onGoBack();
              },
            });
          } else {
            popupStatusRef?.current?.open({
              type: TYPE_MODAL.ERROR,
              title: 'Cập nhật thất bại',
              content: (
                <AppText style={{ color: Colors.gray5 }}>
                  {result || 'Đã có lỗi xẩy ra, vui lòng kiểm tra và thử lại'}
                </AppText>
              ),
              titleButtonRight: 'Thử lại',
              onPressRight: actionCreate,
              titleButtonLeft: <AppText style={{ color: Colors.gray1 }}>Để sau</AppText>,
              onPressLeft: () => {
                popupStatusRef?.current?.close();
              },
            });
          }
        }),
      );
    };

    if (product === 'insurrance') {
      const listChangeDiscount = [];

      listInsuranceActive?.forEach((it) => {
        const discountIns = listInsuranceDiscount?.[it] || 0;
        const nameIns = listInsurance?.find((i) => i.ID === it)?.name;

        if (discountIns > 0) {
          listChangeDiscount.push({
            name: nameIns,
            discount: discountIns,
          });
        }
      });

      if (listChangeDiscount?.length) {
        popupStatusRef?.current?.open({
          type: TYPE_MODAL.WARNING2,
          title: 'Xác nhận thay đổi thiết lập',
          content: (
            <AppText style={{ color: Colors.gray5 }}>
              Danh sách sản phẩm có thay đổi chiết khấu
            </AppText>
          ),
          renderSubContent: (
            <View
              style={{
                backgroundColor: Colors.neutral5,
                borderRadius: SH(8),
                marginTop: SH(8),
                width: '100%',
              }}
            >
              {listChangeDiscount?.map((it, index) => {
                return (
                  <View
                    style={[
                      styles.row,
                      {
                        justifyContent: 'space-between',
                        paddingVertical: SH(12),
                        marginHorizontal: SW(12),
                        borderTopWidth: index ? 1 : 0,
                        borderTopColor: Colors.gray4,
                      },
                    ]}
                  >
                    <AppText>{it?.name}</AppText>
                    <AppText>{it?.discount}%</AppText>
                  </View>
                );
              })}
            </View>
          ),
          titleButtonLeft: <AppText style={{ color: Colors.gray1 }}>Để sau</AppText>,
          titleButtonRight: 'Tạo link ngay',
          onPressLeft: () => {
            popupStatusRef?.current?.close();
          },
          onPressRight: actionCreate,
        });
      } else {
        actionCreate();
      }
    } else {
      actionCreate();
    }
  }, [
    adLinkName,
    dispatch,
    financeActive,
    isLinkMessenger,
    isPhoneNumber,
    isPhoneZalo,
    linkMessenger,
    listInsurance,
    listInsuranceActive,
    listInsuranceDiscount,
    name,
    onGoBack,
    onRefreshList,
    phoneZalo,
    product,
    userHandler?.ID,
  ]);

  const onEditAdLink = useCallback(() => {
    const payload = {
      ID: itemLink?.id,
    };
    const errorsTemp = {};

    if (!product) {
      errorsTemp.product = 'Thông tin này là bắt buộc';
    }
    payload.necessity = product;

    if (!adLinkName) {
      errorsTemp.adLinkName = 'Thông tin này là bắt buộc';
    }
    payload.customer_label = adLinkName;
    if (!name) {
      errorsTemp.name = 'Thông tin này là bắt buộc';
    }
    payload.full_name = name;

    if (!isPhoneZalo && !isLinkMessenger && !isPhoneNumber) {
      errorsTemp.contact = 'Thông tin này là bắt buộc';
    }
    const social = [];
    if (isPhoneNumber) {
      social.push('phone');
    }
    if (isPhoneZalo) {
      social.push('zalo');
    }
    if (isLinkMessenger) {
      social.push('facebook');
    }
    payload.active = active === '1';
    payload.social = social;
    payload.description = '';
    payload.social_zalo = phoneZalo || '';
    payload.social_facebook = linkMessenger || '';
    if (product === 'finance') {
      if (!financeActive?.length) {
        errorsTemp.financeActive = 'Thông tin này là bắt buộc';
      }
      payload.next_handler = financeActive;
    }
    if (payload.necessity === 'insurrance') {
      if (listInsuranceActive?.length === 0) {
        errorsTemp.listInsuranceActive = 'Thông tin này là bắt buộc';
      }
      payload.insurance_list = listInsuranceActive;
      payload.insurance_discount = listInsuranceDiscount;
    }
    if (Object.keys(errorsTemp).length > 0) {
      onLayoutAnimationCreateLink();
      setErrors(errorsTemp);
      return;
    } else {
      setErrors({});
    }
    const actionEdit = () => {
      popupStatusRef?.current?.open({
        type: TYPE_MODAL.LOADING,
        content: (
          <AppText style={{ color: Colors.gray5 }}>
            Đang cập nhật thay đổi, vui lòng không thoát ứng dụng lúc này
          </AppText>
        ),
      });
      dispatch(
        editAdLink(payload, (isSuccess, result) => {
          if (isSuccess) {
            onUpdateItem?.(payload);
            popupStatusRef?.current?.open({
              type: TYPE_MODAL.SUCCESS,
              title: 'Cập nhật thành công',
              content: <AppText style={{ color: Colors.gray5 }}>{result}</AppText>,
              titleButtonRight: 'Hoàn tất',
              onPressRight: () => {
                popupStatusRef?.current?.close();
                onGoBack();
              },
            });
          } else {
            popupStatusRef?.current?.open({
              type: TYPE_MODAL.ERROR,
              title: 'Cập nhật thất bại',
              content: (
                <AppText style={{ color: Colors.gray5 }}>
                  {result || 'Đã có lỗi xẩy ra, vui lòng kiểm tra và thử lại'}
                </AppText>
              ),
              titleButtonRight: 'Thử lại',
              onPressRight: actionEdit,
              titleButtonLeft: <AppText style={{ color: Colors.gray1 }}>Để sau</AppText>,
              onPressLeft: () => {
                popupStatusRef?.current?.close();
              },
            });
          }
        }),
      );
    };

    const listChangeDiscount = [];

    listInsuranceActive.forEach((it) => {
      const discountInsAfter = detail?.insurance_config_arr?.[it];
      const discountIns = listInsuranceDiscount?.[it] || 0;
      if (Number(discountIns) !== Number(discountInsAfter)) {
        const nameIns = listInsurance?.find((i) => i.ID === it)?.name;

        listChangeDiscount.push({
          name: nameIns,
          discount: discountIns,
        });
      }
    });

    if (listChangeDiscount?.length === 0) {
      actionEdit();
      return;
    }

    popupStatusRef?.current?.open({
      type: TYPE_MODAL.WARNING2,
      title: 'Xác nhận thay đổi thiết lập',
      content: (
        <AppText style={{ color: Colors.gray5 }}>Danh sách sản phẩm có thay đổi chiết khấu</AppText>
      ),
      renderSubContent: (
        <View
          style={{
            backgroundColor: Colors.neutral5,
            borderRadius: SH(8),
            marginTop: SH(8),
            width: '100%',
          }}
        >
          {listChangeDiscount?.map((it, index) => {
            return (
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                    paddingVertical: SH(12),
                    marginHorizontal: SW(12),
                    borderTopWidth: index ? 1 : 0,
                    borderTopColor: Colors.gray4,
                  },
                ]}
              >
                <AppText>{it?.name}</AppText>
                <AppText>{it?.discount}%</AppText>
              </View>
            );
          })}
        </View>
      ),
      titleButtonLeft: <AppText style={{ color: Colors.gray1 }}>Để sau</AppText>,
      titleButtonRight: 'Cập nhật link ngay',
      onPressLeft: () => {
        popupStatusRef?.current?.close();
      },
      onPressRight: actionEdit,
    });
  }, [
    itemLink?.id,
    product,
    adLinkName,
    name,
    isPhoneZalo,
    isLinkMessenger,
    isPhoneNumber,
    active,
    phoneZalo,
    linkMessenger,
    listInsuranceActive,
    financeActive,
    listInsuranceDiscount,
    dispatch,
    onUpdateItem,
    onGoBack,
    detail?.insurance_config_arr,
    listInsurance,
  ]);

  const onRemoveAdLink = useCallback(() => {
    const actionRemove = () => {
      popupStatusRef?.current?.open({
        type: TYPE_MODAL.LOADING,
        content: (
          <AppText style={{ color: Colors.gray5 }}>
            Đang xóa link quảng cáo, vui lòng không thoát ứng dụng lúc này
          </AppText>
        ),
      });
      dispatch(
        removeAdLink(
          { ID: itemLink?.id, type: itemLink?.finance === '1' ? 'finance' : 'insurrance' },
          (isSuccess, result) => {
            if (isSuccess) {
              popupStatusRef?.current?.open({
                type: TYPE_MODAL.SUCCESS,
                title: 'Xóa link thành công',
                content: (
                  <AppText
                    style={{
                      color: Colors.gray5,
                    }}
                  >
                    {result}
                  </AppText>
                ),
                titleButtonRight: 'Hoàn tất',
                onPressRight: () => {
                  popupStatusRef?.current?.close();
                  onGoBack();
                },
              });
            } else {
              popupStatusRef?.current?.open({
                type: TYPE_MODAL.ERROR,
                title: 'Xóa link thất bại',
                content: (
                  <AppText style={{ color: Colors.gray5 }}>
                    {result || 'Đã có lỗi xẩy ra, vui lòng kiểm tra và thử lại'}
                  </AppText>
                ),
                titleButtonRight: 'Thử lại',
                onPressRight: actionRemove,
                titleButtonLeft: <AppText style={{ color: Colors.gray1 }}>Để sau</AppText>,
                onPressLeft: () => {
                  popupStatusRef?.current?.close();
                },
              });
            }
          },
        ),
      );
    };

    popupStatusRef?.current?.open({
      type: TYPE_MODAL.WARNING,
      title: 'Xác nhận yêu cầu',
      content: (
        <AppText style={{ color: Colors.gray5 }}>
          Sau khi xóa, link quảng cáo sẽ không thể truy cập. Tuy nhiên, các khách hàng đến từ link
          này vẫn hiển thị tại tệp khách hàng của bạn.
        </AppText>
      ),
      titleButtonLeft: (
        <AppText medium style={{ color: Colors.fiveRed }}>
          Xóa link
        </AppText>
      ),
      titleButtonRight: 'Xem lại',
      onPressRight: () => {
        popupStatusRef?.current?.close();
      },
      onPressLeft: actionRemove,
    });
  }, [dispatch, itemLink?.finance, itemLink?.id, onGoBack]);

  const onGoToLink = useCallback(() => {
    Linking.openURL(detail?.action_link);
  }, [detail?.action_link]);

  const onPressResetDiscount = useCallback(() => {
    const newListInsuranceDiscount = {};
    listInsuranceActive.forEach((it) => {
      const discount = isResetHighestDiscount
        ? listInsurance?.find((i) => i.ID === it)?.comm_percent || '0'
        : '0';

      newListInsuranceDiscount[it] = discount;
    });
    setListInsuranceDiscount(newListInsuranceDiscount);
  }, [isResetHighestDiscount, listInsurance, listInsuranceActive]);

  const onChangeName = useCallback((text) => {
    setErrors((prev) => {
      if (prev?.name?.length) {
        const newState = { ...prev };
        delete newState.name;
        onLayoutAnimationCreateLink();
        return newState;
      }
      return prev;
    });
    setName(text);
  }, []);

  const onChangeAdLinkName = useCallback((text) => {
    setErrors((prev) => {
      if (prev?.adLinkName?.length) {
        const newState = { ...prev };
        delete newState.adLinkName;
        onLayoutAnimationCreateLink();
        return newState;
      }
      return prev;
    });
    setAdLinkName(text);
  }, []);

  useEffect(() => {
    onGetData();
  }, []);

  useEffect(() => {
    if (isLinkMessenger || isPhoneNumber || isPhoneZalo) {
      setErrors((prev) => {
        if (prev?.contact?.length) {
          const newState = { ...prev };
          delete newState.contact;
          onLayoutAnimationCreateLink();
          return newState;
        }
        return prev;
      });
    }
  }, [isLinkMessenger, isPhoneNumber, isPhoneZalo]);

  const insets = useSafeAreaInsets();

  const ScrollViewComponent = useMemo(
    () => (Platform.OS === 'ios' ? KeyboardAwareScrollView : ScrollView),
    [],
  );

  return (
    <SafeAreaView edges={EDGES} style={styles.container}>
      <ScrollViewComponent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[insets?.bottom === 0 && { paddingBottom: SH(16) }]}
      >
        {itemLink?.id ? renderInfoLink() : null}
        <TouchableOpacity activeOpacity={1} style={styles.tooltip} onPress={onOpenTooltip}>
          <AppText style={styles.titleNote} semiBold>
            THÔNG TIN LIÊN HỆ
          </AppText>
          <Tooltip
            isVisible={toolTipVisible}
            disableShadow
            content={
              <AppText
                style={[
                  styles.textNoteContent,
                  {
                    width: SW(250),
                  },
                ]}
              >
                {'Giúp khách hàng liên hệ với bạn nếu có bất kỳ thắc mắc về sản phẩm'}
              </AppText>
            }
            placement="bottom"
            backgroundColor={'rgba(10, 10, 40, 0.85)'}
            onClose={onCloseTooltip}
          >
            <Image
              source={ICON_PATH.note2}
              style={[styles.iconNote, toolTipVisible && { backgroundColor: Colors.primary5 }]}
            />
          </Tooltip>
        </TouchableOpacity>
        <View style={[styles.boxContainer, { marginTop: SH(8) }]}>
          <AppText style={styles.textNoteContent}>Tên liên hệ</AppText>
          {errors?.name?.length ? (
            <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
              <Image source={ICON_PATH.warning} style={styles.warning} />
              <AppText style={styles.errorText}>{errors?.name}</AppText>
            </View>
          ) : null}
          <TextInput
            placeholder="Nhập tên"
            value={name}
            onChangeText={onChangeName}
            style={[
              styles.input,
              { marginTop: SH(8) },
              errors?.name && { borderColor: Colors.fiveRed },
            ]}
          />
          <View style={[styles.line, { marginTop: SH(16), marginBottom: SH(8) }]} />
          <AppText style={styles.textNoteContent}>Phương thức liên hệ</AppText>
          {errors?.contact?.length ? (
            <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
              <Image source={ICON_PATH.warning} style={styles.warning} />
              <AppText style={styles.errorText}>{errors?.contact}</AppText>
            </View>
          ) : null}
          <View>
            <CheckBoxSquare
              isError={errors?.contact?.length}
              label={'Messenger'}
              textColor={isLinkMessenger && Colors.gray1}
              onChangeValue={onChangeIsLinkMessenger}
              isSelected={isLinkMessenger}
            />
            {isLinkMessenger ? (
              <TextInput
                placeholder="Nhập link messenger"
                value={isLinkMessenger ? linkMessenger : ''}
                onChangeText={setLinkMessenger}
                style={[styles.input, { marginTop: SH(8) }]}
              />
            ) : null}
            <CheckBoxSquare
              isError={errors?.contact?.length}
              label={'Zalo'}
              textColor={isPhoneZalo && Colors.gray1}
              onChangeValue={onChangeIsPhoneZalo}
              isSelected={isPhoneZalo}
            />
            {isPhoneZalo ? (
              <TextInput
                placeholder="Nhập số điện thoại Zalo"
                value={isPhoneZalo ? phoneZalo : ''}
                onChangeText={setPhoneZalo}
                style={[styles.input, { marginTop: SH(8) }]}
              />
            ) : null}
            <CheckBoxSquare
              isError={errors?.contact?.length}
              isSelected={isPhoneNumber}
              onChangeValue={onChangeIsPhoneNumber}
              // disabled
              textColor={Colors.gray1}
              label={`Số điện thoại - ${formatPhoneNumber(myUser?.mPhoneNumber, ' ')}`}
            />
            <TouchableOpacity style={styles.buttonGuide} onPress={onPressGuide}>
              <AppText style={styles.textGuide}>Hướng dẫn</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <AppText style={[styles.titleNote, { marginTop: SH(24) }]} semiBold>
          THIẾT LẬP LIÊN KẾT
        </AppText>
        <View style={[styles.boxContainer, { marginTop: SH(8) }]}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.tooltip, { marginTop: 0 }]}
            onPress={onOpenTooltipName}
          >
            <AppText style={styles.textNoteContent}>Tên liên kết tiếp thị</AppText>
            <Tooltip
              isVisible={toolTipNameVisible}
              disableShadow
              content={
                <AppText
                  style={[
                    styles.textNoteContent,
                    {
                      width: SW(275),
                    },
                  ]}
                >
                  {
                    'Giúp bạn nhận biết khách hàng đến từ liên kết nào, khi sử dụng nhiều liên kết cùng lúc'
                  }
                </AppText>
              }
              placement="bottom"
              backgroundColor={'rgba(10, 10, 40, 0.85)'}
              onClose={onCloseTooltipName}
            >
              <Image
                source={ICON_PATH.note2}
                style={[
                  styles.iconNote,
                  toolTipNameVisible && { backgroundColor: Colors.primary5 },
                ]}
              />
            </Tooltip>
          </TouchableOpacity>
          {errors?.adLinkName?.length ? (
            <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
              <Image source={ICON_PATH.warning} style={styles.warning} />
              <AppText style={styles.errorText}>{errors?.adLinkName}</AppText>
            </View>
          ) : null}
          <View style={{ marginTop: SH(8), justifyContent: 'center' }}>
            <TextInput
              placeholder="Nhập tên link"
              value={adLinkName}
              onChangeText={onChangeAdLinkName}
              style={[
                styles.input,
                { paddingRight: SW(30) },
                errors?.adLinkName?.length && { borderColor: Colors.fiveRed },
              ]}
              maxLength={32}
            />
            <AppText style={styles.textCountLength}>{`${adLinkName.length}/32`}</AppText>
          </View>
          <View style={[styles.line, { marginTop: SH(16), marginBottom: SH(8) }]} />
          <AppText style={styles.textNoteContent}>Sản phẩm hiển thị trong liên kết</AppText>
          {errors?.product?.length ? (
            <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
              <Image source={ICON_PATH.warning} style={styles.warning} />
              <AppText style={styles.errorText}>{errors?.product}</AppText>
            </View>
          ) : null}
          {DATA_RADIO_BUTTON.map(renderRadioButton)}
          {product === 'insurrance' ? (
            <View style={styles.listInsuranceContainer}>
              <View style={styles.line} />
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.tooltip, { marginTop: SH(12) }]}
                onPress={onOpenTooltipInsurance}
              >
                <AppText style={styles.textNoteContent}>Chọn sản phẩm và chiết khấu</AppText>
                <Tooltip
                  isVisible={toolTipInsuranceVisible}
                  disableShadow
                  content={
                    <AppText
                      style={[
                        styles.textNoteContent,
                        {
                          width: SW(295),
                        },
                      ]}
                    >
                      {
                        'Chọn sản phẩm bảo hiểm hiện thị trong liên kết, và chiết khấu tương ứng nếu muốn'
                      }
                    </AppText>
                  }
                  placement="bottom"
                  backgroundColor={'rgba(10, 10, 40, 0.85)'}
                  onClose={onCloseTooltipInsurance}
                >
                  <Image
                    source={ICON_PATH.note2}
                    style={[
                      styles.iconNote,
                      toolTipInsuranceVisible && { backgroundColor: Colors.primary5 },
                    ]}
                  />
                </Tooltip>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  width: SW(343),
                  backgroundColor: `#d6e5ff`,
                  left: SW(-16),
                  paddingHorizontal: SW(16),
                  paddingVertical: SH(12),
                  marginTop: SH(12),
                }}
              >
                <CheckBoxSquare
                  style={{ alignItems: 'flex-start', marginTop: 0, flex: 1 }}
                  numberOfLines={2}
                  onChangeValue={setIsResetHighestDiscount}
                  label={
                    <AppText style={{ fontSize: 14 }}>
                      {'Đặt chiết khấu cao nhất\ncho tất cả sản phẩm'}
                    </AppText>
                  }
                  isSelected={isResetHighestDiscount}
                />
                <TouchableOpacity style={styles.row} onPress={onPressResetDiscount}>
                  <AppText style={[styles.textNoteContent, { color: Colors.primary2 }]}>
                    {'Đặt lại'}
                  </AppText>
                </TouchableOpacity>
              </View>
              {errors?.listInsuranceActive?.length ? (
                <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
                  <Image source={ICON_PATH.warning} style={styles.warning} />
                  <AppText style={styles.errorText}>{errors?.listInsuranceActive}</AppText>
                </View>
              ) : null}
              {listInsurance?.map(renderItemInsurance)}
            </View>
          ) : product === 'finance' ? (
            <>
              {errors?.financeActive?.length ? (
                <View style={{ flexDirection: 'row', marginTop: SH(12), marginLeft: SW(32) }}>
                  <Image source={ICON_PATH.warning} style={styles.warning} />
                  <AppText style={styles.errorText}>{errors?.financeActive}</AppText>
                </View>
              ) : null}
              <View
                style={{
                  marginTop: SH(16),
                }}
              >
                <View style={styles.line} />
                <AppText style={[styles.textNoteContent, { marginTop: SH(12) }]}>
                  Đối với khách hàng có nhu cầu và để lại thông tin, tôi muốn:
                </AppText>
                {DATA_FINANCE_RADIO_BUTTON.map((it, idx) => renderRadioButton(it, idx, null, true))}
              </View>
              {financeActive === 'other' ? (
                <>
                  <View style={{ marginTop: SH(16) }}>
                    <View style={styles.line} />
                    <AppText style={[styles.textNoteContent, { marginTop: SH(12) }]}>
                      Người xử lý khách hàng thay bạn
                    </AppText>
                  </View>
                  {errors?.userHandler?.length ? (
                    <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
                      <Image source={ICON_PATH.warning} style={styles.warning} />
                      <AppText style={styles.errorText}>{errors?.userHandler}</AppText>
                    </View>
                  ) : null}
                  {userHandler?.ID ? (
                    <User
                      data={userHandler}
                      isCheckBox={false}
                      onPress={() => {
                        bottomSheetUserRef?.current?.open();
                      }}
                      disabled={itemLink?.id}
                    />
                  ) : (
                    <TouchableWithoutFeedback
                      disabled={itemLink?.id}
                      onPress={() => {
                        bottomSheetUserRef?.current?.open();
                      }}
                    >
                      <View
                        style={{
                          paddingLeft: SW(8),
                          paddingRight: SW(12),
                          paddingVertical: SH(8),
                          marginTop: SH(8),
                          borderRadius: SH(8),
                          backgroundColor: Colors.neutral5,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.primary5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            source={ICON_PATH.user}
                            style={{
                              width: 28,
                              height: 28,
                            }}
                          />
                        </View>
                        <AppText
                          medium
                          style={{
                            fontSize: 16,
                            lineHeight: 22,
                            color: Colors.primary2,
                            marginLeft: 16,
                          }}
                        >
                          Chọn người xử lý
                        </AppText>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                </>
              ) : null}
            </>
          ) : null}
        </View>
        <View
          style={{
            marginTop: SH(20),
          }}
        >
          {itemLink?.id ? (
            <TouchableOpacity
              onPress={onEditAdLink}
              style={[
                styles.buttonConfirm,
                {
                  backgroundColor: Colors.primary2,
                  borderColor: Colors.primary2,
                  marginBottom: SH(16),
                },
              ]}
            >
              <AppText style={[styles.textConfirm, { color: Colors.primary5 }]} medium>
                Cập nhật trạng thái
              </AppText>
            </TouchableOpacity>
          ) : null}
          <View style={styles.buttonConfirmContainer}>
            <TouchableOpacity
              style={[styles.buttonConfirm, { marginRight: SW(12) }]}
              onPress={onGoBack}
            >
              <AppText style={styles.textConfirm} medium>
                Quay lại
              </AppText>
            </TouchableOpacity>
            {itemLink?.id ? (
              <TouchableOpacity
                style={[styles.buttonConfirm, { marginRight: SW(12) }]}
                onPress={onGoToLink}
              >
                <AppText style={styles.textConfirm} medium>
                  Xem thử link
                </AppText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onCreateAdLink}
                style={[
                  styles.buttonConfirm,
                  { backgroundColor: Colors.primary2, borderColor: Colors.primary2 },
                ]}
              >
                <AppText style={[styles.textConfirm, { color: Colors.primary5 }]} medium>
                  Tạo liên kết
                </AppText>
              </TouchableOpacity>
            )}
          </View>
          {itemLink?.id ? (
            <AppText
              onPress={onRemoveAdLink}
              style={[
                styles.textGuide,
                {
                  color: Colors.fiveRed,
                  textAlign: 'center',
                  marginTop: SH(16),
                },
              ]}
            >
              Xóa link quảng cáo
            </AppText>
          ) : null}
        </View>
      </ScrollViewComponent>
      <PopupStatus ref={popupStatusRef} />
      <LoadingModal visible={isLoading} />
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <PopupAdImage
            itemSelected={itemLink}
            onClose={() => bottomSheetRef?.current?.close?.()}
            data={dataAdImage}
          />
        )}
      />
      <BottomActionSheet
        avoidKeyboard
        headerText={'Chọn người xử lý'}
        haveCloseButton
        ref={bottomSheetUserRef}
        render={() => (
          <FindUser
            onPressUser={(user) => {
              bottomSheetUserRef?.current?.close();
              setUserHandler(user);
            }}
            userSelected={userHandler}
          />
        )}
      />
    </SafeAreaView>
  );
});

export default CreateAdLink;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    flex: 1,
    paddingHorizontal: SW(16),
  },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SH(20),
  },
  iconNote: {
    marginLeft: SW(4),
    width: SH(20),
    height: SH(20),
    borderRadius: SH(20),
    resizeMode: 'contain',
  },
  titleNote: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  textNoteContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  boxContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: SH(8),
    paddingHorizontal: SW(16),
    paddingVertical: SH(16),
  },
  input: {
    fontSize: 16,
    paddingVertical: SH(0),
    paddingHorizontal: SW(16),
    backgroundColor: Colors.neutral5,
    borderRadius: SH(8),
    borderWidth: 1,
    borderColor: Colors.gray4,
    height: SH(40),
  },
  line: {
    height: 1,
    backgroundColor: Colors.gray4,
  },
  textCountLength: {
    fontSize: 12,
    color: Colors.gray7,
    position: 'absolute',
    right: SW(12),
  },
  buttonGuide: {
    top: SH(16),
    position: 'absolute',
    right: 0,
  },
  textGuide: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primary2,
  },
  buttonConfirmContainer: {
    flexDirection: 'row',
  },
  buttonConfirm: {
    flex: 1,
    height: SH(48),
    borderRadius: SH(24),
    borderWidth: 1,
    borderColor: Colors.gray5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textConfirm: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
  },
  listInsuranceContainer: {
    marginTop: SH(16),
  },

  itemInfo: {
    flex: 1,
  },
  itemInfoTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  itemInfoValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemInfoIcon: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
    marginHorizontal: SW(4),
  },
  itemArrow: {
    width: SW(14),
    height: SH(14),
    resizeMode: 'contain',
    top: -SH(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: SW(32),
    height: SH(32),
    resizeMode: 'contain',
    marginRight: SW(12),
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray1,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.fiveRed,
    marginLeft: SW(4),
  },
  warning: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: SW(4),
    tintColor: Colors.fiveRed,
  },
  inputContainer: {
    marginHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 12,
  },
  inputSearch: {
    flex: 1,
    height: 44,
    padding: 0,
  },
  iconSearch: {
    width: 20,
    height: 20,
    tintColor: Colors.gray5,
    marginRight: 12,
  },
});

const FindUser = memo((props) => {
  const { userSelected, onPressUser } = props;
  const [keySearch, setKeySearch] = useState('');
  const [isFocusInput, setIsFocusInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCallApi, setIsCallApi] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  const inputRef = useRef();

  const onInputFocus = useCallback(() => {
    setIsFocusInput(true);
  }, []);

  const onInputBlur = useCallback(() => {
    setIsFocusInput(false);
  }, []);

  const onChangeText = useCallback((text) => {
    setKeySearch(text);
  }, []);

  const onClearInput = useCallback(() => {
    inputRef?.current?.clear();
    setKeySearch('');
  }, []);

  const onGetUser = useCallback(
    (text) => {
      setIsCallApi((prev) => (prev ? prev : true));
      dispatch(
        getUserAdLink(text, (isSuccess, result) => {
          console.log(
            '\u001B[33m ai log ne \u001B[36m -> file: CreateAdLink.View.js -> line 1724 -> isSuccess, result',
            isSuccess,
            result,
          );
          if (isSuccess) {
            setData(result);
          } else {
            setData({});
          }
          setIsLoading(false);
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (keySearch?.length === 5 || keySearch?.length === 6) {
      setIsLoading(true);
      onGetUser(keySearch);
    }
    if (keySearch?.length === 0) {
      setIsCallApi(false);
    }
  }, [keySearch, onGetUser]);

  const renderInputSearch = useCallback(() => {
    return (
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocusInput ? Colors.primary2 : Colors.gray4,
          },
        ]}
      >
        <Image source={ICON_PATH.search3} style={styles.iconSearch} />
        <TextInput
          ref={inputRef}
          style={styles.inputSearch}
          placeholder={'Tìm theo tên sản phẩm'}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onChangeText={onChangeText}
          keyboardType={'numeric'}
        />
        {keySearch?.length > 0 ? (
          <TouchableWithoutFeedback onPress={onClearInput}>
            <View>
              <Image source={ICON_PATH.close4} style={{ width: 20, height: 20, margin: SH(5) }} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }, [isFocusInput, keySearch?.length, onChangeText, onClearInput, onInputBlur, onInputFocus]);

  const renderNote = () => {
    const isSearch = keySearch?.length === 5 || keySearch?.length === 6;
    return (
      <View style={{ height: 250, alignItems: 'center', marginTop: 20 }}>
        {isSearch ? (
          <Image source={ICON_PATH.statusError} style={{ height: SW(56), width: SW(56) }} />
        ) : null}
        {isSearch ? (
          <AppText
            style={{
              opacity: 0.6,
              fontSize: 14,
              lineHeight: 20,
              textAlign: 'center',
              color: '#24253d',
              marginTop: SH(16),
            }}
          >
            {`Mã MFast `}
            <AppText semiBold>{keySearch}</AppText>
            {` không tồn tại,\nvui lòng kiểm tra lại`}
          </AppText>
        ) : (
          <AppText
            style={{
              opacity: 0.6,
              fontSize: 14,
              lineHeight: 20,
              textAlign: 'center',
              color: '#656585',
              paddingHorizontal: 40,
            }}
          >
            Nhập đúng mã MFast của đối phương (gồm 5 hoặc 6 chữ số) để gửi lời mời kết bạn
          </AppText>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: Colors.neutral5,
        paddingTop: 12,
        paddingBottom: 12 + (isFocusInput ? 0 : insets?.bottom),
      }}
    >
      {renderInputSearch()}
      {isLoading ? (
        <View style={{ height: 250, marginTop: 20 }}>
          <ActivityIndicator color={Colors.gray5} />
        </View>
      ) : isCallApi && data?.ID ? (
        <>
          <View style={{ height: 250, marginTop: 20, marginHorizontal: 16 }}>
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray5 }}>
              Kết quả tìm kiếm
            </AppText>
            <User
              data={data}
              isCheckBox
              isChecked={data?.ID === userSelected?.ID}
              onPress={() => {
                onPressUser(data);
              }}
            />
          </View>
        </>
      ) : (
        renderNote()
      )}
    </View>
  );
});

const User = memo((props) => {
  const { data, isCheckBox, isChecked, onPress, disabled } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: isCheckBox ? Colors.primary5 : Colors.neutral5,
          borderRadius: 8,
          marginTop: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <CharAvatar
          source={hardFixUrlAvatar(data?.avatarImage)}
          defaultName={data?.fullName}
          style={{ width: 64, height: 64, borderRadius: 64 / 2 }}
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1 }}>
              {data?.fullName}
            </AppText>
            <View
              style={{
                width: isCheckBox ? 8 : 4,
                height: isCheckBox ? 8 : 4,
                borderRadius: 4,
                backgroundColor: Colors.gray5,
                marginHorizontal: 4,
              }}
            />
            <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: 'rgb(34, 29, 176)' }}>
              {data?.title}
            </AppText>
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <AppText semiBold style={{ fontSize: 13, lineHeight: 18, color: Colors.gray5 }}>
              Kỹ năng bán hàng
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText
                semiBold
                style={{ fontSize: 14, lineHeight: 20, color: 'rgb(34, 29, 176)', top: 2 }}
              >
                {Number(data?.point) ? Number(data?.point)?.toFixed(1) : 0}
              </AppText>
              <Rating
                star={Number(data?.point)}
                size={16}
                space={4}
                style={styles.rating}
                colorInActive={Colors.neutral4}
              />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          {isCheckBox ? (
            <>
              {isChecked ? null : (
                <AppText
                  style={{
                    color: Colors.gray5,
                    fontSie: 12,
                    lineHeight: 16,
                    marginRight: 4,
                    top: 2,
                  }}
                >
                  Chọn
                </AppText>
              )}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 24 / 2,
                  borderWidth: 2,
                  borderColor: isChecked ? Colors.primary2 : Colors.gray5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isChecked ? (
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 15 / 2,
                      backgroundColor: Colors.primary2,
                    }}
                  ></View>
                ) : null}
              </View>
            </>
          ) : disabled ? null : (
            <AppText
              style={{
                color: Colors.primary2,
                fontSie: 12,
                lineHeight: 16,
                marginRight: 4,
              }}
            >
              Chọn lại
            </AppText>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});
