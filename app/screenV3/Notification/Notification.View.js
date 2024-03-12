import {
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeaderNotification from './components/HeaderNotification';
import Colors from '../../theme/Color';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import AdminThread from './common/AdminThread';
import modelThread from '../../models/SystemThread';
import SystemThread from './common/SystemThread';
import EnableTracking from '../../componentV3/EnableTracking';
import BottomActionSheet from '../../components2/BottomActionSheet';
import PopupGuildEnable from '../../componentV3/EnableTracking/PopupGuildEnable';
import AppText from '../../componentV3/AppText';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Notification = memo((props) => {
  const { navigation } = props;
  const params = navigation.getParam('params');
  const initIndex = useMemo(() => Number(params?.initIndex || 0) || 0, [params?.initIndex]);
  const initAdminIndex = useMemo(
    () => Number(params?.initAdminIndex || 0) || 0,
    [params?.initAdminIndex],
  );

  const [index, setIndex] = useState(initIndex);

  const [isUnread, setIsUnread] = useState(params?.isUnread);

  const actionSheetRef = useRef();

  const insets = useSafeAreaInsets();

  const [routes] = useState([
    { key: 'SYSTEM_THREAD', title: 'Biến động' },
    { key: 'ADMIN_THREAD', title: 'Thông báo' },
  ]);

  const renderScene = useMemo(
    () =>
      SceneMap({
        SYSTEM_THREAD: () => (
          <SystemThread
            thread={modelThread.systemThread()}
            isUnread={isUnread}
            navigation={navigation}
          />
        ),
        ADMIN_THREAD: () => (
          <AdminThread
            thread={modelThread.adminThread()}
            initIndex={initAdminIndex}
            isUnread={isUnread}
            navigation={navigation}
          />
        ),
      }),
    [initAdminIndex, isUnread, navigation],
  );

  const totalUnReadAdminNotifications = useSelector(
    (state) => state.totalUnReadAdminNotificationsFb,
  );
  const totalUnReadSystemNotifications = useSelector(
    (state) => state.totalUnReadSystemNotificationsFb,
  );

  const renderTabBar = useCallback(
    (propsTabBar) => {
      setIndex(propsTabBar.navigationState.index);
      return (
        <TabBar
          {...propsTabBar}
          indicatorStyle={{ backgroundColor: Colors.primary2 }}
          style={{ backgroundColor: Colors.primary5, elevation: 0 }}
          renderTabBarItem={({ onLayout, onPress, onLongPress, route, navigationState }) => {
            const focused = navigationState.routes[navigationState.index].key === route.key;
            return (
              <TouchableWithoutFeedback
                onLayout={onLayout}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <View
                  style={{
                    height: 32,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {route.key !== 'SYSTEM_THREAD' ? (
                    <View
                      style={{
                        position: 'absolute',
                        width: 1,
                        top: 8,
                        bottom: 8,
                        backgroundColor: Colors.neutral3,
                        left: 0,
                      }}
                    />
                  ) : null}
                  <AppText
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      textAlign: 'center',
                      color: focused ? Colors.primary2 : Colors.gray5,
                      width: '100%',
                    }}
                    semiBold={focused}
                  >
                    {route.title}
                    {(
                      route.key === 'SYSTEM_THREAD'
                        ? totalUnReadSystemNotifications
                        : totalUnReadAdminNotifications > 0
                    )
                      ? ` (${
                          route.key === 'SYSTEM_THREAD'
                            ? totalUnReadSystemNotifications
                            : totalUnReadAdminNotifications
                        })`
                      : ''}
                  </AppText>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      );
    },
    [totalUnReadAdminNotifications, totalUnReadSystemNotifications],
  );

  const handleUnreadNotification = useCallback(
    (value) =>
      setIsUnread((prevState) => {
        if (prevState !== value) {
          setIndex(0);
          return value;
        }

        return prevState;
      }),
    [],
  );

  const onShowAllNotification = useCallback(() => {
    handleUnreadNotification(false);
  }, [handleUnreadNotification]);

  useEffect(() => {
    DeviceEventEmitter.addListener('unread_notification', handleUnreadNotification);

    return () => {
      DeviceEventEmitter.removeListener('unread_notification', handleUnreadNotification);
    };
  }, [handleUnreadNotification]);

  return (
    <>
      <View style={styles.container}>
        <HeaderNotification
          navigation={navigation}
          category={index === 0 ? modelThread.systemThread().type : modelThread.adminThread().type}
        />
        <EnableTracking
          onOpenBottomSheet={() => {
            actionSheetRef.current.open();
          }}
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
          lazy
        />
        {isUnread ? (
          <View style={[styles.bottomNewMessageAlert, { bottom: 16 + insets?.bottom }]}>
            <TouchableOpacity
              style={styles.touchNewMessageAlert}
              activeOpacity={0.2}
              onPress={onShowAllNotification}
            >
              <AppText style={styles.textNewMessageAlert}>{'Xem tất cả'}</AppText>
            </TouchableOpacity>
          </View>
        ) : null}
        <BottomActionSheet
          ref={actionSheetRef}
          render={() => {
            return <PopupGuildEnable />;
          }}
          canClose={true}
          headerText={'Mở theo dõi ứng dụng'}
          haveCloseButton={true}
        />
      </View>
    </>
  );
});

export default Notification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral5 },
  bottomNewMessageAlert: {
    position: 'absolute',
    height: 38,
    left: 0,
    right: 0,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchNewMessageAlert: {
    flex: 0,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 38 / 2.0,
    borderWidth: 1.0,
    borderColor: `${Colors.primary2}aa`,
  },
  textNewMessageAlert: {
    marginRight: 16,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '200',
    color: Colors.primary2,
  },
});
