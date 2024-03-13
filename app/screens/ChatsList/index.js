/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
/**
 * TODO:
 * + (done) as of now, for simple use case. we load all threads and don't provide load more
 * But for optimize, scroll to bottom should call loadMoreData
 * + debounce handleNewMessage for better ui update
 * + implement search
 * + implement inbox
 */

import ChatNotificationIcon from 'app/components/ChatNotificationIcon';
import EmptyDataView from 'app/components/EmptyDataView';
import colors from 'app/constants/colors';
import Strings from 'app/constants/strings';
import Styles from 'app/constants/styles';
import DatabaseManager from 'app/manager/DatabaseManager';
import { SystemThread } from 'app/models';
import { getLastNotiFb } from 'app/redux/actions';
import { showInfoAlert, showQuestionAlertWithTitle } from 'app/utils/UIUtils';
// --------------------------------------------------
/* eslint-disable */
import Utils from 'app/utils/Utils';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import { ActivityIndicator, RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import AnimatedTabbar from '../../components/AnimatedTabbar';
import AppText from '../../componentV3/AppText';
import { block, unblock } from '../../redux/actions';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import { CHAT_EVENTS } from '../../submodules/firebase/manager/ChatCenter';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import {
  closeChat,
  fetchThreads,
  openChatWithThread,
  reloadAllThreadsFromDB,
} from '../../submodules/firebase/redux/actions';
import NavigationBar from './NavigationBar';
import ThreadRow from './ThreadRow';

const removeDiacritics = require('diacritics').remove;

const LOG_TAG = 'ChatsList/index.js';
/* eslint-enable */

// --------------------------------------------------

const INITIAL_THREADS_LOAD = 20;
const PREVIOUS_THREADS_LOAD = 20;

const TAB_ALL_THREADS_INDEX = 0;
const TAB_GROUP_THREADS_INDEX = 1;
const TAB_APPAY_THREADS_INDEX = 2;
const DEFAULT_TAB = TAB_ALL_THREADS_INDEX;

const ACTION_SHEET_THREAD_LONG_PRESS = 'ACTION_SHEET_THREAD_LONG_PRESS';

// --------------------------------------------------
// ChatsListScreen
// --------------------------------------------------

class ChatsListScreen extends Component {
  constructor(props) {
    super(props);

    const sections = this.groupThreadsToSections(props.allThreads, DEFAULT_TAB);

    this.state = {
      sections,
      threadsLastMessages: {},
      selectedTabIndex: DEFAULT_TAB,
    };

    this.lastMessages = {};
    this.sections = [];

    this.isOpeningThread = false;
  }
  componentWillMount() {
    this.addObservers();
  }
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('willFocus', this.componentWillFocus),
      this.props.navigation.addListener('didFocus', this.componentDidFocus),
    ];
  }
  componentWillReceiveProps(nextProps) {
    const isChatChanged =
      !isEqual(this.props.allThreads, nextProps.allThreads) && nextProps.allThreads;
    const isSystemChatChanged =
      !isEqual(this.props.systemGiftedNotifications, nextProps.systemGiftedNotifications) &&
      nextProps.systemGiftedNotifications;
    const isAdminChatChanged =
      !isEqual(this.props.adminGiftedNotifications, nextProps.adminGiftedNotifications) &&
      nextProps.adminGiftedNotifications;
    if (isChatChanged && isSystemChatChanged && isAdminChatChanged) {
      const sections = this.groupThreadsToSections(
        nextProps.allThreads,
        this.state.selectedTabIndex,
        nextProps,
      );
      this.debounceUpdateSection(sections);
    }
  }

  componentWillUnmount() {
    this.removeObservers();
    this.subs.forEach((sub) => sub.remove());
  }

  componentWillFocus = () => {
    // eslint-disable-line
    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }

    this.props.getLastNotiFb();
  };

  // invokeTut = () => {
  //   const asyncTask = async () => {
  //     const doneHome = await checkDoneTut(TUT_CHATLIST_APPAY);
  //     if (!doneHome) {
  //       setTimeout(() => {
  //         if (this.props.currentScreenName === this.props.navigation.state.routeName) {
  //           this.props.start();
  //           setTimeout(() => {
  //             if (this.props.currentScreenName !== this.props.navigation.state.routeName) {
  //               this.props.stop();
  //               setTimeout(() => {
  //                 markUndoneTut(TUT_CHATLIST_APPAY);
  //               }, 100);
  //             }
  //           }, 500);
  //           this.animatedTabbar.onTabTapped(2);
  //         }
  //       }, 200);
  //     }
  //   };
  //   asyncTask();
  // }

  componentDidFocus = () => {
    // this.invokeTut();
  };
  // --------------------------------------------------

  isScrollViewReachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 100;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }

  handleScroll = (event) => {
    if (this.isScrollViewReachedEnd(event.nativeEvent)) {
      this.onThreadsListEndReached();
    }
  };

  checkSystemThreadStatus = () => {
    const asyncTask = async () => {
      const threadJSON = await FirebaseDatabase.getThreadSystemStatus();
      this.threadChangeHandler(threadJSON);
    };
    asyncTask();
  };

  onNavBarInboxPress = () => {
    this.props.navigation.navigate('ChatInbox');
  };
  onNavBarAddPress = () => {
    this.props.navigation.navigate('CreateGroupChat');
  };
  onNavBarSearchPress = () => {
    this.props.navigation.navigate('ChatSearch');
  };
  onTabsHeaderSelected = (index) => {
    // refresh sections if tab change
    const sections = this.groupThreadsToSections(this.props.allThreads, index);
    this.debounceUpdateSection(sections);
    this.setState({
      selectedTabIndex: index,
    });
  };
  onThreadsListRefresh = () => {
    this.reloadData();
  };
  onThreadsListEndReached = () => {
    this.debounceOnThreadsListEndReached();
  };
  onThreadsListEndReachedDelay = () => {
    if (
      !this.props.isFetchThreadsProcessing &&
      this.props.isThreadsCanLoadMore &&
      this.state.selectedTabIndex !== TAB_APPAY_THREADS_INDEX
    ) {
      this.loadMoreData(false, PREVIOUS_THREADS_LOAD, this.searchText);
    }
  };
  /* eslint-disable */
  debounceOnThreadsListEndReached = debounce(this.onThreadsListEndReachedDelay, 100);
  /* eslint-enable */
  onThreadPress = (thread) => {
    this.openChatWithThread(thread);
  };
  onThreadLongPress = (thread) => {
    this.setState(
      {
        actionSheetType: ACTION_SHEET_THREAD_LONG_PRESS,
        targetThread: thread,
      },
      () => {
        this.actionSheet.show();
      },
    );
  };

  messagesActionSheet = (thread, options) => {
    if (this.state.actionSheetType === ACTION_SHEET_THREAD_LONG_PRESS) {
      if (thread instanceof SystemThread) {
        const farovite = thread.isFavorite ? 'Bỏ khỏi ưa thích' : 'Thêm vào ưa thích';
        options.push(farovite);
      } else {
        const message = thread.isNotificationOn ? 'Tắt thông báo' : 'Mở thông báo';
        options.push(message);

        const farovite = thread.isFavorite ? 'Bỏ khỏi ưa thích' : 'Thêm vào ưa thích';
        options.push(farovite);

        if (thread.isSingleThread()) {
          options.push(
            this.props.blockedThreads.includes(thread.uid)
              ? 'Bỏ chặn trò chuyện'
              : 'Chặn trò chuyện',
          );
        }

        const deleteThread = 'Xóa trò chuyện';
        options.push(deleteThread);
      }
    }
    return options;
  };

  onActionSheetPress = (index) => {
    // Utils.log(`${LOG_TAG} onActionSheetPress:`, index);
    const thread = this.state.targetThread;
    if (index === 1 && this.state.targetThread) {
      const notificationState = !thread.isNotificationOn;
      this.onNotificationToggle(thread, notificationState);
    } else if (index === 2 && this.state.targetThread) {
      const favoriteState = !thread.isFavorite;
      this.onFavoriteToggle(thread, favoriteState);
    } else if (index === 3 && this.state.targetThread) {
      if (thread.isSingleThread()) {
        const targetUser = thread.getSingleThreadTargetUser();
        const blocked = this.props.blockedThreads.includes(thread.uid);
        this.blockChatThread(blocked, thread, targetUser);
      } else {
        this.deleteChatThread(thread);
      }
    } else if (index === 4 && this.state.targetThread) {
      this.deleteChatThread(thread);
    }
  };

  onActionSheetSystemPress = (index) => {
    const thread = this.state.targetThread;
    if (index === 1 && this.state.targetThread) {
      this.onFavoriteSystemToggle(thread.type, !thread.isFavorite);
    }
  };

  onFavoriteSystemToggle = (threadType, favorite) => {
    const asyncTask = async () => {
      try {
        const result = await ChatManager.shared().toggleUserFavoriteInThreadSystem(
          threadType,
          favorite,
        );
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
          return;
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: onFavoriteToggle err: ${err}`, err);
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  };

  onFavoriteToggle = (thread, favoriteState) => {
    const asyncTask = async () => {
      try {
        const threadID = thread.uid;
        const result = await ChatManager.shared().toggleMyFavoriteInThread(threadID, favoriteState);
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
          return;
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: onFavoriteToggle err: ${err}`, err);
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  };

  onNotificationToggle = (thread, isOn) => {
    const asyncTask = async () => {
      try {
        const threadID = thread.uid;
        const result = await ChatManager.shared().toggleMyNotificationOnInThread(threadID, isOn);
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
          return;
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: onNotificationToggle err: ${err}`, err);
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  };

  onDeleteThreadChat = (thread) => {
    const asyncTask = async () => {
      try {
        const threadID = thread.uid;
        const result = await ChatManager.shared().deleteThreadChat(threadID);
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
          return;
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: onDeleteThreadChat err: ${err}`, err);
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  };

  onSearchText = (text) => {
    const trimText = removeDiacritics(text.trim());
    this.searchText = trimText;
    this.loadMoreData(true, 20, trimText);
  };
  // --------------------------------------------------

  deleteChatThread = (thread) => {
    const asyncTask = async () => {
      const threads = await ChatManager.shared().getMyThreads();
      const sameThread = threads.filter((mThread) => {
        return mThread.uid === thread.uid;
      });

      if (sameThread.length > 0) {
        showQuestionAlertWithTitle(
          'Xoá cuộc trò chuyện',
          `Bạn có chắc muốn xoá cuộc trò chuyện với ${thread.titleString()} không?`,
          'Đồng ý',
          'Đóng',
          () => {
            this.onDeleteThreadChat(thread);
          },
        );
      } else {
        showInfoAlert('Bạn đã rời nhóm, hãy tải lại tin nhắn để xoá trò chuyện');
      }
    };
    asyncTask();
  };

  blockChatThread = (blocked, thread, targetUser) => {
    if (blocked) {
      showQuestionAlertWithTitle(
        'Bỏ chặn cuộc trò chuyện',
        `Bạn có muốn bỏ chặn ${thread.titleString()}?`,
        'Đồng ý',
        'Đóng',
        () => {
          this.props.unblock(targetUser.uid);
        },
      );
    } else {
      showQuestionAlertWithTitle(
        'Chặn cuộc trò chuyện',
        `Bạn có muốn chặn ${thread.titleString()}?`,
        'Đồng ý',
        'Đóng',
        () => {
          this.props.block(targetUser.uid);
        },
      );
    }
  };

  getSystemThreads = (nextProps) => {
    if (!this.sysThread) {
      // get default thread
      const defaultSystemThread = SystemThread.systemThread();
      // get thread from db
      this.sysThread = DatabaseManager.shared().getSystemThread(defaultSystemThread.uid);
      // save to db if not exist
      if (!this.sysThread) {
        this.sysThread = defaultSystemThread;
        DatabaseManager.shared().createObject('SystemThread', this.sysThread);
      }
      // check title
      if (this.sysThread.title !== defaultSystemThread.title) {
        DatabaseManager.shared().updateThread(() => {
          this.sysThread.title = defaultSystemThread.title; // eslint-disable-line
        });
      }

      // get default thread
      const defaultAdminThread = SystemThread.adminThread();
      // get thread from db
      this.adminThread = DatabaseManager.shared().getSystemThread(defaultAdminThread.uid);
      // save to db if not exist
      if (!this.adminThread) {
        this.adminThread = defaultAdminThread;
        DatabaseManager.shared().createObject('SystemThread', this.adminThread);
      }
      // check title
      if (this.adminThread.title !== defaultAdminThread.title) {
        DatabaseManager.shared().updateThread(() => {
          this.adminThread.title = defaultAdminThread.title; // eslint-disable-line
        });
      }

      this.checkSystemThreadStatus();
    }
    if (nextProps) {
      this.sysThread.messages = nextProps.systemGiftedNotifications;
      this.adminThread.messages = nextProps.adminGiftedNotifications;
    } else {
      this.sysThread.messages = this.props.systemGiftedNotifications;
      this.adminThread.messages = this.props.adminGiftedNotifications;
    }

    return [this.sysThread, this.adminThread];
  };

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
  getIndexOfThreadID(threadID) {
    const { allThreads } = this.props;
    for (let i = 0; i < allThreads.length; i += 1) {
      if (allThreads[i].uid === threadID) {
        return i;
      }
    }
    return -1;
  }
  addObservers() {
    BroadcastManager.shared().addObserver(CHAT_EVENTS.NEW_MESSAGE, this, (message) => {
      // Utils.log(`${LOG_TAG}: NEW_MESSAGE: ${threadID}`, message);
      this.handleNewMessage(message);
    });

    BroadcastManager.shared().addObserver(
      CHAT_EVENTS.THREAD_SYSTEM_CHANGE,
      this,
      this.threadChangeHandler,
    );

    BroadcastManager.shared().addObserver(
      CHAT_EVENTS.MESSAGE_CHANGE,
      this,
      this.messageChangeHandler,
    );
  }
  removeObservers() {
    BroadcastManager.shared().removeObserver(CHAT_EVENTS.NEW_MESSAGE, this);
    BroadcastManager.shared().removeObserver(CHAT_EVENTS.THREAD_SYSTEM_CHANGE, this);
    BroadcastManager.shared().removeObserver(CHAT_EVENTS.MESSAGE_CHANGE, this);
  }
  handleNewMessage(message) {
    // Utils.log(`${LOG_TAG}: handleNewMessage: `, message);
    this.lastMessages[message.threadID] = message;
    this.debounceNewMessage();
  }

  messageChangeHandler = (message) => {
    const lastMessage = DatabaseManager.shared().getLastMessageInThread(message.threadID);
    if (lastMessage.uid === message.uid) {
      const sections = this.groupThreadsToSections(
        this.props.allThreads,
        this.state.selectedTabIndex,
      );
      this.debounceUpdateSection(sections);
    }
  };

  threadChangeHandler(threadJSON) {
    if (threadJSON && threadJSON !== null) {
      this.updateSystemThreadFavorite(this.adminThread, threadJSON.admin);
      this.updateSystemThreadFavorite(this.sysThread, threadJSON.system);

      const sections = this.groupThreadsToSections(
        this.props.allThreads,
        this.state.selectedTabIndex,
      );
      this.debounceUpdateSection(sections);
    }
  }

  updateSystemThreadFavorite(thread, threadJSON) {
    if (
      threadJSON &&
      threadJSON !== null &&
      threadJSON.isFavorite !== null &&
      threadJSON.isFavorite === false
    ) {
      if (thread && thread.isFavorite !== false) {
        DatabaseManager.shared().updateThread(() => {
          thread.isFavorite = false; // eslint-disable-line
        });
      }
    } else if (thread && thread.isFavorite !== true) {
      DatabaseManager.shared().updateThread(() => {
        thread.isFavorite = true; // eslint-disable-line
      });
    }
  }

  newMessage = () => {
    this.setState({
      threadsLastMessages: Object.assign(this.state.threadsLastMessages, this.lastMessages),
    });
    this.lastMessages = {};
  };
  debounceNewMessage = debounce(this.newMessage, 10);

  reloadData = () => {
    this.loadMoreData(true, INITIAL_THREADS_LOAD);
    this.props.getLastNotiFb();
    // this.checkSystemThreadStatus();
  };
  loadMoreData = (isReload = false, maxThreadsFetch = PREVIOUS_THREADS_LOAD, keyword) => {
    const oldestThread = isReload ? null : this.getOldestThread();
    const fromUpdateTime = oldestThread ? oldestThread.updateTime : null;
    this.props.fetchThreads(fromUpdateTime, maxThreadsFetch, keyword);
  };
  openChatWithThread(thread) {
    // Utils.log(`${LOG_TAG}: openChatWithThread: `, localThread);

    if (thread instanceof SystemThread) {
      this.props.navigation.navigate('ChatBox', { thread });
      return;
    }

    if (this.isOpeningThread === true) {
      return;
    }
    // this.props.openingThread(true);
    this.isOpeningThread = true;

    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }

    this.props.navigation.navigate('Chat');
    setTimeout(() => {
      const unReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(thread.uid);
      this.props.openChatWithThread(thread, unReadMessages);
    }, 0);

    this.isOpeningThread = false;
    // this.props.openingThread(false);
  }
  groupThreadsToSections(threads, activeTab, nextProps) {
    // filter thread by group
    let data = [];
    if (activeTab === TAB_GROUP_THREADS_INDEX) {
      data = threads.filter((thread) => {
        return thread.isGroupThread();
      });
    } else if (activeTab === TAB_APPAY_THREADS_INDEX) {
      data = threads.filter((thread) => {
        return thread instanceof SystemThread;
      });
    } else {
      data = threads;
    }

    const favoriteThreads = data.filter((item) => item?.isFavorite);
    const normalThreads = data.filter((item) => !item?.isFavorite);

    const showSystemNoti =
      (activeTab === TAB_ALL_THREADS_INDEX && !this.searchText) ||
      activeTab === TAB_APPAY_THREADS_INDEX;
    if (showSystemNoti) {
      const systemThreads = this.getSystemThreads(nextProps);
      this.insertSystemThreadToNormalThreads(systemThreads, favoriteThreads, normalThreads);
    }

    const sections = [];
    if (favoriteThreads.length > 0) {
      sections.push({ data: favoriteThreads, title: 'Ưa thích', index: 0 });
    }
    if (normalThreads.length > 0) {
      sections.push({ data: normalThreads, title: 'Gần đây', index: sections.length });
    }

    const undeleted = this.reduceDeletedThread(sections);
    const unemptySections = this.reduceEmptyThread(undeleted);
    return unemptySections;
  }

  updateSection = (sections) => {
    debounce(() => {
      this.setState({
        sections,
      });
    }, 100)();
  };

  debounceUpdateSection = debounce(this.updateSection, 100);

  insertSystemThreadToNormalThreads = (systemThreads, favoriteThreads, normalThreads) => {
    const insertSystemThread = (_threads, systemThread) => {
      for (let j = 0; j < _threads.length; j += 1) {
        const thread = _threads[j];
        if (systemThread.updatedTime() > thread.updateTime) {
          _threads.splice(j, 0, systemThread);
          return;
        }
      }
      _threads.push(systemThread);
    };

    for (let i = 0; i < systemThreads.length; i += 1) {
      const systemThread = systemThreads[i];
      if (systemThread.isFavorite === true) {
        insertSystemThread(favoriteThreads, systemThread);
      } else {
        insertSystemThread(normalThreads, systemThread);
      }
    }
  };

  reduceEmptyThread = (fullSections) => {
    const sections = fullSections;
    for (let i = 0; i < fullSections.length; i += 1) {
      const unemptyThreads = [];
      const data = fullSections[i].data;

      for (let j = 0; j < data.length; j += 1) {
        const thread = data[j];
        if (thread instanceof SystemThread) {
          unemptyThreads.push(thread);
        } else {
          const lastMessage = DatabaseManager.shared().getLastMessageInThread(thread.uid);
          if (lastMessage || (thread && thread.isSingleThread && !thread.isSingleThread())) {
            unemptyThreads.push(thread);
          }
        }
      }
      sections[i].data = unemptyThreads;
    }

    return sections.filter((section) => section.data.length > 0);
  };

  reduceDeletedThread = (fullSections) => {
    const sections = fullSections;
    for (let i = 0; i < fullSections.length; i += 1) {
      const unDeletedThread = [];
      const data = fullSections[i].data;

      for (let j = 0; j < data.length; j += 1) {
        const thread = data[j];
        if (thread instanceof SystemThread) {
          unDeletedThread.push(thread);
        } else if (!thread.isDeletedByMe) {
          unDeletedThread.push(thread);
        }
      }
      sections[i].data = unDeletedThread;
    }
    return sections;
  };

  // --------------------------------------------------
  renderThreadSectionFunc = ({ section }) => {
    const sectionSeparator = section.index === 0 ? 8 : 8;
    return (
      <View style={styles.threadSection}>
        <AppText style={[styles.threadSectionTitle, { marginTop: sectionSeparator }]}>
          {section.title}
        </AppText>
      </View>
    );
  };

  renderThreadSectionFooter = ({ section }) => {
    return section.index === this.sections.length - 1 && this.props.isFetchThreadsProcessing ? (
      <ActivityIndicator
        style={{ marginTop: 2, alignSelf: 'center' }}
        animating
        color="#404040"
        size="small"
      />
    ) : null;
  };

  renderThreadRowFunc = (row) => {
    const thread = row.item;
    if (thread instanceof SystemThread) {
      return this.renderSystemThreadRowFunc(thread, row.index);
    }

    let typingUsers = [];
    const typingThreadData = this.props.typingThreads[thread.uid];
    if (typingThreadData && typingThreadData.typing) {
      typingUsers = Object.keys(typingThreadData.typing).filter(
        (userID) => typingThreadData.typing[userID] && userID !== `user_${this.props.myUser.uid}`,
      );
    }

    const lastMessage = DatabaseManager.shared().getLastMessageInThread(thread.uid);
    const totalUnReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(thread.uid);
    const blocked = this.props.blockedThreads.includes(thread.uid);

    return (
      <ThreadRow
        testID={`test_row_chat_${row.index}`}
        thread={thread}
        lastMessage={lastMessage}
        totalUnReadMessages={totalUnReadMessages}
        isSeparatorHidden={false}
        onPress={this.onThreadPress}
        onLongPress={this.onThreadLongPress}
        blocked={blocked}
        lastUpdated={thread.updateTimeAgoString()}
        typingUsers={typingUsers}
      />
    );
  };

  renderSystemThreadRowFunc = (thread) => {
    const sysMessages = this.props.systemGiftedNotifications;
    const adminMessages = this.props.adminGiftedNotifications;
    const lastMess =
      thread.type === 'admin'
        ? SystemThread.lastMessage(adminMessages)
        : SystemThread.lastMessage(sysMessages);
    const totalunread =
      thread.type === 'admin'
        ? this.props.totalUnReadAdminNotificationsFb
        : this.props.totalUnReadSystemNotificationsFb;

    return (
      <ThreadRow
        testID={`test_row_chat_${thread.titleString()}`}
        thread={thread}
        lastMessage={lastMess || ''}
        totalUnReadMessages={totalunread}
        isSeparatorHidden={false}
        onPress={this.onThreadPress}
        onLongPress={this.onThreadLongPress}
        blocked={false}
        isSystem
        lastUpdated={lastMess ? lastMess.createTimeAgoString() : ''}
      />
    );
  };
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onAddPress={this.onNavBarAddPress}
        loading={this.props.isFetchThreadsProcessing || this.props.isGetNotificationsProcessing}
        onSearchTextChanged={this.onSearchText}
      />
    );
  }
  renderTabsHeader() {
    let totalUnread = 0;
    let totalUnReadMessageGroups = 0;
    const notificationUnread =
      this.props.totalUnReadAdminNotificationsFb + this.props.totalUnReadSystemNotificationsFb;
    if (this.props.allThreads !== undefined) {
      this.props.allThreads.forEach((thread) => {
        const unReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(thread.uid);
        if (thread.isGroupThread()) {
          totalUnReadMessageGroups += unReadMessages;
        }
        totalUnread += unReadMessages;
      });
    }

    totalUnread += notificationUnread;

    const buttons = [
      { title: 'Tin nhắn', tag: TAB_ALL_THREADS_INDEX, unread: totalUnread },
      { title: 'Nhóm', tag: TAB_GROUP_THREADS_INDEX, unread: totalUnReadMessageGroups },
      {
        title: 'MFast',
        tag: TAB_APPAY_THREADS_INDEX,
        unread: notificationUnread,
      },
    ];

    return (
      <AnimatedTabbar
        ref={(ref) => {
          this.animatedTabbar = ref;
        }}
        style={{ paddingTop: 2 }}
        dataButtons={buttons}
        onTabTapped={this.onTabsHeaderSelected}
      />
    );
  }
  renderThreadsList() {
    const { sections } = this.state;
    this.sections = sections;

    // ---
    return (
      <SectionList
        style={{ overflow: 'hidden' }}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: colors.separator }}
            refreshing={false}
            onRefresh={this.onThreadsListRefresh}
          />
        }
        keyExtractor={(item) => item.uid}
        renderItem={this.renderThreadRowFunc}
        renderSectionHeader={this.renderThreadSectionFunc}
        renderSectionFooter={this.renderThreadSectionFooter}
        sections={sections}
        scrollEventThrottle={50}
        onScroll={this.handleScroll}
      />
    );
  }
  renderEmptyDataView() {
    const title = this.searchText !== '' ? 'Không tìm thấy trò chuyện' : Strings.threads_empty;
    return (
      <View style={styles.emptyDataContainer}>
        <EmptyDataView
          containerStyle={{ paddingBottom: 96 }}
          title={title}
          onRefreshPress={this.onThreadsListRefresh}
          canReload={this.searchText === ''}
        />
      </View>
    );
  }
  renderActionSheet() {
    let options = ['Đóng'];
    const thread = this.state.targetThread;
    options = this.messagesActionSheet(thread, options);
    return thread instanceof SystemThread ? (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        options={options}
        cancelButtonIndex={0}
        onPress={this.onActionSheetSystemPress}
      />
    ) : (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        options={options}
        cancelButtonIndex={0}
        destructiveButtonIndex={thread && thread.isSingleThread() ? 4 : 3}
        onPress={this.onActionSheetPress}
      />
    );
  }
  render() {
    const isEmptyDataViewVisible = this.state.sections.length === 0;
    return (
      <View style={styles.container} testID="test_chatlist">
        {this.renderNavigationBar()}
        {this.renderTabsHeader()}
        {!isEmptyDataViewVisible ? this.renderThreadsList() : null}
        {isEmptyDataViewVisible ? this.renderEmptyDataView() : null}
        {this.renderActionSheet()}
      </View>
    );
  }
}

