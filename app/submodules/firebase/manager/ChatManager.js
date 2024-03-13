/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
/**
 * A wrapper around low-level api to handle Chat logic
 * - Objects return from this class are already convert to Thread, Message
 */

import Native from '../Bridge';
import { Message, Thread, User } from '../model';
import FirebaseDatabase from '../network/FirebaseDatabase';
import FirebaseFunctions from '../network/FirebaseFunctions';

// --------------------------------------------------

function initChatManager() {
  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {};

  // PUBLIC
  // --------------------------------------------------

  return {
    setup(user) {
      // setup user
      mMyUser = user;
      // setup user in Model
      User.setupMyUser(user);
      Thread.setupMyUser(user);
      Message.setupMyUser(user);
    },
    // --------------------------------------------------
    async getUser(userID) {
      const userJSON = await FirebaseDatabase.getUser(userID);
      if (!userJSON) {
        return null;
      }
      return Object.assign(new User(), userJSON);
    },
    async getUsers(userIDs) {
      const tasks = [];
      for (let i = 0; i < userIDs.length; i += 1) {
        tasks.push(this.getUser(userIDs[i]));
      }
      const users = await Promise.all(tasks);
      return users.filter((item) => item !== null);
    },
    async getUserPresence(userID) {
      const presence = await FirebaseDatabase.getUserPresence(userID);
      return presence;
    },
    async getThread(threadID) {
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) return null;
      return Thread.objectFromJSON(thread);
    },
    async getMyThreads(fromUpdateTime = null, maxThreads = 10) {
      const threadJSONs = await FirebaseDatabase.getThreadsOfUser(
        mMyUser.uid,
        fromUpdateTime,
        maxThreads,
      );
      // map json to Thread
      const threads = threadJSONs.map((thread) => {
        return Thread.objectFromJSON(thread);
      });
      // filter-out updated threads
      // if (fromUpdateTime) {
      //   threads = threads.filter(thread => {
      //     return thread.updateTime < fromUpdateTime;
      //   });
      // }
      // --
      return threads;
    },
    async getPublicThreads() {
      const threads = await FirebaseFunctions.getPublicThreads();
      return threads.map((thread) => {
        return Thread.objectFromJSON(thread);
      });
    },
    async createSingleThreadWithTarget(target) {
      const thread = await FirebaseDatabase.createSingleThread(mMyUser, target);
      if (!thread) {
        return null;
      }
      return Thread.objectFromJSON(thread);
    },
    async createGroupThread(users, metaData) {
      const threadMetadata = Object.assign({ adminID: mMyUser.uid, metaData });
      const thread = await FirebaseDatabase.createGroupThread(users, threadMetadata);
      if (!thread) {
        return null;
      }
      return Thread.objectFromJSON(thread);
    },
    async updateThreadMetadata(threadID, metaData) {
      return FirebaseDatabase.updateThreadMetadata(threadID, metaData);
    },
    async setThreadAdmin(threadID, userID) {
      const results = await FirebaseDatabase.setThreadAdmin(threadID, userID);
      return results;
    },
    async addUsersToGroupThread(threadID, users, isJoinByLinkShare = false) {
      // add
      const result = await FirebaseDatabase.addUsersToGroupThread(threadID, users);
      if (!result) {
        return false;
      }
      // 2. add a notice message remove by admin
      const authorName = mMyUser.fullName;
      const userNames = users.map((user) => user.fullName).join(', ');
      let text = `${authorName} đã thêm ${userNames} vào cuộc trò chuyện này`;
      let htmlText = `<p><strong>${authorName}</strong> đã thêm <strong>${userNames}</strong> vào cuộc trò chuyện này</p>`;
      if (isJoinByLinkShare) {
        text = `${userNames} đã tham gia cuộc trò chuyện này`;
        htmlText = `<p><strong>${userNames}</strong> đã tham gia cuộc trò chuyện này</p>`;
      }
      const notice = Message.newNoticeMessage(text);
      notice.htmlText = htmlText;
      notice.setAuthorWithUser(mMyUser);
      await FirebaseDatabase.sendMessage(notice, threadID);
      return true;
    },
    async removeUsersFromGroupThread(threadID, users) {
      // 1. remove users
      const userIDs = users.map((user) => user.uid);
      const result = await FirebaseDatabase.removeUsersFromGroupThread(threadID, userIDs);
      if (!result) {
        return false;
      }
      return true;
    },
    async leaveGroupThread(threadID) {
      // 3. re-assing admin if I am admin
      const thread = await FirebaseDatabase.getThread(threadID);
      if (thread.adminID === mMyUser.uid) {
        const members = thread.users || {};
        const keys = Object.keys(members);
        let newAdminID = null;
        for (let i = 0; i < keys.length; i += 1) {
          const member = members[keys[i]];
          if (member.uid !== mMyUser.uid) {
            newAdminID = member.uid;
            break;
          }
        }
        if (newAdminID && newAdminID.length > 0) {
          await FirebaseDatabase.setThreadAdmin(threadID, newAdminID);
        }
      }

      // 1. remove users
      const results = await FirebaseDatabase.removeUsersFromGroupThread(threadID, [mMyUser.uid]);
      if (!results) {
        return false;
      }
      return true;
    },
    async sendMessage(message, threadID, customAuthor = null) {
      // init message

      // encrypt mess
      // const encryptedMessage = message;
      // const encryptor = new Encryptor('1234567812345678');
      // encryptedMessage.text = encryptor.encrypt(message.text);
      let author;
      if (customAuthor) {
        author = customAuthor;
      } else {
        author = {
          authorID: mMyUser.uid,
          authorFullName: mMyUser.fullName,
          authorAvatarImage: mMyUser.avatarImage,
        };
      }
      const myMessage = {
        ...message,
        ...author,
        imageURLs: message.imageURLs,
        imageURLsJSON: null,
        videoURLs: message.videoURLs,
        videoURLsJSON: null,
        location: message.location,
        locationJSON: null,
        // isEncrypted: true,
      };
      // undelete thread if it's deleted by someone
      const thread = Native.databaseManager.getThread(threadID);
      if (thread && thread.isDeletedBySomeone) {
        await FirebaseDatabase.unDeleteThreadChat(threadID);
      }
      // send message
      const messageID = await FirebaseDatabase.sendMessage(myMessage, threadID);
      // if (!newMessage) { return null; }
      // // save to db
      // const newMessageObj = Message.objectFromJSON(newMessage);
      // Native.databaseManager.createObject('Message', newMessageObj);
      // return message object
      return messageID;
    },
    async updateImageMessageServerURL(threadID, messageID, imageID, imageKey, imageURL) {
      const updates = {};
      updates[`imageURLs/${imageID}/${imageKey}`] = imageURL;
      return FirebaseDatabase.updateMessage(messageID, threadID, updates);
    },
    async updateVideoMessageServerURL(threadID, messageID, videoID, videoKey, videoURL) {
      const updates = {};
      updates[`videoURLs/${videoID}/${videoKey}`] = videoURL;
      return FirebaseDatabase.updateMessage(messageID, threadID, updates);
    },
    async updateAudioMessageServerURL(threadID, messageID, audioID, audioKey, audioURL) {
      const updates = {};
      updates[`audioURLs/${audioID}/${audioKey}`] = audioURL;
      return FirebaseDatabase.updateMessage(messageID, threadID, updates);
    },
    async getMessagesInThread(threadID, fromCreateTime = null, maxMessages = 65) {
      // fetch messages
      const messagesJSONs = await FirebaseDatabase.getMessagesInThread(
        threadID,
        fromCreateTime,
        maxMessages,
      );
      const messages = messagesJSONs
        .map((messageJSON) => {
          return Message.objectFromJSON(messageJSON);
        })
        .filter((message) => {
          return message !== null;
        });
      // insert into db
      const dbMessages = Native.databaseManager.createObjects('Message', messages);
      // return
      return dbMessages;
    },
    async updateMyReadTimeInThread(threadID) {
      // 1: Update via firebase database will cause duplicate trigger event
      // because firebase will set on local one & server one
      // just happen with firebase.database.ServerValue.TIMESTAMP
      // https://groups.google.com/forum/#!topic/firebase-talk/m3xci3wbzxE
      // return FirebaseDatabase.updateUserReadTimeInThread(threadID, mMyUser.uid);
      // --
      // 2: Update via cloud function
      return FirebaseFunctions.updateUserReadTimeInThread(threadID, mMyUser.uid);
    },
    async toggleMyNotificationOnInThread(threadID, isOn) {
      return FirebaseDatabase.toggleUserNotificationOnInThread(threadID, mMyUser.uid, isOn);
    },
    async toggleMyFavoriteInThread(threadID, isFavorite) {
      return FirebaseDatabase.toggleUserFavoriteInThread(threadID, mMyUser.uid, isFavorite);
    },
    async toggleUserFavoriteInThreadSystem(threadType, isFavorite) {
      return FirebaseDatabase.toggleUserFavoriteInThreadSystem(threadType, mMyUser.uid, isFavorite);
    },
    async deleteThreadChat(threadID) {
      return FirebaseDatabase.deleteThreadChat(threadID, mMyUser.uid);
    },
    async block(userID) {
      return FirebaseDatabase.block(userID);
    },
    async unblock(userID) {
      return FirebaseDatabase.unblock(userID);
    },
    async isMessageExistInThread(messageID, threadID) {
      let isExist = false;
      if (messageID && threadID) {
        const message = await FirebaseDatabase.getMessageInThread(threadID, messageID);
        if (message) {
          const messageObj = Message.objectFromJSON(message);
          isExist = !messageObj.hide;
        }
      }

      return isExist;
    },
  };
}

// --------------------------------------------------

function initSingletonChatManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initChatManager();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ChatManager = initSingletonChatManager();
export default ChatManager;
