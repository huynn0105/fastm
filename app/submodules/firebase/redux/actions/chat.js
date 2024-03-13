/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import Native from '../../Bridge';
import FirebaseDatabase from '../../network/FirebaseDatabase';
import FirebaseFunctions from '../../network/FirebaseFunctions';
import ChatManager from '../../manager/ChatManager';
import { Message, Thread } from '../../model';

import {
  CHAT_THREAD,
  IS_FETCH_CHAT_MESSAGES_PROCESSING,
  IS_FETCH_CHAT_NEW_MESSAGES_PROCESSING,
  IS_CHAT_MESSAGES_CAN_LOADMORE,
  CHAT_MESSAGES,
  IS_CHAT_MESSAGES_ADDED,
  APPEND_CHAT_MESSAGES,
  PREPEND_CHAT_MESSAGES,
  IS_CHAT_IMAGES_CAN_LOADMORE,
  CHAT_IMAGES,
  APPEND_CHAT_IMAGES,
  IS_FETCHING_CHAT_IMAGE_MESSAGES,
  CHAT_VIDEOS,
  IS_FETCHING_CHAT_VIDEO_MESSAGES
} from './types';
import { reloadAllThreadsFromDB } from './thread';

// --------------------------------------------------

export function chatThread(object) {
  return {
    type: CHAT_THREAD,
    thread: object
  };
}

export function isFetchChatMessagesProcessing(bool) {
  return {
    type: IS_FETCH_CHAT_MESSAGES_PROCESSING,
    isProcessing: bool
  };
}

export function isFetchChatNewMessagesProcessing(bool) {
  return {
    type: IS_FETCH_CHAT_NEW_MESSAGES_PROCESSING,
    payload: bool
  };
}

export function isChatMessagesCanLoadMore(bool) {
  return {
    type: IS_CHAT_MESSAGES_CAN_LOADMORE,
    canLoadMore: bool
  };
}

export function chatMessages(objects) {
  return (dispatch, getState) => {
    const chatMembers = getState().chatMembers;
    const giftedMessages = objects.map((item) => mConvertMessageToGiftedMessage(item, chatMembers));
    dispatch(mChatMessagesAction(giftedMessages));
  };
}
function mChatMessagesAction(objects) {
  return {
    type: CHAT_MESSAGES,
    messages: objects
  };
}

export function appendChatMessages(objects) {
  return (dispatch, getState) => {
    const chatMembers = getState().chatMembers;
    const giftedMessages = objects.map((item) => mConvertMessageToGiftedMessage(item, chatMembers));
    dispatch(mAppendChatMessagesAction(giftedMessages));
  };
}
function mAppendChatMessagesAction(objects) {
  return {
    type: APPEND_CHAT_MESSAGES,
    messages: objects
  };
}

export function prependChatMessages(objects) {
  return (dispatch, getState) => {
    const chatMembers = getState().chatMembers;
    const giftedMessages = objects.map((item) => mConvertMessageToGiftedMessage(item, chatMembers));
    dispatch(mPrependChatMessagesAction(giftedMessages));
  };
}
function mPrependChatMessagesAction(objects) {
  return {
    type: PREPEND_CHAT_MESSAGES,
    messages: objects
  };
}

export function replaceChatMessage(object) {
  return (dispatch, getState) => {
    Native.databaseManager.createObject('Message', object);
    const messages = getState().chatMessages.map((giftedMessage) => {
      // return old gifted message
      if (giftedMessage.message.uid !== object.uid) {
        return giftedMessage;
      }
      // replace by new gifted message
      const chatMembers = getState().chatMembers;
      const newGiftedMessage = mConvertMessageToGiftedMessage(object, chatMembers);
      return newGiftedMessage;
    });
    dispatch(mChatMessagesAction(messages));
  };
}

export function isChatMessagesAdded(object) {
  return {
    type: IS_CHAT_MESSAGES_ADDED,
    isMessagesAdded: object
  };
}

export function openChatWithThread(thread, numOfMess = 12) {
  return (dispatch) => {
    dispatch(closeChat());
    dispatch(chatThread(thread));
    dispatch(loadChatMessages(numOfMess < 12 ? 12 : numOfMess));
  };
}

