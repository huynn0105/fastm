import { uniqBy } from 'lodash';
import { TAB_TYPE } from '../../../screenV3/Customer/Customer.constants';
import {
  ADD_PRIORITY_CUSTOMER,
  REMOVE_CUSTOMER,
  REMOVE_CUSTOMER_LINK,
  REMOVE_PRIORITY_CUSTOMER,
  SET_CURRENT_NUM_TAB,
  SET_LIST_CUSTOMER,
  SET_LIST_CUSTOMER_LINK,
  SET_LIST_CUSTOMER_PENDING,
  SET_LIST_CUSTOMER_TRASH,
  SET_LIST_DAA_REFERRAL,
  SET_LIST_FILTER_CUSTOMER,
  SET_LIST_INSURANCE_REFERRAL,
  SET_LIST_PL_REFERRAL,
  SET_MORE_LIST_CUSTOMER,
  SET_MORE_LIST_CUSTOMER_LINK,
  SET_MORE_LIST_CUSTOMER_PENDING,
  SET_MORE_LIST_CUSTOMER_TRASH,
  SET_TOTAL_NUM_LINK_TAB,
  SET_TOTAL_NUM_TAB,
  UPDATE_CUSTOMER,
  SET_TAB_INDEX_CUSTOMER,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  listFilterCustomer: [],
  totalNum: {},
  currentNum: {},
  listCustomer: [],
  listCustomerTrash: [],
  listCustomerPending: [],
  listCustomerLink: [],
  totalNumLink: {},

  //
  listPlReferral: [],
  listInsuranceReferral: [],
  listDaaReferral: [],
  //
  listPlReferralHistory: [],
  listInsuranceReferralHistory: [],
  listDaaReferralHistory: [],

  tabIndex: 0,
};

