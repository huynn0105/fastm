import _ from 'lodash';
import {
  FETCHING_OS_TICKET_TOPICS,
  OS_TICKET_TOPICS,
  FETCHING_LIST_OS_TICKET_BY_USER_ID,
  LIST_OS_TICKET_BY_USER_ID,
  FETCHING_THREAD_BY_TICKET_ID,
  THREAD_BY_TICKET_ID,
  CREATING_AN_OS_TICKET,
  CREATE_AN_OS_TICKET_RESPONSE,
  POSTING_THREAD,
  POST_THREAD_RESPONSE,
  TOTAL_LIST_OS_TICKET_BY_USER_ID,
} from './types';
import DigitelClient from '../../network/DigitelClient';
import FeedbackThread from '../../models/FeedbackThread';
import { uploadVideo } from '../../submodules/firebase/FirebaseStorage';

export const TICKETS_STATUS = {
  ALL: 'ALL',
  PENDING: 'no_reply',
  RESPONDED: 'reply',
  CLOSED: 'closed',
};

export function fetchingOSTicketTopics(isFetching) {
  return {
    type: FETCHING_OS_TICKET_TOPICS,
    payload: isFetching,
  };
}

export function updateOSTicketTopics(topics) {
  return {
    type: OS_TICKET_TOPICS,
    payload: topics,
  };
}

export function fetchingListOSTicketByUserID(isFetching) {
  return {
    type: FETCHING_LIST_OS_TICKET_BY_USER_ID,
    payload: isFetching,
  };
}

export function updateListOSTicketByUserID(listOSTicket, type) {
  return {
    type: LIST_OS_TICKET_BY_USER_ID,
    payload: { type, tickets: listOSTicket },
  };
}

export const totalListOSTicketByUserID = (total, type) => ({
  type: TOTAL_LIST_OS_TICKET_BY_USER_ID,
  payload: { type, total },
});

export function fetchingThreadByTicketNumber(isFetching) {
  return {
    type: FETCHING_THREAD_BY_TICKET_ID,
    payload: isFetching,
  };
}

export function updateThreadByTicketNumber(threads) {
  return {
    type: THREAD_BY_TICKET_ID,
    payload: threads,
  };
}

export function creatingAnOSTicket(isCreating) {
  return {
    type: CREATING_AN_OS_TICKET,
    payload: isCreating,
  };
}

export function updateCreateAnOSTicketResponse(response) {
  return {
    type: CREATE_AN_OS_TICKET_RESPONSE,
    payload: response,
  };
}

export function postingThread(isPosting) {
  return {
    type: POSTING_THREAD,
    payload: isPosting,
  };
}

export function updatePostingThreadResponse(response) {
  return {
    type: POST_THREAD_RESPONSE,
    payload: response,
  };
}

// --------------------------------------------------------------------------
// ASYNC ACTIONS
// --------------------------------------------------------------------------

export function fetchOSTicketTopics() {
  const doneFetching = (dispatch, topics) => {
    dispatch(updateOSTicketTopics(topics));
    dispatch(fetchingOSTicketTopics(false));
  };

  return (dispatch, getState) => {
    dispatch(fetchingOSTicketTopics(true));
    const userID = getState().myUser.uid;
    const userType = getState().myUser.user_type;
    return DigitelClient.osGetTopics(userID, userType)
      .then((topics) => {
        doneFetching(dispatch, topics);
      })
      .catch((error) => {
        doneFetching(dispatch, []);
      });
  };
}

export function fetchAllListOSTicket() {
  return (dispatch) => {
    dispatch(fetchListOSTicket(TICKETS_STATUS.ALL));
    dispatch(fetchListOSTicket(TICKETS_STATUS.PENDING));
    dispatch(fetchListOSTicket(TICKETS_STATUS.RESPONDED));
    dispatch(fetchListOSTicket(TICKETS_STATUS.CLOSED));
  };
}

