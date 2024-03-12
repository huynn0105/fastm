/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import CharAvatar from 'app/components/CharAvatar';
import EmptyDataView from 'app/components/EmptyDataView';
import Strings from 'app/constants/strings';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as Animatable from 'react-native-animatable';
import HTMLView from 'react-native-render-html';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  GiftedChat,
  LoadEarlier,
  Time,
} from '../../../forked_node_modules/react-native-gifted-chat-forked/lib';
import BottomActionSheet from '../../components2/BottomActionSheet';
import AppText from '../../componentV3/AppText';
import EnableTracking from '../../componentV3/EnableTracking';
import PopupGuildEnable from '../../componentV3/EnableTracking/PopupGuildEnable';
import colors from '../../constants/colors';
import {
  currentScreenName,
  getNotificationsFb,
  readAllNoti,
  readNoti,
  resetCanGetNotificationsFromDB,
} from '../../redux/actions';
import { onPressRSMMessage } from '../../redux/actions/actionsV3/rsmPushMessage';
import {
  fetchConversationContacts,
  sendRequestContact,
} from '../../redux/actions/conversationContact';
import { getLastNotiFBCategory } from '../../redux/actions/notification';
import { Message } from '../../submodules/firebase/model';
import { NOTIFICATION_TYPES } from '../../submodules/firebase/model/Notification';
import { openChatWithUser, prependChatMessages } from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import HeaderViewNews from './HeaderViewNews';
import MessageBubble from './MessageBubble';
import MessageView from './MessageView';
import NavigationBar from './NavigationBar';

const _ = require('lodash');

const MAX_INIT_MESS = 7;

const SCREEN_SIZE = Dimensions.get('window');

/* eslint-enable */

// --------------------------------------------------
// ChatBox
// --------------------------------------------------

