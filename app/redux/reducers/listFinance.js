import { LIST_FINANCE } from '../actions/types';

export const listFinance = (state = [], action) =>
  (action.type === LIST_FINANCE ? action.payload : state);
