import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import AppText from '../AppText';

const defaultColors = [Colors.primary5, Colors.primary5, Colors.primary5];

function LoadingDots({ dots = 3, colors = defaultColors, bounceHeight = 4 }) {
  const [animations, setAnimations] = useState([]);
  const [reverse, setReverse] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dotAnimations = [];
    for (let i = 0; i < dots; i++) {
      dotAnimations.push(new Animated.Value(0));
    }
    setAnimations(dotAnimations);
  }, []);

  useEffect(() => {
    if (animations.length === 0) return;
    loadingAnimation(animations, reverse);
    appearAnimation();
  }, [animations]);

  function appearAnimation() {
    Animated.timing(opacity, {
      toValue: 1,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function floatAnimation(node, reverseY, delay) {
    const floatSequence = Animated.sequence([
      Animated.timing(node, {
        toValue: reverseY ? bounceHeight : -bounceHeight,
        easing: Easing.bezier(0.41, -0.15, 0.56, 1.21),
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(node, {
        toValue: reverseY ? -bounceHeight : bounceHeight,
        easing: Easing.bezier(0.41, -0.15, 0.56, 1.21),
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(node, {
        toValue: 0,
        delay,
        useNativeDriver: true,
      }),
    ]);
    return floatSequence;
  }

  function loadingAnimation(nodes, reverseY) {
    Animated.parallel(
      nodes.map((node, index) => floatAnimation(node, reverseY, index * 100)),
    ).start(() => {
      setReverse(!reverse);
    });
  }

  useEffect(() => {
    if (animations.length === 0) return;
    loadingAnimation(animations, reverse);
  }, [reverse, animations]);

  return (
    <Animated.View style={[styles.loading, { opacity }]}>
      <AppText style={{ fontSize: SH(18), lineHeight: SH(24), color: Colors.primary5 }}>
        {'Đang tải '}
      </AppText>
      {animations.map((animation, index) => (
        <Animated.View
          key={`loading-anim-${index}`}
          style={[
            {
              marginLeft: SW(4),
            },

            { transform: [{ translateY: animation }] },
          ]}
        >
          <AppText bold style={{ color: colors[index], fontSize: SH(18), lineHeight: SH(24) }}>
            .
          </AppText>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',

    justifyContent: 'space-between',
  },
});

export default LoadingDots;