// --------------------------------------------------

ChatsListScreen.navigationOptions = () => ({
  title: 'Chat List',
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarLabel: 'Tin nhắn',
  tabBarIcon: ({ focused }) => {
    return <ChatNotificationIcon focused={focused} />;
  },

  tabBarTestID: 'test_tabbar_chatlist',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isFetchThreadsProcessing: state.isFetchThreadsProcessing,
  isThreadsCanLoadMore: state.isThreadsCanLoadMore,
  allThreads: state.allThreads,
  chatThread: state.chatThread,
  blockedThreads: state.blockedThreads,

  isGetNotificationsProcessing: state.isGetNotificationsProcessing,
  getNotificationsResponse: state.getNotificationsResponse,

  adminGiftedNotifications: state.adminGiftedNotifications,
  systemGiftedNotifications: state.systemGiftedNotifications,
  totalUnReadAdminNotificationsFb: state.totalUnReadAdminNotificationsFb,
  totalUnReadSystemNotificationsFb: state.totalUnReadSystemNotificationsFb,

  currentScreenName: state.currentScreenName,
  typingThreads: state.typingThreads,
});

const mapDispatchToProps = (dispatch) => ({
  reloadAllThreadsFromDB: () => dispatch(reloadAllThreadsFromDB()),
  fetchThreads: (fromUpdateTime, maxThreadsFetch, keyword) =>
    dispatch(fetchThreads(fromUpdateTime, maxThreadsFetch, keyword)),
  openChatWithThread: (thread, unReadMessages) =>
    dispatch(openChatWithThread(thread, unReadMessages)),
  closeChat: () => dispatch(closeChat()),
  block: (userID) => dispatch(block(userID)),
  unblock: (userID) => dispatch(unblock(userID)),

  getLastNotiFb: () => dispatch(getLastNotiFb()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatsListScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.separator,
  },
  emptyDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#808080',
    fontSize: 18,
    fontWeight: '600',
  },
  threadSection: {
    backgroundColor: colors.separator,
  },
  threadSectionTitle: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    color: '#7f7f7f',
    backgroundColor: colors.navigation_bg,
    fontSize: 14,
    fontWeight: '600',
  },
});
