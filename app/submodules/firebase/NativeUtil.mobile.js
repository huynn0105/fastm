import { Image } from 'react-native';
import store from '../../redux/store/store';
import DatabaseManager from '../../manager/DatabaseManager';
import { getDeviceUDID } from '../../utils/Utils';
import ImageUtils from '../../utils/ImageUtils';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/storage';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/messaging';
import '@react-native-firebase/analytics';

export { firebase };

class NativeUtil {
  getImageSize = (source, callback) => {
    Image.getSize(source, (w, h) => {
      if (callback) {
        callback(w, h);
      }
    });
  };

  // - - - - - - - - - - - - - - - - - -
  // Local Database
  databaseManager = {
    getThread: (threadID, isIncludeDeleted) => {
      return DatabaseManager.shared().getThread(threadID, isIncludeDeleted);
    },

    createObject: (objectName, object) => {
      return DatabaseManager.shared().createObject(objectName, object);
    },

    createObjects: (objectName, objectList) => {
      return DatabaseManager.shared().createObjects(objectName, objectList);
    },

    deleteObject: (objectName, object) => {
      return DatabaseManager.shared().deleteObject(objectName, object);
    },

    getObject: (objectName, objectID) => {
      return DatabaseManager.shared().getObject(objectName, objectID);
    },

    getMessage: (message) => {
      return DatabaseManager.shared().getMessage(message);
    },

    getImagesMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return DatabaseManager.shared().getImagesMessagesInThread(
        threadID,
        fromCreateTime,
        maxNumMessages,
      );
    },

    getVideosMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return DatabaseManager.shared().getVideosMessagesInThread(
        threadID,
        fromCreateTime,
        maxNumMessages,
      );
    },

    countMessagesInThread: (threadID, fromCreateTime) => {
      return DatabaseManager.shared().countMessagesInThread(threadID, fromCreateTime);
    },

    getMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return DatabaseManager.shared().getMessagesInThread(threadID, fromCreateTime, maxNumMessages);
    },

    getLastMessageInThread: (threadID) => {
      return DatabaseManager.shared().getLastMessageInThread(threadID);
    },

    getAllThreads: () => {
      return DatabaseManager.shared().getAllThreads();
    },

    getAllFavoritedThreads: () => {
      return DatabaseManager.shared().getAllFavoritedThreads();
    },

    deleteAllThreads: () => {
      return DatabaseManager.shared().deleteAllThreads();
    },

    countUnReadMessagesInThread: (threadID) => {
      return DatabaseManager.shared().countUnReadMessagesInThread(threadID);
    },
  };

  // - - - - - - - - - - - - - - - - - -

  getStore = () => {
    return store;
  };

  getDeviceUDID = () => {
    return getDeviceUDID();
  };

  createResizedImage = (fileURI, maxWidth, maxHeight, quality = 100) => {
    return ImageUtils.createResizedImage(fileURI, maxWidth, maxHeight, quality);
  };
}

export default NativeUtil;
