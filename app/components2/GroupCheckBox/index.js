import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import TextStyles from '../../theme/TextStyle';

import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const GroupCheckBox = (props) => {
  const { containerStyle, checkBoxItems, selectedIndex = 0, onPress } = props;

  return (
    <View style={{ flexDirection: 'row', ...containerStyle }}>
      {checkBoxItems.map((item, index) => {
        // eslint-disable-next-line no-param-reassign
        item.isSelected = index === selectedIndex;
        const icon = item.isSelected
          ? ICON_PATH.checkbox_ac
          : ICON_PATH.checkbox_round;
        let selectionTextStyle;

        if (item.isSelected === undefined || item.isSelected === null) {
          selectionTextStyle = { ...TextStyles.heading3, fontSize: 16, opacity: 0.8 };
        } else {
          selectionTextStyle = item.isSelected
            ? { ...TextStyles.heading3, fontSize: 16, fontWeight: 'bold', opacity: 1 }
            : { ...TextStyles.heading3, fontSize: 16, fontWeight: 'normal', opacity: 0.6 };
        }

        return (
          <TouchableOpacity
            key={index.toString()}
            activeOpacity={0.2}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 41 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => {
              onPress(index);
            }}
          >
            <Image style={{ width: 24, height: 24 }} source={icon} resizeMode="cover" />
            <AppText style={{ marginLeft: 6, ...selectionTextStyle }}>{item.label}</AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default GroupCheckBox;
