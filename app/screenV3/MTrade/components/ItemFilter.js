import { Alert, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { SW } from '../../../constants/styles';
import { isArray, isEqual } from 'lodash';

const ItemFilter = memo((props) => {
  const { item, filterSelected, onChangeFilter, renderSubFilter } = props;
  const { title, list, inputs, keyword, multiSelect } = item;
  const [subFilter, setSubFilter] = useState({});

  const onPressItem = useCallback(
    (_item, isActive) => () => {
      let newFilter;
      if (multiSelect) {
        if (isActive) {
          newFilter = filterSelected?.filter((_code) => _code !== _item?.code);
        } else {
          newFilter = [...(filterSelected || []), _item?.code];
        }
      } else {
        if (isActive) {
          newFilter = [];
          setSubFilter({});
        } else {
          if (_item?.subGroup) {
            setSubFilter(_item?.subGroup);
            onChangeFilter(_item?.subGroup?.keyword, []);
          }
          newFilter = _item?.price || [_item?.code];
        }
      }
      onChangeFilter(keyword, newFilter);
    },
    [filterSelected, keyword, multiSelect, onChangeFilter],
  );

  const onChangeText = useCallback(
    (_item) => (text) => {
      let newFilter = [...(filterSelected || [])];

      newFilter[_item?.index] = text;
      onChangeFilter(keyword, newFilter);
    },
    [filterSelected, keyword, onChangeFilter],
  );

  const renderItem = useCallback(
    (_item) => {
      let isActive = false;
      if (_item?.code) {
        if (typeof filterSelected === 'string' || isArray(filterSelected)) {
          isActive = filterSelected?.includes(_item?.code);
        }
      } else if (_item?.price) {
        if (isArray(filterSelected)) {
          isActive = isEqual(filterSelected, _item?.price);
        }
      }
      return (
        <TouchableWithoutFeedback key={_item?.code} onPress={onPressItem(_item, isActive)}>
          <View style={[styles.itemContainer, isActive && { backgroundColor: Colors.primary2 }]}>
            <AppText
              medium={isActive}
              style={[styles.itemTitle, isActive && { color: Colors.primary5 }]}
            >
              {_item?.name}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [filterSelected, onPressItem],
  );

  const renderItemInput = useCallback(
    (_item, _index) => {
      const value = filterSelected?.[_item?.index];
      return (
        <ItemInput key={_index} item={_item} value={value} onChangeText={onChangeText(_item)} />
      );
    },
    [filterSelected, onChangeText],
  );

  const onShowSubFilterInit = useCallback(() => {
    if (!multiSelect) {
      for (let i = 0; i < list?.length; i++) {
        const _item = list[i];
        let isActive = false;
        if (_item?.code) {
          if (typeof filterSelected === 'string' || isArray(filterSelected)) {
            isActive = filterSelected?.includes(_item?.code);
          }
        } else if (_item?.price) {
          if (isArray(filterSelected)) {
            isActive = isEqual(filterSelected, _item?.price);
          }
        }

        if (_item?.subGroup && isActive) {
          setSubFilter(_item?.subGroup);
          break;
        }
      }
    }
  }, [filterSelected, list, multiSelect]);

  useEffect(() => {
    onShowSubFilterInit();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <AppText semiBold style={styles.title}>
          {title}
        </AppText>
        {inputs?.length ? (
          <View style={styles.listInputContainer}>{inputs?.map(renderItemInput)}</View>
        ) : null}
        {list?.length ? <View style={styles.listContainer}>{list?.map(renderItem)}</View> : null}
      </View>
      {subFilter?.keyword ? renderSubFilter?.(subFilter) : null}
    </>
  );
});

export default ItemFilter;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  itemContainer: {
    marginTop: 8,
    backgroundColor: Colors.primary5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  itemInputContainer: {
    width: SW(136),
    height: 36,
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral3,
    marginTop: 8,
  },
  itemInput: {
    flex: 1,
    paddingHorizontal: 12,
  },
});

const ItemInput = memo((props) => {
  const { item, value, onChangeText } = props;
  const { placeholder, keyboardType } = item;

  const [isFocus, setIsFocus] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocus(true);
  }, []);
  const onBlur = useCallback(() => {
    setIsFocus(false);
  }, []);

  return (
    <TouchableWithoutFeedback>
      <View
        key={item?.index}
        style={[styles.itemInputContainer, isFocus && { borderColor: Colors.primary2 }]}
      >
        <TextInput
          key={item?.index}
          style={styles.itemInput}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});
