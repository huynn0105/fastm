import { TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import AppText from '../../../componentV3/AppText';
import CustomRadioButton from '../../../componentV3/RadioButton/RadioButton.View';
import Colors from '../../../theme/Color';
import styles from '../MTradeDetailProduct.styles';

const ItemAttribute = memo((props) => {
  const { item, valueSelected, onPressItem } = props;

  const renderItemAttributeValue = useCallback(
    (_item) => {
      const isSelected = _item?.value === valueSelected;

      const onPress = () => {
        if (isSelected) return;
        onPressItem?.(item, _item);
      };

      return (
        <TouchableWithoutFeedback onPress={onPress}>
          <View
            style={{
              marginRight: 16,
              marginVertical: 4,
              height: 44,
              justifyContent: 'center',
            }}
          >
            <View style={styles.attributeItemValueWrapper} />
            <CustomRadioButton
              label={_item?.value}
              valueWrapperStyle={{ flex: 0 }}
              radioWrapperStyle={{
                paddingRight: 16,
                backgroundColor: Colors.primary5,
                borderRadius: 20,
                marginTop: 0,
              }}
              valueTextStyle={{ color: Colors.gray1 }}
              isSelected={isSelected}
              onPress={onPress}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [item, onPressItem, valueSelected],
  );

  return (
    <View style={styles.attributeItemWrapper}>
      <AppText style={styles.attributeTitle}>
        {item?.name} <AppText style={{ color: Colors.sixRed }}>*</AppText>
      </AppText>
      <View style={styles.listAttributeValueWrapper}>
        {item?.option?.map(renderItemAttributeValue)}
      </View>
    </View>
  );
});

export default ItemAttribute;
