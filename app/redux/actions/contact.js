/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import ContactsManager from 'app/manager/ContactsManager';
import DatabaseManager from 'app/manager/DatabaseManager';
import { User } from 'app/models';
import ChatManager from '../../submodules/firebase/manager/ChatManager';

import {
  IS_FETCH_CONTACTS_PROCESSING,
  ALL_CONTACTS,
} from './types';

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/contact.js';
/* eslint-enable */

// --------------------------------------------------

export function isFetchContactsProcessing(bool) {
  return {
    type: IS_FETCH_CONTACTS_PROCESSING,
    isProcessing: bool,
  };
}

export function allContacts(objects) {
  return {
    type: ALL_CONTACTS,
    allContacts: objects,
  };
}
// --------------------------------------------------

export function fetchContacts(forced = true) {
  return (dispatch) => {
    const asyncTask = async () => {
      try {
        // update ui state
        dispatch(isFetchContactsProcessing(true));
        // fetch & insert to db
        // const contacts = await ContactsManager.shared().reloadContacts(forced);
        // if (contacts !== null) {
        //   DatabaseManager.shared().deleteObjects('User');
        //   DatabaseManager.shared().createObjects('User', contacts);
        //   // update ui state
        //   dispatch(reloadAllContactsFromDB());
        // }
        dispatch(isFetchContactsProcessing(false));
        return true;
      } catch (err) {
        dispatch(isFetchContactsProcessing(false));
        Utils.warn(`${LOG_TAG}.fetchAllContacts err: `, err);
        return false;
      } finally {
        dispatch(isFetchContactsProcessing(false));
      }
    };
    return asyncTask();
  };
}

export function reloadAllContactsFromDB() {
  return (dispatch) => {
    const dbContacts = DatabaseManager.shared().getContacts();
    dispatch(allContacts(dbContacts));
  };
}

export function toggleContactFavorite(contactID, isFavorite) {
  return (dispatch, getState) => {
    // toggle favorite in db
    const result = DatabaseManager.shared().toggleContactFavorite(contactID, isFavorite);
    if (!result) {
      Utils.warn(`${LOG_TAG} toggleContactFavorite db err: `, result);
      return;
    }
    // update state
    const contacts = getState().allContacts;
    const newContacts = contacts.map((contact) => {
      if (contact.uid !== contactID) {
        return contact;
      }
      const newContact = Object.assign(new User(), contact);
      newContact.isFavorite = isFavorite;
      return newContact;
    });
    dispatch(allContacts(newContacts));
  };
}

export function block(userID) {
  return (dispatch) => {
    // toggle favorite in db
    const asyncTask = async () => {
      try {
        await ChatManager.shared().block(userID);
        dispatch(fetchContacts());
        return true;
      } catch (err) {
        Utils.warn(`${LOG_TAG}.fetchAllContacts err: `, err);
        return false;
      }
    };
    return asyncTask();
  };
}

export function unblock(userID) {
  return (dispatch) => {
    // toggle favorite in db
    const asyncTask = async () => {
      try {
        await ChatManager.shared().unblock(userID);
        dispatch(fetchContacts());
        return true;
      } catch (err) {
        Utils.warn(`${LOG_TAG}.fetchAllContacts err: `, err);
        return false;
      }
    };
    return asyncTask();
  };
}
