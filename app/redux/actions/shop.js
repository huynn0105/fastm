import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FETCHING_SHOP_ITEMS,
  SHOP_ITEMS,
  FETCHING_SHOP_V2_ITEMS,
  SHOP_V2_ITEMS,
  MAIN_GROUP,
} from './types';
import DigitelClient from '../../network/DigitelClient';

import { HOME_ITEM_STORAGE, HOME_MAIN_GROUP } from '../../utils/AsyncStorageUtil';

export function fetchingShopItems(fetching) {
  return {
    type: FETCHING_SHOP_ITEMS,
    payload: fetching,
  };
}

export function updataShopItems(shopItems) {
  return {
    type: SHOP_ITEMS,
    payload: shopItems,
  };
}

export function fetchShopItems() {
  const doneFetching = (dispatch, items) => {
    dispatch(updataShopItems(items));
    dispatch(fetchingShopItems(false));
  };

  const addCommingItem = (items) => {
    return [...items];
  };

  return (dispatch) => {
    dispatch(fetchingShopItems(true));
    DigitelClient.mfGetShopItems()
      .then((items) => {
        doneFetching(dispatch, addCommingItem(items));
      })
      .catch(() => {
        doneFetching(dispatch, []);
      });
  };
}

export function fetchingShopV2Items(fetching) {
  return {
    type: FETCHING_SHOP_V2_ITEMS,
    payload: fetching,
  };
}

export function updateShopV2Items(shopItems) {
  return {
    type: SHOP_V2_ITEMS,
    payload: shopItems,
  };
}

export function updateMainGroup(main_group) {
  return {
    type: MAIN_GROUP,
    payload: main_group,
  };
}

export function fetchShopV2Items() {
  const doneFetching = (dispatch, items, main_group) => {
    dispatch(updateShopV2Items(items));
    dispatch(updateMainGroup(main_group));
    dispatch(fetchingShopV2Items(false));
  };

  const addCommingItem = (items) => {
    return [...items];
  };

  return (dispatch) => {
    dispatch(fetchingShopV2Items(true));
    DigitelClient.fetchShopV2()
      .then((data) => {
        const { data: items, main_group } = data;
        try {
          AsyncStorage.setItem(HOME_ITEM_STORAGE, JSON.stringify(items));
          AsyncStorage.setItem(HOME_MAIN_GROUP, JSON.stringify(main_group));
        } catch (error) {}

        doneFetching(dispatch, addCommingItem(items), main_group);
      })
      .catch(() => {
        doneFetching(dispatch, [], []);
      });
  };
}

export function loadShopV2FromLocal() {
  return async (dispatch) => {
    try {
      const items = await AsyncStorage.getItem(HOME_ITEM_STORAGE);
      const main_group = await AsyncStorage.getItem(HOME_MAIN_GROUP);

      if (items) {
        dispatch(updateShopV2Items(JSON.parse(items)));
      }
      if (main_group) {
        dispatch(updateMainGroup(JSON.parse(main_group)));
      }
    } catch (error) {}
  };
}
