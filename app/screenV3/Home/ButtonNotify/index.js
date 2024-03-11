import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, DeviceEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import ChatBoxButton from '../../../components2/ChatBoxButton';
import { SH, SW } from '../../../constants/styles';
import FlutterService from '../FlutterService';
import { SEARCH_HEIGHT } from '../constants';
import { FLUTTER_EXIT } from '../../../screens2/Others/CommunicationKey';
import { getTotalUnreadChat } from '../../../redux/actions/actionsV3/chatAction';
import { getTotalUnreadNotification } from '../../../redux/actions/actionsV3/notificationAction';
import notifee from '@notifee/react-native';

const ButtonNotify = memo(
  ({ isLoggedIn, navigation, top, backgroundColor, size, opacity, zIndex }) => {
    // const allThreads = useSelector((state) => state?.allThreads);
    const totalUnreadChat = useSelector((state) => state?.chatReducer?.totalUnread);
    const totalUnreadNotification = useSelector((state) => state?.notificationReducer?.totalUnread);

    /// ChatBot
    const highlightChatBot = useSelector((state) => state?.appInfo?.highlightChatBot);
    const showChatBot = useSelector(
      (state) => state?.appInfo?.highlightChatBot?.showChatBot === true,
    );

    const dispatch = useDispatch();

    const appState = useRef(AppState.currentState);
    const [triggerUpdateBadge, setTriggerUpdateBadge] = useState(false);

    const countUnReadNewChat = useCallback(async () => {
      dispatch(getTotalUnreadChat());
    }, []);

    const countUnReadNewNotification = useCallback(async () => {
      dispatch(getTotalUnreadNotification());
    }, []);

    const setBadge = useCallback(() => {
      notifee.setBadgeCount(totalUnreadChat + totalUnreadNotification);
    }, [totalUnreadChat, totalUnreadNotification]);

    useEffect(() => {
      setBadge();
    }, [setBadge, triggerUpdateBadge]);

    useEffect(() => {
      const subs = [
        navigation.addListener('didFocus', () => {
          countUnReadNewChat();
          countUnReadNewNotification();
        }),
        AppState.addEventListener('change', (nextAppState) => {
          if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            countUnReadNewChat();
            countUnReadNewNotification();
            setTriggerUpdateBadge((prevState) => !prevState);
          }
          appState.current = nextAppState;
        }),
      ];
      FlutterService.listenerEvent(FLUTTER_EXIT, (event) => {
        countUnReadNewChat();
        countUnReadNewNotification();
      });
      return () => {
        subs.map((e) => e?.remove());
        FlutterService.removeListenerEvent(FLUTTER_EXIT);
      };
    }, []);

    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          right: SW(16),
          zIndex: zIndex,
          opacity,
          height: SEARCH_HEIGHT,
          alignItems: 'center',
        }}
      >
        {isLoggedIn && showChatBot ? (
          <ChatBoxButton
            onPress={() => {
              // navigation.navigate('ChatList');
              if (highlightChatBot?.id) {
                FlutterService.openChat({
                  chatBotId: highlightChatBot?.id,
                });
              }
            }}
            icon={ICON_PATH.mascotChatBotHeadJson}
            isLottieAsset={true}
            unread={0}
            navigation={navigation}
            style={{
              // backgroundColor,
              width: SH(36),
              height: SH(36),
            }}
          />
        ) : null}
        {isLoggedIn ? (
          <Animated.View
            style={{
              marginLeft: 8,
              padding: 1,
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: 0.5,
                bottom: 2.5,
                left: 0.5,
                right: 0.5,
                borderRadius: 36 / 2,
              }}
              pointerEvents={'box-none'}
            />
            <ChatBoxButton
              onPress={() => {
                // navigation.navigate('ChatList');
                FlutterService.openChat({});
              }}
              icon={ICON_PATH.message2}
              unread={totalUnreadChat}
              navigation={navigation}
              style={{
                // backgroundColor,
                width: SH(28),
                height: SH(28),
              }}
            />
          </Animated.View>
        ) : null}
        {isLoggedIn ? (
          <Animated.View
            style={{
              marginLeft: 8,
              padding: 1,
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: 0.5,
                bottom: 2.5,
                left: 0.5,
                right: 0.5,
                borderRadius: 36 / 2,
                // backgroundColor: `${colors.primary2}66`,
              }}
            />
            <ChatBoxButton
              onPress={() => {
                FlutterService.openMFast({
                  path: '/notification',
                });
                // navigation.navigate('Notification');
              }}
              type={'anna'}
              unread={totalUnreadNotification}
              navigation={navigation}
              style={{
                // backgroundColor,
                width: SH(28),
                height: SH(28),
              }}
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              position: 'absolute',
              // backgroundColor: 'red',
              right: 0.5,
              // top: isIphone12() ? -SH(12) : 0,
            }}
          >
            <Animated.Image
              source={IMAGE_PATH.logoMFastNew}
              style={{ width: SH(28), height: SH(28), resizeMode: 'cover' }}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  },
);

export default ButtonNotify;
