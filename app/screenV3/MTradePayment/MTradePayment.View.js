import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

import {
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import styles from './MTradePayment.styles';
import CustomTextField from '../../componentV3/CustomTextField';
import WrapperCustomTextField from '../../componentV3/WrapperCustomTextField';
import SubmitButton from '../../componentV3/Button/SubmitButton';
import LoadingModal from '../../componentV3/LoadingModal';
import DashedHorizontal from '../../componentV3/DashedHorizontal/DashedHorizontal';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import PickerSelector from '../../componentV3/PickerSelector';
import DigitelClient from '../../network/DigitelClient';
import { formatNumber } from '../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getMTradeCreateOrder } from '../../redux/actions/actionsV3/mtradeAction';
import { showAlert } from '../../utils/UIUtils';
import ModalMTradeMessage from '../MTrade/common/ModalMTradeMessage';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { logEvent } from '../../tracking/Firebase';
import { TrackingEvents } from '../../constants/keys';
import createStoreFunc from '../../redux/store/store';
import TextStyles from '../../theme/TextStyle';

const MTradePayment = (props) => {
  const { navigation } = props;
  /* <------------------- Params -------------------> */

  const productsInit = useMemo(
    () => navigation?.state?.params?.products,
    [navigation?.state?.params?.products],
  );

  /* <------------------- Ref -------------------> */
  const provinceRef = useRef(null);
  const districtRef = useRef(null);
  const wardRef = useRef(null);
  const mtradeMessageRef = useRef();

  /* <------------------- Redux -------------------> */
  const locationCode = useSelector((state) => state?.mtradeReducer?.location);

  /* <------------------- State -------------------> */
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState({});
  const [district, setDistrict] = useState({});
  const [ward, setWard] = useState({});
  const [houseNumber, setHouseNumber] = useState('');
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [products, setProducts] = useState(productsInit);
  const [invalidSku, setInvalidSku] = useState([]);

  const [typePicker, setTypePicker] = useState('province');
  const [dataPicker, setDataPicker] = useState([]);
  const [titlePopup, setTitlePopup] = useState(false);

  const isEnableListProvince = useMemo(() => !locationCode, [locationCode]);
  const isEnableListDisTrict = useMemo(() => province?.id, [province?.id]);
  const isEnableListWard = useMemo(() => district?.id, [district?.id]);
  const totalPrice = useMemo(
    () => products?.reduce((partialSum, item) => partialSum + Number(item?.price), 0),
    [products],
  );

  const dispatch = useDispatch();

  const onChangeName = useCallback((value) => {
    setName(value);
  }, []);

  const onChangePhoneNumber = useCallback((value) => {
    setPhoneNumber(value);
  }, []);

  const onChangeHouseNumber = useCallback((value) => {
    setHouseNumber(value);
  }, []);

  const onEnableButtonSubmit = useCallback(() => {
    return (
      !isEmpty(name) &&
      !isEmpty(phoneNumber) &&
      !isEmpty(province) &&
      !isEmpty(district) &&
      !isEmpty(ward) &&
      !isEmpty(houseNumber) &&
      isValidPhone(phoneNumber) &&
      products?.length > 0 &&
      invalidSku?.length === 0
    );
  }, [
    name,
    phoneNumber,
    province,
    district,
    ward,
    houseNumber,
    isValidPhone,
    products?.length,
    invalidSku?.length,
  ]);

  const onPressItem = useCallback(
    (item) => {
      Keyboard.dismiss();
      switch (typePicker) {
        case 'province':
          setProvince(item);
          setDistricts([]);
          setWards([]);
          provinceRef?.current?.setValue(item?.value);
          setDistrict(null);
          districtRef?.current?.setValue('');
          setWard(null);
          wardRef?.current?.setValue('');
          break;
        case 'district':
          setDistrict(item);
          setWards([]);
          districtRef?.current?.setValue(item?.value);
          setWard(null);
          wardRef?.current?.setValue('');
          break;
        case 'ward':
          setWard(item);
          wardRef?.current?.setValue(item?.value);
          break;
      }
      setIsVisiblePicker(false);
    },
    [typePicker],
  );

  const onRemoveProduct = useCallback((product) => {
    setProducts((prevState) => {
      let newState = [...prevState];
      return newState;
    });
  }, []);

  const onPressSelectProvince = useCallback(() => {
    setDataPicker(provinces);
    setTitlePopup('Tỉnh/Thành');
    setTypePicker('province');
    Keyboard.dismiss();
    setTimeout(() => {
      setIsVisiblePicker(true);
    });
  }, [provinces]);

  const onPressSelectDistrict = useCallback(async () => {
    setDataPicker(districts);
    setTitlePopup('Quận/Huyện');
    setTypePicker('district');
    Keyboard.dismiss();
    setTimeout(() => {
      setIsVisiblePicker(true);
    });
  }, [districts]);

  const onPressSelectWard = useCallback(async () => {
    setDataPicker(wards);
    setTitlePopup('Phường/Xã');
    setTypePicker('ward');
    Keyboard.dismiss();
    setTimeout(() => {
      setIsVisiblePicker(true);
    });
  }, [wards]);

  const onClosePicker = useCallback(() => {
    setIsVisiblePicker(false);
  }, []);

  const renderProductCart = useCallback(
    (item, index, data) => {
      const length = data?.length;
      const isInvalid = invalidSku?.includes(item?.sku);
      return (
        <View style={styles.itemContainer}>
          <Image style={styles.imageItem} source={{ uri: item?.productImg }} />
          <View style={styles.contentWraper}>
            <AppText
              medium
              numberOfLines={1}
              style={[
                styles.labelItem,
                {
                  color: isInvalid ? Colors.gray5 : Colors.gray1,
                  textDecorationLine: isInvalid ? 'line-through' : 'none',
                },
              ]}
            >
              {item?.name}
            </AppText>
            {isInvalid ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ width: 16, height: 16, tintColor: Colors.sixRed }}
                  source={ICON_PATH.warning}
                />
                <AppText
                  style={{
                    marginLeft: 4,
                    fontSize: 14,
                    lineHeight: 18,
                    marginTop: 2,
                    color: Colors.sixRed,
                  }}
                >
                  Không hỗ trợ giao ở địa chỉ trên
                </AppText>
              </View>
            ) : null}
            <View style={styles.subContentWraper}>
              <AppText medium style={styles.priceItem}>
                {formatNumber(item?.price)} đ
              </AppText>
              {item?.comparePrice ? (
                <AppText medium style={styles.priceCompareItem}>
                  {formatNumber(item?.comparePrice)} đ
                </AppText>
              ) : null}
            </View>
            <View style={styles.subContentWraper}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={styles.amountLable}>Số lượng:</AppText>
                <AppText style={styles.amountValue}>{item?.quantity}</AppText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setProducts((prevState) => {
                    let newState = [...prevState];
                    newState = newState.filter((it) => it?.ID !== item?.ID);
                    if (newState?.length === 0) {
                      showMessage(`Bạn có muốn xóa sản phẩm "${item?.name}"?`, undefined, () => {
                        setProducts(newState);
                        mtradeMessageRef?.current?.close();
                        setTimeout(() => {
                          navigation?.goBack();
                        }, 400);
                      });
                      return prevState;
                    }
                    setInvalidSku((prev) => [...prev]?.filter((sku) => sku !== item?.sku));
                    return newState;
                  });
                }}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <AppText style={[styles.amountLable, { paddingEnd: 0 }]}>Xóa</AppText>
                <Image source={ICON_PATH.trash2} style={styles.delete} />
              </TouchableOpacity>
            </View>
            {length - 1 !== index && (
              <DashedHorizontal size={3} color={Colors.gray4} style={styles.dash} />
            )}
          </View>
        </View>
      );
    },
    [invalidSku, showMessage],
  );

  const onSubmitOrder = useCallback(() => {
    setIsShowLoading(true);
    const payload = {
      customer_info: {
        name,
        phone: phoneNumber,
        address: houseNumber,
        ward_code: ward?.id,
        district_code: district?.id,
        province_code: province?.id,
      },
      merchant_code: products[0]?.merchantCode,
      order_items: products?.map((item) => ({
        sku: item?.sku,
        quantity: item?.quantity,
        merchant_code: item?.merchantCode,
      })),
    };
    logEvent(TrackingEvents.USER_WORKING_BEHAVIOR, {
      method: 'NonMPL',
      product_line: 'MTrade',
      userID: createStoreFunc?.getState()?.myUser?.uid,
    });
    dispatch(
      getMTradeCreateOrder(payload, (isSuccess, result, _invalidSku) => {
        if (isSuccess) {
          const url = result;
          navigation?.navigate('WebView', {
            mode: 0,
            title: 'Thông tin thanh toán',
            url,
          });
        } else {
          showMessageError(result);
        }
        setInvalidSku(_invalidSku);
        setIsShowLoading(false);
      }),
    );
  }, [
    dispatch,
    district?.id,
    houseNumber,
    name,
    navigation,
    phoneNumber,
    products,
    province?.id,
    showMessageError,
    ward?.id,
  ]);

  const getListProvince = useCallback(async (code) => {
    try {
      const res = await DigitelClient.getListMTradeArea({ type: 'province' });
      const data = res?.data?.data || [];
      setProvinces(data);
      return data;
    } catch (err) {
      return [];
    }
  }, []);

  const getListDistrict = useCallback(async (code) => {
    try {
      const res = await DigitelClient.getListMTradeArea({ type: 'district', code });
      const data = res?.data?.data || [];
      setDistricts(data);
      return data;
    } catch (err) {
      return [];
    }
  }, []);

  const getListWard = useCallback(async (code) => {
    try {
      const res = await DigitelClient.getListMTradeArea({ type: 'ward', code });
      const data = res?.data?.data || [];
      setWards(data);
      return data;
    } catch (err) {
      return [];
    }
  }, []);

  const isValidPhone = useCallback(
    (phone) => /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(phone),
    [],
  );

  const showMessageError = useCallback(
    (message, onPress = () => mtradeMessageRef?.current?.close()) => {
      mtradeMessageRef?.current?.open({
        image: IMAGE_PATH.mascotError,
        titleColor: Colors.sixRed,
        title: 'Mua hàng thất bại',
        content: message || 'Đã xảy ra lỗi, vui lòng thử lại',
        actions: [
          {
            title: 'Quay lại',
            type: 'cancel',
            onPress: onPress,
          },
        ],
      });
    },
    [],
  );
  const showMessage = useCallback(
    (message, onPress = () => mtradeMessageRef?.current?.close(), onPressConfirm) => {
      mtradeMessageRef?.current?.open({
        image: IMAGE_PATH.mascotLoudspeaker,
        titleColor: Colors.blue3,
        title: 'Xác nhận xóa sản phẩm',
        content: message || 'Đã xảy ra lỗi, vui lòng thử lại',
        actions: [
          {
            title: 'Quay lại',
            type: 'cancel',
            onPress: onPress,
          },
          {
            title: 'Xóa sản phẩm',
            onPress: onPressConfirm,
          },
        ],
      });
    },
    [],
  );

  useEffect(() => {
    if (!district?.id && !province?.id) {
      getListProvince();
    } else if (district?.id) {
      getListWard(district?.id).then((data) => {
        setDataPicker(data);
      });
    } else if (province?.id) {
      getListDistrict(province?.id).then((data) => {
        setDataPicker(data);
      });
    }
  }, [district?.id, getListDistrict, getListProvince, getListWard, province?.id]);

  useEffect(() => {
    if (locationCode && provinces?.length) {
      const provinceSelect = provinces?.find((item) => item?.id === locationCode);
      if (provinceSelect) {
        setProvince(provinceSelect);
        provinceRef?.current?.setValue(provinceSelect?.value);
        setDistrict(null);
        districtRef?.current?.setValue('');
        setWard(null);
        wardRef?.current?.setValue('');
      }
    }
  }, [locationCode, provinces]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
      <ScrollView
        style={styles.wrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <AppText semiBold style={styles.titleText}>
            Địa chỉ giao hàng
          </AppText>
          <View style={styles.formWrapper}>
            <CustomTextField
              textFieldValue={name}
              autoCapitalize={'words'}
              textFieldLabel={
                <AppText style={styles.textFieldLable}>
                  Họ tên người nhận <AppText style={{ color: Colors.sixRed }}>*</AppText>
                </AppText>
              }
              keyboardType={'default'}
              returnKeyType="next"
              textFieldContainerStyle={styles.textFieldContainerStyle}
              onChangeTextFieldText={onChangeName}
            />
            <CustomTextField
              textFieldValue={phoneNumber}
              textFieldLabel={
                <AppText
                  style={[
                    styles.textFieldLable,
                    {
                      color:
                        phoneNumber?.length > 0 && !isValidPhone(phoneNumber)
                          ? Colors.sixRed
                          : Colors.gray1,
                    },
                  ]}
                >
                  Số điện thoại người nhận <AppText style={{ color: Colors.sixRed }}>*</AppText>
                </AppText>
              }
              keyboardType={'phone-pad'}
              returnKeyType="next"
              containerStyle={{ marginTop: 8 }}
              textFieldContainerStyle={styles.textFieldContainerStyle}
              showError={phoneNumber?.length > 0 && !isValidPhone(phoneNumber)}
              errorMessage={
                phoneNumber?.length !== 10
                  ? 'Số điện thoại phải gồm 10 chữ số'
                  : 'Số điện thoại không đúng định dạng'
              }
              onChangeTextFieldText={onChangePhoneNumber}
            />
            <WrapperCustomTextField
              ref={provinceRef}
              textFieldLabel={
                <AppText style={styles.textFieldLable}>
                  Tỉnh/Thành phố <AppText style={{ color: Colors.sixRed }}>*</AppText>
                </AppText>
              }
              textFieldValue={province?.value}
              returnKeyType="next"
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginVertical: 10 }}
              onPress={onPressSelectProvince}
              disabled={!isEnableListProvince}
              customIconStyle={{
                tintColor: Colors.gray2,
                opacity: isEnableListProvince ? 1 : 0.4,
              }}
              textFieldInputStyle={{ opacity: isEnableListProvince ? 1 : 0.4 }}
            />
            <WrapperCustomTextField
              ref={districtRef}
              textFieldLabel={
                <AppText
                  style={[styles.textFieldLable, !isEnableListDisTrict && styles.disableTextField]}
                >
                  Quận/Huyện{' '}
                  <AppText
                    style={[
                      { color: Colors.sixRed },
                      !isEnableListDisTrict && styles.disableTextField,
                    ]}
                  >
                    *
                  </AppText>
                </AppText>
              }
              textFieldValue={district?.value}
              returnKeyType="next"
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginVertical: 8 }}
              onPress={onPressSelectDistrict}
              disabled={!isEnableListDisTrict}
              customIconStyle={{
                tintColor: Colors.gray2,
                opacity: isEnableListDisTrict ? 1 : 0.4,
              }}
            />
            <WrapperCustomTextField
              ref={wardRef}
              textFieldLabel={
                <AppText
                  style={[styles.textFieldLable, !isEnableListWard && styles.disableTextField]}
                >
                  Phường/Xã{' '}
                  <AppText
                    style={[{ color: Colors.sixRed }, !isEnableListWard && styles.disableTextField]}
                  >
                    *
                  </AppText>
                </AppText>
              }
              textFieldValue={ward?.value}
              returnKeyType="next"
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginVertical: 8 }}
              onPress={onPressSelectWard}
              disabled={!isEnableListWard}
              customIconStyle={{
                tintColor: Colors.gray2,
                opacity: isEnableListWard ? 1 : 0.4,
              }}
            />
            <CustomTextField
              textFieldValue={houseNumber}
              textFieldLabel={
                <AppText style={styles.textFieldLable}>
                  Tên đường, số nhà <AppText style={{ color: Colors.sixRed }}>*</AppText>
                </AppText>
              }
              returnKeyType="done"
              containerStyle={{ marginTop: 8 }}
              textFieldContainerStyle={styles.textFieldContainerStyle}
              onChangeTextFieldText={onChangeHouseNumber}
            />
          </View>
          <AppText semiBold style={styles.titleText}>
            Danh sách sản phẩm
          </AppText>
          <View style={styles.listContainer}>
            {products?.map(renderProductCart)}
            <DashedHorizontal size={3} color={Colors.gray4} style={styles.dashBottom} />
            <View style={styles.totalPriceWraper}>
              <AppText style={styles.totalPriceLabel}>Tổng giá trị:</AppText>
              <AppText semiBold style={styles.totalPrice}>
                {formatNumber(totalPrice)} đ
              </AppText>
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <SubmitButton
              label={'Xác nhận đơn hàng'}
              disabled={!onEnableButtonSubmit()}
              customStyle={onEnableButtonSubmit() ? styles.button : styles.disableButton}
              labelStyle={styles.buttonLabel}
              disableLabelStyle={styles.disableButtonLabel}
              onPress={onSubmitOrder}
            />
          </View>
          <View style={styles.noteWrapper}>
            <AppText style={styles.note}>
              Đảm bảo
              <AppText semiBold style={styles.highlightNote}>
                {' '}
                thông tin sản phẩm{' '}
              </AppText>
              và
              <AppText semiBold style={styles.highlightNote}>
                {' '}
                địa chi giao hàng chính xác{' '}
              </AppText>
              trước khi thanh toán / tham gia trả chậm.
            </AppText>
          </View>
        </View>
      </ScrollView>
      <LoadingModal visible={isShowLoading} />
      <ModalMTradeMessage ref={mtradeMessageRef} />
      <PickerSelector
        title={titlePopup || ' '}
        data={dataPicker}
        onPressItem={onPressItem}
        onCloseModal={onClosePicker}
        isVisible={isVisiblePicker}
      />
    </KeyboardAvoidingView>
  );
};

export default MTradePayment;
