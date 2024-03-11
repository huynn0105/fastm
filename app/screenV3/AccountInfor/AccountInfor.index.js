import React, { useCallback, useState, useEffect, useRef } from 'react';
import { SectionList, View, ScrollView, TouchableWithoutFeedback } from 'react-native';

// components
import IndicatorBoxVerify from './comp/IndicatorBoxVerify';
import HeaderSectionUserInfor from './comp/HeaderSectionUserInfor';
import BoxInformationUser from './comp/BoxInformationUser';
import AppText from '../../componentV3/AppText';
// redux
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
// actions
import { useActions } from '../../hooks/useActions';
import { updateProfile, logout } from '../../redux/actions/user';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';
import { getArenaInfor } from '../../redux/actions/actionsV3/arenaInfor';

// constants
import { SECTION_DATA, KEY_ACTION } from './AccountInfor.contants';

import styles from './AccountInfor.style';
import Colors from '../../theme/Color';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomActionSheet from '../../components2/BottomActionSheet';
import PopupChangeInfor from './comp/PopupChangeInfor';
import { SCREEN_MODE } from '../../screens2/ChatFeedback';
import ModalDeleteAccount from '../../componentV3/ModalDeleteAccount/ModalDeleteAccount';
import { deleteAccount } from '../../redux/actions/actionsV3/userConfigs';
import {
  openAccountAdvancedUpdate,
  openAccountIdentification,
} from '../../redux/actions/actionsV3/navigationAction';

const AccountInfor = ({ navigation }) => {
  // state

  // stores
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const myUser = useSelectorShallow(getMyuserSelector);
  const appInfo = useSelector((state) => state.appInfo);
  const actionSheetRef = useRef(null);
  const modalDeleteAccountRef = useRef(null);

  // actions
  const actions = useActions({
    updateProfile,
    getUserMetaData,
    dispatchGetArenaInfor: getArenaInfor,
    logout,
  });

  useEffect(() => {
    actions.getUserMetaData();
    // actions.dispatchGetArenaInfor();
  }, [actions]);

  const onPressEdit = useCallback(
    (id) => {
      switch (id) {
        case KEY_ACTION.basic:
          navigation.navigate('AccountBasicUpdateScreen');
          break;
        case KEY_ACTION.advanced: {
          actionSheetRef.current.open();
          break;
        }

        default:
          break;
      }
      //
    },
    [navigation],
  );

  const pressUpdatePhoneNumber = () => {
    actionSheetRef.current.close();
    dispatch(openAccountAdvancedUpdate(navigation.navigate));
  };

  const pressUpdateId = () => {
    actionSheetRef.current.close();

    navigation.navigate('ChatFeedback', {
      screenMode: SCREEN_MODE.START,
      selectedTopic: {
        children: [],
        description:
          '- Giải đáp kiến thức sử dụng MFast\\n- Báo lỗi phần mềm\\n- Góp ý, yêu cầu chức năng mới',
        status: 2,
        topic_id: '31',
        topic_name: 'Hỗ trợ sử dụng MFast',
      },
      selectedFeedbackDetails: 'Giải đáp kiến thức sử dụng MFast',
      messageDefault: `Tôi muốn thay đổi số CMND/CCCD: ${
        userMetaData?.countryIdNumber || ''
      } đã định danh`,
    });
  };

  const keyExtractor = useCallback((item) => item?.id, []);

  const renderItem = useCallback(
    ({ item, index, section }) => {
      return (
        <BoxInformationUser style={styles.boxContainer} listData={item} myUser={userMetaData} />
      );
    },
    [userMetaData],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => {
      return (
        <HeaderSectionUserInfor id={section?.id} label={section?.label} onPressEdit={onPressEdit} />
      );
    },
    [onPressEdit],
  );

  const usePressIdentification = useCallback(() => {
    dispatch(openAccountIdentification(navigation.replace));
  }, [dispatch, navigation]);

  const openTermAndPrivacyView = () => {
    const title = 'Điều khoản sử dụng';
    const url = appInfo.termsOfUsageUrl;
    navigation.navigate('WebView', { mode: 0, title, url });
  };

  const dispatch = useDispatch();

  const onConfirmedDelete = useCallback(() => {
    dispatch(
      deleteAccount((isSuccess, message) => {
        if (isSuccess) {
          dispatch(logout(false));
        } else {
          Alert.alert('Lỗi', message);
        }
      }),
    );
  }, [dispatch]);

  const onBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {userMetaData?.isCTVConfirmed ? (
          <SectionList
            sections={SECTION_DATA}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={renderSectionHeader}
            showsVerticalScrollIndicator={false}
            // ListFooterComponent={renderFooter}
          />
        ) : (
          <View style={styles.indicatorBoxVerify}>
            <IndicatorBoxVerify onPress={usePressIdentification} />
          </View>
        )}
        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: 16,
          }}
        >
          <AppText style={{ fontSize: 13, lineHeight: 19, color: Colors.gray2 }}>
            Tài khoản MFast sẽ tự động hủy, số dư tiền và các thông tin đi kèm cũng sẽ huỷ theo{' '}
            <AppText semiBold style={{ fontSize: 13, lineHeight: 19, color: Colors.secondRed }}>
              {`khi không sử dụng trong ${userMetaData?.isCTVConfirmed ? '6' : '3'} tháng`}
            </AppText>
            <AppText style={{ fontSize: 13, lineHeight: 19 }}>. Chi tiết tại </AppText>
            <AppText
              semiBold
              style={{ fontSize: 13, lineHeight: 19, color: Colors.primary2 }}
              onPress={openTermAndPrivacyView}
            >
              điều khoản sử dụng.
            </AppText>
          </AppText>
        </View>
        <TouchableWithoutFeedback onPress={onBack}>
          <View style={styles.buttonBack}>
            <AppText medium style={styles.buttonTextBack}>
              Quay lại
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <BottomActionSheet
        ref={(ref) => {
          actionSheetRef.current = ref;
        }}
        headerText={'Thông tin cần thay đổi'}
        render={() => {
          return (
            <PopupChangeInfor
              navigation={navigation}
              phoneNumber={myUser?.mPhoneNumber}
              CMND={userMetaData?.countryIdNumber}
              pressUpdatePhoneNumber={pressUpdatePhoneNumber}
              pressUpdateId={pressUpdateId}
            />
          );
        }}
        canClose={true}
      ></BottomActionSheet>
      <ModalDeleteAccount
        ref={modalDeleteAccountRef}
        navigation={navigation}
        onConfirmedDelete={onConfirmedDelete}
      />
    </View>
  );
};

export default AccountInfor;
