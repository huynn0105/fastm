/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import Native from '../../Bridge';
import ChatManager from '../../manager/ChatManager';
import { Message, Thread } from '../../model';
import FirebaseDatabase from '../../network/FirebaseDatabase';
import { chatThread } from './chat';
import {
  ALL_THREADS,
  IS_FETCH_THREADS_PROCESSING,
  IS_THREADS_CAN_LOAD_MORE,
  OPENING_THREADS,
  UPDATE_TYPING_THREAD,
} from './types';

const removeDiacritics = require('diacritics').remove;

const _ = require('lodash');

// --------------------------------------------------

export function isFetchThreadsProcessing(bool) {
  return {
    type: IS_FETCH_THREADS_PROCESSING,
    isProcessing: bool,
  };
}

export function isThreadsCanLoadMore(bool) {
  return {
    type: IS_THREADS_CAN_LOAD_MORE,
    isThreadsCanLoadMore: bool,
  };
}

export function allThreads(objects) {
  return {
    type: ALL_THREADS,
    threads: objects,
  };
}

export function openingThread(bool) {
  return {
    type: OPENING_THREADS,
    payload: bool,
  };
}

export function updateTypingThread(threadTypingData) {
  return {
    type: UPDATE_TYPING_THREAD,
    payload: threadTypingData,
  };
}

function dispatchAllThread(dispatch, threads) {
  dispatch(allThreads(threads));
}

const debounceDispatchAllThreads = _.debounce(dispatchAllThread, 50);

// --------------------------------------------------

const updateAllThreads = (dispatch, maxThreads, keyword = '') => {
  let displayThreads = Native.databaseManager.getAllThreads();
  displayThreads = mFilterThreadWithKey(displayThreads, keyword);
  if (maxThreads) {
    displayThreads = displayThreads
      .slice(0, maxThreads)
      .filter((thread) => thread.isFavorite === false);
  }

  let favoritedThreads = Native.databaseManager.getAllFavoritedThreads().slice(0);
  favoritedThreads = mFilterThreadWithKey(favoritedThreads, keyword);

  const allVisibleThreads = favoritedThreads.concat(displayThreads);
  debounceDispatchAllThreads(dispatch, allVisibleThreads);
};

export const reloadAllThreadsFromDB = (maxThreads = 20, keyword = '') => {
  return (dispatch) => {
    debounceUpdateAllThreads(dispatch, maxThreads, keyword);
  };
};

const debounceUpdateAllThreads = _.debounce(updateAllThreads, 100);

export function fetchThreads(fromUpdateTime = null, maxThreads = 20, keyword = '') {
  return (dispatch, getState) => {
    // only one request run at a time
    if (getState().isFetchThreadsProcessing) {
      return true;
    }
    dispatch(isFetchThreadsProcessing(true));
    const asyncTask = async () => {
      try {
        // fetch new threads
        let threads = await ChatManager.shared().getMyThreads(fromUpdateTime, maxThreads);
        dispatch(isThreadsCanLoadMore(threads.length > 0));

        let haveToLoadMore = false;
        const lastThread = mLastThreadIn(threads);

        threads = mFilterThreadWithKey(threads, keyword);
        if (threads.length < 10 && keyword !== '') {
          haveToLoadMore = true;
        }

        // check threads are changed
        const changedThreads = mFilterChangedThreads(threads);
        mUpdateAndFetchMessageForThreads(changedThreads, dispatch);

        // update ui
        const needResetNumOfDisplayThreadsToDefault =
          fromUpdateTime === null && getState().allThreads.length !== threads.length;
        const needUpdateUI =
          changedThreads.length > 0 ||
          fromUpdateTime ||
          needResetNumOfDisplayThreadsToDefault ||
          keyword;

        if (needUpdateUI) {
          let numOfDisplayThreads = 0;
          if (fromUpdateTime === null) {
            numOfDisplayThreads = threads.length;
          } else {
            numOfDisplayThreads = getState().allThreads.length + threads.length;
          }
          dispatch(reloadAllThreadsFromDB(numOfDisplayThreads, keyword));
        }

        dispatch(isFetchThreadsProcessing(false));
        if (haveToLoadMore) {
          dispatch(fetchThreads(lastThread?.updateTime - 1, 20, keyword));
        }
        return true;
      } catch (err) {
        dispatch(isFetchThreadsProcessing(false));
        return false;
      }
    };
    return asyncTask();
  };
}

export function fetchThreadMessages(threadID, maxMessages = 24) {
  return (dispatch, getState) => {
    FirebaseDatabase.getMessagesInThread(threadID, null, maxMessages)
      .then((messageJSONs) => {
        // parse to Message object
        const messages = messageJSONs
          .map((json) => {
            return Message.objectFromJSON(json);
          })
          .filter((message) => {
            return message !== null;
          });

        const newMessages = messages.filter((message) => {
          const oldMessage = Native.databaseManager.getMessage(message);
          return !oldMessage || oldMessage?.updateTime !== message?.updateTime;
        });

        if (newMessages.length > 0) {
          mUpdateReceivedForMessages(newMessages);

          Native.databaseManager.createObjects('Message', newMessages);
          const dbThread = Native.databaseManager.getThread(threadID);
          if (dbThread) {
            debounceUpdateThreadInAllThreads(dbThread, dispatch, getState);
          }
        }
      })
      .catch((err) => {});
  };
}

