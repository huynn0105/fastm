import moment from 'moment/min/moment-with-locales';
import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const _ = require('lodash');

const SCREEN_WIDTH = Dimensions.get('window').width;

const RECTANGLE_IMG =
  Platform.OS === 'android'
    ? require('./img/rectangleAndroid.png')
    : require('./img/rectangle.png');

const FooterSection = (props) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingBottom: 12,
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Image
        style={{
          height: 14,
          width: 14,
        }}
        source={require('./img/clock.png')}
      />
      <Text
        style={{
          opacity: 0.8,
          marginLeft: 4,
          fontSize: 12,
          lineHeight: 16,
          letterSpacing: 0,
          color: '#fff',
        }}
      >
        {moment(props.news.createdDate, 'X').fromNow()}
      </Text>
    </View>
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 12,
      }}
    >
      {props.news.totalViews && (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            style={{
              height: 10.5,
              width: 14,
            }}
            source={require('./img/views.png')}
          />
          <Text
            style={{
              opacity: 0.8,
              marginLeft: 4,
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: 0,
              color: '#fff',
            }}
          >
            {props.news.totalViews}
          </Text>
        </View>
      )}
      {props.news.totalShare && (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            style={{
              height: 14,
              width: 16,
            }}
            source={require('./img/ic_share.png')}
          />
          <Text
            style={{
              opacity: 0.8,
              marginLeft: 4,
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: 0,
              color: '#fff',
            }}
          >
            {props.news.totalShare}
          </Text>
        </View>
      )}
    </View>
  </View>
);

const Title = (props) => (
  <Text
    style={{
      fontSize: props.fontS || 14,
      fontWeight: '600',
      fontStyle: 'normal',
      lineHeight: 20,
      letterSpacing: 0,
      color: '#fff',
      marginHorizontal: 12,
      marginTop: 8,
      marginBottom: 6,
      height: 40,
    }}
    numberOfLines={2}
  >
    {props.news.postTitle}
  </Text>
);

class HotNewsSlideView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderItem = (news, onPress) => {
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => onPress(news)}
        style={{ backgroundColor: Colors.primary5, borderRadius: 14, width: SW(224) }}
      >
        <ImageBackground
          source={{ uri: news.postImage }}
          style={{
            width: SW(224),
            height: SH(125),
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* <ImageBackground
            source={RECTANGLE_IMG}
            style={{
              width: SCREEN_WIDTH * 0.6,
            }}
          >
            {Platform.OS === 'android' ? (
              <View />
            ) : (
              <BlurView
                style={StyleSheet.absoluteFillObject}
                blurType="light"
                blurAmount={10}
                overlayColor={'transparent'}
              />
            )}
            <View>
              <Title news={news} />
              <FooterSection news={news} />
            </View>
          </ImageBackground> */}
        </ImageBackground>
        <View style={{ paddingVertical: SH(12), paddingHorizontal: SW(16) }}>
          <AppText numberOfLines={2} medium style={styles.titleStyle}>
            {news?.postTitle}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: SH(8),
            }}
          >
            <AppText style={styles.footerTextStyle}>{`#${news?.hashtag}`}</AppText>
            <AppText style={styles.footerTextStyle}>
              {moment(news?.createdDate, 'X').fromNow()}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderItemLarge = (news, onPress) => {
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => onPress(news)}
        style={{
          marginHorizontal: SW(16),
          backgroundColor: Colors.primary5,
          borderRadius: 14,
          marginBottom: SH(16),
        }}
      >
        <ImageBackground
          source={{ uri: news.postImage }}
          style={{
            width: SW(343),
            height: SH(192),

            borderRadius: 14,
            overflow: 'hidden',

            // marginBottom: 12,
          }}
        >
          {/* <View style={{ flex: 1 }} /> */}
        </ImageBackground>
        <View style={{ paddingVertical: SH(12), paddingHorizontal: SW(16) }}>
          <AppText medium style={styles.titleStyle}>
            {news?.postTitle}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: SH(8),
            }}
          >
            <AppText style={styles.footerTextStyle}>{`#${news?.hashtag}`}</AppText>
            <AppText style={styles.footerTextStyle}>
              {moment(news?.createdDate, 'X').fromNow()}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  itemSeparatorComponent = () => <View style={{ width: 16 }} />;

  renderContentScroll = (newsList, onPress) => {
    if (newsList && newsList.length > 0) {
      return (
        <FlatList
          horizontal
          initialNumToRender={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={newsList.slice(1, newsList.length)}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={this.itemSeparatorComponent}
          renderItem={(item) => this.renderItem(item.item, onPress)}
        />
      );
    }
    return <View />;
  };

  renderLargeItemNews = () => {
    const { data, onPress } = this.props;
    if (data && data.length) {
      return this.renderItemLarge(data[0], onPress);
    }
    return <View />;
  };

  render() {
    const { title, data, onPress } = this.props;

    return (
      <View>
        <View>
          <AppText medium style={styles.titleText}>
            {title}
          </AppText>
        </View>
        {this.renderLargeItemNews()}
        {this.renderContentScroll(data, onPress)}
      </View>
    );
  }
}

export default HotNewsSlideView;

const styles = StyleSheet.create({
  titleText: {
    flex: 1,
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,

    paddingLeft: SW(16),
    marginBottom: SH(12),
  },
  absolute: {
    // position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  titleStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  footerTextStyle: {
    fontSize: SH(12),
    lineHeight: SH(16),
    color: Colors.gray2,
  },
});
