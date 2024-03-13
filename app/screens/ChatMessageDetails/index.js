/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * For every user in thread. 
 * - If user's readTime >= message's createTime => read
 * - If user's readTime < message's createTime => received
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Styles from 'app/constants/styles';

import NavigationBar from './NavigationBar';
import MessageInfo from './MessageInfo';
import MembersList from './MembersList';

import ChatManager from '../../submodules/firebase/manager/ChatManager';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ChatMessageDetails/index.js';
/* eslint-enable */

const _ = require('lodash');

// -------------------------------------------------- 
// ChatMessageDetailsScreen
// --------------------------------------------------

class ChatMessageDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readMembers: [],
      unReadMembers: [],
    };
  }
  componentWillMount() {
    const { message, members, readTimes } = this.props.navigation.state.params;
    this.setState({
      message,
      members,
      readTimes,
    });
  }
  componentDidMount() {
    this.reloadData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onMemberPress = (user) => {
  }
  // --------------------------------------------------
  reloadData() {
    // reload members details, filter me out
    const { message, members, readTimes } = this.props.navigation.state.params;
    const readMembers = members.filter(user => {
      return readTimes[`user_${user.uid}`] >= message.createTime;
    });

    let receivedMembers = [];
    const receivedUserIDList = Object.keys(message.isReceivedBy);

    for (let i = 0; i < receivedUserIDList.length; i += 1) {
      const userID = receivedUserIDList[i];
      const readUserIDList = readMembers.filter(user => `user_${user.uid}` === userID);
      if (readUserIDList.length === 0) {
        receivedMembers = [...receivedMembers, ...members.filter(user => `user_${user.uid}` === userID)];
      }
    }
    this.setState({
      readMembers,
      unReadMembers: receivedMembers,
    });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    const { message } = this.state;
    const title = message ? message.authorFullName : null;
    return (
      <NavigationBar
        title={title}
        onBackPress={() => this.props.navigation.goBack()}
      />
    );
  }
  renderMessageInfo() {
    const { message } = this.state;
    return (
      <MessageInfo
        containerStyle={styles.messageInfoContainer}
        message={message}
      />
    );
  }
  renderMembersList() {
    const { readMembers, unReadMembers } = this.state;
    return (
      <MembersList
        containerStyle={styles.membersListContainer}
        readMembers={readMembers}
        unReadMembers={unReadMembers}
        onMemberPress={this.onMemberPress}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderMessageInfo()}
        <View style={styles.separator} />
        {this.renderMembersList()}
      </View>
    );
  }
}

// --------------------------------------------------

ChatMessageDetailsScreen.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarVisible: false,
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatMessageDetailsScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageDetailsScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageInfoContainer: {
    flex: 0,
  },
  membersListContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ECECEC',
  },
});

// test many members
// const membersDetails = membersDetails1;
// membersDetails.push(Object.assign(new User(), membersDetails[0], { uid: '10007' }));
// membersDetails.push(Object.assign(new User(), membersDetails[0], { uid: '10008' }));
// membersDetails.push(Object.assign(new User(), membersDetails[0], { uid: '10009' }));
// membersDetails.push(Object.assign(new User(), membersDetails[0], { uid: '10010' }));
// membersDetails.push(Object.assign(new User(), membersDetails[0], { uid: '10011' }));
// membersDetails.push(Object.assign(new User(), membersDetails[0], { uid: '10012' }));
// end
