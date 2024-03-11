import React, { useCallback } from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import TextStyles from '../../theme/TextStyle';

import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';

const stylesCommon = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  wrapperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 41,
  },
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
});

const stylesSelected = StyleSheet.create({
  selectionTextStyle: {
    ...TextStyles.heading3,
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 1,
  },
});

const stylesUnSelected = StyleSheet.create({
  selectionTextStyle: {
    ...TextStyles.heading3,
    fontSize: 16,
    fontWeight: 'normal',
    opacity: 0.6,
  },
});

const GroupCheckBox = (props) => {
  const { containerStyle, checkBoxItems, selectedIndex = 0, onPress } = props;

  const onSelected = useCallback(
    (index) => () => {
      onPress(index);
    },
    [onPress],
  );

  return (
    <View style={[stylesCommon.container, { ...containerStyle }]}>
      {checkBoxItems.map((item, index) => {
        const isSelected = index === selectedIndex;
        const styles = isSelected ? stylesSelected : stylesUnSelected;
        const icon = isSelected ? ICON_PATH.checkbox_ac : ICON_PATH.checkbox_round;
        return (
          <TouchableOpacity
            key={index.toString()}
            activeOpacity={0.2}
            style={stylesCommon.wrapperItem}
            hitSlop={stylesCommon.hitSlop}
            onPress={onSelected(index)}
          >
            <Image
              style={{ width: 24, height: 24, tintColor: Colors.primary2, resizeMode: 'contain' }}
              source={icon}
              resizeMode="cover"
            />
            <AppText style={[styles.selectionTextStyle, { marginLeft: 6 }]}>{item.label}</AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default GroupCheckBox;
