/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
/**
 * TODO:
 * - listen for internet connection to: 
 *  1) pause perform tasks when internet offline
 *  2) resume when internet online
 */

import { uploadImage, uploadVideo, uploadAudio } from '../FirebaseStorage';
import ChatManager from './ChatManager';
import { MESSAGE_IMAGE_KEYS, MESSAGE_VIDEO_KEYS, MESSAGE_AUDIO_KEYS } from '../network/FirebaseDataKeys';
import Native from '../Bridge';

// number of tasks run at the same time
const MAX_CONCURRENT_TASKS = 20;

// max image size before upload
const MAX_IMAGE_SIZE = 1024;

// --------------------------------------------------
function initChatUploadManager() {

  // PRIVATE
  // --------------------------------------------------
  const mImagesUploadQueue = [];
  let mTotalRunningTasks = 0;

  const mVideosUploadQueue = [];
  const mAudiosUploadQueue = [];

  let progressCallback = null;

  function mStartImageUploadTask() {
    // is queue empty?
    if (mImagesUploadQueue.length === 0) { return; }
    // is reach max concurrent task
    if (mTotalRunningTasks >= MAX_CONCURRENT_TASKS) { return; }
    // ---
    mTotalRunningTasks += 1;
    const task = mImagesUploadQueue.shift();
    // Utils.log(`${LOG_TAG}.task: `, task);
    // ---
    const { imageURI, imageSize, messageID, threadID } = task;
    Native.createResizedImage(imageURI, imageSize, imageSize, 60)
      .then(resizedURI => {
        // upload thumb image
        // Utils.log(`${LOG_TAG}.mStartImageUploadTask: resize done:`, resizedURI);
        uploadImage(resizedURI, (progressPercent) => {
          if (progressCallback) {
            progressCallback(progressPercent, `${threadID}${messageID}`);
          }
        }, null, (imageURL) => {
          // Utils.log(`${LOG_TAG}.mStartImageUploadTask: upload done: `, imageURL);
          // update firebase db
          mUpdateImageMessage(task, imageURL);
          // continue
          mTotalRunningTasks -= 1;
          mStartImageUploadTask();
        }, messageID);
      })
      .catch(() => {
        // continue
        mTotalRunningTasks -= 1;
        mStartImageUploadTask();
      });
  }

  function mStartVideoUploadTask() {
    // is queue empty?
    if (mVideosUploadQueue.length === 0) { return; }
    // is reach max concurrent task
    if (mTotalRunningTasks >= MAX_CONCURRENT_TASKS) { return; }
    // ---
    mTotalRunningTasks += 1;
    const task = mVideosUploadQueue.shift();
    // Utils.log(`${LOG_TAG}.task: `, task);
    // ---
    const { videoURI, messageID, threadID } = task;
    // upload thumb image
    // Utils.log(`${LOG_TAG}.mStartImageUploadTask: resize done:`, resizedURI);
    uploadVideo(videoURI, (progressPercent) => {
      if (progressCallback) {
        progressCallback(progressPercent, `${threadID}${messageID}`);
      }
    }, null, (videoURL) => {
      // Utils.log(`${LOG_TAG}.mStartImageUploadTask: upload done: `, imageURL);
      // update firebase db
      mUpdateVideoMessage(task, videoURL);
      // continue
      mTotalRunningTasks -= 1;
      mStartVideoUploadTask();
    }, messageID);
  }

  function mStartAudioUploadTask() {
    if (mAudiosUploadQueue.length === 0) { return; }
    if (mTotalRunningTasks >= MAX_CONCURRENT_TASKS) { return; }
    mTotalRunningTasks += 1;
    const task = mAudiosUploadQueue.shift();
    const { audioURI, messageID, threadID } = task;
    uploadAudio(audioURI, (progressPercent) => {
      if (progressCallback) {
        progressCallback(progressPercent, `${threadID}${messageID}`);
      }
    }, null, (audioURL) => {
      mUpdateAudioMessage(task, audioURL);
      mTotalRunningTasks -= 1;
      mStartAudioUploadTask();
    }, messageID);
  }

  function mUpdateImageMessage(task, imageURL) {
    const { threadID, messageID, imageID, imageKey } = task;

    ChatManager.shared()
      .updateImageMessageServerURL(threadID, messageID, imageID, imageKey, imageURL)
      .then((result) => {
        // Utils.log(`${LOG_TAG}.mUpdateImageMessage: update message`, result);
        return result;
      })
      .catch(() => {
      });
  }
  function mUpdateVideoMessage(task, videoURL) {
    const { threadID, messageID, videoID, videoKey } = task;
    ChatManager.shared()
      .updateVideoMessageServerURL(threadID, messageID, videoID, videoKey, videoURL)
      .then((result) => {
        return result;
      })
      .catch(() => {
      });
  }
  function mUpdateAudioMessage(task, audioURL) {
    const { threadID, messageID, audioID, audioKey } = task;
    ChatManager.shared()
      .updateAudioMessageServerURL(threadID, messageID, audioID, audioKey, audioURL)
      .then((result) => {
        return result;
      })
      .catch(() => {
      });
  }

  // PUBLIC
  // --------------------------------------------------

  return {
    progressCallback(callback) {
      progressCallback = callback;
    },

    addImageUploadTask(imageURI, imageID, threadID, messageID) {
      const task = { imageURI, imageID, threadID, messageID };
      // const uploadThumbImageTask = { 
      //   ...task,
      //   imageSize: MAX_THUMB_IMAGE_SIZE,
      //   imageKey: MESSAGE_IMAGE_KEYS.SERVER_THUMB_IMAGE_URL,
      // };
      const uploadImageTask = {
        ...task,
        imageSize: MAX_IMAGE_SIZE,
        imageKey: MESSAGE_IMAGE_KEYS.SERVER_IMAGE_URL,
      };
      // mImagesUploadQueue.push(uploadThumbImageTask);
      mImagesUploadQueue.push(uploadImageTask);
      mStartImageUploadTask();
    },

    addVideoUploadTask(videoURI, videoID, threadID, messageID) {
      const task = { videoURI, videoID, threadID, messageID };
      const uploadVideoTask = {
        ...task,
        videoKey: MESSAGE_VIDEO_KEYS.SERVER_VIDEO_URL,
      };
      mVideosUploadQueue.push(uploadVideoTask);
      mStartVideoUploadTask();
    },

    addAudioUploadTask(audioURI, audioID, threadID, messageID) {
      const task = { audioURI, audioID, threadID, messageID };
      const uploadAudioTask = {
        ...task,
        audioKey: MESSAGE_AUDIO_KEYS.SERVER_AUDIO_URL,
      };
      mAudiosUploadQueue.push(uploadAudioTask);
      mStartAudioUploadTask();
    },
  };
}

// --------------------------------------------------

function initSingletonChatUploadManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initChatUploadManager();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ChatUploadManager = initSingletonChatUploadManager();
export default ChatUploadManager;
