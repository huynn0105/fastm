import {
  IS_GET_KNOWLEDGE_PROCESSING,
  GET_KNOWLEDGE_RESPONSE,
  KNOWLEDGES,
  APPEND_KNOWLEDGES,
  COUNT_UNREAD_KNOWLEDGES,
  CONTEST,
} from '../actions/types';


export function isGetKnowledgesProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_KNOWLEDGE_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getKnowledgesResponse(state = {}, action) {
  switch (action.type) {
    case GET_KNOWLEDGE_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function knowledges(state = [], action) {
  switch (action.type) {
    case KNOWLEDGES:
      return action.knowledges;
    case APPEND_KNOWLEDGES:
      return state.concat(action.knowledges);
    default:
      return state;
  }
}

export function totalUnReadKnowledges(state = 0, action) {
  switch (action.type) {
    case COUNT_UNREAD_KNOWLEDGES:
      return action.count;
    default:
      return state;
  }
}

export function contests(state = null, action) {
  return action.type === CONTEST ? action.payload : state;
}

