import { Image, LayoutAnimation, RefreshControl, StyleSheet, UIManager, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaInsetsContext, SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/Color';
import { SceneMap } from 'react-native-tab-view';
import { IS_ANDROID, SCREEN_WIDTH } from '../../utils/Utils';
import { TAB_TYPE } from './Customer.constants';
import FloatingButton from '../../componentV3/FloatingButton';
import { IMAGE_PATH } from '../../assets/path';
import { useDispatch, useSelector } from 'react-redux';
import { openLogin } from '../../redux/actions/navigation';
import { SH, SW } from '../../constants/styles';
import ListCustomer from './components/ListCustomer';
import HeaderCustomer from './components/HeaderCustomer';
import ButtonCountCustomerWaiting from './common/ButtonCountCustomerWaiting';
import StatisticsCustomer from './components/StatisticsCustomer';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import LoginRequire from '../../components2/LoginRequire';
import { CollapsibleHeaderTabView } from '../../componentV3/TabViewCollapsibleHeader';
import CustomTabBar from '../Collaborator/components/CustomTabBar';
import { setTabIndexCustomer } from '../../redux/actions/actionsV3/customerAction';
import AppText from '../../componentV3/AppText';
import Indicator from '../../componentV3/Indicator/Indicator';

const EDGES = ['top', 'right', 'left'];

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Customer = memo((props) => {
  const { navigation } = props;

  const listCustomerRef = useRef();
  const statisticsCustomerRef = useRef();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.myUser.isLoggedIn);
  const tabIndex = useSelector((state) => state.customerReducer.tabIndex);

  const [filterCondition, setFilterCondition] = useState({});
  const [tab, setTab] = useState(TAB_TYPE.ALL);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [routes] = useState([
    { key: 'first', title: 'Thống kê' },
    { key: 'second', title: 'Danh sách' },
  ]);

  const [index, setIndex] = useState(tabIndex);
  const [headerHeight, setHeaderHeight] = useState(0);

  const onChangeFilterFromStatistic = useCallback((_filter, _tab = TAB_TYPE.ALL) => {
    setIndex((prev) => {
      if (prev !== 1) {
        return 1;
      }
      return prev;
    });
    setFilterCondition((prevState) => ({
      ...prevState,
      [_tab]: _filter,
    }));
    setTab(_tab);
    listCustomerRef?.current?.setFilter(_filter);
    listCustomerRef?.current?.setTab(_tab);
  }, []);

  const renderScene = useMemo(
    () =>
      SceneMap({
        first: () => (
          <StatisticsCustomer
            index={0}
            ref={statisticsCustomerRef}
            onChangeFilterFromStatistic={onChangeFilterFromStatistic}
          />
        ),
        second: () => <ListCustomer index={1} ref={listCustomerRef} navigation={navigation} />,
      }),
    [],
  );

  const renderTabBar = useCallback(
    (tabBarProps) => {
      return (
        <CustomTabBar
          {...tabBarProps}
          index={index}
          containerStyle={{
            marginVertical: 0,
            paddingVertical: 8,
            backgroundColor: Colors.neutral5,
            height: 56,
          }}
        />
      );
    },
    [index],
  );

  const renderRefreshControl = useCallback(
    (p) => {
      if (!isRefreshing) return <View />;
      return (
        <View style={{ height: 50, justifyContent: 'center' }}>
          <Indicator />
        </View>
      );
    },
    [isRefreshing],
  );

  const onStartRefresh = useCallback(() => {
    setIsRefreshing(true);

    const callback = () => {
      setIsRefreshing(false);
    };

    switch (index) {
      case 0:
        statisticsCustomerRef?.current?.onRefresh();
        setTimeout(() => {
          setIsRefreshing(false);
        }, 500);
        break;
      case 1:
        listCustomerRef?.current?.onRefresh(callback);
        break;
    }
  }, [index]);

  const onChangeFilter = useCallback(
    (tabId, filter) => {
      setIndex((prev) => {
        if (prev !== 1) {
          return 1;
        }
        return prev;
      });
      listCustomerRef?.current?.setFilter(filter);
      setFilterCondition((prevState) => ({ ...filterCondition, [tabId]: filter }));
    },
    [filterCondition],
  );
  const onChangeTab = useCallback((_tab) => {
    setIndex((prev) => {
      if (prev !== 1) {
        return 1;
      }
      return prev;
    });
    setTab(_tab);
    listCustomerRef?.current?.setTab(_tab);
  }, []);

  const onRemoveFilter = useCallback(() => {
    setIndex((prev) => {
      if (prev !== 1) {
        return 1;
      }
      return prev;
    });
    setFilterCondition({});
    setTab(TAB_TYPE.ALL);
    listCustomerRef?.current?.setFilter({});
    listCustomerRef?.current?.setTab(TAB_TYPE.ALL);
  }, []);

  const makeHeaderHeight = useCallback(() => headerHeight, [headerHeight]);

  const onGoToAdLinkScreen = useCallback(() => {
    navigation?.navigate('AdLinkScreen');
  }, [navigation]);

  useEffect(() => {
    const initTabIndex = navigation?.state?.params?.params?.initTabIndex;
    const initFilter = navigation?.state?.params?.params?.initFilter;
    const initTabType = navigation?.state?.params?.params?.initTabType;

    if (initTabIndex) {
      setIndex(Number(initTabIndex));
    }
    if (initTabType) {
      setTab(initTabType);
      listCustomerRef?.current?.setTab(initTabType);
      if (initFilter) {
        setFilterCondition((prevState) => ({
          ...prevState,
          [initTabType]: typeof initFilter === 'string' ? JSON.parse(initFilter) : initFilter,
        }));
        listCustomerRef?.current?.setFilter(
          typeof initFilter === 'string' ? JSON.parse(initFilter) : initFilter,
        );
      }
    }
  }, [navigation]);

  const renderHeader = useCallback(
    () => (
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height + 1)}>
        {isRefreshing && <View style={{ height: 50 }} />}
        <ButtonCountCustomerWaiting
          style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8 }}
          navigation={navigation}
        />
      </View>
    ),
    [isRefreshing, navigation],
  );

  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        100,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    dispatch(setTabIndexCustomer(index));
  }, [dispatch, index]);

  if (!isLoggedIn) {
    return (
      <LoginRequire
        onPress={() => dispatch(openLogin())}
        renderHeader={() => (
          <SafeAreaInsetsContext.Consumer>
            {(insets) => (
              <>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    paddingTop: insets.top,
                    flexDirection: 'row',
                    paddingHorizontal: 12,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Colors.neutral5,
                      height: 32,
                      marginHorizontal: 5,
                      borderRadius: 32,
                      marginVertical: 12,
                      flex: 1,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: Colors.neutral5,
                      height: 32,
                      marginHorizontal: 5,
                      borderRadius: 32,
                      marginVertical: 12,
                      flex: 1,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: Colors.neutral5,
                      height: 32,
                      marginHorizontal: 5,
                      borderRadius: 32,
                      marginVertical: 12,
                      flex: 1,
                    }}
                  />
                </View>
                <Image
                  source={IMAGE_PATH.shapeFilter}
                  style={{
                    alignSelf: 'center',
                    width: SW(210),
                    height: SH(28),
                    resizeMode: 'stretch',
                  }}
                />
              </>
            )}
          </SafeAreaInsetsContext.Consumer>
        )}
      />
    );
  }

  return (
    <SafeAreaView edges={EDGES} style={styles.container}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: Colors.neutral5,
          },
        ]}
      >
        <HeaderCustomer
          onChangeFilter={onChangeFilter}
          onRemoveFilter={onRemoveFilter}
          filter={filterCondition}
          navigation={navigation}
          onChangeTab={onChangeTab}
          tab={tab}
        />
        <CollapsibleHeaderTabView
          makeHeaderHeight={makeHeaderHeight}
          renderScrollHeader={renderHeader}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SCREEN_WIDTH }}
          tabbarHeight={56}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
          isRefreshing={isRefreshing}
          onStartRefresh={onStartRefresh}
          renderRefreshControl={renderRefreshControl}
        />
        <FloatingButton
          title={'Tiếp thị liên kết'}
          onPress={onGoToAdLinkScreen}
          icon={IMAGE_PATH.floatingLink}
          style={{ bottom: SH(30) + BOTTOM_BAR_HEIGHT }}
        />
      </View>
    </SafeAreaView>
  );
});

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
