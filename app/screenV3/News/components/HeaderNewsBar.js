import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableWithoutFeedback, View, Platform } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const HeaderNewsBar = ({ data, onIndexChange, defaultIndex }) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const flatListRef = useRef(null);

  useEffect(() => {
    // setTimeout(() => {
    //   flatListRef?.current?.scrollToIndex({ animated: true, index: defaultIndex });
    // }, 1000);
  }, []);

  const onChangeIndexMenu = (index, item) => {
    setSelectedIndex(index);
    onIndexChange(index, item);
  };
  const renderItem = ({ item, index }) => {
    const isSelected = selectedIndex === index;
    return (
      <TouchableWithoutFeedback onPress={() => onChangeIndexMenu(index, item)}>
        <View
          style={{
            backgroundColor: isSelected ? Colors.primary2 : Colors.primary5,
            marginLeft: index === 0 ? 0 : SW(8),
            borderRadius: 18,
          }}
        >
          <AppText
            style={[
              styles.textStyle,
              {
                color: isSelected ? Colors.primary5 : Colors.primary4,
                opacity: isSelected ? 1 : 0.7,
              },
            ]}
          >
            {item?.title}
          </AppText>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <FlatList
      horizontal
      ref={(ref) => (flatListRef.current = ref)}
      data={data}
      keyExtractor={(item, index) => `${index}`}
      renderItem={renderItem}
      style={{}}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={defaultIndex}
      getItemLayout={(item, index) => ({ length: SH(60), offset: SH(60) * index, index })}
    />
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    paddingHorizontal: SW(12),
    paddingVertical: SH(8),
  },
});

export default HeaderNewsBar;
