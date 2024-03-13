/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  Linking,
  StyleSheet,
  View,
  Text,
  Image,
  SectionList,
  RefreshControl,
  Keyboard,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ActionSheet from 'react-native-actionsheet';
import Spinner from 'react-native-loading-spinner-overlay';
import DatabaseManager from 'app/manager/DatabaseManager';

import { fetchContacts, toggleContactFavorite, createAccount, makeCall } from 'app/redux/actions';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';

import ContactsManager, { CONTACTS_EVENTS } from 'app/manager/ContactsManager';

import DelaySearchBar from 'app/components/DelaySearchBar';
import EmptyDataView from 'app/components/EmptyDataView';
import { showAlert, showQuestionAlertWithTitle, call, openOSSettings } from 'app/utils/UIUtils';

import { checkContact, requestContact } from '../../utils/Permission';

import NavigationBar from './NavigationBar';
import GetContactsView from './GetContactsView';
import ContactRow from './ContactRow';

import ChatManager from '../../submodules/firebase/manager/ChatManager';
import AppText from '../../componentV3/AppText';
import {
  openChatWithUser,
  closeChat,
  openingThread,
} from '../../submodules/firebase/redux/actions';

import { block } from '../../redux/actions';

const removeDiacritics = require('diacritics').remove;

const ACTION_SHEET_CONTACT_LONG_PRESS = 'ACTION_SHEET_CONTACT_LONG_PRESS';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import { SCREEN_WIDTH } from '../../utils/Utils';
import colors from '../../theme/Color';
import { TouchableOpacity } from 'react-native';
const LOG_TAG = 'ContactsList/index.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ContactsListScreen
// --------------------------------------------------

class ContactsListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      isContactsPermissionsGranted: true,
      contactsExtraData: false,
      spinnerText: '',
      isSpinnerVisible: false,
      showIconEmtpy: true,
    };
    this.isOpeningThread = false;
  }
  componentDidMount() {
    this.addObservers();
    this.checkContactsPermissions();
    Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);

    this.subs = [
      this.props.navigation.addListener('willFocus', this.componentWillFocus),
      this.props.navigation.addListener('didFocus', this.componentDidFocus),
    ];
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  // }
  componentWillUnmount() {
    this.removeObservers();
    Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide);

    this.subs.forEach((sub) => sub.remove());
  }

  componentWillFocus = () => {
    // eslint-disable-line
    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }
    // if (this.props.allContacts.length === 0 && this.props.isFetchContactsProcessing === false) {
    //   this.reloadData();
    // }
  };

  componentDidFocus = () => {
    setTimeout(() => {
      checkContact()
        .then((isAuthorized) => {
          if (!isAuthorized) {
            return requestContact();
          }
          return false;
        })
        .then((isAuthorized) => {
          if (isAuthorized) {
            setTimeout(() => {
              this.onGetContactsPress();
            }, 0);
          }
        });
    }, 0);
  };

  // --------------------------------------------------
  onNavBarInboxPress = () => {
    // eslint-disable-line
    Utils.log(`${LOG_TAG}.onNavBarInboxPress`);
  };
  onNavBarAddPress = () => {
    this.props.navigation.navigate('AddNewContact');
  };
  onContactsListRefresh = () => {
    this.reloadData();
  };
  onContactPress = (user) => {
    this.openChatWithUser(user);
  };
  onContactLongPress = (user) => {
    this.setState(
      {
        actionSheetType: ACTION_SHEET_CONTACT_LONG_PRESS,
        targetContact: user,
      },
      () => {
        this.actionSheet.show();
      },
    );
  };
  onGetContactsPress = () => {
    this.requestContactsPermissions();
  };
  onSearchBarChangeText = (text) => {
    this.setState({ searchText: text });
  };
  onActionSheetPress = (index) => {
    // Utils.log(`${LOG_TAG} onActionSheetPress:`, index);
    if (index === 1 && this.state.targetContact) {
      const contact = this.state.targetContact;
      const isFavorite = !contact.isFavorite;
      this.props.toggleContactFavorite(contact.uid, isFavorite);
    } else if (index === 2 && this.state.targetContact) {
      const contact = this.state.targetContact;
      showQuestionAlertWithTitle(
        'Chặn cuộc trò chuyện',
        `Bạn có muốn chặn ${contact.fullName}?`,
        'Đồng ý',
        'Đóng',
        () => {
          this.props.block(contact.uid);
        },
      );
    }
  };
  onPressCall = (user) => {
    // const asyncTask = async () => {
    //   const call = this.props.makeCall(user.phoneNumber);
    //   this.props.navigation.navigate('Call', { call, user });
    // };
    // asyncTask();
    call(user.phoneNumber);
  };
  // --------------------------------------------------
  getContacts() {
    // eslint-disable-line
    let contacts = this.props.allContacts;
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
  reloadData = () => {
    this.props.fetchContacts();
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
  requestContactsPermissions() {
    const asyncTask = async () => {
      try {
        // show alert if permission is now granted
        const isSuccess = await ContactsManager.shared().requestContactsPermissions();
        if (!isSuccess) {
          const buttons = [
            {
              style: 'cancel',
              text: 'Đóng',
              onPress: () => {},
            },
            {
              text: 'Cài đặt',
              onPress: () => {
                openOSSettings();
              },
            },
          ];
          showAlert(Strings.contacts_access_guide, '', buttons);
          return;
        }
        // permission granted
        this.setState({
          isContactsPermissionsGranted: true,
        });
      } catch (err) {
        Utils.log(`${LOG_TAG}.requestContactsPermissions: exc: `, err);
      }
    };
    asyncTask();
  }
  addObservers() {
    const presenceEvent = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    ContactsManager.shared().addObserver(presenceEvent, this, () => {
      this.refreshFlatList();
    });
  }
  removeObservers() {
    const presenceEvent = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    ContactsManager.shared().removeObserver(presenceEvent, this);
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

  onKeyboardDidShow = (event) => {
    // eslint-disable-line
    // android doesn't call willshow
    if (Platform.OS === 'android') {
      this.setState({ showIconEmtpy: false });
    }
  };

  onKeyboardDidHide = () => {
    if (Platform.OS === 'android') {
      this.setState({ showIconEmtpy: true });
    }
  };

  openChatWithUser(user) {
    if (this.isOpeningThread === true) {
      return;
    }
    // this.props.openingThread(true);
    this.isOpeningThread = true;

    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }

    const asyncTask = async () => {
      try {
        // move to chat first, then load chat
        this.props.navigation.navigate('Chat');
        setTimeout(() => {
          this.props.openChatWithUser(user);
        }, 0);
        this.isOpeningThread = false;
      } catch (err) {
        Utils.warn(`openChatWithUser: err: ${err}`, err);
        this.isOpeningThread = false;
      }
    };
    asyncTask();
  }
  refreshFlatList() {
    this.setState({
      contactsExtraData: !this.state.contactsExtraData,
    });
  }
  // --------------------------------------------------
  renderContactSectionFunc = ({ section }) => {
    const sectionSeparator = section.index === 0 ? 2 : 8;
    return (
      <View style={styles.contactSection}>
        <AppText style={[styles.contactSectionTitle, { marginTop: sectionSeparator }]}>
          {section.title}
        </AppText>
        {section.uid === 'contact' ? (
          <TouchableOpacity onPress={this.onNavBarAddPress}>
            <AppText
              style={[
                styles.contactSectionTitle,
                { marginTop: sectionSeparator, color: colors.primary2 },
              ]}
            >
              {'Thêm danh bạ'}
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  renderContactRowFunc = (row) => {
    const contact = row.item;
    return (
      <ContactRow
        key={contact.uid}
        user={contact}
        onPress={this.onContactPress}
        onLongPress={this.onContactLongPress}
        onPressCall={this.onPressCall}
      />
    );
  };
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onAddPress={this.onNavBarAddPress}
        loading={this.props.isFetchContactsProcessing}
        onSearchTextChanged={this.onSearchBarChangeText}
      />
    );
  }
  renderGetContactsView() {
    return (
      <View style={{ flex: 0, paddingBottom: 12 }}>
        <GetContactsView onPress={this.onGetContactsPress} />
      </View>
    );
  }
  renderContactsList() {
    if (!this.state.isContactsPermissionsGranted) {
      return null;
    }
    const { contactsExtraData } = this.state;
    const contacts = this.getContacts();
    // group contacts by favorite
    const favoriteContacts = contacts
      .filter((item) => item?.isFavorite)
      .sort((a, b) => {
        const nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    const normalContacts = contacts
      .filter((item) => !item?.isFavorite)
      .sort((a, b) => {
        const nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

    // only display non-empty sections
    const sections = [];
    if (favoriteContacts.length > 0) {
      sections.push({ data: favoriteContacts, title: 'Ưa thích', uid: 'favorite', index: 0 });
    }
    if (normalContacts.length > 0) {
      sections.push({
        data: normalContacts,
        title: 'Liên hệ',
        uid: 'contact',
        index: sections.length,
      });
    }
    // ---
    return (
      <SectionList
        style={{ overflow: 'hidden' }}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: colors.separator }}
            refreshing={false}
            onRefresh={this.onContactsListRefresh}
          />
        }
        keyExtractor={(item) => item.uid}
        renderItem={this.renderContactRowFunc}
        renderSectionHeader={this.renderContactSectionFunc}
        extraData={contactsExtraData}
        sections={sections}
      />
    );
  }
  renderEmptyDataView() {
    const title = this.state.isContactsPermissionsGranted
      ? Strings.contacts_empty
      : Strings.contacts_empty_because_access;
    const showIconEmtpy = this.state.showIconEmtpy;

    return (
      <View style={styles.emptyDataContainer}>
        <EmptyDataView
          showIconEmtpy={showIconEmtpy}
          containerStyle={{ paddingBottom: 96 }}
          title={title}
          onRefreshPress={this.onContactsListRefresh}
        />
      </View>
    );
  }
  renderSearchEmptyDataView() {
    return (
      <View style={styles.searchEmptyDataContainer}>
        <AppText style={styles.emptyTitle}>{'Không tìm thấy liên hệ nào!'}</AppText>
      </View>
    );
  }
  renderSpinner() {
    const { isSpinnerVisible, spinnerText } = this.state;
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#0003"
        size="small"
      />
    );
  }
  renderActionSheet() {
    const options = ['Đóng'];
    if (this.state.actionSheetType === ACTION_SHEET_CONTACT_LONG_PRESS) {
      const contact = this.state.targetContact;
      const message = contact.isFavorite ? 'Bỏ khỏi ưa thích' : 'Thêm vào ưa thích';
      options.push(message);

      options.push('Chặn liên lạc');
    }
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        options={options}
        cancelButtonIndex={0}
        onPress={this.onActionSheetPress}
      />
    );
  }
  render() {
    const { isContactsPermissionsGranted, searchText } = this.state;
    const contacts = this.getContacts();

    const isGetContactsViewVisible = !isContactsPermissionsGranted;
    const isSearchBarVisible = isContactsPermissionsGranted;
    const isContactsListVisible = isContactsPermissionsGranted && contacts.length > 0;
    const isEmptyDataViewVisible =
      (!isContactsPermissionsGranted || contacts.length === 0) &&
      !this.props.isFetchContactsProcessing;
    const isSearchEmptyDataViewVisible =
      isContactsPermissionsGranted && contacts.length === 0 && searchText.length > 0;

    return (
      <View style={styles.container} testID="test_contactlist">
        {/* {this.renderNavigationBar()} */}
        {isGetContactsViewVisible ? this.renderGetContactsView() : null}
        {isContactsListVisible ? this.renderContactsList() : null}
        {isEmptyDataViewVisible ? this.renderEmptyDataView() : null}
        {isSearchEmptyDataViewVisible ? this.renderSearchEmptyDataView() : null}
        {this.renderSpinner()}
        {this.renderActionSheet()}
      </View>
    );
  }
}

// --------------------------------------------------

ContactsListScreen.navigationOptions = () => ({
  title: 'Contacts List', // must have a space or navigation will crash
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarLabel: 'Liên hệ',
  tabBarIcon: ({ focused }) => {
    const icon = focused ? require('../img/tab_contacts1.png') : require('../img/tab_contacts.png');
    return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
  },
  tabBarTestID: 'test_tabbar_contactlist',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ContactsListScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isFetchContactsProcessing: state.isFetchContactsProcessing,
  allContacts: state.allContacts,
  chatThread: state.chatThread,
  allThreads: state.allThreads,
  isOpeningThread: state.openingThread,
});

const mapDispatchToProps = (dispatch) => ({
  fetchContacts: () => dispatch(fetchContacts()),
  toggleContactFavorite: (contactID, isFavorite) =>
    dispatch(toggleContactFavorite(contactID, isFavorite)),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  closeChat: () => dispatch(closeChat()),
  openingThread: (opening) => dispatch(openingThread(opening)),
  block: (userID) => dispatch(block(userID)),
  createAccount: (config) => dispatch(createAccount(config)),
  makeCall: (destination) => dispatch(makeCall(destination)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsListScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral5,
    width: SCREEN_WIDTH,
  },
  searchBarTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral5,
  },
  searchBarBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral5,
  },
  emptyDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchEmptyDataContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 96,
    paddingBottom: 32,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#0000',
  },
  emptyTitle: {
    color: '#808080',
    fontSize: 18,
    fontWeight: '600',
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral5,
  },
  contactSectionTitle: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    color: '#7f7f7f',
    backgroundColor: colors.neutral5,
    fontSize: 14,
    fontWeight: '600',
  },
});
