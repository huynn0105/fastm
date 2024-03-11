import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import Modal from 'react-native-modal';
import moment from 'moment';

import { getMoneyHistory } from 'app/redux/actions';
import Strings from 'app/constants/strings';

import AppStyles from 'app/constants/styles';
import BalanceInfo from 'app/common/BalanceInfo';
import FilterHeader from 'app/common/FilterHeader';
import LoadMoreView from 'app/common/LoadMoreView';
import MoneyHistoryList from 'app/common/MoneyHistoryList';
import MonthPicker from 'app/common/MonthPicker';

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'AvailableMoneyScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// AvailableMoneyScreen
// --------------------------------------------------

class AvailableMoneyScreen extends Component {
  constructor(props) {
    super(props);

    this.moneyHistoryPage = 1;
    this.canLoadMoreMoneyHistory = true;

    this.state = {
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
  onFilterPress = () => {
    this.showMonthPicker();
  }
  onMoneyTransactionPress = (transaction) => {
    Utils.log(`${LOG_TAG} onMoneyTransactionPress: `, transaction);
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
    this.canLoadMoreMoneyHistory = true;
    this.moneyHistoryPage = 1;
    const { fromDate, toDate } = this.getFilterTime();
    Utils.log(`${LOG_TAG} reloadData: ${fromDate} - ${toDate}: `, this.moneyHistoryPage);
    this.props.getMoneyHistory(fromDate, toDate, this.moneyHistoryPage);
  }
  loadMoreData() {
    if (this.props.isGetMoneyHistoryProcessing) {
      // Utils.log(`${LOG_TAG} loadMoreData: is processing -> return`);
      return;
    }
    if (!this.canLoadMoreMoneyHistory) {
      // Utils.log(`${LOG_TAG} loadMoreData: already load all -> return`);
      return;
    }
    // load more
    // Utils.log(`${LOG_TAG} loadMoreData: load more: ${this.moneyHistoryPage + 1}`);
    this.moneyHistoryPage += 1;
    const { fromDate, toDate } = this.getFilterTime();
    this.props.getMoneyHistory(fromDate, toDate, this.moneyHistoryPage);
    // test
    // load max 2 pages
    // if (this.moneyHistoryPage >= 2) {
    //   this.canLoadMoreMoneyHistory = false;
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
    if (prevProps.getMoneyHistoryResponse.status !== undefined) return;
    if (this.props.getMoneyHistoryResponse.status === undefined) return;
    if (!this.props.getMoneyHistoryResponse.canLoadMore) {
      this.canLoadMoreMoneyHistory = false;
    }
  }
  updateRefreshingState() {
    if (!this.state.isRefreshing) { return; }
    if (this.props.isGetMoneyHistoryProcessing === false && this.state.isRefreshing === true) {
      this.setState({ // eslint-disable-line
        isRefreshing: false,
      });
    }
  }
  isLoadMoreHidden() {
    // show loadmore if get money is processing
    let isLoadMoreHidden = true;
    if (this.props.isGetMoneyHistoryProcessing || this.canLoadMoreMoneyHistory === false) {
      isLoadMoreHidden = false;
    }
    // don't show if data empty
    if (this.props.moneyHistory.length === 0) {
      isLoadMoreHidden = true;
    }
    return isLoadMoreHidden;
  }
  isLoadMoreLoading() {
    return this.canLoadMoreMoneyHistory;
  }
  isScrollViewReachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 96;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }
  // --------------------------------------------------
  render() {
    const {
      myUser,
      moneyHistory,
    } = this.props;
    
    const filterTitle = this.state.filterMonth ?
      `Tháng ${this.state.filterMonth.format('MM/YYYY')}` : 'Lọc giao dịch';

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

          <BalanceInfo
            iconType={'money'}
            title={'Thu nhập tích lũy hiện tại'}
            balance={myUser.totalMoneyPrettyString()}
          />

          <FilterHeader
            style={styles.filterContainer}
            title={'Lịch sử giao dịch'}
            filterText={filterTitle}
            onFilterPress={this.onFilterPress}
          />

          <MoneyHistoryList
            data={moneyHistory}
            onItemPress={this.onMoneyTransactionPress}
          />

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

AvailableMoneyScreen.navigationOptions = () => ({
  title: 'Thu nhập tích lũy',
  headerBackTitle: Strings.navigation_back_title,
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

AvailableMoneyScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,

  isGetMoneyHistoryProcessing: state.isGetMoneyHistoryProcessing,
  getMoneyHistoryResponse: state.getMoneyHistoryResponse,
  moneyHistory: state.moneyHistory,
});

const mapDispatchToProps = (dispatch) => ({
  getMoneyHistory: (fromDate, toDate, page) => dispatch(getMoneyHistory(fromDate, toDate, page)),
});

// export default AvailableMoneyScreen;
export default connect(mapStateToProps, mapDispatchToProps)(AvailableMoneyScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  filterContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  historyContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
