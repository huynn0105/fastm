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
} from '../actions/types';

export function isFetchingOSTicketTopics(state = false, action) {
  return action.type === FETCHING_OS_TICKET_TOPICS ? action.payload : state;
}

export function osTicketTopics(state = [], action) {
  return action.type === OS_TICKET_TOPICS ? action.payload : state;
}

export function isFetchingListOSTicketByUserID(state = false, action) {
  return action.type === FETCHING_LIST_OS_TICKET_BY_USER_ID ? action.payload : state;
}

export function listOSTicketByUserID(state = {}, action) {
  const updateTickets = (oldState, { type, tickets }) => ({ ...oldState, [type]: tickets });
  return action.type === LIST_OS_TICKET_BY_USER_ID ? updateTickets(state, action.payload) : state;
}

export function totalListOSTicketByUserID(state = {}, action) {
  const updateTotalTickets = (oldState, { type, total }) => ({ ...oldState, [type]: total });
  return action.type === TOTAL_LIST_OS_TICKET_BY_USER_ID
    ? updateTotalTickets(state, action.payload)
    : state;
}

export function isFetchingThreadByTicketID(state = false, action) {
  return action.type === FETCHING_THREAD_BY_TICKET_ID ? action.payload : state;
}

export function threadByTicketID(state = [], action) {
  return action.type === THREAD_BY_TICKET_ID ? action.payload : state;
}

export function isCreatingAnOSTicket(state = false, action) {
  return action.type === CREATING_AN_OS_TICKET ? action.payload : state;
}

export function createAnOSTicketResponse(state = {}, action) {
  return action.type === CREATE_AN_OS_TICKET_RESPONSE ? action.payload : state;
}

export function isPostingThread(state = false, action) {
  return action.type === POSTING_THREAD ? action.payload : state;
}

export function postThreadResponse(state = {}, action) {
  return action.type === POST_THREAD_RESPONSE ? action.payload : state;
}
