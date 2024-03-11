/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Firebase Cloud Storage
 * - use to upload/download files, images
 * - client will upload file to storage & get the url to insert into database
 */

import moment from 'moment/min/moment-with-locales';
import { firebase } from './Bridge';

// --------------------------------------------------

const IMAGES_PATH = 'images';
const VIDEOS_PATH = 'videos';
const AUDIOS_PATH = 'audios';
const FILES_PATH = 'files';

const PROFILE_AVATAR_PATH = `${IMAGES_PATH}/profile_avatar`;
const PROFILE_WALL_PATH = `${IMAGES_PATH}/profile_wall`;

const CHAT_IMAGES_PATH = `${IMAGES_PATH}/chat`;
const CHAT_FILES_PATH = `${FILES_PATH}/chat`;

const GENERAL_IMAGES_PATH = `${IMAGES_PATH}/general`;
const GENERAL_FILES_PATH = `${FILES_PATH}/gerneal`;

const GENERAL_VIDEOS_PATH = `${VIDEOS_PATH}/general`;
const GENERAL_AUDIOS_PATH = `${AUDIOS_PATH}/general`;

// --------------------------------------------------
// FirebaseStorage
// --------------------------------------------------

class FirebaseStorage {
  static getDownloadURL(path) {
    const urlPromise = firebase.storage().ref(path).getDownloadURL();
    return urlPromise;
  }

  /**
   * Upload a file from fileURL to filePath on Firebase Storage
   * @param {string} fileURI Local file path
   * @param {string} storagePath Firebase Storage path
   * @returns firebase upload task
   */
  static uploadFile(fileURI, storagePath, fileMetaData = null) {
    const uploadTask = firebase.storage().ref().child(storagePath).putFile(fileURI, fileMetaData);
    return uploadTask;
  }

  /**
   * Download a file from Firebase Storage to local
   * @param {string} storagePath
   */
  // static downloadFile(
  //   storagePath,
  //   onProgress, onError, onSuccess // eslint-disable-line
  // ) {
  // }

  /**
   * Upload profile avatar image
   * @param {string} userID
   */
  static uploadProfileAvatar(userID, fileURI) {
    const updateTime = moment().unix();
    const storagePath = `${PROFILE_AVATAR_PATH}/${userID}_${updateTime}.jpg`;
    const fileMetaData = { contentType: 'image/jpeg' };
    return FirebaseStorage.uploadFile(fileURI, storagePath, fileMetaData);
  }

  /**
   * Upload profile wall image
   * @param {string} userID
   */
  static uploadProfileWall(userID, fileURI) {
    const updateTime = moment().unix();
    const storagePath = `${PROFILE_WALL_PATH}/${userID}_${updateTime}.jpg`;
    const fileMetaData = { contentType: 'image/jpeg' };
    return FirebaseStorage.uploadFile(fileURI, storagePath, fileMetaData);
  }

  /**
   * Upload an image in chat
   * @param {string} threadID
   */
  static uploadChatImage(threadID, fileURI) {
    const updateTime = moment().unix();
    const storagePath = `${CHAT_IMAGES_PATH}/${threadID}/image_${updateTime}.jpg`;
    const fileMetaData = { contentType: 'image/jpeg' };
    return FirebaseStorage.uploadFile(fileURI, storagePath, fileMetaData);
  }

  /**
   * Upload a file in chat
   * @param {string} threadID
   * @param {string} fileExtension file extension, like .zip, .pdf, ... (optional)
   */
  static uploadChatFile(threadID, fileURI, fileExtension) {
    const updateTime = moment().unix();
    const storagePath = `${CHAT_FILES_PATH}/${threadID}/file_${updateTime}${fileExtension}`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }

  /**
   * Upload an image in to a common place
   * @param {string} threadID
   */
  static uploadGeneralImage(fileURI, messageID) {
    const now = moment();
    const date = now.format('DD_MM_YYYY');
    const updateTime = now.unix();
    const storagePath = `${GENERAL_IMAGES_PATH}/${date}/image_${updateTime}_${messageID}.jpg`;
    const fileMetaData = { contentType: 'image/jpeg' };
    return FirebaseStorage.uploadFile(fileURI, storagePath, fileMetaData);
  }

