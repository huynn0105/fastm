/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import Styles from 'app/constants/styles';
import ContactsManager, { CONTACTS_EVENTS } from 'app/manager/ContactsManager';
import { createAccount, fetchContacts, makeCall, toggleContactFavorite } from 'app/redux/actions';
import { call, showQuestionAlertWithTitle } from 'app/utils/UIUtils';
// --------------------------------------------------
/* eslint-disable */
import Utils from 'app/utils/Utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import AppText from '../../componentV3/AppText';
import { block } from '../../redux/actions';
import {
  fetchConversationContacts,
  fetchInvitationsRequests,
} from '../../redux/actions/conversationContact';
import {
  closeChat,
  openChatWithUser,
  openingThread,
} from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import ContactRow from './ContactRow';
import GetContactsView from './GetContactsView';
import NavigationBar from './NavigationBar';

const removeDiacritics = require('diacritics').remove;

const ACTION_SHEET_CONTACT_LONG_PRESS = 'ACTION_SHEET_CONTACT_LONG_PRESS';

// --------------------------------------------------
// ContactsListScreen
// --------------------------------------------------

class ContactsListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      contactsExtraData: false,
      spinnerText: '',
      isSpinnerVisible: false,
      showIconEmtpy: true,
    };
    this.isOpeningThread = false;
  }
  componentWillMount() {
    this.reloadData();
  }
  componentDidMount() {
    this.addObservers();
    Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
  }
  componentWillUnmount() {
    this.removeObservers();
    Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide);
  }

  // --------------------------------------------------
  onRequestContactPress = () => {
    this.props.navigation.navigate('CreateContactRequest');
  };
  onContactsListRefresh = () => {
    this.reloadData();
  };
  onContactPress = (user) => {
    this.openChatWithUser(user);
  };
  onContactLongPress = () => {
    // this.setState(
    //   {
    //     actionSheetType: ACTION_SHEET_CONTACT_LONG_PRESS,
    //     targetContact: user,
    //   },
    //   () => {
    //     this.actionSheet.show();
    //   },
    // );
  };
  onGetContactsPress = () => {
    this.props.fetchConversationContacts();
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
    let contacts = this.props.conversationContacts;
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
    this.props.fetchConversationContacts();
    this.props.fetchInvitationsRequests();
  };
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

  onKeyboardDidShow = () => {
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
  onContactRequestListPress = () => {
    this.props.navigation.navigate('ContactRequestList');
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
  renderContactRequestRow = () => {
    const pendingNumber = this.props.invitationsRequestsContact.invitations.length;
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 60,
          width: '100%',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingLeft: 16,
          paddingRight: 16,
        }}
        onPress={this.onContactRequestListPress}
      >
        <Image
          style={{ width: 40, height: 40, marginRight: 10 }}
          resizeMode={'contain'}
          source={require('./img/ic_contact_request.png')}
        />
        <AppText style={{ opacity: 0.7, fontSize: 14, color: '#24253d' }}>
          {'Danh sách các yêu cầu kết bạn'}
        </AppText>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            right: 8,
            top: 0,
            bottom: 0,
            alignItems: 'center',
          }}
        >
          {pendingNumber ? (
            <AppText style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
              {pendingNumber}
            </AppText>
          ) : null}
          <Image
            style={{ width: 20, height: 20, marginLeft: 2 }}
            resizeMode={'contain'}
            source={require('./img/ic_next.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };
  renderSectionHeader = ({ section }) => {
    const sectionSeparator = section.index === 0 ? 2 : 8;
    return section.data && section.data.length > 0 ? (
      <View style={styles.contactSection}>
        <AppText style={[styles.contactSectionTitle, { marginTop: sectionSeparator }]}>
          {section.title}
        </AppText>
        <TouchableOpacity onPress={this.onRequestContactPress}>
          <AppText
            style={[
              styles.contactSectionTitle,
              { marginTop: sectionSeparator, color: Colors.primary2 },
            ]}
          >
            {'Thêm liên hệ'}
          </AppText>
        </TouchableOpacity>
      </View>
    ) : null;
  };
  renderContactSectionFunc = ({ section }) => {
    return (
      <View>
        {section.index === 0 ? this.renderContactRequestRow(3) : 0}
        {this.renderSectionHeader({ section })}
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
        onAddPress={this.onRequestContactPress}
        loading={this.props.isFetchContactsProcessing}
        onSearchTextChanged={this.onSearchBarChangeText}
      />
    );
  }
  renderGetContactsView() {
    return (
      <View style={{ flex: 1 }}>
        <GetContactsView onPress={this.onGetContactsPress} navigation={this.props.navigation} />
      </View>
    );
  }
  renderContactsList() {
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
      sections.push({ data: favoriteContacts, title: 'Ưa thích', index: 0 });
    }
    if (normalContacts.length > 0) {
      sections.push({ data: normalContacts, title: 'Liên hệ', index: sections.length });
    }
    // ---
    return (
      <SectionList
        style={{}}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: Colors.neutral5 }}
            refreshing={false}
            onRefresh={this.onContactsListRefresh}
          />
        }
        keyExtractor={(item) => item.uid}
        renderItem={this.renderContactRowFunc}
        renderSectionHeader={this.renderContactSectionFunc}
        stickySectionHeadersEnabled={false}
        extraData={contactsExtraData}
        sections={sections}
      />
    );
  }
  renderEmptyDataView() {
    return (
      <View style={styles.emptyDataContainer}>
        <Image
          style={{ width: '60%', aspectRatio: 160 / 114 }}
          source={require('./img/bg_empty_chat.png')}
        />
        <AppText
          style={{
            width: '80%',
            fontSize: 14,
            lineHeight: 22,
            textAlign: 'center',
            color: '#222a',
            margin: 16,
          }}
        >
          {'Bấm'}
          <AppText style={{ color: Colors.primary2 }} onPress={this.onRequestContactPress}>
            {' Thêm liên hệ '}
          </AppText>
          {'để tìm kiếm và kết nối cùng cộng đồng MFast'}
        </AppText>
      </View>
    );
  }
  renderSearchEmptyDataView() {
    return (
      <View style={styles.searchEmptyDataContainer}>
        <AppText style={[styles.emptyTitle]}>{'Không tìm thấy liên hệ nào!'}</AppText>
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
      // options.push(message);

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
    const { searchText } = this.state;
    const contacts = this.getContacts();

    const isContactsListVisible = contacts.length > 0;
    const isEmptyDataViewVisible = contacts.length === 0 && !this.props.isFetchContactsProcessing;
    const isSearchEmptyDataViewVisible = contacts.length === 0 && searchText.length > 0;

    return (
      <View style={styles.container} testID="test_contactlist">
        {isContactsListVisible ? this.renderContactsList() : null}
        {isEmptyDataViewVisible ? this.renderContactRequestRow() : null}
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
  chatThread: state.chatThread,
  allThreads: state.allThreads,
  isOpeningThread: state.openingThread,

  conversationContacts: state.conversationContacts,
  invitationsRequestsContact: state.invitationsRequestsContact,
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

  fetchConversationContacts: () => dispatch(fetchConversationContacts()),
  fetchInvitationsRequests: () => dispatch(fetchInvitationsRequests()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsListScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.actionBackground,
  },
  searchBarTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.actionBackground,
  },
  searchBarBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'red',
  },
  emptyDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.actionBackground,
    paddingBottom: 64,
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
    backgroundColor: Colors.actionBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactSectionTitle: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    color: '#7f7f7f',
    backgroundColor: Colors.actionBackground,
    fontSize: 14,
    fontWeight: '600',
  },
});
