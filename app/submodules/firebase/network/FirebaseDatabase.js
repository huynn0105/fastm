/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Entity in Realtime Database on firebase will have this format
 * -> <entity>/<entity_uid>/<entity_props>
 * -> uid will be used as the key to access an entity.
 * -> inside entity props, uid is not required to have
 */

import { firebase } from '../Bridge';
import { MESSAGE_TYPES } from '../model/Message';

const DATABASE = firebase.database();
const CONNECTED_REF = DATABASE.ref('.info/connected');
const CHAT_REF = DATABASE.ref('chat');
const USERS_REF = CHAT_REF.child('users');
const USERS_THREADS_REF = CHAT_REF.child('users_threads');
const USERS_PRESENCE_REF = CHAT_REF.child('users_presence');
const THREADS_REF = CHAT_REF.child('threads');
const THREADS_PUBLIC_REF = CHAT_REF.child('threads_public');
const THREADS_MESSAGES_REF = CHAT_REF.child('threads_messages');
const PHONENUMBERS_USER_REF = CHAT_REF.child('phonenumbers_user');
const USERS_BLOCK_REF = CHAT_REF.child('users_block');
const USERS_BLOCK_THREAD_REF = CHAT_REF.child('users_block_thread');
const USERS_BLOCK_BY_REF = CHAT_REF.child('users_block_by');

const USERS_CONTACTS_REF = CHAT_REF.child('users_contacts');

const NOTI_USER_THREAD_REF = DATABASE.ref('notification/user_thread');

const THREADS_TYPING_REF = CHAT_REF.child('threads_typing');

const VOIP = DATABASE.ref('voip');
const VOIP_USER_TOKEN = VOIP.child('user_tokens');

// --------------------------------------------------

const THREAD_TYPES = {
  SINGLE: 'single', // single thread 1v1, auto created
  GROUP: 'group', // private group thread
  PUBLIC: 'public', // public group thread
};

