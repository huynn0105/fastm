/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import { firebase } from '../../Bridge';

import {
  IS_FETCH_CHAT_MESSAGES_PROCESSING,
  IS_FETCH_CHAT_NEW_MESSAGES_PROCESSING,
  IS_CHAT_MESSAGES_CAN_LOADMORE,
  CHAT_THREAD,
  CHAT_MESSAGES,
  IS_CHAT_MESSAGES_ADDED,
  APPEND_CHAT_MESSAGES,
  PREPEND_CHAT_MESSAGES,
  IS_CHAT_IMAGES_CAN_LOADMORE,
  CHAT_IMAGES,
  APPEND_CHAT_IMAGES,
  IS_FETCHING_CHAT_IMAGE_MESSAGES,

  CHAT_VIDEOS,
  APPEND_CHAT_VIDEOS,
  IS_FETCHING_CHAT_VIDEO_MESSAGES,
} from '../actions/types';

// --------------------------------------------------

export function isFetchChatMessagesProcessing(state = false, action) {
  switch (action.type) {
    case IS_FETCH_CHAT_MESSAGES_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function isFetchChatNewMessagesProcessing(state = false, action) {
  switch (action.type) {
    case IS_FETCH_CHAT_NEW_MESSAGES_PROCESSING:
      return action.payload;
    default:
      return state;
  }
}

export function isChatMessagesCanLoadMore(state = true, action) {
  switch (action.type) {
    case IS_CHAT_MESSAGES_CAN_LOADMORE:
      return action.canLoadMore;
    default:
      return state;
  }
}

export function chatThread(state = null, action) {
  switch (action.type) {
    case CHAT_THREAD:
      return action.thread;
    default:
      return state;
  }
}

export function chatMembers(state = {}, action) {
  switch (action.type) {
    case CHAT_THREAD: {
      // check thread
      const thread = action.thread;
      if (thread === null) { return {}; }
      // map thread users to dict
      const users = thread.getUsersDetailsArray();
      return users.reduce((acc, item) => {
        acc[item.uid] = item;
        return acc;
      }, {});
    }
    default:
      return state;
  }
}

export function chatMessages(state = [], action) {
  switch (action.type) {
    case CHAT_MESSAGES:
      return mReduceDeletedMessage(action.messages);
    case APPEND_CHAT_MESSAGES:
      return state.concat(mReduceDeletedMessage(action.messages));
    case PREPEND_CHAT_MESSAGES:
      return mReduceDeletedMessage(action.messages).concat(state);
    default:
      return state;
  }
}

export function isChatMessagesAdded(state = {}, action) {
  switch (action.type) {
    case IS_CHAT_MESSAGES_ADDED:
      return action.isMessagesAdded;
    default:
      return state;
  }
}

// --------------------------------------------------

export function chatImages(state = [], action) {
  switch (action.type) {
    case CHAT_IMAGES:
      return action.images;
    case APPEND_CHAT_IMAGES:
      return state.chatImages.concat(action.images);
    default:
      return state;
  }
}

export function isFetchingChatImageMessages(state = false, action) {
  switch (action.type) {
    case IS_FETCHING_CHAT_IMAGE_MESSAGES:
      return action.payload;
    default:
      return state;
  }
}

export function chatVideos(state = [], action) {
  switch (action.type) {
    case CHAT_VIDEOS:
      return action.videos;
    case APPEND_CHAT_VIDEOS:
      return state.chatVideos.concat(action.videos);
    default:
      return state;
  }
}

export function isFetchingChatVideoMessages(state = false, action) {
  switch (action.type) {
    case IS_FETCHING_CHAT_VIDEO_MESSAGES:
      return action.payload;
    default:
      return state;
  }
}


export function isChatImagesCanLoadMore(state = true, action) {
  switch (action.type) {
    case IS_CHAT_IMAGES_CAN_LOADMORE:
      return action.canLoadMore;
    default:
      return state;
  }
}

function mReduceDeletedMessage(messages) {
  const currentUser = firebase.auth().currentUser;
  if (currentUser && messages && messages.length > 0) {
    return messages.filter(object => {
      return !object.message.hide;
    });
  }
  else { // eslint-disable-line
    return messages;
  }
}
