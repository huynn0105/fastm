/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Navigation Params:
 * - members: list of User, create group thread with a pre-filled list of User
 */

import Strings from 'app/constants/strings';
import Styles from 'app/constants/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, FlatList, Image, Keyboard, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import colors from '../../constants/colors';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import ContactRow from './ContactRow';
import MemberCell from './MemberCell';
import NavigationBar from './NavigationBar';

const _ = require('lodash');
const removeDiacritics = require('diacritics').remove;

const LOG_TAG = 'CreateGroupChat.js';
/* eslint-enable */

const SEARCH_DELAY = 500;

// --------------------------------------------------
// CreateGroupChat.js
// --------------------------------------------------

class CreateGroupChat extends Component {
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
  componentWillMount() {
    // get members if having
    const navParams = this.props.navigation.state.params || {};
    const members = navParams.members || [];
    const isMembersSelected = {};
    members.forEach((user) => {
      isMembersSelected[user.uid] = true;
    });
    // get list of contacts
    // const contacts = ContactsManager.shared().getContactsArray();
    const { conversationContacts } = this.props;
    this.setState({
      contacts: conversationContacts,
      members,
      isMembersSelected,
    });
  }
  componentDidMount() {}
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // --------------------------------------------------
  onCancelPress = () => {
    Keyboard.dismiss();
    this.props.navigation.popToTop();
  };
  onDonePress = () => {
    Keyboard.dismiss();
    if (this.state.members.length > 0) {
      this.props.navigation.navigate('CreateGroupChatStep2', { members: this.state.members });
    }
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
    this.setState({
      searchText: '',
    });
  };
  onMemberPress = (user) => {
    Keyboard.dismiss();
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
  createGroupChat() {
    // add me to memebers as well
    const members = this.state.members.map((item) => Object.assign({}, item));
    members.push(this.props.myUser);
    // request
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const newThread = await ChatManager.shared().createGroupThread(members, {});
        this.hideSpinner();
        // wait for spinner hide & check
        setTimeout(() => {
          if (newThread) {
            this.props.navigation.goBack();
          } else {
            this.showAlert(Strings.create_thread_error);
          }
        }, 500);
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
          loading={false}
          onSearchTextChanged={this.setSearchText}
          placeholder={'Tìm kiếm liên hệ'}
        />
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
          // userPresenceStatus={user.presenceStatus}
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
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
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
        // userPresenceStatus={user.presenceStatus}
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

CreateGroupChat.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ tintColor }) => (
    <Image source={require('../img/tab_contacts.png')} style={[styles.icon, { tintColor }]} />
  ),
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

CreateGroupChat.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  conversationContacts: state.conversationContacts,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupChat);

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
    backgroundColor: colors.separator,
  },
  contactsListContainer: {
    flex: 1,
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