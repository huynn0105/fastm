import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';

// components
import MessageBox from '../comp/MessageBox';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import LoadingModal from '../../../componentV3/LoadingModal';
import AppText from '../../../componentV3/AppText';

import { useActions } from '../../../hooks/useActions';
import { dispatchGetTaxNumber, dispatchCheckTaxNumber } from '../../../redux/actions/actionsV3/tax';
import { getUserMetaData, updateUserMetaStep } from '../../../redux/actions/actionsV3/userMetaData';

import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getLoadingTaxNumber } from '../../../redux/selectors/commonLoadingSelector';

import styles from './Tax.style';
import Colors from '../../../theme/Color';

import { STATE } from './Tax.contants';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { ICON_PATH } from '../../../assets/path';
import { SH, SW } from '../../../constants/styles';
import CustomTextField from '../../../componentV3/CustomTextField';
import { DEEP_LINK_BASE_URL, fonts } from '../../../constants/configs';
import { checkAndRequestPermissionLocation } from '../../../utils/LocationUtil';
import { getUserConfigsSelector } from '../../../redux/selectors/userConfigsSelectors';

export const STATUS_APPLY_TAX = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

const Tax = ({
  isLoadingGetUMeta,
  taxNumber,
  taxRegisterStatus,
  taxRegisterMessage,
  countryIdNumber,
  onPressRegulationTax,
  onNavToRegisterTaxtNumber,
  statusApplyTaxNumber,
}) => {
  const [inputTaxNumber, setInputTaxNumber] = useState(taxNumber);
  const loading = useSelectorShallow(getLoadingTaxNumber);

  // const ctt = useSelectorShallow((state) =>
  //   state?.shopV2Items
  //     ?.find((item) => item?.cat_alias === 'tools')
  //     ?.items?.find((item) => item?.tag_name === 'CAP_CHUNG_TU_THUE'),
  // );

  const userConfigs = useSelectorShallow(getUserConfigsSelector);

  const actions = useActions({
    dispatchGetTaxNumber,
    updateUserMetaStep,
    dispatchCheckTaxNumber,
    getUserMetaData,
  });

  const onPressViewTermTax = useCallback(() => {
    if (onPressRegulationTax) {
      onPressRegulationTax();
    }
  }, [onPressRegulationTax]);

  useEffect(() => {
    // actions.dispatchGetTaxNumber();
  }, []);

  const renderMissingTaxNumber = useCallback(() => {
    return (
      <View style={{ marginTop: SH(16) }}>
        <AppText style={styles.labelInput}>Mã số thuế thu nhập cá nhân (MST) của bạn</AppText>
        <TextInput
          placeholder={'Nhập mã số thuế'}
          style={{
            height: SH(48),
            backgroundColor: Colors.neutral6,
            paddingHorizontal: SW(16),
            borderRadius: 8,
            borderWidth: 0.7,
            borderColor: Colors.gray4,
            fontFamily: fonts.regular,
            fontSize: SH(16),
            lineHeight: SH(19),
          }}
          keyboardType={'number-pad'}
          onChangeText={(text) => setInputTaxNumber(text)}
          defaultValue={inputTaxNumber}
          // editable={statusApplyTaxNumber === STATUS_APPLY_TAX.PENDING ? false : true}
        />
      </View>
    );
  }, [countryIdNumber, taxNumber, taxRegisterStatus]);

  const renderTaxNumberData = useCallback(() => {
    return (
      <View style={{ marginTop: SH(20) }}>
        <AppText style={styles.labelInput}>
          Mã số thuế Thu nhập cá nhân tương ứng với CMND/CCCD{' '}
          <AppText style={styles.cmndIdNumber}>{countryIdNumber}</AppText> là:
        </AppText>
        <View style={styles.inputCOntainer}>
          <TextInput
            style={styles.inputCode}
            keyboardType={'number-pad'}
            value={inputTaxNumber}
            onChangeText={(value) => setInputTaxNumber(value)}
          />
        </View>
      </View>
    );
  }, [countryIdNumber, inputTaxNumber]);

  const renderMessageBox = useCallback(() => {
    if (taxRegisterStatus === 'SUCCESS') {
      return <View />;
    }
    return <MessageBox state={taxRegisterStatus} message={taxRegisterMessage} />;
  }, [taxRegisterStatus, taxRegisterMessage]);

  const onPressRefresh = useCallback(async () => {
    // actions.dispatchGetTaxNumber();
    actions.getUserMetaData();
  }, [actions]);

  const onPressUpdate = () => {
    // actions.dispatchCheckTaxNumber(inputTaxNumber);
    const payload = {
      tax_number: inputTaxNumber,
      is_review_tax_number: STATUS_APPLY_TAX.PENDING,
    };
    actions.updateUserMetaStep(payload);
    // checkAndRequestPermissionLocation((location) => {
    //   console.log('212', location);
    // });
  };

  const renderRefresh = useCallback(() => {
    return (
      <TouchableOpacity onPress={onPressRefresh} disabled={isLoadingGetUMeta}>
        <View style={styles.taxtRefreshContainer}>
          {isLoadingGetUMeta ? (
            <ActivityIndicator size="large" color={Colors.primary2} />
          ) : (
            <Image source={ICON_PATH.refresh} />
          )}
          <AppText medium style={styles.txtRefersh}>
            Kiểm tra lại thông tin
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }, [onPressRefresh, isLoadingGetUMeta]);

  const renderWarning = useCallback(() => {
    if (taxNumber && (!statusApplyTaxNumber || statusApplyTaxNumber === STATUS_APPLY_TAX.SUCCESS)) {
      return null;
    }
    return (
      <View style={styles.warningWrapper}>
        <AppText style={styles.indicatorWarning}>Lưu ý:</AppText>
        <View style={styles.lineWarning}>
          <View>
            <AppText style={styles.smbol}>-</AppText>
          </View>
          <AppText style={styles.descWarning}>
            Trường hợp bạn{' '}
            <AppText bold style={styles.highlight}>
              chưa từng có MST
            </AppText>
            , vui lòng cung cấp thêm thông tin để được hỗ trợ đăng ký MST TNCN. Hoặc trực tiếp ra Cơ
            quan thuế gần nhất để được hỗ trợ.
          </AppText>
        </View>
        <View style={styles.lineWarning}>
          <View>
            <AppText style={styles.smbol}>-</AppText>
          </View>
          <AppText style={styles.descWarning}>
            Trong trường hợp bạn{' '}
            <AppText bold style={styles.highlight}>
              đã có MST trước đó theo CMND cũ
            </AppText>
            , vui lòng trực tiếp ra Cơ quan thuế để cập nhật thông tin theo CCCD mới sau đó bấm
            “Kiểm tra lại thông tin”.
          </AppText>
        </View>
      </View>
    );
  }, [taxNumber]);

  const renderButtonUpdateTax = () => {
    const isShowButtonCreate = !taxNumber;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: SH(16),
          marginBottom: SH(24),
          flex: 1,
        }}
      >
        {isShowButtonCreate ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                height: SH(48),
                borderRadius: 27,
                borderWidth: 1,
                borderColor: Colors.gray2,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: SW(8),
              }}
              onPress={onNavToRegisterTaxtNumber}
            >
              <AppText medium style={{ fontSize: SH(16), color: Colors.gray2 }}>
                Đăng ký tạo MST
              </AppText>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              height: SH(48),
              borderRadius: 27,
              marginLeft: SW(8),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: inputTaxNumber?.length > 0 ? Colors.primary2 : '#c4c7d8',
            }}
            disabled={!inputTaxNumber?.length}
            onPress={onPressUpdate}
          >
            <AppText medium style={{ fontSize: SH(16), color: Colors.primary5 }}>
              Cập nhật
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBoxMessageReviewTaxNumber = () => {
    switch (statusApplyTaxNumber) {
      case STATUS_APPLY_TAX.PENDING: {
        return (
          <View
            style={{
              backgroundColor: '#ffeee0',
              padding: SW(12),
              borderRadius: 6,
              marginTop: SH(16),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <AppText
                  style={{
                    fontSize: SH(12),
                    lineHeight: SH(14),
                    color: Colors.primary4,
                    opacity: 0.6,
                  }}
                >
                  Kết quả duyệt mã số thuế
                </AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={ICON_PATH.clock2} style={styles.iconStyle} />
                <AppText bold style={[styles.textInBoxMessage, { marginLeft: SW(4) }]}>
                  Chờ duyệt
                </AppText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: SH(11) }}>
              <AppText style={styles.textInBoxMessage}>-</AppText>
              <View style={{ marginLeft: SW(6) }}>
                <AppText style={styles.textInBoxMessage}>
                  Yêu cầu của bạn đã được ghi nhận, MFast sẽ tiến hành kiểm tra và thông báo ngay
                  khi có kết quả
                </AppText>
              </View>
            </View>
          </View>
        );
      }
      case STATUS_APPLY_TAX.FAILURE: {
        return (
          <View
            style={{
              backgroundColor: '#ffe1e5',
              padding: SW(12),
              borderRadius: 6,
              marginTop: SH(16),
              marginBottom: SH(20),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <AppText
                  style={{
                    fontSize: SH(12),
                    lineHeight: SH(14),
                    color: Colors.primary4,
                    opacity: 0.6,
                  }}
                >
                  Kết quả duyệt mã số thuế
                </AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={ICON_PATH.close3}
                  style={{
                    tintColor: Colors.accent3,
                    width: SW(14),
                    height: SH(14),
                    resizeMode: 'contain',
                  }}
                />
                <AppText
                  bold
                  style={[styles.textInBoxMessage, { color: Colors.accent3, marginLeft: SW(4) }]}
                >
                  Thất bại
                </AppText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: SH(11) }}>
              <AppText style={[styles.textInBoxMessage, { color: Colors.accent3 }]}>-</AppText>
              <View style={{ marginLeft: SW(6) }}>
                <AppText style={[styles.textInBoxMessage, { color: Colors.accent3 }]}>
                  Mã số thuế phải được đăng ký bằng số CMND của bạn mới tính là hợp lệ.
                </AppText>
              </View>
            </View>
          </View>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.wrapper}>
        {/* {!!taxRegisterStatus && renderMessageBox()} */}
        {renderBoxMessageReviewTaxNumber()}

        {!taxNumber || statusApplyTaxNumber !== STATUS_APPLY_TAX.SUCCESS
          ? renderMissingTaxNumber()
          : renderTaxNumberData()}
        {taxNumber && statusApplyTaxNumber === STATUS_APPLY_TAX.PENDING
          ? renderRefresh()
          : renderButtonUpdateTax()}
        {/* {renderRefresh()} */}
        {renderWarning()}

        <TouchableWithoutFeedback onPress={onPressViewTermTax}>
          <View style={styles.bottomBoxContainer}>
            <AppText medium style={styles.indicatorBottom}>
              Quy định khấu trừ và tạm giữ thuế Thu nhập cá nhân đối với thu nhập trên MFast
            </AppText>
            <Image source={ICON_PATH.arrow_right_green} />
          </View>
        </TouchableWithoutFeedback>

        <AppText
          medium
          style={[styles.textInBoxMessage, { color: Colors.gray5, textAlign: 'center' }]}
        >
          {`Nếu bạn cần cung cấp chứng từ thuế để xác minh thu nhập trên MFast, vui lòng bấm`}
          <AppText
            onPress={() => {
              const ctt = userConfigs.data
                ?.find((item) => item?.id === 'TRUNGTAMHOTRO')
                ?.headerData?.find((item) => item?.alias === 'tax_vouchers');

              if (ctt?.action) {
                Linking.openURL(ctt?.action);
              }
            }}
            medium
            style={[styles.textInBoxMessage, { color: Colors.primary2 }]}
          >{` tại đây >`}</AppText>
        </AppText>
      </View>
      <LoadingModal visible={loading} />
    </ScrollView>
  );
};

export default Tax;
