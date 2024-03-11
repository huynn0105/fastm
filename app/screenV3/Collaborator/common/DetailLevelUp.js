import { Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { isDeepLink } from '../../../utils/Utils';
import NavigationServices from '../../../utils/NavigationService';
import { Animated } from 'react-native';
import { styles } from './ExperienceContent';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../theme/Color';

const DetailLevelUp = memo((props) => {
  const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const scrollIndicatorSize =
    completeScrollBarHeight > visibleScrollBarHeight
      ? (visibleScrollBarHeight * visibleScrollBarHeight) / completeScrollBarHeight
      : visibleScrollBarHeight;

  const difference =
    visibleScrollBarHeight > scrollIndicatorSize ? visibleScrollBarHeight - scrollIndicatorSize : 1;

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    visibleScrollBarHeight / completeScrollBarHeight,
  ).interpolate({
    extrapolate: 'clamp',
    inputRange: [0, difference],
    outputRange: [0, difference],
  });

  const onContentSizeChange = (_, contentHeight) => setCompleteScrollBarHeight(contentHeight);

  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }) => {
    setVisibleScrollBarHeight(height);
  };

  const { detail } = props;

  if (!detail) return null;

  return (
    <View
      style={{
        maxHeight: 160,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: Colors.purple2,
      }}
    >
      <ScrollView
        nestedScrollEnabled
        onContentSizeChange={onContentSizeChange}
        onLayout={onLayout}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollIndicator } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        <TouchableWithoutFeedback>
          <View style={styles.boxContainer}>
            <Image source={ICON_PATH.energy} style={styles.tipsIcon} />
            <View style={styles.tipsInfoContainer}>
              <AppText style={styles.tipsText}>{`Bạn cần:`}</AppText>
              {detail?.map((item, index) => {
                return (
                  <AppText key={index} style={[styles.tipsText, { marginTop: 4 }]}>
                    {item?.map((it, idx) => {
                      console.log('!#!@#', it);
                      return (
                        <AppText
                          onPress={() => {
                            if (!it?.url) return;
                            if (isDeepLink(it?.url)) {
                              Linking.openURL(it.url);
                              return false;
                            }
                            NavigationServices.navigate('WebView', {
                              mode: 0,
                              title: it.title || 'MFast',
                              url: it.url,
                            });
                          }}
                          key={idx}
                          style={[styles.tipsText, { color: it?.color }]}
                        >
                          {`${it?.text} `}
                        </AppText>
                      );
                    })}
                  </AppText>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <View
        style={{
          backgroundColor: '#e9d7f480',
          borderRadius: 3,
          height: '100%',
          width: 3,
          position: 'absolute',
          right: 4,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#e9d7f4',
            borderRadius: 3,
            width: 3,
            height: scrollIndicatorSize,
            transform: [{ translateY: scrollIndicatorPosition }],
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 24,
          bottom: 0,
        }}
      >
        <LinearGradient
          colors={['#6e418b00', '#6e418b']}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    </View>
  );
});

export default DetailLevelUp;
