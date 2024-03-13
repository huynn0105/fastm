import { HOME_TOOLS } from '../actions/types';

export const toolItems = (state = [], action) =>
  (action.type === HOME_TOOLS ? action.payload : state);
