/* eslint-disable react-native/no-inline-styles */
import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';

import Colors from '../../theme/Color';

const { width } = Dimensions.get('window');

const WIDTH_ITEM = width - 32;
const HEIGHT_ITEM = (WIDTH_ITEM * 192) / 343;

class ContestBannerSwiper extends PureComponent {
  renderBannerItem = ({ item, index }) => {
    const { onBannerItemPress } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        key={item.url}
        style={{ flex: 1, alignItems: 'center' }}
        onPress={() => {
          onBannerItemPress(item, index);
        }}
      >
        <FastImage
          style={{
            width: WIDTH_ITEM,
            height: HEIGHT_ITEM,
            borderRadius: 16,
            overflow: 'hidden',
          }}
          resizeMode="stretch"
          source={{ uri: item.img }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { dataSource } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.swiperContainer}>
          {/* <FlatList
            horizontal
            data={dataSource}
            keyExtractor={(item) => item.url}
            renderItem={this.renderBannerItem}
            showsHorizontalScrollIndicator={false}
          /> */}
          <Swiper
            height={HEIGHT_ITEM}
            showsButtons={false}
            dot={<View style={styles.activeDot} />}
            activeDot={<View style={styles.dot} />}
            horizontal
            autoplay
            autoplayTimeout={3}
            removeClippedSubviews={false}
            loop
          >
            {dataSource.map((item, index) => {
              return this.renderBannerItem({ item, index });
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
  },
  swiperContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeDot: {
    backgroundColor: Colors.primary2,
    width: 8,
    height: 8,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: -26,
  },
  dot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: -26,
  },
});

export default ContestBannerSwiper;
