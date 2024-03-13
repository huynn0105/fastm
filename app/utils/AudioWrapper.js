import {
  Platform,
} from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';


class AudioRecorderWrapper {

  currentTime: 0;
  recording: false;
  callback: undefined;

  startRecordAudio(path) {
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      if (!isAuthorised) {
        this.mFinished({ isAuthorised });
        return;
      }

      this.mPrepareRecordingPath(`${AudioUtils.DocumentDirectoryPath}/${path}.aac`);

      AudioRecorder.onProgress = (data) => {
        this.currentTime = Math.floor(data.currentTime);
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this.mFinished({
            isAuthorised,
            success: data.status === 'OK',
            audioFileURL: data.audioFileURL,
            duration: this.currentTime,
          });
        }
      };

      this.mStartRecord();
    });
  }

  mPrepareRecordingPath(audioPath) {
    this.currentTime = 0;
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  }

  mStartRecord() {
    try {
      AudioRecorder.startRecording();
    } catch (_) {
      this.mFinished({
        isAuthorised: true,
        success: false,
      });
    }
  }

  mFinished({ isAuthorised, success, audioFileURL, duration }) {
    if (this.callback) {
      this.callback({ isAuthorised, success, audioFileURL, duration });
    }
  }

  async stopRecordAudio() {
    try {
      const filePath = await AudioRecorder.stopRecording();
      if (Platform.OS === 'android') {
        this.mFinished({
          isAuthorised: true,
          success: true,
          audioFileURL: filePath,
          duration: this.currentTime,
        });
      }
    } catch (error) {
      this.mFinished({
        isAuthorised: true,
        success: false,
      });
    }
  }

  // callback: {isAuthorised, success, audioFileURL, audioFileSize}
  onFinished(callback) {
    this.callback = callback;
  }
}

const sharedInstance = new AudioRecorderWrapper();
export default sharedInstance;
