import { Image, Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { isDeepLink, SCREEN_WIDTH } from '../../../utils/Utils';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { useDispatch } from 'react-redux';
import { homeNavigate } from '../../../redux/actions/navigation';

const SLIDER_HEIGHT = SCREEN_WIDTH * (208 / 375);

const BannerMTrade = memo((props) => {
  const {
    data = [],
    onPressItem,
    sliderHeight = SLIDER_HEIGHT,
    itemHeight = SLIDER_HEIGHT,
    ...rest
  } = props;
  const [activeSlide, setActiveSlide] = useState(0);

  const dispatch = useDispatch();

  const _onPressItem = useCallback(
    (item, index) => () => {
      if (typeof onPressItem === 'function') {
        onPressItem?.(item, index);
      } else {
        const url = item?.webviewURL;
        if (isDeepLink(url)) {
          Linking.openURL(url);
        } else {
          dispatch(homeNavigate('WebView', { mode: 0, title: item?.name, url }));
        }
      }
    },
    [dispatch, onPressItem],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableWithoutFeedback onPress={_onPressItem(item, index)}>
          <View style={[styles.itemContainer, { height: itemHeight }]}>
            <Image source={{ uri: item?.imageURL || item?.url || item }} style={{ flex: 1 }} />
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [_onPressItem, itemHeight],
  );

  return (
    <View style={styles.container}>
      <Carousel
        layout={'stack'}
        data={data}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        sliderHeight={sliderHeight}
        itemWidth={SCREEN_WIDTH}
        itemHeight={itemHeight}
        onSnapToItem={setActiveSlide}
        autoplay
        autoplayInterval={3000}
        {...rest}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainerStyle}
        dotStyle={styles.paginationDotStyle}
        inactiveDotStyle={styles.paginationInactiveDotStyle}
        inactiveDotOpacity={1}
        inactiveDotScale={0.8}
      />
      {data?.length ? (
        <View style={styles.textContainer}>
          <AppText style={styles.text} medium>
            {activeSlide + 1}/{data?.length}
          </AppText>
        </View>
      ) : null}
    </View>
  );
});

export default BannerMTrade;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  itemContainer: {
    width: SCREEN_WIDTH,
  },
  paginationContainerStyle: {
    position: 'absolute',
    bottom: 12,
    paddingTop: 0,
    paddingBottom: 0,
  },
  paginationDotStyle: {
    height: 3,
    width: 16,
    borderRadius: 6 / 2,
    backgroundColor: Colors.gray5,
  },
  paginationInactiveDotStyle: {
    width: 6,
    backgroundColor: Colors.neutral3,
  },
  textContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(10, 10, 40, 0.4)',
    paddingLeft: 6,
    paddingRight: 5,
    paddingBottom: 1,
    paddingTop: 2,
    borderRadius: 24,
    right: 16,
    bottom: 12,
  },
  text: {
    fontSize: 12,
    color: Colors.primary5,
  },
});
