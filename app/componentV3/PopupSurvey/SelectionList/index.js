import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import AppText from '../../AppText';

const SelectionList = ({ params, data, id, step2Answer, onChangeFormSurvey }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const renderItem = (option, id) => {
    const { item, index } = option;

    const isSelected = selectedIndex === index;
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isSelected ? Colors.primary2 : Colors.actionBackground,
          borderRadius: 16,
          marginLeft: index === 0 ? 0 : SW(8),
        }}
        onPress={() => {
          setSelectedIndex(index);
          onChangeFormSurvey(id, item?.value, item?.title);
        }}
      >
        <AppText
          style={{
            fontSize: SH(14),
            lineHeight: SH(17),
            color: isSelected ? Colors.primary5 : Colors.gray2,
            paddingVertical: SH(8),
            paddingHorizontal: SW(12),
          }}
        >
          {item?.title}
        </AppText>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={data}
      renderItem={(item) => renderItem(item, id)}
      horizontal
      keyExtractor={(item, index) => `${index}`}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default SelectionList;
