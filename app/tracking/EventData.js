
const ACTION = {
  OPEN: '1',
  CLOSE: '2',
  GO_BACKGROUND: '3',
  OPEN_BACKGROUND: '4',
  TAP: '5',
};

const SCREEN = {
  APP: '1',
  HOME_TAB: '2',
  SHOP_TAB: '3',
  KNOWLEGE_TAB: '4',
  NEWS_TAB: '5',
  ELLY: '6',
  ANNA: '7',
  NOTI_ELLY: '8',
  NOTI_ANNA: '9',
  PROFILE: '10',
  NEWS: '11',
  KNOWLEGE: '12',
  SHOP_ITEMS: '13',
  CHAT: '14',
  NOTI_PERMISSION: '15',
};

const EVENT = {
  ACTION_ID: 'e',
  SCREEN_ID: 's',
  USER_ID: 'u',
  USER_TYPE: 'ut',
  TIME: 't', // timestamp
  DEVICE_TYPE: 'd',
  OS_TYPE: 'o',
  LAT: 'la',
  LON: 'lo',
};

export { ACTION, SCREEN, EVENT };
