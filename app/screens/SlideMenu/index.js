import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  Alert,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';

import {
  logout,
} from 'app/redux/actions';

import Strings from 'app/constants/strings';
import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'common/KJTouchableOpacity';

import styles from './styles';
import MenuItem from './MenuItem';
import AppayInfo from './AppayInfo';

import { NOTIFICATION_CATEGORIES } from '../../submodules/firebase/model/Notification';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'MenuScreen.js';
/* eslint-enable */

// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');
const USER_HEADER_HEIGHT = 44 + 44 + 72 + 12 + 8 + 44;
const MENU_ITEM_HEIGHT = 40;
const MENU_HEIGHT = (2 * MENU_ITEM_HEIGHT);
const APPINFO_ITEM_HEIGHT = 40;
const APPINFO_HEIGHT = (3 * APPINFO_ITEM_HEIGHT) + 110;
const EMPTY_SPACE_LEFT = SCREEN_SIZE.height - USER_HEADER_HEIGHT - MENU_HEIGHT - APPINFO_HEIGHT;
const LAST_ITEM_MARGIN_TOP = (EMPTY_SPACE_LEFT > 0 ? EMPTY_SPACE_LEFT : 0);

// --------------------------------------------------

const MENU_ITEMS_TYPES = {
  HOME: 'home',
  INBOX: 'inbox',
  SHOP: 'shop',
  INTRO: 'intro',
  SETTINGS: 'settings',
  EDIT_PASSWORD: 'edit_password',
  LOGOUT: 'logout',
};

const MENU_ITEMS = [
  // {
    // type: MENU_ITEMS_TYPES.INBOX,
    // title: 'Thông báo',
    // icon: require('./img/envelope.png'),
    // containerStyle: { marginTop: 0, height: MENU_ITEM_HEIGHT },
  // },
  // 4/4/08
  // {
  //   type: MENU_ITEMS_TYPES.SHOP,
  //   title: 'Mua sắm',
  //   icon: require('./img/shop.png'),
  //   containerStyle: { marginTop: 0, height: MENU_ITEM_HEIGHT },
  // },
  // 4/4/08
  // {
  //   type: MENU_ITEMS_TYPES.INTRO,
  //   title: 'Giới thiệu chung',
  //   icon: require('./img/info.png'),
  //   containerStyle: { marginTop: 0, height: MENU_ITEM_HEIGHT },
  // },
  {
    type: MENU_ITEMS_TYPES.SETTINGS,
    title: 'Thiết lập',
    icon: require('./img/settings.png'),
    containerStyle: { marginTop: 0, height: MENU_ITEM_HEIGHT },
  },
  {
    type: MENU_ITEMS_TYPES.EDIT_PASSWORD,
    title: 'Đổi mật khẩu',
    icon: require('./img/padlock.png'),
    iconStyle: { width: 18, height: 18 },
    containerStyle: { marginTop: LAST_ITEM_MARGIN_TOP, height: MENU_ITEM_HEIGHT },
  },
];

// --------------------------------------------------
// MenuScreen
// --------------------------------------------------

class MenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 1,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  // --------------------------------------------------
  onAvatarPress = () => {
    this.props.navigation.navigate('Profile');
  }
  onItemPress = (item) => {
    // console.log('onItemPress', item);

    // close menu
    this.props.navigation.navigate('DrawerClose');
    if (this.state.selectedItem === item.type) { return; }

    // open new screen
    if (item.type === MENU_ITEMS_TYPES.INBOX) {
      const category = NOTIFICATION_CATEGORIES.ADMIN;
      this.props.navigation.navigate('Inbox', { category, title: 'Thông báo' });
    }
    else if (item.type === MENU_ITEMS_TYPES.SHOP) {
      this.props.navigation.navigate('Shop');
    }
    else if (item.type === MENU_ITEMS_TYPES.INTRO) {
      this.props.navigation.navigate('Intro');
    }
    else if (item.type === MENU_ITEMS_TYPES.SETTINGS) {
      this.props.navigation.navigate('Settings');
    }
    else if (item.type === MENU_ITEMS_TYPES.EDIT_PASSWORD) {
      this.props.navigation.navigate('EditPassword');
    }
    else if (item.type === MENU_ITEMS_TYPES.LOGOUT) {
      this.onLogoutPress();
    }
  }
  onAppayInfoItemPress = (item) => {
    const appInfo = this.props.appInfo;
    if (item.type === 1) {
      Communications.phonecall(appInfo.contactPhoneNumber, true);
    }
    else if (item.type === 2) {
      const email = this.props.myUser.email;
      const subject = 'MFast: yêu cầu hỗ trợ';
      const body = `Send from: ${email}\n`;
      Communications.email([appInfo.contactEmail], null, null, subject, body);
    }
    else if (item.type === 3) {
      Communications.web(appInfo.zaloFanpageURL);
    }
  }
  onLogoutPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_confirm,
      [
        {
          text: 'Không',
          onPress: () => { },
        },
        {
          text: 'Có',
          onPress: () => {
            this.props.logout();
          },
        },
      ],
      { cancelable: false },
    );
  }
  // --------------------------------------------------
  renderUserInfo() {
    const { myUser } = this.props;
    const createTime = `Tham gia: ${myUser.createTimeAgoString()}`;
    return (
      <View style={styles.headerContainer}>
        {/* <Avatar
          image={myUser.avatarImageURI()}
          onPress={this.onAvatarPress}
        /> */}
        <Name fullName={myUser.fullName} />
        <CreateTime createTime={createTime} />
      </View>
    );
  }
  renderMenu() {
    return (
      <View style={styles.menuContainer}>
        {
          MENU_ITEMS.map((item, index) => {
            let badge = '';
            if (item.type === MENU_ITEMS_TYPES.INBOX) {
              if (this.props.totalUnReadAdminNotifications > 0) {
                badge = `${this.props.totalUnReadAdminNotifications}`;
              }
            }
            return (
              <MenuItem
                key={`${item.type}${index}`}
                item={item}
                badge={badge}
                containerStyle={item.containerStyle}
                titleStyle={item.titleStyle}
                iconStyle={item.iconStyle}
                isSelected={false}
                onPress={this.onItemPress}
              />
            );
          })
        }
      </View>
    );
  }
  renderAppayInfo() {
    return (
      <AppayInfo
        itemHeight={APPINFO_ITEM_HEIGHT}
        onItemPress={this.onAppayInfoItemPress}
      />
    );
  }
  renderSeparatorLine() {
    return (
      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
          height: 1.0,
          marginTop: 8,
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}
      />
    );
  }
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        {/* <ScrollView style={{ flex: 1 }}> */}
          {/* {this.renderUserInfo()}
          {this.renderMenu()}
          {this.renderSeparatorLine()}
          {this.renderAppayInfo()} */}
        {/* </ScrollView> */}
      </View>
    );
  }
}

// --------------------------------------------------

const Avatar = (props) => (
  <KJTouchableOpacity
    onPress={props.onPress}
  >
    <View>
      <KJImage
        style={styles.userAvatar}
        source={props.image}
        resizeMode="cover"
      />
    </View>
  </KJTouchableOpacity>
);

const Name = (props) => (
  <Text style={styles.userName}>
    {props.fullName}
  </Text>
);

const CreateTime = (props) => (
  <Text style={styles.userCreateTime}>
    {props.createTime}
  </Text>
);

// --------------------------------------------------
// react-redux
// --------------------------------------------------

MenuScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  totalUnReadAdminNotifications: state.totalUnReadAdminNotifications,
  appInfo: state.appInfo,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);

