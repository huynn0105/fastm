import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import CustomTextField from '../../../componentV3/CustomTextField';
import WrapperCustomTextField from '../../../componentV3/WrapperCustomTextField';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import {
  getListBankBranchesSelector,
  getListBanksSelector,
} from '../../../redux/selectors/bankingSelectors';
import PickerSelector from '../../../componentV3/PickerSelector';
import Loading from '../../../componentV3/LoadingModal';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  dispatchAddMyBanking,
  dispatchGetListBankBranches,
  dispatchGetListBanks,
} from '../../../redux/actions/actionsV3/banking';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonText from '../../../common/ButtonText';
import PopupPreviewAddBank from '../../../componentV3/PopupPreviewAddBank';
import {
  checkAndRequestPermission,
  PERMISSION_CHECK,
  PERMISSION_REQUEST_MESSAGE,
} from '../../../utils/permissionV3';
import { checkAndRequestPermissionLocation } from '../../../utils/LocationUtil';
import PopupStateRequest from '../../../componentV3/PopupStateRequest';
import ViewStatus from '../../../common/ViewStatus';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import ReferralOpenBank from '../../BankAccount/ReferralOpenBank/ReferralOpenBank';

const BankingAccount = memo((props) => {
  const { selfieUrl, onHandlerNextStep, isBanking, openBank, fullName } = props;

  const dispatch = useDispatch();

  const accountNumberRef = useRef(null);
  const bankRef = useRef(null);
  const bankBranchRef = useRef(null);

  const listBanks = useSelectorShallow(getListBanksSelector);
  const listBankBranches = useSelectorShallow(getListBankBranchesSelector);

  const [bank, setBank] = useState(null);
  const [bankBranch, setBankBranch] = useState(null);
  const [bankNumber, setBankNumber] = useState('');
  const [dataPicker, setDataPicker] = useState([]);

  const [titlePopup, setTitlePopup] = useState(false);
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);
  const [isVisibleAddBank, setIsVisibleAddBank] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [stateRequest, setStateRequest] = useState(null);
  const [isVisiblePopUp, setIsVisiblePopup] = useState(false);
  const [messageRequest, setMessageRequest] = useState('');

  const disableAddBank = useMemo(() => {
    if (!bankNumber || !bankBranch?.value || !bank?.value) return true;
    return false;
  }, [bank?.value, bankBranch?.value, bankNumber]);

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

  const onClosePopupAddBank = useCallback(() => {
    setIsVisibleAddBank(false);
  }, []);

  const onCheckSubmit = useCallback(() => {
    setIsVisibleAddBank(true);
  }, []);

  const onSubmitAddBanking = useCallback(
    (location) => {
      if (!disableAddBank) {
        const payload = {
          selfie_path: selfieUrl,
          bank_accountNumber: bankNumber,
          bank_name: bank?.value,
          bank_branch: bankBranch?.value,
          correct: 0,
        };
        setIsLoading(true);
        dispatch(
          dispatchAddMyBanking(payload, (response) => {
            setIsLoading(false);
            if (response.status) {
              onHandlerNextStep();
            } else {
              setTimeout(() => {
                setIsVisiblePopup(true);
                setStateRequest('failure');
                setMessageRequest(
                  response?.message || response?.data?.message || 'Xảy ra lỗi, vui lòng thử lại',
                );
              }, 500);
            }
          }),
        );
      }
    },
    [
      disableAddBank,
      selfieUrl,
      bankNumber,
      bank?.value,
      bankBranch?.value,
      dispatch,
      onHandlerNextStep,
    ],
  );

  const onCheckLocation = useCallback(async () => {
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
  }, [onSubmitAddBanking]);

  const onGoBack = useCallback(() => {
    setIsVisiblePopup(false);
  }, []);

  useEffect(() => {
    if (isEmpty(listBanks)) {
      dispatch(dispatchGetListBanks());
    }
    if (isEmpty(listBankBranches)) {
      dispatch(dispatchGetListBankBranches());
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']} key={'3'}>
      {isBanking ? (
        <>
          <AppText style={styles.text}>Thông tin ngân hàng liên kết</AppText>
          <ViewStatus
            status={'SUCCESS'}
            style={{ marginTop: 12 }}
            title={`Bạn đã thêm tài khoản ngân hàng`}
          />
        </>
      ) : (
        <>
          <KeyboardAwareScrollView>
            <AppText style={styles.text}>Thông tin ngân hàng liên kết</AppText>
            <View style={styles.formContainer}>
              <View style={{ marginTop: 8, flexDirection: 'row' }}>
                <AppText style={{ fontSize: 14, lineHeight: 20, flex: 33 }}>Chủ tài khoản:</AppText>
                <AppText
                  semiBold
                  style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1, flex: 67 }}
                >
                  {fullName}
                </AppText>
              </View>
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
                containerStyle={{ marginBottom: 10, marginTop: 16 }}
                onChangeTextFieldText={setBankNumber}
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
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <AppText
                style={{ fontSize: 13, lineHeight: 18, color: Colors.sixRed, marginRight: 8 }}
                bold
              >
                Lưu ý:
              </AppText>
              <AppText style={{ fontSize: 13, lineHeight: 18, color: Colors.gray1, flex: 1 }}>
                Thông tin chủ tài khoản ngân hàng{' '}
                <AppText style={{ fontSize: 13, lineHeight: 18, color: Colors.sixRed }} bold>
                  phải khớp
                </AppText>{' '}
                với thông tin cá nhân định danh trên MFast
              </AppText>
            </View>
            <ButtonText
              medium
              title={'Thêm tài khoản ngân hàng'}
              titleStyle={{ fontSize: 16 }}
              top={16}
              height={48}
              disabled={disableAddBank}
              buttonColor={disableAddBank ? Colors.neutral3 : Colors.primary2}
              titleColor={disableAddBank ? Colors.gray5 : Colors.primary5}
              onPress={onCheckSubmit}
            />
            {openBank?.url ? (
              <View style={{ marginTop: 24 }}>
                <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: Colors.gray5 }}>
                  Ưu đãi dành riêng cho bạn
                </AppText>
                <ReferralOpenBank data={openBank} />
              </View>
            ) : null}
          </KeyboardAwareScrollView>
          <PickerSelector
            title={titlePopup || ' '}
            data={dataPicker}
            onPressItem={onPressItem}
            onCloseModal={onClosePicker}
            isVisible={isVisiblePicker}
          />
        </>
      )}

      <Loading visible={isLoading || isLoadingLocation} />
      <PopupPreviewAddBank
        data={{
          bankNumber,
          bankName: bank?.value,
          bankBranchName: bankBranch?.value,
        }}
        isVisible={isVisibleAddBank}
        onClose={onClosePopupAddBank}
        onPressSubmit={onCheckLocation}
      />
      <PopupStateRequest
        state={stateRequest}
        message={messageRequest}
        isVisible={isVisiblePopUp}
        onGoBack={onGoBack}
      />
    </SafeAreaView>
  );
});

export default BankingAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
    paddingBottom: 8,
    width: SCREEN_WIDTH,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  formContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
});
