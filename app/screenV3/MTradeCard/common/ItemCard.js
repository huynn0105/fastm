import { ActivityIndicator, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import CheckBoxSquare from '../../../componentV3/CheckBoxSquare';
import Colors from '../../../theme/Color';
import { formatNumber } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';
import DashedHorizontal from '../../../componentV3/DashedHorizontal/DashedHorizontal';
import Indicator from '../../../componentV3/Indicator/Indicator';

const ItemCard = memo((props) => {
  const { item, index, isSelected, onSelect, onDetail, onDelete } = props;
  const { name, productImg, price, quantity, productInvalid } = item;

  const [isDeleting, setIsDeleting] = useState(false);

  const _onDelete = useCallback(() => {
    setIsDeleting(true);
    onDelete?.(() => {
      setIsDeleting(false);
    });
  }, [onDelete]);

  return (
    <TouchableWithoutFeedback onPress={onDetail}>
      <View style={[styles.container, index === 0 && { paddingTop: 0 }]}>
        <TouchableWithoutFeedback onPress={onSelect} disabled={productInvalid}>
          <View style={{ justifyContent: 'center' }}>
            <CheckBoxSquare
              disabled={productInvalid}
              isSelected={isSelected}
              style={{ marginTop: 0 }}
              checkboxStyle={{ marginRight: 16 }}
              onChangeValue={onSelect}
            />
          </View>
        </TouchableWithoutFeedback>
        <Image style={styles.image} source={{ uri: productImg }} />
        <View style={styles.infoContainer}>
          <AppText style={styles.title} numberOfLines={2}>
            {name}
          </AppText>
          <AppText medium style={styles.price} numberOfLines={1}>
            {formatNumber(price)} đ
          </AppText>
          <View style={styles.deleteContainer}>
            {productInvalid ? (
              <View style={styles.invalidContainer}>
                <Image source={ICON_PATH.warning} style={styles.iconInvalid} />
                <AppText style={styles.textInvalid}>Tạm hết hàng</AppText>
              </View>
            ) : (
              <AppText style={styles.quantity} numberOfLines={1}>
                Số lượng:{' '}
                <AppText style={[styles.quantity, { color: Colors.gray1 }]}>{quantity}</AppText>
              </AppText>
            )}
            <TouchableWithoutFeedback disabled={isDeleting} onPress={_onDelete}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={styles.quantity}>Xóa</AppText>
                {isDeleting ? (
                  <Indicator style={styles.delete} />
                ) : (
                  <Image source={ICON_PATH.trash2} style={styles.delete} />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <DashedHorizontal size={1.5} />
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  infoContainer: {
    flex: 1,
    height: '100%',
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  image: {
    width: 84,
    height: 84,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary5,
  },
  price: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
    marginTop: 4,
  },
  quantity: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delete: {
    marginLeft: 4,
    width: 24,
    height: 24,
  },
  invalidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInvalid: {
    tintColor: Colors.sixRed,
    width: 16,
    height: 16,
  },
  textInvalid: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.sixRed,
    marginLeft: 4,
  },
});
