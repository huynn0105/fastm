import AnimatedLottieView from 'lottie-react-native';
import React, { memo } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { SCREEN_WIDTH } from '../../utils/Utils';
import StarAnimation from './StarAnimation';
import NewAnimation from './NewAnimation';

// ---
// [{
//  icon: "https://appay-rc.cloudcms.vn/assets/img/shop_items/item1@3x.png"
//  title: "Mua thẻ cào điện thoại"
//  url: "https://appay-rc.cloudcms.vn/mobile_card"
// }]

const GridList = memo((props) => {
  const {
    title,
    titleGroupStyle,
    loading,
    items,
    perRow = 5,
    maxRows = 1000,
    alias,
    style = {},
    styleItem = {},
  } = props;

  const onItemPress = (item, alias) => {
    const { onPressItem } = props;
    if (onPressItem) {
      onPressItem(item, alias);
    }
  };

  const groupItems = (items = [], perRow = 5, maxRows = 1000) => {
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

  const renderGroupedItems = (groupedItems, onPressItem, alias) => {
    return groupedItems.map((items, index) => {
      return (
        <View key={items[0].title} style={styles.content}>
          {items.map((item, index) => {
            const onPress = () => {
              onPressItem(item, item.title, item.url, alias);
            };
            return renderBuyCardItem(
              item.icon,
              item.title,
              onPress,
              item?.highlight,
              item?.extra_config?.badge,
              alias,
              item?.extra_config?.hot_text,
              index,
              item?.extra_config?.hot_text,
              item?.extra_config?.badge_color,
              item?.extra_config?.icon_opacity,
              item?.star,
              typeof item?.disable === 'boolean' ? item?.disable : false,
            );
          })}
        </View>
      );
    });
  };

  const renderBuyCardItem = (
    img,
    title,
    onPress,
    isHighLight = false,
    badge,
    alias,
    hotText,
    index,
    _hotText,
    badgeColor,
    iconOpacity,
    star,
    disabled,
  ) => {
    const { iconStyle, titleStyle, cardStyle, perRow = 5 } = props;
    if (!img || !title) {
      return renderBuyComingCardItem(img, title, onPress);
    }
    const spaceDivider = 0;
    const widthItem = (SCREEN_WIDTH - spaceDivider * perRow) / perRow;
    const isFinanceItems = alias === 'finance';
    const isMTradeItems = alias === 'merchandise';

    return (
      <View>
        <TouchableOpacity
          disabled={disabled}
          key={title}
          style={[
            styles.card,
            { width: widthItem, marginRight: spaceDivider },
            {
              paddingBottom: isFinanceItems ? SH(4) : SH(6),
              paddingTop: isFinanceItems ? SH(4) : SH(6),
            },
            styleItem,
          ]}
          onPress={onPress}
        >
          {isHighLight ? (
            <AnimatedLottieView
              source={ICON_PATH.light}
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}
              autoPlay
              loop
            />
          ) : null}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              <FastImage
                style={[
                  iconStyle,
                  {
                    width: isFinanceItems ? 50 : isMTradeItems ? 40 : 28,
                    height: isFinanceItems ? 32 : isMTradeItems ? 40 : 28,
                  },
                  (typeof iconOpacity === 'number' ||
                    (typeof iconOpacity === 'string' && iconOpacity?.length > 0)) && {
                    opacity: Number(`${iconOpacity || 0}`),
                  },
                ]}
                source={{ uri: img }}
                resizeMode={'contain'}
              />
              {isMTradeItems ? (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40 / 2,
                    position: 'absolute',
                    backgroundColor: Colors.neutral5,
                    zIndex: -1,
                  }}
                />
              ) : null}
            </View>
            {isFinanceItems ? null : (
              <AppText
                style={[
                  title.includes('\n') ? {} : { paddingTop: SH(6) },
                  {
                    ...TextStyles.caption2,
                    textAlign: 'center',
                    opacity: 0.8,
                    ...titleStyle,
                    color: '#090934',
                  },
                ]}
              >
                {title?.split('{{br}}')?.join('\n')}
              </AppText>
            )}
            {star ? <StarAnimation /> : null}
          </View>

          {badge?.length ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: SH(2),
                paddingBottom: isFinanceItems ? SH(4) : 0,
              }}
            >
              <AppText
                semiBold
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  color: badgeColor?.length ? badgeColor : Colors.secondGreen,
                }}
              >
                {`${badge}`}
              </AppText>
            </View>
          ) : isFinanceItems ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: SH(2),
              }}
            >
              <AppText
                semiBold
                style={{ fontSize: SH(12), lineHeight: SH(16), color: Colors.secondGreen }}
              ></AppText>
            </View>
          ) : null}
          {hotText?.length ? (
            <View
              style={{
                position: 'absolute',
                top: 8,
                borderRadius: 9.5,
                padding: 3,
                left: widthItem / 2,
                backgroundColor: Colors?.secondRed,
              }}
            >
              <AppText
                style={{
                  fontSize: SH(11),
                  color: '#fff',
                }}
              >
                {hotText}
              </AppText>
            </View>
          ) : null}
        </TouchableOpacity>
        {isHighLight ? <NewAnimation /> : null}
      </View>
    );
  };
  const renderBuyComingCardItem = () => {
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

  return (
    <View style={[styles.container, style]}>
      {title ? (
        <View style={styles.titleContainer}>
          <AppText style={[styles.titleText, titleGroupStyle]}>{title}</AppText>
          {loading ? <ActivityIndicator size="small" color="#555" /> : null}
        </View>
      ) : null}
      {renderGroupedItems(
        groupItems(items, perRow, maxRows),
        (item) => onItemPress(item, alias),
        alias,
      )}
    </View>
  );
});

export default GridList;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 12,
    backgroundColor: '#fff',
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
    paddingTop: 4,
    paddingBottom: 16,
    fontWeight: '500',
    color: '#7F7F7F',
    backgroundColor: '#0000',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    height: '100%',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#e2e2e244',
    paddingHorizontal: SW(2),
    backgroundColor: '#fff',
  },
});
