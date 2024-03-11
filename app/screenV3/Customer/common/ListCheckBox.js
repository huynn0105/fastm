import { FlatList, LayoutAnimation, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { Image } from 'react-native';
import { ICON_PATH } from '../../../assets/path';

const ListCheckBox = memo((props) => {
  const { title, data, onCheckboxSelected, hideButtonAll, initIdsSelected, vertical, isCheckBox } =
    props;
  const insets = useSafeAreaInsets();

  const [listCheckbox, setListCheckbox] = useState(data);
  const [isAll, setIsAll] = useState(false);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item?.isSelected;
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            if (item?.id === 'all') {
              setListCheckbox((prevState) => {
                const newState = prevState.map((it) => {
                  return { ...it, isSelected: !isAll };
                });
                const idsSelected = newState?.filter((it) => it?.isSelected).map((it) => it.id);
                onCheckboxSelected?.(idsSelected);
                return newState;
              });
            } else {
              setListCheckbox((prevState) => {
                let newState = [...prevState];

                newState = newState.map((it) => {
                  if (it.id === item.id) {
                    return { ...it, isSelected: !isSelected };
                  } else if (isCheckBox && it?.isSelected) {
                    return { ...it, isSelected: false };
                  }
                  return it;
                });

                const idsSelected = newState.filter((it) => it.isSelected).map((it) => it.id);

                onCheckboxSelected?.(idsSelected);
                return newState;
              });
            }
          }}
        >
          <View style={[styles.checkboxContainer, isSelected && styles.checkboxActiveContainer]}>
            {isSelected ? <Image source={ICON_PATH.tick2} style={styles.iconTick} /> : null}
          </View>
          <AppText numberOfLines={1} style={styles.itemValue}>
            {item?.title}
          </AppText>
        </TouchableOpacity>
      );
    },
    [isAll, onCheckboxSelected],
  );

  const renderFooter = useCallback(() => {
    if (hideButtonAll) return null;
    return (
      <View>
        <View style={styles.line}></View>
        {renderItem({ item: { id: 'all', title: `Tất cả ${title || ''}`, isSelected: isAll } })}
      </View>
    );
  }, [hideButtonAll, isAll, renderItem, title]);

  const keyExtractor = useCallback((item) => item?.id, []);

  useEffect(() => {
    let listTemp = data;
    if (initIdsSelected?.length) {
      listTemp = listTemp?.map((item) =>
        initIdsSelected.includes(item?.id)
          ? { ...item, isSelected: true }
          : item?.isSelected
          ? {
              ...item,
              isSelected: false,
            }
          : item,
      );
    }
    setListCheckbox(listTemp);
    const idsSelected = listTemp.filter((it) => it?.isSelected).map((it) => it?.id);
    onCheckboxSelected?.(idsSelected);
  }, [data, initIdsSelected, onCheckboxSelected]);

  useEffect(() => {
    const lengthItemSelected = listCheckbox.filter((it) => it.isSelected).length;
    const lengthItem = listCheckbox.length;
    setIsAll(lengthItemSelected === lengthItem);
  }, [listCheckbox]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || SH(20) }]}>
      {title ? <AppText style={styles.title}>Chọn {title}</AppText> : null}
      <FlatList
        data={listCheckbox}
        renderItem={renderItem}
        numColumns={vertical ? 1 : 2}
        ListFooterComponent={renderFooter}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

export default ListCheckBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingTop: SH(16),
    paddingHorizontal: SW(16),
    maxHeight: SH(500),
  },
  title: {
    fontSize: SH(14),
    color: Colors.gray5,
    lineHeight: SH(20),
  },
  itemContainer: {
    flex: 1,
    marginTop: SH(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: SH(16),
    color: Colors.gray5,
    lineHeight: SH(22),
    flex: 1,
  },
  checkboxContainer: {
    width: SH(24),
    height: SH(24),
    backgroundColor: Colors.primary5,
    borderWidth: 1,
    borderColor: Colors.neutral4,
    borderRadius: SH(6),
    marginRight: SW(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActiveContainer: {
    backgroundColor: Colors.primary2,
    borderColor: Colors.primary2,
  },
  iconTick: {
    width: SH(24),
    height: SH(24),
    resizeMode: 'contain',
    tintColor: Colors.primary5,
  },
  line: {
    height: 1,
    backgroundColor: Colors.gray4,
    marginTop: SH(18),
  },
});
