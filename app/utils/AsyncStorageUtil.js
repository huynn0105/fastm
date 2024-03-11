import AsyncStorage from '@react-native-async-storage/async-storage';

export const TUT_HOME_SYSTEM = 'TUT_HOME_SYSTEM';
export const TUT_CHATLIST_APPAY = 'TUT_CHATLIST_APPAY';
export const TUT_CHAT_EMOJI = 'TUT_CHAT_EMOJI';

export const ALERT_DELETE_MESS = 'ALERT_DELETE_MESS';
export const ALERT_RECALL_MESS = 'ALERT_RECALL_MESS';

export const checkDoneTut = async (key) => {
  const done = await AsyncStorage.getItem(key);
  return done;
};

export const markDoneTut = (key) => {
  AsyncStorage.setItem(key, key);
};

export const markUndoneTut = (key) => {
  AsyncStorage.removeItem(key);
};

export const HOME_ITEM_STORAGE = 'HOME_ITEM_STORAGE';
export const HOME_MAIN_GROUP = 'HOME_MAIN_GROUP';
