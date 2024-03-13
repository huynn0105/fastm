import { FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import { formatNumber, SCREEN_WIDTH } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';
import LinearGradient from 'react-native-linear-gradient';
import ItemTag from '../components/ItemTag';
import Colors from '../../../theme/Color';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

const HFlatList = HPageViewHoc(FlatList);

const ListProduct = memo(
  forwardRef((props, ref) => {
    const { index, useFlatList, navigation, contentContainerStyle, style, ...rest } = props;

    const CustomFlatList = useMemo(() => (useFlatList ? FlatList : HFlatList), [useFlatList]);

    const onPressItem = useCallback(
      (item) => {
        navigation?.navigate('MTradeDetailProduct', {
          product: item,
        });
      },
      [navigation],
    );

    const renderItem = useCallback(
      ({ item, index: idx }) => {
        return <Item item={item} index={idx} onPress={onPressItem} />;
      },
      [onPressItem],
    );

    return (
      <CustomFlatList
        {...rest}
        ref={ref}
        index={index}
        contentContainerStyle={[styles.contentContainer].concat(contentContainerStyle)}
        style={[styles.container].concat(style)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        removeClippedSubviews
      />
    );
  }),
);

export default ListProduct;

const styles = StyleSheet.create({
  container: { marginHorizontal: 12 },
  contentContainer: { paddingBottom: 12, justifyContent: 'flex-start' },
  itemContainer: {
    width: (SCREEN_WIDTH - 12 * 2 - 4 * 2) / 2, //list margin horizontal 12: 12 * 2, item margin 4 => 2 item: 4 * 2
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
    paddingBottom: 40,
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
  },
  itemTitle: {
    marginTop: 12,
    marginHorizontal: 12,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemPrice: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.sixRed,
    marginHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
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
  itemBottomContainer: {
    position: 'absolute',
    bottom: 0,
    height: 36,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 6,
    paddingHorizontal: 12,
  },
});

const Item = memo((props) => {
  const { item, index, onPress } = props;

  const _onPress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  return (
    <TouchableWithoutFeedback onPress={_onPress}>
      <View
        style={[styles.itemContainer, index % 2 === 0 ? { marginRight: 4 } : { marginLeft: 4 }]}
      >
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
        <AppText style={styles.itemTitle} numberOfLines={2} medium>
          {item?.name}
        </AppText>
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
    </TouchableWithoutFeedback>
  );
});
