import React from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import HTML from 'react-native-render-html';
import { ICON_PATH } from '../../assets/path';
import { fonts } from '../../constants/configs';
import { SH, SW } from '../../constants/styles';
import { logEvent } from '../../tracking/Firebase';
import { eventName } from '../../constants/keys';
const FinancesVertList = ({ data, onPressItem }) => {
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (index === 0) {
            logEvent(eventName.INTRODUCE_LOAN_PRODUCT);
          }
          if (index === 2) {
            logEvent(eventName.VIEW_PRODUCT_LOAN);
          }
          onPressItem(item);
        }}
      >
        <View style={styles.itemContainer}>
          <FastImage
            source={{ uri: item?.iconURL }}
            style={{
              width: SW(24),
              height: SW(24),
              marginRight: SW(10),
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.content}>
            <HTML
              html={item?.titleHtml}
              tagsStyles={{
                a: { textDecorationLine: 'none' },
                b: { margin: 0 },
                p: { margin: SW(6) },
                h1: { margin: 0 },
                h2: { margin: 0 },
                h3: { margin: 0 },
                h4: { margin: 0 },
                h6: { margin: 0 },
                span: { margin: 0 },
              }}
            />
            <HTML
              html={item?.descHtml}
              tagsStyles={{
                a: { textDecorationLine: 'none' },
                b: { margin: 0 },
                p: { margin: 6, fontFamily: fonts.regular },
                h1: { margin: 0 },
                h2: { margin: 0 },
                h3: { margin: 0 },
                h4: { margin: 0 },
                h6: { margin: 0 },
                span: { margin: 0 },
              }}
            />
          </View>
          <Image
            source={ICON_PATH.arrow_right}
            style={{ width: SW(14), height: SH(14), resizeMode: 'contain' }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const rendeItemSeparatorComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 0.5,
          opacity: 0.8,
          backgroundColor: 'rgb(207, 211, 214)',
        }}
      />
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}${index}`}
        ItemSeparatorComponent={rendeItemSeparatorComponent}
      />
    </View>
  );
};

export default FinancesVertList;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SW(16),
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: SW(10),
  },
  itemContainer: {
    paddingVertical: SH(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});
