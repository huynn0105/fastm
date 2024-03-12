/* eslint-disable react/no-multi-comp */

import React, { memo, PureComponent } from 'react';

import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';

import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';

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

  renderItem = (item, index) => (
    <MenuItem
      key={`${item?.title}${index}`}
      {...item}
      onPress={this.onPress}
      type={this.props.type}
    />
  );

  render() {
    const { dataSources, style } = this.props;
    return (
      <View>
        <ScrollView style={style} horizontal showsHorizontalScrollIndicator={false}>
          {dataSources.map(this.renderItem)}
          <View style={{ width: 24 }} />
        </ScrollView>
      </View>
    );
  }
}

export default ScrollMenu;

const BUTTON_WIDTH = SCREEN_SIZE.width / 2.6;

const Flag = memo(() => (
  <View>
    <View
      style={{
        borderTopWidth: SW(11),
        borderTopColor: '#00bb88',
        borderLeftColor: '#00bb88',
        borderLeftWidth: SW(34),
        borderRightColor: 'transparent',
        borderRightWidth: SW(9),
        borderBottomColor: '#00bb88',
        borderBottomWidth: SW(11),
      }}
    />
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#00bb88',
        top: Platform.OS === 'ios' ? SH(4) : SH(6),
        left: SW(6),
      }}
    >
      <AppText
        bold
        style={{
          fontSize: SH(12),
          lineHeight: SH(14),
          fontStyle: 'normal',
          letterSpacing: 0,
          textAlign: 'center',
          color: Colors.primary5,
        }}
      >
        New
      </AppText>
    </View>
  </View>
));
class MenuItem extends PureComponent {
  onPress = () => {
    this.props.onPress({ title: this.props.title, url: this.props.url });
  };
  render() {
    const { icon, title, type } = this.props;
    return (
      <TouchableOpacity
        style={{ width: BUTTON_WIDTH, overflow: 'hidden', marginRight: 8 }}
        activeOpacity={0.2}
        onPress={this.onPress}
      >
        <View>
          <Image style={{ aspectRatio: 136 / 76, width: '100%', borderRadius: 8 }} source={icon} />
          {type !== 'TIPS' && (
            <View style={{ position: 'absolute' }}>
              <Flag />
            </View>
          )}
        </View>
        {type !== 'TIPS' && (
          <AppText
            style={{ ...TextStyles.caption2, marginTop: 10, opacity: 0.8 }}
            numberOfLines={2}
          >
            {title}
          </AppText>
        )}
      </TouchableOpacity>
    );
  }
}
