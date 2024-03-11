import React from 'react';
import { Text, StyleSheet, PixelRatio } from 'react-native';
import { BouncingButton } from '../BouncingButton';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

export const MobileCardItem = (props) => {
  const { containerStyle, index, totalPrice, discountedPrice, isSelected, onPress } = props;

  return (
    <BouncingButton
      style={{
        ...styles.mobileCardItem,
        ...containerStyle,
        backgroundColor: isSelected ? Colors.primary2 : '#E6EBFF',
      }}
      onPress={() => {
        onPress(index);
      }}
    >
      <AppText
        style={{
          ...TextStyles.heading3,
          color: isSelected ? Colors.primary5 : Colors.primary4,
          fontSize: PixelRatio.get() <= 2 ? 15 : 17,
        }}
      >
        {totalPrice}
      </AppText>
      <AppText
        style={{
          ...TextStyles.normalTitle,
          color: isSelected ? Colors.primary5 : `${Colors.primary4}44`,
          fontSize: PixelRatio.get() <= 2 ? 10 : 12,
        }}
      >
        {discountedPrice}
      </AppText>
    </BouncingButton>
  );
};

const styles = StyleSheet.create({
  mobileCardItem: {
    flex: 1,
    borderRadius: 2,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