export function openChatWithThreadUID(threadUID, numOfMess = 12) {
  return async (dispatch) => {
    dispatch(closeChat());
    let thread = await FirebaseDatabase.getThread(threadUID);
    thread = Thread.objectFromJSON(thread);
    const threadDB = Native.databaseManager.createObject('Thread', thread);
    dispatch(chatThread(threadDB));
    dispatch(loadChatMessages(numOfMess < 12 ? 12 : numOfMess));
  };
}

export function openChatWithUser(target) {
  return (dispatch, getState) => {
    const openChat = async () => {
      const loadedThread = getState()
        .allThreads.filter((thread) => {
          return thread.isSingleThread();
        })
        .filter((_thread) => {
          const targetUser = _thread.getSingleThreadTargetUser();
          return target.uid === targetUser.uid;
        });

      let thread = null;
      if (loadedThread.length === 0) {
        thread = await ChatManager.shared().createSingleThreadWithTarget(target);
      } else {
        thread = loadedThread[0];
      }

      const unReadMessages = Native.databaseManager.countUnReadMessagesInThread(thread.uid);
      dispatch(openChatWithThread(thread, unReadMessages));
    };
    return openChat();
  };
}

export function closeChat() {
  return (dispatch) => {
    dispatch(chatThread(null));
    dispatch(chatMessages([]));
  };
}

export function loadChatMessages(maxMessages = 64) {
  return (dispatch, getState) => {
    // check thread
    const thread = getState().chatThread;
    if (thread === null) {
      return;
    }
    // --
    const threadID = thread.uid;
    const messages = getState().chatMessages;
    const oldestGiftedMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    if (!oldestGiftedMessage) {
      dispatch(mLoadNewChatMessages(threadID, maxMessages));
    } else {
      const fromCreateTime = oldestGiftedMessage.message.createTime;
      dispatch(mLoadMoreChatMessages(threadID, fromCreateTime, maxMessages));
    }
  };
}

export function loadChatMessageToID(quotedID) {
  return (dispatch, getState) => {
    const thread = getState().chatThread;
    if (thread === null) {
      return;
    }
    // --
    const threadID = thread.uid;
    const mchatMessages = getState().chatMessages;
    const oldestGiftedMessage =
      mchatMessages.length > 0 ? mchatMessages[mchatMessages.length - 1] : null;
    if (oldestGiftedMessage) {
      const fromCreateTime = oldestGiftedMessage.message.createTime;
      dispatch(isFetchChatMessagesProcessing(true));
      FirebaseDatabase.getMessagesInThreadToID(threadID, quotedID, fromCreateTime)
        .then((messageJSONs) => {
          // check thread is still the current thread in state
          const currentThread = getState().chatThread;
          if (currentThread === null) {
            return;
          }
          if (currentThread.uid !== threadID) {
            return;
          }
          // parse to Message object
          const messages = messageJSONs
            .map((json) => {
              return Message.objectFromJSON(json);
            })
            .filter((message) => {
              return message !== null && message.createTime < fromCreateTime;
            });
          // inser to db
          Native.databaseManager.createObjects('Message', messages);
          // update ui
          dispatch(mLoadChatMessagesFromDatabase(threadID, fromCreateTime, messages.length));
          // ---
          dispatch(isFetchChatMessagesProcessing(false));
        })
        .catch((err) => {
          dispatch(isFetchChatMessagesProcessing(false));
        });
    }
  };
}

export function chatNewMessage(messages) {
  return (dispatch, getState) => {
    // is message belongs to current chat
    const thread = getState().chatThread;
    // is message not added
    const isMessagesAdded = getState().isChatMessagesAdded;

    const newMess = [];
    for (let i = 0; i < messages.length; i += 1) {
      const message = messages[i];
      if (thread === null || thread.uid !== message.threadID) {
        return;
      }
      if (!isMessagesAdded[message.uid]) {
        newMess.push(message);
      }
      // add new
      isMessagesAdded[message.uid] = true;
    }
    if (newMess.length === 0) {
      return;
    }
    dispatch(prependChatMessages(newMess));
    dispatch(isChatMessagesAdded(isMessagesAdded));
  };
}

export function chatMessageChange(message) {
  return (dispatch, getState) => {
    // is message belongs to current chat
    const thread = getState().chatThread;
    if (thread === null || thread.uid !== message.threadID) {
      return;
    }
    // is message added
    const isMessagesAdded = getState().isChatMessagesAdded;
    if (isMessagesAdded[message.uid] === null || isMessagesAdded[message.uid] === false) {
      return;
    }
    // replace message
    dispatch(replaceChatMessage(message));
  };
}

