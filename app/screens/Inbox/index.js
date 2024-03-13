/**
 * Inbox for push notification messages
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';

import KJTouchableOpacity from 'common/KJTouchableOpacity';
import NotificationsList from 'common/NotificationsList';
import LoadMoreView from 'common/LoadMoreView';
import MessageBox from 'common/MessageBox';

import {
  getNotifications,
  readAllNotifications,
  countUnReadNotifications,
} from 'app/redux/actions';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import DatabaseManager from 'app/manager/DatabaseManager';
import NotificationManager from 'app/manager/NotificationManager';

import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
} from '../../submodules/firebase/model/Notification';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'InboxScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// InboxScreen.js
// --------------------------------------------------

class InboxScreen extends Component {
  constructor(props) {
    super(props);

    let category = NOTIFICATION_CATEGORIES.ADMIN;
    if (this.props.navigation && this.props.navigation.state.params) {
      const params = this.props.navigation.state.params;
      if (params.category) { category = params.category; }
    }

    this.state = {
      category,
      isRefreshing: false,
      isMessageBoxVisible: false,
      alertTitle: '',
      alertMessage: '',
      alertTime: '',
    };
  }
  // --------------------------------------------------
  componentDidMount() {
    if (this.props.navigation) {
      this.props.navigation.setParams({
        onHeaderRightButtonPress: this.onHeaderRightButtonPress,
      });
    }
    this.reloadData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidUpdate(prevProps) {
    this.updateRefreshingState();
    this.updateCanLoadMoreState(prevProps);
  }
  // --------------------------------------------------
  onHeaderRightButtonPress = () => {
    this.actionSheet.show();
  };
  onNotificationPress = (noti) => {
    // Utils.log(`${LOG_TAG} onNotificationPress: `, noti);
    if (noti && noti.type === NOTIFICATION_TYPES.PLAIN_TEXT) {
      DatabaseManager.shared().readNotification(noti);
      this.showNotificationMessageBox(noti);
    } else {
      NotificationManager.shared().handleTapOnNotification(noti);
    }
    // update count notification
    setTimeout(() => {
      this.props.countUnReadNotifications(this.state.category);
    }, 1000);
  };
  // --------------------------------------------------
  getNotifications() {
    if (this.state.category === NOTIFICATION_CATEGORIES.ADMIN) {
      return this.props.adminNotifications;
    }
    else if (this.state.category === NOTIFICATION_CATEGORIES.SYSTEM) {
      return this.props.systemNotifications;
    }
    return [];
  }
  getTotalUnReadNotifications() {
    if (this.state.category === NOTIFICATION_CATEGORIES.ADMIN) {
      return this.props.totalUnReadAdminNotifications;
    }
    else if (this.state.category === NOTIFICATION_CATEGORIES.SYSTEM) {
      return this.props.totalUnReadSystemNotifications;
    }
    return 0;
  }
  // --------------------------------------------------
  canLoadMoreNotifications = true;
  notificationPage = 1;
  // --------------------------------------------------
  reloadData() {
    this.canLoadMoreNotifications = true;
    this.notificationPage = 1;
    this.props.getNotifications(this.state.category, this.notificationPage);
  }
  loadMoreData() {
    if (this.props.isGetNotificationsProcessing) {
      // Utils.log(`${LOG_TAG} loadMoreData: is processing -> return`);
      return;
    }
    if (!this.canLoadMoreNotifications) {
      // Utils.log(`${LOG_TAG} loadMoreData: already load all -> return`);
      return;
    }
    // load more
    // Utils.log(`${LOG_TAG} loadMoreData: load more: ${this.notificationPage + 1}`);
    this.notificationPage += 1;
    this.props.getNotifications(this.state.category, this.notificationPage);
    // test
    // load max 2 pages
    // if (this.notificationPage >= 2) {
    //   this.canLoadMoreNotifications = false;
    // }
    // end
  }
  readAllNotifications() {
    this.props.readAllNotifications(this.state.category);
  }
  updateRefreshingState() {
    if (!this.state.isRefreshing) { return; }
    const isProcessing = this.props.isGetNotificationsProcessing;
    if (isProcessing === false) {
      this.setState({ // eslint-disable-line
        isRefreshing: false,
      });
    }
  }
  updateCanLoadMoreState(prevProps) {
    if (prevProps.getNotificationsResponse.status !== undefined) return;
    if (this.props.getNotificationsResponse.status === undefined) return;
    if (!this.props.getNotificationsResponse.canLoadMore) {
      this.canLoadMoreNotifications = false;
    }
  }
  showNotificationMessageBox(noti) {
    const alertTitle = (noti.title && noti.title.length > 0) ? noti.title : Strings.app_name;
    const alertMessage = `${noti.details}`;
    const alertTime = noti.createTimeAgoString();
    this.setState({
      isMessageBoxVisible: true,
      alertTitle,
      alertMessage,
      alertTime,
    });
  }
  closeMessageBox() {
    this.setState({
      isMessageBoxVisible: false,
    });
  }
  // --------------------------------------------------
  isLoadMoreHidden() {
    // show loadmore if get money is processing
    let isLoadMoreHidden = true;
    if (this.props.isGetNotificationsProcessing || this.canLoadMoreNotifications === false) {
      isLoadMoreHidden = false;
    }
    // don't show if data empty
    const notifications = this.getNotifications();
    if (notifications.length === 0) {
      isLoadMoreHidden = true;
    }
    return isLoadMoreHidden;
  }
  isLoadMoreLoading() {
    return this.canLoadMoreNotifications;
  }
  isScrollViewReachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 96;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }
  // --------------------------------------------------
  renderList() {
    const notifications = this.getNotifications();
    const totalUnReadNotifications = this.getTotalUnReadNotifications();
    return (
      <NotificationsList
        style={styles.listContainer}
        data={notifications}
        extraData={totalUnReadNotifications}
        isLastRowSeparatorHidden
        onItemPress={this.onNotificationPress}
      />
    );
  }
  renderLoadMore() {
    return (
      <LoadMoreView
        style={{ marginTop: 12, marginBottom: 20 }}
        isHidden={this.isLoadMoreHidden()}
        isLoading={this.isLoadMoreLoading()}
      />
    );
  }
  renderActionSheet() {
    return (
      <ActionSheet
        ref={o => { this.actionSheet = o; }}
        options={['Đóng', 'Đánh dấu đọc tất cả']}
        cancelButtonIndex={0}
        onPress={(index) => {
          if (index === 1) {
            this.readAllNotifications();
          }
        }}
      />
    );
  }
  renderMessageBox() {
    return (
      <Modal isVisible={this.state.isMessageBoxVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MessageBox
            title={this.state.alertTitle}
            time={this.state.alertTime}
            message={this.state.alertMessage}
            leftButtonTitle={''}
            rightButtonTitle={'Đóng'}
            onRightButtonPress={() => this.closeMessageBox()}
          />
        </View>
      </Modal>
    );
  }
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={o => { this.scrollView = o; }}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: '#E6EBFF' }}
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.reloadData();
              }}
            />
          }
          scrollEventThrottle={500}
          onScroll={({ nativeEvent }) => {
            if (this.isScrollViewReachedEnd(nativeEvent)) {
              this.loadMoreData();
            }
          }}
        >

          {this.renderList()}
          {this.renderLoadMore()}

        </ScrollView>

        {this.renderActionSheet()}
        {this.renderMessageBox()}

      </View>
    );
  }
}

// --------------------------------------------------

InboxScreen.navigationOptions = ({ navigation }) => {
  let title = 'Thông báo';
  if (navigation.state.params && navigation.state.params.title) {
    title = navigation.state.params.title;
  }
  return ({
    title,
    headerStyle: Styles.navigator_header_no_border,
    headerTitleStyle: Styles.navigator_header_title,
    headerTintColor: '#000',
    headerRight: <HeaderRightButton navigation={navigation} />,
  });
};

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <KJTouchableOpacity
      style={styles.headerEditButton}
      onPress={() => {
        if (params.onHeaderRightButtonPress) {
          params.onHeaderRightButtonPress();
        }
      }}
    >
      <Image
        style={{ width: 22, height: 22, marginLeft: -8 }}
        source={require('./img/edit.png')}
        resizeMode={'contain'}
      />
    </KJTouchableOpacity>
  );
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

InboxScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isGetNotificationsProcessing: state.isGetNotificationsProcessing,
  getNotificationsResponse: state.getNotificationsResponse,
  adminNotifications: state.adminNotifications,
  systemNotifications: state.systemNotifications,
  totalUnReadAdminNotifications: state.totalUnReadAdminNotifications,
  totalUnReadSystemNotifications: state.totalUnReadSystemNotifications,
});

const mapDispatchToProps = (dispatch) => ({
  getNotifications: (category, page) => dispatch(getNotifications(category, page)),
  readAllNotifications: (category) => dispatch(readAllNotifications(category)),
  countUnReadNotifications: (category) => dispatch(countUnReadNotifications(category)),
});

// export default InboxScreen;
export default connect(mapStateToProps, mapDispatchToProps)(InboxScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6EBFF',
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.navigation_bg,
  },
  headerEditButton: {
    width: 44,
    height: 44,
    paddingLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