  /**
   * Upload an image in to a common place
   * @param {string} threadID
   */
  static uploadGeneralVideo(fileURI, messageID) {
    const now = moment();
    const date = now.format('DD_MM_YYYY');
    const updateTime = now.unix();
    const storagePath = `${GENERAL_VIDEOS_PATH}/${date}/video_${updateTime}_${messageID}.mp4`;
    const fileMetaData = { contentType: 'video/mp4' };
    return FirebaseStorage.uploadFile(fileURI, storagePath, fileMetaData);
  }

  static uploadGeneralAudio(fileURI, messageID) {
    const now = moment();
    const date = now.format('DD_MM_YYYY');
    const updateTime = now.unix();
    const storagePath = `${GENERAL_AUDIOS_PATH}/${date}/audio_${updateTime}_${messageID}.aac`;
    const fileMetaData = { contentType: 'audio/aac' };
    return FirebaseStorage.uploadFile(fileURI, storagePath, fileMetaData);
  }

  /**
   * Upload a file to a common place
   * @param {string} threadID
   * @param {string} fileExtension file extension, like .zip, .pdf, ... (optional)
   */
  static uploadGeneralFile(fileURI, fileExtension) {
    const now = moment();
    const date = now.format('DD_MM_YYYY');
    const updateTime = now.unix();
    const storagePath = `${GENERAL_FILES_PATH}/${date}/file_${updateTime}${fileExtension}`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }
}

export default FirebaseStorage;

/**
 * Upload an image from device to Firebase Cloud Storage
 * @param {string} fileURI
 * @returns void
 */
export function uploadImage(fileURI, onProgress, onError, onSuccess, messageID) {
  // create upload task
  let uploadTask = null;
  uploadTask = FirebaseStorage.uploadGeneralImage(fileURI, messageID);
  if (!uploadTask) {
    return;
  }
  // upload
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // progress
      // Utils.log(`${LOG_TAG} uploadImage progress: ${snapshot} %`);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (onProgress) {
        onProgress(progress);
      }
    },
    (error) => {
      // error
      if (onError) {
        onError(error);
      }
      if (onProgress) {
        onProgress(0);
      }
    },
    async (snapshot) => {
      const invokeSuccess = (onSuccessCallback, onProgressCallback, url) => {
        if (onSuccessCallback) {
          onSuccessCallback(url);
        }
        if (onProgressCallback) {
          onProgressCallback(100);
        }
      };

      // mobile
      if (snapshot) {
        const downloadURL = await FirebaseStorage.getDownloadURL(snapshot?.metadata?.fullPath);
        invokeSuccess(onSuccess, onProgress, downloadURL);
      }
      // web
      else {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          invokeSuccess(onSuccess, onProgress, url);
        });
      }
    },
  );
}

/**
 * Upload an image from device to Firebase Cloud Storage
 * @param {string} fileURI
 * @returns void
 */
export function uploadVideo(fileURI, onProgress, onError, onSuccess, messageID) {
  // create upload task
  let uploadTask = null;
  uploadTask = FirebaseStorage.uploadGeneralVideo(fileURI, messageID);
  if (!uploadTask) {
    return;
  }
  // upload
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // progress
      // Utils.log(`${LOG_TAG} uploadImage progress: ${snapshot} %`);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (onProgress) {
        onProgress(progress);
      }
    },
    (error) => {
      // error
      if (onError) {
        onError(error);
      }
      if (onProgress) {
        onProgress(0);
      }
    },
    async (snapshot) => {
      const invokeSuccess = (onSuccessCallback, onProgressCallback, url) => {
        if (onSuccessCallback) {
          onSuccessCallback(url);
        }
        if (onProgressCallback) {
          onProgressCallback(100);
        }
      };

      // mobile
      if (snapshot) {
        const downloadURL = await FirebaseStorage.getDownloadURL(snapshot?.metadata?.fullPath);
        invokeSuccess(onSuccess, onProgress, downloadURL);
      }
      // web
      else {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          invokeSuccess(onSuccess, onProgress, url);
        });
      }
    },
  );
}

export function uploadAudio(fileURI, onProgress, onError, onSuccess, messageID) {
  let uploadTask = null;
  uploadTask = FirebaseStorage.uploadGeneralAudio(fileURI, messageID);

  if (!uploadTask) {
    return;
  }

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (onProgress) {
        onProgress(progress);
      }
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      if (onProgress) {
        onProgress(0);
      }
    },
    async (snapshot) => {
      if (onSuccess) {
        const downloadURL = await FirebaseStorage.getDownloadURL(snapshot?.metadata?.fullPath);
        onSuccess(downloadURL);
      }
      if (onProgress) {
        onProgress(100);
      }
    },
  );
}
