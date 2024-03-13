import { ActivityIndicator, Alert, FlatList, Image, Linking, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGE_PATH } from '../../../assets/path';
import { SH, SW } from '../../../constants/styles';
import { TAB_TYPE } from '../Notification.constants';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { useDispatch, useSelector } from 'react-redux';
import {
  flagNotification,
  getListNotification,
  readNotification,
} from '../../../redux/actions/actionsV3/notificationAction';
import ItemNotification from './ItemNotification';
import { NOTIFICATION_TYPES } from '../../../submodules/firebase/model/Notification';
import strings from '../../../constants/strings';
import { onPressRSMMessage } from '../../../redux/actions/actionsV3/rsmPushMessage';
import { openChatWithUser } from '../../../submodules/firebase/redux/actions';
import FlutterService from '../../Home/FlutterService';

const ListNotification = memo((props) => {
  const { type, category, navigation, keyword, isUnread, isHideFlag } = props;

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const listNotification = useSelector(
    (state) => state?.notificationReducer?.listNotification[category][type],
  );
  const lastItemNotification = useMemo(
    () => listNotification[listNotification?.length - 1] || {},
    [listNotification],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [outOfData, setOutOfData] = useState(true);

  const openLink = useCallback(
    (item) => {
      const title = item.extraData.screen_title || strings.alert_title;
      if (
        item?.type === NOTIFICATION_TYPES.WEB_LINK ||
        item?.type === NOTIFICATION_TYPES.PLAIN_TEXT_WEB_LINK
      ) {
        const url = item?.extraData.url;
        const unbackableURLs = item?.extraData.unbackable_urls;
        if (url) {
          navigation.navigate('WebView', { mode: 0, title, url, unbackableURLs });
        }
      } else if (item?.type === NOTIFICATION_TYPES.WEB_STACK) {
        const urlsStack = item?.extraData.urls_stack;
        const unbackableURLs = item?.extraData.unbackable_urls;
        if (urlsStack) {
          navigation.navigate('WebView', { mode: 1, title, urlsStack, unbackableURLs });
        }
      }
    },
    [navigation],
  );

  const onPressDetail = useCallback(
    (item) => {
      item.extraData = JSON.parse(item?.extraDataJSON);

      if (item?.type === NOTIFICATION_TYPES.CHANGE_PASS) {
        navigation.navigate('EditPassword');
      } else if (item?.type === NOTIFICATION_TYPES.MONEY_HISTORY) {
        navigation.navigate('AvailableMoney');
      } else if (item?.type === NOTIFICATION_TYPES.POINTS_HISTORY) {
        navigation.navigate('AvailablePoints');
      } else if (item?.type === NOTIFICATION_TYPES.EMPLOYEE_CARD) {
        navigation.navigate('EmployeeCard');
      } else if (item?.type === NOTIFICATION_TYPES.FEEDBACK) {
        const ticket = item?.extraData.ticket;
        navigation.navigate('ChatFeedback', {
          screenMode: ticket.status,
          ticket,
        });
      } else if (
        item?.type === NOTIFICATION_TYPES.OPEN_VIEW ||
        item.type === NOTIFICATION_TYPES.CONFIRM_CTV
      ) {
        const url = item?.extraData.url;
        Linking.openURL(url);
      } else if (item?.type === NOTIFICATION_TYPES.CHAT_MESSAGE) {
        const messageJSON = item.extraData.chatMessage || {};
        FlutterService.openChat({
          threadId: messageJSON?.threadID,
        });
      } else {
        openLink(item);
      }

      if (!item?.read) {
        dispatch(readNotification(item?.uid, category, item?.subCategory || TAB_TYPE.OTHER));
      }
    },

    [category, dispatch, navigation, openLink],
  );

  const onPressFlag = useCallback(
    (item) => {
      dispatch(
        flagNotification(item, category, item?.subCategory || TAB_TYPE.OTHER, (isSuccess) => {
          !isSuccess && Alert.alert('Lỗi');
        }),
      );
    },
    [category, dispatch],
  );

  const renderEmpty = useCallback(() => {
    if (type === TAB_TYPE.FLAG) {
      return (
        <View style={styles.emptyContainer}>
          <Image source={IMAGE_PATH.exPinNoti} style={styles.emptyPinImage} />
        </View>
      );
    }
    return (
      <View style={[styles.emptyContainer, { marginTop: SH(56) }]}>
        <Image source={IMAGE_PATH.emptyNotification} style={styles.emptyImage} />
        <AppText style={styles.emptyText}>Không có tin tức nào được tìm thấy</AppText>
      </View>
    );
  }, [type]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={Colors.gray5} />
          <AppText style={styles.footerText}>Đang tải thêm</AppText>
        </View>
      );
    }
    if (outOfData && listNotification?.length) {
      return (
        <View style={styles.footerContainer}>
          <AppText style={styles.footerText}>Hết danh sách thông báo</AppText>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, listNotification?.length, outOfData]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <ItemNotification
          item={item}
          onPressDetail={onPressDetail}
          onPressFlag={onPressFlag}
          isHideFlag={isHideFlag}
        />
      );
    },
    [isHideFlag, onPressDetail, onPressFlag],
  );

  const keyExtractor = useCallback((item) => {
    return item?.uid;
  }, []);

  const onLoadMore = useCallback(() => {
    const createTime = lastItemNotification?.createTime ? lastItemNotification?.createTime - 1 : 0;

    if (
      !createTime ||
      isLoading ||
      isRefreshing ||
      isRefreshing ||
      isLoadingMore ||
      outOfData ||
      keyword?.length
    ) {
      return;
    }

    setIsLoadingMore(true);
    dispatch(
      getListNotification(category, type, createTime, true, keyword, (isSuccess, _outOfData) => {
        setIsLoadingMore(false);
        setOutOfData(_outOfData);
      }),
    );
  }, [
    category,
    dispatch,
    isLoading,
    isLoadingMore,
    isRefreshing,
    keyword,
    lastItemNotification?.createTime,
    outOfData,
    type,
  ]);

  const onRefresh = useCallback(
    (refresh = true) => {
      const setState = refresh ? setIsRefreshing : setIsLoading;
      if (refresh) {
        setOutOfData(false);
      }

      setState(true);

      dispatch(
        getListNotification(
          category,
          type,
          Math.floor(Date.now() / 1000),
          false,
          keyword,
          (isSuccess, _outOfData) => {
            setState(false);
            setOutOfData(_outOfData);
          },
          isUnread,
        ),
      );
    },
    [category, dispatch, isUnread, keyword, type],
  );

  useEffect(() => {
    onRefresh(false);
  }, [onRefresh]);

  if (!listNotification?.length && isLoading) {
    return <ActivityIndicator style={{ marginTop: SH(4) }} color={Colors.gray5} />;
  }

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: insets?.bottom || SH(20) }}
      data={listNotification}
      refreshing={isLoading || isRefreshing}
      onRefresh={onRefresh}
      renderItem={renderItem}
      onEndReached={onLoadMore}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
});

export default ListNotification;

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SH(210),
  },
  emptyPinImage: {
    width: SW(305),
    height: SH(165),
    resizeMode: 'contain',
  },
  emptyImage: {
    width: SW(120),
    height: SH(90),
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray5,
    marginTop: SH(16),
  },
  footerContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SH(12),
    marginHorizontal: SW(16),
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray5,
    marginLeft: SW(8),
    lineHeight: 20,
  },
});
