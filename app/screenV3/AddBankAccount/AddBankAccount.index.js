import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Image, ScrollView, Keyboard, TouchableOpacity, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import isEmpty from 'lodash/isEmpty';

import { Tooltip } from 'react-native-elements';

import LoadingModal from '../../componentV3/LoadingModal';
import PopupStateRequest from '../../componentV3/PopupStateRequest';

import { useActions } from '../../hooks/useActions';
import {
  dispatchGetListBanks,
  dispatchGetListBankBranches,
  dispatchAddMyBanking,
} from '../../redux/actions/actionsV3/banking';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';

import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import {
  getListBanksSelector,
  getListBankBranchesSelector,
} from '../../redux/selectors/bankingSelectors';
import { getIsLoadingAddBank } from '../../redux/selectors/commonLoadingSelector';

import DigitelClient from '../../network/DigitelClient';
import { TrackingEvents } from '../../constants/keys';

// components
import SamplePhotoPreview from '../../componentV3/SamplePhotoPreview';
import CustomTextField from '../../componentV3/CustomTextField';
import SubmitButton from '../../componentV3/Button/SubmitButton';
import PickerSelector from '../../componentV3/PickerSelector';
import WrapperCustomTextField from '../../componentV3/WrapperCustomTextField';
import CheckBox from '../../componentV3/CheckBox';
import PopupPreviewAddBank from '../../componentV3/PopupPreviewAddBank';
import withCameraPicker from '../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../constants/cameraObjKeys';
import AppText from '../../componentV3/AppText';

import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';
import {
  checkAndRequestPermission,
  PERMISSION_CHECK,
  PERMISSION_REQUEST_MESSAGE,
} from '../../utils/permissionV3';

// styles
import styles from './AddBankAccount.style';

import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { logEvent } from '../../tracking/Firebase';
import CommonPopup from '../../componentV3/CommonPopup';
import Colors from '../../theme/Color';
import { SH, SW } from '../../constants/styles';

