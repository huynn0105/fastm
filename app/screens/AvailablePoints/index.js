import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import Modal from 'react-native-modal';
import moment from 'moment';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { 
  getGifts, 
  getPointsHistory,
} from 'app/redux/actions';

import Strings from 'app/constants/strings';
import Styles from 'app/constants/styles';

import BalanceInfo from 'app/common/BalanceInfo';
import FilterHeader from 'app/common/FilterHeader';
import GiftsList from 'app/common/GiftsList';
import LoadMoreView from 'app/common/LoadMoreView';
import MonthPicker from 'app/common/MonthPicker';
import PointsHistoryList from 'app/common/PointsHistoryList';
import TextHeader from 'app/common/TextHeader';

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'AvailablePointsScreen.js';
/* eslint-enable */

/* eslint-disable */
const TABS_TITLES = ['Đổi quà tặng', 'Lịch sử tích điểm'];
const GIFTS_TAB = 0;
const POINTS_TAB = 1;
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// AvailablePointsScreen
// --------------------------------------------------

class AvailablePointsScreen extends Component {
  constructor(props) {
    super(props);

    this.pointsHistoryPage = 1;
    this.canLoadMorePointsHistory = true;

    this.state = {
      selectedIndex: POINTS_TAB,
      isRefreshing: false,
      isMonthPickerVisible: false,
      filterMonth: undefined,
    };
  }
  componentDidMount() {
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
  onSegmentControlTabPress = (index) => {
    this.setState({
      selectedIndex: index,
    });
    setTimeout(() => {
      this.reloadData();
    }, 250);
  }
  onFilterPress = () => {
    this.showMonthPicker();
  }
  onPointsTransactionPress = (transaction) => {
    Utils.log(`${LOG_TAG} pointsTransaction: `, transaction);
  }
  onGiftPress = (gift) => {
    // cannot find url
    if (!gift.detailsURL || gift.detailsURL.length === 0) {
      return;
    }
    // open webview
    const title = gift.title;
    const url = `${gift.detailsURL}`;
    const params = {
      mode: 0, title, url, isBackableInside: false,
    };
    this.props.navigation.navigate('WebView', params);
  }
  getFilterTime() {
    if (!this.state.filterMonth) {
      return { fromDate: null, toDate: null };
    }
    const fromDate = moment(this.state.filterMonth.startOf('month')).unix();
    const toDate = moment(this.state.filterMonth.endOf('month')).unix();
    return { fromDate, toDate };
  }
  // --------------------------------------------------
  reloadData() {
    if (this.state.selectedIndex === POINTS_TAB) {
      this.reloadPointsHistory();
    } else {
      this.reloadGifts();
    }
  }
  loadMoreData() {
    // Utils.log(`${LOG_TAG} loadMoreData:`);
    if (this.state.selectedIndex === POINTS_TAB) {
      this.loadMorePointsHistory();
    }
  }
  reloadGifts() {
    this.props.getGifts();
  }
  reloadPointsHistory() {
    this.canLoadMorePointsHistory = true;
    this.pointsHistoryPage = 1;
    const { fromDate, toDate } = this.getFilterTime();
    Utils.log(`${LOG_TAG} reloadPointsHistory: ${fromDate} - ${toDate}: `, this.pointsHistoryPage);
    this.props.getPointsHistory(fromDate, toDate, this.pointsHistoryPage);
  }
  loadMorePointsHistory() {
    if (this.props.isGetPointsHistoryProcessing) {
      // Utils.log(`${LogTAG} loadMorePointsHistory: is processing -> return`);
      return;
    }
    if (!this.canLoadMorePointsHistory) {
      // Utils.log(`${LogTAG} loadMorePointsHistory: already load all -> return`);
      return;
    }
    // load more
    this.pointsHistoryPage += 1;
    // Utils.log(`${LogTAG} loadMorePointsHistory: load more: `, this.pointsHistoryPage);
    const { fromDate, toDate } = this.getFilterTime();
    this.props.getPointsHistory(fromDate, toDate, this.pointsHistoryPage);
    // test
    // load max 2 pages
    // if (this.pointsHistoryPage >= 2) {
    //   this.canLoadMorePointsHistory = false;
    // }
    // end
  }
  showMonthPicker() {
    this.setState({
      isMonthPickerVisible: true,
    });
  }
  hideMonthPicker() {
    this.setState({
      isMonthPickerVisible: false,
    });
  }
  filterHistoryByMonth(month) {
    this.setState({
      filterMonth: month,
      isMonthPickerVisible: false,
    });
    setTimeout(() => {
      this.reloadData();
    }, 500);
  }
  updateCanLoadMoreState(prevProps) {
    if (prevProps.getPointsHistoryResponse.status !== undefined) return;
    if (this.props.getPointsHistoryResponse.status === undefined) return;
    if (!this.props.getPointsHistoryResponse.canLoadMore) {
      this.canLoadMorePointsHistory = false;
    }
  }
  updateRefreshingState() {
    if (!this.state.isRefreshing) { return; }
    const isProcessing = this.selectedIndex === POINTS_TAB ?
      this.props.isGetPointsHistoryProcessing :
      this.props.isGetGiftsProcessing;
    if (isProcessing === false) {
      this.setState({ // eslint-disable-line
        isRefreshing: false,
      });
    }
  }
  isLoadMoreHidden() {
    if (this.state.selectedIndex === POINTS_TAB) {
      // show loadmore if get points is processing
      let isLoadMoreHidden = true;
      if (this.props.isGetPointsHistoryProcessing || this.canLoadMorePointsHistory === false) {
        isLoadMoreHidden = false;
      }
      // don't show if data empty
      if (this.props.pointsHistory.length === 0) {
        isLoadMoreHidden = true;
      }
      return isLoadMoreHidden;
    }
    return true;
  }
  isLoadMoreLoading() {
    if (this.state.selectedIndex === POINTS_TAB) {
      return this.canLoadMorePointsHistory;
    }
    return false;
  }
  isScrollViewReachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 96;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }
  // --------------------------------------------------
  render() {
    const {
      myUser,
      gifts,
      isGetGiftsProcessing,
      pointsHistory,
      isGetPointsHistoryProcessing,
    } = this.props;

    const filterTitle = this.state.filterMonth ?
      `Tháng ${this.state.filterMonth.format('MM/YYYY')}` : 'Lọc giao dịch';
    const giftEmptyDataText = isGetGiftsProcessing ?
      'Đang tải...' : 'Không có quà tặng nào';
    const pointsHistoryEmptyDataText = isGetPointsHistoryProcessing ?
      'Đang tải...' : 'Không có giao dịch nào';

    return (
      <View style={styles.container}>

        <ScrollView
          ref={o => { this.scrollView = o; }}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: colors.separator }}
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

