import { FlatList, Image, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';
import ItemCard from './common/ItemCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMTradeCard, getListMTradeCard } from '../../redux/actions/actionsV3/mtradeAction';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { SH } from '../../constants/styles';
import ListLoading from '../../componentV3/ListComponents/ListLoading';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import ButtonText from '../../common/ButtonText';
import { defaultNavOptions } from '../../screens2/Root/MainScreen';
import KJButton from '../../components/common/KJButton';
import { formatNumber } from '../../utils/Utils';

const MTradeCard = memo((props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const listMTradeCard = useSelector((state) => state?.mtradeReducer?.listMTradeCard);
  const location = useSelector((state) => state?.mtradeReducer?.location);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [outOfData, setOutOfData] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsSelected, setItemSelected] = useState([]);

  const sumValueItemsSelected = useMemo(() => {
    const price = itemsSelected?.reduce((totalSum, item) => Number(item?.price) + totalSum, 0);
    const quantity = itemsSelected?.reduce(
      (totalSum, item) => Number(item?.quantity) + totalSum,
      0,
    );

    return { price, quantity };
  }, [itemsSelected]);

  const onSelectItem = useCallback(
    (item, isSelected) => () => {
      setItemSelected((prevState) => {
        let newState = [...prevState];
        if (isSelected) {
          newState = newState?.filter((_item) => _item?.ID !== item?.ID);
        } else {
          newState = [...newState, item];
        }
        return newState;
      });
    },
    [],
  );
  const onDetailItem = useCallback(
    (item) => () => {
      navigation?.navigate?.('MTradeDetailProduct', {
        product: {
          ...item,
          productImg: [item?.productImg],
          code: item?.productCode,
        },
      });
    },
    [navigation],
  );
  const onDeleteItem = useCallback(
    (item) => (callback) => {
      const payload = {
        productID: item?.productID,
        quantity: item?.quantity,
        sku: item?.sku,
        ID: item?.ID,
      };
      dispatch(
        deleteMTradeCard(payload, (isSuccess, result) => {
          if (isSuccess) {
            setItemSelected((prevState) => {
              let newState = [...prevState];
              const isSelected = newState?.findIndex((_item) => _item?.ID === item?.ID) !== -1;
              if (isSelected) {
                newState = newState?.filter((_item) => _item?.ID !== item?.ID);
                return newState;
              }
              return prevState;
            });
          }
          callback?.(isSuccess, result);
        }),
      );
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const isSelected = itemsSelected?.findIndex((_item) => _item?.ID === item?.ID) !== -1;

      return (
        <ItemCard
          item={item}
          isSelected={isSelected}
          index={index}
          onSelect={onSelectItem(item, isSelected)}
          onDetail={onDetailItem(item)}
          onDelete={onDeleteItem(item)}
        />
      );
    },
    [itemsSelected, onDeleteItem, onDetailItem, onSelectItem],
  );

  const onGoToMTradeHome = useCallback(() => {
    navigation?.navigate('MTrade');
  }, [navigation]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <ListLoading title={'Đang tải thêm giỏ hàng'} />;
    }
    return null;
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return <ListLoading title={'Đang tải giỏ hàng'} />;
    }

    return (
      <>
        <View style={styles.emptyContainer}>
          <Image source={IMAGE_PATH.mascotProductCard} style={styles.mascot} />
          <AppText style={styles.emptyText}>
            Hiện tại không có sản phẩm nào{'\n'}trong giỏ hàng của bạn
          </AppText>
        </View>
        <ButtonText
          title={'Tiếp tục mua hàng'}
          fontSize={16}
          lineHeight={24}
          medium
          top={24}
          height={50}
          style={{ alignSelf: 'center' }}
          onPress={onGoToMTradeHome}
        />
      </>
    );
  }, [isLoading, onGoToMTradeHome]);

  const onPressPay = useCallback(
    (item) => {
      navigation?.navigate('MTradePayment', {
        products: itemsSelected,
      });
    },
    [itemsSelected, navigation],
  );

  const renderPay = useCallback(() => {
    if (!itemsSelected?.length) return null;
    return (
      <>
        <View style={{ height: BOTTOM_BAR_HEIGHT }} />
        <View style={styles.payContainer}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText style={styles.payText}>
              Số lượng:{'    '}
              <AppText style={[styles.payText, { color: Colors.primary5 }]} medium>
                {sumValueItemsSelected?.quantity}
              </AppText>
            </AppText>
            <AppText style={[styles.payText, { marginTop: 2 }]}>
              Tổng tiền:{'   '}
              <AppText style={[styles.payText, { color: Colors.primary5 }]} medium>
                {formatNumber(sumValueItemsSelected?.price)} đ
              </AppText>
            </AppText>
          </View>
          <ButtonText
            title={'Thanh toán'}
            height={46}
            fontSize={16}
            lineHeight={22}
            onPress={onPressPay}
          />
        </View>
      </>
    );
  }, [
    itemsSelected?.length,
    onPressPay,
    sumValueItemsSelected?.price,
    sumValueItemsSelected?.quantity,
  ]);

  const onGetData = useCallback(
    (_page = 1, callback) => {
      setPage(_page);
      const payload = {
        provinceCode: location,
        page: _page,
      };
      dispatch(
        getListMTradeCard(payload, (isSuccess, result) => {
          callback?.(isSuccess, result);
          if (!isSuccess || !result?.length) {
            setOutOfData(true);
          }
        }),
      );
    },
    [dispatch, location],
  );

  const onLoadMore = useCallback(() => {
    if (isLoadingMore || outOfData) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    onGetData(nextPage, () => {
      setIsLoadingMore(false);
    });
  }, [isLoadingMore, onGetData, outOfData, page]);

  const onRefresh = useCallback(
    (disabledIsRefreshing) => {
      if (isRefreshing) return;
      if (disabledIsRefreshing) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setOutOfData(false);
      onGetData(1, (isSuccess, result) => {
        if (isSuccess) {
          const listCardId = result?.map((item) => item?.ID);
          setItemSelected((prevState) => {
            let newState = [...prevState];

            newState = newState.filter((item) => listCardId?.includes(item?.ID));
            return newState;
          });
        }
        if (disabledIsRefreshing) {
          setIsLoading(false);
        } else {
          setIsRefreshing(false);
        }
      });
    },
    [isRefreshing, onGetData],
  );

  useEffect(() => {
    setIsLoading(true);
    setOutOfData(false);
    onGetData(1, () => {
      setIsLoading(false);
    });
  }, [onGetData]);

  useEffect(() => {
    let subscription;
    subscription = navigation.addListener('didFocus', () => {
      setOutOfData(false);
      onRefresh(true);
    });
    return () => {
      subscription?.remove();
    };
  }, [dispatch, navigation, onRefresh]);

  return (
    <View style={styles.container}>
      {!isLoading && !listMTradeCard?.length ? null : (
        <AppText style={styles.title} semiBold>
          Giỏ hàng của bạn
        </AppText>
      )}
      <FlatList
        data={listMTradeCard}
        renderItem={renderItem}
        onEndReached={onLoadMore}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
      {renderPay()}
    </View>
  );
});

export default MTradeCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  title: {
    marginVertical: 12,
    marginHorizontal: 16,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: BOTTOM_BAR_HEIGHT + SH(6),
  },
  emptyContainer: {
    margin: 16,
    marginTop: 83,
    alignItems: 'center',
    backgroundColor: Colors.primary5,
    borderRadius: 16,
  },
  mascot: {
    width: 140,
    height: 140,
    position: 'absolute',
    top: -67,
  },
  emptyText: {
    marginTop: 90,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.gray1,
    marginBottom: 24,
  },
  payContainer: {
    position: 'absolute',
    backgroundColor: Colors.blue3,
    bottom: BOTTOM_BAR_HEIGHT - SH(16),
    paddingBottom: SH(16) + 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  payText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue6,
  },
});

MTradeCard.navigationOptions = ({ navigation }) => {
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
