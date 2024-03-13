import { Animated, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { MAIN_CATEGORY_HEIGHT, PADDING_SPACE, SEARCH_HEIGHT, USER_INFO_HEIGHT } from './constants';

const MainCategory = memo(
  forwardRef(({ onPress, offsetSections, opacity, zIndexValue, insets }, ref) => {
    const isCloseBottom = useRef(false);
    const scrollViewRef = useRef();
    const listOffsetItem = useRef({});
    const currentOffset = useRef(0);

    const offsetCenter = useRef(0);

    const data = useSelector((state) => state?.mainGroup);

    const [indexActive, setIndexActive] = useState(0);

    const changeOffset = useCallback(
      (y) => {
        if (isCloseBottom.current) return;
        for (let i = 0; i < data?.length; i++) {
          const item = data[i];
          const nextItem = data?.[i + 1];
          const itemOffset = offsetSections?.[item?.alias];

          const nextItemOffset = offsetSections?.[nextItem?.alias];
          if (y >= itemOffset && (!nextItemOffset || y < nextItemOffset)) {
            setIndexActive((prev) => {
              if (prev === i) return prev;

              if (
                listOffsetItem.current[i] > currentOffset.current ||
                listOffsetItem.current[i] < currentOffset.current
              ) {
                scrollViewRef?.current?.scrollTo({
                  x: listOffsetItem.current[i] - offsetCenter.current,
                });
              }
              return i;
            });
            break;
          }
        }
      },
      [offsetSections, data],
    );

    const setLastIndexActive = useCallback(
      (isClose) => {
        isCloseBottom.current = isClose;
        if (isClose) {
          setIndexActive((prev) => {
            const lastIndex = data?.length - 1;
            if (prev === lastIndex) return prev;
            return lastIndex;
          });
        }
      },
      [data?.length],
    );

    useImperativeHandle(ref, () => ({
      changeOffset,
      setLastIndexActive,
    }));

    return (
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        style={{
          zIndex: zIndexValue,
          opacity,
          position: 'absolute',
          top: SEARCH_HEIGHT + (insets.top || PADDING_SPACE),
          height: MAIN_CATEGORY_HEIGHT,
          paddingTop: SH(11) + PADDING_SPACE,
          paddingBottom: SH(11),
        }}
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          currentOffset.current = event?.nativeEvent?.contentOffset?.x;
        }}
        onLayout={(event) => {
          offsetCenter.current = event?.nativeEvent?.layout?.width / 2 - SW(73) / 2;
        }}
      >
        {data?.map((it, i) => {
          const isActive = indexActive === i;
          return (
            <TouchableOpacity
              key={i}
              onLayout={(event) => {
                listOffsetItem.current[i] = event?.nativeEvent?.layout?.x;
              }}
              onPress={() => {
                onPress(it?.alias);
              }}
              style={[
                styles.itemContainer,
                {
                  borderColor: isActive ? Colors.primary2 : Colors.primary5,
                  marginLeft: i === 0 ? SW(8) : 0,
                },
              ]}
            >
              <Image
                source={{ uri: it?.iconUrl }}
                style={[styles.icon, { tintColor: isActive ? Colors.primary2 : Colors.gray5 }]}
              />
              <View style={{ flex: 1, justifyContent: 'center', marginTop: SH(2) }}>
                <AppText
                  medium={isActive}
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: isActive ? Colors.primary2 : Colors.gray5,
                  }}
                >
                  {it?.name}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    );
  }),
);

export default MainCategory;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.primary5,
    zIndex: 999,
    width: SW(73),
    height: '100%',
    borderRadius: SH(6),
    borderWidth: SW(1),
    marginRight: SW(8),
    alignItems: 'center',
    padding: SH(8),
  },
  icon: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
});
