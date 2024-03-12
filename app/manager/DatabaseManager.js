/*
  Documents:
    https://realm.io/docs/javascript/latest/
    https://realm.io/docs/javascript/latest/api/index.html

  - This class should only be used through actions because this is lower level
  - Directly use this class can cause loop import if the class is using also import actions
*/

// --------------------------------------------------
/* eslint-disable */
import Utils from 'app/utils/Utils';
// import Realm from 'realm';
import { Knowledge, News, SystemThread, User } from '../models';
import { Message, Notification, Thread } from '../submodules/firebase/model';
import { MESSAGE_TYPES } from '../submodules/firebase/model/Message';

const Realm = null;

const LOG_TAG = 'DatabaseManager.js';
/* eslint-enable */

// --------------------------------------------------

const SCHEMA_VERSION = 1;

function initDatabaseManager() {
  // PRIVATE
  // --------------------------------------------------
  let realm = null;
  let isOpened = false;
  let shouldOpenAgain = true;

  // open realm database
  // incase of migrating fail because db schema change,
  // just wipeout the whole db & open again
  // -> return a Promise
  function openDatabase() {
    Utils.log(`${LOG_TAG}: openDatabase:`);
    const configs = {
      schema: [User, News, Knowledge, Notification, Thread, Message, SystemThread],
      schemaVersion: SCHEMA_VERSION,
      deleteRealmIfMigrationNeeded: false,
    };
    try {
      return Realm.open(configs)
        .then((realmDB) => {
          Utils.log(`${LOG_TAG}: open db success`);
          realm = realmDB;
          isOpened = true;
          return true;
        })
        .catch((err) => {
          return handleOpenDatabaseException(err);
        });
    } catch (err) {
      return handleOpenDatabaseException(err);
    }
  }

  function handleOpenDatabaseException(err) {
    // 1. check should open again?
    Utils.warn(`${LOG_TAG}: open db error: ${err}`);
    Utils.warn(`${LOG_TAG}: should open again: ${shouldOpenAgain}`);
    if (!shouldOpenAgain) {
      return Promise.reject(new Error('OPEN DB ERROR'));
    }
    shouldOpenAgain = false;
    // 2. try to delete old db
    if (!deleteDatabase()) {
      return Promise.reject(new Error('OPEN DB ERROR'));
    }
    // 3. open again with new db
    return openDatabase();
  }

  // delete default database
  function deleteDatabase() {
    try {
      const deleteConfigs = {
        path: Realm.defaultPath,
        schemaVersion: SCHEMA_VERSION,
      };
      Realm.deleteFile(deleteConfigs);
      Utils.warn(`${LOG_TAG}.deleteDatabase success`);
      return true;
    } catch (err) {
      Utils.warn(`${LOG_TAG}.deleteDatabase err:`, err);
      return false;
    }
  }

  // clear all records in database
  function clearDatabase() {
    try {
      realm.write(() => {
        realm.deleteAll();
      });
      // realm.close();
      return true;
    } catch (error) {
      Utils.warn(`${LOG_TAG}: clearDatabase error: `, error);
      return false;
    }
  }

  // PUBLIC
  // --------------------------------------------------
  return {
    realm() {
      return realm;
    },
    initDatabase() {
      if (isOpened) {
        Utils.log(`${LOG_TAG}: initDatabase: already init -> return`);
        return Promise.resolve(true);
      }
      return openDatabase();
    },
    deinitDatabase() {
      if (!isOpened) {
        Utils.log(`${LOG_TAG}: deinitDatabase: already de-init -> return`);
        return Promise.resolve(true);
      }
      return new Promise((resolve, reject) => {
        if (clearDatabase()) {
          // isOpened = false;
          // shouldOpenAgain = true;
          resolve(true);
        } else {
          reject(new Error('DELETE DB ERROR'));
        }
      });
    },
    doDeleteDatabase() {
      return deleteDatabase();
    },
    doClearDatabase() {
      return clearDatabase();
    },

    checkValidAccess() {
      return isOpened && realm;
    },
    // --------------------------------------------------
    getObject(name, dbUID) {
      if (!this.checkValidAccess()) {
        return null;
      }
      // ---
      return realm?.objectForPrimaryKey(name, dbUID);
    },
    createObject(name, object, isUpdate = true) {
      if (!this.checkValidAccess()) {
        return null;
      }
      // --
      try {
        let dbObject;
        realm.write(() => {
          dbObject = realm.create(name, object, isUpdate);
        });
        return dbObject;
      } catch (error) {
        Utils.warn(`${LOG_TAG}: createObject exc: `, error);
        return null;
      }
    },
    createObjects(name, objects, isUpdate = true) {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      try {
        const dbObjects = [];
        const convertObjects =
          name === 'Notification'
            ? objects?.map((object) => ({
                ...object,
                uid: JSON.stringify(object?.uid),
              }))
            : objects;
        realm.write(() => {
          for (let i = 0; i < convertObjects.length; i += 1) {
            const object = convertObjects[i];
            object.isDeleted = false;
            const dbObject = realm.create(name, object, isUpdate);
            dbObjects.push(dbObject);
          }
        });
        return dbObjects;
      } catch (error) {
        Utils.warn(`${LOG_TAG}: createObjects exc: `, error);
        return [];
      }
    },
    deleteObject(name, dbUID) {
      if (!this.checkValidAccess()) {
        return 0;
      }
      // --
      try {
        const object = realm?.objectForPrimaryKey(name, dbUID);
        realm.write(() => {
          object.isDeleted = true;
        });
        return 1;
      } catch (error) {
        Utils.warn(`${LOG_TAG}: deleteObject exc: `, error);
        return 0;
      }
    },
    deleteObjects(name, filter = null) {
      if (!this.checkValidAccess()) {
        return 0;
      }
      // --
      try {
        // get all objects
        let objects = realm?.objects(name);
        // filter if needed
        if (filter) {
          objects = objects.filtered(filter);
        }
        // delete
        realm.write(() => {
          for (let i = 0; i < objects.length; i += 1) {
            const item = objects[i];
            item.isDeleted = true;
          }
        });
        return objects.length;
      } catch (err) {
        Utils.warn(`${LOG_TAG}: deleteAllObjects err: ${err}`, err);
        return 0;
      }
    },
    deleteAllObjects(name) {
      return this.deleteObjects(name);
    },
    // USER
    // --------------------------------------------------
    toggleContactFavorite(contactID, isFavorite) {
      if (!this.checkValidAccess()) {
        return false;
      }
      if (realm?.objectForPrimaryKey('User', contactID) === undefined) return false;
      this.createObject('User', { dbUID: contactID, isFavorite });
      return true;
    },
    // NEWS
    // --------------------------------------------------
    findHighlightedNews() {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      const filter = `isHighlight = ${true} AND isDeleted = ${false}`;
      const results = realm?.objects('News').filtered(filter).sorted('sortPosition');
      return results.slice();
    },
    findRelatedNews(newsID, categoryID) {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      const filter = `categoryID = "${categoryID}" AND uid != "${newsID}"  AND isDeleted = ${false}`;
      const results = realm?.objects('News').filtered(filter);
      return results;
    },
    readNews(news) {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      // disable check so that totalViews can increase
      // if (news.isRead === true) return;
      if (realm?.objectForPrimaryKey('News', news.uid) === undefined) return;
      const currentView = parseInt(news.totalViews, 10);
      this.createObject('News', {
        uid: news.uid,
        isRead: true,
        totalViews: `${currentView ? currentView + 1 : ''}`,
      });
    },
    readAllNewsInCategory(categoryID) {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      // convert results to normal array since results can be change while updating isRead
      const results = realm
        ?.objects('News')
        .filtered(`categoryID = "${categoryID}"  AND isDeleted = ${false}`);
      const items = results.slice();
      try {
        for (let i = 0; i < items.length; i += 1) {
          realm.write(() => {
            items[i].isRead = true;
          });
        }
      } catch (error) {
        Utils.warn(`${LOG_TAG}: readAllNewsInCategory exception: `, error);
      }
    },
    countUnReadNewsInCategory(categoryID) {
      if (!this.checkValidAccess()) {
        return 0;
      }
      // --
      const filter = `categoryID = "${categoryID}" AND isRead = ${false}  AND isDeleted = ${false}`;
      const results = realm?.objects('News').filtered(filter);
      return results.length;
    },
    deleteAllNews() {
      return this.deleteAllObjects('News');
    },
    // KNOWLEDGE
    // --------------------------------------------------
    findHighlightedKnowledges() {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      const filter = `isHighlight = ${true} AND isDeleted = ${false}`;
      const results = realm?.objects('Knowledge').filtered(filter).sorted('sortPosition');
      return results.slice();
    },
    readKnowledge(knowledge) {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      if (knowledge.isRead === true) return;
      if (realm?.objectForPrimaryKey('Knowledge', knowledge.uid) === undefined) return;
      this.createObject('Knowledge', { uid: knowledge.uid, isRead: true });
    },
    readAllKnowledges() {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      // convert results to normal array since results can be change while updating isRead
      const results = realm
        ?.objects('Knowledge')
        .filtered(`isRead = ${false} AND isDeleted = ${false}`);
      const items = results.slice();
      try {
        for (let i = 0; i < items.length; i += 1) {
          realm.write(() => {
            items[i].isRead = true;
          });
        }
      } catch (error) {
        Utils.warn(`${LOG_TAG}: readAllKnowledges exception: `, error);
      }
    },
    countUnReadKnowledges() {
      if (!this.checkValidAccess()) {
        return 0;
      }
      // --
      const filter = `isRead = ${false} AND isDeleted = ${false}`;
      const results = realm?.objects('Knowledge').filtered(filter);
      return results.length;
    },
    deleteAllKnowledges() {
      return this.deleteAllObjects('Knowledge');
    },
    // NOTIFICATION
    // --------------------------------------------------
    countUnReadNotifications(category) {
      if (!this.checkValidAccess()) {
        return 0;
      }
      // --
      if (!category) {
        Utils.warn('countUnReadNotifications: missing category');
        return 0;
      }
      const filter = `isRead = ${false} AND category = "${category}" AND isDeleted = ${false}`;
      const results = realm?.objects('Notification').filtered(filter);
      return results.length;
    },
    readNotification(noti) {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      if (noti.isRead === true) return;
      if (noti.uid === undefined || noti.uid === null) return;
      if (realm?.objectForPrimaryKey('Notification', noti.uid) === undefined) return;
      this.createObject('Notification', { uid: noti.uid, isRead: true });
    },
    readNotificationFb(noti) {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      if (noti.read === true) return;
      if (noti.uid === undefined || noti.uid === null) return;
      if (realm?.objectForPrimaryKey('Notification', noti.uid) === undefined) return;
      this.createObject('Notification', { uid: noti.uid, read: true });
    },
    readAllNotifications(category) {
      if (!this.checkValidAccess()) {
        return;
      }
      // --
      if (!category) {
        Utils.warn('readAllNotifications: missing category');
        return;
      }
      // convert results from realm results to normal array
      // since results can be change while updating isRead
      const results = realm
        ?.objects('Notification')
        .filtered(`isRead = ${false} AND isDeleted = ${false}`)
        .slice();
      const items = results.slice();
      try {
        for (let i = 0; i < items.length; i += 1) {
          realm.write(() => {
            items[i].isRead = true;
          });
        }
      } catch (error) {
        Utils.warn(`${LOG_TAG}: readAllNotifications exception: `, error);
      }
    },
    deleteAllNotifications(category) {
      return this.deleteObjects('Notification', `category = "${category}"`);
    },
    deleteAllNotificationsFull() {
      return this.deleteObjects('Notification');
    },
    // THREAD
    // --------------------------------------------------
    getAllThreads() {
      if (!this.checkValidAccess()) {
        return [];
      }
      return (
        realm?.objects('Thread')?.filtered(`isDeleted = ${false}`)?.sorted('updateTime', true) || []
      );
    },
    getAllFavoritedThreads() {
      if (!this.checkValidAccess()) {
        return [];
      }
      return (
        realm
          ?.objects('Thread')
          ?.filtered(`isDeleted = ${false} && isFavorite = ${true}`)
          ?.sorted('updateTime', true) || []
      );
    },
    getThread(threadID, isIncludeDeleted = false) {
      if (threadID) {
        const thread = realm?.objectForPrimaryKey('Thread', threadID);
        if (thread && (thread.isDeleted === false || isIncludeDeleted)) {
          return thread;
        }
      }
      return null;
    },
    deleteAllThreads() {
      return this.deleteAllObjects('Thread');
    },
    getSystemThread(threadID) {
      if (threadID) {
        const thread = realm?.objectForPrimaryKey('SystemThread', threadID);
        if (thread) {
          return thread;
        }
        return null;
      }
      return null;
    },
    updateThread(updateAction) {
      realm.write(() => {
        updateAction();
      });
    },
    // MESSAGE
    // --------------------------------------------------
    getLastMessageInThread(threadID) {
      if (!this.checkValidAccess()) {
        return null;
      }
      // --
      const results = realm
        ?.objects('Message')
        .filtered(`threadID = "${threadID}" && hide=false`)
        .sorted('createTime', true)
        .slice(0, 1);
      if (results.length > 0) {
        return results[0];
      }
      return null;
    },
    getLastUpdateMessageInThread(threadID) {
      if (!this.checkValidAccess()) {
        return null;
      }
      // --
      const results = realm
        ?.objects('Message')
        .filtered(`threadID = "${threadID}"`)
        .sorted('updateTime', true)
        .slice(0, 1);
      if (results.length > 0) {
        return results[0];
      }
      return null;
    },

    getMessage(message) {
      if (message.dbUID) {
        const messageDB = realm?.objectForPrimaryKey('Message', message.dbUID);
        return messageDB;
      }
      return null;
    },

    getMessagesInThread(threadID, fromCreateTime = null, max = 256) {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      let query = realm?.objects('Message');
      if (fromCreateTime) {
        query = query.filtered(`threadID = "${threadID}" AND createTime < ${fromCreateTime}`);
      } else {
        query = query.filtered(`threadID = "${threadID}"`);
      }
      query = query.sorted('createTime', true);
      return query.slice(0, max);
    },
    countMessagesInThread(threadID, fromCreateTime = null) {
      if (!this.checkValidAccess()) {
        return 0;
      }
      // --
      // count all messages has createTime < fromCreateTime
      const filter = `threadID = "${threadID}" AND createTime < ${fromCreateTime}`;
      const count = realm?.objects('Message').filtered(filter).length;
      return count;
    },
    countUnReadMessagesInThread(threadID) {
      try {
        if (!this.checkValidAccess()) {
          return 0;
        }
        // --
        // get my readTime
        const thread = realm?.objectForPrimaryKey('Thread', threadID);
        if (!thread) {
          return 0;
        }

        if (thread.isDeletedByMe) {
          return 0;
        }

        const readTimes = thread.readTimes;
        if (!readTimes) {
          return 0;
        }
        const myUserID = User.mMyUser.uid;
        let myUserReadTime = readTimes[`user_${myUserID}`];
        if (!myUserReadTime) {
          myUserReadTime = 0;
        }
        // count all messages has createTime > readTime
        const filter = `threadID = "${threadID}" AND createTime > ${myUserReadTime}`;
        const count = realm?.objects('Message').filtered(filter).length;
        return count;
      } catch (error) {
        return 0;
      }
    },
    getImagesMessagesInThread(threadID, fromCreateTime = null, max = 256) {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      let filter = `threadID = "${threadID}" AND type = "${MESSAGE_TYPES.IMAGES}"`;
      if (fromCreateTime) {
        filter = `${filter} AND createTime < ${fromCreateTime}`;
      }
      const query = realm?.objects('Message').filtered(filter).sorted('createTime', true);
      return query.slice(0, max);
    },

    getVideosMessagesInThread(threadID, fromCreateTime = null, max = 256) {
      if (!this.checkValidAccess()) {
        return [];
      }
      // --
      let filter = `threadID = "${threadID}" AND type = "${MESSAGE_TYPES.VIDEOS}"`;
      if (fromCreateTime) {
        filter = `${filter} AND createTime < ${fromCreateTime}`;
      }
      const query = realm?.objects('Message').filtered(filter).sorted('createTime', true);
      return query.slice(0, max);
    },

    getContacts() {
      if (!this.checkValidAccess()) {
        return [];
      }
      const filter = `isDeleted = ${false}`;
      const results = realm?.objects('User').filtered(filter);
      return results;
    },
  };
}

// --------------------------------------------------

function initSingletonDatabaseManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initDatabaseManager();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const DatabaseManager = initSingletonDatabaseManager();
export default DatabaseManager;
