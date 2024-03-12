/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import {
  CHAT_CENTER_STATES,
} from '../actions/app';

import {
  CHAT_CENTER_STATE,
} from '../actions/types';

// --------------------------------------------------

export function chatCenterState(state = CHAT_CENTER_STATES.UN_INITED, action) {
  switch (action.type) {
    case CHAT_CENTER_STATE:
      return action.state;
    default:
      return state;
  }
}

// export function myUser(state = {}, action) {
//   switch (action.type) {
//     case MY_USER:
//       return action.myUser;
//     default:
//       return state;
//   }
// }
