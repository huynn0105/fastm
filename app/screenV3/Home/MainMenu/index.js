/* eslint-disable react/no-multi-comp */

import { View, TouchableOpacity, Dimensions, Image, Text, Animated } from 'react-native';
import React, { PureComponent } from 'react';

import colors from '../../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { showInfoAlert } from '../../../utils/UIUtils';
import { logEvent } from '../../../tracking/Firebase';
import AppText from '../../../componentV3/AppText';

const BUTTON_SIZE = 28;

export const MENU_ID = {
  WITHDRAW: 'WITHDRAW',
  SHOP: 'SHOP',
  REFERRAL: 'REFERRAL',
  COLLABORATOR: 'COLLABORATOR',
  GUIDE: 'GUIDE',
  POLICY: 'POLICY',
  FINANCE: 'FINANCE',
  INSURANCE: 'INSURANCE',
  UTILITIES: 'UTILITIES',
  INTRODUCE_CUSTOMER: 'INTRODUCE_CUSTOMER',
  LIST_CUSTOMER: 'LIST_CUSTOMER',
};

const MENU = [
  {
    uid: MENU_ID.POLICY,
    title: 'Chính sách',
    icon: require('./img/ic_policy.png'),
    disable: false,
  },
  // {
  //   uid: MENU_ID.INTRODUCE_CUSTOMER,
  //   title: 'Hồ sơ KH',
  //   icon: require('./img/ic_nav_gtkh.png'),
  // },
  // {
  //   uid: MENU_ID.LIST_CUSTOMER,
  //   title: 'KH của bạn',
  //   icon: require('./img/icon_list_user.png'),
  // },
  {
    uid: MENU_ID.FINANCE,
    title: 'Tài chính',
    icon: require('./img/ic_finance.png'),
  },
  {
    uid: MENU_ID.INSURANCE,
    title: 'Bảo hiểm',
    icon: require('./img/ic_insurance.png'),
    // disable: true,
    // hidden: true,
  },
  {
    uid: MENU_ID.GUIDE,
    title: 'Thông tin',
    icon: require('./img/ic_guide.png'),
    // disable: true,
    // hidden: true,
  },
];

class MainMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.dataMenu = MENU.filter((item) => !item.hidden);
  }

  renderItem = (item, index) => {
    const { isShowGift } = this.props;
    const showGift = isShowGift && item?.uid === MENU_ID.INSURANCE;
    return (
      <View key={item.uid}>
        <MenuItem
          {...item}
          {...this.props}
          index={index}
          showGift={showGift}
          onPress={this.props.onPress}
          scrollY={this.props.scrollY}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {this.dataMenu.map(this.renderItem)}
      </View>
    );
  }
}

export default MainMenu;

class MenuItem extends PureComponent {
  onPress = () => {
    const { disable } = this.props;
    if (disable) {
      showInfoAlert('Chức năng sẽ có trong phiên bản sau');
      return;
    }
    logEvent(`press_${this.props.title}`);
    this.props.onPress(this.props.uid);
  };
  render() {
    const {
      title,
      icon,
      style,
      scrollY,
      index,
      maxHeight,
      disable,
      hidden,
      uid,
      showGift,
    } = this.props;
    const moveX = -(index + 1) * SCREEN_WIDTH * 0.1 + 10;

    // adjust for diff width button
    let adjust = 0;
    // if (index === 1) {
    //   adjust = 2;
    // } else if (index === 2) {
    //   adjust = -3;
    // }

    const translateX = scrollY.interpolate({
      inputRange: [-200, -100, 0, 110, maxHeight, maxHeight + 1],
      outputRange: [0, 0, 0, 0, moveX + adjust, moveX + adjust],
    });
    const translateY = scrollY.interpolate({
      inputRange: [-200, -100, 0, 80, maxHeight, maxHeight + 1],
      outputRange: [0, 0, 0, 0, 28, 28],
    });
    const opacityTitle = scrollY.interpolate({
      inputRange: [-200, -100, 0, 50, 75, 80, 81],
      outputRange: [0.7, 0.7, 0.7, 0.7, 0.2, 0, 0],
    });
    const scaleItem = scrollY.interpolate({
      inputRange: [-200, -100, 0, 100, maxHeight, maxHeight + 1],
      outputRange: [1, 1, 1, 1, 0.95, 0.95],
    });

    const BTN_WIDTH = 80;
    return (
      <Animated.View
        key={uid}
        style={[
          { ...style },
          {
            transform: [
              {
                scaleX: scaleItem,
              },
              {
                scaleY: scaleItem,
              },
              {
                translateX,
              },
              {
                translateY,
              },
            ],
          },
        ]}
      >
        {hidden ? (
          <View style={{ opacity: 0 }}>
            <AppText
              style={{
                marginTop: 8,
                fontSize: 11,
                textAlign: 'center',
                color: colors.primary4,
              }}
            >
              {title}
            </AppText>
          </View>
        ) : (
          <TouchableOpacity
            style={{ alignItems: 'center', opacity: disable ? 0.5 : 1, width: BTN_WIDTH }}
            activeOpacity={0.2}
            onPress={this.onPress}
          >
            {showGift && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 12,
                  top: -9,
                }}
              >
                <Image source={require('../../../img/ic_gift.png')} />
              </View>
            )}
            <Image
              style={[{ width: BUTTON_SIZE, aspectRatio: 1 }]}
              source={icon}
              resizeMode={'contain'}
            />
            <Animated.Text
              style={{
                marginTop: 8,
                fontSize: 11,
                textAlign: 'center',
                color: colors.primary4,
                opacity: opacityTitle,
              }}
            >
              {title}
            </Animated.Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
}
