import { uniqBy } from 'lodash';
import { TAB_TYPE } from '../../../screenV3/Notification/Notification.constants';
import { formatNotification } from '../../../submodules/firebase/utils/formatNotification';
import {
  FLAG_NOTIFICATION,
  INCREASE_TOTAL_UNREAD_NOTIFICATION,
  READ_ALL_NOTIFICATION_NEW,
  READ_NOTIFICATION_NEW,
  SET_FILTER_NOTIFICATION,
  SET_LIST_NOTIFICATION,
  SET_MORE_LIST_NOTIFICATION,
  SET_TOTAL_UNREAD_NOTIFICATION,
  UNREAD_NOTIFICATION_NEW,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  listNotification: {
    admin: {
      [TAB_TYPE.ALL]: [],
      [TAB_TYPE.FLAG]: [],
      [TAB_TYPE.FINANCIAL]: [],
      [TAB_TYPE.AFFILIATE]: [],
      [TAB_TYPE.INSURANCE]: [],
      [TAB_TYPE.COMPETE]: [],
      [TAB_TYPE.OTHER]: [],
    },
    system: {
      [TAB_TYPE.ALL]: [],
      [TAB_TYPE.FLAG]: [],
      [TAB_TYPE.FINANCIAL]: [],
      [TAB_TYPE.AFFILIATE]: [],
      [TAB_TYPE.INSURANCE]: [],
      [TAB_TYPE.COMPETE]: [],
      [TAB_TYPE.OTHER]: [],
    },
  },
  filterNotification: {
    admin: [],
    system: [],
  },
  totalUnread: 0,
};

export function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LIST_NOTIFICATION:
      const newList = { ...state.listNotification };
      newList[action.payload.category][action.payload.type] = formatNotification(
        action.payload.data,
      );

      return {
        ...state,
        listNotification: newList,
      };
    case SET_MORE_LIST_NOTIFICATION:
      const newListLoadMore = { ...state.listNotification };

      newListLoadMore[action.payload.category][action.payload.type] = formatNotification(
        uniqBy(
          [
            ...newListLoadMore[action.payload.category][action.payload.type],
            ...action.payload.data,
          ],
          'uid',
        ),
      );

      return {
        ...state,
        listNotification: newListLoadMore,
      };

    case READ_NOTIFICATION_NEW:
      const newListRead = { ...state.listNotification };

      if (action.payload.type !== TAB_TYPE.ALL) {
        newListRead[action.payload.category][action.payload.type] = newListRead[
          action.payload.category
        ][action.payload.type].map((item) => {
          if (item?.uid === action.payload.uid) {
            return {
              ...item,
              read: true,
            };
          }
          return item;
        });
      }
      newListRead[action.payload.category][TAB_TYPE.ALL] = newListRead[action.payload.category][
        TAB_TYPE.ALL
      ].map((item) => {
        if (item?.uid === action.payload.uid) {
          return {
            ...item,
            read: true,
          };
        }
        return item;
      });
      newListRead[action.payload.category][TAB_TYPE.FLAG] = newListRead[action.payload.category][
        TAB_TYPE.FLAG
      ].map((item) => {
        if (item?.uid === action.payload.uid) {
          return {
            ...item,
            read: true,
          };
        }
        return item;
      });

      return {
        ...state,
        listNotification: newListRead,
      };
    case READ_ALL_NOTIFICATION_NEW:
      const newListReadAll = { ...state.listNotification };

      const types = Object.values(TAB_TYPE);
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        newListReadAll[action.payload.category][type] = newListReadAll[action.payload.category][
          type
        ].map((item) => {
          if (!item?.read) {
            return {
              ...item,
              read: true,
            };
          }
          return item;
        });
      }

      return {
        ...state,
        listNotification: newListReadAll,
      };
    case UNREAD_NOTIFICATION_NEW:
      const newListUnread = { ...state.listNotification };

      if (action.payload.type !== TAB_TYPE.ALL) {
        newListUnread[action.payload.category][action.payload.type] = newListUnread[
          action.payload.category
        ][action.payload.type].map((item) => {
          if (item?.uid === action.payload.uid) {
            return {
              ...item,
              read: false,
            };
          }
          return item;
        });
      }
      newListUnread[action.payload.category][TAB_TYPE.ALL] = newListUnread[action.payload.category][
        TAB_TYPE.ALL
      ].map((item) => {
        if (item?.uid === action.payload.uid) {
          return {
            ...item,
            read: false,
          };
        }
        return item;
      });
      newListRead[action.payload.category][TAB_TYPE.FLAG] = newListRead[action.payload.category][
        TAB_TYPE.FLAG
      ].map((item) => {
        if (item?.uid === action.payload.uid) {
          return {
            ...item,
            read: true,
          };
        }
        return item;
      });

      return {
        ...state,
        listNotification: newListUnread,
      };

    case FLAG_NOTIFICATION:
      const newListFlag = { ...state.listNotification };
      if (action.payload.type !== TAB_TYPE.ALL) {
        newListFlag[action.payload.category][action.payload.type] = newListFlag[
          action.payload.category
        ][action.payload.type].map((item) => {
          if (item?.uid === action?.payload?.item?.uid) {
            return {
              ...item,
              flag: action?.payload?.isFlag,
            };
          }
          return item;
        });
      }
      newListFlag[action.payload.category][TAB_TYPE.ALL] = newListFlag[action.payload.category][
        TAB_TYPE.ALL
      ].map((item) => {
        if (item?.uid === action?.payload?.item?.uid) {
          return {
            ...item,
            flag: action?.payload?.isFlag,
          };
        }
        return item;
      });
      if (action?.payload?.isFlag) {
        newListFlag[action.payload.category][TAB_TYPE.FLAG] = formatNotification([
          {
            ...action?.payload?.item,
            flag: action?.payload?.isFlag,
          },
          ...newListFlag[action.payload.category][TAB_TYPE.FLAG],
        ]);
      } else {
        newListFlag[action.payload.category][TAB_TYPE.FLAG] = newListFlag[action.payload.category][
          TAB_TYPE.FLAG
        ].filter((item) => {
          return item?.uid !== action?.payload?.item?.uid;
        });
      }

      return {
        ...state,
        listNotification: newListFlag,
      };

    case SET_FILTER_NOTIFICATION:
      const newFilter = { ...state.filterNotification };
      newFilter[action.payload.category] = action.payload.data;
      return {
        ...state,
        filterNotification: newFilter,
      };
    case SET_TOTAL_UNREAD_NOTIFICATION:
      return {
        ...state,
        totalUnread: Number(action.payload) ?? 0,
      };
    case INCREASE_TOTAL_UNREAD_NOTIFICATION:
      return {
        ...state,
        totalUnread: state.totalUnread > 0 ? state.totalUnread + 1 : 0,
      };

    default:
      return state;
  }
}
