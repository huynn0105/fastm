// native
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../theme/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { useDispatch } from 'react-redux';
import { getListMainProduct } from '../../redux/actions/actionsV3/mtradeAction';
import ListReferralProduct from '../../componentV3/ListReferralProduct/ListReferralProduct';
import { Svg, Path, Defs, Stop, Rect, LinearGradient as SVGLinearGradient } from 'react-native-svg';

const SCREEN_SIZE = Dimensions.get('window');
export const MAIN_BUTTON_AREA = SCREEN_SIZE.width / 5;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const MainTabbarButton = (props) => {
  //* PROPS
  const { navigation } = props;

  //* REDUX

  //* STATE
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  //* REF
  const animated = useRef(new Animated.Value(0)).current;
  const playingAnimation = useRef(null);
  const listHeight = useRef(0);
  const ref = useRef(null);

  //* *//
  const onPressButton = useCallback(() => {
    setIsVisibleModal((prev) => {
      const newValue = !prev;

      if (playingAnimation.current) {
        playingAnimation.current.stop();
      }
      playingAnimation.current = Animated.timing(animated, {
        toValue: newValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      });
      if (playingAnimation.current) {
        playingAnimation.current.start(() => {
          Keyboard.dismiss();
          playingAnimation.current = null;
          newValue && dispatch(getListMainProduct());
          setIsVisibleModal(newValue);
        });
      }

      return newValue || prev;
    });
  }, [animated, dispatch]);

  const onContentSizeChange = useCallback((w, h) => {
    listHeight.current = h;
  }, []);

  const renderModal = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={onPressButton}>
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            bottom: 0,
            position: 'absolute',
            backgroundColor: 'rgba(10, 10, 40, 0.9)',
            opacity: animated.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            zIndex: isVisibleModal ? 9 : -99,
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [listHeight.current, 0],
                  }),
                },
              ],
              backgroundColor: Colors.neutral5,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <ListReferralProduct
              onCloseModal={onPressButton}
              onPressProduct={onPressButton}
              onContentSizeChange={onContentSizeChange}
              navigation={navigation}
            />
          </Animated.View>
          <View
            style={{
              width: '100%',
              height: BOTTOM_BAR_HEIGHT,
              backgroundColor: '#fff',
            }}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }, [animated, isVisibleModal, navigation, onContentSizeChange, onPressButton]);

  const renderButtonMain = useCallback(() => {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 17],
          }),
          width: MAIN_BUTTON_AREA,
          height: BOTTOM_BAR_HEIGHT,
          alignSelf: 'center',
          alignItems: 'center',
          zIndex: 99,
        }}
      >
        <Animated.View
          style={{
            top: -15,
            alignItems: 'center',
            opacity: animated.interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [1, 0, 0],
            }),
            position: 'absolute',
          }}
        >
          <MainButtonPath />
        </Animated.View>
        <AnimatedTouchableOpacity
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
          activeOpacity={0.8}
          onPress={onPressButton}
          style={{
            borderWidth: animated.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 2],
            }),
            borderColor: '#fff',
            overflow: 'hidden',
            width: 56,
            height: 56,
            borderRadius: 56 / 2,
            position: 'absolute',
            top: -8,
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#2822c8', '#1f72ff']}
            style={{
              flex: 1,
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                  {
                    rotate: animated.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '45deg'],
                    }),
                  },
                ],
              }}
            >
              <FontAwesome5 name="plus" color={'#fff'} size={24} />
            </Animated.View>
          </LinearGradient>
        </AnimatedTouchableOpacity>
      </Animated.View>
    );
  }, [animated, onPressButton]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListMainProduct());
    requestAnimationFrame(() => {
      ref?.current?.open();
    });
  }, [dispatch]);

  return (
    <>
      {renderModal()}
      {renderButtonMain()}
    </>
  );
};

export default MainTabbarButton;

export const MainButtonPath = memo((props) => {
  return (
    <>
      <View style={{ position: 'absolute', top: -1 }}>
        <Svg
          width={91}
          height={16}
          viewBox="0 0 91 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Defs>
            <SVGLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0.05" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.05" />
            </SVGLinearGradient>
          </Defs>
          {/* <Rect height="100" width="100%" fill="url(#grad)" /> */}
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M.875 15.209l7.247-.014c4.825-.01 9.36-2.253 13.056-5.356C26.386 5.467 34.998 0 45.5 0c10.486 0 19.087 5.407 24.297 9.742 3.71 3.086 8.257 5.312 13.083 5.302l7.245-.014-89.25.179z"
            fill="url(#grad)"
          />
        </Svg>
      </View>
      <Svg
        width={91}
        height={16}
        viewBox="0 0 91 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M.875 15.209l7.247-.014c4.825-.01 9.36-2.253 13.056-5.356C26.386 5.467 34.998 0 45.5 0c10.486 0 19.087 5.407 24.297 9.742 3.71 3.086 8.257 5.312 13.083 5.302l7.245-.014-89.25.179z"
          fill="#fff"
        />
      </Svg>
    </>
  );
});
