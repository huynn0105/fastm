import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { secondsToHHMMSS } from '../../utils/dateHelper';
import AnimatedLottieView from 'lottie-react-native';
import { ICON_PATH } from '../../assets/path';
import moment from 'moment';

const LIMIT_SECONDS = 600; // ~10 mins

const ItemBanner = memo((props) => {
  const { onPress, itemWidth, itemHeight, item } = props;

  const interval = useRef(null);

  const [seconds, setSeconds] = useState(-1);

  useEffect(() => {
    if (!item?.eventStart) return;

    const _countDown = moment(item?.eventStart).diff(moment(), 'seconds');

    setSeconds(_countDown);

    if (interval.current !== null) {
      clearInterval(interval.current);
      interval.current = null;
    }

    interval.current = setInterval(() => {
      setSeconds((prevState) => {
        if (prevState > 0) {
          return prevState - 1;
        } else {
          if (interval.current !== null) {
            clearInterval(interval.current);
            interval.current = null;
          }
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval.current);
      interval.current = null;
    };
  }, [item?.eventStart]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.itemContainer,
          itemWidth !== SCREEN_WIDTH && styles.shadow,
          {
            width: itemWidth,
            height: itemHeight,
          },
        ]}
      >
        <Image source={{ uri: item?.newsImage }} style={styles.itemImage} />
        {(item?.eventStart && seconds <= LIMIT_SECONDS) || __DEV__ ? (
          <TextCountDown seconds={seconds} />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemBanner;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 20,
  },
  itemImage: {
    flex: 1,
    borderRadius: 20,
  },
  countDownContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.sixRed,
    paddingVertical: 5,
    paddingLeft: 8,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seconds: {
    color: '#fbdada',
    lineHeight: 18,
    fontSize: 13,
  },
  live: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
});

const TextCountDown = memo(({ seconds }) => {
  const textCountDown = useMemo(() => `Bắt đầu sau ${secondsToHHMMSS(seconds)}`, [seconds]);
  const textEventNowSplit = useMemo(() => `Sự kiện đang diễn ra`.split(''), []);
  // const animated = useRef(new Animated.Value(0)).current;
  // const inputRange = useMemo(
  //   () =>
  //     textEventNowSplit.map(
  //       (_, index) => index / textEventNowSplit.length + 1 / textEventNowSplit.length,
  //     ),
  //   [textEventNowSplit],
  // );

  // useEffect(() => {
  //   const anim = Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(animated, {
  //         duration: textEventNowSplit.length * 50,
  //         toValue: 1,
  //         useNativeDriver: false,
  //       }),
  //       Animated.timing(animated, {
  //         duration: 1000,
  //         toValue: 1,
  //         useNativeDriver: false,
  //       }),
  //       Animated.timing(animated, {
  //         duration: 1,
  //         toValue: 0,
  //         useNativeDriver: false,
  //       }),
  //     ]),
  //   );
  //   anim.start();
  //   return () => {
  //     anim.stop();
  //   };
  // }, [animated, textEventNowSplit.length]);

  return (
    <View style={styles.countDownContainer}>
      <AnimatedLottieView source={ICON_PATH.liveAnimation} style={styles.live} autoPlay />
      {seconds > 0 ? (
        <AppText style={[styles.seconds, { width: textCountDown?.length * 7 }]}>
          {textCountDown}
        </AppText>
      ) : (
        <AppText style={[styles.seconds, { paddingRight: 12 }]}>{textEventNowSplit}</AppText>
        // <View style={{ paddingRight: 12, flexDirection: 'row' }}>
        //   {textEventNowSplit.map((text, index) => {
        //     const outputRangeTranslate = textEventNowSplit.map((_, i) => {
        //       const current = index === i;
        //       const next1 = index === i + 1;
        //       const next2 = index === i + 2;
        //       const next3 = index === i + 3;
        //       const prev = index < i;
        //       return prev ? 0 : current ? 0 : next1 ? 1 : next2 ? 2 : next3 ? 4 : 6;
        //     });
        //     const outputRangeOpacity = textEventNowSplit.map((_, i) => {
        //       const current = index === i;
        //       const next1 = index === i + 1;
        //       const next2 = index === i + 2;
        //       const next3 = index === i + 3;
        //       const prev = index < i;
        //       return prev ? 1 : current ? 1 : next1 ? 0.7 : next2 ? 0.4 : next3 ? 0.1 : 0;
        //     });

        //     return (
        //       <Animated.View
        //         style={{
        //           transform: [
        //             {
        //               translateY: animated.interpolate({
        //                 inputRange,
        //                 outputRange: outputRangeTranslate,
        //               }),
        //             },
        //           ],
        //           opacity: animated.interpolate({
        //             inputRange,
        //             outputRange: outputRangeOpacity,
        //           }),
        //         }}
        //       >
        //         <AppText style={styles.seconds}>{text}</AppText>
        //       </Animated.View>
        //     );
        //   })}
        // </View>
      )}
    </View>
  );
});
