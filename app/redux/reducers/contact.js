/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import {
  IS_FETCH_CONTACTS_PROCESSING,
  ALL_CONTACTS,
} from '../actions/types';

export function isFetchContactsProcessing(state = false, action) {
  switch (action.type) {
    case IS_FETCH_CONTACTS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function allContacts(state = [], action) {
  switch (action.type) {
    case ALL_CONTACTS:
      return action.allContacts;
    default:
      return state;
  }
}
