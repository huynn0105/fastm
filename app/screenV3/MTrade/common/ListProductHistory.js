import { FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import HeaderSection from '../components/HeaderSection';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { useDispatch, useSelector } from 'react-redux';
import { getListMTradeProduct } from '../../../redux/actions/actionsV3/mtradeAction';
import { SET_LIST_MTRADE_PRODUCT_HISTORY } from '../../../redux/actions/actionsV3/actionTypes';

const group = 'productHistory';

const ListProductHistory = memo((props) => {
  const { onPressAll, navigation } = props;

  const dispatch = useDispatch();

  const listMTradeProductHistory = useSelector(
    (state) => state?.mtradeReducer?.listMTradeProductHistory,
  );

  const _onPressAll = useCallback(() => {
    onPressAll?.(group, 'Sản phẩm xem / mua gần nhất');
  }, [onPressAll]);

  const keyExtractor = useCallback((item) => item?.code, []);

  const onPressItem = useCallback(
    (item) => () => {
      navigation?.navigate('MTradeDetailProduct', {
        product: item,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableWithoutFeedback onPress={onPressItem(item)}>
          <View style={[styles.itemContainer, index === 0 && { marginLeft: 12 }]}>
            <Image source={{ uri: item?.image }} style={styles.itemImage} />
            <AppText style={styles.itemTitle} numberOfLines={2}>
              {item?.name}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [onPressItem],
  );

  const onGetData = useCallback(() => {
    const payload = {
      group,
      page: 1,
    };

    dispatch(
      getListMTradeProduct(payload, (isSuccess, results) => {
        if (isSuccess) {
          dispatch({ type: SET_LIST_MTRADE_PRODUCT_HISTORY, payload: results });
        }
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  if (!listMTradeProductHistory?.length) return null;

  return (
    <View>
      <HeaderSection title={'Sản phẩm xem / mua gần nhất'} onPressAll={_onPressAll} />
      <FlatList
        data={listMTradeProductHistory}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

export default ListProductHistory;

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 8,
    width: 124,
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 100,
  },
  itemTitle: {
    marginVertical: 12,
    marginHorizontal: 12,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
});
