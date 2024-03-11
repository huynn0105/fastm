import { ColorPropType, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import RSMItem from './RSMItem';
import Colors from '../../../theme/Color';

const ViewBottomSheetListCTV = memo(({ listCTV, onDelete, onLoadMore, totalLength }) => {
  const renderItem = useCallback(
    ({ item }) => {
      return <RSMItem item={item} onDelete={onDelete} />;
    },
    [onDelete],
  );

  return (
    <View style={styles.container}>
      <AppText
        medium
        style={{
          fontSize: SH(14),
          color: Colors.gray5,
        }}
      >
        Danh sách {totalLength} CTV đã chọn
      </AppText>
      <FlatList
        data={listCTV}
        renderItem={(props) => renderItem(props, false)}
        keyExtractor={(item) => item.ID}
        initialNumToRender={25}
        contentContainerStyle={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          marginTop: SH(16),
        }}
        keyboardShouldPersistTaps="handled"
        onEndReached={onLoadMore}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

export default ViewBottomSheetListCTV;

const styles = StyleSheet.create({
  container: {
    paddingTop: SH(13),
    paddingBottom: SH(2),
    maxHeight: SH(440),
  },
});
