/* eslint-disable react/no-multi-comp */

import React, { PureComponent } from 'react';

import { View, ScrollView, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';

import AppText from '../../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');

class ScrollMenu extends PureComponent {
  onPress = ({ title, url }) => {
    if (this.props.onPress) {
      this.props.onPress({ title, url });
    } else {
      if (this.props.navigation) {
        this.props.navigation.navigate('WebView', { mode: 0, title, url });
      }
    }
  };

  renderItem = (item, index) => <MenuItem key={`${item?.title}${index}`} {...item} onPress={this.onPress} />;

  render() {
    const { dataSources, style } = this.props;
    return (
      <View>
        <ScrollView
          style={style}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {dataSources.map(this.renderItem)}
          <View style={{ width: 24 }} />
        </ScrollView>
      </View>
    );
  }
}

export default ScrollMenu;

const BUTTON_WIDTH = SCREEN_SIZE.width / 2.6;

const Circle = ({ position }) => (
  <View
    style={{
      position: 'absolute',
      bottom: 0,
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff0',
      ...position
    }}
  >
    <View
      style={{
        backgroundColor: Colors.neutral5,
        borderRadius: 16,
        height: 32,
        width: 32
      }}
    />
  </View>
);

const Flag = () => (
  <View>
  <View
    style={{
    width: 46,
    height: 16,
    borderTopWidth: 8,
    borderTopColor: Colors.accent3,
    borderLeftColor: Colors.accent3,
    borderLeftWidth: 5,
    borderRightColor: 'transparent',
    borderRightWidth: 5,
    borderBottomColor: Colors.accent3,
    borderBottomWidth: 8,
  }} />   
  <View style={{ position: 'absolute', backgroundColor: Colors.accent3, width: 34, height: 14, marginHorizontal: 4 }}>
      <AppText
      style={{
        fontSize: 12,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary5
      }}>
        News
      </AppText>
    </View>
  </View>
);

class MenuItem extends PureComponent {
  onPress = () => {
    this.props.onPress({ title: this.props.title, url: this.props.url });
  };
  render() {
    const { icon, title } = this.props;
    return (
      <TouchableOpacity
        style={{ width: BUTTON_WIDTH, overflow: 'hidden', marginRight: 8 }}
        activeOpacity={0.2}
        onPress={this.onPress}
      >
        <View>
          <Image
            style={{ aspectRatio: 136 / 94, width: '100%' }}
            resizeMode="stretch"
            source={icon}
          />
          <Circle position={{ right: -24 }} />
          <Circle position={{ left: -24 }} />
          <View style={{ position: 'absolute' }}>
            <Flag />
          </View>
        </View>
        <AppText style={{ ...TextStyles.caption2, marginTop: 10, opacity: 0.8 }} numberOfLines={2}>
          {title}
        </AppText>
      </TouchableOpacity>
    );
  }
}
