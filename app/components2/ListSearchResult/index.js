import { User } from 'app/models';
import React, { PureComponent } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import AppText from '../../componentV3/AppText';
import SystemThread from '../../models/SystemThread';
import Colors from '../../theme/Color';
import LocalStorageUtil from '../../utils/LocalStorageUtil';
import ChatSearchResultItem from './ChatSearchResultItem';

const RECENT_SEARCH_HISTORY_KEY = 'RECENT_SEARCH_HISTORY_KEY';

class ListSearchResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recentSearchSection: [],
    };
    this.recentSearchItems = [];
  }

  componentDidMount() {
    // LocalStorageUtil.removeDataAsyncStorage(RECENT_SEARCH_HISTORY_KEY);
    this.loadRecentSearchItems();
  }

  onItemPress = (item) => {
    this.updateRecentSearchHistory(item);

    const { uid, type } = item;
    this.props.onResultItemPress(this.mapResult2DataType(uid, type), type);
  };

  //-------------------------------------------
  // LOCAL STORAGE
  //-------------------------------------------

  // eslint-disable-next-line react/sort-comp
  loadRecentSearchItems = async () => {
    try {
      const rawData = await LocalStorageUtil.retrieveDataAsyncStorage(RECENT_SEARCH_HISTORY_KEY);
      if (rawData) {
        this.recentSearchItems = JSON.parse(rawData);
        this.updateRecentSearchSections(this.recentSearchItems);
      }
    } catch (error) {
      console.error('load failed: ', error);
    }
  };

  saveRecentSearchListToLocal = (items) => {
    LocalStorageUtil.saveDataAsyncStorage(JSON.stringify(items), RECENT_SEARCH_HISTORY_KEY);
  };

  //-------------------------------------------
  // COMMON METHODS
  //-------------------------------------------

  contactsWithKey = (contacts, searchText) => {
    return contacts
      .map((item) => {
        return Object.assign(new User(), { ...item, isFromContact: true });
      })
      .filter((user) => {
        const name = user.fullNameNoDiacritics();
        const matchFullName = name.search(new RegExp(searchText, 'i')) !== -1;
        return matchFullName;
      });
  };

  updateRecentSearchList = (selectedItem) => {
    this.recentSearchItems.forEach((element) => {
      if (element.uid === selectedItem.uid) {
        const index = this.recentSearchItems.indexOf(element);
        this.recentSearchItems.splice(index, 1);
      }
    });
    this.recentSearchItems.unshift(selectedItem);
  };

  updateRecentSearchSections = (items) => {
    this.setState({
      recentSearchSection: [{ title: 'Tìm kiếm gần đây', data: items }],
    });
  };

  updateRecentSearchHistory = (selectedItem) => {
    if (!(selectedItem instanceof SystemThread)) {
      this.updateRecentSearchList(selectedItem);
      this.updateRecentSearchSections(this.recentSearchItems);
      this.saveRecentSearchListToLocal(this.recentSearchItems);
    }
  };

  mapResult2DataType = (uid, type) => {
    if (type === 'thread') {
      return this.mapResult2ThreadUID(uid);
    } else if (type === 'contact') {
      return this.mapResult2Contact(uid);
    }
    return null;
  };
  mapResult2ThreadUID = (uid) => {
    return { uid };
  };
  mapResult2Contact = (uid) => {
    const { allContacts } = this.props;
    return allContacts.find((contact) => contact.uid === uid);
  };

  mapThreadSection2ResultSection = (sections) =>
    sections.map((item) => ({
      title: item.title,
      data: item.data.map((thread) => ({
        uid: thread.uid,
        type: 'thread',
        name: thread.titleString(),
        photo: thread.photoImageURI(),
      })),
    }));
  mapContact2ResultSection = (contacts, excludesUIDs) => ({
    title: 'Từ danh bạ',
    data: contacts
      .map((contact) => ({
        uid: contact.uid,
        type: 'contact',
        name: contact.fullName,
        photo: contact.avatarImageURI(),
      }))
      .filter((contact) => !excludesUIDs.find((uid) => uid === contact.uid)),
  });

  searchResults = (sections, contacts) => {
    const resultSections = this.mapThreadSection2ResultSection(sections);

    const allThreadUIDs = Array.prototype
      .concat(...resultSections.map((item) => item.data))
      .map((thread) => thread.uid);
    const resultContact = this.mapContact2ResultSection(contacts, allThreadUIDs);
    return [resultContact, ...resultSections];
  };
  recentSearchResults = () => {
    return this.state.recentSearchSection;
  };

  dataSources = () => {
    const { sections, allContacts, textSearch: searchText } = this.props;
    const contacts = this.contactsWithKey(allContacts, searchText);
    return searchText === '' ? this.recentSearchResults() : this.searchResults(sections, contacts);
  };

  //-------------------------------------------
  // RENDER METHODS
  //-------------------------------------------

  renderChatSearchResultItem = (row) => {
    const { uid, type, name, photo } = row.item;
    return (
      <ChatSearchResultItem
        style={{ padding: 16, paddingTop: 6, paddingBottom: 6 }}
        uid={uid}
        type={type}
        name={name}
        photo={photo}
        onItemPress={this.onItemPress}
      />
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <AppText style={[styles.sectionHeaderTitle, { marginTop: 4 }]}>{section.title}</AppText>
      </View>
    );
  };

  render() {
    const resultData = this.dataSources();
    return (
      <View style={{ flex: 1, marginTop: 12 }}>
        <SectionList
          style={{ overflow: 'hidden' }}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyExtractor={(item) => item.uid}
          keyboardShouldPersistTaps={'handled'}
          renderItem={this.renderChatSearchResultItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={resultData}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  allContacts: state.allContacts,
});

export default connect(mapStateToProps)(ListSearchResult);

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Colors?.neutral5,
  },
  sectionHeaderTitle: {
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    color: '#7f7f7f',
    backgroundColor: Colors?.neutral5,
    fontSize: 14,
    fontWeight: '600',
  },
});
