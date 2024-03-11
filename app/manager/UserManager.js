import { forceLogout } from '../redux/actions';
import store from '../redux/store/store';
import BroadcastManager from '../submodules/firebase/manager/BroadcastManager';

function initUserCenter() {
  function logoutHandler() {
    store.dispatch(forceLogout());
  }

  return {
    addObservers() {
      BroadcastManager.shared().addObserver(
        BroadcastManager.NAME.USER.INVALID_TOKEN,
        this,
        logoutHandler,
      );
    },
  };
}

function initSingletonUserCenter() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initUserCenter();
        instance.addObservers();
      }
      return instance;
    },
  };
}

const UserManager = initSingletonUserCenter();
export default UserManager;