class ChatBox extends Component {
  constructor(props) {
    super(props);

    const { thread } = this.props.navigation.state.params;

    // update state
    this.state = {
      canRenderChat: false,
      canRenderMess: false,
      canRenderUtil: false,
      showAvatar: undefined,
      closeAvatar: true,
      type: 'all',
      bottomAlertY: new Animated.Value(80),
    };
    this.thread = thread;

    this.lastNotiDate = Math.floor(Date.now() / 1000);
    this.updateLastTime();
    this.actionSheetRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState(
        {
          canRenderChat: true,
        },
        () => {
          setTimeout(() => {
            this.setState(
              {
                canRenderMess: true,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    canRenderUtil: true,
                  });

                  // if (this.currentMessagses().length < MAX_INIT_MESS) {
                  this.props.getLastNotiFBCategory(this.thread.type);

                  // }
                  this.props.resetCanGetNotificationsFromDB();

                  setTimeout(() => {
                    this.moveBottomAlert(0);
                  });
                }, 100);
              },
            );
          }, 50);
        },
      );
    }, 0);

    setTimeout(() => {
      this.props.currentScreenName(`ChatBox_${this.thread.type}`);
    }, 10);
  }

  componentWillReceiveProps(nextPros) {
    if (this.thread.type === 'admin') {
      if (!_.isEqual(nextPros.adminGiftedNotifications, this.props.adminGiftedNotifications)) {
        const nextNotis = nextPros.adminGiftedNotifications;
        if (nextNotis.length > 0) {
          this.lastNotiDate = nextNotis[nextNotis.length - 1].notification.createTime - 1;
        }
      }
    } else if (
      !_.isEqual(nextPros.systemGiftedNotifications, this.props.systemGiftedNotifications)
    ) {
      const nextNotis = nextPros.systemGiftedNotifications;
      if (nextNotis.length > 0) {
        this.lastNotiDate = nextNotis[nextNotis.length - 1].notification.createTime - 1;
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    this.props.resetCanGetNotificationsFromDB();
    if (this.thread.type === 'system') {
      setTimeout(() => {
        // this.props.readAllNoti(this.thread.type, this.state.type);
      }, 2000);
    }
  }

  componentWillFocus = () => {
    // eslint-disable-line
  };

  componentWillBlur() {}

  updateLastTime = () => {
    const nextNotis =
      this.thread.type === 'admin'
        ? this.props.adminGiftedNotifications
        : this.props.systemGiftedNotifications;
    if (nextNotis.length > 0) {
      this.lastNotiDate = nextNotis[nextNotis.length - 1].notification.createTime - 1;
    }
  };

  // --------------------------------------------------
  onNavBarBackPress = () => {
    this.props.navigation.goBack();
  };

  onNavBarTitlePress = () => {
    this.actionSheet.show();
  };

  onActionSheetPress = (index) => {
    if (index === 1 && this.state.type !== 'all') {
      this.filterMessageUnread(false);
    } else if (index === 2 && this.state.type !== 'unread') {
      this.filterMessageUnread(true);
    } else if (index === 3) {
      this.props.readAllNoti(this.thread.type, this.state.type);
    }
  };

  onNewMessageAlertPress = () => {
    this.filterMessageUnread(this.state.type === 'all');
  };

  filterMessageUnread = (unread) => {
    if (unread) {
      this.props.getNotificationsFb(
        this.thread.type,
        Math.floor(Date.now() / 1000),
        false,
        MAX_INIT_MESS,
        'unread',
      );
      this.setState({
        type: 'unread',
      });
    } else {
      this.props.getNotificationsFb(
        this.thread.type,
        Math.floor(Date.now() / 1000),
        false,
        MAX_INIT_MESS,
      );
      this.setState({
        type: 'all',
      });
    }
  };

  // Gifted Chat events
  // --------------------------------------------------
  navigationPlatform = (mode, title, url, unbackableURLs) => {
    this.props.navigation.navigate('WebView', { mode, title, url, unbackableURLs });
  };

  navigationPlatformStackUrl = (mode, title, urlsStack, unbackableURLs) => {
    this.props.navigation.navigate('WebView', { mode, title, urlsStack, unbackableURLs });
  };

  onLoadEarlier = () => {
    if (this.props.getNotificationsResponse.canLoadMore === true) {
      this.props.getNotificationsFb(
        this.thread.type,
        this.lastNotiDate,
        true,
        MAX_INIT_MESS,
        this.state.type,
      );
    }
  };
  onPressAvatar = (user) => {
    this.setState({
      showAvatar: user,
      closeAvatar: false,
    });
  };
  onCloseAvatarPress = () => {
    this.setState({
      closeAvatar: true,
    });
    setTimeout(() => {
      this.setState({
        showAvatar: undefined,
      });
    }, 250);
  };

  getMessagesDefault = (user, text) => {
    const createAt2 = moment().valueOf();
    return [
      {
        authorFullName: user?.fullName,
        isReceivedBy: {},
        authorAvatarImage: user?.avatarImgURI?.uri,
        threadID: 'message_default_single_1240469574_1240498409',
        type_createTime: `text_${createAt2}`,
        uid: '-MRSuGbdti6kOAs-G83L',
        type: 'text',
        isDeleted: false,
        authorID: user?.uid,
        createTime: createAt2,
        tagDataJSON: '[]',
        text,
        updateTime: createAt2,
      },
    ]?.map((message) => {
      return Message.objectFromJSON(message);
    });
  };

  onMessagePress = (message) => {
    console.log(
      '\u001B[33m ai log ne \u001B[36m -> file: index.js -> line 293 -> message',
      message,
    );
    if (message.notification.type === NOTIFICATION_TYPES.CHANGE_PASS) {
      this.props.navigation.navigate('EditPassword');
    } else if (message.notification.type === NOTIFICATION_TYPES.MONEY_HISTORY) {
      this.props.navigation.navigate('AvailableMoney');
    } else if (message.notification.type === NOTIFICATION_TYPES.POINTS_HISTORY) {
      this.props.navigation.navigate('AvailablePoints');
    } else if (message.notification.type === NOTIFICATION_TYPES.EMPLOYEE_CARD) {
      this.props.navigation.navigate('EmployeeCard');
    } else if (message.notification.type === NOTIFICATION_TYPES.FEEDBACK) {
      const ticket = message.notification.extraData.ticket;
      // this.props.navigation.navigate('ChatFeedbackHome', { ticket });
      this.props.navigation.navigate('ChatFeedback', {
        screenMode: ticket.status,
        ticket,
      });
    } else if (
      message.notification.type === NOTIFICATION_TYPES.OPEN_VIEW ||
      message.notification.type === NOTIFICATION_TYPES.CONFIRM_CTV
    ) {
      const url = message?.notification?.extraData?.url;
      url && Linking.openURL(url);
    } else if (message.notification.type === NOTIFICATION_TYPES.CHAT_MESSAGE) {
      const extraData = JSON.parse(message?.notification?.extraDataJSON);
      const user = extraData?.user;
      this?.props?.onPressRSMMessage?.(message?.uid, (isSendMessage) => {
        const params = isSendMessage
          ? {
              textAutoSend: `${message?.title} (${message?.uid}):\n${message?.text}`,
              authorTextAutoSend: {
                authorID: user.uid,
                authorFullName: user.fullName,
                authorAvatarImage: user.avatarImage,
              },
            }
          : {};
        this.props.navigation.navigate('Chat', params);
        setTimeout(() => {
          this.props.openChatWithUser(user);
        }, 0);
      });
    } else {
      this.openNotiLink(message.notification);
    }
    if (!message.notification.read) {
      this.props.readNoti(message.notification.category, message);
    }
  };

  openNotiLink = (noti) => {
    const title = noti.extraData.screen_title || Strings.alert_title;
    if (
      noti.type === NOTIFICATION_TYPES.WEB_LINK ||
      noti.type === NOTIFICATION_TYPES.PLAIN_TEXT_WEB_LINK
    ) {
      const url = noti.extraData.url;
      const unbackableURLs = noti.extraData.unbackable_urls;
      if (url) {
        this.navigationPlatform(0, title, url, unbackableURLs);
      }
    } else if (noti.type === NOTIFICATION_TYPES.WEB_STACK) {
      const urlsStack = noti.extraData.urls_stack;
      const unbackableURLs = noti.extraData.unbackable_urls;
      if (urlsStack) {
        this.navigationPlatformStackUrl(1, title, urlsStack, unbackableURLs);
      }
    }
  };

  onNavToNotificationSetting = () => {
    const { navigation } = this.props;
    navigation.navigate('NotificationSetting');
  };

  onReadMessage = (message) => {
    if (!message.notification.read) {
      this.props.readNoti(message.notification.category, message);
    }
  };

  scrollingChat = ({ nativeEvent }) => {
    this.checkTopReached(nativeEvent);
    this.moveBottomAlert(nativeEvent.contentOffset.y);
  };

  checkTopReached = (nativeEvent) => {
    if (this.isCloseToTop(nativeEvent)) this.onLoadEarlier();
  };

  moveBottomAlert = (y) => {
    Animated.spring(this.state.bottomAlertY, {
      toValue: y,
    }).start();
  };

  // --------------------------------------------------
  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 150;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  additionBottom = () => {
    return Platform.select({
      ios: -44,
      android: -44,
    });
  };

  isLastMessage(message, messages) {
    if (!messages || messages.length === 0) {
      return false;
    }
    const isLast = message.uid === messages[0].uid;

    return isLast;
  }

  currentMessagses = () => {
    const {
      adminGiftedNotifications,
      systemGiftedNotifications,
      adminGiftedUnreadNotifications,
      systemGiftedUnreadNotifications,
    } = this.props;

    let messages = [];
    if (this.state.type === 'all') {
      messages =
        this.thread.type === 'admin' ? adminGiftedNotifications : systemGiftedNotifications;
    } else if (this.state.type === 'unread') {
      messages =
        this.thread.type === 'admin'
          ? adminGiftedUnreadNotifications
          : systemGiftedUnreadNotifications;
    }
    return messages;
  };

  // --------------------------------------------------
  renderChatLoadEarlierFunc = (props) => {
    return this.state.canRenderMess ? <LoadEarlier {...props} label={'Tải tin...'} /> : null;
  };
  renderAvatarChat = (props) => {
    return (
      <Animatable.View animation="fadeIn" duration={500} useNativeDriver>
        <CharAvatar
          avatarStyle={{
            height: 36,
            width: 36,
            borderRadius: 18,
          }}
          source={this.thread.photoImageURI()}
          defaultName={this.thread.titleString()}
          onPress={() => props.onPressAvatar && props.onPressAvatar(props.currentMessage.user)}
        />
      </Animatable.View>
    );
  };
  renderMessageTitleFunc = (props) => {
    const message = props.currentMessage;
    return message.notification.image ? (
      <HeaderViewNews currentMessage={message} type={this.thread.type} />
    ) : (
      <MessageView currentMessage={message} type={this.thread.type} onPress={this.onReadMessage} />
    );
  };

  renderMessageBubbleFunc = (props) => {
    const {
      adminGiftedNotifications,
      systemGiftedNotifications,
      adminGiftedUnreadNotifications,
      systemGiftedUnreadNotifications,
    } = this.props;
    let messages = [];
    if (this.state.type === 'all') {
      messages =
        this.thread.type === 'admin' ? adminGiftedNotifications : systemGiftedNotifications;
    } else if (this.state.type === 'unread') {
      messages =
        this.thread.type === 'admin'
          ? adminGiftedUnreadNotifications
          : systemGiftedUnreadNotifications;
    }
    const isLastMessage = this.isLastMessage(props.currentMessage, messages);
    return (
      <MessageBubble
        ref={this.addMessRef}
        {...props}
        name={props.currentMessage.user.name}
        currentMessage={props.currentMessage}
        prevMessage={props.previousMessage}
        isLastMessage={isLastMessage}
      />
    );
  };
  renderMessageText = (props) => {
    const message = props.currentMessage;
    const read = message.notification.read;

    return (
      <View style={{ marginLeft: 8, marginRight: 8, opacity: read ? 0.7 : 1 }}>
        <HTMLView html={message.text} />
      </View>
    );
  };
  renderMessageBottomFunc = (props) => {
    const mess = props.currentMessage;
    const read = mess.notification.read;

    return (
      <View style={styles.messBottom}>
        <View style={{ marginTop: 2 }}>
          <Time {...props} />
        </View>
        {mess.notification.type !== NOTIFICATION_TYPES.PLAIN_TEXT &&
          mess.notification.type !== NOTIFICATION_TYPES.CHANGE_PASS && (
            <View style={{ flexDirection: 'row' }}>
              <AppText style={[styles.detailTitle, read ? { color: '#111' } : {}]}>
                {this.thread.type === 'system' ? 'Chi tiết' : 'Khám phá ngay'}
              </AppText>
              <Image
                source={read ? require('./img/detail_gray.png') : require('./img/detail.png')}
                style={{ width: 12, height: 12, marginRight: 8, marginTop: 2 }}
                resizeMode="contain"
              />
            </View>
          )}
        {mess.notification.type === NOTIFICATION_TYPES.CHANGE_PASS && (
          <View style={{ flexDirection: 'row' }}>
            <AppText style={[styles.detailTitle, read ? { color: '#111' } : {}]}>
              {'Đổi mật khẩu'}
            </AppText>
            <Image
              source={read ? require('./img/detail_gray.png') : require('./img/detail.png')}
              style={{ width: 12, height: 12, marginRight: 8, marginTop: 2 }}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    );
  };
  // --------------------------------------------------
  renderNavigationBar() {
    // ---
    return (
      <NavigationBar
        thread={this.thread}
        onBackPress={this.onNavBarBackPress}
        onTitlePress={this.onNavBarTitlePress}
        loading={this.props.isGetNotificationsProcessing}
        type={this.state.type}
        onNavToNotificationSetting={this.onNavToNotificationSetting}
      />
    );
  }
  renderInputToolbar() {
    return <View style={{ height: 0, backgroundColor: '#f00' }} />;
  }

  renderEmptyDataView() {
    const messStr = this.state.type === 'all' ? 'Bạn chưa có tin nhắn' : 'Bạn đã đọc tất cả tin';
    const message = this.props.isGetNotificationsProcessing ? ' ' : messStr;
    return (
      <View style={styles.emptyDataContainer}>
        <EmptyDataView
          containerStyle={{}}
          title={message}
          onRefreshPress={this.onThreadsListRefresh}
          canReload={false}
          isSmile
        />
      </View>
    );
  }

  renderChat = () => {
    const {
      adminGiftedNotifications,
      systemGiftedNotifications,
      isGetNotificationsProcessing,
      getNotificationsResponse,
      adminGiftedUnreadNotifications,
      systemGiftedUnreadNotifications,
    } = this.props;

    let messages = [];
    if (this.state.type === 'all') {
      messages =
        this.thread.type === 'admin' ? adminGiftedNotifications : systemGiftedNotifications;
    } else if (this.state.type === 'unread') {
      messages =
        this.thread.type === 'admin'
          ? adminGiftedUnreadNotifications
          : systemGiftedUnreadNotifications;
    }

    // --
    // --
    return (
      <View style={styles.chatContainer}>
        {
          // messages.length === 0 ?
          //   this.renderEmptyDataView()
          //   :
          <GiftedChat
            // ref={(object) => {
            //   this.giftedChat = object;
            // }}
            // placeholder={placeholder}
            user={{
              _id: this.props.myUser.uid,
              name: this.props.myUser.fullName,
            }}
            messages={messages || []}
            loadEarlier={getNotificationsResponse.canLoadMore}
            isLoadingEarlier={isGetNotificationsProcessing}
            onLoadEarlier={this.onLoadEarlier}
            onLongPress={() => null}
            onPress={this.onMessagePress}
            onPressAvatar={this.onPressAvatar}
            renderInputToolbar={this.renderInputToolbar}
            renderAccessory={null}
            renderCustomView={this.renderMessageTitleFunc}
            renderBubble={this.renderMessageBubbleFunc}
            renderMessageText={this.renderMessageText}
            renderTime={this.renderMessageBottomFunc}
            renderLoadEarlier={this.renderChatLoadEarlierFunc}
            renderAvatar={this.renderAvatarChat}
            renderAvatarOnTop
            showAvatarForEveryMessage
            additionBottom={this.additionBottom}
            dateFormat="DD/MM/YYYY"
            wrapperStyle={{ marginTop: 14, marginBottom: 8 }}
            listViewProps={{
              scrollEventThrottle: 100,
              onScroll: this.scrollingChat,
            }}
            shouldUpdateMessage={() => true}
          />
        }
      </View>
    );
  };

  renderActionSheet() {
    const options = ['Đóng'];
    options.push('Xem tất cả tin');
    options.push('Xem tin chưa đọc');
    options.push('Đánh dấu đã đọc tất cả');
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        options={options}
        cancelButtonIndex={0}
        onPress={this.onActionSheetPress}
      />
    );
  }

  renderBottomAlert = () => {
    const unread =
      this.thread.type === 'admin'
        ? this.props.totalUnReadAdminNotificationsFb
        : this.props.totalUnReadSystemNotificationsFb;

    const isDisplayAll = this.state.type === 'all';

    const bottomAlertY = this.state.bottomAlertY.interpolate({
      inputRange: [-1, 0, 20, 30, 80, 81],
      outputRange: [0, 0, 10, 20, 60, 60],
      extrapolate: 'clamp',
    });

    const loading = this.props.isGetNotificationsProcessing;

    return unread > 0 && loading === false ? (
      <Animated.View
        style={[
          styles.bottomNewMessageAlert,
          {
            transform: [
              {
                translateY: bottomAlertY,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchNewMessageAlert}
          activeOpacity={0.2}
          onPress={this.onNewMessageAlertPress}
        >
          <AppText style={styles.textNewMessageAlert}>
            {isDisplayAll ? `Xem ${unread} tin chưa đọc` : 'Xem tất cả'}
          </AppText>
        </TouchableOpacity>
      </Animated.View>
    ) : null;
  };
  // --------------------------------------------------

  render() {
    const { canRenderChat } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.renderNavigationBar()}
        <View style={styles.container}>
          <View style={styles.container}>
            <EnableTracking
              onOpenBottomSheet={() => {
                this.actionSheetRef.current.open();
              }}
            />
            {canRenderChat && this.renderChat()}
            {this.renderActionSheet()}
          </View>
          {this.renderBottomAlert()}
        </View>
        <BottomActionSheet
          ref={this.actionSheetRef}
          render={() => {
            return <PopupGuildEnable />;
          }}
          canClose={true}
          headerText={'Mở theo dõi ứng dụng'}
          haveCloseButton={true}
        ></BottomActionSheet>
      </SafeAreaView>
    );
  }
}

// --------------------------------------------------

ChatBox.navigationOptions = () => ({
  title: 'Chat',
  header: null,
  headerBackTitle: ' ',
  // headerStyle: Styles.navigator_header_no_border,
  // headerTitleStyle: Styles.navigator_header_title,
  // headerTintColor: '#000',
  tabBarVisible: false,
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatBox.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isGetNotificationsProcessing: state.isGetNotificationsProcessing,
  getNotificationsResponse: state.getNotificationsResponse,
  adminGiftedNotifications: state.adminGiftedNotifications,
  systemGiftedNotifications: state.systemGiftedNotifications,

  adminGiftedUnreadNotifications: state.adminGiftedUnreadNotifications,
  systemGiftedUnreadNotifications: state.systemGiftedUnreadNotifications,

  totalUnReadAdminNotificationsFb: state.totalUnReadAdminNotificationsFb,
  totalUnReadSystemNotificationsFb: state.totalUnReadSystemNotificationsFb,
});

const mapDispatchToProps = (dispatch) => ({
  getNotificationsFb: (category, toDate, isAppend, num, type) =>
    dispatch(getNotificationsFb(category, toDate, isAppend, num, type)),
  readNoti: (category, noti) => dispatch(readNoti(category, noti)),
  readAllNoti: (category, type) => dispatch(readAllNoti(category, type)),
  resetCanGetNotificationsFromDB: () => dispatch(resetCanGetNotificationsFromDB()),
  currentScreenName: (name) => dispatch(currentScreenName(name)),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  fetchConversationContacts: (callback) => dispatch(fetchConversationContacts(callback)),
  defaultMessages: (messages) => dispatch(prependChatMessages(messages)),
  sendRequestContact: (phoneNumber, nickname, callback) =>
    dispatch(sendRequestContact(phoneNumber, nickname, callback)),
  getLastNotiFBCategory: (category) => dispatch(getLastNotiFBCategory(category)),
  onPressRSMMessage: (idNotify, callback) => dispatch(onPressRSMMessage(idNotify, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  chatContainer: {
    flex: 1,
  },
  chatBackgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  statusSentView: {
    alignItems: 'flex-end',
  },
  statusSentBG: {
    alignItems: 'flex-end',
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0003',
    paddingTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
    marginRight: 8,
    marginBottom: 6,
    marginTop: 2,
    top: -4,
  },
  statusReadBG: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
    marginBottom: 4,
    height: 22,
    borderRadius: 9,
    backgroundColor: '#0000',
    top: -4,
  },
  statusSent: {
    color: '#fff',
    fontSize: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },
  avatarImageRead: {
    marginLeft: 1,
    width: 20,
    height: 20,
    borderRadius: 20 / 2.0,
    // borderWidth: 1.0,
    borderColor: '#fff4',
    backgroundColor: '#fff',
  },
  textReadStyle: {
    fontSize: 11,
    marginLeft: 1,
    fontWeight: '100',
  },
  plusMemberBG: {
    justifyContent: 'center',
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0003',
    paddingTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
  },
  plusMemberTitle: {
    color: '#fff',
    fontSize: 10,
    paddingLeft: 4,
    paddingRight: 4,
    marginBottom: 3,
  },
  messBottom: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.app_theme_darker,
  },
  emptyDataContainer: {
    marginTop: SCREEN_SIZE.height / 4,
    // height: SCREEN_SIZE.height * 0.8,
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNewMessageAlert: {
    position: 'absolute',
    height: 38,
    left: 0,
    right: 0,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchNewMessageAlert: {
    flex: 0,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 38 / 2.0,
    borderWidth: 1.0,
    borderColor: `${colors.app_theme_darker}aa`,
  },
  textNewMessageAlert: {
    marginRight: 16,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '200',
    color: colors.app_theme_darker,
  },
});

// --------------------------------------------------

// test auto open message details
// setTimeout(() => {
//   const giftedMessage = this.state.giftedMessages[1];
//   const messageID = `${this.props.thread.uid}_${giftedMessage.uid}`;
//   const message = DatabaseManager.shared().realm().objectForPrimaryKey('Message', messageID);
//   if (!message) { return; }
//   this.openMessageDetails(message);
// }, 1000);
// end

// test create message
// const sendMessagePromise = (i) => {
//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       this.sendMessageText(`${i}`);
//       res(true);
//     }, 1500);
//   });
// };
// const asyncTask = async () => {
//   try {
//     for (let i = 0; i < 256; i += 1) {
//       await sendMessagePromise(i);
//     }
//   } catch (err) {
//     Utils.warn(`${LOG_TAG}: test err: ${test}`, err);
//   }
// };
// asyncTask();
// end
