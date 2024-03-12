import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AppText from '../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const ListToolsView = ({ toolList, description, onPressItem }) => {
  const renderItem = useCallback(
    ({ item }) => {
      const { title } = item;
      return (
        <TouchableOpacity
          style={[
            {
              alignItems: 'center',
            },
            toolList?.length >= 4 ? { width: '25%' } : { flex: 1 },
          ]}
          onPress={() => onPressItem(item)}
        >
          <View
            style={[
              styles.containerItem,
              {
                alignItems: 'center',
                marginBottom: SH(20),
              },
            ]}
          >
            <FastImage
              source={{ uri: item?.icon }}
              style={styles.iconStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
            <AppText style={[commonStyle.commonText, { textAlign: 'center', fontSize: SH(12) }]}>
              {title}
            </AppText>
          </View>
        </TouchableOpacity>
      );
    },
    [onPressItem, toolList?.length],
  );

  return (
    <View style={styles.containerView}>
      <View style={styles.paddingView}>
        <AppText style={commonStyle.mediumText}>{description || ''}</AppText>
      </View>

      <FlatList
        data={toolList}
        renderItem={renderItem}
        keyExtractor={(item) => `${item?.TAG_NAME}`}
        numColumns={4}
        scrollEnabled={false}
        style={[
          styles.list,
          toolList?.length === 2 && {
            paddingHorizontal: SW(10),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {
    paddingHorizontal: SW(16),
    alignItems: 'center',
    paddingBottom: SH(24),
    backgroundColor: Colors.actionBackground,
  },
  containerItem: {
    width: SW(80),
  },
  iconStyle: {
    width: SW(32),
    height: SH(32),
    marginBottom: SH(14),
  },
  paddingView: {
    paddingTop: SH(12),
    paddingBottom: SH(16),
  },
  list: {
    flex: 1,
    width: '100%',
  },
});

export default ListToolsView;