const AddBankAccount = ({ navigation, cameraActionsProps, previewImageProps }) => {
  const bankInfor = navigation?.state?.params?.bankInfor;
  /* ----------------------------------------- */
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const listBanks = useSelectorShallow(getListBanksSelector);
  const listBankBranches = useSelectorShallow(getListBankBranchesSelector);
  const isLoading = useSelectorShallow(getIsLoadingAddBank);
  const accountNumberRef = useRef(null);
  const bankRef = useRef(null);
  const bankBranchRef = useRef(null);
  const [isVisibleSample, setIsVisibleSample] = useState(false);
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);
  const [titlePopup, setTitlePopup] = useState(false);

  const [dataPicker, setDataPicker] = useState([]);
  const [bankNumber, setBankNumber] = useState('');
  const [bank, setBank] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [isVisiblePopUp, setIsVisiblePopup] = useState(false);
  const [isVisibleAddBank, setIsVisibleAddBank] = useState(false);
  const [stateRequest, setStateRequest] = useState(null);
  const [messageRequest, setMessageRequest] = useState('');
  const [note, onChangeNote] = useState('');
  const [isSupport, setIsSupport] = useState(false);
  const [isEditSelfie, setIsEditSelfie] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  //api shinhan
  const [showPopupConfirmInfor, setShowPopupConfirmInfor] = useState(false);
  const [errorMessageShinhan, setErrorMessageShinhan] = useState('');

  const timeSubmitWrongRef = useRef(0);

  const [bankBranch, setBankBranch] = useState(null);

  const actions = useActions({
    dispatchGetListBanks,
    dispatchGetListBankBranches,
    dispatchAddMyBanking,
    getUserMetaData,
  });

  useEffect(() => {
    if (bankInfor && bankInfor?.status === 'failed' && listBankBranches) {
      setBankNumber(bankInfor?.bank_accountNumber || '');
      setSelfieUrl(bankInfor?.selfie_path);
      const bank = listBanks.find((item) => item.value.trim() === bankInfor?.bank_name);
      if (bank) {
        setBank(bank);
        bankRef?.current?.setValue(bank?.value);
      }
      const bankBranches = listBankBranches[bank?.value] || [];
      const bankBranch = bankBranches.find((item) => item.value.trim() === bankInfor?.bank_branch);
      if (bankBranch) {
        setBankBranch(bankBranch);
        bankBranchRef?.current?.setValue(bankBranch?.value);
      }
      accountNumberRef?.current?.setValue(bankInfor?.bank_accountNumber || '');
    }
  }, [bankInfor, listBankBranches]);

  useEffect(() => {
    if (isEmpty(listBanks)) {
      actions.dispatchGetListBanks();
    }
    if (isEmpty(listBankBranches)) {
      actions.dispatchGetListBankBranches();
    }
  }, [actions, listBankBranches, listBanks, listBankBranches]);

  useEffect(() => {
    if (userMetaData?.selfiePhoto) {
      setSelfieUrl(userMetaData?.selfiePhoto);
      setIsEditSelfie(false);
    }
  }, [userMetaData]);

  const onPressSample = useCallback(() => {
    setIsVisibleSample(!isVisibleSample);
  }, [isVisibleSample]);

  const onChangeAccountNumber = useCallback((value) => {
    setBankNumber(value);
  }, []);

  const onPressSelfie = useCallback(() => {
    if (selfieUrl) {
      previewImageProps.setArrImagePreview([selfieUrl]);
      previewImageProps.onOpenPreviewImage();
      return;
    }
    cameraActionsProps.onOpenCamera(CameraOptions.selfie, (imgUrl) => {
      setSelfieUrl(imgUrl);
    });
  }, [selfieUrl, previewImageProps, cameraActionsProps]);

  const onPressRemoveImg = useCallback(() => {
    setSelfieUrl(null);
  }, []);

  const onPressSelectBank = useCallback(() => {
    setDataPicker(listBanks);
    setTitlePopup('Tên ngân hàng');
    setIsVisiblePicker(true);
  }, [listBanks]);

  const onPressSelectBankBranchs = useCallback(() => {
    if (bank?.value) {
      setDataPicker(listBankBranches[bank?.value]);
      setTitlePopup('Chi nhánh');
      setIsVisiblePicker(true);
    }
  }, [listBankBranches, bank]);

  const onClosePicker = useCallback(() => {
    setIsVisiblePicker(false);
  }, []);

  const onPressItem = useCallback(
    (item) => {
      Keyboard.dismiss();
      if (item?.branchName) {
        setBankBranch(item);
        bankBranchRef?.current?.setValue(item?.value);
      } else {
        setBank(item);
        setDataPicker(listBankBranches[item?.value]);
        bankRef?.current?.setValue(item?.value);
        setBankBranch(null);
        bankBranchRef?.current?.setValue('');
      }
      setIsVisiblePicker(false);
    },
    [listBankBranches],
  );

  const onCheckLocation = async () => {
    setIsLoadingLocation(true);
    const granted = await checkAndRequestPermission(
      PERMISSION_CHECK.LOCATION,
      PERMISSION_REQUEST_MESSAGE.LOCATION,
    );
    if (!granted) {
      setIsLoadingLocation(false);
      return;
    } else {
      checkAndRequestPermissionLocation((location) => {
        setIsLoadingLocation(false);
        if (location && location?.latitude && location?.longitude) {
          onSubmitAddBanking(location);
        }
      });
    }
  };

  const renderPopupCheckInfor = () => {
    const payload = {
      selfie_path: selfieUrl,
      bank_accountNumber: bankNumber,
      bank_name: bank?.value,
      bank_branch: bankBranch?.value,
      correct: 1,
    };
    return (
      <View style={{ backgroundColor: Colors.primary5, borderRadius: 16 }}>
        <View style={{ alignItems: 'center', paddingTop: SH(16) }}>
          <Image
            source={ICON_PATH.iconBell}
            style={{ width: SW(48), height: SH(48), resizeMode: 'contain', marginBottom: SH(12) }}
          />
          <AppText style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.secondRed }}>
            Không thể xác minh thông tin
          </AppText>
        </View>
        <View style={{ paddingHorizontal: SW(16), marginVertical: SH(16) }}>
          <AppText style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.primary4 }}>
            {errorMessageShinhan}
          </AppText>
        </View>
        {/* <View style={{ flexDirection: 'row', paddingHorizontal: SW(16) }}>
          <TouchableOpacity
            style={{
              width: SW(24),
              height: SH(24),
              borderRadius: 6,
              borderColor: '#cfd3d6',
              borderWidth: 0.75,
              marginRight: SW(12),
            }}
            onPress={() => setIsConfirmAdd(!isConfirmAdd)}
          >
            {isConfirmAdd ? (
              <Image
                source={ICON_PATH.check_on}
                style={{ width: SW(24), height: SH(24), resizeMode: 'contain' }}
              />
            ) : null}
          </TouchableOpacity>
          <View style={{ maxWidth: SW(275) }}>
            <AppText
              style={{
                fontSize: SH(13),
                lineHeight: SH(18),
                color: Colors.gray2,
              }}
            >
              Xác nhận đúng thông tin và tiếp tục thêm tài khoản ngân hàng trên
            </AppText>
          </View>
        </View> */}
        <View
          style={{
            height: SH(50),
            backgroundColor: Colors.neutral6,
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
            // marginTop: SH(23),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setShowPopupConfirmInfor(false)}
          >
            <AppText style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.gray2 }}>
              Kiểm tra lại
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const addMyBank = (payload) => {
    // setIsVisiblePopup(true);
    actions.dispatchAddMyBanking(payload, (response) => {
      if (response.status) {
        setShowPopupConfirmInfor(false);
        setErrorMessageShinhan('');
        const message = response?.message || response?.data?.message || 'Thành công!!!';
        setTimeout(() => {
          setIsVisiblePopup(true);
          setMessageRequest(message);
        }, 1000);

        if (isEditSelfie) {
          actions.getUserMetaData();
        }
        setStateRequest(isSupport ? 'pending' : 'success');
        // trackEventAddBank(location);
      } else if (response.errorCode === 'account_not_verified') {
        setShowPopupConfirmInfor(true);
        setErrorMessageShinhan(response?.message || response?.data?.message);
      } else {
        setShowPopupConfirmInfor(false);
        setErrorMessageShinhan('');
        timeSubmitWrongRef.current = timeSubmitWrongRef.current + 1;
        if (timeSubmitWrongRef.current > 2) {
          setIsSupport(true);
        }

        setTimeout(() => {
          setIsVisiblePopup(true);
          setStateRequest('failure');
          setMessageRequest(
            response?.message || response?.data?.message || 'Xảy ra lỗi, vui lòng thử lại',
          );
        }, 500);
      }
    });
  };

  const isVerifyBank = useCallback(
    () => !isEmpty(bank) && !isEmpty(bankBranch) && !isEmpty(bankNumber) && !isEmpty(selfieUrl),
    [bankNumber, bank, bankBranch, selfieUrl],
  );

  const onSubmitAddBanking = useCallback(
    (location) => {
      if (isVerifyBank()) {
        const payload = {
          selfie_path: selfieUrl,
          bank_accountNumber: bankNumber,
          bank_name: bank?.value,
          bank_branch: bankBranch?.value,
        };
        if (bankInfor?.status === 'failed') {
          payload.banking_id = bankInfor?.banking_id;
        }
        if (isSupport) {
          payload.correct = 1;
          payload.note = note;
        }
        addMyBank(payload);
      }
    },
    [
      bankInfor,
      trackEventAddBank,
      isVerifyBank,
      bankNumber,
      bank,
      bankBranch,
      selfieUrl,
      actions,
      timeSubmitWrongRef,
      note,
      isSupport,
    ],
  );

  const trackEventAddBank = useCallback((location) => {
    if (!location) return;
    DigitelClient.trackEvent(
      TrackingEvents.FINISH_ADD_NEW_BANK,
      location?.latitude,
      location?.longitude,
    );
    logEvent(TrackingEvents.FINISH_ADD_NEW_BANK, {
      // latitude: location?.latitude,
      // longitude: location?.longitude,
    });
  }, []);

  const onGobackMain = useCallback(() => {
    setIsVisiblePopup(false);
    if (stateRequest !== 'failure') {
      navigation.goBack();
    }
  }, [navigation, stateRequest]);

  const onPressSupport = useCallback(() => {
    setIsSupport(!isSupport);
  }, [isSupport]);

  const onClosePopupAddbank = useCallback(() => {
    setIsVisibleAddBank(false);
  }, []);

  const onMiddlewareCheckSubmit = useCallback(() => {
    setIsVisibleAddBank(true);
  }, []);

  const goToWebview = () => {
    navigation.navigate('WebView', {
      mode: 0,
      url: 'https://mfast.vn/lam-sao-de-rut-tien-tu-vi-tich-luy-ve-tai-khoan-ngan-hang-lien-ket/',
      title: 'MFast',
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.wrapper} scrollIndicatorInsets={{ right: 0.5 }}>
        <View key="importInforBank" style={styles.importInforBank}>
          <AppText bold style={styles.indicatorLk}>
            Thông tin ngân hàng liên kết
          </AppText>
          <AppText
            bold
            style={[
              styles.desc,
              { marginTop: 4, color: Colors.gray5, paddingVertical: 0, marginBottom: 10 },
            ]}
          >
            Chủ tài khoản phải khớp thông tin cá nhân khi định dạnh
          </AppText>
          <View style={styles.formContainer}>
            <CustomTextField
              ref={accountNumberRef}
              autoCapitalize={'words'}
              textFieldLabel={
                <AppText style={{ fontSize: 14, lineHeight: 20 }}>
                  Nhập số tài khoản ngân hàng
                  <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
                    *
                  </AppText>
                </AppText>
              }
              showError={false}
              textFieldValue={bankNumber}
              keyboardType="number-pad"
              returnKeyType="next"
              errorMessage="Số tài khoản không được để trống."
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginBottom: 10 }}
              onChangeTextFieldText={onChangeAccountNumber}
            />
            <WrapperCustomTextField
              ref={bankRef}
              autoCapitalize={'words'}
              textFieldLabel={
                <AppText style={{ fontSize: 14, lineHeight: 20 }}>
                  Tên ngân hàng
                  <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
                    *
                  </AppText>
                </AppText>
              }
              showError={false}
              textFieldValue={bank?.value || ''}
              returnKeyType="next"
              errorMessage="Tên ngân hàng không được để trống."
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginBottom: 10 }}
              onPress={onPressSelectBank}
            />
            <WrapperCustomTextField
              ref={bankBranchRef}
              autoCapitalize={'words'}
              textFieldLabel={
                <AppText style={{ fontSize: 14, lineHeight: 20 }}>
                  Chi nhánh
                  <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
                    *
                  </AppText>
                </AppText>
              }
              showError={false}
              textFieldValue={bankBranch?.value || ''}
              returnKeyType="next"
              errorMessage="Chi nhánh không được để trống."
              textFieldContainerStyle={styles.textFieldContainerStyle}
              containerStyle={{ marginBottom: 10 }}
              onPress={onPressSelectBankBranchs}
            />
          </View>
        </View>
        {isEditSelfie && (
          <View key="importSelfieContainer" style={styles.importSelfieContainer}>
            <View style={styles.raw}>
              <AppText bold style={styles.indicatorLk}>
                Hình chân dung của bạn
              </AppText>
              <Tooltip
                overlayColor="rgba(0, 0, 0, 0.4)"
                backgroundColor="#fff"
                containerStyle={{ flex: 1, height: 'auto' }}
                width={200}
                popover={
                  <AppText>
                    Hình chân dung được sử dụng làm cơ sở cho việc đối soát và rút tiền về TK Ngân
                    hàng.
                  </AppText>
                }
              >
                <View style={styles.right}>
                  <AppText style={styles.txtNote}>Chú thích</AppText>
                  <Image source={ICON_PATH.note2} style={{ width: 24, height: 24 }} />
                </View>
              </Tooltip>
            </View>
            <AppText style={styles.txtSample} onPress={onPressSample}>
              Xem mẫu chụp
            </AppText>
            <TouchableOpacity onPress={onPressSelfie}>
              {selfieUrl ? (
                <View>
                  <FastImage source={{ uri: selfieUrl }} style={styles.imgUrlSelfie} />
                  {isEditSelfie && (
                    <TouchableOpacity style={styles.icDeleteWrapper} onPress={onPressRemoveImg}>
                      <View>
                        <Image source={ICON_PATH.delete2} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Image source={IMAGE_PATH.selfieImage2} style={styles.imgSelfie} />
              )}
            </TouchableOpacity>
            <AppText style={styles.indicatorWaring}>
              (Lưu ý:{' '}
              <AppText semiBold style={[styles.indicatorWaring, { color: Colors.sixOrange }]}>
                Hình phải khớp với chân dung trên CMND/CCCD đã định danh
              </AppText>
              , phải rõ mặt, không đội mũ, không đeo kính. Hình sẽ được sử dụng làm ảnh thẻ nhân
              viên, vui lòng mặc trang phục lịch sự khi chụp ảnh)
            </AppText>
            {stateRequest === 'failure' && (
              <View style={styles.boxErrorContainer}>
                <View style={styles.headerBoxError}>
                  <AppText style={styles.txtTitle}>Kết quả duyệt hình chân dung</AppText>
                  <View style={styles.row}>
                    <Image source={ICON_PATH.failure} />
                    <AppText style={styles.txtStatus}>Thất bại</AppText>
                  </View>
                </View>
                <View>
                  {!!messageRequest && (
                    <AppText style={styles.desc}>{`- ${messageRequest}`}</AppText>
                  )}
                  {timeSubmitWrongRef.current === 1 && (
                    <AppText style={styles.desc}>- Vui lòng xoá hình trên và thử chụp lại.</AppText>
                  )}
                  {timeSubmitWrongRef.current > 1 && (
                    <AppText style={styles.desc}>
                      - Vui lòng xoá hình trên và thử chụp lại lần cuối. Nếu vẫn không được, MFast
                      sẽ chuyển thông tin của bạn đến nhân viên tư vấn để tiến hành hỗ trợ.
                    </AppText>
                  )}
                </View>
              </View>
            )}
            {timeSubmitWrongRef.current > 2 && selfieUrl && (
              <View>
                <CheckBox
                  id={'IsSupport'}
                  isChecked={true}
                  label="Yêu cầu hỗ trợ xét duyệt."
                  onPress={onPressSupport}
                />
                <View style={{ flex: 1, marginLeft: 30 }}>
                  <TextInput
                    multiline={true}
                    placeholder="Ghi chú (nếu có)"
                    style={styles.note}
                    value={note}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeNote(text)}
                  />
                </View>
              </View>
            )}
          </View>
        )}
        <View style={styles.btnWrapper}>
          <SubmitButton
            label={bankInfor?.status === 'failed' ? 'Cập nhật' : 'Thêm tài khoản ngân hàng'}
            disabled={!isVerifyBank()}
            onPress={onMiddlewareCheckSubmit}
            labelStyle={{ fontSize: 14, lineHeight: 20, fontWeight: '500' }}
            customStyle={{ height: 46 }}
          />
        </View>
      </ScrollView>
      <SamplePhotoPreview
        key="SamplePhotoPreview"
        isVisible={isVisibleSample}
        typeSample="SELFIE"
        onCloseAvatarSamplePress={onPressSample}
      />
      <PickerSelector
        title={titlePopup || ' '}
        data={dataPicker}
        onPressItem={onPressItem}
        onCloseModal={onClosePicker}
        isVisible={isVisiblePicker}
      />
      <LoadingModal visible={isLoading || isLoadingLocation} />
      <PopupStateRequest
        state={stateRequest}
        message={messageRequest}
        isVisible={isVisiblePopUp}
        onGoBack={onGobackMain}
      />
      <PopupPreviewAddBank
        data={{
          bankNumber,
          bankName: bank?.value,
          bankBranchName: bankBranch?.value,
        }}
        isVisible={isVisibleAddBank}
        onClose={onClosePopupAddbank}
        onPressSubmit={onCheckLocation}
      />
      <CommonPopup isVisible={showPopupConfirmInfor}>{renderPopupCheckInfor()}</CommonPopup>
    </View>
  );
};

export default withCameraPicker(AddBankAccount);
