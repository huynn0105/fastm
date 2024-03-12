import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import { Pressable } from 'react-native';
import Colors from '../../../theme/Color';
import { LIST_FILTER_PLACEHOLDER } from '../Collaborator.constants';

const ListButtonFilter = memo((props) => {
  const {
    onPress,
    disabled,
    data,
    itemBackgroundColor = Colors.primary5,
    itemTextColor = Colors.gray1,
    style,
    disabledChangeValue,
    isLoading,
    defaultId,
  } = props;

  const [idSelected, setIdSelected] = useState(defaultId);

  const renderItem = useCallback(
    (item) => {
      const isSelected = idSelected === item?.id;
      return (
        <Pressable
          disabled={disabled}
          key={item?.id}
          style={[
            styles.buttonContainer,
            { backgroundColor: isSelected ? Colors.primary2 : itemBackgroundColor },
          ]}
          onPress={() => {
            onPress?.(item?.id);
            if (disabledChangeValue) return;
            setIdSelected(item?.id);
          }}
        >
          <AppText
            medium={isSelected}
            style={[
              styles.title,
              { color: item?.color || (isSelected ? Colors.primary5 : itemTextColor) },
            ]}
          >
            {`${item?.title}`}
          </AppText>
        </Pressable>
      );
    },
    [disabled, disabledChangeValue, idSelected, itemBackgroundColor, itemTextColor, onPress],
  );

  useEffect(() => {
    if (data?.length && !idSelected) {
      setIdSelected(data?.[0]?.id);
    }
  }, [data]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.container, style]}>
        {(isLoading && !data?.length ? LIST_FILTER_PLACEHOLDER : data)?.map(renderItem)}
      </View>
    </ScrollView>
  );
});

export default ListButtonFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    height: 32,
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
