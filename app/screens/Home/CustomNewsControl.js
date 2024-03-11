import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import Swiper from 'react-native-swiper';

import KJImage from 'app/components/common/KJImage';

const SCREEN_SIZE = Dimensions.get('window');

class CustomeNewsControl extends PureComponent {

  renderItem = (news, onPress) => {
    return (
      <View style={styles.item} key={news.ackID}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(news)}>
          <KJImage
            style={
              styles.backgroundImage
            }
            source={news.imageURI()}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { customNews, onPress } = this.props;

    return (
      <Swiper
        style={styles.container}
        dot={
          <View style={{
            backgroundColor: 'rgba(255,255,255,.3)',
            width: 6,
            height: 6,
            borderRadius: 3,
            marginLeft: 3,
            marginRight: 3,
          }}
          />}
        activeDot={
          <View style={{
            backgroundColor: '#fff',
            width: 6,
            height: 6,
            borderRadius: 3,
            marginLeft: 3,
            marginRight: 3,
          }}
          />}
        paginationStyle={{
          bottom: 4,
        }}
        autoplay
      >
        {
          customNews.map((news) => {
            return (
              this.renderItem(news, onPress)
            );
          })
        }
      </Swiper>
    );
  }
}

export default CustomeNewsControl;

const styles = StyleSheet.create({
  container: {
    // width: SCREEN_SIZE.width,
    height: SCREEN_SIZE.width * (120 / 414),
  },
  item: {
    width: SCREEN_SIZE.width,
    height: SCREEN_SIZE.width * (120 / 414),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: SCREEN_SIZE.width,
    height: SCREEN_SIZE.width * (120 / 414),
  },
});
