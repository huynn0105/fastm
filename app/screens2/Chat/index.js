import { Strings } from 'app/constants/strings';
import { Utils } from 'app/utils/Utils';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { ICON_PATH } from '../../assets/path';
import BottomActionSheet from '../../components2/BottomActionSheet';
import ListSearchResult from '../../components2/ListSearchResult';
import LoginRequire from '../../components2/LoginRequire/index';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import DatabaseManager from '../../manager/DatabaseManager';
import SystemThread from '../../models/SystemThread';
import DigitelClient from '../../network/DigitelClient';
import { block, getLastNotiFb, unblock } from '../../redux/actions';
import { dispatchGetThreadPublic } from '../../redux/actions/actionsV3/threadPublic';
import {
  fetchConversationContacts,
  fetchConversationContactsOnline,
  fetchInvitationsRequests,
} from '../../redux/actions/conversationContact';
import { openLogin } from '../../redux/actions/navigation';
import ContactsListScreen from '../../screens2/ContactsList/index';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import { CHAT_EVENTS } from '../../submodules/firebase/manager/ChatCenter';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import {
  closeChat,
  fetchThreads,
  openChatWithThread,
  openChatWithThreadUID,
  openChatWithUser,
  reloadAllThreadsFromDB,
} from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import { showInfoAlert, showQuestionAlertWithTitle } from '../../utils/UIUtils';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { SCREEN_MODE } from '../ChatFeedback';
import ChatFeedbackHome from '../ChatFeedbackHome';
import { ActiveUserItem, AddFriendButton } from './ActiveUserBar';
import EmptyChatView from './EmptyChatView';
import ModalOption from './ModalOption';
import NavigationBar from './NavigationBar';
import ThreadRow from './ThreadRow';
import { defaultNavOptions } from '../Root/MainScreen';
import KJButton from '../../components/common/KJButton';

const removeDiacritics = require('diacritics').remove;

const _ = require('lodash');

const INITIAL_THREADS_LOAD = 20;
const PREVIOUS_THREADS_LOAD = 20;

const TAB_ALL_THREADS_INDEX = 0;
const TAB_GROUP_THREADS_INDEX = 2;
const TAB_APPAY_THREADS_INDEX = 1;
const DEFAULT_TAB = TAB_ALL_THREADS_INDEX;

const ACTION_SHEET_THREAD_LONG_PRESS = 'ACTION_SHEET_THREAD_LONG_PRESS';

const TABS = {
  CHAT: 1,
  CONTACT: 2,
  ROOM_SUPPORT: 0,
};
const MENU = [
  { title: 'Phòng hỗ trợ', tag: TABS.GROUP, unread: 5 },
  { title: 'Tin nhắn', tag: TABS.CHAT, unread: 0 },
  { title: 'Liên hệ', tag: TABS.CONTACT, unread: 0 },
];

const DEVICE_HEIGHT = Dimensions.get('window').height;

const DEFAULT_CONTACTS_ONLINE = [{ title: 'Thêm bạn bè', type: 'ADD_FRIEND', uid: 'ADD_FRIEND' }];

class ChatScreen extends Component {
  constructor(props) {
    super(props);

    const sections = this.groupThreadsToSections(props.allThreads, DEFAULT_TAB);

    this.state = {
      // searchSections,
      sections,
      threadsLastMessages: {},
      selectedTabIndex: DEFAULT_TAB,
      opacityListSearchView: new Animated.Value(0),
      listSearchY: new Animated.Value(DEVICE_HEIGHT),
      containerListSearchY: new Animated.Value(DEVICE_HEIGHT),
      isShownCloseButtonNavBar: false,
      // eslint-disable-next-line react/no-unused-state
      index: 0,
      // eslint-disable-next-line react/no-unused-state
      routes: [
        { key: TABS.ROOM_SUPPORT, item: MENU[0] },
        { key: TABS.CHAT, item: MENU[1] },
        { key: TABS.CONTACT, item: MENU[2] },
      ],
      listContactsOnline: DEFAULT_CONTACTS_ONLINE,
      isValidToken: true,
    };
    this.actionSheetRef = React.createRef();
    this.lastMessages = {};
    this.sections = [];
    this.searchText = '';

    this.isOpeningThread = false;

    this.currentTab = DEFAULT_TAB;
    this.contentOffsetX = 0;
  }
  componentWillMount() {
    this.addObservers();
  }
  componentDidMount() {
    this.fetchContactsOnline();
    this.props.dispatchGetThreadPublic();
    this.subs = [this.props.navigation.addListener('willFocus', this.componentWillFocus)];
    this.props.fetchConversationContacts();
  }

