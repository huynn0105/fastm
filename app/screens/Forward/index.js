import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  Keyboard,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';

import DatabaseManager from '../../manager/DatabaseManager';
import NavigationBar from './NavigationBar';
import ContactRow from './ContactRow';
import SearchBar from '../../components/SearchBar';

import { MESSAGE_TYPES } from '../../submodules/firebase/model/Message';

import colors from '../../constants/colors';

import {
  fetchThreads,
  openChatWithThread,
  closeChat,
} from '../../submodules/firebase/redux/actions';

const _ = require('lodash');
const removeDiacritics = require('diacritics').remove;

// --------------------------------------------------
// CreateGroupChat.js
// --------------------------------------------------

class ForwardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSpinnerVisible: false,
      spinnerText: 'Đang xử lý',
      threads: [],
      threadsExtraData: false,
    };
    this.searchText = '';
  }
  componentWillMount() {
    // get members if having
    const { forwardingMessage, giftedMessage } = this.props.navigation.state.params;
    this.message = forwardingMessage;
    this.giftedMessage = giftedMessage;
  }
  componentDidMount() {
    this.loadMoreData(true, 20);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onCancelPress = () => {
    Keyboard.dismiss();
    this.props.navigation.popToTop();
    this.loadMoreData(true, 20);
  }
  onThreadPress = (thread) => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate('ChatsListTab');

    this.loadMoreData(true, 20);

    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }

    this.props.navigation.navigate('Chat', { forwardingMessage: this.giftedMessage });
    setTimeout(() => {
      const unReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(thread.uid);
      this.props.openChatWithThread(thread, unReadMessages);
    }, 100);
  }
  onThreadsListEndReached = () => {
    this.debounceOnThreadsListEndReached();
  }
  onThreadsListEndReachedDelay = () => {
    if (!this.props.isFetchThreadsProcessing &&
      this.props.isThreadsCanLoadMore) {
      this.loadMoreData(false, 20, this.searchText);
    }
  }

  setSearchText = (text) => {
    const trimText = removeDiacritics(text.trim());
    this.searchText = trimText;
    this.loadMoreData(true, 20, trimText);
  }

  /* eslint-disable */
  debounceOnThreadsListEndReached =
    _.debounce(this.onThreadsListEndReachedDelay, 100);

  getOldestThread() {
    const { allThreads } = this.props;
    let oldest = null;
    for (let i = allThreads.length - 1; i >= 0; i -= 1) {
      const thread = allThreads[i];
      if (thread.isFavorite === false) {
        oldest = thread;
        break;
      }
    }
    return oldest;
  }

  isScrollViewReachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 40;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }

  handleScroll = (event) => {
    if (this.isScrollViewReachedEnd(event.nativeEvent)) {
      this.onThreadsListEndReached();
    }
  }

  loadMoreData = (isReload = false, maxThreadsFetch = 20, keyword) => {
    const oldestThread = isReload ? null : this.getOldestThread();
    const fromUpdateTime = oldestThread ? oldestThread.updateTime : null;
    this.props.fetchThreads(fromUpdateTime, maxThreadsFetch, keyword);
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
  showAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [{ text: 'Đóng' }],
      { cancelable: false },
    );
  }

  reduceEmptyThread = (threads) => {
    const unemptyThreads = [];
    for (let j = 0; j < threads.length; j += 1) {
      const thread = threads[j];
      const lastMessage = DatabaseManager.shared().getLastMessageInThread(thread.uid);
      if (lastMessage || !thread.isSingleThread()) {
        unemptyThreads.push(thread);
      }
    }
    return unemptyThreads;
  }

  reduceDeletedThread = (threads) => {
    const unDeletedThread = [];
    for (let j = 0; j < threads.length; j += 1) {
      const thread = threads[j];
      if (!thread.isDeletedByMe) {
        unDeletedThread.push(thread);
      }
    }
    return unDeletedThread;
  }

  // --------------------------------------------------

  textForMessageType(messageType, messageText) {
    let text = ''
    switch (messageType) {
      case MESSAGE_TYPES.IMAGES:
        text = '[Hình ảnh]';
        break;
      case MESSAGE_TYPES.AUDIOS:
        text = '[Tin nhắn thoại]';
        break;
      case MESSAGE_TYPES.VIDEOS:
        text = '[Video]';
        break;
      case MESSAGE_TYPES.LOCATION:
        text = '[Vị trí]';
        break;
      default:
        text = messageText;
    }
    return text;
  }

  renderNavigationBar() {
    return (
      <NavigationBar
        onCancelPress={this.onCancelPress}
      />
    );
  }
  renderMessage = (message) => {
    const components = message.quotedText.split('>>>');
    let name = '';
    let content = '';
    if (components !== undefined && components.length === 2) {
      name = components[0];
      content = components[1];
    }
    return (
      <View style={styles.content}>
        <View style={styles.verticleLine} />
        <View>
          <Text style={styles.name}>
            {`Từ: ${name.trim()}`}
          </Text>
          <Text style={styles.quoted}>
            {this.textForMessageType(message.quotedType, content.trim())}
          </Text>
        </View>
      </View>
    );
  }
  renderSearchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <SearchBar
          style={{ width: '100%' }}
          loading={this.props.isFetchThreadsProcessing}
          onSearchTextChanged={this.setSearchText}
          placeholder={'Tìm kiếm trò chuyện'}
        />
      </View>
    );
  }
  renderThreadsList() {
    let data = this.reduceDeletedThread(this.props.allThreads);
    data = this.reduceEmptyThread(data);
    return (
      <View style={styles.contactsListContainer}>
        <FlatList
          data={data}
          contentContainerStyle={{ paddingBottom: 24 }}
          extraData={this.state.contactsExtraData}
          keyExtractor={item => item.uid}
          renderItem={this.renderThreadRow}
          // ListFooterComponent={this.renderThreadSectionFooter}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
          onScroll={this.handleScroll}
        />
      </View>
    );
  }
  renderThreadSectionFooter = ({ section }) => {
    return (
      this.props.isFetchThreadsProcessing ?
        <ActivityIndicator
          style={{ marginTop: 2, alignSelf: 'center' }}
          animating
          color="#404040"
          size="small"
        />
        : null
    );
  }
  renderThreadRow = (row) => {
    const thread = row.item;
    return (
      <ContactRow
        key={thread.uid}
        thread={thread}
        onPress={this.onThreadPress}
      />
    );
  }
  render() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderMessage(this.message)}
        {this.renderSearchBar()}
        {this.renderThreadsList()}
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

