import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import AppText from '../AppText';
import Colors from '../../theme/Color';

const ListCheckBox = memo((props) => {
  const {
    disabled,
    data,
    backgroundActiveColor = Colors.primary2,
    backgroundInActiveColor = Colors.neutral5,
    textActiveColor = Colors.primary5,
    textInActiveColor = Colors.gray5,
    fontSize = 14,
    lineHeight = 20,
    style,
    onChangeValue,
  } = props;

  // const [idSelected, setIdSelected] = useState(initValue);

  const renderItem = useCallback(
    (item) => {
      const isSelected = item?.isSelected;
      return (
        <Pressable
          disabled={disabled}
          key={item?.id}
          style={[
            styles.buttonContainer,
            { backgroundColor: isSelected ? backgroundActiveColor : backgroundInActiveColor },
          ]}
          onPress={() => {
            onChangeValue?.(item?.value);
          }}
        >
          <AppText
            medium={isSelected}
            style={{
              color: isSelected ? textActiveColor : textInActiveColor,
              fontSize,
              lineHeight,
            }}
          >
            {item?.label}
          </AppText>
        </Pressable>
      );
    },
    [
      backgroundActiveColor,
      backgroundInActiveColor,
      disabled,
      fontSize,
      lineHeight,
      onChangeValue,
      textActiveColor,
      textInActiveColor,
    ],
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View onT style={[styles.container, style]}>
        {data?.map(renderItem)}
      </View>
    </ScrollView>
  );
});

export default ListCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  buttonContainer: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginRight: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
});
