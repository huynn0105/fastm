import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getImage, TAB_TYPE } from '../Customer.constants';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import { SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { useDispatch } from 'react-redux';
import {
  addPriorityCustomer,
  removePriorityCustomer,
} from '../../../redux/actions/actionsV3/customerAction';
import { hidePhoneNumber } from '../../../utils/UIUtils';
import Indicator from '../../../componentV3/Indicator/Indicator';

const ItemListCustomer = memo((props) => {
  const { item, index, onPress, group } = props;
  const { lastProcessText, mobilePhone, fullName, need, isPrioritized, statusText } = item;

  const dispatch = useDispatch();

  const isPriority = useMemo(() => Number(isPrioritized) > 0, [isPrioritized]);

  const [isLoading, setIsLoading] = useState(false);

  const onPressPriority = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    if (isPriority) {
      dispatch(
        removePriorityCustomer(
          item,
          (isSuccess) => {
            setIsLoading(false);
          },
          group,
          group === TAB_TYPE.PRIORITY,
        ),
      );
    } else {
      dispatch(
        addPriorityCustomer(
          item,
          (isSuccess) => {
            setIsLoading(false);
          },
          group,
        ),
      );
    }
  }, [dispatch, group, isLoading, isPriority, item]);

  const onPressPhone = useCallback(() => {
    Linking.openURL(`tel://${mobilePhone}`);
  }, [mobilePhone]);

  const _onPress = useCallback(() => {
    onPress?.(item, index);
  }, [index, item, onPress]);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={_onPress}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: getImage(item) }} style={styles.itemImage} />
      </View>
      <View
        style={[
          styles.itemContainer,
          {
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray4,
            flex: 1,
          },
        ]}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.itemContainer,
              {
                zIndex: 99,
              },
            ]}
          >
            <AppText
              style={[styles.itemName, { maxWidth: '45%' }]}
              numberOfLines={1}
              medium
              ellipsizeMode="middle"
            >
              {fullName}
            </AppText>
            {mobilePhone ? (
              <>
                <View style={styles.dot} />
                <AppText
                  numberOfLines={1}
                  style={[styles.itemName, { flex: 1, color: Colors.gray5 }]}
                >
                  {hidePhoneNumber(mobilePhone)}
                </AppText>
              </>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          <AppText style={styles.itemProductName} numberOfLines={1}>
            {need
              ? need === 'finance'
                ? 'Quan tâm sản phẩm vay'
                : 'Quan tâm sản phẩm bảo hiểm'
              : lastProcessText ||
                statusText ||
                (item?.status === '1'
                  ? 'Thành công'
                  : item?.status === '0'
                  ? 'Đang xử lý'
                  : 'Đã từ chối')}
          </AppText>
        </View>
        <View
          style={[
            styles.itemContainer,
            {
              height: 54,
            },
          ]}
        >
          <TouchableOpacity
            disabled={isLoading}
            style={[styles.itemButtonPriority, { paddingHorizontal: 8 }]}
            onPress={onPressPhone}
          >
            <Image source={ICON_PATH.outlinePhone2} style={styles.itemButtonPriorityIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            style={[
              styles.itemButtonPriority,
              {
                height: '100%',
                paddingLeft: 8,
              },
            ]}
            onPress={onPressPriority}
          >
            <Image
              source={isPriority ? ICON_PATH.boldStar : ICON_PATH.outlineStar}
              style={[
                styles.itemButtonPriorityIcon,
                { tintColor: isPriority ? Colors.thirdGreen : Colors.gray8 },
              ]}
            />
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Indicator />
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ItemListCustomer;

const styles = StyleSheet.create({
  container: {
    height: 54,
    justifyContent: 'center',
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImageContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  itemIconState: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: SW(4),
    height: SW(4),
    borderRadius: SW(2),
    backgroundColor: Colors.neutral3,
    marginHorizontal: SW(6),
  },
  itemName: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemProductName: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.gray5,
    marginTop: 2,
  },
  itemButtonPriority: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  itemButtonPriorityIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  itemArrowRight: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral5,
    left: 8,
  },
});