const debounceUpdateThreadInAllThreads = _.debounce(updateThreadInAllThreads, 100);

export function threadChanged(threadJSON) {
  return (dispatch, getState) => {
    const oldDbThread = Native.databaseManager.getThread(threadJSON?.uid);
    if (!oldDbThread) {
      return;
    }
    const oldUpdateTime = oldDbThread?.updateTime;
    const cloneOldDbThread = oldDbThread?.comparableObj;

    const thread = Thread.objectFromJSON(threadJSON);

    const needUpdateUI = mCheckNeedUpdateUIThread(thread, oldDbThread);
    const needUpdateAllUI = mCheckNeedUpdateUIAllThread(thread, oldDbThread);

    Native.databaseManager.createObject('Thread', thread);
    const dbThread = Native.databaseManager.getThread(threadJSON?.uid);
    const newUpdateTime = dbThread?.updateTime;

    const cloneDbThread = dbThread?.comparableObj;

    if (_.isEqual(cloneOldDbThread, cloneDbThread)) {
      return;
    }

    if (oldUpdateTime !== newUpdateTime) {
      dispatch(fetchThreadMessages(thread?.uid, 12));
    }

    if (needUpdateUI || needUpdateAllUI) {
      mUpdateThreadInChatThread(dbThread, dispatch, getState);
    }
    if (needUpdateAllUI) {
      mUpdateThreadInAllThreads(dbThread, dispatch, getState);
    }
  };
}

export function threadTypingDataChanged(threadTypingData) {
  return (dispatch, getState) => {
    const hasChangedTyping = (newTypingData, typingThreads, myID) => {
      const oldThreadTyping = typingThreads[newTypingData?.uid];

      let hasChangedTypingState = false;
      if (oldThreadTyping) {
        const oldTyping = oldThreadTyping.typing;
        const newTyping = newTypingData.typing;
        oldTyping[`user_${myID}`] = false;
        newTyping[`user_${myID}`] = false;
        hasChangedTypingState = !_.isEqual(oldTyping, newTyping);
      } else {
        const newTypingUser = newTypingData.typing;
        newTypingUser[`user_${myID}`] = false;

        let hasTypingInNewData = false;
        const userIDs = Object.keys(newTypingUser);
        for (let i = 0; i < userIDs.length; i += 1) {
          if (newTypingUser[userIDs[i]]) {
            hasTypingInNewData = true;
            break;
          }
        }
        hasChangedTypingState = hasTypingInNewData;
      }
      return hasChangedTypingState;
    };

    if (hasChangedTyping(threadTypingData, getState().typingThreads, getState().myUser?.uid)) {
      dispatch(updateTypingThread(threadTypingData));
    }
  };
}

export function newThread(thread) {
  return (dispatch, getState) => {
    let dbThread = Native.databaseManager.getThread(thread?.uid);
    if (dbThread) {
      return;
    }
    // 1. insert into db
    dbThread = Native.databaseManager.createObject('Thread', thread);
    if (!dbThread) {
      return;
    }
    // 3. update store
    const checks = getState().allThreads.filter((item) => item?.uid === thread?.uid);
    const isNewThread = checks.length === 0;
    if (isNewThread) {
      if (thread?.updateTime !== thread.createTime) {
        dispatch(fetchThreadMessages(thread?.uid, 12));
      }

      // append
      const newAllThreads = getState().allThreads.concat(thread);
      // sort desc by updateTime & update
      newAllThreads.sort((item1, item2) => {
        return item2?.updateTime - item1?.updateTime;
      });
      debounceDispatchAllThreads(dispatch, newAllThreads);
    }
  };
}

function mUpdateThreadInAllThreads(thread, dispatch, getState) {
  // update new thread
  let isNeedToUpdate = false;
  const newAllThreads = getState().allThreads.map((item) => {
    if (item?.uid === thread?.uid) {
      isNeedToUpdate = true;
      return thread;
    }
    return item;
  });
  // --
  if (!isNeedToUpdate) {
    newAllThreads.push(thread);
  }
  // sort desc by updateTime & update
  newAllThreads.sort((item1, item2) => {
    return item2?.updateTime - item1?.updateTime;
  });
  debounceDispatchAllThreads(dispatch, newAllThreads);
}

function mUpdateThreadInChatThread(thread, dispatch, getState) {
  const currentThread = getState().chatThread;
  if (currentThread && currentThread?.uid === thread?.uid) {
    dispatch(chatThread(thread));
  }
}

function mFilterChangedThreads(threads) {
  return threads.filter((thread) => {
    const oldThread = Native.databaseManager.getThread(thread?.uid, true);
    return !oldThread || !mCheckSameThread(thread, oldThread);
  });
}