export function getNewChatMess(threadID, readTime) {
  return (dispatch) => {
    const asyncTask = async () => {
      dispatch(isFetchChatNewMessagesProcessing(true));
      const token = await FirebaseDatabase.firebaseToken();
      return FirebaseFunctions.getNewChatMess(token, threadID, readTime)
        .then((messageJSONs) => {
          const messages = messageJSONs
            .map((json) => {
              const mess = Message.objectFromJSON(json);
              return mess;
            })
            .filter((message) => {
              return message !== null;
            })
            .sort((mess1, mess2) => {
              return mess2.createTime - mess1.createTime;
            });
          Native.databaseManager.createObjects('Message', messages);
          dispatch(chatNewMessage(messages));
          dispatch(isFetchChatNewMessagesProcessing(false));
        })
        .catch((err) => {
          dispatch(isFetchChatNewMessagesProcessing(false));
        });
    };
    return asyncTask();
  };
}

// --------------------------------------------------

export function chatImages(objects) {
  return {
    type: CHAT_IMAGES,
    images: objects
  };
}

export function isFetchingChatImageMessages(isFetching) {
  return {
    type: IS_FETCHING_CHAT_IMAGE_MESSAGES,
    payload: isFetching
  };
}

export function chatVideos(objects) {
  return {
    type: CHAT_VIDEOS,
    videos: objects
  };
}

export function isFetchingChatVideoMessages(isFetching) {
  return {
    type: IS_FETCHING_CHAT_VIDEO_MESSAGES,
    payload: isFetching
  };
}

export function appendChatImages(objects) {
  return {
    type: APPEND_CHAT_IMAGES,
    images: objects
  };
}

export function isChatImagesCanLoadMore(bool) {
  return {
    type: IS_CHAT_IMAGES_CAN_LOADMORE,
    canLoadMore: bool
  };
}

export function loadChatImages(maxImages = 512) {
  return (dispatch, getState) => {
    const {chatThread} = getState();
    if(!chatThread) return;
    const threadID = chatThread.uid;
    if(!threadID) return;
    const messages = Native.databaseManager.getImagesMessagesInThread(threadID, null, maxImages);
    let images = [];
    for (let i = 0; i < messages.length; i += 1) {
      const message = messages[i];
      const imageURLs = message.imageURLs || {};
      const urls = Object.keys(imageURLs).map((key) => imageURLs[key]);
      images = images.concat(urls);
    }
    dispatch(chatImages(images));
  };
}

export function loadChatImagesFromFirebase(maxImages = 512) {
  return (dispatch, getState) => {
    const {chatThread} = getState();
    if(!chatThread) return;
    const threadID = chatThread.uid;
    if(!threadID) return;
    const messages = Native.databaseManager.getImagesMessagesInThread(threadID, null, maxImages);
    dispatch(chatImages(mConvertImageMessages(messages)));
    dispatch(isFetchingChatImageMessages(true));
    const loadFromFirebase = async () => {
      try {
        const fbMessages = await FirebaseDatabase.getImageMessagesInThread(threadID, maxImages);
        dispatch(chatImages(mConvertImageMessages(fbMessages)));
        dispatch(isFetchingChatImageMessages(false));
      } catch (err) {
        dispatch(isFetchingChatImageMessages(false));
      }
    };
    loadFromFirebase();
  };
}

export function loadChatVideosFromFirebase(maxVideos = 512) {
  return (dispatch, getState) => {
    dispatch(isFetchingChatVideoMessages(true));
    const {chatThread} = getState();
    if(!chatThread) return;
    const threadID = chatThread.uid;
    if(!threadID) return;
    // const messages = Native.databaseManager.getVideosMessagesInThread(threadID, null, maxVideos);
    // dispatch(chatVideos(mConvertVideoMessages(messages)));
    const loadFromFirebase = async () => {
      try {
        const fbMessages = await FirebaseDatabase.getVideoMessagesInThread(threadID, maxVideos);
        dispatch(chatVideos(mConvertVideoMessages(fbMessages)));
        dispatch(isFetchingChatVideoMessages(false));
      } catch (err) {
        dispatch(isFetchingChatVideoMessages(false));
      }
    };
    loadFromFirebase();
  };
}

