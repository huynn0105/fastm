/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import DigitelClient from 'app/network/DigitelClient';
import DatabaseManager from 'app/manager/DatabaseManager';

import {
  IS_GET_KNOWLEDGE_PROCESSING,
  GET_KNOWLEDGE_RESPONSE,
  KNOWLEDGES,
  APPEND_KNOWLEDGES,
  COUNT_UNREAD_KNOWLEDGES,
  CONTEST,
} from './types';

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'actions/knowledge.js';
/* eslint-enable */

// --------------------------------------------------

export function isGetKnowledgesProcessing(bool) {
  return {
    type: IS_GET_KNOWLEDGE_PROCESSING,
    isProcessing: bool,
  };
}

export function getKnowledgesResponse(object) {
  return {
    type: GET_KNOWLEDGE_RESPONSE,
    response: object,
  };
}

export function knowledges(object) {
  return {
    type: KNOWLEDGES,
    knowledges: object,
  };
}

export function appendKnowledges(object) {
  return {
    type: APPEND_KNOWLEDGES,
    knowledges: object,
  };
}

export function contest(data) {
  return {
    type: CONTEST,
    payload: data,
  };
}

export function getKnowledges(page = 1, perPage = 20) {
  return (dispatch) => {
    return DigitelClient.fetchKnowledge(page, perPage)
      .then((items) => {
        // update state
        dispatch(knowledges(items));
        return true;
      })
      .catch(() => {
        return Promise.resolve(true);
      });
  };
}

export function getContests() {
  return (dispatch) => {
    DigitelClient.fetchContest()
      .then((data) => {
        dispatch(contest(data));
      })
      .catch(() => {
        // dispatch(badLoans(BadLoans.fakeData()));
        dispatch(contest([]));
      });
  };
}

export function countUnReadKnowledges() {
  const count = DatabaseManager.shared().countUnReadKnowledges();
  return {
    type: COUNT_UNREAD_KNOWLEDGES,
    count,
  };
}

export function readKnowledge(knowledge) {
  return (dispatch) => {
    DatabaseManager.shared().readKnowledge(knowledge);
    dispatch(countUnReadKnowledges());
  };
}

export function readAllKnowledges() {
  return (dispatch) => {
    DatabaseManager.shared().readAllKnowledges();
    dispatch(countUnReadKnowledges());
  };
}
