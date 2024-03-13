import { Alert, Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { SECTION_DATA } from './AccountInfo.constants';
import SectionHeader from './components/SectionHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundHeader from './components/BackgroundHeader';
import UserInfo from './components/UserInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getUserConfigs } from '../../redux/actions/actionsV3/userConfigs';
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
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import ButtonText from '../../common/ButtonText';
import { openLogin } from '../../redux/actions/navigation';

const AccountInfo = memo((props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const hierInfoUser = useSelector((state) => state?.collaboratorReducer?.hierInfoUser);
  const myUser = useSelectorShallow(getMyuserSelector);
  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const userConfigs = useSelectorShallow(getUserConfigsSelector);

  const [sections, setSections] = useState([
    {
      title: '',
      id: 'USER_INFO',
      data: [],
    },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        default:
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useOnPress({ action });
      }
    },
    [dispatch],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => {
      switch (section?.id) {
        case 'USER_INFO':
          return (
            <UserInfo
              rankTitle={hierInfoUser?.rank?.level?.title}
              myUser={myUser}
              userMetaData={userMetaData}
            />
          );
        case 'MY_SUPPORTER':
          return (
            <MySupporter
              style={styles.headerCustomer}
              headerView={<SectionHeader title={'Người dẫn dắt'} myUser={myUser} />}
              navigation={navigation}
            />
          );
        case 'MY_SUPPORTER_WAITING':
          return <MySupporterWaiting navigation={navigation} />;
        default:
          return <SectionHeader title={section?.title} />;
      }
    },
    [hierInfoUser?.rank?.level?.title, myUser, navigation, userMetaData],
  );

  const renderItem = useCallback(
    (item, index) => {
      return <ItemSection item={item} index={index} key={index} onPress={onPressItem} />;
    },
    [onPressItem],
  );

  const renderItemRow = useCallback(
    (item, index) => {
      return <ItemSectionRow item={item} key={index} onPress={onPressItem} />;
    },
    [onPressItem],
  );

  const renderSection = useCallback(
    ({ index, section: { data } }) => {
      if (index) return null;
      return <View style={styles.sectionContainer}>{data?.map(renderItem)}</View>;
    },
    [renderItem],
  );
  const renderSectionRow = useCallback(
    ({ index, section: { data } }) => {
      if (index) return null;
      return <View style={styles.sectionRowContainer}>{data?.map(renderItemRow)}</View>;
    },
    [renderItemRow],
  );

  const keyExtractor = useCallback((item) => item?.id, []);

  // Style
  const sectionContainerStyle = useMemo(
    () => [styles.sectionsContainer, { paddingTop: insets.top }],
    [insets.top],
  );

  const onRefresh = useCallback(() => {
    if (!myUser?.isLoggedIn) return;

    setIsRefreshing(true);
    dispatch(getUserConfigs());
    dispatch(getUserMetaData());
    dispatch(
      getFilterRating(myUser?.uid, () => {
        setIsRefreshing(false);
      }),
    );
  }, [dispatch, myUser?.isLoggedIn, myUser?.uid]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    if (!myUser?.isLoggedIn) return;
    let sectionsTemp = userConfigs?.data || [];

    sectionsTemp.splice(0, 0, {
      title: '',
      id: 'USER_INFO',
      data: [],
    });
    sectionsTemp.splice(2, 0, {
      title: '',
      id: 'MY_SUPPORTER',
      data: [],
    });
    sectionsTemp.splice(3, 0, {
      title: '',
      id: 'MY_SUPPORTER_WAITING',
      data: [],
    });

    sectionsTemp = sectionsTemp?.map((item) => {
      return {
        ...item,
        renderItem: item?.horizontal ? renderSectionRow : renderSection,
      };
    });

    setSections(sectionsTemp);
  }, [myUser?.isLoggedIn, renderSection, renderSectionRow, userConfigs?.data]);

  return (
    <View style={styles.container}>
      <BackgroundHeader insetTop={insets.top} />
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        contentContainerStyle={sectionContainerStyle}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
      {!myUser?.isLoggedIn ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={IMAGE_PATH.mascot} style={{ width: 120, height: 120 }} />
          <AppText
            medium
            style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 16 }}
          >
            Đăng nhập để bắt đầu tạo ra thu nhập{'\n'}trên MFast
          </AppText>
          <TouchableOpacity
            onPress={() => dispatch(openLogin())}
            style={{
              backgroundColor: Colors.primary2,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
              borderRadius: 24,
              marginTop: 16,
            }}
          >
            <AppText
              style={{ color: Colors.primary5, fontSize: 16, lineHeight: 22, textAlign: 'center' }}
            >
              Đăng nhập ngay
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
});

export default AccountInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  sectionsContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
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
});
