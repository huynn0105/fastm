import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Linking, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { SH, SW } from '../../constants/styles';
import { getListMainBanner } from '../../redux/actions/actionsV3/mtradeAction';
import { homeNavigate } from '../../redux/actions/navigation';
import { isDeepLink, IS_ANDROID, SCREEN_WIDTH } from '../../utils/Utils';
import { MONEY_INFO_HEIGHT, USER_INFO_HEIGHT } from './constants';
import ItemBanner from './ItemBanner';
import { Image } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';

const MainBanner = (props) => {
  const { zIndexValue, opacityValue, translateY } = props;

  const [isHideGuideBanner, setIsHideGuideBanner] = useState(false);

  const dispatch = useDispatch();

  const listMainBanner = useSelector((state) => state?.mtradeReducer?.listMainBanner);

  const itemWidth = useMemo(
    () => (listMainBanner?.length === 1 ? SW(328) + 16 : SW(328)),
    [listMainBanner?.length],
  );
  const itemHeight = useMemo(
    () =>
      listMainBanner?.length === 1 ? MONEY_INFO_HEIGHT - SH(20) + 16 : MONEY_INFO_HEIGHT - SH(20),
    [listMainBanner?.length],
  );

  const onPressItem = useCallback(
    (item) => () => {
      if (isDeepLink(item?.newsURL)) {
        Linking.openURL(item?.newsURL);
      } else {
        dispatch(homeNavigate('WebView', { mode: 0, title: item?.newsTitle, url: item?.newsURL }));
      }
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View>
          <ItemBanner
            item={item}
            index={index}
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            onPress={onPressItem(item)}
          />
          {index === 0 && !isHideGuideBanner ? (
            <View
              onTouchStart={() => {
                AsyncStorage.setItem(AsyncStorageKeys.IS_HIDE_GUILD_BANNER, 'true');
                setIsHideGuideBanner(true);
              }}
              style={{
                position: 'absolute',
                width: itemWidth,
                height: itemHeight,
                borderRadius: 20,
                backgroundColor: '#000000CC',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image source={ICON_PATH.fingerSwipe} style={{ width: 40, height: 40 }} />
              <AppText style={{ fontSize: 14, lineHeight: 24, color: Colors.blue6, marginTop: 12 }}>
                Vuốt để xem các sự kiện tiếp theo
              </AppText>
            </View>
          ) : null}
        </View>
      );
    },
    [isHideGuideBanner, itemHeight, itemWidth, onPressItem],
  );

  const scrollInterpolator = useCallback((index, carouselProps) => {
    const range = [3, 2, 1, 0, -1, -2, -3];

    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
  }, []);

  const slideInterpolatedStyle = useCallback((index, animatedValue, carouselProps) => {
    const itemWidthRef = carouselProps.itemWidth;

    const card1Scale = 1;
    const card2Scale = 1;

    const cardOffset = 8;

    const getTranslateXFromScale = (cardIndex, scale) => {
      const centerFactor = (1 / scale) * cardIndex;
      const centeredPosition = -Math.round(itemWidthRef * centerFactor);
      const edgeAlignment = Math.round((itemWidthRef - itemWidthRef * scale) / 2);
      const offset = Math.round((cardOffset * Math.abs(cardIndex)) / scale);

      return centeredPosition + edgeAlignment + offset;
    };

    const getTranslateYFromScale = (cardIndex, scale) => {
      const offset = Math.round((cardOffset * Math.abs(cardIndex)) / scale);

      return scale * offset;
    };

    const opacityOutputRange =
      carouselProps.inactiveSlideOpacity === 1 ? [1, 1, 1, 0] : [1, 0.75, 0.5, 0];

    return {
      zIndex: carouselProps.data.length - index,
      opacity: animatedValue.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: opacityOutputRange,
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1, 2],
            outputRange: [card1Scale, 1, card1Scale, card2Scale],
            extrapolate: 'clamp',
          }),
        },
        {
          translateX: animatedValue.interpolate({
            inputRange: [-1, -0.1, 0, 1, 2, 3],
            outputRange: [
              -itemWidthRef * 0.5,
              -itemWidthRef * 0.01,
              0,
              getTranslateXFromScale(1, card1Scale),
              getTranslateXFromScale(2, card2Scale),
              getTranslateXFromScale(3, card2Scale),
            ],
            extrapolate: 'clamp',
          }),
        },
        {
          translateY: animatedValue.interpolate({
            inputRange: [-1, -0.1, 0, 1, 2, 3],
            outputRange: [
              10,
              10,
              0,
              getTranslateYFromScale(1, card1Scale),
              getTranslateYFromScale(2, card2Scale),
              getTranslateYFromScale(3, card2Scale),
            ],
            extrapolate: 'clamp',
          }),
        },
        {
          rotate: animatedValue.interpolate({
            inputRange: [-0.1, 0],
            outputRange: ['5deg', '0deg'],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }, []);

  const keyExtractor = useCallback((item) => item?.newsID, []);

  const carouselRef = useRef(null);

  const index = useRef(0);
  const [isSnapping, setIsSnapping] = useState(false);

  useEffect(() => {
    dispatch(getListMainBanner());
  }, [dispatch]);

  useEffect(() => {
    AsyncStorage.getItem(AsyncStorageKeys.IS_HIDE_GUILD_BANNER, (error, result) => {
      result = JSON.parse(result);
      setIsHideGuideBanner(!!result);
    });
  }, []);

  useEffect(() => {
    if (isSnapping) return;
    const interval = setInterval(() => {
      index.current++;
      if (index.current < listMainBanner?.length) {
        carouselRef?.current?.snapToNext();
      } else {
        index.current = 0;
        carouselRef?.current?.snapToItem(0);
      }
    }, 5000);

    return () => {
      interval && clearInterval(interval);
    };
  }, [isSnapping, listMainBanner?.length]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: USER_INFO_HEIGHT,
          left: 0,
          right: 0,
          height: MONEY_INFO_HEIGHT,
          zIndex: zIndexValue,
          opacity: opacityValue,
          transform: [
            {
              translateY,
            },
          ],
        },
        itemWidth === SCREEN_WIDTH && styles.shadow,
      ]}
    >
      <Carousel
        ref={carouselRef}
        layout={'stack'}
        data={listMainBanner}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        sliderHeight={MONEY_INFO_HEIGHT}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        slideInterpolatedStyle={slideInterpolatedStyle}
        scrollInterpolator={scrollInterpolator}
        inactiveSlideOpacity={1}
        containerCustomStyle={listMainBanner?.length === 1 ? {} : styles.carouselContainer}
        keyExtractor={keyExtractor}
        enableSnap={true}
        useScrollView={true}
        lockScrollWhileSnapping={true}
        onSnapToItem={(_index) => {
          index.current = _index;
        }}
        onScrollBeginDrag={() => {
          setIsSnapping((prev) => {
            if (prev === true) return prev;
            return true;
          });
        }}
        onScrollEndDrag={() => {
          setIsSnapping((prev) => {
            if (prev === false) return prev;
            return false;
          });
        }}
      />
    </Animated.View>
  );
};

export default MainBanner;

const styles = StyleSheet.create({
  carouselContainer: { marginRight: SW(8), alignSelf: 'center' },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
