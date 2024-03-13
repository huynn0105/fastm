/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import ContactsManager from 'app/manager/ContactsManager';
import { showInfoAlert } from 'app/utils/UIUtils';
// --------------------------------------------------
import Utils from 'app/utils/Utils';
import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import EmptyDataView from '../../components/EmptyDataView';
import SearchBar from '../../components/SearchBar';
import colors from '../../constants/colors';
import { User } from '../../models';
import { fetchContacts } from '../../redux/actions';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../../submodules/firebase/network/FirebaseFunctions';
import { closeChat, openChatWithUser } from '../../submodules/firebase/redux/actions';
import { checkWriteContact, requestWriteContact } from '../../utils/Permission';
import ContactRow from './ContactRow';
import NavigationBar from './NavigationBar';

const LOG_TAG = 'AddNewContact/index.js';

const _ = require('lodash');

// --------------------------------------------------
// AddNewContactScreen
// --------------------------------------------------

class AddNewContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      users: [],
      isSearching: false,
      isContactsPermissionsGranted: true,
    };
  }
  componentDidMount() {
    this.searchBarComponent.searchBar.focus();
    this.checkContactsPermissions();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onAddUserPress = (user) => {
    this.addUserToContact(user.fullName, user.mPhoneNumber);
  };
  onChatPress = (user) => {
    this.openChatWithUser(user);
  };
  onCancelPress = () => {
    this.props.navigation.goBack();
  };

  onSearchText = (text) => {
    if (text.trim().length >= 8) {
      const phoneNumber = this.formatPhoneNumber(text);
      this.requestSearchUserByPhone(phoneNumber);
    }
  };

  openChatWithUser(user) {
    this.props.closeChat();

    const asyncTask = async () => {
      try {
        this.props.navigation.goBack();
        this.props.navigation.navigate('Chat');
        setTimeout(() => {
          this.props.openChatWithUser(user);
        }, 0);
      } catch (err) {
        Utils.warn(`openChatWithUser: err: ${err}`, err);
        this.isOpeningThread = false;
      }
    };
    asyncTask();
  }

  addUserToContact = (name, phoneNumber) => {
    const asyncTask = async () => {
      try {
        const result = await ContactsManager.shared().addPhoneContact('', name, phoneNumber);
        // result
        if (result) {
          showInfoAlert('Thêm liên lạc mới thành công!');
          this.props.fetchContacts();
        } else {
          showInfoAlert(
            'Không thể tạo liên lạc mới trong danh bạ!. Hãy kiểm tra cho phép truy cập danh bạ',
          );
        }
      } catch (err) {
        showInfoAlert(
          'Không thể tạo liên lạc mới trong danh bạ!. Hãy kiểm tra cho phép truy cập danh bạ',
        );
      }
    };

    checkWriteContact()
      .then((isAuthorized) => {
        if (!isAuthorized) {
          return requestWriteContact();
        }
        return true;
      })
      .then((isAuthorized) => {
        // if (isAuthorized) {
        asyncTask();
        // }
      });
  };
  formatPhoneNumber = (phoneNumber) => {
    return User.standardizePhoneNumber(phoneNumber);
  };
  requestSearchUserByPhone = (phoneNumber) => {
    const asyncRequest = async () => {
      const token = await FirebaseDatabase.firebaseToken();
      this.setState({
        isSearching: true,
      });
      FirebaseFunctions.searchUserByPhone(phoneNumber, token)
        .then((users) => {
          this.setState({
            isSearching: false,
            users,
            searchText: phoneNumber,
          });
        })
        .catch(() => {
          this.setState({
            isSearching: false,
            users: [],
            searchText: phoneNumber,
          });
        });
    };
    asyncRequest();
  };
  checkEmptyResult = () => {
    return (
      this.state.users.length === 0 &&
      this.state.searchText !== '' &&
      this.state.isSearching === false
    );
  };
  checkIsWelcomeState = () => this.state.users.length === 0 && this.state.searchText === '';
  checkExistInContact = (user) => {
    const phone = user.mPhoneNumber;
    for (let i = 0; i < this.props.allContacts.length; i += 1) {
      const contact = this.props.allContacts[i];
      if (this.formatPhoneNumber(phone) === this.formatPhoneNumber(contact.phoneNumber)) {
        return true;
      }
    }
    return false;
  };
  checkIsMine = (user) => {
    const phone = user.mPhoneNumber;
    return this.formatPhoneNumber(phone) === this.formatPhoneNumber(this.props.myUser.phoneNumber);
  };
  checkContactsPermissions() {
    const asyncTask = async () => {
      try {
        const isGranted = await ContactsManager.shared().checkContactsPermissions();
        this.setState({
          isContactsPermissionsGranted: isGranted,
        });
      } catch (err) {
        Utils.log(`${LOG_TAG}.checkContactsPermissions: exc: `, err);
      }
    };
    asyncTask();
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return <NavigationBar onCancelPress={this.onCancelPress} />;
  }
  renderSearchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <SearchBar
          ref={(ref) => {
            this.searchBarComponent = ref;
          }}
          style={{ width: '100%' }}
          loading={this.state.isSearching}
          onSearchTextChanged={this.onSearchText}
          placeholder={'Tìm kiếm bằng số điện thoại'}
          keyboardType={'numeric'}
        />
      </View>
    );
  }
  renderContactRow = (row) => {
    const user = row.item;
    const isExist = this.checkExistInContact(user);
    const isMine = this.checkIsMine(user);
    return (
      <ContactRow
        key={user.uid}
        user={user}
        onPress={this.onContactPress}
        onAddPress={this.onAddUserPress}
        onChatPress={this.onChatPress}
        isMine={isMine}
        isExist={isExist}
      />
    );
  };
  renderResultsList() {
    const data = this.state.users;
    return (
      <View style={styles.contactsListContainer}>
        <FlatList
          data={data}
          extraData={this.props.allContacts}
          keyExtractor={(item) => item.uid}
          renderItem={this.renderContactRow}
        />
      </View>
    );
  }
  renderDataView = () =>
    this.checkEmptyResult() ? this.renderEmptyDataView() : this.renderResultsList();
  renderEmptyDataView() {
    const title = 'Số điện thoại không đúng hoặc chưa đăng kí sử dụng MFast';
    return (
      <View style={styles.emptyDataContainer}>
        <EmptyDataView containerStyle={{ paddingBottom: 96 }} title={title} canReload={false} />
      </View>
    );
  }
  renderWelcomeView() {
    let title = 'Liên hệ sẽ được thêm vào danh bạ trên điện thoại của bạn';
    if (!this.state.isContactsPermissionsGranted) {
      title = 'Hãy cho phép truy cập danh bạ để có thể thêm liên hệ vào danh bạ';
    }
    return (
      <View style={styles.emptyDataContainer}>
        <EmptyDataView
          isSmile={this.state.isContactsPermissionsGranted}
          containerStyle={{ paddingBottom: 96 }}
          title={title}
          canReload={false}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderSearchBar()}
        {this.checkIsWelcomeState() ? this.renderWelcomeView() : this.renderDataView()}
        {this.renderWelcomeView()}
      </View>
    );
  }
}

AddNewContactScreen.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  allContacts: state.allContacts,
  allThreads: state.allThreads,
  isFetchContactsProcessing: state.isFetchContactsProcessing,
});

const mapDispatchToProps = (dispatch) => ({
  fetchContacts: () => dispatch(fetchContacts()),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  closeChat: () => dispatch(closeChat()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewContactScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#E6EBFF',
  },
  searchBarContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.separator,
    flexDirection: 'row',
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
    top: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E6EBFF',
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E6EBFF',
  },
  emptyDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: 100,
    height: 100,
  },
});
