import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  Image,
} from 'react-native';

import {
  removeNotificationFromPendingList,
} from '../../redux/actions';

import {
  NOTIFICATION_CATEGORIES,
} from '../../submodules/firebase/model/Notification';

import NotificationManager from '../../manager/NotificationManager';

import NotiRow from './NotiRow';

const SCREEN_SIZE = Dimensions.get('window');

class NotiInApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExpend: true,
      isChange: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {pendingNotificationList} = this.props;
    const {isChange} = this.state;
    if(pendingNotificationList !== nextProps.pendingNotificationList && nextProps.pendingNotificationList && !isChange) {
      this.setState({
        isExpend: !(nextProps.pendingNotificationList?.length > 2)
      })
    }
  }

  onCancelPress = (notification) => {
    this.props.removeNotificationFromPendingList(notification);
  }

  onDetailPress = (notification) => {
    this.props.removeNotificationFromPendingList(notification);
    NotificationManager.shared().handleTapOnNotification(notification);
  }

  onNotificationPress = (notification) => {
    this.props.removeNotificationFromPendingList(notification);
    NotificationManager.shared().handleTapOnNotification(notification);
  }

  isSystemNoti = (notification) => {
    return (notification.category === NOTIFICATION_CATEGORIES.ADMIN ||
      notification.category === NOTIFICATION_CATEGORIES.SYSTEM);
  }

  bindDataToNoti = (notification) => {

    const getGiftedNoti = (uid, giftedNotificationList) => {
      for (let i = 0; i < giftedNotificationList.length; i += 1) {
        const giftedNoti = giftedNotificationList[i];
        if (giftedNoti.uid === uid) {
          return giftedNoti.notification;
        }
      }
      return null;
    };

    if (notification.category === NOTIFICATION_CATEGORIES.ADMIN) {
      return getGiftedNoti(notification.uid, this.props.adminGiftedNotifications);
    }
    else if (notification.category === NOTIFICATION_CATEGORIES.SYSTEM) {
      return getGiftedNoti(notification.uid, this.props.systemGiftedNotifications);
    }
    return notification;
  }

  pendingGiftedNotificationList = () => {
    const {pendingNotificationList} = this.props;
    // return DUMMY;
    if(!pendingNotificationList || pendingNotificationList?.length <= 0) return [];
    return pendingNotificationList
      .map(noti => (this.bindDataToNoti(noti)))
      .filter(noti => noti !== null);
  }

  renderSystemNoti = (notification, index) => {
    const {isExpend} = this.state;
    const number = this.pendingGiftedNotificationList()?.length - (index || 0 + 1);
    return (
      <NotiRow
        image={notification.category === NOTIFICATION_CATEGORIES.ADMIN ?
          require('./img/anna.png') : require('./img/elly.png')}
        name={notification.category === NOTIFICATION_CATEGORIES.ADMIN ?
          'Anna - Trợ lý tin tức' : 'Elly - Trợ lý riêng của bạn'}
        title={notification.title}
        contentHTML={notification.details}
        hasAction
        index={index}
        notification={notification}
        onCancelPress={this.onCancelPress}
        onDetailPress={this.onDetailPress}
        isExpend={isExpend}
        unreadNumberColpand={number}
        onPressExtendsListNotification={this.onPressExtendsListNotification}
      />
    );
  }

  renderChatNoti = (notification, index) => {
    const {isExpend} = this.state;
    const number = this.pendingGiftedNotificationList()?.length - (index || 0 + 1);
    return (<NotiRow
      image={notification.image}
      name={notification.title}
      title={notification.title}
      content={notification.details}
      index={index}
      notification={notification}
      onPress={this.onNotificationPress}
      onCancelPress={this.onCancelPress}
      canPressRow
      isExpend={isExpend}
      unreadNumberColpand={number}
      onPressExtendsListNotification={this.onPressExtendsListNotification}
    />);
  }

  onPressExtendsListNotification = () => {
    this.setState({isExpend: true, isChange: true});
  }

  renderNotiRow = (row) => {
    const notification = row.item;
    if (this.isSystemNoti(notification)) {
      return this.renderSystemNoti(notification, row.index);
    }
    else if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
      return this.renderChatNoti(notification, row.index);
    }
    return null;
  }

  renderStackColpand = () => {
    const pendingNotificationList = DUMMY;
    if(pendingNotificationList?.length <= 0) return <View />;
    return (
      this.renderNotiRow({item: pendingNotificationList?.[0], index: 0})
    )
  }

  render() {
    const {isExpend} = this.state;
    let pendingNotificationList = this.pendingGiftedNotificationList();
    if(!isExpend) {
      pendingNotificationList = pendingNotificationList.slice(0, 1);
    } 
    return (
      <View
        style={styles.container}
        pointerEvents={'box-none'}
      >
        <View
          style={{ flex: 0, width: SCREEN_SIZE.width }}
        >
            <FlatList
              data={pendingNotificationList}
              keyExtractor={item => `${item.uid}_${item.category}_${item.details}`}
              renderItem={this.renderNotiRow}
            />
        </View>
      </View >
    );
  }
}

const mapStateToProps = (state) => ({
  pendingNotificationList: state.pendingNotificationList,
  adminGiftedNotifications: state.adminGiftedNotifications,
  systemGiftedNotifications: state.systemGiftedNotifications,
});
const mapDispatchToProps = (dispatch) => ({
  removeNotificationFromPendingList:
    (notification) => dispatch(removeNotificationFromPendingList(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotiInApp);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

