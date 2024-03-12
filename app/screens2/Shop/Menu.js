/* eslint-disable react/no-multi-comp */

import React, { Component, PureComponent } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

export const ITEM_IDS = {
  SHOP: 'SHOP',
  NEWS: 'NEWS',
  HISTORY: 'HISTORY',
};

export const ITEMS = [
  {
    uid: ITEM_IDS.SHOP,
    title: 'Mặt hàng',
    icon: require('./img/ic_shop.png'),
    selectedIcon: require('./img/ic_shop1.png'),
  },
  {
    uid: ITEM_IDS.NEWS,
    title: 'Khuyến mãi',
    icon: require('./img/ic_news.png'),
    selectedIcon: require('./img/ic_news1.png'),
  },
  {
    uid: ITEM_IDS.HISTORY,
    title: 'Lịch sử',
    icon: require('./img/ic_history.png'),
    selectedIcon: require('./img/ic_history1.png'),
  },
];

class Menu extends Component {
  onPress = (uid) => {
    const { selectedContent } = this.props;
    this.props.onPress(uid);
  };

  renderItem = (item) => {
    const { selectedContent } = this.props;
    const isSelected = item.uid === selectedContent;
    return <MenuItem item={item} selected={isSelected} onPress={this.onPress} />;
  };
  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {ITEMS.map(this.renderItem)}
      </View>
    );
  }
}

export default Menu;

class MenuItem extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.item.uid);
  };

  render() {
    const { title, icon, selectedIcon } = this.props.item;
    const { selected } = this.props;
    return (
      <TouchableOpacity
        style={{ justifyContent: 'center', alignContent: 'center' }}
        onPress={this.onPress}
      >
        <Image
          style={{ width: '100%', height: 44 }}
          source={selected ? selectedIcon : icon}
          resizeMode={'contain'}
        />
        <AppText
          style={{
            opacity: selected ? 1 : 0.6,
            fontSize: 14,
            textAlign: 'center',
            fontWeight: selected ? '500' : '400',
            color: selected ? Colors.primary2 : Colors.primary4,
            marginTop: 8,
          }}
        >
          {title}
        </AppText>
      </TouchableOpacity>
    );
  }
}