export function customerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LIST_FILTER_CUSTOMER: {
      const { payload } = action;
      return {
        ...state,
        listFilterCustomer: payload,
      };
    }
    case SET_TOTAL_NUM_TAB: {
      const { payload } = action;
      return {
        ...state,
        totalNum: payload,
      };
    }
    case SET_CURRENT_NUM_TAB: {
      const { group, payload } = action;

      return {
        ...state,
        currentNum: {
          ...state.currentNum,
          [group]: payload,
        },
      };
    }
    case SET_LIST_CUSTOMER: {
      const { payload } = action;
      return {
        ...state,
        listCustomer: uniqBy(payload, 'ID'),
      };
    }
    case SET_MORE_LIST_CUSTOMER: {
      const { payload } = action;
      return {
        ...state,
        listCustomer: uniqBy([...state.listCustomer, ...payload], 'ID'),
      };
    }
    case SET_LIST_CUSTOMER_TRASH: {
      const { payload } = action;

      return {
        ...state,
        listCustomerTrash: uniqBy(payload, 'ID'),
      };
    }
    case SET_MORE_LIST_CUSTOMER_TRASH: {
      const { payload } = action;
      return {
        ...state,
        listCustomerTrash: uniqBy([...state.listCustomerTrash, ...payload], 'ID'),
      };
    }
    case SET_LIST_CUSTOMER_PENDING: {
      const { payload } = action;

      return {
        ...state,
        listCustomerPending: uniqBy(payload, 'ID'),
      };
    }
    case SET_MORE_LIST_CUSTOMER_PENDING: {
      const { payload } = action;
      return {
        ...state,
        listCustomerPending: uniqBy([...state.listCustomerPending, ...payload], 'ID'),
      };
    }
    case ADD_PRIORITY_CUSTOMER: {
      const { payload, group } = action;

      if (group === TAB_TYPE.TRASH) {
        let newListCustomer = [...state.listCustomerTrash];

        newListCustomer = newListCustomer.map((item) => {
          if (payload?.ID == item?.ID) {
            return {
              ...item,
              isPrioritized: '1',
            };
          }
          return item;
        });
        return {
          ...state,
          listCustomerTrash: newListCustomer,
        };
      }

      let newListCustomer = [...state.listCustomer];

      newListCustomer = newListCustomer.map((item) => {
        if (payload?.ID == item?.ID) {
          return {
            ...item,
            isPrioritized: '1',
          };
        }
        return item;
      });
      return {
        ...state,
        listCustomer: newListCustomer,
      };
    }
    case REMOVE_PRIORITY_CUSTOMER: {
      const { payload, group } = action;

      if (group === TAB_TYPE.TRASH) {
        let newListCustomer = [...state.listCustomerTrash];

        newListCustomer = newListCustomer.map((item) => {
          if (payload?.ID == item?.ID) {
            return {
              ...item,
              isPrioritized: '0',
            };
          }
          return item;
        });
        return {
          ...state,
          listCustomerTrash: newListCustomer,
        };
      }

      let newListCustomer = [...state.listCustomer];

      newListCustomer = newListCustomer.map((item) => {
        if (payload?.ID == item?.ID) {
          return {
            ...item,
            isPrioritized: '0',
          };
        }
        return item;
      });
      return {
        ...state,
        listCustomer: newListCustomer,
      };
    }
    case REMOVE_CUSTOMER: {
      const { payload, group } = action;
      if (group === TAB_TYPE.TRASH) {
        let newListCustomer = [...state.listCustomerTrash];
        newListCustomer = newListCustomer.filter((item) => payload?.ID != item?.ID);
        return {
          ...state,
          listCustomerTrash: newListCustomer,
        };
      }
      if (group === TAB_TYPE.PAGE) {
        let newListCustomer = [...state.listCustomerPending];
        newListCustomer = newListCustomer.filter((item) => payload?.ID != item?.ID);
        return {
          ...state,
          listCustomerPending: newListCustomer,
        };
      }
      let newListCustomer = [...state.listCustomer];
      newListCustomer = newListCustomer.filter((item) => payload?.ID != item?.ID);
      return {
        ...state,
        listCustomer: newListCustomer,
      };
    }
    case SET_LIST_CUSTOMER_LINK: {
      const { payload } = action;
      return {
        ...state,
        listCustomerLink: payload,
      };
    }
    case SET_MORE_LIST_CUSTOMER_LINK: {
      const { payload } = action;
      return {
        ...state,
        listCustomerLink: [...state.listCustomerLink, ...payload],
      };
    }
    case SET_TOTAL_NUM_LINK_TAB: {
      const { payload } = action;

      return {
        ...state,
        totalNumLink: payload,
      };
    }
    case REMOVE_CUSTOMER_LINK: {
      const { payload } = action;
      let newListCustomerLink = [...state.listCustomerLink];
      const newTotalNumLink = { ...state.totalNumLink };

      newListCustomerLink = newListCustomerLink.filter((item) => {
        const isRemove = `${item.id}` === `${payload?.ID}`;
        return !isRemove;
      });

      newTotalNumLink.total = Number(newTotalNumLink?.total) - 1 || 0;
      newTotalNumLink[payload?.type] = Number(newTotalNumLink[payload?.type]) - 1 || 0;
      return {
        ...state,
        listCustomerLink: newListCustomerLink,
        totalNumLink: newTotalNumLink,
      };
    }
    case SET_LIST_PL_REFERRAL: {
      const { payload } = action;
      return {
        ...state,
        listPlReferral: payload,
      };
    }
    case SET_LIST_INSURANCE_REFERRAL: {
      const { payload } = action;
      return {
        ...state,
        listInsuranceReferral: payload,
      };
    }
    case SET_LIST_DAA_REFERRAL: {
      const { payload } = action;
      return {
        ...state,
        listDaaReferral: payload,
      };
    }
    case UPDATE_CUSTOMER: {
      const { payload, group } = action;
      if (group === TAB_TYPE.TRASH) {
        const newListCustomer = [...state?.listCustomerTrash]?.map((item) => {
          if (item?.ID === payload?.ID) {
            return {
              ...item,
              ...payload,
            };
          }
          return item;
        });
        return {
          ...state,
          listCustomerTrash: newListCustomer,
        };
      }
      if (group === TAB_TYPE.PAGE) {
        const newListCustomer = [...state?.listCustomerPending]?.map((item) => {
          if (item?.ID === payload?.ID) {
            return {
              ...item,
              ...payload,
            };
          }
          return item;
        });
        return {
          ...state,
          listCustomerPending: newListCustomer,
        };
      }
      const newListCustomer = [...state?.listCustomer]?.map((item) => {
        if (item?.ID === payload?.ID) {
          return {
            ...item,
            ...payload,
          };
        }
        return item;
      });
      return {
        ...state,
        listCustomer: newListCustomer,
      };
    }
    case SET_TAB_INDEX_CUSTOMER: {
      const { payload } = action;
      return {
        ...state,
        tabIndex: payload,
      };
    }
    default:
      return state;
  }
}
