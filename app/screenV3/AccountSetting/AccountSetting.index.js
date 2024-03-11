/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  Share,
  View,
  SectionList,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  Linking,
  Clipboard,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

// component
import UserBox from '../../componentV3/UserBox';
import LoadingModal from '../../componentV3/LoadingModal';

import SectionHeaderAccount from './comp/SectionHeaderAccount';
import MenuItemAccount from './comp/MenuItemAccount';
import MenuItemSeparator from './comp/MenuItemSeparator';

import AppText from '../../componentV3/AppText';
// style
import styles from './AccountSetting.style';

// hooks redux
import { useActions } from '../../hooks/useActions';

import { logout } from '../../redux/actions';
import { getArenaInfor } from '../../redux/actions/actionsV3/arenaInfor';
import { getUserConfigs } from '../../redux/actions/actionsV3/userConfigs';
import { setShowPopupBrand } from '../../redux/actions/popup';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';

import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
// selector
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { getUserConfigsSelector } from '../../redux/selectors/userConfigsSelectors';
import { getCommonLoadingSelector } from '../../redux/selectors/commonLoadingSelector';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { getArenaSelector } from '../../redux/selectors/arenaSelector';
import BottomActionSheet from '../../components2/BottomActionSheet';
import HomeActionSheet, { ITEM_IDS, stylesActionSheet } from '../Home/HomeActionSheet';
import { getLgoutProcessing } from '../../redux/selectors/loadingSelectors';
import useOnPress from '../../hooks/useOnPress';

import Strings from '../../constants/strings';
import {
  INIT_SECTION,
  DEFAULT_ANONYMOUS,
  DEFAULT_AUTH,
  SECTION_MENU_ACCOUNT,
  LIST_CTV_FUNCTION,
  LIST_CTV_FUNCTION_WITHOUT_RSM,
} from './AccountSetting.constant';
import { SH } from '../../constants/styles';
import Colors from '../../theme/Color';
import { ICON_PATH } from '../../assets/path';
import { DEEP_LINK_BASE_URL, MFConfigs } from '../../constants/configs';
import { openAccountIdentification } from '../../redux/actions/actionsV3/navigationAction';
import { useDispatch } from 'react-redux';

