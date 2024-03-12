import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/Color';
import HeaderMTrade from '../MTrade/common/HeaderMTrade';
import ModalLocation from '../MTrade/common/ModalLocation';
import ModalMTradeFilter from '../MTrade/common/ModalMTradeFilter';
import ListProduct from '../MTrade/common/ListProduct';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListMTradeProduct,
  resetFilter,
  resetListMTradeProduct,
  resetTextSearch,
  setFilter,
  setLocation,
} from '../../redux/actions/actionsV3/mtradeAction';
import ListLoading from '../../componentV3/ListComponents/ListLoading';
import { IMAGE_PATH } from '../../assets/path';
import { Image } from 'react-native';
import AppText from '../../componentV3/AppText';
import ButtonText from '../../common/ButtonText';
import { defaultNavOptions } from '../../screens2/Root/MainScreen';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { SH } from '../../constants/styles';

const MTradeListProduct = memo((props) => {
  const { navigation } = props;
  const params = useMemo(() => navigation?.state?.params, [navigation?.state?.params]);
  const group = useMemo(() => params?.group, [params?.group]);

  const dispatch = useDispatch();

  const filter = useSelector((state) => state?.mtradeReducer?.filter);
  const textSearch = useSelector((state) => state?.mtradeReducer?.textSearch);
  const location = useSelector((state) => state?.mtradeReducer?.location);

  const modalLocationRef = useRef();
  const modalFilterRef = useRef();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [outOfData, setOutOfData] = useState(false);

  const onPressLocation = useCallback(() => {
    modalLocationRef?.current?.open();
  }, []);

  const onPressFilter = useCallback(() => {
    modalFilterRef?.current?.open(filter);
  }, [filter]);

  const onClosetFilter = useCallback(() => {
    modalFilterRef?.current?.close();
  }, []);

  const onPressSearch = useCallback(() => {
    navigation?.navigate('MTradeSearch', {
      isBack: true,
    });
  }, [navigation]);

  const onPressResetSearch = useCallback(() => {
    setData([]);
    dispatch(resetTextSearch());
  }, [dispatch]);

  const onResetFilter = useCallback(() => {
    onClosetFilter();
    setTimeout(() => {
      setData([]);
      dispatch(resetFilter());
    }, 500);
  }, [dispatch, onClosetFilter]);

  const onSubmitFilter = useCallback(
    (newFilter) => {
      onClosetFilter();
      setTimeout(() => {
        setData([]);
        dispatch(setFilter(newFilter));
      }, 500);
    },
    [dispatch, onClosetFilter],
  );
  const onSubmitLocation = useCallback((newLocation) => {
    setData([]);
  }, []);

  const onGetData = useCallback(
    (_page = 1, callback) => {
      setPage(_page);
      const payload = {
        ...filter,
        group,
        page: _page,
        productName: textSearch,
        provinceCode: location,
      };

      dispatch(
        getListMTradeProduct(payload, (isSuccess, results) => {
          callback?.(results);
          if (isSuccess) {
            setData((prev) => (_page === 1 ? [...results] : [...prev, ...results]));
          }
          if (!isSuccess || !results?.length) {
            setOutOfData(true);
          }
        }),
      );
    },
    [dispatch, filter, group, location, textSearch],
  );

  const onLoadMore = useCallback(() => {
    if (isLoadingMore || outOfData) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    onGetData(nextPage, () => {
      setIsLoadingMore(false);
    });
  }, [isLoadingMore, onGetData, outOfData, page]);

  const onRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setOutOfData(false);
    onGetData(1, () => {
      setIsRefreshing(false);
    });
  }, [isRefreshing, onGetData]);

  const onGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <ListLoading title={'Đang tải thêm sản phẩm'} />;
    }
    return null;
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return <ListLoading title={'Đang tải sản phẩm'} />;
    }
    return (
      <View style={styles.emptyContainer}>
        <Image source={IMAGE_PATH.mascotSleep} style={styles.mascot} />
        <AppText style={styles.emptyText}>Không tìm thấy sản phẩm liên quan</AppText>
        <ButtonText
          title={'Tiếp tục mua hàng'}
          fontSize={16}
          lineHeight={24}
          medium
          onPress={onGoBack}
          top={16}
          height={50}
        />
      </View>
    );
  }, [isLoading, onGoBack]);

  useEffect(() => {
    setData([]);
    setIsLoading(true);
    setOutOfData(false);
    onGetData(1, () => {
      setIsLoading(false);
    });
  }, [onGetData]);

  useEffect(() => {
    return () => {
      dispatch(resetFilter());
      dispatch(resetTextSearch());
    };
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <HeaderMTrade
        onPressLocation={onPressLocation}
        onPressFilter={onPressFilter}
        onPressSearch={onPressSearch}
        textSearch={textSearch}
        onPressResetSearch={onPressResetSearch}
      />
      <View style={styles.bodyContainer}>
        <ListProduct
          useFlatList
          data={data}
          onEndReached={onLoadMore}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          navigation={navigation}
          contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT + SH(6) }}
        />
      </View>
      <ModalLocation ref={modalLocationRef} onSubmitLocation={onSubmitLocation} />
      <ModalMTradeFilter
        ref={modalFilterRef}
        onResetFilter={onResetFilter}
        onSubmitFilter={onSubmitFilter}
      />
    </SafeAreaView>
  );
});

export default MTradeListProduct;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral5 },
  bodyContainer: { flex: 1, marginTop: 8 },
  emptyContainer: {
    marginTop: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  mascot: {
    width: 140,
    height: 140,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.gray1,
  },
});

MTradeListProduct.navigationOptions = ({ navigation }) => {
  const title = navigation?.state?.params?.title || 'MTrade';
  const options = {
    ...defaultNavOptions,
    title,
  };

  return options;
};
