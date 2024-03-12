/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Handle Chat
 * - Subscribe all needed threas to update message
 * - Update redux state and prepare data to render
 */

/**
 * TODO: 
 * - Handle thread delete
 */

import BroadcastManager from './BroadcastManager';
import Native from '../Bridge';
import FirebaseDatabase from '../network/FirebaseDatabase';
import FirebaseFunctions from '../network/FirebaseFunctions';


import {
  chatCenterState as setChatCenterState,
  blockedThreads,
  reloadAllThreadsFromDB,
  threadChanged,
  newThread,
  threadTypingDataChanged,
} from '../redux/actions';

import {
  CHAT_CENTER_STATES as STATES,
} from '../redux/actions/app';

import {
  User,
  Thread,
  Message,
} from '../model';

const store = Native.getStore();

const _ = require('lodash');

// initial objects will be fetch when subscribe to thread and message 'child_add'
// no need to be many because we will fetch in app later
const INITIAL_THREADS_LOAD = 1;
const INITIAL_MESSAGES_LOAD = 99;

const MAX_SUBCRIBE_THREAD = 99;

// discard all events cause by subscribe 
// const ON_NEW_THREAD_DELAY = 4000;
// const ON_THREAD_CHANGE_DELAY = 4000;
// const ON_NEW_MESSAGE_DELAY = 4000;
// const ON_MESSAGE_CHANGE_DELAY = 4000;

// chat events
export const CHAT_EVENTS = {
  MY_USER_CHANGE: 'MY_USER_CHANGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
  MESSAGE_CHANGE: 'MESSAGE_CHANGE',
  NEW_THREAD: 'NEW_THREAD',
  THREAD_CHANGE: 'THREAD_CHANGE',
  THREAD_SYSTEM_CHANGE: 'THREAD_SYSTEM_CHANGE',
};

// --------------------------------------------------

