import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import isEmpty from 'lodash/isEmpty';

import styles from './ListBankAccount.style';

import EmptyList from '../comp/EmptyList';
import BoxAddBank from '../comp/BoxAddBank';
import BankItem from '../comp/BankItem';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import ListBankOpen from '../comp/ListBankOpen';
import MomoItem from '../comp/MomoItem';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import ReferralOpenBank from '../ReferralOpenBank/ReferralOpenBank';

const ListBankAccount = ({
  listBank,
  onPressAddBank,
  onRefreshListBank,
  onPressWallet,
  onPressItemBank,
  navigation,
  onPressAddMomo,
  momoWallet,
  mobilePhone,
  openBank,
  onPressGuideWithdrawMoney,
}) => {
  const renderAddBankBox = useCallback(() => {
    return (
      <View>
        <BoxAddBank
          onPress={onPressAddBank}
          onPressAddMomo={onPressAddMomo}
          haveBankAccount={listBank?.length}
        />
      </View>
    );
  }, [onPressAddBank]);

  const renderIndicatorHeader = useCallback(
    () => (
      <View style={styles.indicatorHeaderContainer}>
        <AppText style={styles.txtIndicatorHeader}>Tài khoản đã liên kết</AppText>
        {listBank?.length ? (
          <TouchableWithoutFeedback onPress={onPressAddBank}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText style={[styles.txtIndicatorHeader, { color: Colors.primary2 }]}>
                Thêm tài khoản
              </AppText>
              <Image
                source={ICON_PATH.add_bank2}
                style={{
                  tintColor: Colors.primary2,
                  width: 24,
                  height: 24,
                  marginLeft: 8,
                  top: -2,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    ),
    [listBank?.length],
  );

  // const renderEmptyList = useCallback(() => <EmptyList onPress={onStaticPressWallet} />, []);

  const renderItem = ({ item }) => {
    const isMomoWallet = item?.isMomo;
    return (
      <BankItem
        item={item}
        bankNumber={item?.bank_accountNumber_censor}
        bankName={item?.bank_name}
        status={item?.status}
        bankBranch={item?.bank_branch}
        message={item?.error_message}
        onPressItem={_onPressItemBank}
        isMomo={isMomoWallet}
        phoneNumber={mobilePhone}
        onPressAddBank={onPressAddBank}
        onPressAddMomo={onPressAddMomo}
        disabled={item?.disabled}
        disabledMessage={item?.disabled_message}
        icon={item?.icon}
        isDefault={item?.default === '1'}
      />
      // <AppText>{`${item.isMomo}`}</AppText>
    );
  };

  const isMultiBank = useMemo(() => {
    return listBank?.filter((item) => !item?.disabled)?.length > 1;
  }, [listBank]);

  const _onPressItemBank = (bankInfor) => {
    if (bankInfor.bank_link) {
      navigation.navigate('AddBankAccountBIDVScreen');
    } else if (bankInfor?.status === 'failed') {
      navigation.navigate('AddBankAccountScreen', { bankInfor });
    } else {
      navigation.navigate('BankAccountDetailScreen', { bankInfor, isMultiBank });
    }
  };

  const onStaticPressWallet = useCallback(() => {
    if (onPressWallet) {
      onPressWallet();
    }
  }, [onPressWallet]);

  const onRefresh = useCallback(() => {
    if (onRefreshListBank) {
      onRefreshListBank();
    }
  }, []);

  const renderFooter = useCallback(() => {
    if (!listBank?.length) return null;
    return (
      <TouchableWithoutFeedback onPress={onPressGuideWithdrawMoney}>
        <View style={styles.bottomBoxContainer}>
          <AppText medium style={styles.indicatorBottom}>
            Hướng dẫn rút tiền về TK ngân hàng liên kết
          </AppText>
          <Image source={ICON_PATH.arrow_right_green} />
        </View>
      </TouchableWithoutFeedback>
    );
  }, [listBank?.length, onPressGuideWithdrawMoney]);

  const renderList = useCallback(() => {
    return (
      <View style={{ paddingHorizontal: SW(16) }}>
        {renderIndicatorHeader()}
        <FlatList
          data={listBank}
          renderItem={renderItem}
          contentContainerStyle={{}}
          ListEmptyComponent={renderAddBankBox}
          ListFooterComponent={renderFooter}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        />
      </View>
    );
  }, [listBank]);

  const isOnlyShowOpenBank = openBank?.url?.length;

  return (
    <ScrollView style={styles.wrapper}>
      {renderList()}
      <View style={{ paddingHorizontal: SW(16), marginTop: 8 }}>
        {isOnlyShowOpenBank ? (
          <ReferralOpenBank data={openBank} isMargin={listBank.length} />
        ) : !listBank?.length ? (
          <ListBankOpen navigation={navigation} />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default ListBankAccount;
