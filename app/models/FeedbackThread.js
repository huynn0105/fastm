/**
    "thread_id": "110",
    "poster": "Nguyễn Quốc Trung",
    "type": "M",
    "title": "General Inquiry",
    "body": "I love you",
    "path": [],
    "created_date": 1571659087
 */

import moment from 'moment';

export default class FeedbackThread {
  threadID = '';
  poster = '';
  type = '';
  topic = '';
  message = '';
  path = [];
  createdDate = null;
  createdTimeString = '';
  selectedFeedbackDetails = '';

  static objectFormJSON(json) {
    const feedbackThread = new FeedbackThread();
    feedbackThread.threadID = json.thread_id;
    feedbackThread.poster = json.poster;
    feedbackThread.type = json.type;
    feedbackThread.message = json.body;
    feedbackThread.path = json.path;
    feedbackThread.createdDate = json.created_date;
    feedbackThread.selectedFeedbackDetails = json?.selectedFeedbackDetails;

    let format = 'DD/MM hh:mm a';
    const today = moment().format('DD/MM');
    const messageDate = moment(feedbackThread.createdDate * 1000).format('DD/MM');
    if (today === messageDate) format = 'hh:mm a';
    feedbackThread.createdTimeString = moment(feedbackThread.createdDate * 1000).format(format);

    feedbackThread.topic =
      feedbackThread.type === 'M'
        ? json.title
        : `Hỗ trợ MFast, ${feedbackThread.createdTimeString}`;
    return feedbackThread;
  }
}
