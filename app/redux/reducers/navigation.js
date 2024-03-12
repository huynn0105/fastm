import {
  ROOT_SCREEN,
  HOME_NAVIGATE,
  CURRENT_SCREEN_NAME,
} from '../actions/types';

export function rootScreen(state = 'LOADING', action) {
  switch (action.type) {
    case ROOT_SCREEN:
      return action.screen;
    default:
      return state;
  }
}

export function homeNavigate(state = {
  screen: null,
  params: null,
}, action) {
  switch (action.type) {
    case HOME_NAVIGATE:
      return action.navigate;
    default:
      return state;
  }
}

export function currentScreenName(state = '', action) {
  switch (action.type) {
    case CURRENT_SCREEN_NAME:
      return action.payload;
    default:
      return state;
  }
}
