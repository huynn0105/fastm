import {
  Alert,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
  DeviceEventEmitter,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from './components/SectionHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundHeader from './components/BackgroundHeader';
import UserInfo from './components/UserInfo';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkDeleteAccountV2,
  getOverviewCoreAgent,
  getTimeChecking,
  getStatisticWorking,
  getUserConfigs,
} from '../../redux/actions/actionsV3/userConfigs';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';
import Colors from '../../theme/Color';
import ItemSectionRow from './components/ItemSectionRow';
import strings from '../../constants/strings';
import { logout } from '../../redux/actions/user';
import { setShowPopupBrand } from '../../redux/actions/popup';
import useOnPress from '../../hooks/useOnPress';
import ItemSection from './components/ItemSection';
import MySupporter from '../Collaborator/common/MySupporter';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { getFilterRating } from '../../redux/actions/actionsV3/collaboratorAction';
import { getUserConfigsSelector } from '../../redux/selectors/userConfigsSelectors';
import MySupporterWaiting from './components/MySupporterWaiting';
import { IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import ButtonText from '../../common/ButtonText';
import { openLogin } from '../../redux/actions/navigation';
import { uniqBy } from 'lodash';
import { getLgoutProcessing } from '../../redux/selectors/loadingSelectors';
import LoadingModal from '../../componentV3/LoadingModal';
import LoginRequire from '../../components2/LoginRequire';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import FlutterService from '../Home/FlutterService';
import { openAccountIdentification } from '../../redux/actions/actionsV3/navigationAction';
import OverviewCoreAgent from '../Collaborator/common/OverviewCoreAgent';
import DashedHorizontal from '../../componentV3/DashedHorizontal/DashedHorizontal';
import ItemSectionHeader from './components/ItemSectionHeader';
import TimeCheckingComponent from './components/TimeCheckingComponent';
import StatisticWorkingComponent from './components/StatisticWorkingComponent';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';

const AccountSetting = memo((props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const hierInfoUser = useSelector((state) => state?.collaboratorReducer?.hierInfoUser);
  const myUser = useSelectorShallow(getMyuserSelector);
  const appInfo = useSelectorShallow(getAppInforSelector);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const userConfigs = useSelectorShallow(getUserConfigsSelector);
  const isLogoutProcessing = useSelectorShallow(getLgoutProcessing);

  const rankLevel = useMemo(() => {
    const titleSplit = hierInfoUser?.rank?.level?.title?.split(' ');
    const maxIndex = titleSplit?.length - 1;
    const star = !isNaN(titleSplit?.[maxIndex]) ? titleSplit?.[maxIndex] : 0;
    const level = star
      ? titleSplit?.splice(0, maxIndex)?.join(' ')
      : hierInfoUser?.rank?.level?.title;
    return level;
  }, [hierInfoUser?.rank?.level?.title]);

  const [data, setData] = useState([]);
  const [isHideUserSupport, setIsHideUserSupport] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollY = useRef(new Animated.Value(-insets.top)).current;

  const isEcomRegistration = appInfo?.isEcomRegistration === true; /// hide supporter

  const onPressItem = useCallback(
    (action) => {
      switch (action) {
        case 'MFAST_LOGOUT':
          Alert.alert(
            strings.alert_title,
            strings.logout_confirm,
            [
              {
                text: 'Đăng xuất',
                onPress: () => {
                  dispatch(logout(false));
                },
              },
              {
                text: 'Đóng',
                style: 'cancel',
              },
            ],
            { cancelable: false },
          );
          break;
        case 'OPEN_POPUP_BRANDING':
          dispatch(setShowPopupBrand(true));
          break;
        case 'OPEN_SUPPORT':
          FlutterService.openChat({});
          break;
        default:
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useOnPress({ action });
      }
    },
    [dispatch],
  );

  const renderSectionHeader = useCallback(
    ({ item }) => {
      switch (item?.id) {
        case 'USER_INFO':
          return (
            <UserInfo
              rankTitle={hierInfoUser?.rank?.level?.title}
              myUser={myUser}
              userMetaData={userMetaData}
            />
          );
        case 'MY_SUPPORTER':
          if (isEcomRegistration) {
            return null;
          }
          return (
            <MySupporter
              isHideUserSupport={isHideUserSupport}
              style={styles.headerCustomer}
              headerView={<SectionHeader title={'Người dẫn dắt'} myUser={myUser} />}
              navigation={navigation}
              myUser={myUser}
              isCTVConfirmed={Object.keys(userMetaData)?.length && userMetaData?.isCTVConfirmed}
            />
          );
        case 'MY_SUPPORTER_WAITING':
          if (isEcomRegistration) {
            return null;
          }
          return (
            <MySupporterWaiting
              navigation={navigation}
              onShowSupporter={(isShow) => setIsHideUserSupport(!isShow)}
            />
          );
        case 'HOSO_NOT_VERIFY':
          return (
            <>
              <SectionHeader title={'Hồ sơ cá nhân'} />
              <View
                style={{
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: Colors.primary5,
                  marginBottom: 24,
                  marginTop: 8,
                }}
              >
                <Image source={IMAGE_PATH.eKYC} />
                <AppText
                  bold
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    lineHeight: 20,
                    color: Colors.sixRed,
                    marginTop: 16,
                  }}
                >
                  Bạn chưa định danh tài khoản.
                </AppText>
                <AppText
                  style={{
                    textAlign: 'center',
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#3c3c53',
                    marginTop: 8,
                  }}
                >
                  Thông tin định danh giúp bảo vệ tài khoản, rút tiền và được mở các tính năng,
                  nghiệp vụ bán hàng nâng cao
                </AppText>
                <ButtonText
                  onPress={() => {
                    dispatch(openAccountIdentification(navigation.navigate));
                  }}
                  title="Định danh ngay"
                  top={16}
                  bottom={4}
                  height={40}
                />
              </View>
            </>
          );
        case 'OVERVIEW_CORE_AGENT':
          return <OverviewCoreAgent />;
        case 'TIME_CHECKING':
          return <TimeCheckingComponent />;
        case 'STATISTIC_WORKING':
          return <StatisticWorkingComponent />;
        default:
          return <SectionHeader title={item?.title} />;
      }
    },
    [
      dispatch,
      hierInfoUser?.rank?.level?.title,
      isHideUserSupport,
      myUser,
      navigation,
      userMetaData,
    ],
  );

  const renderItemColumn = useCallback(
    (item, index) => {
      return <ItemSection item={item} index={index} key={index} onPress={onPressItem} />;
    },
    [onPressItem],
  );

  const renderItemHeader = useCallback(
    (item, index) => {
      return <ItemSectionHeader item={item} index={index} key={index} onPress={onPressItem} />;
    },
    [onPressItem],
  );

  const renderItemRow = useCallback(
    (item, index) => {
      return <ItemSectionRow item={item} key={index} onPress={onPressItem} />;
    },
    [onPressItem],
  );

  const renderHeaderContents = useCallback(
    ({ contents }) => {
      return (
        <View
          style={{
            backgroundColor: Colors.primary5,
            padding: 12,
            paddingBottom: 16,
            marginTop: 8,
            borderRadius: 8,
            zIndex: 100,
            flexDirection: 'row',
          }}
        >
          <View style={styles.dashedContainer}>
            <DashedHorizontal />
            <View style={[styles.dashedCircle, { left: -16 / 2 }]} />
            <View style={[styles.dashedCircle, { right: -16 / 2 }]} />
          </View>
          {contents?.map(renderItemHeader)}
        </View>
      );
    },
    [renderItemHeader],
  );

  const renderContentsColumn = useCallback(
    ({ index, contents, headerContents }) => {
      const isHeaderShow = !!headerContents?.length;
      return (
        <>
          {headerContents?.length
            ? renderHeaderContents({ index, contents: headerContents })
            : null}
          <View style={[styles.sectionContainer, isHeaderShow && { marginTop: 0, paddingTop: 16 }]}>
            {contents?.map(renderItemColumn)}
          </View>
        </>
      );
    },
    [renderHeaderContents, renderItemColumn],
  );
  const renderContentsRow = useCallback(
    ({ index, contents, headerContents }) => {
      const isHeaderShow = !!headerContents?.length;
      return (
        <>
          {headerContents?.length
            ? renderHeaderContents({ index, contents: headerContents })
            : null}
          <View
            style={[styles.sectionRowContainer, isHeaderShow && { marginTop: 0, paddingTop: 16 }]}
          >
            {contents?.map(renderItemRow)}
          </View>
        </>
      );
    },
    [renderHeaderContents, renderItemRow],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const contents = item?.data || [];
      const headerContents = item?.headerData || [];
      return (
        <>
          {renderSectionHeader({ item })}
          {contents?.length
            ? item?.horizontal
              ? renderContentsRow({ index, contents, headerContents })
              : renderContentsColumn({ index, contents, headerContents })
            : null}
        </>
      );
    },
    [renderContentsColumn, renderContentsRow, renderSectionHeader],
  );

  const keyExtractor = useCallback((item, index) => {
    return `${item?.action + index}`;
  }, []);

  const onRefresh = useCallback(
    (isPullRefresh = true) => {
      setIsRefreshing(true);
      dispatch(getUserConfigs());
      dispatch(getUserMetaData());
      if (isPullRefresh) {
        dispatch(checkDeleteAccountV2());
        dispatch(getOverviewCoreAgent());
        dispatch(getTimeChecking());
        dispatch(getStatisticWorking());
      }
      dispatch(
        getFilterRating(myUser?.uid, () => {
          setIsRefreshing(false);
        }),
      );
    },
    [dispatch, myUser?.uid],
  );

  useEffect(() => {
    if (myUser?.isLoggedIn) {
      onRefresh(false);
    }
  }, [myUser?.isLoggedIn, onRefresh]);

  useEffect(() => {
    if (!myUser?.isLoggedIn) return;
    let sectionsTemp = userConfigs?.data || [];

    if (sectionsTemp?.findIndex((item) => item?.id === 'USER_INFO') === -1) {
      sectionsTemp.splice(0, 0, {
        title: '',
        id: 'USER_INFO',
        data: [],
      });
    }

    if (
      !isEcomRegistration &&
      sectionsTemp?.findIndex((item) => item?.id === 'MY_SUPPORTER') === -1
    ) {
      sectionsTemp.splice(2, 0, {
        title: '',
        id: 'MY_SUPPORTER',
        data: [],
      });
    }

    if (
      !isEcomRegistration &&
      sectionsTemp?.findIndex((item) => item?.id === 'MY_SUPPORTER_WAITING') === -1
    ) {
      sectionsTemp.splice(3, 0, {
        title: '',
        id: 'MY_SUPPORTER_WAITING',
        data: [],
      });
    }

    sectionsTemp = sectionsTemp?.map((item) => {
      return {
        ...item,
        data: item.data || [],
        renderItem: item?.horizontal ? renderContentsRow : renderContentsColumn,
      };
    });
    if (
      !Object.keys(userMetaData)?.length ||
      (Object.keys(userMetaData)?.length && !userMetaData?.isCTVConfirmed)
    ) {
      sectionsTemp[1] = {
        title: '',
        id: 'HOSO_NOT_VERIFY',
        data: [],
      };
    }

    sectionsTemp.splice(1, 0, {
      title: '',
      id: 'OVERVIEW_CORE_AGENT',
      data: [],
    });

    sectionsTemp.splice(1, 0, {
      title: '',
      id: 'TIME_CHECKING',
      data: [],
    });

    sectionsTemp.splice(1, 0, {
      title: '',
      id: 'STATISTIC_WORKING',
      data: [],
    });

    setData(uniqBy(sectionsTemp), 'id');
  }, [
    myUser?.isLoggedIn,
    renderContentsColumn,
    renderContentsRow,
    userConfigs?.data,
    userMetaData,
    userMetaData?.isCTVConfirmed,
  ]);

  if (!myUser?.isLoggedIn) {
    return (
      <LoginRequire
        onPress={() => dispatch(openLogin())}
        renderHeader={() => <BackgroundHeader scrollY={scrollY} />}
      />
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundHeader
        scrollY={scrollY}
        rankLevel={rankLevel}
        isVerifiedAccount={!!userMetaData?.isCTVConfirmed}
        myUser={myUser}
        navigation={navigation}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        // renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.sectionsContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        contentInset={{ top: insets.top }}
        contentOffset={{ y: -insets.top }}
        stickySectionHeadersEnabled={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY,
              },
            },
          },
        ])}
      />

      <LoadingModal visible={isLogoutProcessing} />
    </View>
  );
});

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  sectionsContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: BOTTOM_BAR_HEIGHT,
  },
  sectionRowContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 24,
  },
  sectionContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  headerCustomer: {
    marginBottom: 24,
  },
  dashedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
  },
  dashedCircle: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    backgroundColor: Colors.neutral5,
    position: 'absolute',
  },
});