          <BalanceInfo
            iconType="points"
            title="Số điểm tích luỹ hiện tại"
            balance={myUser.totalPointPrettyString()}
          />

          {/* <SegmentControl
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.onSegmentControlTabPress}
          /> */}

          {
            // header
            this.state.selectedIndex === POINTS_TAB ?
            <FilterHeader
              style={styles.filterContainer}
              title="Lịch sử giao dịch"
              filterText={filterTitle}
              onFilterPress={this.onFilterPress}
            />
            :
            <TextHeader
              style={styles.filterContainer}
              title="Danh sách quà tặng"
            />
          }

          {
            // list
            this.state.selectedIndex === POINTS_TAB ?
            <PointsHistoryList
              data={pointsHistory}
              emptyDataText={pointsHistoryEmptyDataText}
              onItemPress={this.onPointsTransactionPress}
            />
            :
            <GiftsList
              data={gifts}
              emptyDataText={giftEmptyDataText}
              onItemPress={this.onGiftPress}
            />
          }

          <LoadMoreView
            style={{ marginTop: 12, marginBottom: 20 }}
            isHidden={this.isLoadMoreHidden()}
            isLoading={this.isLoadMoreLoading()}
          />

        </ScrollView>

        <Modal isVisible={this.state.isMonthPickerVisible}>
          <MonthPicker
            onCancelPress={() => this.hideMonthPicker()}
            onFilterPress={(month) => {
              this.filterHistoryByMonth(month);
            }}
          />
        </Modal>

      </View>
    );
  }
}

// --------------------------------------------------

// const SegmentControl = (props) => (
//   <SegmentedControlTab
//     tabsContainerStyle={{
//       alignSelf: 'center',
//       width: 272,
//       marginTop: 4,
//       marginBottom: 12,
//     }}
//     tabStyle={{
//       borderColor: '#30AAEC',
//     }}
//     tabTextStyle={{
//       color: '#30AAEC',
//     }}
//     activeTabStyle={{
//       backgroundColor: '#30AAEC',
//     }}
//     values={TABS_TITLES}
//     selectedIndex={props.selectedIndex}
//     onTabPress={props.onTabPress}
//   />
// );

// --------------------------------------------------

AvailablePointsScreen.navigationOptions = () => ({
  title: 'Số điểm tích lũy',
  headerBackTitle: Strings.navigation_back_title,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

AvailablePointsScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,

  isGetGiftsProcessing: state.isGetGiftsProcessing,
  getGiftsResponse: state.getGiftsResponse,
  gifts: state.gifts,

  isGetPointsHistoryProcessing: state.isGetPointsHistoryProcessing,
  getPointsHistoryResponse: state.getPointsHistoryResponse,
  pointsHistory: state.pointsHistory,
});

const mapDispatchToProps = (dispatch) => ({
  getGifts: () => dispatch(getGifts()),
  getPointsHistory: (fromDate, toDate, page) => dispatch(getPointsHistory(fromDate, toDate, page)),
});

// export default AvailablePointsScreen;
export default connect(mapStateToProps, mapDispatchToProps)(AvailablePointsScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  filterContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: colors.separator,
  },
});
