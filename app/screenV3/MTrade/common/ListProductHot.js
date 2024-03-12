import { FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import HeaderSection from '../components/HeaderSection';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';
import { formatNumber } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';
import LinearGradient from 'react-native-linear-gradient';
import ItemTag from '../components/ItemTag';
import { getListMTradeProduct } from '../../../redux/actions/actionsV3/mtradeAction';
import { useDispatch } from 'react-redux';

const group = 'productHot';

const ListProductHot = memo((props) => {
  const { onPressAll, navigation } = props;

  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const _onPressAll = useCallback(() => {
    onPressAll?.(group, 'Sản phẩm nổi bật');
  }, [onPressAll]);

  const keyExtractor = useCallback((item) => item?.id, []);

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
            <LinearGradient
              style={styles.itemBottomContainer}
              colors={item?.highlight ? ['#ffffff', '#e0ecff'] : ['#ffffff', '#ffffff']}
            >
              {item?.paymentMethod?.paynow ? (
                <ItemTag title={'Trả ngay'} color={'#f58b14'} backgroundColor={'#fdecd8'} />
              ) : null}
              {item?.paymentMethod?.paylater ? (
                <ItemTag title={'Trả chậm'} color={'#005fff'} backgroundColor={'#e0ecff'} />
              ) : null}
            </LinearGradient>
            <Image source={{ uri: item?.image }} style={styles.itemImage} />
            <AppText style={styles.itemTitle} numberOfLines={item?.promotion ? 1 : 2} medium>
              {item?.name}
            </AppText>
            {item?.contest ? <HTMLView style={styles.itemPromotion} html={item?.contest} /> : null}
            <View style={styles.itemPriceContainer}>
              <AppText style={styles.itemPrice} semiBold numberOfLines={1}>
                {formatNumber(item?.price)} đ
              </AppText>
              <View style={styles.row}>
                <Image style={styles.itemIconBonus} source={ICON_PATH.bonus} />
                <AppText style={styles.itemBonus} semiBold>
                  {formatNumber(item?.comm || 0)}
                  {item?.currency}
                </AppText>
              </View>
            </View>
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
          setData(results);
        }
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  if (!data?.length) return null;

  return (
    <View>
      <HeaderSection title={'Sản phẩm nổi bật'} onPressAll={_onPressAll} />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

export default ListProductHot;

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 8,
    width: 180,
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 40,
  },
  itemImage: {
    width: '100%',
    height: 180,
  },
  itemTitle: {
    marginTop: 12,
    marginHorizontal: 12,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  itemPromotion: {
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.sixRed,
    flex: 1,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBonus: {
    fontSize: 16,
    lineHeight: 24,
    color: '#00b886',
  },
  itemIconBonus: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  itemBottom: {
    flex: 1,
  },
  itemBottomContainer: {
    position: 'absolute',
    bottom: 0,
    height: 48,
    width: '100%',
    flexDirection: 'row',
    paddingTop: 18,
    paddingHorizontal: 12,
  },
});
