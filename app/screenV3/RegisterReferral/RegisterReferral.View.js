import {
  Alert,
  DeviceEventEmitter,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import { Pressable } from 'react-native';
import AppText from '../../componentV3/AppText';
import Tooltip from 'react-native-walkthrough-tooltip';
import SearchInput from './components/SearchInput';
import FilterSupporter from './components/FilterSupporter';
import ListSupporter from './components/ListSupporter';
import BottomActionSheet from '../../components2/BottomActionSheet';
import ModalListReview from '../Collaborator/common/ModalListReview';
import { useDispatch, useSelector } from 'react-redux';
import ButtonText from '../../common/ButtonText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalRequestSupporter from './components/ModalRequestSupporter';
import CharAvatar from '../../componentV3/CharAvatar';
import { hardFixUrlAvatar, registerExternal, removeSupporter } from '../../redux/actions/user';
import Rating from '../Collaborator/common/Rating';
import { getTimeBetween } from '../../utils/dateHelper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';
import Loading from '../../componentV3/LoadingModal';
import { defaultNavOptions } from '../../screens2/Root/MainScreen';
import { showAlert } from '../../utils/UIUtils';

const RegisterReferral = (props) => {
  const { navigation } = props;
  const params = useMemo(() => navigation?.state?.params, [navigation?.state?.params]);
  const isRegister = useMemo(() => {
    return params?.fullName?.length > 0;
  }, [params?.fullName?.length]);

  const initItemRequest = useMemo(() => params?.itemRequest || {}, [params?.itemRequest]);
  const disabledListReferralUser = useSelector((state) => state?.appInfo?.disabledListReferralUser);

  const bottomSheetRef = useRef();
  const bottomSheetRequestRef = useRef();
  const bottomSheetData = useRef({});

  const [isAutoSelect, setIsAutoSelect] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [filters, setFilters] = useState({});
  const filterSearch = useMemo(() => ({ text: textSearch }), [textSearch]);
  const [itemSelected, setItemSelected] = useState({});
  const [isReadyCallApi, setIsReadyCallApi] = useState(false);
  const [disabledListReferralUserWhenRegister, setDisabledListReferralUserWhenRegister] =
    useState(isRegister);

  const [itemRequest, setItemRequest] = useState(initItemRequest);
  const [isLoading, setIsLoading] = useState(false);

  const filterRating = useSelector((state) => state?.collaboratorReducer?.filterRating);
  const isLoginProcessing = useSelector((state) => state?.isLoginProcessing);

  const onPressSelectItem = useCallback((item) => {
    if (item?.toUserID) {
      setIsAutoSelect(false);
      setItemSelected((prevState) => {
        if (item?.toUserID === prevState?.toUserID) {
          return {};
        }
        return item;
      });
    }
  }, []);
  const onPressItem = useCallback((item) => {
    bottomSheetData.current = item;
    bottomSheetRef.current?.open('Thông tin người dẫn dắt');
  }, []);
  const onCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const onOpenBottomSheetRequest = useCallback(() => {
    bottomSheetRequestRef?.current?.open('Xác nhận yêu cầu');
  }, []);

  const onCloseBottomSheetRequest = useCallback(() => {
    bottomSheetRequestRef?.current?.close();
  }, []);
  const onReadyCallApi = useCallback(() => {
    setIsReadyCallApi(true);
  }, []);

  const onRequestChangeSupporterSuccess = useCallback(
    (item) => {
      setItemRequest(item);
      onCloseBottomSheetRequest();
    },
    [onCloseBottomSheetRequest],
  );

  const onChangeSupporter = useCallback(() => {
    setTextSearch('');
    setItemSelected();
    setItemRequest({});
  }, []);

  const renderHeaderListSearch = useCallback(() => {
    return (
      <AppText medium style={styles.headerText}>
        Kết quả tìm kiếm
      </AppText>
    );
  }, []);
  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const dispatch = useDispatch();

  const onRegisterWithoutRef = useCallback(() => {
    dispatch(
      registerExternal(params, () => {
        navigation?.popToTop();
        navigation.navigate('Home');
      }),
    );
  }, [dispatch, navigation, params]);
  const onRegisterWithRef = useCallback(() => {
    dispatch(
      registerExternal({ ...params, referralID: itemSelected?.referralID }, () => {
        navigation?.popToTop();
        navigation.navigate('Home');
      }),
    );
  }, [dispatch, itemSelected?.referralID, navigation, params]);

  useEffect(() => {
    if (isRegister) {
      AsyncStorage.getItem(AsyncStorageKeys.REFFERAL_CODE).then((refCode) => {
        if (refCode) {
          setIsAutoSelect(true);
          setTextSearch(refCode);
        } else {
          setDisabledListReferralUserWhenRegister(false);
        }
      });
    }
  }, [isRegister]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {itemRequest?.toUserID ? (
        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray5 }}>
            Đã gửi yêu cầu, vui lòng chờ phản hồi từ {itemRequest?.fullName}
          </AppText>
          <View
            style={{
              backgroundColor: Colors.primary5,
              borderRadius: 8,
              alignItems: 'center',
              padding: 16,
              marginTop: 12,
            }}
          >
            <CharAvatar
              style={styles.avatar}
              defaultName={itemRequest?.fullName}
              source={hardFixUrlAvatar(itemRequest?.avatarImage)}
              textStyle={{ fontSize: 22 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <AppText semiBold style={{ fontSize: 18, lineHeight: 26, color: Colors.gray1 }}>
                {itemRequest?.fullName}
              </AppText>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 4,
                  backgroundColor: Colors.gray5,
                  marginHorizontal: 8,
                }}
              />
              <AppText semiBold style={{ fontSize: 18, lineHeight: 26, color: Colors.blue3 }}>
                {itemRequest?.title}
              </AppText>
            </View>
            <Rating
              star={Number(itemRequest?.avgRating)}
              size={20}
              colorInActive={Colors.neutral4}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: Colors.sixOrange }}>
                Chờ chấp nhận
              </AppText>
              <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray5 }}>
                {' '}
                - {getTimeBetween(moment(itemRequest?.time))}
              </AppText>
            </View>
            <TouchableWithoutFeedback onPress={onChangeSupporter}>
              <View
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <AppText style={{ fontSize: 13, lineHeight: 18, color: Colors.gray5 }}>
                  Chọn lại
                </AppText>
                <Image
                  source={ICON_PATH.edit1}
                  style={{
                    width: 18,
                    height: 18,
                    marginLeft: 8,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <SearchInput value={textSearch} onChangeText={setTextSearch} autoFocus={isRegister} />
          <ListSupporter
            filters={filterSearch}
            itemSelected={itemSelected}
            onPressSelectItem={onPressSelectItem}
            onPressItem={onPressItem}
            ListHeaderComponent={renderHeaderListSearch}
            isAutoSelect={isAutoSelect}
            isReadyCallApi
          />
          {disabledListReferralUserWhenRegister || disabledListReferralUser ? null : (
            <>
              <FilterSupporter onChangeFilter={setFilters} onReadyCallApi={onReadyCallApi} />
              <View style={{ flex: 1 }}>
                <ListSupporter
                  filters={filters}
                  itemSelected={itemSelected}
                  onPressSelectItem={onPressSelectItem}
                  onPressItem={onPressItem}
                  isReadyCallApi={isReadyCallApi}
                />
              </View>
            </>
          )}
        </View>
      )}
      {isRegister ? (
        <AppText
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: Colors.gray1,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          {`Nếu `}
          <AppText bold style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
            không có
          </AppText>
          {` hoặc `}
          <AppText bold style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
            không muốn chọn
          </AppText>
          {` người dẫn dắt, vui lòng bấm “Bỏ qua & tiếp tục”`}
        </AppText>
      ) : null}
      <View style={styles.buttonContainer}>
        <ButtonText
          title={isRegister ? 'Bỏ qua & tiếp tục' : 'Quay lại'}
          height={50}
          width={isRegister ? null : 125}
          buttonColor={Colors.neutral5}
          titleColor={Colors.gray5}
          borderColor={Colors.gray5}
          fontSize={16}
          lineHeight={24}
          onPress={isRegister ? onRegisterWithoutRef : onBack}
          medium
          style={itemRequest?.toUserID ? null : { flex: 1, marginRight: 12 }}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        />
        {itemRequest?.toUserID ? null : (
          <ButtonText
            title={'Chọn người này'}
            height={50}
            width={125}
            fontSize={16}
            lineHeight={24}
            buttonColor={!itemSelected?.toUserID ? Colors.neutral3 : Colors.primary2}
            borderColor={!itemSelected?.toUserID ? Colors.neutral3 : Colors.primary2}
            titleColor={!itemSelected?.toUserID ? Colors.gray5 : Colors.primary5}
            onPress={isRegister ? onRegisterWithRef : onOpenBottomSheetRequest}
            disabled={!itemSelected?.toUserID}
            medium
            style={{ flex: 1 }}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          />
        )}
      </View>
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <ModalListReview
            data={{
              ...filterRating,
              infoUserSp: {
                detail: bottomSheetData?.current,
              },
            }}
            initCategory={'lead'}
            isChoosing
            onCloseModal={onCloseBottomSheet}
            onPressSelect={onPressSelectItem}
            isChecked={itemSelected?.toUserID === bottomSheetData?.current?.toUserID}
            isHideChat
          />
        )}
        canClose={true}
        haveCloseButton={true}
        avoidKeyboard={false}
        headerTextStyle={{
          textAlign: 'center',
        }}
      />
      <BottomActionSheet
        ref={bottomSheetRequestRef}
        render={() => (
          <ModalRequestSupporter
            item={itemSelected}
            onCloseModal={onCloseBottomSheetRequest}
            onSuccess={onRequestChangeSupporterSuccess}
          />
        )}
        canClose={true}
        haveCloseButton={true}
        headerTextStyle={{
          textAlign: 'center',
        }}
      />
      <Loading visible={isLoginProcessing || isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral5, padding: 16 },
  headerBackButton: {
    width: 44,
    height: 44,
    paddingLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
});

