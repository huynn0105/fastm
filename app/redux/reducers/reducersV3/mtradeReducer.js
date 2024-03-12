import {
  ADD_ITEM_LIST_MTRADE_CARD,
  ADD_ITEM_LIST_MTRADE_PRODUCT_HISTORY,
  MTRADE_CODE,
  REMOVE_ITEM_LIST_MTRADE_CARD,
  RESET_FILTER,
  RESET_TEXT_SEARCH,
  SET_FILTER,
  SET_LIST_MAIN_BANNER,
  SET_LIST_MAIN_PRODUCT,
  SET_LIST_MTRADE_BANNER,
  SET_LIST_MTRADE_CARD,
  SET_LIST_MTRADE_CATEGORY,
  SET_LIST_MTRADE_FILTER,
  SET_LIST_MTRADE_LOCATION,
  SET_LIST_MTRADE_PRODUCT,
  SET_LIST_MTRADE_PRODUCT_HISTORY,
  SET_LOCATION,
  SET_MORE_LIST_MTRADE_CARD,
  SET_MORE_LIST_MTRADE_PRODUCT,
  SET_MTRADE_BONUS,
  SET_MTRADE_CODE,
  SET_TEXT_SEARCH,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  listMainBanner: [],
  listMainProduct: [],
  listMTradeBanner: [],
  listMTradeCategory: [],
  listMTradeFilter: [],
  listMTradeLocation: [],
  filter: {},
  textSearch: '',
  location: '',
  listMTradeProduct: [],
  listMTradeProductHistory: [],
  listMTradeCard: [],
  mtradeCode: {},
  mtradeBonus: {},
};

export function mtradeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LIST_MAIN_BANNER: {
      const { payload } = action;
      return {
        ...state,
        listMainBanner: payload,
      };
    }
    case SET_LIST_MAIN_PRODUCT: {
      const { payload } = action;
      return {
        ...state,
        listMainProduct: payload,
      };
    }
    case SET_LIST_MTRADE_BANNER: {
      const { payload } = action;
      return {
        ...state,
        listMTradeBanner: payload,
      };
    }
    case SET_LIST_MTRADE_CATEGORY: {
      const { payload } = action;
      return {
        ...state,
        listMTradeCategory: payload,
      };
    }
    case SET_LIST_MTRADE_FILTER: {
      const { payload } = action;
      return {
        ...state,
        listMTradeFilter: payload,
      };
    }
    case RESET_FILTER: {
      return {
        ...state,
        filter: {},
      };
    }
    case SET_FILTER: {
      const { payload } = action;
      return {
        ...state,
        filter: payload,
      };
    }
    case RESET_TEXT_SEARCH: {
      return {
        ...state,
        textSearch: '',
      };
    }
    case SET_FILTER: {
      const { payload } = action;
      return {
        ...state,
        filter: payload,
      };
    }
    case SET_TEXT_SEARCH: {
      const { payload } = action;
      return {
        ...state,
        textSearch: payload,
      };
    }
    case SET_LIST_MTRADE_PRODUCT: {
      const { payload } = action;
      return {
        ...state,
        listMTradeProduct: payload,
      };
    }
    case SET_LIST_MTRADE_PRODUCT: {
      const { payload } = action;
      return {
        ...state,
        listMTradeProduct: payload,
      };
    }
    case SET_MORE_LIST_MTRADE_PRODUCT: {
      const { payload } = action;
      return {
        ...state,
        listMTradeProduct: [...state.listMTradeProduct, ...payload],
      };
    }
    case SET_LIST_MTRADE_LOCATION: {
      const { payload } = action;
      return {
        ...state,
        listMTradeLocation: payload,
      };
    }
    case SET_LOCATION: {
      const { payload } = action;
      return {
        ...state,
        location: payload,
      };
    }
    case SET_LIST_MTRADE_PRODUCT_HISTORY: {
      const { payload } = action;
      return {
        ...state,
        listMTradeProductHistory: payload,
      };
    }
    case ADD_ITEM_LIST_MTRADE_PRODUCT_HISTORY: {
      const { payload } = action;
      let newList = [...state.listMTradeProductHistory];
      newList = newList.filter((item) => item.code !== payload.code);
      newList = [payload, ...newList];
      newList = newList.slice(0, 20);

      return {
        ...state,
        listMTradeProductHistory: newList,
      };
    }
    case SET_LIST_MTRADE_CARD: {
      const { payload } = action;
      return {
        ...state,
        listMTradeCard: payload,
      };
    }
    case SET_LIST_MTRADE_CARD: {
      const { payload } = action;
      return {
        ...state,
        listMTradeCard: payload,
      };
    }
    case SET_MORE_LIST_MTRADE_CARD: {
      const { payload } = action;
      return {
        ...state,
        listMTradeCard: [...state.listMTradeCard, ...payload],
      };
    }
    case ADD_ITEM_LIST_MTRADE_CARD: {
      const { payload } = action;
      let newList = [...state.listMTradeCard];
      newList = newList.filter((item) => item.ID !== payload.ID);
      newList = [payload, ...newList];

      return {
        ...state,
        listMTradeCard: newList,
      };
    }
    case REMOVE_ITEM_LIST_MTRADE_CARD: {
      const { payload } = action;
      let newList = [...state.listMTradeCard];
      newList = newList.filter((item) => item.ID !== payload.ID);

      return {
        ...state,
        listMTradeCard: newList,
      };
    }
    case SET_MTRADE_CODE: {
      const { payload } = action;

      return {
        ...state,
        mtradeCode: payload,
      };
    }
    case SET_MTRADE_BONUS: {
      const { payload } = action;

      return {
        ...state,
        mtradeBonus: payload,
      };
    }
    default:
      return state;
  }
}
