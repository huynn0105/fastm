import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import NewsRow from '../../../common/NewsRow';
import PlaceholderView from '../../../common/PlaceholderView';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { uniq } from 'lodash';

const FinanceNews = ({ newsList, onItemPress }) => {
  const [indexHeader, setIndexHeader] = useState(0);
  const [headerListMenu, setHeaderListMenu] = useState([]);

  useEffect(() => {
    let list = ['Tất cả'];
    newsList?.forEach((element) => {
      list = uniq([...list, ...(element?.subHashtag ?? [])]);
    });
    setHeaderListMenu(list);
  }, [newsList]);

  const newsRender =
    indexHeader === 0
      ? newsList
      : newsList.filter((item) => item?.subHashtag?.includes(headerListMenu[indexHeader]));
  const renderItem = (news, isSeparatorHidden = false) => {
    return (
      <View style={{}}>
        <NewsRow
          news={news}
          // containerStyle={this.props.itemStyle}
          // separatorStyle={this.props.itemSeparatorStyle}
          isSeparatorHidden={isSeparatorHidden}
          onPress={onItemPress}
        />
        <View style={styles.divider} />
      </View>
    );
  };
  const onChangeIndexMenu = (index) => {
    setIndexHeader(index);
    // onIndexChange(index, item);
  };

  const renderTextMenu = ({ item, index }) => {
    const isSelected = indexHeader === index;
    return (
      <TouchableWithoutFeedback onPress={() => onChangeIndexMenu(index)}>
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
            {item}
          </AppText>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const headerComponent = (title) => {
    return (
      <FlatList
        data={headerListMenu}
        renderItem={renderTextMenu}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: SH(16) }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  };
  return (
    <FlatList
      data={newsRender}
      renderItem={(row) => {
        return renderItem(row.item, false);
      }}
      keyExtractor={(item) => `${item.postID}`}
      ListHeaderComponent={headerComponent()}
      ListEmptyComponent={<PlaceholderView text={'Không có tin tức nào'} />}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#cfd3d6',
    marginVertical: SH(16),
    opacity: 0.6,
  },
  textStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    paddingHorizontal: SW(12),
    paddingVertical: SH(8),
  },
});

export default FinanceNews;
