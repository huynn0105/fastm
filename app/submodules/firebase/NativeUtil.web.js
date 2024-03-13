import firebase from 'firebase';
import store from '../../redux/store/store';
import DatabaseManager from '../../manager/DatabaseManager';
import { FIREBASE_CONFIG } from './config';

export { firebase };

firebase.initializeApp(FIREBASE_CONFIG);


class NativeUtil {
  getImageSize = (source, callback) => {
    const img = new Image();
    img.onload = function () {
      callback(this.width, this.height);
    };
    img.src = source;
  }

  createResizedImage = (fileURI, maxWidth, maxHeight, quality) => {
    return Promise.resolve(fileURI);
  }

  // - - - - - - - - - - - - - - - - - -
  // Local Database
  databaseManager = {

    getThread: (threadID) => {
      return DatabaseManager.getThread(threadID);
    },

    createObject: (objectName, object) => {
      return DatabaseManager.createObject(objectName, object);
    },

    createObjects: (objectName, objectList) => {
      return DatabaseManager.createObjects(objectName, objectList);
    },

    deleteObject: (objectName, object) => {
      return DatabaseManager.deleteObject(objectName, object);
    },

    getObject: (objectName, objectID) => {
      return DatabaseManager.getObject(objectName, objectID);
    },

    getMessage: (message) => {
      return DatabaseManager.getMessage(message);
    },

    getImagesMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return DatabaseManager.getImagesMessagesInThread(threadID, fromCreateTime, maxNumMessages);
    },

    countMessagesInThread: (threadID, fromCreateTime) => {
      return DatabaseManager.countMessagesInThread(threadID, fromCreateTime);
    },

    getMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return DatabaseManager.getMessagesInThread(threadID, fromCreateTime, maxNumMessages);
    },

    getLastMessageInThread: (threadID) => {
      return DatabaseManager.getLastMessageInThread(threadID);
    },

    getAllThreads: () => {
      return DatabaseManager.getAllThreads();
    },

    getAllFavoritedThreads: () => {
      return DatabaseManager.getAllFavoritedThreads();
    },

    deleteAllThreads: () => {
      return DatabaseManager.deleteAllThreads();
    },
  }

  // - - - - - - - - - - - - - - - - - -

  getStore = () => {
    return store;
  }

  getDeviceUDID = () => {
    return 'web';
  }

  loadImage = () => {

  }
}

export default NativeUtil;
