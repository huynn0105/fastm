import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderMTrade from './common/HeaderMTrade';
import BannerMTrade from './common/BannerMTrade';
import { CollapsibleHeaderTabView } from '../../componentV3/TabViewCollapsibleHeader';
import { SceneMap } from 'react-native-tab-view';
import { IS_ANDROID, SCREEN_WIDTH } from '../../utils/Utils';
import ListProduct from './common/ListProduct';
import ListProductHistory from './common/ListProductHistory';
import ListProductHot from './common/ListProductHot';
import HeaderSection from './components/HeaderSection';
import AppText from '../../componentV3/AppText';
import ModalLocation from './common/ModalLocation';
import ModalMTradeFilter from './common/ModalMTradeFilter';
import { defaultNavOptions } from '../../screens2/Root/MainScreen';
import { ICON_PATH } from '../../assets/path';
import KJButton from '../../components/common/KJButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListMTradeBanner,
  getListMTradeCategory,
  getListMTradeLocation,
  getMTradeCode,
  resetFilter,
  setFilter,
  setLocation,
} from '../../redux/actions/actionsV3/mtradeAction';
import TabScene from './common/TabScene';

const MTrade = memo((props) => {
  const { navigation } = props;

  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  const [index, setIndex] = useState(0);
  const [categorySelected, setCategorySelected] = useState({ code: 'all' });
  const [routes] = useState([{ key: 'first', title: 'first' }]);

  const modalLocationRef = useRef();
  const modalFilterRef = useRef();
  const listRef = useRef();

  const dispatch = useDispatch();

  const listMTradeBanner = useSelector((state) => state?.mtradeReducer?.listMTradeBanner);
  const listMTradeCategory = useSelector((state) => state?.mtradeReducer?.listMTradeCategory);
  const location = useSelector((state) => state?.mtradeReducer?.location);
  const isLocation = useSelector(
    (state) => state?.mtradeReducer?.location?.length > 0 || state?.mtradeReducer?.location > 0,
  );
  const makeHeaderHeight = useCallback(() => headerHeight + 1, [headerHeight]);

  const filterInit = useMemo(
    () =>
      navigation?.state?.params?.params?.filter
        ? JSON.parse(navigation?.state?.params?.params?.filter)
        : {},
    [navigation?.state?.params?.params?.filter],
  );

  const onPressAll = useCallback(
    (group, title) => {
      navigation?.navigate('MTradeListProduct', {
        group,
        title,
      });
    },
    [navigation],
  );

  const renderHeader = useCallback(
    (tabBar) => () => {
      return (
        <>
          <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
            <BannerMTrade data={listMTradeBanner} />
            <ListProductHistory onPressAll={onPressAll} navigation={navigation} />
            <ListProductHot onPressAll={onPressAll} navigation={navigation} />
            <HeaderSection title={'Danh mục sản phẩm'} />
          </View>
          {tabBar ? tabBar?.() : null}
        </>
      );
    },
    [listMTradeBanner, navigation, onPressAll],
  );

  const renderScene = useMemo(
    () =>
      SceneMap({
        first: () => (
          <TabScene
            ref={listRef}
            index={0}
            category={categorySelected?.code}
            location={location}
            navigation={navigation}
            tabBarHeight={tabBarHeight}
          />
        ),
      }),
    [categorySelected?.code, location, navigation, tabBarHeight],
  );

  const renderItemCategory = useCallback(
    ({ item }) => {
      const isActive = item?.code === categorySelected?.code;
      return (
        <TouchableWithoutFeedback disabled={isActive} onPress={() => setCategorySelected(item)}>
          <View style={styles.itemCategoryContainer}>
            <View
              style={[
                styles.itemCategoryIconContainer,
                isActive && { borderColor: Colors.primary2 },
              ]}
            >
              <Image source={{ uri: item?.icon }} style={styles.itemCategoryIcon} />
            </View>
            <AppText
              semiBold={isActive}
              style={[
                styles.itemCategoryTitle,
                { color: isActive ? Colors.primary2 : Colors.gray5 },
              ]}
            >
              {item?.name}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [categorySelected?.code],
  );

  const renderTabBar = useCallback(() => {
    return (
      <FlatList
        data={listMTradeCategory}
        style={styles.listCategory}
        contentContainerStyle={styles.listCategoryContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItemCategory}
        onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}
      />
    );
  }, [listMTradeCategory, renderItemCategory]);

  const onPressLocation = useCallback(() => {
    modalLocationRef?.current?.open();
  }, []);
  const onPressFilter = useCallback(() => {
    modalFilterRef?.current?.open();
  }, []);
  const onPressSearch = useCallback(() => {
    navigation?.navigate('MTradeSearch');
  }, [navigation]);
  const onClosetFilter = useCallback(() => {
    modalFilterRef?.current?.close();
  }, []);
  const onResetFilter = useCallback(() => {
    onClosetFilter();
    setTimeout(() => {
      dispatch(resetFilter());
      navigation?.navigate('MTradeListProduct');
    }, 400);
  }, [dispatch, navigation, onClosetFilter]);
  const onSubmitFilter = useCallback(
    (newFilter) => {
      onClosetFilter();
      setTimeout(() => {
        dispatch(setFilter(newFilter));
        navigation?.navigate('MTradeListProduct');
      }, 400);
    },
    [dispatch, navigation, onClosetFilter],
  );

  const onCheckFilterInit = useCallback(() => {
    const arrKey = Object?.keys(filterInit);
    if (arrKey?.length > 0) {
      if (
        arrKey?.length === 1 &&
        arrKey[0] === 'productGroup' &&
        filterInit[arrKey[0]]?.length === 1
      ) {
        setCategorySelected({ code: filterInit[arrKey[0]][0] });
        if (makeHeaderHeight() > 0 && filterInit[arrKey[0]][0] !== 'all') {
          requestAnimationFrame(() => {
            listRef?.current
              ?.getNode()
              ?.scrollToOffset?.({ offset: makeHeaderHeight(), animated: true });
          });
        }
      } else {
        dispatch(setFilter(filterInit));
        navigation?.navigate('MTradeListProduct');
      }
    }
  }, [dispatch, filterInit, makeHeaderHeight, navigation]);

  useEffect(() => {
    dispatch(getListMTradeLocation());
    dispatch(getListMTradeBanner());
    dispatch(getListMTradeCategory());
    dispatch(getMTradeCode());
  }, [dispatch]);

  useEffect(() => {
    if (!isLocation) {
      requestAnimationFrame(() => {
        modalLocationRef?.current?.open();
      });
    }
  }, [isLocation]);

  useEffect(() => {
    onCheckFilterInit();
  }, [onCheckFilterInit]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View
        style={{
          marginBottom: 12,
        }}
      >
        <HeaderMTrade
          onPressLocation={onPressLocation}
          onPressFilter={onPressFilter}
          onPressSearch={onPressSearch}
        />
      </View>
      <CollapsibleHeaderTabView
        makeHeaderHeight={makeHeaderHeight}
        renderScrollHeader={renderHeader(renderTabBar)}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={() => null}
        initialLayout={{ width: SCREEN_WIDTH }}
        style={styles.scrollViewContainer}
        tabBarHeight={tabBarHeight}
      />
      <ModalLocation ref={modalLocationRef} />
      <ModalMTradeFilter
        ref={modalFilterRef}
        onResetFilter={onResetFilter}
        onSubmitFilter={onSubmitFilter}
      />
    </SafeAreaView>
  );
});

export default MTrade;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  scrollViewContainer: {
    flex: 1,
  },
  listCategory: {
    backgroundColor: Colors.neutral5,
  },
  listCategoryContent: {
    paddingHorizontal: 12,
  },
  itemCategoryContainer: {
    width: 66,
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingBottom: 8,
    paddingTop: 1,
  },
  itemCategoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    borderWidth: 1,
    borderColor: Colors.primary5,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCategoryIcon: {
    width: '66%',
    height: '66%',
  },
  itemCategoryTitle: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
  },
});

MTrade.navigationOptions = ({ navigation }) => {
  const title = navigation?.state?.params?.title || 'MTrade';
  const options = {
    ...defaultNavOptions,
    title,
    headerLeft: (headerLeftProps) => {
      return (
        <KJButton
          testID="header-back"
          leftIconSource={ICON_PATH.back}
          leftIconStyle={{
            width: 22,
            height: 22,
            resizeMode: 'contain',
          }}
          containerStyle={{
            paddingHorizontal: 16,
            height: '100%',
          }}
          onPress={() => navigation.pop()}
        />
      );
    },
  };

  return options;
};
