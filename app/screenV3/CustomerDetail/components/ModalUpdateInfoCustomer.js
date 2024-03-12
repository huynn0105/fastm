import { StyleSheet, Text, TextInput, View } from 'react-native';
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
import Colors from '../../../theme/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../componentV3/AppText';
import InputForm from '../../FastLoan/common/InputForm';
import ButtonText from '../../../common/ButtonText';
import { ICON_PATH } from '../../../assets/path';
import WheelPick from '../../Collaborator/common/WheelPick';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import WheelPickAndSearch from '../../RegisterReferral/components/WheelPickAndSearch';
import DigitelClient from '../../../network/DigitelClient';
import { fonts } from '../../../constants/configs';
import { isValidPhone } from '../../../utils/Utils';

const ModalUpdateInfoCustomer = memo(
  forwardRef((props, ref) => {
    const { onSubmit } = props;
    const insets = useSafeAreaInsets();
    const actionSheetRef = useRef();
    const districtIdTemp = useRef();
    const [listDistrict, setListDistrict] = useState([]);
    const [district, setDistrict] = useState();
    const [fullName, setFullName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [mobilePhone, setMobilePhone] = useState('');
    const [note, setNote] = useState('');
    const [customer, setCustomer] = useState({});
    const [type, setType] = useState('');

    const bottomSheetRef = useRef();

    const disabledUpdate = useMemo(
      () =>
        type === 'UPDATE_INFO'
          ? !district || !fullName || !idNumber || !mobilePhone || !isValidPhone(mobilePhone)
          : !note,
      [district, idNumber, fullName, note, mobilePhone, type],
    );

    const getListDistrict = useCallback(async () => {
      const res = await DigitelClient.mfGetListDistrict();
      const data = Object.keys(res)?.map((key) => ({
        id: key,
        title: res[key],
      }));
      setListDistrict(data);
    }, []);

    const onOpenWheelPick = useCallback(() => {
      actionSheetRef?.current?.open('Chọn địa chỉ');
    }, []);

    const _onPress = useCallback(() => {
      const payload = {};
      const localPayload = {};
      if (type === 'UPDATE_NOTE') {
        payload.note = note;
      }
      if (type === 'UPDATE_INFO') {
        const addressSplit = listDistrict
          ?.find((item) => item?.id === district)
          ?.title?.split(' - ');
        payload.fullName = fullName;
        payload.idNumber = idNumber;
        payload.mobilePhone = mobilePhone;
        payload.district = district;

        localPayload.district_name = addressSplit[0];
        localPayload.province_name = addressSplit[1];
        localPayload.type = customer?.type;
      }

      onSubmit?.(payload, localPayload);
    }, [
      customer?.type,
      district,
      fullName,
      idNumber,
      listDistrict,
      mobilePhone,
      note,
      onSubmit,
      type,
    ]);

    useEffect(() => {
      getListDistrict();
    }, [getListDistrict]);

    useEffect(() => {
      if (type === 'UPDATE_NOTE') {
        if (customer?.note) {
          setNote(customer?.note);
        }
      }
      if (type === 'UPDATE_INFO') {
        if (customer?.fullName) {
          setFullName(customer?.fullName);
        }
        if (customer?.idNumber) {
          setIdNumber(customer?.idNumber);
        }
        if (customer?.mobilePhone) {
          setMobilePhone(customer?.mobilePhone);
        }
        if (customer?.district) {
          setDistrict(customer?.district);
        }
      }
    }, [
      customer?.fullName,
      customer?.idNumber,
      customer?.district,
      customer?.note,
      type,
      customer?.mobilePhone,
    ]);

    useImperativeHandle(ref, () => ({
      ...bottomSheetRef.current,
      open: (_type, _customer) => {
        setCustomer(_customer);
        setType(_type);
        bottomSheetRef?.current?.open(
          _type === 'UPDATE_INFO' ? 'Cập nhật thông tin' : 'Chú thích khách hàng',
        );
      },
    }));

    return (
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {type === 'UPDATE_INFO' ? (
              <>
                <AppText style={styles.title}>Thông tin khách hàng</AppText>
                <View style={styles.formContainer}>
                  <InputForm
                    title={'Họ tên'}
                    isRequire
                    placeholder={'Họ tên'}
                    autoFocus
                    value={fullName}
                    onChangeText={setFullName}
                  />
                  <InputForm
                    style={styles.input}
                    title={'Số CMND/CCCD'}
                    isRequire
                    placeholder={'Số CMND/CCCD'}
                    keyboardType={'numeric'}
                    onChangeText={setIdNumber}
                    value={idNumber}
                    errorText={
                      idNumber?.length === 0 || idNumber?.length === 9 || idNumber?.length === 12
                        ? ''
                        : 'Độ dài CMND/CCCD là 9 hoặc 12 chữ số'
                    }
                  />
                  <InputForm
                    style={styles.input}
                    title={'Số điện thoại'}
                    isRequire
                    placeholder={'Số điện thoại'}
                    keyboardType={'numeric'}
                    errorText={
                      mobilePhone?.length === 0 || mobilePhone?.length === 10
                        ? isValidPhone(mobilePhone)
                          ? ''
                          : 'Số điện thoại không đúng định dạng'
                        : 'Độ dài số điện thoại là 10 chữ số'
                    }
                    onChangeText={setMobilePhone}
                    value={mobilePhone}
                  />
                  <InputForm
                    style={styles.input}
                    title={'Địa chỉ'}
                    isRequire
                    placeholder={'Địa chỉ'}
                    onPress={onOpenWheelPick}
                    icon={ICON_PATH.select}
                    value={listDistrict?.find((item) => item?.id === district)?.title}
                  />
                </View>
              </>
            ) : (
              <TextInput
                placeholder="Thêm chú thích cho khách hàng này"
                style={styles.inputMultiline}
                multiline
                autoFocus
                value={note}
                onChangeText={setNote}
              />
            )}
            <ButtonText
              top={16}
              bottom={16}
              height={50}
              fontSize={16}
              lineHeight={24}
              medium
              style={{ alignSelf: 'center' }}
              title={'Cập nhật'}
              disabled={disabledUpdate}
              buttonColor={disabledUpdate ? Colors.neutral4 : Colors.primary2}
              onPress={_onPress}
            />
            <BottomActionSheet
              ref={actionSheetRef}
              render={() => (
                <WheelPickAndSearch
                  data={listDistrict}
                  onSelected={(id) => {
                    districtIdTemp.current = id;
                  }}
                  onPressSelected={(id) => {
                    actionSheetRef?.current?.close();
                    setDistrict(id);
                  }}
                  initIdSelected={district || listDistrict?.[0]?.id}
                />
              )}
              canClose
              haveCloseButton
              onPressDone={() => {
                actionSheetRef?.current?.close();
                setDistrict(districtIdTemp.current);
              }}
            />
          </View>
        )}
        canClose={true}
        avoidKeyboard
        haveCloseButton
      />
    );
  }),
);

export default ModalUpdateInfoCustomer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  formContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    padding: 16,
  },
  input: {
    marginTop: 16,
  },
  inputMultiline: {
    fontSize: 16,
    fontFamily: fonts.medium,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 90,
    maxHeight: 250,
    backgroundColor: Colors.primary5,
    borderRadius: 8,
  },
});
