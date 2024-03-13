import {
  IS_LOGIN_PROCESSING,
  LOGIN_RESPONSE,
  IS_LOGOUT_PROCESSING,
  LOGOUT_RESPONSE,
  MY_USER,
  IS_RESET_PASSWORD_PROCESSING,
  RESET_PASSWORD_RESPONSE,
  RESET_PASSWORD_INFO,
  IS_REGISTER_PROCESSING,
  REGISTER_RESPONSE,
  IS_SEND_PASSWORD_PROCESSING,
  SEND_PASSWORD_RESPONSE,
  IS_UPDATE_PROFILE_PROCESSING,
  UPDATE_PROFILE_RESPONSE,
  IS_IMPORTANT_UPDATE_PROFILE_PROCESSING,
  IMPORTANT_UPDATE_PROFILE_RESPONSE,
  IS_GET_OWNERS_PROCESSING,
  GET_OWNERS_RESPONSE,
  IS_GET_USERS_PROCESSING,
  GET_USERS_RESPONSE,
  IS_REGISTER_VALIDATE_PROCESSING,
  REGISTER_VALIDATE_RESPONSE,
  MY_USER_LIST,
  LOADING_ACCOUNT_DATA,
} from '../actions/types';

// --------------------------------------------------

export const loadingAccountData = (state = false, action) =>
  (action.type === LOADING_ACCOUNT_DATA ? action.payload : state);

export function isLoginProcessing(state = false, action) {
  switch (action.type) {
    case IS_LOGIN_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function loginResponse(state = {}, action) {
  switch (action.type) {
    case LOGIN_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function isLogoutProcessing(state = false, action) {
  switch (action.type) {
    case IS_LOGOUT_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function logoutResponse(state = {}, action) {
  switch (action.type) {
    case LOGOUT_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function myUser(state = {}, action) {
  switch (action.type) {
    case MY_USER:
      return action.myUser;
    default:
      return state;
  }
}

export const myUsers = (state = [], action) =>
  (action.type === MY_USER_LIST ? action.payload : state);

// --------------------------------------------------

export function isResetPasswordProcessing(state = false, action) {
  switch (action.type) {
    case IS_RESET_PASSWORD_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function resetPasswordResponse(state = {}, action) {
  switch (action.type) {
    case RESET_PASSWORD_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

export function resetPasswordInfo(state = {}, action) {
  switch (action.type) {
    case RESET_PASSWORD_INFO:
      return action.info;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isRegisterProcessing(state = false, action) {
  switch (action.type) {
    case IS_REGISTER_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function registerResponse(state = {}, action) {
  switch (action.type) {
    case REGISTER_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isRegisterValidateProcessing(state = false, action) {
  switch (action.type) {
    case IS_REGISTER_VALIDATE_PROCESSING:
      return action.payload;
    default:
      return state;
  }
}

export function registerValidateResponse(state = {}, action) {
  switch (action.type) {
    case REGISTER_VALIDATE_RESPONSE:
      return action.payload;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isSendPasswordProcessing(state = false, action) {
  switch (action.type) {
    case IS_SEND_PASSWORD_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function sendPasswordResponse(state = {}, action) {
  switch (action.type) {
    case SEND_PASSWORD_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isUpdateProfileProcessing(state = false, action) {
  switch (action.type) {
    case IS_UPDATE_PROFILE_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function updateProfileResponse(state = {}, action) {
  switch (action.type) {
    case UPDATE_PROFILE_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isImportantUpdateProfileProcessing(state = false, action) {
  switch (action.type) {
    case IS_IMPORTANT_UPDATE_PROFILE_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function importantUpdateProfileResponse(state = {}, action) {
  switch (action.type) {
    case IMPORTANT_UPDATE_PROFILE_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isGetOwnersProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_OWNERS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getOwnersResponse(state = {}, action) {
  switch (action.type) {
    case GET_OWNERS_RESPONSE:
      return action.response;
    default:
      return state;
  }
}

// --------------------------------------------------

export function isGetUsersProcessing(state = false, action) {
  switch (action.type) {
    case IS_GET_USERS_PROCESSING:
      return action.isProcessing;
    default:
      return state;
  }
}

export function getUsersResponse(state = {}, action) {
  switch (action.type) {
    case GET_USERS_RESPONSE:
      return action.response;
    default:
      return state;
  }
}