export function fetchListOSTicket(type, page = 1) {
  const doneFetching = (dispatch, getState, listOSTicket, total, oldTickets) => {
    dispatch(updateListOSTicketByUserID([...oldTickets, ...listOSTicket], type));
    dispatch(totalListOSTicketByUserID(total, type));

    const fetchingNumber = getState().isFetchingListOSTicketByUserID;
    dispatch(fetchingListOSTicketByUserID(fetchingNumber - 1));
  };

  return (dispatch, getState) => {
    let oldTickets = getState().listOSTicketByUserID[type] || [];
    if (page === 1) oldTickets = [];
    const userID = getState().myUser.uid;

    dispatch(fetchingListOSTicketByUserID(getState().isFetchingListOSTicketByUserID + 1));
    return DigitelClient.osGetListTicketByUserID(userID, type, page)
      .then((data) => {
        if (data.length === 0) {
          throw Error();
        }
        doneFetching(dispatch, getState, data.tickets, data.total || 0, oldTickets);
      })
      .catch((error) => {
        doneFetching(dispatch, getState, [], 0, []);
      });
  };
}

export function fetchThreadByTicketNumber(ticketNumber) {
  const doneFetching = (dispatch, data) => {
    dispatch(updateThreadByTicketNumber(data));
    dispatch(fetchingThreadByTicketNumber(false));
  };

  const addComingItems = (threads) => {
    return [...threads, new FeedbackThread()];
  };

  return (dispatch) => {
    dispatch(fetchingThreadByTicketNumber(true));
    return DigitelClient.osGetThreadTicketByTicketNumber(ticketNumber)
      .then((data) => {
        const threads = addComingItems(data.threads.map(FeedbackThread.objectFormJSON));
        doneFetching(dispatch, { ...data, threads, ticketNumber });
      })
      .catch((error) => {
        doneFetching(dispatch, { threads: [] });
      });
  };
}

export function createAnOSTicket(params, callback) {
  const doneFetching = (dispatch, response) => {
    dispatch(updateCreateAnOSTicketResponse(response));
    dispatch(creatingAnOSTicket(false));
    callback(response);
  };

  const updateResponse = (ticketNumber, status, error) => {
    return { ticketNumber, status, error };
  };

  return (dispatch) => {
    dispatch(creatingAnOSTicket(true));
    return DigitelClient.osCreateTicket(params)
      .then((ticketNumber) => {
        let response;
        if (ticketNumber > 0) {
          response = updateResponse(ticketNumber, true);
        } else {
          response = updateResponse(0, false);
        }
        doneFetching(dispatch, response);
      })
      .catch((error) => {
        doneFetching(dispatch, updateResponse(0, false, error));
      });
  };
}

export function postThread(params, callback) {
  // console.log('2222', params);
  const doneFetching = (dispatch, response) => {
    dispatch(updatePostingThreadResponse(response));
    dispatch(postingThread(false));
    callback(response);
  };

  const updateResponse = (message, status, error) => {
    return { message, status, error };
  };

  return (dispatch) => {
    dispatch(postingThread(true));
    return DigitelClient.osPostThread(params)
      .then((response) => {
        // console.log('33333', response);
        let newResponse;
        if (!_.isEmpty(response)) {
          newResponse = updateResponse(response.message, true);
        } else {
          newResponse = updateResponse(response.message, false);
        }
        // console.log('4444', newResponse);
        doneFetching(dispatch, newResponse);
      })
      .catch((error) => {
        doneFetching(
          dispatch,
          updateResponse('Không thể gửi phản hồi. Vui lòng thử lại', false, error),
        );
      });
  };
}

export function uploadVideoToFirebase(videoUri, onSuccess, onError) {
  return (dispatch) => {
    return uploadVideo(
      videoUri,
      null,
      null,
      (videoUrl) => {
        console.log('aaaa', videoUrl);
        return videoUrl;
      },
      null,
    );
  };
}
