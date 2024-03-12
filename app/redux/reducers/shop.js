import {
  FETCHING_SHOP_ITEMS,
  SHOP_ITEMS,
  FETCHING_SHOP_V2_ITEMS,
  SHOP_V2_ITEMS,
  MAIN_GROUP,
} from '../actions/types';

export function shopItems(state = [], action) {
  switch (action.type) {
    case SHOP_ITEMS:
      return action.payload;
    default:
      return state;
  }
}

export function fetchingShopItems(state = [], action) {
  switch (action.type) {
    case FETCHING_SHOP_ITEMS:
      return action.payload;
    default:
      return state;
  }
}

export function shopV2Items(state = [], action) {
  switch (action.type) {
    case SHOP_V2_ITEMS:
      return action.payload;
    default:
      return state;
  }
}

export function fetchingShopV2Items(state = [], action) {
  switch (action.type) {
    case FETCHING_SHOP_V2_ITEMS:
      return action.payload;
    default:
      return state;
  }
}

export function mainGroup(state = [], action) {
  switch (action.type) {
    case MAIN_GROUP:
      return action.payload;
    default:
      return state;
  }
}
