import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListCollaborator } from '../../../redux/actions/actionsV3/collaboratorAction';
import moment from 'moment';
import AppText from '../../../componentV3/AppText';
import ItemListCollaborator from './ItemListCollaborator';
import { DEVICE_EVENT_EMITTER } from '../../../constants/keys';
import { uniqBy } from 'lodash';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';

const ListCollaborator = memo((props) => {
  const { filters, navigation, userId } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [outOfData, setOutOfData] = useState(false);

  const keyExtractor = useCallback((item) => item?.userID, []);

  const renderItem = useCallback(
    ({ item }) => {
      return <ItemListCollaborator item={item} navigation={navigation} />;
    },
    [navigation],
  );

  const renderFooter = useCallback(() => {
    if (isLoadMore) {
      return <ActivityIndicator style={{ marginTop: 8 }} color={Colors.gray5} />;
    } else if (outOfData) {
      return (
        <View style={styles.footerContainer}>
          <AppText style={[styles.footerText, { marginLeft: 0 }]}>Đã tải hết CTV</AppText>
        </View>
      );
    }
    return null;
  }, [isLoadMore, outOfData]);

  const onGetData = useCallback(
    (isRefreshing) => {
      if (!userId || !Object.keys(filters || {})?.length) return;

      const setStateLoading = isRefreshing ? setIsLoading : setIsLoadMore;
      let newPage;
      setPage((prevPage) => {
        if (isRefreshing) {
          newPage = 1;
        } else {
          newPage = (prevPage || 0) + 1;
        }
        if (isRefreshing) {
          setOutOfData(false);
        }
        setStateLoading(true);
        dispatch(
          getListCollaborator(
            userId,
            filters,
            moment().format('YYYY-MM'),
            newPage,
            (isSuccess, result) => {
              setStateLoading(false);
              if (isSuccess) {
                setData((prevState = []) => {
                  if (isRefreshing) {
                    return result;
                  }
                  const newData = [...prevState, ...result];
                  return uniqBy(newData, 'userID');
                });
                if (!result?.length) {
                  setOutOfData(true);
                }
                setPage(newPage);
              } else {
                setOutOfData(true);
              }
            },
          ),
        );

        return newPage;
      });
    },
    [dispatch, filters, userId],
  );

  const onLoadMore = useCallback(() => {
    if (outOfData || isLoadMore || isLoading) return;
    onGetData();
  }, [isLoadMore, isLoading, onGetData, outOfData]);

  useEffect(() => {
    onGetData(true);
    const onRefresh = () => {
      onGetData(true);
    };

    DeviceEventEmitter.addListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onRefresh);
    return () => {
      DeviceEventEmitter.removeListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onRefresh);
    };
  }, [filters]);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      DEVICE_EVENT_EMITTER.HANDLE_LOAD_MORE_LIST_COLLABORATOR,
      onLoadMore,
    );

    return () => {
      DeviceEventEmitter.removeListener(
        DEVICE_EVENT_EMITTER.HANDLE_LOAD_MORE_LIST_COLLABORATOR,
        onLoadMore,
      );
    };
  }, [onLoadMore]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color={Colors.gray5} />
      ) : !data?.length ? (
        <View style={{ alignItems: 'center', marginTop: 36 }}>
          <Image source={ICON_PATH.block} style={{ width: 24, height: 24 }} />
          <AppText style={{ marginTop: 12, fontSize: 14, color: Colors.gray5 }}>
            Không tìm thấy cộng tác viên nào
          </AppText>
        </View>
      ) : (
        <FlatList
          nestedScrollEnabled={false}
          scrollEnabled={false}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
});

export default ListCollaborator;

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  footerContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray5,
    marginLeft: 8,
    lineHeight: 20,
  },
});
