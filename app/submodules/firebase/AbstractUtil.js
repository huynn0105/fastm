class AbstractUtil {
  constructor(nativeUtil) {
    this.native = nativeUtil;
  }

  getImageSize = (source, callback) => {
    this.native.getImageSize(source, callback);
  }

  // - - - - - - - - - - - - - - - - - -
  // Local Database
  databaseManager = {
    getThread: (threadID, isIncludeDeleted) => {
      return this.native.databaseManager.getThread(threadID, isIncludeDeleted);
    },

    createObject: (objectName, object) => {
      return this.native.databaseManager.createObject(objectName, object);
    },

    createObjects: (objectName, objectList) => {
      return this.native.databaseManager.createObjects(objectName, objectList);
    },

    deleteObject: (objectName, object) => {
      return this.native.databaseManager.deleteObject(objectName, object);
    },

    getObject: (objectName, objectID) => {
      return this.native.databaseManager.getObject(objectName, objectID);
    },

    getMessage: (message) => {
      return this.native.databaseManager.getMessage(message);
    },

    getImagesMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return this.native.databaseManager.getImagesMessagesInThread(threadID, fromCreateTime, maxNumMessages);
    },

    getVideosMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return this.native.databaseManager.getVideosMessagesInThread(threadID, fromCreateTime, maxNumMessages);
    },

    countMessagesInThread: (threadID, fromCreateTime) => {
      return this.native.databaseManager.countMessagesInThread(threadID, fromCreateTime);
    },

    getMessagesInThread: (threadID, fromCreateTime, maxNumMessages) => {
      return this.native.databaseManager.getMessagesInThread(threadID, fromCreateTime, maxNumMessages);
    },

    getLastMessageInThread: (threadID) => {
      return this.native.databaseManager.getLastMessageInThread(threadID);
    },

    getAllThreads: () => {
      return this.native.databaseManager.getAllThreads();
    },

    getAllFavoritedThreads: () => {
      return this.native.databaseManager.getAllFavoritedThreads();
    },

    deleteAllThreads: () => {
      return this.native.databaseManager.deleteAllThreads();
    },
    countUnReadMessagesInThread: (threadID) => {
      return this.native.databaseManager.countUnReadMessagesInThread(threadID);
    },
  }

  // - - - - - - - - - - - - - - - - - -

  getStore = () => {
    return this.native.getStore();
  }

  // - - - - - - - - - - - - - - - - - - 
  getDeviceUDID = () => {
    return this.native.getDeviceUDID();
  }

  loadImage = () => {
    return this.native.loadImage();
  }

  createResizedImage = (fileURI, maxWidth, maxHeight, quality = 100) => {
    // new Promise(resolve => resolve(fileURI));
    return this.native.createResizedImage(fileURI, maxWidth, maxHeight, quality);
  }
}

export default AbstractUtil;
