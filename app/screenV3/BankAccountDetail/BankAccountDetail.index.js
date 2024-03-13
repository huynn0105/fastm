import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// component
import ItemBox from '../../componentV3/BoxCitizenIdentify/ItemBox';
import SecondaryButton from '../../componentV3/Button/SecondaryButton';

// selector
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';

import AppText from '../../componentV3/AppText';

import styles from './BankAccountDetail.styles';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { useActions } from '../../hooks/useActions';
import {
  deleteBank,
  dispatchCancelMomoWallet,
  setDefaultBank,
} from '../../redux/actions/actionsV3/banking';
import { updateUserMetaStep } from '../../redux/actions/actionsV3/userMetaData';
import CommonPopup from '../../componentV3/CommonPopup';
import { ICON_PATH } from '../../assets/path';
import DashedHorizontal from '../../componentV3/DashedHorizontal/DashedHorizontal';
import ButtonText from '../../common/ButtonText';
import CheckBoxSquare from '../../componentV3/CheckBoxSquare';
import { useDispatch } from 'react-redux';
import Loading from '../../componentV3/LoadingModal';

const BankAccountDetail = ({ navigation }) => {
  const dispatch = useDispatch();

  const [bankInfor, setBankInfor] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const actions = useActions({
    dispatchCancelMomoWallet,
    updateUserMetaStep,
  });

  const isMultiBank = useMemo(() => navigation.getParam('isMultiBank'), []);

  const isDefaultBank = useMemo(() => {
    return bankInfor?.default === '1';
  }, [bankInfor?.default]);

  useEffect(() => {
    const data = navigation.getParam('bankInfor');
    setBankInfor(data);
  }, [navigation]);

  const onPressGoback = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const updateMetaData = () => {
    const payload = {
      momo_wallet: '0',
    };
    actions.updateUserMetaStep(payload);
  };

  const onPressCancelMomo = () => {
    hidePopupDelete();
    actions.dispatchCancelMomoWallet((response) => {
      if (response.status) {
        updateMetaData();
        Alert.alert('Thông báo', response?.message, [
          { text: 'Đóng', onPress: () => navigation.goBack() },
        ]);
      }
    });
  };

  const onSetDefaultBank = useCallback(() => {
    if (isDefaultBank) return;
    setIsLoading(true);

    dispatch(
      setDefaultBank(bankInfor?.banking_id, (isSuccess) => {
        setIsLoading(false);
        if (isSuccess) {
          setBankInfor((prevState) => {
            return {
              ...prevState,
              default: '1',
            };
          });
        }
      }),
    );
  }, [bankInfor?.banking_id, dispatch, isDefaultBank]);

  const onDeleteBank = useCallback(() => {
    hidePopupDelete();
    setTimeout(() => {
      setIsLoading(true);
      dispatch(
        deleteBank(bankInfor?.banking_id, (isSuccess) => {
          setIsLoading(false);
          if (isSuccess) {
            navigation.goBack();
          }
        }),
      );
    }, 600);
  }, [bankInfor?.banking_id, dispatch, navigation]);

  const renderPopupDelete = () => {
    return (
      <View style={_styles.containerPopup}>
        <View style={{ alignItems: 'center', paddingHorizontal: SW(16) }}>
          <Image source={ICON_PATH.iconBell} style={_styles.bellIconStyle} />
          <View style={{ paddingTop: SH(16), paddingBottom: SH(12) }}>
            <AppText semiBold style={_styles.titleCancel}>
              Xác nhận hủy liên kết tài khoản: {bankInfor?.bank_name} - {bankInfor?.bank_fullName} -
              {bankInfor?.bank_accountNumber}
            </AppText>
          </View>
          <View style={{ paddingBottom: SH(20) }}>
            <AppText style={_styles.contentText}>
              Sau khi hủy liên kết, thông tin về tài khoản này sẽ được xóa khỏi MFast và không thể
              khôi phục.
            </AppText>
          </View>
        </View>
        <View style={_styles.footer}>
          <View style={_styles.button}>
            <TouchableOpacity onPress={onDeleteBank}>
              <AppText medium style={[_styles.contentText, { color: Colors.sixRed }]}>
                Hủy liên kết
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={_styles.button}>
            <TouchableOpacity onPress={hidePopupDelete}>
              <AppText semiBold style={[_styles.contentText, { color: Colors.primary2 }]}>
                Quay lại
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const showPopupDelete = () => {
    setShowDeletePopup(true);
  };

  const hidePopupDelete = () => {
    setShowDeletePopup(false);
  };

  return (
    <ScrollView style={styles.wrapper} scrollIndicatorInsets={{ right: 0.5 }}>
      <View style={styles.wrapper}>
        <View style={styles.wapperBox}>
          <View style={styles.expendContainer}>
            <ItemBox label="Họ và tên:" content={userMetaData?.countryIdName} />
            <ItemBox label="Số CMND/CCCD:" content={userMetaData?.countryIdNumber} />
            <DashedHorizontal style={{ position: 'relative', marginBottom: 8, marginTop: 12 }} />
            <View style={{ flexDirection: 'row' }}>
              <ItemBox label="Loại tài khoản:" content={bankInfor?.bank_name} vertical />
              <ItemBox
                label="Số tài khoản ngân hàng:"
                content={bankInfor?.isMomo ? bankInfor?.mobilePhone : bankInfor?.bank_accountNumber}
                vertical
              />
            </View>
            <DashedHorizontal style={{ position: 'relative', marginBottom: 8, marginTop: 12 }} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 4,
                paddingBottom: 16,
              }}
            >
              <AppText style={styles.labelStatus}>Trạng thái:</AppText>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {bankInfor?.status === 'success' ? (
                  <Image
                    source={ICON_PATH.tick2}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: styles.successDesc.color,
                      marginRight: 4,
                    }}
                  />
                ) : null}
                <AppText
                  semiBold
                  style={[
                    styles.status,
                    bankInfor?.status === 'success'
                      ? styles.successDesc
                      : bankInfor?.status === 'failure'
                      ? styles.failureTxt
                      : bankInfor?.status === 'pending'
                      ? styles.penddingTxt
                      : styles.status,
                  ]}
                >{`${bankInfor?.isMomo ? 'Liên kết thành công' : bankInfor?.status_text}`}</AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
      <CheckBoxSquare
        disabled={!isMultiBank || bankInfor?.status !== 'success'}
        style={{ marginHorizontal: 16 }}
        isTextSmall
        label={'Đặt làm tài khoản ưu tiên rút tiền'}
        textColor={isMultiBank || bankInfor?.status === 'success' ? Colors.gray1 : Colors.neutral3}
        isSelected={isDefaultBank}
        onChangeValue={onSetDefaultBank}
        value={isDefaultBank}
      />

      <View style={styles.btnWrapper}>
        <ButtonText
          style={{ paddingHorizontal: 32 }}
          height={50}
          medium
          fontSize={16}
          lineHeight={24}
          title="Quay lại"
          onPress={onPressGoback}
        />
      </View>

      {isMultiBank ? (
        <TouchableOpacity
          onPress={showPopupDelete}
          style={{ justifyContent: 'center', alignItems: 'center', marginTop: SH(20) }}
        >
          <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.sixRed }}>
            Hủy liên kết tài khoản
          </AppText>
        </TouchableOpacity>
      ) : null}
      <CommonPopup isVisible={showDeletePopup}>{renderPopupDelete()}</CommonPopup>
      <Loading visible={isLoading} />
    </ScrollView>
  );
};

const _styles = StyleSheet.create({
  containerPopup: {
    backgroundColor: Colors.primary5,
    paddingTop: SH(16),

    borderRadius: 16,
  },
  bellIconStyle: {
    width: SW(56),
    height: SH(56),
    resizeMode: 'contain',
    tintColor: Colors.blue3,
  },
  titleCancel: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.blue3,
    textAlign: 'center',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#d6e5ff',
    height: SH(50),
    overflow: 'hidden',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BankAccountDetail;
