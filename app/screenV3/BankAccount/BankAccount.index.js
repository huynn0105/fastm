import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import AppText from '../../componentV3/AppText';
import CommonPopup from '../../componentV3/CommonPopup';
import { Configs, fonts } from '../../constants/configs';
import { useActions } from '../../hooks/useActions';
import useOnPress from '../../hooks/useOnPress';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import {
  dispatchAddMomoWallet,
  dispatchGetListMyBank,
  getBIDVData,
} from '../../redux/actions/actionsV3/banking';
import { getInsuranceCertPath } from '../../redux/actions/actionsV3/tax';
import { getUserMetaData, updateUserMetaStep } from '../../redux/actions/actionsV3/userMetaData';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';
import { getListMyBankingSelector } from '../../redux/selectors/bankingSelectors';
import { getLoadingGetUMeta } from '../../redux/selectors/commonLoadingSelector';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { TAB_BANK_ACCOUNT, TAB_BANK_ACCOUNT_WITH_CERT } from './BankAccount.contant';

import styles from './BankAccount.style';
import PopupAddMomo from './comp/PopupAddMomo';
import Law from './Law/Law.index';
import Cert from './Cert/Cert.index';
// components
import ListBankAccount from './ListBankAccount/ListBankAccount.index';
import Tax from './Tax/Tax.index';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { result } from 'lodash';

