import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { useCallback } from 'react';
import AppText from '../../../componentV3/AppText';

const WheelPick = memo((props) => {
  const {
    data,
    onSelected,
    onPressSelected,
    initIdSelected,
    viewEmpty,
    itemHeight = 40,
    textColorActive = Colors.gray1,
  } = props;

  const [listData, setListData] = useState([]);
  const [initIndex, setInitIndex] = useState(0);

  const onValueChange = useCallback(
    (item, index) => {
      setListData((prev) => {
        let newState = [...prev];
        newState = newState?.map((it) => {
          if (it?.id === item?.id) {
            onSelected?.(it?.id);
            return {
              ...it,
              isSelected: true,
            };
          }
          if (it?.isSelected) {
            return {
              ...it,
              isSelected: false,
            };
          }
          return it;
        });

        return newState;
      });
    },
    [onSelected],
  );

  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    (item) => {
      return (
        <TouchableWithoutFeedback onPress={() => onPressSelected?.(item?.id)}>
          <AppText
            bold={item?.isSelected}
            style={[styles.itemText, item?.isSelected && { color: textColorActive }]}
          >
            {item?.title}
          </AppText>
        </TouchableWithoutFeedback>
      );
    },
    [onPressSelected, textColorActive],
  );

  useEffect(() => {
    let listTemp = [...data];
    let initIndexTemp = 0;
    if (initIdSelected) {
      listTemp = listTemp?.map((item, index) => {
        if (item?.id === initIdSelected) {
          initIndexTemp = index;
          return { ...item, isSelected: true };
        }
        if (item?.isSelected) {
          return {
            ...item,
            isSelected: false,
          };
        }
        return item;
      });
    }
    setInitIndex(initIndexTemp);
    onSelected?.(initIdSelected);
    setListData(listTemp);
  }, [data, initIdSelected, onSelected]);

  return (
    <View style={{ paddingBottom: insets.bottom || SH(20) }}>
      {listData?.length ? (
        <ScrollPicker
          style={styles.container}
          dataSource={listData}
          renderItem={renderItem}
          itemHeight={itemHeight}
          wrapperHeight={250}
          onValueChange={onValueChange}
          highlightColor={Colors.neutral3}
          selectedIndex={initIndex}
          wrapperColor={Colors.neutral5}
        />
      ) : viewEmpty ? (
        viewEmpty
      ) : null}
    </View>
  );
});

export default WheelPick;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingTop: SH(16),
    paddingHorizontal: SW(16),
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
    textAlign: 'center',
  },
});
