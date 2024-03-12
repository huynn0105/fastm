/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import { showInfoAlert } from 'app/utils/UIUtils';
import MemberRow from 'app/components/MemberRow';
import AppText from '../../componentV3/AppText';
import KJButton from 'app/components/common/KJButton';

import NavigationBar from './NavigationBar';

import ChatManager from '../../submodules/firebase/manager/ChatManager';

import {
  closeChat,
  openChatWithUser,
} from '../../submodules/firebase/redux/actions';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'ChatMembers.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ChatMembers
// --------------------------------------------------

class ChatMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinnerText: '',
      isSpinnerVisible: false,
    };
  }
  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    // disabled -> will make images viewer render err
    // this.props.setChatImages([]);
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onRemoveMemberPress = (member) => {
    this.removeThreadMember(member);
  }
  onAddMemberPress = () => {
    const { thread } = this.props;
    this.props.navigation.navigate('AddChatMember', { thread });
  }

  onMemberPress = (user) => {
    const userID = user.uid;
    if (userID === this.props.myUser.uid) {
      return;
    }
    const asyncTask = async () => {
      try {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('Chat');

        if (this.props.chatThread !== null) {
          this.props.closeChat();
        }

        setTimeout(() => {
          this.props.openChatWithUser(user);
        }, 0);
      } catch (err) {  // eslint-disable-line
      }
    };
    asyncTask();
  }

  // --------------------------------------------------
  removeThreadMember(member) {
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const threadID = this.props.thread.uid;
        const result = await ChatManager.shared().removeUsersFromGroupThread(threadID, [member]);
        this.hideSpinner();
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
        }
      } catch (err) {
        this.hideSpinner();
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  }
  showSpinner(text = 'Đang xử lý') {
    this.setState({
      isSpinnerVisible: true,
      spinnerText: text,
    });
  }
  hideSpinner() {
    this.setState({
      isSpinnerVisible: false,
    });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onClosePress={this.onClosePress}
      />
    );
  }
  renderMembers() {
    // don't render member of single thread
    const { thread } = this.props;
    if (thread.isSingleThread()) { return null; }
    // render
    const members = thread.getMembersArray().reverse();
    for (let i = 0; i < members.length; i += 1) {
      if (members[i].isMe()) {
        if (i === 1) { break; }
        const temp = members[1];
        members[1] = members[i];
        members[i] = temp;
        break;
      }
    }
    for (let i = 0; i < members.length; i += 1) {
      if (thread.adminID === members[i].uid) {
        if (i === 0) { break; }
        const temp = members[0];
        members[0] = members[i];
        members[i] = temp;
        break;
      }
    }

    return (
      <View style={styles.membersContainer}>
        {this.renderMembersSectionHeader()}
        {members.map(user => this.renderMember(user))}
      </View>
    );
  }
  renderMembersSectionHeader() {
    const { thread } = this.props;
    const members = thread.getUsersArray();
    return (
      <View style={styles.sectionHeaderContainer}>
        <AppText style={styles.sectionHeaderText}>
          {`Thành viên (${members.length})`}
        </AppText>
        <AppText
          style={{
            fontSize: 12,
            color: '#7f7f7f',
            paddingTop: 4,
            marginRight: 4,
          }}
        >
          {'Thêm Thành viên'}
        </AppText>
        <KJButton
          containerStyle={{}}
          leftIconSource={require('./img/add_contact.png')}
          leftIconStyle={{ marginLeft: 0 }}
          onPress={this.onAddMemberPress}
        />
      </View>
    );
  }
  renderMember(user) {
    const { myUser, thread } = this.props;
    const isDeleteAble = thread.adminID === myUser.uid && user.uid !== myUser.uid;
    return (
      <MemberRow
        key={user.uid}
        user={user}
        isDeleteButtonHidden={!isDeleteAble}
        onDeletePress={this.onRemoveMemberPress}
        isAdmin={thread.adminID === user.uid}
        onRowPress={this.onMemberPress}
      />
    );
  }
  renderSpinner() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#00000080"
      />
    );
  }
  render() {
    const { thread } = this.props;
    return (
      thread ?
        <View style={styles.container}>
          {this.renderNavigationBar()}
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'on-drag'}
          >
            {this.renderMembers()}
            {this.renderSpinner()}
          </ScrollView>
        </View>
        : null
    );
  }
}

// --------------------------------------------------

ChatMembers.navigationOptions = () => ({
  title: 'Thành viên',
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatMembers.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  thread: state.chatThread,
  allThreads: state.allThreads,
});

const mapDispatchToProps = (dispatch) => ({
  closeChat: () => dispatch(closeChat()),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMembers);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navigation_bg,
  },
  scrollView: {
    flex: 1,
  },
  settingsContainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  membersContainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colors.navigation_bg,
  },
  sectionHeaderText: {
    flex: 1,
    color: '#7f7f7f',
    backgroundColor: colors.navigation_bg,
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: colors.navigation_bg,
  },
  viewMoreButton: {
    marginTop: 0,
  },
  viewMoreButtonTitle: {
    fontWeight: '400',
    color: '#1B94E3',
  },
});