function mConvertImageMessages(messages) {
  let images = [];
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    const imageURLs = message.imageURLs || {};
    const urls = Object.keys(imageURLs).map((key) => imageURLs[key]);
    images = images.concat(urls);
  }
  return images;
}

function mConvertVideoMessages(messages) {
  let videos = [];
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    const videoURLs = message.videoURLs || {};
    const urls = Object.keys(videoURLs).map((key) => videoURLs[key]);
    videos = videos.concat(urls);
  }
  return videos;
}

function mConvertAudioMessages(messages) {
  let audios = [];
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    const audioURLs = message.audioURLs || {};
    const urls = Object.keys(audioURLs).map((key) => audioURLs[key]);
    audios = audios.concat(urls);
  }
  return audios;
}

// HELPERS
// --------------------------------------------------

function mLoadNewChatMessages(threadID, maxMessages = 64) {
  return (dispatch, getState) => {
    // load message from db and reset loadMore
    dispatch(mLoadChatMessagesFromDatabase(threadID, null, maxMessages));
    dispatch(isChatMessagesCanLoadMore(true));
    // fetch new messages
    dispatch(isFetchChatMessagesProcessing(true));
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
        // if having new messages
        // inser to db

        const newMessages = messages.filter((message) => {
          const oldMessage = Native.databaseManager.getMessage(message);
          return !oldMessage || oldMessage.updateTime !== message.updateTime;
        });

        if (newMessages.length > 0 || getState().chatMessages.length === 0) {
          Native.databaseManager.createObjects('Message', newMessages);
          // update ui
          dispatch(mLoadChatMessagesFromDatabase(threadID, null, maxMessages));
        }
        if (messages.length !== maxMessages) {
          // already load all messages
          dispatch(isChatMessagesCanLoadMore(false));
        }
        // ---
        dispatch(isFetchChatMessagesProcessing(false));
      })
      .catch((err) => {
        dispatch(isFetchChatMessagesProcessing(false));
      });
  };
}

function mLoadMoreChatMessages(threadID, fromCreateTime, maxMessages = 64) {
  return (dispatch) => {
    // check params
    if (fromCreateTime === null) {
      // this function should be use to fetch more message, not fetch newest message
      // if you don't have any fromCreateTime, please use loadNewChatMessages
      return;
    }
    // count total messages left in db
    const totalMessagesLeft = Native.databaseManager.countMessagesInThread(
      threadID,
      fromCreateTime
    );
    if (totalMessagesLeft > 0) {
      // database has messages left -> load from local database
      dispatch(mLoadChatMessagesFromDatabase(threadID, fromCreateTime, maxMessages));
      // return;
    } else {
      // already load all messages in database -> load from firebase
      dispatch(mLoadChatMessagesFromFirebase(threadID, fromCreateTime, maxMessages));
    }
  };
}

function mLoadChatMessagesFromDatabase(threadID, fromCreateTime = null, maxMessages = 256) {
  return (dispatch, getState) => {
    // check thread is still the current thread in state
    const currentThread = getState().chatThread;
    if (currentThread === null) {
      return;
    }
    if (currentThread.uid !== threadID) {
      return;
    }
    // --
    const messages = Native.databaseManager.getMessagesInThread(
      threadID,
      fromCreateTime,
      maxMessages
    );

    const oldCount = getState().chatMessages.length;

    // --
    if (fromCreateTime === null) {
      const isMessagesAdded = messages.reduce((acc, item) => {
        acc[item.uid] = true;
        return acc;
      }, {});
      dispatch(chatMessages(messages));
      dispatch(isChatMessagesAdded(isMessagesAdded));
    } else {
      const isMessagesAdded = getState().isChatMessagesAdded;
      const newMessages = messages.filter((item) => {
        // is message not added
        if (isMessagesAdded[item.uid]) {
          return false;
        }
        // add new
        isMessagesAdded[item.uid] = true;
        return true;
      });
      dispatch(appendChatMessages(newMessages));
      dispatch(isChatMessagesAdded(isMessagesAdded));
    }

    const newCount = getState().chatMessages.length;

    if (messages && messages.length > 0 && oldCount === newCount) {
      const lastIndex = messages.length - 1;
      const lastTime = messages[lastIndex].createTime - 1;
      dispatch(mLoadMoreChatMessages(threadID, lastTime, 5));
    }
  };
}

