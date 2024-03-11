import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';

import EmptyDataView from 'app/components/EmptyDataView';

import ContactRow from './ContactRow';
import colors from '../../constants/colors';

import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';

import { requestBlockedUsersList } from '../../submodules/firebase/redux/actions';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import Colors from '../../theme/Color';
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
  };
  onRefresh = () => {
    this.props.requestBlockedUsersList();
  };
  onRemovePress = (userID) => {
    const asyncTask = async () => {
      const result = await FirebaseDatabase.unblock(userID);
      if (result) {
        this.props.requestBlockedUsersList();
      }
    };
    asyncTask();
  };

  renderEmptyDataView() {
    const message = this.props.isGetBlockedUsersProcessing
      ? 'Đang tải...'
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
    return <ContactRow key={user.fullName} user={user} onRemovePress={this.onRemovePress} />;
  };
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
          keyExtractor={(item) => item.uid}
          renderItem={this.renderContactRow}
        />
      </View>
    );
  }
  render() {
    const isEmptyDataViewVisible = this.props.blockedUsers.length === 0;
    return (
      <View style={styles.container}>
        {isEmptyDataViewVisible ? this.renderEmptyDataView() : this.renderResultsList()}
      </View>
    );
  }
}

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
    backgroundColor: Colors.neutral5,
  },
  contactsListContainer: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  emptyDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
