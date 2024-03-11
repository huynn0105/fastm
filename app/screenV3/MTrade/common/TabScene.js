import { StyleSheet, Text, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import ListProduct from './ListProduct';
import { useDispatch } from 'react-redux';
import { getListMTradeProduct } from '../../../redux/actions/actionsV3/mtradeAction';
import ListLoading from '../../../componentV3/ListComponents/ListLoading';
import ListEmpty from '../../../componentV3/ListComponents/ListEmpty';
import { BOTTOM_BAR_HEIGHT } from '../../../screens2/Root/Tabbar';
import { SH } from '../../../constants/styles';

const TabScene = memo(
  forwardRef((props, ref) => {
    const { category = 'all', location, index, navigation, tabBarHeight } = props;
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [outOfData, setOutOfData] = useState(false);

    const renderEmpty = useCallback(() => {
      if (!isLoading) return <ListEmpty title={'Không tìm thấy sản phẩm'} />;
      return <ListLoading title={'Đang tải sản phẩm'} />;
    }, [isLoading]);
    const renderFooter = useCallback(() => {
      if (!isLoadingMore) return null;
      return <ListLoading title={'Đang tải thêm sản phẩm'} />;
    }, [isLoadingMore]);

    const onGetData = useCallback(
      (_page = 1, callback) => {
        const payload = {
          productGroup: [category],
          page: _page,
          provinceCode: location,
        };
        setPage(_page);
        dispatch(
          getListMTradeProduct(payload, (isSuccess, results) => {
            if (isSuccess) {
              setData((prev) => (_page === 1 ? [...results] : [...prev, ...results]));
            }
            if (!isSuccess || !results?.length) {
              setOutOfData(true);
            }
            callback?.(isSuccess, results);
          }),
        );
      },
      [category, dispatch, location],
    );

    const onLoadMore = useCallback(() => {
      if (isLoadingMore || outOfData) return;
      const newPage = page + 1;
      setIsLoadingMore(true);
      onGetData(newPage, () => {
        setIsLoadingMore(false);
      });
    }, [isLoadingMore, onGetData, outOfData, page]);

    useEffect(() => {
      setIsLoading(true);
      onGetData(1, () => {
        setIsLoading(false);
      });
    }, [onGetData]);

    return (
      <ListProduct
        ref={ref}
        index={index}
        data={data}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        navigation={navigation}
        contentContainerStyle={{
          paddingBottom: BOTTOM_BAR_HEIGHT + SH(6) + tabBarHeight,
          marginTop: tabBarHeight,
        }}
      />
    );
  }),
);

export default TabScene;
