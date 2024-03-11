import React, { useCallback } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { styles } from '../RSMPushMessage.style';
import RSMItem from './RSMItem';

const ListCTV = ({ listCTV, onDelete, onShowAll, isShowAll, totalLength }) => {
  const renderItem = useCallback(
    ({ item }, hideRemoveButton = true) => {
      return (
        <RSMItem
          item={item}
          onDelete={onDelete}
          hideRemoveButton={hideRemoveButton && (totalLength > 10 || totalLength === 0)}
        />
      );
    },
    [onDelete, totalLength],
  );
  //   const arrayListRender = convertRowArray();
  //   console.log('ne ne', arrayListRender);

  const renderButtonShowAll = useCallback(() => {
    if (!isShowAll) return null;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: SCREEN_WIDTH - SW(32),
        }}
      >
        <TouchableOpacity style={styles.containerShowAll} onPress={() => onShowAll && onShowAll()}>
          <AppText style={styles.textShowAll}>Xem tất cả</AppText>
        </TouchableOpacity>
      </View>
    );
  }, [isShowAll, onShowAll]);

  return (
    <>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={listCTV?.slice(0, 10)}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID}
        contentContainerStyle={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          marginTop: SH(24),
        }}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        ListFooterComponent={renderButtonShowAll}
      />
    </>
  );
};

export default ListCTV;
