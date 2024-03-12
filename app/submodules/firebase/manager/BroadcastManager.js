function initBroadcastManager() {
  // PRIVATE
  // --------------------------------------------------

  const mObservers = {};

  // PUBLIC
  // --------------------------------------------------

  return {
    addObserver(name, target, callback) {
      // Utils.log(`${LOG_TAG}: addObserver: ${name}, callback: ${callback}`);
      let list = mObservers[name];
      if (!list) {
        list = [];
      }
      list.push({ target, callback });
      mObservers[name] = list;
    },
    removeObserver(name, target) {
      // Utils.log(`${LOG_TAG}: removeObserver: ${name}, callback: ${callback}`);
      const list = mObservers[name];
      if (list) {
        let removeIndex = -1;
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.target === target) {
            removeIndex = i;
            break;
          }
        }
        if (removeIndex >= 0) {
          list.splice(removeIndex, 1);
        }
      }
      mObservers[name] = list;
    },
    notifyObservers(name, ...args) {
      // Utils.log(`${LOG_TAG}: notifyObservers:${mObservers} ${observers} ${name}`);
      const observers = mObservers[name];
      if (observers) {
        for (let j = 0; j < observers.length; j += 1) {
          const item = observers[j];
          if (item.callback) {
            item.callback.call(item.target, ...args);
          }
        }
      }
    },
  };
}

// --------------------------------------------------

function initSingletonBroadcastManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initBroadcastManager();
      }
      return instance;
    },

    NAME: {
      USER: {
        INVALID_TOKEN: 'INVALID_TOKEN',
      },
      API: {
        ERROR_OTP: 'ERROR_OTP',
        ERROR_MESSAGE: 'ERROR_MESSAGE',
      },
      WEBVIEW: {
        DATA: 'DATA',
      },
      UI: {
        TABBAR_HOME: 'HOME',
        BOTTOM_ACTION_HOME2: 'BOTTOM_ACTION_HOME2',
        USER_LIST: 'USER_LIST',
        MAIN_TABBAR: {
          ACCOUNT_SETTING_TAB: 'ACCOUNT_SETTING_TAB',
        },
      },
      EVENT: {
        RELOAD_CUTOMER: 'RELOAD_CUTOMER',
        RELOAD_COL: 'RELOAD_COL',
      },
    },
  };
}

// --------------------------------------------------

const manager = initSingletonBroadcastManager();
export default manager;
