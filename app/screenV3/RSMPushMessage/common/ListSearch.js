import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { SH } from '../../../constants/styles';
import ItemSearch from './ItemSearch';

const ListSearch = ({ listSearch, onUnselect, onSelect, listIdUnselected }) => {
  const getKeyExtractorListFilter = useCallback((item) => {
    return item?.ID;
  }, []);

  const renderItemFilter = useCallback(
    ({ item, index }) => {
      item.isUnselect = listIdUnselected.includes(item.ID);
      return <ItemSearch item={item} onPressSelect={onSelect} onPressUnselect={onUnselect} />;
    },
    [listIdUnselected, onSelect, onUnselect],
  );
  return (
    <FlatList
      data={listSearch}
      keyExtractor={getKeyExtractorListFilter}
      renderItem={renderItemFilter}
      style={{ height: SH(145), overflow: 'hidden' }}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default ListSearch;