ForwardList.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../img/tab_contacts.png')}
      style={[styles.icon, { tintColor }]}
    />
  ),
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ForwardList.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  allThreads: state.allThreads,
  chatThread: state.chatThread,
  isFetchThreadsProcessing: state.isFetchThreadsProcessing,
  isThreadsCanLoadMore: state.isThreadsCanLoadMore,
});

const mapDispatchToProps = (dispatch) => ({
  fetchThreads: (fromUpdateTime, maxThreadsFetch, keyword) =>
    dispatch(fetchThreads(fromUpdateTime, maxThreadsFetch, keyword)),
  openChatWithThread: (thread, unReadMessages) =>
    dispatch(openChatWithThread(thread, unReadMessages)),
  closeChat: () => dispatch(closeChat()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForwardList);

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
    flexDirection: 'row',
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
  content: {
    flexDirection: 'row',
    backgroundColor: '#E6EBFF',
    paddingRight: 8,
    marginLeft: 16,
  },
  verticleLine: {
    width: 1,
    marginRight: 8,
    paddingTop: (Platform.OS === 'ios' ? 3 : 4),
    backgroundColor: '#13a7e2',
    paddingBottom: (Platform.OS === 'ios' ? 7 : 0),
  },
  name: {
    color: '#000b',
    backgroundColor: '#0000',
    fontSize: 13,
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 8,
  },
  quoted: {
    color: '#000b',
    backgroundColor: '#0000',
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 4,
    fontStyle: 'italic',
    paddingBottom: 8,
  },
});
