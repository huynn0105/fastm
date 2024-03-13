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
import LoadMoreView from 'common/LoadMoreView';
import MessageBox from 'common/MessageBox';

import {
  getNotifications,
  readAllNotifications,
  countUnReadNotifications,
} from 'app/redux/actions';

import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
} from '../../submodules/firebase/model/Notification';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import DatabaseManager from 'app/manager/DatabaseManager';
import NotificationManager from 'app/manager/NotificationManager';
import Tabbar from 'app/components/AnimatedTabbar';

import MailList from './MailList';

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'MailScreen.js';
/* eslint-enable */

// --------------------------------------------------
// MailScreen.js
// --------------------------------------------------

const _ = require('lodash');

const TABS = {
  ALL: 0,
  IMPORTTANT: 1,
  SALE: 2,
};

class MailScreen extends Component {
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

      selectedType: TABS.ALL,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
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
  componentDidUpdate(prevProps) {
    this.updateRefreshingState();
    this.updateCanLoadMoreState(prevProps);
  }
  // --------------------------------------------------
  onTabTapped = (tag) => {
    if (this.state.selectedType !== tag) {
      this.setState({ selectedType: tag });
    }
  }

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
  getNotifications(type) {
    if (type === TABS.ALL) {
      return this.props.adminNotifications;
    }

    if (type === TABS.IMPORTTANT) {
      return this.props.adminNotifications.reduce(
        (result, item) =>
          result.concat(item.isImportant() ? [item] : [])
        , [],
      );
    }

    if (type === TABS.SALE) {
      return this.props.adminNotifications.reduce(
        (result, item) =>
          result.concat(item.isPromotion() ? [item] : [])
        , [],
      );
    }

    return [];
  }
  getTotalUnReadNotifications() {
    return this.props.totalUnReadAdminNotifications;
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
    const notifications = this.getNotifications(this.state.selectedType);
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

  renderTabbar = () => {
    const buttons = [
      { title: 'Tất cả', tag: TABS.ALL },
      { title: 'Quan trọng', tag: TABS.IMPORTTANT },
      { title: 'Khuyến mãi', tag: TABS.SALE },
    ];
    return (
      <Tabbar
        dataButtons={buttons}
        onTabTapped={this.onTabTapped} 
        selectedIndex={0}
      />
    );
  }

  renderList() {
    const notifications = this.getNotifications(this.state.selectedType);
    const totalUnReadNotifications = this.getTotalUnReadNotifications();
    return (
      <MailList
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
        {
          this.renderTabbar()
        }
        <ScrollView
          ref={o => { this.scrollView = o; }}
          style={{ flex: 1, backgroundColor: colors.navigation_bg }}
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

MailScreen.navigationOptions = ({ navigation }) => {
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

MailScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isGetNotificationsProcessing: state.isGetNotificationsProcessing,
  getNotificationsResponse: state.getNotificationsResponse,
  adminNotifications: state.adminNotifications,
  totalUnReadAdminNotifications: state.totalUnReadAdminNotifications,
});

const mapDispatchToProps = (dispatch) => ({
  getNotifications: (category, page) => dispatch(getNotifications(category, page)),
  readAllNotifications: (category) => dispatch(readAllNotifications(category)),
  countUnReadNotifications: (category) => dispatch(countUnReadNotifications(category)),
});

// export default MailScreen;
export default connect(mapStateToProps, mapDispatchToProps)(MailScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navigation_bg,
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
