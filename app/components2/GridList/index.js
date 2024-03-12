import FastImage from 'react-native-fast-image';
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import TextStyles from '../../theme/TextStyle';
import { SCREEN_WIDTH } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';

// ---
// [{
//  icon: "https://appay-rc.cloudcms.vn/assets/img/shop_items/item1@3x.png"
//  title: "Mua thẻ cào điện thoại"
//  url: "https://appay-rc.cloudcms.vn/mobile_card"
// }]

class GridList extends Component {
  onItemPress = (item) => {
    const { onPressItem } = this.props;
    if (onPressItem) {
      onPressItem(item);
    }
  };

  groupItems = (items, perRow = 3, maxRows = 1000) => {
    const groupedItems = [];
    let tempArray = [];
    for (let i = 0; i < items.length; i += 1) {
      if (tempArray.length === perRow) {
        groupedItems.push(tempArray);
        tempArray = [];
      }
      tempArray.push(items[i]);
    }
    // while (tempArray.length > 0 && tempArray.length < perRow) {
    //   tempArray.push({});
    // }
    if (tempArray.length > 0) {
      groupedItems.push(tempArray);
    }
    return groupedItems.slice(0, maxRows);
  };

  renderGroupedItems = (groupedItems, onPressItem) => {
    return groupedItems.map((items) => (
      <View key={items[0].title} style={styles.content}>
        {items.map((item) => {
          const onPress = () => {
            onPressItem(item, item.title, item.url);
          };
          return this.renderBuyCardItem(item.icon, item.title, onPress);
        })}
      </View>
    ));
  };

  renderBuyCardItem = (img, title, onPress) => {
    const { iconStyle, titleStyle, cardStyle, perRow = 3 } = this.props;
    if (!img || !title) {
      return this.renderBuyComingCardItem(img, title, onPress);
    }
    const spaceDivider = 12;
    const widthItem = (SCREEN_WIDTH - 12 - spaceDivider * perRow) / perRow;
    return (
      <TouchableOpacity
        key={title}
        style={[styles.card, cardStyle, { width: widthItem, marginRight: spaceDivider }]}
        onPress={onPress}
      >
        <View>
          <View style={{ alignItems: 'center' }}>
            <FastImage
              style={[styles.image, iconStyle]}
              source={{ uri: img }}
              resizeMode={'contain'}
            />
            <AppText
              style={[
                title.includes('\n') ? {} : { paddingTop: 6 },
                {
                  ...TextStyles.caption2,
                  textAlign: 'center',
                  opacity: 0.8,
                  ...titleStyle,
                },
              ]}
            >
              {title}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderBuyComingCardItem = () => {
    return (
      <TouchableOpacity key={'coming'} style={styles.card}>
        <View>
          <View style={{ alignItems: 'center' }}>
            {/* <Image
              style={[styles.image, { marginBottom: 4, height: '60%', width: '70%' }]}
              source={require('./img/coming.png')}
            />
            */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { title, titleGroupStyle, loading, items, perRow = 3, maxRows = 1000 } = this.props;

    return (
      <View style={[styles.container]}>
        {title ? (
          <View style={[styles.titleContainer]}>
            <AppText style={[styles.titleText, titleGroupStyle]}>{title}</AppText>
            {loading ? <ActivityIndicator size="small" color="#555" /> : null}
          </View>
        ) : null}
        {this.renderGroupedItems(this.groupItems(items, perRow, maxRows), this.onItemPress)}
      </View>
    );
  }
}

export default GridList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 6,
    paddingRight: 6,
  },
  titleText: {
    flex: 1,
    fontSize: 14,
    // paddingLeft: 4,
    // paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 16,
    fontWeight: '500',
    color: '#7F7F7F',
    backgroundColor: '#0000',
  },
  content: {
    flex: 1,
    // width: SCREEN_WIDTH - 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    marginBottom: 4,
    // aspectRatio: 1 / 1,
    resizeMode: 'contain',
    marginTop: 4,
    width: 32,
    height: 32,
  },
  card: {
    height: '100%',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#e2e2e244',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