const ERRORS = {
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  USER_NOT_FOUND: 'THREAD_NOT_FOUND',
  SINGLE_THREAD_INVALID_ID: 'SINGLE_THREAD_INVALID_ID',
  SINGLE_THREAD_ALREADY_EXISTS: 'SINGLE_THREAD_ALREADY_EXISTS',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// --------------------------------------------------
// FirebaseDatabase
// --------------------------------------------------
class FirebaseDatabase {
  // --------------------------------------------------
  // Helpers - Private API
  // -> these are just simple functions help to insert/remove/edit firebase db
  // -> caller must responsible to do appropriate logic check if needed
  // -> for instance: if add user to thread, caller need to check whether thread exists or not
  // --------------------------------------------------

  /**
   * Update user's properties
   * @param {string} userID
   * @param {Object} user
   */
  static mUpdateUserMetadata(userID, user) {
    // filter out non-metadata props
    const metaData = FirebaseDatabase.mGetUserMetaData(user);
    Object.keys(metaData).forEach((key) => {
      if (metaData[key] == null) {
        delete metaData[key];
      }
    });
    // request
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    // -- update user info
    const userRef = USERS_REF.child(fbUserID);
    const userPromise = userRef.update(metaData);
    // -- update phone number user
    const phoneNumberRef = PHONENUMBERS_USER_REF.child(`phone_${user.standardPhoneNumber}`);
    const phoneUpdates = {};
    phoneUpdates[`${fbUserID}`] = {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
    };
    const phoneNumberPromise = phoneNumberRef.update(phoneUpdates);
    return Promise.all([userPromise, phoneNumberPromise]);
  }

  /**
   * Filter-out only what is metadata from user
   * @param {Object} user
   */
  static mGetUserMetaData(user) {
    if (!user) return false;
    const metaData = {
      uid: user.uid,
      avatarImage: user.avatarImage || '',
      wallImage: user.wallImage || '',
      email: user.email || '',
      fullName: user.fullName || '',
      mPhoneNumber: user.mPhoneNumber || '',
      standardPhoneNumber: user.standardPhoneNumber || '',
    };
    return metaData;
  }
  /**
   * Create a single conversation
   * -> caller must check for the exist of thread before calling this function
   * -> otherwise the old thread will be deleted,
   * -> because each single chat between 2 user is unique
   * @param {User} user1
   * @param {User} user2
   * @returns Promise contain true if success, or exception
   */
  static mAddSingleThread(user1, user2) {
    // request
    return new Promise((resolve, reject) => {
      const threadID = FirebaseDatabase.generateSingleThreadID(user1.uid, user2.uid);
      if (!threadID) {
        reject(new Error(ERRORS.SINGLE_THREAD_INVALID_ID));
        return;
      }
      // generate members with key is user uid
      const users = [user1, user2];
      const members = {};
      const membersDetails = {};
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        const userMetaData = FirebaseDatabase.mGetUserMetaData(user);
        const fbUserID = FirebaseDatabase.firebaseUserID(user.uid);
        members[fbUserID] = { uid: user.uid };
        membersDetails[fbUserID] = {
          uid: userMetaData.uid,
          fullName: userMetaData.fullName,
          avatarImage: userMetaData.avatarImage,
        };
      }
      // add thread
      THREADS_REF.child(threadID).set(
        {
          uid: threadID,
          type: THREAD_TYPES.SINGLE,
          users: members,
          usersDetails: membersDetails,
          createTime: firebase.database.ServerValue.TIMESTAMP,
          updateTime: firebase.database.ServerValue.TIMESTAMP,
          isDeleted: false,
        },
        (err) => {
          if (!err) {
            resolve(true);
          } else {
            reject(err);
          }
        },
      );
    });
  }

  /**
   * Create a conversation for a group of users
   * @param {User} users: list of member in the conversation
   * @param {string} title
   * @param {string} photoURL
   * @returns Promise contain true if success, or exception
   */
  static mAddGroupThread(users, metaData) {
    // generate members with key is user uid
    const members = {};
    const membersDetails = {};
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      const userMetaData = FirebaseDatabase.mGetUserMetaData(user);
      const fbUserID = FirebaseDatabase.firebaseUserID(user.uid);
      members[fbUserID] = { uid: user.uid };
      membersDetails[fbUserID] = {
        uid: userMetaData.uid,
        fullName: userMetaData.fullName,
        avatarImage: userMetaData.avatarImage,
      };
    }
    // add thread
    return new Promise((resolve, reject) => {
      const threadRef = THREADS_REF.push({});
      if (!threadRef) {
        resolve(null);
        return;
      }
      const threadID = threadRef.key;
      threadRef.set(
        {
          ...metaData,
          uid: threadID,
          type: THREAD_TYPES.GROUP,
          users: members,
          usersDetails: membersDetails,
          createTime: firebase.database.ServerValue.TIMESTAMP,
          updateTime: firebase.database.ServerValue.TIMESTAMP,
          isDeleted: false,
        },
        (err) => {
          if (!err) {
            resolve(threadID);
          } else {
            reject(err);
          }
        },
      );
    });
  }

  /**
   * Add list of threadID to a user
   * @param {string} userID
   * @param {[string]} threadIDs
   * @returns Promise when all of threads is added to user
   */
  static mAddThreadIDsToUser(userID, threadIDs) {
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    const userThreadsRef = USERS_THREADS_REF.child(`${fbUserID}/threads`);
    const newThreads = {};
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      newThreads[threadID] = {
        createTime: firebase.database.ServerValue.TIMESTAMP,
        updateTime: firebase.database.ServerValue.TIMESTAMP,
      };
    }
    return new Promise((resolve) => {
      userThreadsRef.update({ ...newThreads }, (err) => {
        resolve(err === null);
      });
    });
  }

  /**
   * Remove list of threadID from a user
   * @param {string} userID
   * @param {array of string} threadIDs
   */
  static mRemoveThreadIDsFromUser(userID, threadIDs) {
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    const userThreadsRef = USERS_THREADS_REF.child(fbUserID).child('threads');
    const threads = {};
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      threads[threadID] = null;
    }
    return new Promise((resolve) => {
      userThreadsRef.update({ ...threads }, (err) => {
        resolve(err === null);
      });
    });
  }

  /**
   * Add list of Users to a thread
   * @param {string} threadID
   * @param {array of User} users
   * @returns Promise contain true/false
   */
  static mAddUsersToThread(threadID, users) {
    const threadUsersRef = THREADS_REF.child(threadID).child('users');
    const threadUsersDetailsRef = THREADS_REF.child(threadID).child('usersDetails');
    const tasks = [];
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(user.uid);
      const member = { uid: user.uid };
      const memberDetails = FirebaseDatabase.mGetUserMetaData(user);
      tasks.push(threadUsersRef.child(fbUserID).set(member));
      tasks.push(threadUsersDetailsRef.child(fbUserID).set(memberDetails));
    }
    return Promise.all(tasks);
  }

  /**
   * Remove list of Users from a thread
   * @param {string} threadID
   * @param {array of string} userIDs
   */
  static mRemoveUsersFromThread(threadID, userIDs) {
    const threadUsersRef = THREADS_REF.child(threadID).child('users');
    const tasks = [];
    for (let i = 0; i < userIDs.length; i += 1) {
      const userID = userIDs[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      tasks.push(threadUsersRef.child(fbUserID).remove());
    }
    return Promise.all(tasks);
  }

  /**
   * Update thread details props.
   * - The meta-data object will be spread to flatten props inside
   * - The thread's updateTime on `users/<user_id>/threads/<thread_id>`
   *  will also be updated by Cloud Functions
   * @param {string} threadID
   * @param {Object} thread (Object or Thread)
   * @returns true/false
   */
  static mUpdateThreadMetaData(threadID, thread) {
    const metaData = FirebaseDatabase.mGetThreadMetaData(thread);
    Object.keys(metaData).forEach((key) => {
      if (metaData[key] == null) {
        delete metaData[key];
      }
    });
    return new Promise((resolve, reject) => {
      THREADS_REF.child(threadID).update(
        {
          ...metaData,
        },
        (err) => {
          if (!err) {
            resolve(true);
          } else {
            reject(err);
          }
        },
      );
    });
  }

  /**
   * Filter-out only what is metadata from thread
   * - for example: not get users, type, isDeleted, etc
   *   these props will be updated through other functions
   * @param {string} thread
   */
  static mGetThreadMetaData(thread) {
    const metaData = {
      uid: thread.uid,
      title: thread.title,
      photoImage: thread.photoImage,
      backgroundImage: thread.backgroundImage,
    };
    return metaData;
  }

  /**
   * Add a message into a thread
   * -> Caller must check whether thread exists or not
   * @param {Message} message
   * @param {string} threadID
   * @returns a Promise contains messageID or null
   */
  static mAddMessageToThread(threadID, message) {
    return new Promise((resolve, reject) => {
      // push new item
      const threadMessagesRef = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
      const messageRef = threadMessagesRef.push({});
      if (!messageRef) {
        resolve(null);
        return;
      }
      // set message
      const messageID = messageRef.key;
      // set createTime, updateTime if have
      const createTime = firebase.database.ServerValue.TIMESTAMP;
      const updateTime = firebase.database.ServerValue.TIMESTAMP;
      // ---
      messageRef.set(
        {
          ...message,
          uid: messageID,
          threadID,
          createTime,
          updateTime,
          isDeleted: false,
          type_createTime: `${message.type}_${new Date().getTime()}`,
        },
        (err) => {
          if (!err) {
            resolve(messageID);
          } else {
            reject(err);
          }
        },
      );
    });
  }

  /**
   * Remove a message in a thread by change its props isDeleted to true
   * @param {string} messageID
   * @param {string} threadID
   * @returns a Promise contain true/false
   */
  static mRemoveMessageFromThread(messageID, threadID) {
    return new Promise((resolve, reject) => {
      const threadMessagesRef = THREADS_MESSAGES_REF.child(`${threadID}/messages/${messageID}`);
      if (!threadMessagesRef) {
        resolve(false);
        return;
      }
      threadMessagesRef.remove((err) => {
        if (!err) {
          resolve(true);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Check whether thread object is valid
   * @param {Thread} thread
   */
  static mIsThreadValid(thread) {
    // thread is null, false
    if (!thread || !thread.users) {
      return false;
    }
    // get total users
    const totalUsers = Object.keys(thread.users).length;
    // single thread must have 2 users
    if (thread.type === THREAD_TYPES.SINGLE && totalUsers === 2) {
      return true;
    }
    // group threads must have more than 1 user
    if (thread.type === THREAD_TYPES.GROUP && totalUsers > 0) {
      return true;
    }
    // others is false
    return false;
  }

  // --------------------------------------------------
  // Methods - Public API
  // --------------------------------------------------

  static getDatabase() {
    return DATABASE;
  }

  static getConnectedRef() {
    return CONNECTED_REF;
  }

  static getChatRef() {
    return CHAT_REF;
  }

  static getUsersRef() {
    return USERS_REF;
  }

  static getUsersThreadsRef() {
    return USERS_THREADS_REF;
  }

  static getUsersPresenceRef() {
    return USERS_PRESENCE_REF;
  }

  static getThreadsRef() {
    return THREADS_REF;
  }

  static getThreadsPublicRef() {
    return THREADS_PUBLIC_REF;
  }

  static getThreadsMessagesRef() {
    return THREADS_MESSAGES_REF;
  }

  static getPhoneNumbersUserRef() {
    return PHONENUMBERS_USER_REF;
  }

  static getBlockedThreadRef() {
    return USERS_BLOCK_THREAD_REF;
  }

  static getNotiUserThreadRef() {
    return NOTI_USER_THREAD_REF;
  }

  static getThreadsTypingRef() {
    return THREADS_TYPING_REF;
  }

  static getUserContactsRef() {
    return USERS_CONTACTS_REF;
  }

  static getVoipRef() {
    return VOIP;
  }

  static getVoipUserTokensRef() {
    return VOIP_USER_TOKEN;
  }

  /**
   * UserID use in firebase to make sure firebase always threat users as object/dict, not array
   * @param {string} userID
   */
  static firebaseUserID(userID) {
    return `user_${userID}`;
  }

  static async firebaseToken() {
    const token = await firebase.auth().currentUser.getIdToken();
    return token;
  }

  /**
   * Convert from firebase userID to normal
   * @param {string} fbUserID
   */
  static normalUserID(fbUserID) {
    if (fbUserID && fbUserID.length > 5) {
      return fbUserID.slice(5);
    }
    return fbUserID;
  }

  // CONTACTS
  // --------------------------------------------------

  /**
   * Get a User base on userID
   * @param {string} userID
   * @returns nullable User object
   */
  static async getUser(userID) {
    try {
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const user = await USERS_REF.child(fbUserID).once('value');
      if (user && user.exists()) {
        return user.val();
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get a User presence base on userID
   * @param {string} userID
   * @returns nullable User object
   */
  static async getUserPresence(userID) {
    try {
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const user = await USERS_PRESENCE_REF.child(fbUserID).once('value');
      if (user && user.exists()) {
        return user.val();
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Update user metadata
   * @param {string} userID
   * @param {User} user
   * @returns true/false
   */
  static async updateUserMetadata(userID, user) {
    try {
      const result = await FirebaseDatabase.mUpdateUserMetadata(userID, user);
      return result;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get user's threads
   * @returns array of threadIDs
   */
  static async mGetThreadIDsOfUser(userID, fromUpdateTime = null, maxThreads = 10) {
    try {
      // create a query
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      let query = USERS_THREADS_REF.child(`${fbUserID}/threads`);

      if (fromUpdateTime) {
        query = query.orderByChild('updateTime').endAt(fromUpdateTime).limitToLast(maxThreads);
      } else {
        query = query.orderByChild('updateTime').limitToLast(maxThreads);
      }
      // fetch & convert key (aka threadID) to array
      const results = await query.once('value');
      const threadsObject = results && results.exists() ? results.val() : {};
      let keys = Object.keys(threadsObject);

      if (fromUpdateTime === null) {
        const queryFavorite = USERS_THREADS_REF.child(`${fbUserID}/threads`)
          .orderByChild('isFavorite')
          .equalTo(true);
        const favoriteResults = await queryFavorite.once('value');
        const favoriteThreadsObject =
          favoriteResults && favoriteResults.exists() ? favoriteResults.val() : {};
        if (favoriteThreadsObject) {
          keys = keys.concat(Object.keys(favoriteThreadsObject));
        }
      }

      return [...new Set(keys)];
    } catch (err) {
      return [];
    }
  }

  /**
   * Get threads from threadIDs
   * @returns array of thread json
   */
  static async mGetThreadsFromThreadIDs(threadIDs) {
    try {
      const threadsArray = [];
      const tasks = [];
      for (let i = 0; i < threadIDs.length; i += 1) {
        const threadID = threadIDs[i];
        tasks.push(
          FirebaseDatabase.getThread(threadID).then((thread) => {
            if (FirebaseDatabase.mIsThreadValid(thread)) {
              threadsArray.push(thread);
            }
          }),
        );
      }
      await Promise.all(tasks);
      return threadsArray;
    } catch (err) {
      return [];
    }
  }

  // CHAT
  // --------------------------------------------------

  /**
   * For single thread, threadID has format: `single_user1UID_user2UID`
   * where user1UID < user2UID
   */
  static generateSingleThreadID(userID1, userID2) {
    const uid1 = parseInt(userID1, 10);
    const uid2 = parseInt(userID2, 10);
    if (uid1 < 0 || uid2 < 0 || uid1 === uid2) {
      return null;
    } else if (uid1 < uid2) {
      return `single_${uid1}_${uid2}`;
    } else if (uid1 > uid2) {
      return `single_${uid2}_${uid1}`;
    }
    return null;
  }

  /**
   * Get Thread object from firebase base on threadID
   * @param {string} threadID
   * @returns nullable Thread object
   */
  static async getThread(threadID) {
    try {
      const thread = await THREADS_REF.child(threadID).once('value');
      if (thread && thread.exists()) {
        return thread.val();
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get user's threads base on userID
   * @param {string} userID
   * @param {timestamp} fromUpdateTime
   * @returns array of Thread, order desc by updateTime, 1st one is the newest
   */
  static async getThreadsOfUser(userID, fromUpdateTime = null, maxThreads = 10) {
    try {
      // get user's threadIDs
      const threadIDs = await FirebaseDatabase.mGetThreadIDsOfUser(
        userID,
        fromUpdateTime,
        maxThreads,
      );
      // get thread from threadIDs
      const threads = await FirebaseDatabase.mGetThreadsFromThreadIDs(threadIDs);
      // // sort desc updateTime
      // threads.sort((thread1, thread2) => {
      //   return thread2.updateTime - thread1.updateTime;
      // });
      // --
      return threads;
    } catch (err) {
      return [];
    }
  }

  /**
   * Get Message object in a Thread from firebase base on messageID
   * @param {string} threadID
   * @param {string} messageID
   * @returns nullable Message object
   */
  static async getMessageInThread(threadID, messageID) {
    try {
      const message = await THREADS_MESSAGES_REF.child(threadID)
        .child(`messages/${messageID}`)
        .once('value');
      if (message && message.exists()) {
        return message.val();
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get last Message object in a Thread
   * @param {string} threadID
   * @returns nullable Message object
   */
  static async getLastMessageInThread(threadID) {
    try {
      const message = await THREADS_MESSAGES_REF.child(`${threadID}/messages`)
        .orderByChild('createTime')
        .limitToLast(1)
        .once('value');
      if (message && message.exists()) {
        return message.val();
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get messages in thread
   * - where message.createTime < fromCreateTime (or now if fromCreateTime = null)
   * - order desc by createTime, 1st message is the newest
   */
  static async getMessagesInThread(threadID, fromCreateTime = null, maxMessages = 256) {
    // const logParams = [threadID, fromCreateTime, maxMessages];
    // Utils.warn(`${LOG_TAG}: getMessagesInThread: `, ...logParams);
    try {
      // fetch
      let query = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
      if (fromCreateTime) {
        query = query.orderByChild('createTime').endAt(fromCreateTime).limitToLast(maxMessages);
      } else {
        query = query.orderByChild('createTime').limitToLast(maxMessages);
      }
      const messages = await query.once('value');
      // convert to array
      if (messages && messages.exists()) {
        const messagesObj = messages.val();
        return Object.values(messagesObj);
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  static async getImageMessagesInThread(threadID, maxMessages = 256) {
    try {
      // fetch
      let query = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
      query = query.orderByChild('type').equalTo(MESSAGE_TYPES.IMAGES).limitToLast(maxMessages);
      const messages = await query.once('value');
      // convert to array
      if (messages && messages.exists()) {
        const messagesObj = messages.val();
        return Object.values(messagesObj).sort((mess1, mess2) => {
          return mess2.createTime - mess1.createTime;
        });
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  static async getVideoMessagesInThread(threadID, maxMessages = 256) {
    try {
      // fetch
      let query = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
      query = query.orderByChild('type').equalTo(MESSAGE_TYPES.VIDEOS).limitToLast(maxMessages);
      const messages = await query.once('value');
      // convert to array
      if (messages && messages.exists()) {
        const messagesObj = messages.val();
        return Object.values(messagesObj).sort((mess1, mess2) => {
          return mess2.createTime - mess1.createTime;
        });
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  // static async getImageMessagesInThread(threadID, maxMessages = 256) {
  //   try {
  //     // fetch
  //     let query = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
  //     query = query
  //       .orderByChild('type_createTime')
  //       .startAt('images_0')
  //       .endAt(`images_${(new Date()).getTime()}`)
  //       .limitToLast(maxMessages);
  //     const messages = await query.once('value');
  //     // convert to array
  //     if (messages && messages.exists()) {
  //       const messagesObj = messages.val();
  //       return Object.values(messagesObj).sort((mess1, mess2) => {
  //         return mess1.type_createTime < mess2.type_createTime;
  //       });
  //     }
  //     return [];
  //   } catch (err) {
  //     return [];
  //   }
  // }

  static async getMessagesInThreadToID(threadID, messageID, toCreateTime) {
    // const logParams = [threadID, fromCreateTime, maxMessages];
    // Utils.warn(`${LOG_TAG}: getMessagesInThread: `, ...logParams);
    try {
      const messRef = THREADS_MESSAGES_REF.child(`${threadID}/messages/${messageID}/createTime`);
      let createdTime = await messRef.once('value');
      if (createdTime && createdTime.exists()) {
        createdTime = createdTime.val();

        let query = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
        query = query
          .orderByChild('createTime')
          .startAt(createdTime - 1)
          .endAt(toCreateTime);

        // fetch
        const messages = await query.once('value');
        // convert to array
        if (messages && messages.exists()) {
          const messagesObj = messages.val();
          return Object.values(messagesObj);
        }
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  /**
   * Get update messages in thread
   * - where message.updateTime > fromUpdateTime (or 0 if fromUpdateTime = null)
   * - order desc by createTime, 1st message is the newest
   */
  static async getUpdateMessagesInThread(threadID, fromUpdateTime = 0, maxMessages = 256) {
    // const logParams = [threadID, fromUpdateTime, maxMessages];
    // Utils.warn(`${LOG_TAG}: getUpdateMessagesInThread: `, ...logParams);
    try {
      // fetch
      let query = THREADS_MESSAGES_REF.child(`${threadID}/messages`);
      if (fromUpdateTime) {
        query = query.orderByChild('updateTime').startAt(fromUpdateTime).limitToLast(maxMessages);
      } else {
        query = query.orderByChild('updateTime').limitToLast(maxMessages);
      }
      const messages = await query.once('value');
      // convert to array
      if (messages && messages.exists()) {
        const messagesObj = messages.val();
        return Object.values(messagesObj);
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  static async getRemoteContacts() {
    try {
      const currentUser = firebase.auth().currentUser;
      const contactListRef = USERS_CONTACTS_REF.child(`user_${currentUser.uid}/phones`);
      const contacts = await contactListRef.once('value');
      if (contacts.exists()) {
        return contacts.val();
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  /**
   * Create single thread for conversation between user1 & user2
   * If thread already created, return that thread
   * @param {User} user1
   * @param {User} user2
   * @return nullable Thread object
   */
  static async createSingleThread(user1, user2) {
    try {
      // get threadID
      const threadID = FirebaseDatabase.generateSingleThreadID(user1.uid, user2.uid);
      if (!threadID) {
        return null;
      }
      // return thread if it's already exists
      const thread = await FirebaseDatabase.getThread(threadID);
      if (thread && thread.uid && thread.uid.length > 0) {
        return thread;
      }
      // create new thread
      const result = await FirebaseDatabase.mAddSingleThread(user1, user2);
      if (!result) {
        return null;
      }
      // add thread to user1 & user2
      await FirebaseDatabase.mAddThreadIDsToUser(user1.uid, [threadID]);
      await FirebaseDatabase.mAddThreadIDsToUser(user2.uid, [threadID]);
      // return new thread
      const newThread = await FirebaseDatabase.getThread(threadID);
      return newThread;
    } catch (err) {
      return null;
    }
  }

  /**
   * Create group thread for conversation for many users
   * @param {User} users
   * @param {Object} metaData: { title, photoImage, backgroundImage, ... }
   * @returns nullable Thread object
   */
  static async createGroupThread(users, metaData) {
    try {
      // create new thread
      const threadID = await FirebaseDatabase.mAddGroupThread(users, metaData);
      // add thread to users
      const tasks = [];
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        tasks.push(FirebaseDatabase.mAddThreadIDsToUser(user.uid, [threadID]));
      }
      await Promise.all(tasks);
      // return new thread
      const newThread = await FirebaseDatabase.getThread(threadID);
      return newThread;
    } catch (err) {
      return null;
    }
  }

  /**
   * Add list of users to a thread
   * @param {User} users
   * @param {string} threadID
   * @returns true/false
   */
  static async addUsersToGroupThread(threadID, users) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        return false;
      }
      // add users to thread
      await FirebaseDatabase.mAddUsersToThread(threadID, users);
      // add threadID to each user
      const tasks = [];
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        tasks.push(FirebaseDatabase.mAddThreadIDsToUser(user.uid, [threadID]));
      }
      await Promise.all(tasks);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Remove list of users from a thread
   * @param {array of string} userIDs
   * @param {string} threadID
   */
  static async removeUsersFromGroupThread(threadID, userIDs) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        return false;
      }
      // remove users from thread
      await FirebaseDatabase.mRemoveUsersFromThread(threadID, userIDs);
      // remove threadID from user
      const tasks = [];
      for (let i = 0; i < userIDs.length; i += 1) {
        const userID = userIDs[i];
        tasks.push(FirebaseDatabase.mRemoveThreadIDsFromUser(userID, [threadID]));
      }
      await Promise.all(tasks);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Set a user to be admin of a thread
   * @param {string} threadID
   * @param {string} userID
   */
  static async setThreadAdmin(threadID, userID) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        return false;
      }
      // update admin
      return new Promise((resolve) => {
        const threadRef = THREADS_REF.child(`${threadID}`);
        threadRef.update(
          {
            adminID: userID,
          },
          (err) => {
            resolve(err === null);
          },
        );
      });
    } catch (err) {
      return false;
    }
  }

  /**
   * Update thread meta data
   * @param {string} metaData
   * @returns true/false
   */
  static async updateThreadMetadata(threadID, metaData) {
    try {
      // is thread exist?
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      // filter-out invalid metaData
      const threadMetadata = FirebaseDatabase.mGetThreadMetaData(metaData);
      // update
      await FirebaseDatabase.mUpdateThreadMetaData(threadID, threadMetadata);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async updateThreadUserData(threadID, user) {
    try {
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      const fbUserID = FirebaseDatabase.firebaseUserID(user.uid);
      const userDetails = {};
      userDetails[fbUserID] = {
        uid: user.uid,
        fullName: user.fullName,
        avatarImage: user.avatarImage,
      };
      // add thread
      await THREADS_REF.child(threadID).child('usersDetails').update(userDetails);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Add a message to a Thread. Message can have many type
   * At this level, we don't care about Message structure
   * @param {Message} message
   * @param {string} threadID
   * @returns nullable Message object
   */
  static async sendMessage(message, threadID) {
    try {
      // add message to thread
      const messageID = await FirebaseDatabase.mAddMessageToThread(threadID, message);
      if (!messageID) {
        return null;
      }
      return messageID;
    } catch (err) {
      return null;
    }
  }

  /**
   * Update message in a thread
   */
  static async updateMessage(messageID, threadID, updates) {
    try {
      const messageRef = THREADS_MESSAGES_REF.child(`${threadID}/messages/${messageID}`);
      await messageRef.update(updates);
      // await messageRef.update({
      //   ...updates,
      //   updateTime: firebase.database.ServerValue.TIMESTAMP,
      // });
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Update the readTimes for userID to the current time
   * -> disable, user FirebaseFunctions instead
   * -> because set ServerValue.TIMESTAMP will cause two update events
   * @param {string} threadID
   * @param {string} userID
   * @returns true/false
   */
  // static async updateUserReadTimeInThread(threadID, userID) {
  //   try {
  //     const readTimesRef = THREADS_REF.child(`${threadID}/readTimes`);
  //     const fbUserID = FirebaseDatabase.firebaseUserID(userID);
  //     const data = {};
  //     data[fbUserID] = firebase.database.ServerValue.TIMESTAMP;
  //     await readTimesRef.update(data);
  //     return true;
  //   } catch (err) {
  //     Utils.warn(`${LOG_TAG}: updateUserReadTimeInThread exc: `, err);
  //     return false;
  //   }
  // }

  /**
   * Toggle user's thread favorite status
   * @param {string} userID
   * @param {string} threadID
   * @param {boolean} isFavorite
   */
  static async toggleUserFavoriteInThread(threadID, userID, isFavorite) {
    try {
      const isFavoritesRef = THREADS_REF.child(`${threadID}/isFavorites`);
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const data = {};
      data[fbUserID] = isFavorite;
      await isFavoritesRef.update(data);

      const userThreadsRef = USERS_THREADS_REF.child(`${fbUserID}/threads/${threadID}`);
      const dataUserThread = { isFavorite };
      await userThreadsRef.update(dataUserThread);

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Toggle user's thread favorite status
   * @param {string} userID
   * @param {string} threadType
   * @param {boolean} isFavorite
   */
  static async toggleUserFavoriteInThreadSystem(threadType, userID, isFavorite) {
    try {
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const isFavoritesRef = NOTI_USER_THREAD_REF.child(`${fbUserID}/${threadType}`);
      const data = {};
      data.isFavorite = isFavorite;
      await isFavoritesRef.set(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {string} threadID
   * @param {string} userID
   * @param {boolean} isOn
   * @returns true/false
   */
  static async toggleUserNotificationOnInThread(threadID, userID, isOn) {
    try {
      const ref = THREADS_REF.child(`${threadID}/isNotificationOns`);
      const data = {};
      data[`user_${userID}`] = isOn;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {string} threadID
   * @param {string} userID
   * @returns true/false
   */
  static async deleteThreadChat(threadID, userID) {
    try {
      const isDeletedByUsersRef = THREADS_REF.child(`${threadID}/isDeletedByUsers`);
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const data = {};
      data[fbUserID] = true;
      await isDeletedByUsersRef.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {string} threadID
   * @returns true/false
   */
  static async unDeleteThreadChat(threadID) {
    try {
      const isDeletedByUsersRef = THREADS_REF.child(`${threadID}/isDeletedByUsers`);
      isDeletedByUsersRef.remove();
      return true;
    } catch (err) {
      return false;
    }
  }

  // Block

  static async checkBlocked(threadID) {
    try {
      const currentUser = firebase.auth().currentUser;
      const fbUserID = FirebaseDatabase.firebaseUserID(currentUser.uid);
      const blockedThread = await USERS_BLOCK_THREAD_REF.child(fbUserID)
        .child(threadID)
        .once('value');
      if (blockedThread.val() !== null) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  static async checkBeBlocked(threadID) {
    try {
      const currentUser = firebase.auth().currentUser;
      const fbUserID = FirebaseDatabase.firebaseUserID(currentUser.uid);
      const blockedThread = await USERS_BLOCK_BY_REF.child(fbUserID).child(threadID).once('value');
      if (blockedThread.val() !== null) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  static async block(userID) {
    try {
      const currentUser = firebase.auth().currentUser;
      const fbUserID = FirebaseDatabase.firebaseUserID(currentUser.uid);
      const ref = USERS_BLOCK_REF.child(fbUserID);
      const data = {};
      data[`user_${userID}`] = true;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async unblock(userID) {
    try {
      const currentUser = firebase.auth().currentUser;
      const fbUserID = FirebaseDatabase.firebaseUserID(currentUser.uid);
      await USERS_BLOCK_REF.child(fbUserID).child(`user_${userID}`).remove();
      return true;
    } catch (err) {
      return false;
    }
  }

  static async getThreadSystemStatus() {
    try {
      const currentUser = firebase.auth().currentUser;
      const fbUserID = FirebaseDatabase.firebaseUserID(currentUser.uid);
      const threadRef = FirebaseDatabase.getNotiUserThreadRef();
      // subscribe
      const threadJSON = await threadRef.child(`${fbUserID}`).once('value');
      return threadJSON.val();
    } catch (err) {
      return {};
    }
  }

  static async deleteMess(message) {
    try {
      const ref = THREADS_MESSAGES_REF.child(`${message.threadID}/messages/${message.uid}`);
      const data = {};
      const currentUser = firebase.auth().currentUser;
      data[`isDeletedBy/user_${currentUser.uid}`] = true;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async recallMess(message) {
    try {
      const ref = THREADS_MESSAGES_REF.child(`${message.threadID}/messages/${message.uid}`);
      const data = {};
      data.isRecalled = true;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async editMess(message, text) {
    try {
      const ref = THREADS_MESSAGES_REF.child(`${message.threadID}/messages/${message.uid}`);
      const data = {};
      data.text = text;
      data.updateTime = firebase.database.ServerValue.TIMESTAMP;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async reaction(reaction, message) {
    try {
      const ref = THREADS_MESSAGES_REF.child(`${message.threadID}/messages/${message.uid}`);
      const data = {};
      const currentUser = firebase.auth().currentUser;
      data[`reaction/user_${currentUser.uid}`] = reaction;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async isReceived(messages) {
    try {
      const currentUser = firebase.auth().currentUser;
      if (messages.length > 0 && messages[0].authorID !== currentUser.uid) {
        const ref = THREADS_MESSAGES_REF.child(`${messages[0].threadID}/messages/`);
        const data = {};
        for (let i = 0; i < messages.length; i += 1) {
          const message = messages[i];
          if (!message.isReceivedByMe()) {
            data[`${message.uid}/isReceivedBy/user_${currentUser.uid}`] = true;
          }
        }

        await ref.update(data);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  static async typingInThread(typing, threadID) {
    try {
      const ref = THREADS_TYPING_REF.child(`${threadID}`);
      const data = {};
      const currentUser = firebase.auth().currentUser;
      data[`typing/user_${currentUser.uid}`] = typing;
      if (typing) {
        data[`updateTime/user_${currentUser.uid}`] = new Date().getTime();
      }
      data.uid = threadID;
      await ref.update(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async pinMessage(text, threadID) {
    try {
      const threadRef = THREADS_REF.child(`${threadID}`);
      if (!text || text === '') {
        await threadRef.update({ pinnedText: '' });
      } else {
        await threadRef.update({ pinnedText: text });
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  static async updateUserContactList(phoneNumberList = []) {
    try {
      const currentUser = firebase.auth().currentUser;
      const contactListRef = USERS_CONTACTS_REF.child(`user_${currentUser.uid}`);
      if (phoneNumberList) {
        await contactListRef.update({ phones: phoneNumberList });
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  static async addVoipToken(token) {
    try {
      const currentUser = firebase.auth().currentUser;
      const tokenRef = VOIP_USER_TOKEN.child(`user_${currentUser.uid}`);
      if (token) {
        const newToken = {};
        newToken[token] = true;
        await tokenRef.update(newToken);
      }
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Add list of Users to a thread
   * @param {string} threadID
   * @param {array of User} users
   * @returns Promise contain true/false
   */
  static mAddPasswordToThread(threadID, password) {
    const threadPasswordRef = THREADS_REF.child(threadID).child('password');
    return threadPasswordRef.set(password);
  }

  /**
   * Add password
   * @param {string} password
   * @param {string} threadID
   * @returns true/false
   */
  static async setPasswordToGroupThread(threadID, password) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        return false;
      }
      // add users to thread
      await FirebaseDatabase.mAddPasswordToThread(threadID, password);
      return true;
    } catch (err) {
      return false;
    }
  }

  // static async removeVoipToken(token) {
  //   try {
  //     const currentUser = firebase.auth().currentUser;
  //     const tokenRef = VOIP_USER_TOKEN.child(`user_${currentUser.uid}`);
  //     if (token) {
  //       const newToken = {};
  //       newToken[token] = false;
  //       await tokenRef.update(newToken);
  //     }
  //     return true;
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }
}

export default FirebaseDatabase;
