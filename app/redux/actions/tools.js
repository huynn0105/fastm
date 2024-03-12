import { HOME_TOOLS } from './types';
import DigitelClient from '../../network/DigitelClient';

export function toolItems(data) {
  return {
    type: HOME_TOOLS,
    payload: data,
  };
}

export function fetchToolItems() {
  return async (dispatch) => {
    try {
      const tools = await DigitelClient.fetchTools();
      dispatch(toolItems(tools));
    } catch (error) {
      dispatch(toolItems([]));
    }
  };
}