function mLoadChatMessagesFromFirebase(threadID, fromCreateTime, maxMessages = 64) {
  return (dispatch, getState) => {
    dispatch(isFetchChatMessagesProcessing(true));
    FirebaseDatabase.getMessagesInThread(threadID, fromCreateTime, maxMessages)
      .then((messageJSONs) => {
        // check thread is still the current thread in state
        const currentThread = getState().chatThread;
        if (currentThread === null) {
          return;
        }
        if (currentThread.uid !== threadID) {
          return;
        }
        // parse to Message object
        const messages = messageJSONs
          .map((json) => {
            return Message.objectFromJSON(json);
          })
          .filter((message) => {
            return message !== null && message.createTime < fromCreateTime;
          });
        // inser to db
        Native.databaseManager.createObjects('Message', messages);
        // update ui
        dispatch(mLoadChatMessagesFromDatabase(threadID, fromCreateTime, maxMessages));
        if (messageJSONs.length < maxMessages) {
          // already load all messages
          dispatch(isChatMessagesCanLoadMore(false));
        }
        // ---
        dispatch(isFetchChatMessagesProcessing(false));
      })
      .catch((err) => {
        dispatch(isFetchChatMessagesProcessing(false));
      });
  };
}

function mConvertMessageToGiftedMessage(message, chatMembers = {}) {
  // get last updated author details
  const author = chatMembers[message.authorID];
  let authorName = author && author.fullName ? author.fullName : null;
  let authorAvatar = author && author.avatarImage ? author.avatarImage : null;
  // if not found, info in message will be used
  if (authorName === null) {
    authorName = message.authorFullName || 'N/A';
  }
  if (authorAvatar === null) {
    authorAvatar = message.authorAvatarImage || '';
  }
  // base props
  const giftedMessage = {
    message,
    _id: message.uid,
    uid: message.uid,
    user: {
      _id: message.authorID,
      name: authorName,
      avatar: authorAvatar
    },
    createdAt: message.createTimeMoment().toDate()
  };
  // --
  if (message.isTextMessage()) {
    giftedMessage.text = message.getDisplayText();
  } else if (message.isNoticeMessage()) {
    giftedMessage.text = message.getDisplayText();
    giftedMessage.system = true;
  } else if (message.isImagesMessage()) {
    const imageIDs = Object.keys(message.imageURLs);
    if (imageIDs.length === 0) {
      giftedMessage.text = '...';
      giftedMessage.image = Message.getImagePlaceholderURL();
    } else {
      const imageID = imageIDs[0];
      const imageInfo = message.imageURLs[imageID];
      giftedMessage.image = Message.getDisplayImageURL(imageInfo, 'full');
      giftedMessage.thumbImage = Message.getDisplayImageURL(imageInfo, 'thumb');
    }
  } else if (message.isVideosMessage()) {
    const videoIDs = Object.keys(message.videoURLs);
    if (videoIDs.length === 0) {
      giftedMessage.text = '...';
      giftedMessage.video = 'video';
      giftedMessage.image = 'video';
    } else {
      const videoID = videoIDs[0];
      const videoInfo = message.videoURLs[videoID];
      giftedMessage.video = Message.getDisplayVideoURL(videoInfo);
      giftedMessage.image = 'video';
    }
  } else if (message.isAudiosMessage()) {
    const audioIDs = Object.keys(message.audioURLs);
    if (audioIDs.length === 0) {
      giftedMessage.text = '...';
      giftedMessage.audio = 'audio';
      giftedMessage.image = 'audio';
    } else {
      const audioID = audioIDs[0];
      const audioInfo = message.audioURLs[audioID];
      giftedMessage.audio = Message.getDisplayAudioURL(audioInfo);
      giftedMessage.image = 'audio';
    }
  } else if (message.isLocationMessage()) {
    giftedMessage.location = message.location;
  }
  return giftedMessage;
}

function mCheckHasChangedMessage(newMessageList, oldMessageList) {
  if (oldMessageList.length < newMessageList.length) {
    return true;
  }

  let hasChange = false;
  const sortedNewMessageList = newMessageList.sort(
    (mess1, mess2) => mess2.createTime - mess1.createTime
  );
  for (let i = 0; i < newMessageList.length; i += 1) {
    if (!mCheckSameMessage(sortedNewMessageList[i], oldMessageList[i])) {
      hasChange = true;
      break;
    }
  }
  return hasChange;
}

function mCheckSameMessage(newMessage, oldMessage) {
  return newMessage.updateTime === oldMessage.updateTime;
}