RegisterReferral.navigationOptions = ({ navigation }) => {
  const title = navigation?.state?.params?.title || 'Chọn người dẫn dắt';
  const options = {
    ...defaultNavOptions,
    title,
    headerTitleStyle: {
      ...defaultNavOptions.headerTitleStyle,
      lineHeight: 26,
    },
    headerRight: <HeaderRightButton navigation={navigation} />,
  };

  return options;
};

const HeaderRightButton = (props) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const onCloseTooltip = useCallback(() => {
    setToolTipVisible(false);
  }, []);
  const onOpenTooltip = useCallback(() => {
    setToolTipVisible(true);
  }, []);

  return (
    <Pressable onPress={onOpenTooltip} style={styles.container}>
      <Tooltip
        isVisible={toolTipVisible}
        disableShadow
        contentStyle={{ width: 275, height: 'auto', padding: 12 }}
        content={
          <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray5 }}>
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.blue3 }} bold>
              Người dẫn dắt
            </AppText>{' '}
            là người đã mời bạn tham gia MFast, cũng là người giải đáp những thắc mắc của bạn trong
            quá trình tạo ra thu nhập trên MFast{'\n\n'}
            Ngoài ra, bạn cũng có thể{' '}
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.blue3 }} bold>
              thay đổi
            </AppText>{' '}
            hoặc{' '}
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.blue3 }} bold>
              tìm người dẫn dắt mới
            </AppText>{' '}
            nếu muốn
          </AppText>
        }
        placement="bottom"
        backgroundColor={'rgba(10, 10, 40, 0.85)'}
        onClose={onCloseTooltip}
      >
        <Image
          source={ICON_PATH.note2}
          style={{
            tintColor: toolTipVisible ? Colors.primary5 : Colors.gray5,
            width: 20,
            height: 20,
          }}
        />
      </Tooltip>
    </Pressable>
  );
};

export default RegisterReferral;