  // fetch contacts online
  fetchContactsOnline = async () => {
    const contacts = await fetchConversationContactsOnline();
    if (Array.isArray(contacts)) {
      this.setState({ listContactsOnline: DEFAULT_CONTACTS_ONLINE.concat(contacts) });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const isChatChanged =
      !isEqual(this.props.allThreads, nextProps.allThreads) && nextProps.allThreads;
    if (isChatChanged) {
      const sections = this.groupThreadsToSections(
        nextProps.allThreads,
        this.state.selectedTabIndex,
        nextProps,
      );
      this.debounceUpdateSection(sections);
    }
    if (nextProps.myUser?.uid?.length > 0) {
      this.setState({
        isValidToken: true,
      });
    }
  }

  componentWillUnmount() {
    this.removeObservers();
    this.subs.forEach((sub) => sub.remove());
  }
  componentWillFocus = async () => {
    if (this.props.chatThread !== null) {
      this.props.closeChat();
    }

    const user = this.props.myUser;
    if (user?.uid?.length > 0) {
      this.fetchContactsOnline();
      this.props.getLastNotiFb();
      this.props.fetchConversationContacts();
      this.props.fetchInvitationsRequests();
    }
  };

  componentDidFocus = () => {
    // console.log('this is chat screen');
    // this.verifyIdToken();
    // this.invokeTut();
  };

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
    this.actionSheetRef.current.open();
    // this.props.navigation.navigate('CreateGroupChat');
  };
  onNavBarSearchPress = () => {
    this.props.navigation.navigate('ChatSearch');
  };
  onTabsHeaderSelected = (index) => {
    // refresh sections if tab change
    if (!this._horizontalScrollView) return;

    if (index === TAB_APPAY_THREADS_INDEX) {
      this._horizontalScrollView.scrollToEnd();
    } else {
      const sections = this.groupThreadsToSections(this.props.allThreads, index);
      this.debounceUpdateSection(sections);
      this.setState({
        selectedTabIndex: index,
      });
      this._horizontalScrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  onThreadsListRefresh = () => {
    this.reloadData();
    this.fetchContactsOnline();
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
  debounceOnThreadsListEndReached = debounce(this.onThreadsListEndReachedDelay, 100);

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

  onContactPress = (user) => {
    this.openChatWithUser(user);
  };

  onContactLongPress = () => {
    // this.setState(
    //   {
    //     actionSheetType: ACTION_SHEET_THREAD_LONG_PRESS,
    //     targetThread: thread,
    //   },
    //   () => {
    //     this.actionSheet.show();
    //   },
    // );
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

  onHorizontalScrollEnd = () => {
    if (this.contentOffsetX === SCREEN_WIDTH && this.currentTab !== TAB_APPAY_THREADS_INDEX) {
      this.currentTab = TAB_APPAY_THREADS_INDEX;
      this.animatedTabbar.onTabTapped(this.currentTab);
    } else if (
      this.contentOffsetX <= SCREEN_WIDTH / 2 &&
      this.currentTab !== this.state.selectedTabIndex
    ) {
      this.currentTab = this.state.selectedTabIndex;
      this.animatedTabbar.onTabTapped(this.currentTab);
    }
  };

  onHorizontalScroll = (event) => {
    this.contentOffsetX = event.nativeEvent.contentOffset.x;
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

  onFocusOnTab = (tab) => {
    this.setState({ index: tab });
  };

  toggleShowHideCloseButtonNavBar = (isShown) => {
    this.setState({ isShownCloseButtonNavBar: isShown });
  };

  hideListSearchResultView = () => {
    // Showing Opacity Effect
    Animated.timing(this.state.opacityListSearchView, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
    // translate Y the list
    Animated.timing(this.state.listSearchY, {
      toValue: Dimensions.get('window').height,
      duration: 450,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
    // translate Y the container list
    Animated.timing(this.state.containerListSearchY, {
      toValue: Dimensions.get('window').height,
      duration: 450,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
  };

  showListSearchResultView = () => {
    // Showing Opacity Effect
    Animated.timing(this.state.opacityListSearchView, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
    // translate Y the list
    Animated.timing(this.state.listSearchY, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
    // translate Y the container list
    Animated.timing(this.state.containerListSearchY, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
  };

  onNavBarCloseSearchPress = () => {
    this.hideListSearchResultView();
    this.toggleShowHideCloseButtonNavBar(false);
  };

  onFocusingSearchBar = (isFocused) => {
    if (isFocused) {
      this.showListSearchResultView();
      this.toggleShowHideCloseButtonNavBar(true);
    }
  };

  onSearchItemPress = (data, type) => {
    if (type === 'thread') {
      this.openChatWithThreadUID(data.uid);
    } else if (type === 'contact') {
      this.openChatWithUser(data);
    }
  };

  onPressSupportTicket = () => {
    this.props.navigation.navigate('ChatFeedbackHome');
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
  openChatWithThreadUID(threadUID) {
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
      const unReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(threadUID);
      this.props.openChatWithThreadUID(threadUID, unReadMessages);
    }, 0);

    this.isOpeningThread = false;
  }
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
  groupThreadsToSections(threads, activeTab) {
    const { threadPublicIds = [] } = this.props;
    const threadsFilter = threads.filter((thr) =>
      threadPublicIds.every((item) => item !== thr.uid),
    );
    // filter thread by group
    let data = [];
    let dataActiveUserBar = [
      {
        data: [{ title: 'Thêm bạn', type: 'ADD_FRIEND' }],
        title: '',
        index: 0,
        type: 'ACTIVE_BAR',
      },
    ];

    if (activeTab === TAB_GROUP_THREADS_INDEX) {
      data = threadsFilter.filter((thread) => {
        return thread.isGroupThread();
      });
    } else if (activeTab === TAB_APPAY_THREADS_INDEX) {
      data = threadsFilter.filter((thread) => {
        return thread instanceof SystemThread;
      });
    } else {
      data = threadsFilter;
    }

    const favoriteThreads = data.filter((item) => item?.isFavorite);
    const normalThreads = data.filter((item) => !item?.isFavorite);

    const showSystemNoti =
      (activeTab === TAB_ALL_THREADS_INDEX && !this.searchText) ||
      activeTab === TAB_APPAY_THREADS_INDEX;
    if (showSystemNoti) {
      // const systemThreads = this.getSystemThreads(nextProps);
      // this.insertSystemThreadToNormalThreads(systemThreads, favoriteThreads, normalThreads);
    }

    const sections = [];
    if (favoriteThreads.length > 0) {
      sections.push({ data: favoriteThreads, title: 'Ưa thích', index: 1 });
    }
    if (normalThreads.length > 0) {
      sections.push({ data: normalThreads, title: 'Gần đây', index: sections.length });
    }

    const undeleted = this.reduceDeletedThread(sections);
    let unemptySections = this.reduceEmptyThread(undeleted);
    unemptySections = dataActiveUserBar.concat(unemptySections);
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

  calculateUnreadChat = () => {
    let notificationUnread = 0;
    //this.props.totalUnReadAdminNotificationsFb + this.props.totalUnReadSystemNotificationsFb;
    if (this.props.allThreads !== undefined) {
      this.props.allThreads.forEach((thread) => {
        if (thread.uid) {
          const unReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(thread.uid);
          notificationUnread += unReadMessages;
        }
      });
    }
    return notificationUnread;
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
    if (!section.title) return <View />;
    return (
      <View style={[styles.threadSection, { paddingVertical: 0, paddingTop: SH(16) }]}>
        <AppText bold style={[styles.threadSectionTitle, { marginTop: SH(4) }]}>
          {section.title}
        </AppText>
        {/* <View style={styles.dividerSection} /> */}
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
    ) : section.index === 0 || section.index === this.sections.length ? null : (
      <View />
    );
  };

  onRequestContactPress = () => {
    this.props.navigation.navigate('CreateContactRequest');
  };

  renderItemActiveUserBar = ({ item }) => {
    switch (item.type) {
      case 'ADD_FRIEND':
        return <AddFriendButton onRequestContactPress={this.onRequestContactPress} />;
      default:
        return (
          <View>
            <ActiveUserItem
              user={item}
              onPress={this.onContactPress}
              onLongPress={this.onContactLongPress}
            />
          </View>
        );
    }
  };

  itemSeparatorComponent = () => <View style={{ width: 14 }} />;

  renderActiveUserBar = () => {
    const { listContactsOnline } = this.state;
    return (
      <FlatList
        data={listContactsOnline || []}
        horizontal
        contentContainerStyle={{ padding: 12 }}
        renderItem={this.renderItemActiveUserBar}
        keyExtractor={(item) => `${item?.uid}`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={this.itemSeparatorComponent}
      />
    );
  };

  renderThreadRowFunc = (row) => {
    if (row.index === 0 && row?.section?.type === 'ACTIVE_BAR') {
      return this.renderActiveUserBar();
    }
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

  itemSeparatorThreadsItem = () => (
    <View
      style={{
        // marginVertical: 8,
        marginLeft: 86,
        marginRight: 16,
      }}
    >
      <View
        style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          height: 0.5,
        }}
      />
    </View>
  );
  renderThreadsList() {
    const { sections } = this.state;
    this.sections = sections;
    // ---
    return (
      <SectionList
        style={{ flexGrow: 1, flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: 'transparent' }}
            refreshing={false}
            onRefresh={this.onThreadsListRefresh}
          />
        }
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={this.itemSeparatorThreadsItem}
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
  renderEmptyDataView = () => {
    // const title =
    //   this.searchText !== '' ? 'Không tìm thấy trò chuyện' : 'Bạn chưa nhận được tin nhắn nào';
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 100 }}>{this.renderActiveUserBar()}</View>
        <View style={styles.emptyDataContainer}>
          <EmptyChatView />
        </View>
      </View>
    );
  };
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

  renderChatContent = () => {
    const { sections } = this.state;
    let isEmptyDataViewVisible =
      sections && sections.filter((item) => item.type !== 'ACTIVE_BAR').length === 0;
    return (
      <View style={{ width: SCREEN_WIDTH, flex: 1, backgroundColor: Colors.neutral5 }}>
        {!isEmptyDataViewVisible ? this.renderThreadsList() : null}
        {isEmptyDataViewVisible ? this.renderEmptyDataView() : null}
      </View>
    );
  };

  renderContactContent = () => {
    return <ContactsListScreen navigation={this.props.navigation} />;
  };

  renderRoomSupport = () => {
    const { allThreads, threadPublicIds = [] } = this.props;
    const data = allThreads.filter((thr) => threadPublicIds.some((item) => item === thr.uid));
    return <ChatFeedbackHome navigation={this.props.navigation} />;
  };

  renderListSearchResult = () => {
    const { sections, opacityListSearchView, containerListSearchY, listSearchY } = this.state;
    // none active users
    const sectionsSearch = sections.filter((item) => item.type !== 'ACTIVE_BAR');
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: SCREEN_WIDTH,
          height: '100%',
          backgroundColor: 'white',
          opacity: opacityListSearchView,
          transform: [{ translateY: containerListSearchY }],
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: listSearchY }],
          }}
        >
          <ListSearchResult
            sections={sectionsSearch}
            textSearch={this.searchText}
            onResultItemPress={this.onSearchItemPress}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  renderMenu = (props) => {
    const { fetchingConversationContacts } = this.props;
    const notificationUnread = this.calculateUnreadChat();
    const totalContact = this.props.conversationContacts.length;
    const totalString = totalContact > 0 ? `(${totalContact})` : '';
    const notificationUnreadString = notificationUnread > 0 ? `(${notificationUnread})` : '';
    const count = (route) =>
      route.key === TABS.CHAT
        ? notificationUnreadString
        : route.key === TABS.ROOM_SUPPORT
        ? ''
        : totalString;

    return null;
    return (
      <TabBar
        {...props}
        style={{
          backgroundColor: '#fff',
          elevation: 0,
          borderBottomColor: Colors.actionBackground,
          borderBottomWidth: 0.5,
        }}
        indicatorStyle={{ backgroundColor: Colors.primary2, height: 2 }}
        renderLabel={({ route, focused }) => (
          <View style={{ flexDirection: 'row' }}>
            <AppText
              bold
              style={{
                color: focused ? Colors.primary2 : 'rgba(0, 0, 0, 0.5)',
                fontSize: SH(13),
                lineHeight: SH(18),
                textAlign: 'center',
              }}
            >
              {`${route.item.title} ${count(route)}`}
            </AppText>
            {fetchingConversationContacts && route.key === TABS.CONTACT ? (
              <ActivityIndicator size={'small'} animating />
            ) : null}
          </View>
        )}
      />
    );
  };
  renderScene = ({ route }) => {
    switch (route.key) {
      case TABS.CHAT:
        return this.renderChatContent();
      case TABS.CONTACT:
        return this.renderContactContent();
      case TABS.ROOM_SUPPORT:
        return this.renderRoomSupport();
      default:
        return null;
    }
  };

  renderContent = () => {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderMenu}
        onIndexChange={(index) => this.onFocusOnTab(index)}
        initialLayout={{ width: SCREEN_WIDTH }}
        swipeEnabled={false}
      />
    );
  };

  renderRequireLogin = () => {
    return (
      <LoginRequire
        onPress={() => this.props.openLogin()}
        renderHeader={() => (
          <SafeAreaInsetsContext.Consumer>
            {(insets) => (
              <View
                style={{
                  backgroundColor: '#ffffff',
                  paddingTop: insets.top,
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.neutral5,
                    height: 36,
                    marginHorizontal: 16,
                    borderRadius: 32,
                    marginTop: 12,
                    marginBottom: 40,
                  }}
                />
              </View>
            )}
          </SafeAreaInsetsContext.Consumer>
        )}
      />
    );
  };

  onNavBarBackPress = () => {
    this.props.navigation.pop();
  };

  renderNavigationBar() {
    const { isShownCloseButtonNavBar } = this.state;
    return (
      <NavigationBar
        loading={this.props.isFetchThreadsProcessing || this.props.isGetNotificationsProcessing}
        isShownRightCloseButton={isShownCloseButtonNavBar}
        onSearchTextChanged={this.onSearchText}
        onFocusingSearchBar={this.onFocusingSearchBar}
        onCloseSearchPress={this.onNavBarCloseSearchPress}
        onAddPress={this.onNavBarAddPress}
        onAlarmPress={() => {}}
        onBackPress={this.onNavBarBackPress}
      />
    );
  }

  renderListOptionChat = () => {};

  onPressCreateNewMessageButton = () => {
    this.actionSheetRef.current.close();
    this.props.navigation.navigate('CreateGroupChat');
  };
  onPressContactButton = () => {
    this.actionSheetRef.current.close();
    this.props.navigation.navigate('CreateContactRequest');
  };
  onPressSupportButton = () => {
    const { myUser } = this.props;
    this.actionSheetRef.current.close();
    if (myUser && myUser.isLoggedIn) {
      this.props.navigation.navigate('ChatFeedback', { screenMode: SCREEN_MODE.WELCOME });
    } else {
      this.props.openLogin();
    }
  };

  render() {
    const { myUser } = this.props;

    const listOptions = [
      {
        id: '0',
        icon: ICON_PATH.message_icon,
        onPress: this.onPressCreateNewMessageButton,
        title: 'Cuộc trò chuyện mới',
      },
      {
        id: '1',
        icon: ICON_PATH.contact_icon,
        onPress: this.onPressContactButton,
        title: 'Thêm liên hệ mới',
      },
      {
        id: '2',
        icon: ICON_PATH.support_icon,
        onPress: this.onPressSupportButton,
        title: 'Tạo yêu cầu hỗ trợ mới',
      },
    ];

    if (!myUser?.isLoggedIn) {
      return this.renderRequireLogin();
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {/* {myUser.fullName
          ? // && this.state.isValidToken
            this.renderNavigationBar()
          : null} */}
        <View style={{ flex: 1 }}>
          {this.renderContent()}
          {this.renderListSearchResult()}
        </View>
        {this.renderActionSheet()}
        <BottomActionSheet
          ref={this.actionSheetRef}
          render={() => (
            <ModalOption
              listOptions={listOptions}
              onClose={() => this.actionSheetRef.current.close()}
            />
          )}
          canClose={true}
        />
      </SafeAreaView>
    );
  }
}

ChatScreen.navigationOptions = ({ navigation }) => {
  const title = navigation?.state?.params?.title || 'Phòng hỗ trợ';
  const options = {
    ...defaultNavOptions,
    title,
    headerLeft: (headerLeftProps) => {
      return (
        <KJButton
          testID="header-back"
          leftIconSource={ICON_PATH.back}
          leftIconStyle={{
            width: 22,
            height: 22,
            resizeMode: 'contain',
          }}
          containerStyle={{
            paddingHorizontal: 16,
            height: '100%',
          }}
          onPress={() => navigation.pop()}
        />
      );
    },
  };

  return options;
};

const mapDispatchToProps = (dispatch) => ({
  reloadAllThreadsFromDB: () => dispatch(reloadAllThreadsFromDB()),
  fetchThreads: (fromUpdateTime, maxThreadsFetch, keyword) =>
    dispatch(fetchThreads(fromUpdateTime, maxThreadsFetch, keyword)),
  openChatWithThread: (thread, unReadMessages) =>
    dispatch(openChatWithThread(thread, unReadMessages)),
  closeChat: () => dispatch(closeChat()),
  block: (userID) => dispatch(block(userID)),
  unblock: (userID) => dispatch(unblock(userID)),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  getLastNotiFb: () => dispatch(getLastNotiFb()),
  openLogin: () => dispatch(openLogin()),
  openChatWithThreadUID: (user) => dispatch(openChatWithThreadUID(user)),

  fetchConversationContacts: () => dispatch(fetchConversationContacts()),
  fetchInvitationsRequests: () => dispatch(fetchInvitationsRequests()),
  dispatchGetThreadPublic: () => dispatch(dispatchGetThreadPublic()),
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isFetchThreadsProcessing: state.isFetchThreadsProcessing,
  isThreadsCanLoadMore: state.isThreadsCanLoadMore,
  allThreads: state.allThreads,
  allContacts: state.allContacts,
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
  conversationContacts: state.conversationContacts,
  fetchingConversationContacts: state.fetchingConversationContacts,
  threadPublicIds: state.threadPublicIds,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

const styles = StyleSheet.create({
  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  threadSection: {
    backgroundColor: Colors.actionBackground,
    paddingHorizontal: SW(16),
    paddingVertical: SH(12),
    // marginBottom: 6
  },
  threadSectionTitle: {
    // paddingTop: 12,
    // paddingBottom: 2,
    color: '#7f7f7f',
    backgroundColor: Colors.actionBackground,
    fontSize: SH(14),
    lineHeight: SH(20),
    // fontWeight: '600',
  },
});
