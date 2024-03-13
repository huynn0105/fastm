import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../../submodules/firebase/network/FirebaseFunctions';
import {
  CONVERSATION_CONTACTS,
  FETCHING_CONVERSATION_CONTACTS,
  INVITATIONS_REQUESTS_CONTACT,
  IS_FETCHING_SINGLE_CHAT,
} from './types';

export const fetchingConversationContacts = (fetching) => ({
  type: FETCHING_CONVERSATION_CONTACTS,
  payload: fetching,
});

export const conversationContacts = (contacts) => ({
  type: CONVERSATION_CONTACTS,
  payload: contacts,
});

export const invitationsAndRequests = (invitationsAndRequestsData) => ({
  type: INVITATIONS_REQUESTS_CONTACT,
  payload: invitationsAndRequestsData,
});

export const setIsFetchingSingleChat = (isFetching) => ({
  type: IS_FETCHING_SINGLE_CHAT,
  payload: isFetching,
});

export function fetchConversationContacts(callback) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      const contacts = await FirebaseFunctions.fetchConversationContacts(token);
      dispatch(conversationContacts(contacts));
      callback && callback(contacts);
    } catch (error) {
      dispatch(conversationContacts([]));
      callback && callback([]);
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function fetchInvitationsRequests(callback) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      const result = await FirebaseFunctions.fetchInvitationAndSendingRequest(token);
      callback && callback(result);
      dispatch(invitationsAndRequests(result));
      callback && callback(result);
    } catch (error) {
      console.log(error);
      callback && callback({});
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function sendRequestContact(phoneNumber, nickname, callback) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      await FirebaseFunctions.sendRequestContact(token, phoneNumber, nickname);
      dispatch(fetchInvitationsRequests());
      callback(true);
    } catch (error) {
      callback(false);
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function resendRequestContact(phoneNumber, callback) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      await FirebaseFunctions.sendRequestContact(token, phoneNumber);
      dispatch(fetchInvitationsRequests());
      callback && callback(true);
    } catch (error) {
      console.log(error);
      callback && callback(false);
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function cancelRequestContact(phoneNumber) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      await FirebaseFunctions.cancelRequestContact(token, phoneNumber);
      dispatch(fetchInvitationsRequests());
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function acceptRequestContact(invitationID, acceptedUserID, callback) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      await FirebaseFunctions.acceptRequestContact(token, invitationID, acceptedUserID);
      dispatch(fetchInvitationsRequests());
      dispatch(fetchConversationContacts());
      callback(true);
    } catch (error) {
      console.log(error);
      callback(false);
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function rejectRequestContact(senderID, callback) {
  return async (dispatch) => {
    try {
      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      await FirebaseFunctions.rejectRequestContact(token, senderID);
      dispatch(fetchInvitationsRequests());
      callback && callback(true);
    } catch (error) {
      callback && callback(false);
      console.log(error);
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export function addContactForRefUser() {
  return async (dispatch, getState) => {
    try {
      const myUser = getState().myUser;
      const refID = myUser.userReferralID;
      if (!refID) return;

      dispatch(fetchingConversationContacts(true));
      const token = await FirebaseDatabase.firebaseToken();
      const contacts = await FirebaseFunctions.fetchConversationContacts(token);
      dispatch(conversationContacts(contacts));

      if (refID && !contacts.map((contact) => contact.uid).includes(refID)) {
        await FirebaseFunctions.updateRefContact(token, refID);
      }
    } catch (error) {
      dispatch(conversationContacts([]));
    } finally {
      dispatch(fetchingConversationContacts(false));
    }
  };
}

export async function fetchConversationContactsOnline() {
  try {
    const token = await FirebaseDatabase.firebaseToken();
    const contacts = await FirebaseFunctions.fetchConversationContactsOnline(token);
    return contacts;
  } catch (error) {
    //
  } finally {
    //
  }
}