const AccountSetting = ({ navigation }) => {
  //
  const [sectionData, setSectionData] = useState(INIT_SECTION);
  const [isVerifiedAccount, setIsVerifiedAccount] = useState(false);
  const bottomSheetRef = useRef(null);
  // test
  // const [sectionData, setSectionData] = useState(INIT_SECTION.concat(SECTION_MENU_ACCOUNT));

  // stores
  const myUser = useSelectorShallow(getMyuserSelector);
  const isLoggedIn = myUser?.isLoggedIn;
  const userConfigs = useSelectorShallow(getUserConfigsSelector);
  const refreshing = useSelectorShallow(getCommonLoadingSelector);
  const isLogoutProcessing = useSelectorShallow(getLgoutProcessing);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const arenaInfor = useSelectorShallow(getArenaSelector);
  const appInfo = useSelectorShallow((state) => state.appInfo);
  const invitation = useSelectorShallow((state) => state.invitationInfo);

  //! Tạm thời ân chờ update (2.4.1)
  // useEffect(() => {
  //   actions.dispatchGetArenaInfor();
  // }, [actions]);

  useEffect(() => {
    navigation.addListener('willFocus', willFocusScreen);
  }, []);

  const willFocusScreen = () => {
    // onRefresh();
  };

  // update user configs
  useEffect(() => {
    if (userConfigs && userConfigs?.data?.length > 0) {
      setSectionData(INIT_SECTION.concat(userConfigs.data));
    } else {
      if (myUser?.accessToken) {
        setSectionData(INIT_SECTION.concat(DEFAULT_AUTH));
      } else {
        setSectionData(INIT_SECTION.concat(DEFAULT_ANONYMOUS));
      }
    }
  }, [userConfigs, myUser]);

  //

  useEffect(() => {
    if (userMetaData) {
      if (!!userMetaData?.isCTVConfirmed !== isVerifiedAccount) {
        setIsVerifiedAccount(!!userMetaData?.isCTVConfirmed);
        onRefresh();
      }
    }
  }, [isVerifiedAccount, onRefresh, userMetaData]);

  // actions
  const actions = useActions({
    logout,
    getUserConfigs,
    setShowPopupBrand,
    getUserMetaData,
    dispatchGetArenaInfor: getArenaInfor,
  });

  const onPressItem = useCallback(
    (action) => {
      if (action === 'MFAST_LOGOUT') {
        Alert.alert(
          Strings.alert_title,
          Strings.logout_confirm,
          [
            {
              text: 'Đăng xuất',
              onPress: () => {
                actions.logout(false);
              },
            },
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      } else if (action === 'MFAST_LOGOUT_ALL_DEVICES') {
        Alert.alert(
          Strings.alert_title,
          Strings.logout_of_all_devices_confirm,
          [
            {
              text: 'Đăng xuất',
              onPress: () => {
                actions.logout(true);
              },
            },
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      } else if (action === 'OPEN_POPUP_BRANDING') {
        actions.setShowPopupBrand(true);
      } else {
        useOnPress({ action });
      }
    },
    [actions],
  );

  const onPressUserBox = useCallback((isLogined) => {
    const action = isLogined ? 'AccountInforScreen' : 'LoginModal';
    useOnPress({ action });
  }, []);

  const onPressReferralCode = useCallback(async (referralCode) => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
  }, []);

  const dispatch = useDispatch();
  const onPressReferralDisabledCode = useCallback(() => {
    dispatch(openAccountIdentification(navigation.navigate));
  }, [dispatch, navigation.navigate]);

  const keyExtractor = useCallback((item, index) => item?.id || index, []);

  const renderItem = useCallback(
    ({ item, index, section }) => {
      return (
        <MenuItemAccount
          disabled={!!item?.disabled}
          label={item?.label}
          iconUrl={item?.icon}
          action={item?.action}
          onPress={onPressItem}
          isPaddingTop={index === 0}
          hideNextIcon={!!item?.hideNextIcon}
          rightLabel={item?.rightLabel}
          rightLabelObject={item?.rightLabelObject}
          isPaddingBottom={index + 1 === section?.data?.length || 0}
        />
      );
    },
    [onPressItem],
  );

  const onPressBottomSheet = (itemID) => {
    requestAnimationFrame(async () => {
      switch (itemID) {
        case ITEM_IDS.COLLABORATORS:
          if (bottomSheetRef?.current) {
            bottomSheetRef?.current.close();
          }
          setTimeout(() => {
            navigation.navigate('Collaborator');
          }, 100);

          break;
        case ITEM_IDS.INSTALL_LINK:
          try {
            await Share.share({
              message: invitation.CTV_text,
            });
          } catch (error) {
            if (__DEV__) {
              console.log('error', error);
            }
          }

          break;
        case ITEM_IDS.INTRODUCTION:
          if (bottomSheetRef?.current) {
            bottomSheetRef?.current.close();
          }
          setTimeout(() => {
            navigation.navigate('WebView', {
              mode: 0,
              title: 'Hướng dẫn chi tiết',
              url: appInfo?.introductionUrl,
            });
          }, 100);

          break;
        case ITEM_IDS.COMMISSION: {
          if (bottomSheetRef?.current) {
            bottomSheetRef?.current.close();
          }
          setTimeout(() => {
            navigation.navigate('WebView', {
              mode: 0,
              title: 'Chính sách',
              url: MFConfigs.policyIndirect,
            });
          }, 100);

          break;
        }
        case ITEM_IDS.RSM_PUSH_MESSAGE: {
          if (bottomSheetRef?.current) {
            bottomSheetRef?.current.close();
          }
          setTimeout(() => {
            navigation.navigate('RSMPushMessage');
          }, 100);

          break;
        }
        case ITEM_IDS.REF_CODE:
          try {
            await Share.share({
              message: invitation.CTV_text2,
            });
          } catch (error) {
            if (__DEV__) {
              console.log('error', error);
            }
          }
          break;
        case ITEM_IDS.POLICY_COLLABORATOR:
          if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
          }
          navigation.navigate('WebView', {
            mode: 0,
            title: 'Quy định',
            url: appInfo?.urlRuleCobllabNewModel,
          });
          break;
        case ITEM_IDS.INFO_COLLABORATOR:
          if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
          }
          navigation.navigate('WebView', {
            mode: 0,
            title: 'Con đường huyền thoại',
            url: appInfo?.urlInfoNewModel,
          });
          break;

        default:
          break;
      }
    });
  };

  const renderBottomActionSheet = useCallback(() => {
    const canUseNewRsmFunction = myUser?.useRsmPush;
    return (
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <View>
            onClosePress=
            {() => {
              if (bottomSheetRef.current) {
                bottomSheetRef.current.close();
              }
            }}
            onItemPress={onPressBottomSheet}
            user={myUser}
            itemRender={canUseNewRsmFunction ? LIST_CTV_FUNCTION : LIST_CTV_FUNCTION_WITHOUT_RSM}
            />
          </View>
        )}
      />
    );
  }, [myUser, onPressBottomSheet]);

  const goToRefPage = useCallback(() => {
    if (myUser?.isLinePartner || userMetaData?.disabledPressCTV) {
      return;
    }
    navigation.navigate('WebView', {
      mode: 0,
      url: MFConfigs.refSite,
      title: 'Cộng tác viên',
    });
  }, [myUser?.isLinePartner, navigation, userMetaData?.disabledPressCTV]);

  const renderSectionHeader = useCallback(
    ({ section }) => {
      switch (section?.id) {
        case 'USER_INFOR': {
          return (
            <>
              {!userConfigs?.userID?.length ? (
                <UserBox isLogined={!!userConfigs?.userID?.length} onPress={onPressUserBox} />
              ) : (
                <UserBox
                  name={userMetaData?.fullName || myUser?.fullName}
                  phoneNumber={myUser?.mPhoneNumber}
                  isLogined={!!myUser?.accessToken}
                  hideIconNext={!myUser?.accessToken}
                  avatar={myUser?.avatarImgURI}
                  arenaLogoUrl={arenaInfor?.logo}
                  referralCode={myUser?.referralCode}
                  isVerifiedAccount={!!userMetaData?.isCTVConfirmed}
                  onPress={onPressUserBox}
                  onPressReferralCode={onPressReferralCode}
                  onPressReferralDisabledCode={onPressReferralDisabledCode}
                  myUser={myUser}
                  onPressReferralName={goToRefPage}
                />
              )}
            </>
          );
        }
        default:
          return <SectionHeaderAccount title={section?.title} note={section?.note} />;
      }
    },
    [
      userConfigs?.userID?.length,
      onPressUserBox,
      userMetaData?.fullName,
      userMetaData?.isCTVConfirmed,
      myUser?.fullName,
      myUser?.mPhoneNumber,
      myUser?.accessToken,
      myUser?.avatarImgURI,
      myUser?.referralCode,
      arenaInfor?.logo,
      onPressReferralCode,
      onPressReferralDisabledCode,
      myUser,
      goToRefPage,
    ],
  );

  const itemSeparatorComponent = useCallback((item) => {
    return (
      <MenuItemSeparator
        showIcon={item?.section?.id === 'HOSO'}
        disabled={item?.trailingItem?.disabled}
      />
    );
  }, []);

  const listFooterComponent = useCallback(() => <View style={styles.footerList} />, []);

  const onRefresh = useCallback(() => {
    actions.getUserConfigs();
    actions.getUserMetaData();
    // actions.dispatchGetArenaInfor();
  }, [actions]);

  const renderBackground = useCallback(() => {
    return (
      <LinearGradient
        colors={['rgb(40, 158, 255)', 'rgb(0, 91, 243)']}
        style={styles.linearGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={{ height: SH(200), alignItems: 'center', justifyContent: 'center' }} />
      </LinearGradient>
    );
  }, []);

  return (
    <View style={styles.wrapper}>
      {userConfigs?.data?.length > 0 && renderBackground()}
      <SectionList
        sections={sectionData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl tintColor="#fff" refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickySectionHeadersEnabled={false}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListFooterComponent={listFooterComponent}
        showsVerticalScrollIndicator={false}
      />
      <LoadingModal visible={isLogoutProcessing} />
      {renderBottomActionSheet()}
    </View>
  );
};

export default AccountSetting;