export const STATUS_ADD_MOMO = {
  START: 'START',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const DEFAULT_STATUS_CERT = {
  path: '',
  status: true,
  status_ins: '',
};

const BankAccount = ({ navigation }) => {
  let initTab = navigation?.state?.params?.params?.initKey;
  if (initTab) {
    initTab = parseInt(initTab, 10);
  }

  const disabledLawTab = useSelectorShallow((state) => state.appInfo?.disabledLawTab);

  const [index, setIndex] = useState(initTab || 0);
  const [routes, setRoutes] = useState(
    disabledLawTab
      ? TAB_BANK_ACCOUNT_WITH_CERT?.filter((item) => item?.key !== 'law')
      : TAB_BANK_ACCOUNT_WITH_CERT,
  );
  const [inforCert, setInforCert] = useState(DEFAULT_STATUS_CERT);
  const [isAvaliableBank, setIsAvaliableBank] = useState(false);

  const listMyBanking = useSelectorShallow(getListMyBankingSelector);
  const appInfor = useSelectorShallow(getAppInforSelector);
  const userMetaRx = useSelectorShallow(getUserMetaDataSelector);
  const bidvData = useSelectorShallow((state) => state?.banking?.bidvData);

  const [userMeta, setUserMeTa] = useState(userMetaRx);

  const isLoadingGetUMeta = useSelectorShallow(getLoadingGetUMeta);
  const myUser = useSelectorShallow(getMyuserSelector);

  const actions = useActions({
    dispatchGetListMyBank,
    getUserMetaData,
    dispatchAddMomoWallet,
    updateUserMetaStep,
    getInsuranceCertPath,
    getBIDVData,
  });

  useEffect(() => {
    if (!myUser?.enableInsurance) {
      setRoutes(
        disabledLawTab ? TAB_BANK_ACCOUNT?.filter((item) => item?.key !== 'law') : TAB_BANK_ACCOUNT,
      );
    }
    if (listMyBanking) {
      const isAvaliable = listMyBanking.some((bank) => bank.status === 'success');
      setIsAvaliableBank(isAvaliable);
    }
  }, [listMyBanking, myUser]);

  useEffect(() => {
    actions.getBIDVData();
    actions.dispatchGetListMyBank();
    actions.getUserMetaData((data) => {
      setUserMeTa(data);
    });
    actions.getInsuranceCertPath((path) => {
      setInforCert(path);
    });
  }, [actions]);

  const onPressAddBank = useCallback(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useOnPress({ action: 'AddBankAccountScreen' });
  }, []);

  const onPressWallet = useCallback(() => {
    const { casa } = appInfor;
    if (casa.url) {
      navigation.navigate('WalletScreen', { mode: 0, url: casa.url });
    }
  }, [appInfor, navigation]);

  const onPressRegulationTax = useCallback(() => {
    if (appInfor?.regulationTaxUrl) {
      navigation.navigate('WebView', {
        mode: 0,
        url: appInfor?.regulationTaxUrl,
        title: 'Quy định khấu trừ thuế TNCN',
      });
    }
  }, [appInfor?.regulationTaxUrl, navigation]);

  const onPressGuideWithdrawMoney = useCallback(() => {
    if (appInfor?.guideWithdrawMoneyUrl) {
      navigation.navigate('WebView', {
        mode: 0,
        url: appInfor?.guideWithdrawMoneyUrl,
        title: 'Cách rút tiền từ ví tích lũy',
      });
    }
  }, [appInfor?.guideWithdrawMoneyUrl, navigation]);

  const onRefreshListBank = useCallback(() => {
    actions.dispatchGetListMyBank();
  }, [actions]);

  const isMultiBank = useMemo(() => {
    return listMyBanking?.filter((item) => !item?.disabled)?.length > 1;
  }, [listMyBanking]);

  const onPressItemBank = useCallback(
    (bankInfor) => {
      if (bankInfor?.status === 'failed') {
        navigation.navigate('AddBankAccountScreen', { bankInfor });
      } else {
        navigation.navigate('BankAccountDetailScreen', { bankInfor, isMultiBank });
      }
    },
    [isMultiBank, navigation],
  );

  const onNavToRegisterTaxtNumber = useCallback(() => {
    navigation.navigate('RegisterTaxNumberScreen');
  }, [navigation]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route?.key) {
      case 'law':
        return (
          <Law
            jumpTo={jumpTo}
            email={userMeta?.email}
            taxCommittedPhoto={userMeta?.taxCommittedPhoto}
            taxNumber={userMeta?.tax_number}
            countryIdNumber={userMeta?.countryIdNumber}
            taxCommittedPhotoStatus={userMeta?.taxCommittedPhotoStatus}
            taxRegisterMessage={userMeta?.taxRegisterMessage}
            taxRegisterStatus={userMeta?.taxRegisterStatus}
            navigation={navigation}
            onPressRegulationTax={onPressRegulationTax}
            taxCommittedPhotoMessage={userMeta?.taxCommittedPhotoMessage}
            statusApplyTaxNumber={userMeta?.is_review_tax_number}
          />
        );
      case 'tax':
        return (
          <Tax
            taxNumber={userMeta?.tax_number}
            taxRegisterMessage={userMeta?.taxRegisterMessage}
            taxRegisterStatus={userMeta?.taxRegisterStatus}
            countryIdNumber={userMeta?.countryIdNumber}
            isLoadingGetUMeta={isLoadingGetUMeta}
            onPressRegulationTax={onPressRegulationTax}
            onNavToRegisterTaxtNumber={onNavToRegisterTaxtNumber}
            statusApplyTaxNumber={userMeta?.is_review_tax_number}
          />
        );
      case 'bank':
        const momoWallet = {
          mobilePhone: userMeta?.mobilePhone,
          isMomo: true,
          status: 'success',
        };

        return (
          <ListBankAccount
            onPressAddBank={onPressAddBank}
            listBank={listMyBanking}
            onRefreshListBank={onRefreshListBank}
            onPressWallet={onPressWallet}
            onPressItemBank={onPressItemBank}
            navigation={navigation}
            momoWallet={userMeta?.momo_wallet === '1' ? momoWallet : {}}
            mobilePhone={userMeta?.mobilePhone}
            openBank={bidvData}
            onPressGuideWithdrawMoney={onPressGuideWithdrawMoney}
          />
        );
      case 'cert': {
        return (
          <Cert
            jumpTo={jumpTo}
            email={userMeta?.email}
            taxCommittedPhoto={userMeta?.taxCommittedPhoto}
            taxNumber={userMeta?.tax_number}
            countryIdNumber={userMeta?.countryIdNumber}
            taxCommittedPhotoStatus={userMeta?.taxCommittedPhotoStatus}
            taxRegisterMessage={userMeta?.taxRegisterMessage}
            taxRegisterStatus={userMeta?.taxRegisterStatus}
            navigation={navigation}
            onPressRegulationTax={onPressRegulationTax}
            taxCommittedPhotoMessage={userMeta?.taxCommittedPhotoMessage}
            statusApplyTaxNumber={userMeta?.is_review_tax_number}
            inforCert={inforCert}
          />
        );
      }
      default:
        return <View />;
    }
  };

  const renderTabBar = useCallback(
    (props) => (
      <TabBar
        {...props}
        renderIcon={({ route, focused }) => (
          <Image
            source={focused ? route?.iconFocus : route?.icon}
            style={[
              styles.icTabBar,
              !isAvaliableBank && route.key !== 'bank' && route.key !== 'tax' && { opacity: 0.2 },
            ]}
          />
        )}
        renderLabel={({ route, focused }) => (
          <AppText
            bold
            style={[
              styles.labelTabbar,
              focused ? styles.labelFocus : styles.labelBlur,
              focused ? fonts.bold : fonts.regular,
              !isAvaliableBank && route.key !== 'bank' && route.key !== 'tax' && { opacity: 0.2 },
            ]}
          >
            {route.title}
          </AppText>
        )}
        pressOpacity={!isAvaliableBank ? 1 : 0.8}
        onTabPress={({ route, preventDefault }) => {
          if ((route.key === 'law' || route?.key === 'cert') && !isAvaliableBank) {
            preventDefault();
          }
        }}
        indicatorStyle={styles.indicatorStyle}
        // style={styles.tabbarBg}
        tabStyle={styles.tabStyle}
        style={styles.contentContainerStyle}
      />
    ),
    [isAvaliableBank],
  );
  // const closePopup = () => {
  //   setStatusAddMomo(STATUS_ADD_MOMO.START);
  //   setShowPopupMomo(false);
  // };
  // const goToWallet = () => {
  //   setStatusAddMomo(STATUS_ADD_MOMO.START);
  //   setShowPopupMomo(false);
  //   const url = Configs.withdrawHistory;
  //   navigation.navigate('WebView', { mode: 0, title: 'Thu nhập tích lũy', url });
  // };
  // const openMomoAccount = () => {
  //   setStatusAddMomo(STATUS_ADD_MOMO.START);
  //   setShowPopupMomo(false);
  //   const url = Configs.momoUrl;
  //   navigation.navigate('WebView', { mode: 0, title: 'Thu nhập tích lũy', url });
  // };
  return (
    <View style={styles.wrapper}>
      <TabView
        swipeEnabled={false}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
      {/* <CommonPopup isVisible={showPopupMomo}>
        <PopupAddMomo
          status={statusAddMomo}
          // isVisible={showPopupMomo}
          closePopup={closePopup}
          phoneNumber={userMeta?.mobilePhone}
          onPressAddMomo={addMomoWallet}
          onGoToWallet={goToWallet}
          onPressOpenMomo={openMomoAccount}
          errorMessageMomo={errorMessageMomo}
        />
      </CommonPopup> */}
    </View>
  );
};

export default BankAccount;
