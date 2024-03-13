import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';

import EmptyDataView from 'app/components/EmptyDataView';

import AppStyles from '../../constants/styles';

import ContactRow from './ContactRow';
import colors from '../../constants/colors';

import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';

import {
  requestBlockedUsersList,
} from '../../submodules/firebase/redux/actions';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'AddNewContact/index.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// BlockedUsers
// --------------------------------------------------

class BlockedUsers extends Component {

  componentDidMount() {
    this.props.requestBlockedUsersList();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onCancelPress = () => {
    this.props.navigation.goBack();
  }
  onRefresh = () => {
    this.props.requestBlockedUsersList();
  }
  onRemovePress = (userID) => {
    const asyncTask = async () => {
      const result = await FirebaseDatabase.unblock(userID);
      if (result) {
        this.props.requestBlockedUsersList();
      }
    };
    asyncTask();
  }

  renderEmptyDataView() {
    const message = this.props.isGetBlockedUsersProcessing ? 'Đang tải...' 
    : 'Bạn không chặn bất kì ai\n\n(Khi chặn một ai đó, họ sẽ không thể bắt đầu cuộc trò chuyện với bạn)';
    return (
      <View style={styles.emptyDataContainer}>
        <EmptyDataView
          containerStyle={{ paddingBottom: 96 }}
          title={message}
          onRefreshPress={this.onThreadsListRefresh}
          canReload={false}
          isSmile
        />
      </View>
    );
  }
  // --------------------------------------------------
  renderContactRow = (row) => {
    const user = row.item;
    return (
      <ContactRow
        key={user.fullName}
        user={user}
        onRemovePress={this.onRemovePress}
      />
    );
  }
  renderResultsList() {
    const data = this.props.blockedUsers;
    return (
      <View style={styles.contactsListContainer}>
        <FlatList
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: colors.separator }}
              refreshing={this.props.isGetBlockedUsersProcessing}
              onRefresh={this.onRefresh}
            />
          }
          data={data}
          extraData={this.props.isGetBlockedUsersProcessing}
          keyExtractor={item => item.uid}
          renderItem={this.renderContactRow}
        />
      </View>
    );
  }
  render() {
    const isEmptyDataViewVisible = (this.props.blockedUsers.length === 0);
    return (
      <View style={styles.container}>
        {isEmptyDataViewVisible ? this.renderEmptyDataView() : this.renderResultsList()}
      </View>
    );
  }
}

BlockedUsers.navigationOptions = () => ({
  title: 'Danh sách người bị chặn',
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
});

const mapStateToProps = (state) => ({
  blockedUsers: state.blockedUsers,
  isGetBlockedUsersProcessing: state.isGetBlockedUsersProcessing,
});

const mapDispatchToProps = (dispatch) => ({
  requestBlockedUsersList: () => dispatch(requestBlockedUsersList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockedUsers);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  searchBarContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.separator,
  },
  contentContainer: {
    flex: 0,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.separator,
  },
  contactsListContainer: {
    flex: 1,
    backgroundColor: colors.separator,
  },
  topLine: {
    position: 'absolute',
    left: 0,
    top: 12,
    right: 0,
    height: 1,
    backgroundColor: '#E6EBFF',
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    right: 0,
    height: 1,
    backgroundColor: '#E6EBFF',
  },
  emptyDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