function initChatCenter() {

  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {};
  const mSubscribePaths = {};

  // let initThreadState = 0;
  // let tempInitThread = [];

  // --------------------------------------------------

  // subscribe store
  let mState = STATES.UN_INITED;
  let mChatThread = null;
  store.subscribe(() => {
    // 1. subscribe init & de-init chat center state
    const currentState = store.getState().chatCenterState;
    if (mState !== currentState && currentState === STATES.PENDING_INIT) {
      mState = currentState;
      const myUser = store.getState().myUser;
      ChatCenter.shared().goOnline();
      ChatCenter.shared().setup(myUser);
      store.dispatch(setChatCenterState(STATES.INITED));
    }
    if (mState !== currentState && currentState === STATES.PENDING_DE_INIT) {
      mState = currentState;
      const emptyUser = new User();
      ChatCenter.shared().goOffline();
      ChatCenter.shared().setup(emptyUser);
      store.dispatch(setChatCenterState(STATES.UN_INITED));
      mChatThread = null;
    }

    // 2. re-subscribe thread events when open chat
    const currentChatThread = store.getState().chatThread;
    if (mChatThread !== currentChatThread) {
      const oldThreadID = mChatThread ? mChatThread.uid : '';
      const newThreadID = currentChatThread ? currentChatThread.uid : '';
      if (oldThreadID !== newThreadID && newThreadID.length > 0) {
        // just clone the thread data, remove realm database props
        // or when logout, the db is de-init will cause crash
        mChatThread = Object.assign(new Thread(), currentChatThread);
        mChatThread.uid = currentChatThread.uid;
        // re-subscribe
        mSubscribeMyThreadsChangeForThread(newThreadID);
        mSubcribeMessageLifeCircleInThread(mChatThread);
      }
    }

    // 3. subscribe my user change to sync with firebase
    const currentMyUser = store.getState().myUser;
    // if (JSON.stringify(mMyUser) !== JSON.stringify(currentMyUser)) {
    if (currentMyUser && !_.isEqual(mMyUser, currentMyUser)) {
      mUpdateMyUser(currentMyUser);
    }
  });

  // --------------------------------------------------

  function mUpdateMyUser(currentMyUser) {
    mMyUser = currentMyUser;
    FirebaseDatabase.updateUserMetadata(currentMyUser.uid, currentMyUser);
  }

  function mResetTimeouts() {

    // mShouldHandleNewThread = false;
    // setTimeout(() => {
    //   mShouldHandleNewThread = true;
    // }, ON_NEW_THREAD_DELAY);

    // mShouldHandleThreadChange = false;
    // setTimeout(() => {
    //   mShouldHandleThreadChange = true;
    // }, ON_THREAD_CHANGE_DELAY);

    // mShouldHandleNewMessage = false;
    // setTimeout(() => {
    //   mShouldHandleNewMessage = true;
    // }, ON_NEW_MESSAGE_DELAY);

    // mShouldHandleMessageChange = false;
    // setTimeout(() => {
    //   mShouldHandleMessageChange = true;
    // }, ON_MESSAGE_CHANGE_DELAY);
  }

  // EVENT SUBSCRIBEs
  // --------------------

  /**
   * listen for /users/<my_user_id> -> `value`
   * - to support login in on multiple devices
   * - temporary disabled: need to test
   */
  function mSubscribeMyUserChange() {
    // const usersRef = FirebaseDatabase.getUsersRef();
    // usersRef.child(`${mMyUser.uid}`)
    //   .limitToLast(1)
    //   .on('value', (snapshot) => {
    //     const user = snapshot.val();
    //     mNotifyObservers(CHAT_EVENTS.MY_USER_CHANGE, user);
    //   });
  }

  /**
   * for each of my thread
   * listen for /threads/<my_thread_id> -> `value`
   * - to support thread meta data change
   */
  function mSubscribeMyThreadsChange(numOfThread) {
    const asyncTask = async () => {
      try {
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid, null, numOfThread);
        const publicThreads = await FirebaseFunctions.getPublicThreads();
        const allThreads = threads.concat(publicThreads);
        for (let i = 0; i < allThreads.length; i += 1) {
          const thread = allThreads[i];
          mSubscribeMyThreadsChangeForThread(thread.uid);
        }
        mSubscribeMySystemThreadsChange();
      } catch (err) {
      }
    };
    asyncTask();
  }

  /**
   * listen for /threads/<my_thread_id> -> `value`
   * - to support thread meta data change
   * - to support add/remove users in thread
   */
  function mSubscribeMyThreadsChangeForThread(threadID) {
    const threadRef = FirebaseDatabase.getThreadsRef();
    const path = `${threadRef.key}/${threadID}`;
    // subscribe
    threadRef.child(threadID).off();
    threadRef.child(threadID).on('value', onThreadChange);
    // track to un-subscribe later
    mSubscribePaths[path] = true;

    const threadAddDataRef = FirebaseDatabase.getThreadsTypingRef();
    const pathAddData = `${threadAddDataRef.key}/${threadID}/typing`;
    // subscribe
    threadAddDataRef.child(`${threadID}/typing`).off();
    threadAddDataRef.child(`${threadID}/typing`).on('value', onThreadTypingDataChange);
    // track to un-subscribe later
    mSubscribePaths[pathAddData] = true;

  }

  function mSubscribeMySystemThreadsChange() {
    const threadRef = FirebaseDatabase.getNotiUserThreadRef();
    const path = `${FirebaseDatabase.getNotiUserThreadRef()}/user_${mMyUser.uid}`;
    // subscribe
    threadRef.child(`user_${mMyUser.uid}`).off();
    threadRef.child(`user_${mMyUser.uid}`).on('value', onThreadSystemChange);
    // track to un-subscribe later
    mSubscribePaths[path] = true;
  }

  /**
   * listen for /users/<my_user_id>/threads -> `child_added`
   * - to support add/remove thread
   */
  function mSubscribeNewThread() {
    const usersThreadsRef = FirebaseDatabase.getUsersThreadsRef();
    const fbUserID = FirebaseDatabase.firebaseUserID(mMyUser.uid);
    const path = `${usersThreadsRef.key}/${fbUserID}/threads`;
    // subscribe
    usersThreadsRef.child(`${fbUserID}/threads`).off();
    usersThreadsRef.child(`${fbUserID}/threads`)
      .orderByChild('updateTime')
      .startAt((new Date()).getTime())
      .limitToLast(INITIAL_THREADS_LOAD)
      .on('child_added', onNewThread);
    // track to un-subscribe later
    mSubscribePaths[path] = true;
  }

  /**
   * listen for /threads_public -> `child_added`
   * - to support add/remove public thread
   */
  function mSubscribeNewPublicThread() {
    const threadsRef = FirebaseDatabase.getThreadsPublicRef();
    const path = threadsRef.key;
    // subscribe
    threadsRef.off();
    threadsRef
      .orderByChild('updateTime')
      .startAt((new Date()).getTime())
      .limitToLast(INITIAL_THREADS_LOAD)
      .on('child_added', onNewThread);
    // track to un-subscribe later
    mSubscribePaths[path] = true;
  }

  function mSubcribeBlockedThread() {
    const threadsRef = FirebaseDatabase.getBlockedThreadRef();
    const path = threadsRef.key;

    const fbUserID = FirebaseDatabase.firebaseUserID(mMyUser.uid);
    // subscribe
    threadsRef.off();
    threadsRef
      .child(fbUserID)
      .on('value', onBlockedThread);
    // track to un-subscribe later
    mSubscribePaths[path] = true;
  }

  /**
   * for each of my thread
   * listen for /threads/<my_thread_id>/users -> `child_added`, `child_removed`
   * - to support invite/remove me in a thread
   */
  // -> temporary disabled, will be use when implement group chat
  // function mSubscribeThreadUsersChange() {
  //   const asyncTask = async () => {
  //     try {
  //       const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();
  //       const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
  //       for (let i = 0; i < threads.length; i += 1) {
  //         const thread = threads[i];
  //         threadsMessagesRef.child(`${thread.uid}/users`)
  //           .on('child_added', (snapshot) => {
  //             const user = snapshot.val();
  //           });
  //         threadsMessagesRef.child(`${thread.uid}/users`)
  //           .on('child_removed', (snapshot) => {
  //             const user = snapshot.val();
  //           });
  //       }
  //     } catch (err) {
  //       Utils.warn('mSubscribeThreadUsersChange: error', err);
  //     }
  //   };
  //   asyncTask();
  // }

  /**
   * for each of my thread
   * listen for /threads_messages/<my_thread_id>/messages -> `child_added`
   * - to support new message
   */
  function mSubscribeNewMessage(numOfThread) {
    const asyncTask = async () => {
      try {
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid, null, numOfThread);
        const publicThreads = await FirebaseFunctions.getPublicThreads();
        const allThreads = threads.concat(publicThreads);
        for (let i = 0; i < allThreads.length; i += 1) {
          const thread = allThreads[i];
          mSubcribeMessageLifeCircleInThread(thread);
        }
      } catch (err) {
      }
    };
    asyncTask();
  }

  function mSubcribeMessageLifeCircleInThread(thread) {
    if (thread) {
      const threadID = thread.uid;
      const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();

      // unsubcribe
      threadsMessagesRef.child(`${threadID}/messages`).off('child_added');
      threadsMessagesRef.child(`${threadID}/messages`).off('child_changed');

      const lastUpdatedTime = (_thread, _userID) => {
        let lastTime = _thread.createTime;
        if (thread.readTimes && _userID) {
          if (`user_${_userID}` in thread.readTimes) {
            lastTime = thread.readTimes[`user_${_userID}`];
          }
        }
        const lastMessage = Native.databaseManager.getLastMessageInThread(_thread.uid);
        const lastMessageTime = lastMessage ? lastMessage.createTime : _thread.createTime;

        const lastUpdated = lastTime > lastMessageTime ? lastTime : lastMessageTime;
        return lastUpdated || 0;
      };

      if (mMyUser) {
        threadsMessagesRef.child(`${threadID}/messages`)
          .orderByChild('createTime')
          .startAt(lastUpdatedTime(thread, mMyUser.uid) + 1)
          .limitToLast(INITIAL_MESSAGES_LOAD)
          .on('child_added', onNewMessage);
      }

      threadsMessagesRef.child(`${threadID}/messages`)
        .limitToLast(20)
        .on('child_changed', onMessageChange);

      // store path for tracking
      const path = `${threadsMessagesRef.key}/${threadID}/messages`;
      mSubscribePaths[path] = true;
    }
  }

  /**
   * Un-Subscribe event at all paths in mSubscribePaths
   */
  function mUnSubscribeAllChatPaths() {
    const chatRef = FirebaseDatabase.getChatRef();
    const paths = Object.keys(mSubscribePaths);
    for (let i = 0; i < paths.length; i += 1) {
      const path = paths[i];
      mSubscribePaths[path] = null;
      chatRef.child(path).off();
    }
  }

  // EVENT HANDLERs
  // --------------------

  const onNewThread = (snapshot) => {
    // if (!mShouldHandleNewThread) { return; }
    // check thread
    const threadID = snapshot.key;
    if (!threadID) { return; }
    // fetch thread
    const asyncTask = async () => {
      try {
        const threadJSON = await FirebaseDatabase.getThread(threadID);
        const thread = Thread.objectFromJSON(threadJSON);

        // 2. subscribe
        mSubscribeMyThreadsChangeForThread(thread.uid);
        mSubcribeMessageLifeCircleInThread(thread);

        const dbThread = Native.databaseManager.getThread(threadJSON.uid);
        if (dbThread) {
          return;
        }
        store.dispatch(newThread(thread));
        // 4. notify
        BroadcastManager.shared().notifyObservers(CHAT_EVENTS.NEW_THREAD, thread);
      } catch (err) {
      }
    };
    asyncTask();
  };

  const onThreadChange = (snapshot) => {
    // if (!mShouldHandleThreadChange) { return; }
    // parse
    const threadJSON = snapshot.val();
    // 1. update 
    if (threadJSON) {
      store.dispatch(threadChanged(threadJSON));
      const thread = Thread.objectFromJSON(threadJSON);
      // notify
      BroadcastManager.shared().notifyObservers(CHAT_EVENTS.THREAD_CHANGE, thread);
    }
    // 2. delete
    else {
      const threadID = snapshot.key;
      const result = Native.databaseManager.deleteObject('Thread', threadID);
      if (result === 0) {
        return;
      }
      // notify
      const dbThread = Native.databaseManager.getObject('Thread', threadID);
      BroadcastManager.shared().notifyObservers(CHAT_EVENTS.THREAD_CHANGE, dbThread);
    }
  };

  const onThreadTypingDataChange = (snapshot) => {
    const threadTypingDataJSON = snapshot.val();
    if (threadTypingDataJSON) {
      store.dispatch(threadTypingDataChanged({ typing: threadTypingDataJSON, uid: snapshot.ref.parent.key }));
    }
  };

  const onThreadSystemChange = (snapshot) => {
    const threadJSON = snapshot.val();
    BroadcastManager.shared().notifyObservers(CHAT_EVENTS.THREAD_SYSTEM_CHANGE, threadJSON);
  };

  const onNewMessage = (snapshot) => {
    const message = Message.objectFromJSON(snapshot.val());
    if (!message) { return; }

    const oldDBMessage = Native.databaseManager.getMessage(message);
    if (oldDBMessage) { return; }

    checkAndFetchThread(message.threadID);

    const dbMessage = Native.databaseManager.createObject('Message', message);
    if (!dbMessage) { return; }
    
    FirebaseDatabase.isReceived([message]);
    BroadcastManager.shared().notifyObservers(CHAT_EVENTS.NEW_MESSAGE, message);
  };

  const checkAndFetchThread = async (threadID) => {
    const dbThread = Native.databaseManager.getThread(threadID);
    if (!dbThread) {
      const threads = await
        FirebaseDatabase.mGetThreadsFromThreadIDs([threadID]);
      if (threads.length > 0) {
        const thread = Thread.objectFromJSON(threads[0]);
        Native.databaseManager.createObject('Thread', thread);
      }
      store.dispatch(reloadAllThreadsFromDB());
    }
  };

  const onMessageChange = (snapshot) => {
    // if (!mShouldHandleMessageChange) { return; }
    // 0. parse
    const messageJSON = snapshot.val();
    const message = Message.objectFromJSON(messageJSON);
    if (!message) {
      return;
    }
    const oldDBMessage = Native.databaseManager.getMessage(message);
    if (!oldDBMessage) {
      return;
    }
    const oldCreateTime = oldDBMessage.createTime;
    // 1. insert into db
    const dbMessage = Native.databaseManager.createObject('Message', message);
    if (!dbMessage) {
      return;
    }
    const createTime = dbMessage.createTime;

    // 2. notify
    if (oldCreateTime === createTime) {
      BroadcastManager.shared().notifyObservers(CHAT_EVENTS.MESSAGE_CHANGE, message);
    }
  };

  const onBlockedThread = (snapshot) => {
    if (snapshot.val() !== null) {
      store.dispatch(blockedThreads(Object.keys(snapshot.val())));
    }
    else {
      store.dispatch(blockedThreads([]));
    }
  };

  // REDUX STATE
  // --------------------------------------------------

  // function mUpdateThreadsInAllThreads(threads) {
  //   // update new thread

  //   let isNeedToUpdate = true;
  //   let newAllThreads = store.getState().allThreads;
  //   for (let i = 0; i < threads.length; i += 1) {
  //     const thread = threads[i];
  //     newAllThreads = store.getState().allThreads.map(item => { // eslint-disable-line
  //       if (item.uid === thread.uid) {
  //         isNeedToUpdate = true;
  //         return thread;
  //       }
  //       return item;
  //     });
  //   }
  //   // --
  //   if (isNeedToUpdate) {
  //     // sort desc by updateTime & update
  //     newAllThreads.sort((item1, item2) => {
  //       return (item2.updateTime - item1.updateTime);
  //     });
  //     store.dispatch(setAllThreads(newAllThreads));
  //   }
  // }


  // PUBLIC
  // --------------------------------------------------

  return {
    goOnline() {
      FirebaseDatabase.getDatabase().goOnline();
    },
    goOffline() {
      FirebaseDatabase.getDatabase().goOffline();
      FirebaseDatabase.getConnectedRef().off();
      mUnSubscribeAllChatPaths();
    },
    setup(user) {
      mUpdateMyUser(user);
      mSubscribeMyThreadsChange(MAX_SUBCRIBE_THREAD);
      mSubscribeNewThread();
      mSubscribeNewPublicThread();
      mSubscribeNewMessage(MAX_SUBCRIBE_THREAD);
      mSubcribeBlockedThread();
    },
  };
}

// --------------------------------------------------

function initSingletonChatCenter() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initChatCenter();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ChatCenter = initSingletonChatCenter();
export default ChatCenter;
