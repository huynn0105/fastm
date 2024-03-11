import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { PureComponent } from 'react';
import Swiper from 'react-native-swiper';

import Colors from '../../theme/Color';

class HomeBannerSwiper extends PureComponent {
  renderBannerItem = (item, index) => {
    const { onBannerItemPress } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        style={{ flex: 1 }}
        onPress={() => {
          onBannerItemPress(item, index);
        }}
      >
        <FastImage
          style={{
            width: '100%',
            aspectRatio: 343 / 100,
          }}
          resizeMode="contain"
          source={{ uri: item.img }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { dataSource } = this.props;
    const activeDot = <View style={styles.activeDot} />;
    const dot = <View style={styles.dot} />;
    return (
      <View style={styles.container}>
        <View style={styles.swiperContainer}>
          <Swiper
            height={Platform.OS === 'android' ? 100 : 114}
            showsButtons={false}
            dot={dot}
            activeDot={activeDot}
            horizontal
            autoplay
            autoplayTimeout={3}
            removeClippedSubviews={false}
            loop
          >
            {dataSource.map((item, index) => {
              return this.renderBannerItem(item, index);
            })}
          </Swiper>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 26,
  },
  swiperContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeDot: {
    backgroundColor: Colors.primary2,
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: -32,
  },
  dot: {
    backgroundColor: 'white',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: -32,
  },
});

export default HomeBannerSwiper;
