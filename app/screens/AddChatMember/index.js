/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Navigation Params:
 * - thread: instance of Thread, which is about to add more user
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import colors from '../../constants/colors';
import Strings from '../../constants/strings';
import Styles from '../../constants/styles';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import ContactRow from './ContactRow';
import MemberCell from './MemberCell';
import NavigationBar from './NavigationBar';

const _ = require('lodash');
const removeDiacritics = require('diacritics').remove;

const LOG_TAG = 'AddChatMember/index.js';
/* eslint-enable */

const SEARCH_DELAY = 500;

// --------------------------------------------------
// AddChatMemberScreen
// --------------------------------------------------

class AddChatMemberScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSpinnerVisible: false,
      spinnerText: 'Đang xử lý',
      contacts: [],
      contactsExtraData: false,
      members: [],
      membersExtraData: false,
      isMembersSelected: {},
      searchText: '',
    };
  }
  componentDidMount() {
    // get members if having
    const navParams = this.props.navigation.state.params || {};
    const { conversationContacts } = this.props;
    const thread = navParams.thread || null;
    // mark added contacts
    const members = thread.getUsersArray();
    const isMembersSelected = {};
    members.forEach((user) => {
      isMembersSelected[user.uid] = true;
    });
    // // get list of contacts
    this.setState({
      thread,
      contacts: conversationContacts,
      isMembersSelected,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // --------------------------------------------------
  onCancelPress = () => {
    this.props.navigation.goBack();
  };
  onDonePress = () => {
    if (this.state.members.length <= 0) {
      return;
    }
    this.addUsersToGroupChat();
  };
  onSearchBarChangeText = (text) => {
    this.debounceSetSearchText(text);
  };
  onSearchBarClearText = () => {
    this.debounceSetSearchText('');
  };
  onContactPress = (user) => {
    // check user
    if (this.state.isMembersSelected[user.uid]) {
      return;
    }
    // add to member
    this.state.isMembersSelected[user.uid] = true;
    this.state.members.push(user);
    // update ui
    this.setState((prevState) => ({
      contactsExtraData: !prevState.contactsExtraData,
      membersExtraData: !prevState.membersExtraData,
    }));
  };
  onMemberPress = (user) => {
    // check user
    if (!this.state.isMembersSelected[user.uid]) {
      return;
    }
    // remove from member
    this.state.isMembersSelected[user.uid] = null;
    const removeUser = this.state.members.filter((item) => item.uid === user.uid)[0];
    if (removeUser) {
      const removeIndex = this.state.members.indexOf(removeUser);
      this.state.members.splice(removeIndex, 1);
    }
    // update ui
    this.setState((prevState) => ({
      contactsExtraData: !prevState.contactsExtraData,
      membersExtraData: !prevState.membersExtraData,
    }));
  };
  // --------------------------------------------------
  getContacts() {
    let contacts = this.state.contacts;
    const searchText = removeDiacritics(this.state.searchText.trim());
    if (searchText && searchText.length > 0) {
      contacts = contacts.filter((user) => {
        const name = user.fullNameNoDiacritics();
        const matchFullName = name.search(new RegExp(searchText, 'i')) !== -1;
        return matchFullName;
      });
    }
    return contacts;
  }
  setSearchText = (text) => {
    this.setState({ searchText: text });
  };
  debounceSetSearchText = _.debounce(this.setSearchText, SEARCH_DELAY);
  addUsersToGroupChat() {
    // request
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const { thread, members } = this.state;
        const result = ChatManager.shared().addUsersToGroupThread(thread.uid, members);
        this.hideSpinner();
        // wait for spinner hide & check
        setTimeout(() => {
          if (result) {
            this.props.navigation.goBack();
          } else {
            this.showAlert(Strings.update_thread_error);
          }
        }, 250);
      } catch (err) {
        // error
        this.showAlert(Strings.unknown_error);
      }
    };
    asyncTask();
  }
  // --------------------------------------------------
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
  showAlert(message) {
    Alert.alert(Strings.alert_title, message, [{ text: 'Đóng' }], { cancelable: false });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    const isDoneButtonEnable = this.state.members.length > 0;
    return (
      <NavigationBar
        onCancelPress={this.onCancelPress}
        onDonePress={this.onDonePress}
        isDoneButtonEnable={isDoneButtonEnable}
      />
    );
  }
  renderSearchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <SearchBar
          containerStyle={{ backgroundColor: colors.navigation_bg }}
          onSearchTextChanged={this.onSearchBarChangeText}
          onClearText={this.onSearchBarClearText}
          placeholder={'Tìm kiếm mọi người'}
        />
        <View style={styles.topLine} />
        <View style={styles.bottomLine} />
      </View>
    );
  }
  renderMembersList() {
    if (this.state.members.length === 0) {
      return null;
    }
    return (
      <View style={styles.membersListContainer}>
        <FlatList
          horizontal
          scrollIndicatorInsets={{ right: 0.5 }}
          data={this.state.members}
          extraData={this.state.membersExtraData}
          keyExtractor={(item) => item.uid}
          renderItem={this.renderMemeberCell}
        />
      </View>
    );
  }
  renderMemeberCell = (row) => {
    const user = row.item;
    return (
      <Animatable.View animation="bounceIn" duration={350}>
        <MemberCell
          key={user.uid}
          user={user}
          userPresenceStatus={user.presenceStatus}
          onPress={this.onMemberPress}
        />
      </Animatable.View>
    );
  };
  renderContactsList() {
    const data = this.getContacts();
    return (
      <View style={styles.contactsListContainer}>
        <FlatList
          data={data}
          extraData={this.state.contactsExtraData}
          keyExtractor={(item) => item.uid}
          renderItem={this.renderContactRow}
        />
      </View>
    );
  }
  renderContactRow = (row) => {
    const user = row.item;
    const isSelected = this.state.isMembersSelected[user.uid] || false;
    return (
      <ContactRow
        key={user.uid}
        user={user}
        userPresenceStatus={user.presenceStatus}
        isSelected={isSelected}
        onPress={this.onContactPress}
      />
    );
  };
  render() {
    const { isSpinnerVisible, spinnerText } = this.state;
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderMembersList()}
        {this.renderSearchBar()}
        {this.renderContactsList()}
        <Spinner
          visible={isSpinnerVisible}
          textContent={spinnerText}
          textStyle={{ marginTop: 4, color: '#fff' }}
          overlayColor="#00000080"
        />
      </View>
    );
  }
}

// --------------------------------------------------

AddChatMemberScreen.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

AddChatMemberScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  conversationContacts: state.conversationContacts,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddChatMemberScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.separator,
  },
  searchBarContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.separator,
  },
  membersListContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#eee',
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
});
