import {
  FETCHING_CONVERSATION_CONTACTS,
  CONVERSATION_CONTACTS,
  INVITATIONS_REQUESTS_CONTACT,
  IS_FETCHING_SINGLE_CHAT,
} from '../actions/types';

export const fetchingConversationContacts = (state = false, action) =>
  action.type === FETCHING_CONVERSATION_CONTACTS ? action.payload : state;

export const conversationContacts = (state = [], action) =>
  action.type === CONVERSATION_CONTACTS ? action.payload : state;

export const invitationsRequestsContact = (
  state = { invitations: [], sendingRequests: [] },
  action,
) => (action.type === INVITATIONS_REQUESTS_CONTACT ? action.payload : state);
export const isFetchingSingleChat = (state = false, action) =>
  action.type === IS_FETCHING_SINGLE_CHAT ? action.payload : state;
