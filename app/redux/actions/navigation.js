import { ROOT_SCREEN, HOME_NAVIGATE, CURRENT_SCREEN_NAME } from './types';

// --------------------------------------------------

export function rootScreen(screen = 'LOADING') {
  return {
    type: ROOT_SCREEN,
    screen
  };
}

export function homeNavigate(screen = null, params = null) {
  return {
    type: HOME_NAVIGATE,
    navigate: {
      screen,
      params
    }
  };
}

export function currentScreenName(screen = '') {
  return {
    type: CURRENT_SCREEN_NAME,
    payload: screen
  };
}

// --------------------------------------------------

export function switchRootScreenToLoading() {
  return dispatch => dispatch(rootScreen('LOADING'));
}

export function switchRootScreenToRegister() {
  return dispatch => dispatch(rootScreen('REGISTER'));
}

export function switchRootScreenToLogin() {
  return dispatch => dispatch(rootScreen('MAIN'));
}

export function switchRootScreenToForgotPassword() {
  return dispatch => dispatch(rootScreen('FORGOT_PASSWORD'));
}

export function switchRootScreenToMain() {
  return dispatch => dispatch(rootScreen('MAIN'));
}

export function openLogin() {
  return dispatch => dispatch(homeNavigate('LoginModal'));
}

export function openOTPInput(requestData) {
  return (dispatch) => dispatch(homeNavigate('OtpConfirm', { requestData }));
}

export function openProfile() {
  return dispatch => dispatch(homeNavigate('AccountInforScreen' ));
}