function mCheckSameThread(thread1, thread2) {
  const isNotChange =
    (thread1.adminID ? thread1.adminID : '') === thread2.adminID &&
    (thread1.backgroundImage ? thread1.backgroundImage : '') === thread2.backgroundImage &&
    thread1.isDeleted === thread2.isDeleted &&
    thread1.isDeletedByMe === thread2.isDeletedByMe &&
    thread1.isDeletedBySomeone === thread2.isDeletedBySomeone &&
    thread1.isFavorite === thread2.isFavorite &&
    thread1.isNotificationOn === thread2.isNotificationOn &&
    (thread1.photoImage ? thread1.photoImage : '') === thread2.photoImage &&
    (thread1.title ? thread1.title : '') === thread2.title &&
    thread1.type === thread2.type &&
    thread1?.updateTime === thread2?.updateTime &&
    _.isEqual(JSON.parse(thread1.readTimesJSON), JSON.parse(thread2.readTimesJSON)) &&
    _.isEqual(JSON.parse(thread1.usersDetailsJSON), JSON.parse(thread2.usersDetailsJSON)) &&
    _.isEqual(JSON.parse(thread1.usersJSON), JSON.parse(thread2.usersJSON));

  return isNotChange;
}

function mCheckNeedUpdateUIThread(thread1, thread2) {
  return (
    !_.isEqual(JSON.parse(thread1.readTimesJSON), JSON.parse(thread2.readTimesJSON)) ||
    thread1.pinnedText !== thread2.pinnedText
  );
}

function mCheckNeedUpdateUIAllThread(thread1, thread2) {
  return (
    (thread1.adminID ? thread1.adminID : '') !== thread2.adminID ||
    thread1.isDeleted !== thread2.isDeleted ||
    thread1.isDeletedByMe !== thread2.isDeletedByMe ||
    thread1.isFavorite !== thread2.isFavorite ||
    thread1.isNotificationOn !== thread2.isNotificationOn ||
    (thread1.photoImage ? thread1.photoImage : '') !== thread2.photoImage ||
    (thread1.title ? thread1.title : '') !== thread2.title ||
    thread1.type !== thread2.type ||
    thread1?.updateTime !== thread2?.updateTime
  );
}

function updateThreadInAllThreads(thread, dispatch, getState) {
  // update new thread
  let isNeedToUpdate = false;
  const newAllThreads = getState().allThreads.map((item) => {
    if (item?.uid === thread?.uid) {
      isNeedToUpdate = true;
      return thread;
    }
    return item;
  });
  // --
  if (isNeedToUpdate) {
    // sort desc by updateTime & update
    newAllThreads.sort((item1, item2) => {
      return item2?.updateTime - item1?.updateTime;
    });
    debounceDispatchAllThreads(dispatch, newAllThreads);
  }
}

function mFilterThreadWithKey(threads, keyword) {
  if (keyword === '' || threads.length <= 0) {
    return threads;
  }
  return threads.filter((thread) => {
    const name = removeDiacritics(thread.titleString().trim());
    return name.toLowerCase().includes(keyword.toLowerCase());
  });
}

function mLastThreadIn(threadList) {
  const sortedThread = threadList.sort((thread1, thread2) => {
    if (thread2.isFavorite) {
      return -1;
    }
    return thread2?.updateTime - thread1?.updateTime;
  });
  const lastThread = sortedThread[sortedThread.length - 1];
  return lastThread;
}

function mUpdateAndFetchMessageForThreads(threads, dispatch) {
  if (threads.length > 0) {
    // for each of thread
    for (let i = 0; i < threads.length; i += 1) {
      const thread = threads[i];

      const dbThread = Native.databaseManager.getThread(threads[i].dbUID);
      // is having new thread -> fetch messages
      if (!dbThread || dbThread?.updateTime < thread?.updateTime) {
        dispatch(fetchThreadMessages(thread?.uid, 12));
      }
    }

    // insert to db
    Native.databaseManager.createObjects('Thread', threads);
  }
}

function mUpdateReceivedForMessages(messages) {
  for (let i = 0; i < messages.length; i += 1) {
    FirebaseDatabase.isReceived(messages);
  }
}

// export function updateThreadsInAllThreads(threads) {
//   return (dispatch, getState) => {
//     // update new thread
//     let isNeedToUpdate = false;
//     let newAllThreads = Native.databaseManager.getAllThreads();
//     console.log(newAllThreads);

//     for (let i = 0; i < threads.length; i += 1) {
//       const thread = threads[i];
//       newAllThreads = newAllThreads.map(item => { // eslint-disable-line
//         if (item.uid === thread.uid) {
//           isNeedToUpdate = true;
//           return thread;
//         }
//         return item;
//       });
//     }
//     // --
//     if (isNeedToUpdate) {
//       // sort desc by updateTime & update
//       newAllThreads.sort((item1, item2) => {
//         return (item2?.updateTime - item1?.updateTime);
//       });
//     }
//     dispatch(allThreads(newAllThreads));
//   };
// }
