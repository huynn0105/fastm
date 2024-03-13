/* eslint-disable react/no-multi-comp */

import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { PureComponent } from 'react';

import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { Share } from 'react-native';
import { logEvent } from '../../tracking/Firebase';
import AppText from '../../componentV3/AppText';

export const ITEM_IDS = {
  COLLABORATORS: 'COLLABORATORS',
  ADD_REFERRAL: 'ADD_REFERRAL',
  INSTALL_LINK: 'INSTALL_LINK',
  INTRODUCTION: 'INTRODUCTION',
};

const ITEMS = [
  // {
  //   uid: ITEM_IDS.ADD_REFERRAL,
  //   title: 'Tạo tài khoản cho CTV',
  //   icon: require('./img/ic_add_referral.png'),
  // },
  {
    uid: ITEM_IDS.INSTALL_LINK,
    title: 'Gửi link cài đặt MFast',
    detail: 'Có kèm mã giới thiệu trong nội dung gửi đi',
    icon: require('./img/ic_install_link.png'),
  },
  {
    uid: ITEM_IDS.COLLABORATORS,
    title: 'Danh sách Cộng Tác Viên',
    icon: require('./img/ic_list_collaborators.png'),
  },
  {
    uid: ITEM_IDS.INTRODUCTION,
    title: 'Hướng dẫn chi tiết',
    icon: require('./img/ic_introduction.png'),
  },
];

class HomeActionSheet extends PureComponent {
  onClosePress = () => {
    this.props.onClosePress();
  };
  onItemPress = (itemID) => {
    if (this.props.onItemPress) {
      this.props.onItemPress(itemID);
    }
  };
  onReferralCodePress = () => {
    this.openShareDialog(this.props.user.referralCode);
  };
  openShareDialog = (content) => {
    logEvent('press_share_CTV_link');
    Share.share({
      message: content,
    });
  };
  renderTitle = () => {
    return (
      <View style={{ margin: 10, alignItems: 'stretch', height: 24 }}>
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <AppText style={{ textAlign: 'center', fontSize: 14, color: Colors.primary4 }}>
            {'Cộng tác viên'}
          </AppText>
        </View>
        <TouchableOpacity
          style={{ position: 'absolute', width: 24, height: 24, padding: 3 }}
          onPress={this.onClosePress}
        >
          <Image style={{ width: 18, height: 18 }} source={require('./img/ic_close.png')} />
        </TouchableOpacity>
      </View>
    );
  };
  renderDescription = () => {
    const { user = {} } = this.props;
    return (
      <View>
        {user.referralCode ? (
          <AppText
            style={{
              textAlign: 'center',
              color: `${Colors.primary4}aa`,
              marginBottom: 8,
            }}
          >
            {'Mã giới thiệu của bạn là: '}
            <AppText
              style={{ ...TextStyles.heading3, color: Colors.primary2 }}
              onPress={this.onReferralCodePress}
            >
              {user.referralCode}
            </AppText>
          </AppText>
        ) : null}
        <AppText
          style={{
            textAlign: 'center',
            marginLeft: 32,
            marginRight: 32,
            color: `${Colors.primary4}aa`,
          }}
        >
          {'Nhận '}
          <AppText style={{ fontWeight: '500', color: Colors.primary2 }}>{'Thu nhập '}</AppText>
          {'gián tiếp từ các khách hàng mà CTV của bạn giới thiệu lên.'}
        </AppText>
      </View>
    );
  };
  renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onItemPress(item.uid);
        }}
      >
        <View style={{ backgroundColor: '#3331', height: 1, marginLeft: 16, marginRight: 16 }} />
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{
              marginLeft: 16,
              marginTop: 16,
              marginBottom: 16,
              marginRight: 16,
              width: 44,
              height: 44,
            }}
            source={item.icon}
          />
          <View
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
            }}
          >
            <AppText
              style={{
                fontSize: 17,
                color: Colors.primary4,
              }}
            >
              {item.title}
            </AppText>
            {item.detail ? (
              <AppText style={{ ...TextStyles.caption2, opacity: 0.8 }}>{item.detail}</AppText>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderItems = (items) => {
    return <View style={{ marginTop: 16 }}>{items.map(this.renderItem)}</View>;
  };
  render() {
    return (
      <View style={{ marginBottom: 16 }}>
        {this.renderTitle()}
        {this.renderDescription()}
        {this.renderItems(ITEMS)}
      </View>
    );
  }
}

export default HomeActionSheet;
