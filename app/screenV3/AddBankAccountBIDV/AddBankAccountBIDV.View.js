import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import ButtonText from '../../common/ButtonText';
import { TextField } from 'rn-material-ui-textfield';
import { useDispatch } from 'react-redux';
import { dispatchAddMyBanking, getUserBIDVData } from '../../redux/actions/actionsV3/banking';
import PopupPreviewAddBank from '../../componentV3/PopupPreviewAddBank';
import PopupStateRequest from '../../componentV3/PopupStateRequest';
import CommonPopup from '../../componentV3/CommonPopup';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import ViewStatus from '../../common/ViewStatus';
import { STATUS_ENUM } from '../../common/ViewStatus';
import { Tooltip } from 'react-native-elements';
import withCameraPicker from '../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../constants/cameraObjKeys';
import FastImage from 'react-native-fast-image';
import CheckBox from '../../componentV3/CheckBox';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { SH, SW } from '../../constants/styles';
import SamplePhotoPreview from '../../componentV3/SamplePhotoPreview';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';

const AddBankAccountBIDV = ({ navigation, previewImageProps, cameraActionsProps }) => {
  const dispatch = useDispatch();
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);

  const timeSubmitWrongRef = useRef(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [data, setData] = useState({});
  const [bankNumber, setBankNumber] = useState();
  const [selfieUrl, setSelfieUrl] = useState();
  //api shinhan
  const [showPopupConfirmInfor, setShowPopupConfirmInfor] = useState(false);
  const [errorMessageShinhan, setErrorMessageShinhan] = useState('');
  const [messageRequest, setMessageRequest] = useState('');
  const [isVisiblePopUp, setIsVisiblePopup] = useState(false);
  const [stateRequest, setStateRequest] = useState();
  //
  const [isEditSelfie, setIsEditSelfie] = useState(true);
  const [isVisibleSample, setIsVisibleSample] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const [note, onChangeNote] = useState('');

  const disabled = useMemo(() => !bankNumber?.length, [bankNumber?.length]);

  const renderTitle = useCallback(({ title, desc }) => {
    return (
      <View style={[styles.row, { marginTop: 8 }]}>
        <AppText style={[styles.text, { flex: 33 }]}>{title}</AppText>
        <AppText semiBold style={[styles.text, { color: Colors.gray1, flex: 67 }]}>
          {desc}
        </AppText>
      </View>
    );
  }, []);

  const onShowModalConfirm = useCallback(() => {
    setIsShowModalConfirm(true);
  }, []);

  const onCloseModalConfirm = useCallback(() => {
    setIsShowModalConfirm(false);
  }, []);

  const onSubmitAddBanking = useCallback(() => {
    setIsLoading(true);
    const payload = {
      selfie_path: selfieUrl,
      bank_accountNumber: bankNumber,
      bank_name: data?.bank_data?.bankName,
      bank_branch: data?.bank_data?.branchName,
      is_bidv_banking: 1,
    };

    if (isSupport) {
      payload.correct = 1;
      payload.note = note;
    }

    dispatch(
      dispatchAddMyBanking(payload, (response) => {
        if (response.status) {
          setShowPopupConfirmInfor(false);
          setErrorMessageShinhan('');
          const message = response?.message || response?.data?.message || 'Thành công!!!';
          setIsVisiblePopup(true);
          setMessageRequest(message);
          setStateRequest(isSupport ? 'pending' : 'success');
          if (isEditSelfie) {
            dispatch(getUserMetaData());
          }
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

          setIsVisiblePopup(true);
          setStateRequest('failure');
          setMessageRequest(
            response?.message || response?.data?.message || 'Xảy ra lỗi, vui lòng thử lại',
          );
        }
        setIsLoading(false);
      }),
    );
  }, [
    selfieUrl,
    bankNumber,
    data?.bank_data?.bankName,
    data?.bank_data?.branchName,
    isSupport,
    dispatch,
    note,
    isEditSelfie,
  ]);

  const onConfirmAddBank = useCallback(() => {
    setIsShowModalConfirm(false);
    onSubmitAddBanking();
  }, [onSubmitAddBanking]);

  const onGoBack = useCallback(() => {
    setIsVisiblePopup(false);
    navigation.goBack();
  }, [navigation]);

  const onPressSample = useCallback(() => {
    setIsVisibleSample(!isVisibleSample);
  }, [isVisibleSample]);

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

  const onPressSupport = useCallback(() => {
    setIsSupport(!isSupport);
  }, [isSupport]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getUserBIDVData((isSuccess, result) => {
        if (isSuccess) {
          setData(result);
        }
        setIsLoading(false);
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (userMetaData?.selfiePhoto) {
      setSelfieUrl(userMetaData?.selfiePhoto);
      setIsEditSelfie(false);
    }
  }, [userMetaData?.selfiePhoto]);

  return (
    <>
      <ScrollView style={styles.container}>
        <AppText semiBold style={[styles.text, { marginTop: 16 }]}>
          Thông tin ngân hàng liên kết
        </AppText>
        <View style={styles.box}>
          <Image
            source={{
              uri: data?.image,
            }}
            style={styles.image}
          />
          {renderTitle({ title: 'Chủ tài khoản:', desc: data?.fullName })}
          {renderTitle({
            title: 'Ngân hàng:',
            desc: data?.bank_name,
          })}
          {renderTitle({ title: 'Chi nhánh:', desc: data?.bank_branch })}
        </View>
        <AppText semiBold style={[styles.text, { marginTop: 24 }]}>
          Số tài khoản ngân hàng
        </AppText>
        <View style={[styles.box, { paddingTop: 16, paddingBottom: 14 }]}>
          <TextField
            label={
              <AppText style={{ fontSize: 14, lineHeight: 20 }}>
                Nhập số tài khoản
                <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>*</AppText>
              </AppText>
            }
            tintColor={Colors.gray5}
            baseColor={Colors.gray1}
            textColor={Colors.gray1}
            lineWidth={0}
            activeLineWidth={0}
            disabledLineWidth={0}
            labelFontSize={16}
            inputContainerStyle={{ borderBottomWidth: 1, borderBottomColor: Colors.gray4 }}
            contentInset={{ top: 0, input: 1 }}
            keyboardType={'numeric'}
            value={bankNumber}
            onChangeText={setBankNumber}
          />
        </View>
        {isEditSelfie && (
          <View key="importSelfieContainer" style={styles.importSelfieContainer}>
            <View style={styles.raw}>
              <AppText semiBold style={styles.text}>
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
              <AppText
                semiBold
                style={[styles.indicatorWaring, { color: Colors.sixOrange, lineHeight: 19 }]}
              >
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
                    onChangeText={onChangeNote}
                  />
                </View>
              </View>
            )}
          </View>
        )}
        <ButtonText
          medium
          title={'Thêm tài khoản'}
          titleStyle={{ fontSize: 16 }}
          top={24}
          bottom={24}
          height={48}
          disabled={disabled}
          buttonColor={disabled ? Colors.neutral3 : Colors.primary2}
          titleColor={disabled ? Colors.gray5 : Colors.primary5}
          onPress={onShowModalConfirm}
        />
      </ScrollView>
      <PopupPreviewAddBank
        data={{
          bankNumber,
          bankName: data?.bank_name,
          bankBranchName: data?.bank_branch,
        }}
        isVisible={isShowModalConfirm}
        onClose={onCloseModalConfirm}
        onPressSubmit={onConfirmAddBank}
      />
      <PopupStateRequest
        state={stateRequest}
        message={messageRequest}
        isVisible={isVisiblePopUp}
        onGoBack={onGoBack}
      />
      <CommonPopup isVisible={showPopupConfirmInfor}>
        <View style={{ backgroundColor: Colors.primary5, borderRadius: 16 }}>
          <View style={{ alignItems: 'center', paddingTop: 16 }}>
            <Image
              source={ICON_PATH.iconBell}
              style={{ width: 48, height: 48, resizeMode: 'contain', marginBottom: 12 }}
            />
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.secondRed }}>
              Không thể xác minh thông tin
            </AppText>
          </View>
          <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.primary4 }}>
              {errorMessageShinhan}
            </AppText>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: Colors.neutral6,
              borderBottomRightRadius: 16,
              borderBottomLeftRadius: 16,
              // marginTop: (23),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() => setShowPopupConfirmInfor(false)}
            >
              <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray2 }}>
                Kiểm tra lại
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </CommonPopup>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loading}>
            <ViewStatus status={STATUS_ENUM.LOADING} />
          </View>
        </View>
      ) : null}
      <SamplePhotoPreview
        key="SamplePhotoPreview"
        isVisible={isVisibleSample}
        typeSample="SELFIE"
        onCloseAvatarSamplePress={onPressSample}
      />
    </>
  );
};

export default withCameraPicker(AddBankAccountBIDV);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  box: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    padding: 16,
    paddingTop: 12,
    marginTop: 8,
  },
  image: {
    width: 88,
    height: 43,
    alignSelf: 'center',
    marginBottom: 4,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 120,
    backgroundColor: '#0a0a0a66',
    borderRadius: 16,
  },
  imgSelfie: {
    width: '100%',
    aspectRatio: 1,
  },
  importSelfieContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  indicatorWaring: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.gray5,
    marginTop: 8,
  },
  txtSample: {
    fontSize: 14,
    letterSpacing: 0,
    color: Colors.primary2,
    marginTop: 2,
    marginBottom: 10,
  },
  raw: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtNote: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
    marginRight: 4,
  },
  icDeleteWrapper: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  note: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: Colors.primary5,
    borderWidth: 1,
    borderColor: Colors.neutral4,
    height: 65,
    textAlignVertical: 'top',
    padding: 12,
  },
  imgUrlSelfie: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  boxErrorContainer: {
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    backgroundColor: '#ffe1e5',
  },
  headerBoxError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtTitle: {
    opacity: 0.6,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  txtStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.accent3,
    marginLeft: 4,
  },
  desc: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.accent3,
    paddingVertical: 4,
  },
});
