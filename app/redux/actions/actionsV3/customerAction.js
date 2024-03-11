/* eslint-disable handle-callback-err */
import DigitelClient from '../../../network/DigitelClient';
import { TYPE_LINK } from '../../../screenV3/AdLink/AdLink.constants';
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
  SET_TAB_INDEX_CUSTOMER,
  SET_TOTAL_NUM_LINK_TAB,
  SET_TOTAL_NUM_TAB,
  UPDATE_CUSTOMER,
} from './actionTypes';

export const getListFilterCustomer = (callback) => {
  return (dispatch) => {
    DigitelClient.getListFilterCustomer()
      .then((response) => {
        if (response?.status) {
          const data = [];

          response?.data?.data?.forEach((item) => {
            if (item?.projects?.length) {
              const newProjects = item?.projects.map((project) => {
                return {
                  id: project?.id || project?.ID || project?.projectID,
                  title: project?.projectName || project?.name || project?.customer_label,
                  type:
                    project?.finance === '1'
                      ? TAB_TYPE.FINANCIAL
                      : project?.insurrance === '1'
                      ? TAB_TYPE.INSURANCE
                      : null,
                };
              });
              const newItem = {
                ...item,
                key: item?.key_filter,
                projects: newProjects,
              };

              data.push(newItem);
            }
          });

          dispatch({ type: SET_LIST_FILTER_CUSTOMER, payload: data || [] });
          dispatch({ type: SET_TOTAL_NUM_TAB, payload: response?.data?.total });
        }
        callback?.(response?.status);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getListCustomer = (params = {}, callback) => {
  return (dispatch) => {
    DigitelClient.getListCustomer(params)
      .then((response) => {
        const data = response?.data || [];
        const total = response?.totalByGroup || 0;

        if (response?.status) {
          let action;

          if (params?.group === TAB_TYPE.PAGE) {
            action = params?.page > 1 ? SET_MORE_LIST_CUSTOMER_PENDING : SET_LIST_CUSTOMER_PENDING;
          } else if (params?.group === TAB_TYPE.TRASH) {
            action = params?.page > 1 ? SET_MORE_LIST_CUSTOMER_TRASH : SET_LIST_CUSTOMER_TRASH;
          } else {
            action = params?.page > 1 ? SET_MORE_LIST_CUSTOMER : SET_LIST_CUSTOMER;
          }

          dispatch({
            type: action,
            payload: data,
          });

          if (params?.group && params?.page === 1) {
            dispatch(setTotalNum(params?.group, total));
          }
        }
        callback?.(response?.status, data, total);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getCustomerDetail = (params, callback) => {
  return (dispatch) => {
    DigitelClient.getCustomerDetail(params)
      .then((response) => {
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const addPriorityCustomer = (item, callback, group) => {
  return (dispatch) => {
    const payload = {};
    payload.ID = item?.ID;

    DigitelClient.addPriorityCustomer(payload)
      .then((response) => {
        if (response?.status) {
          const newItem = {
            ...item,
          };
          dispatch({ type: ADD_PRIORITY_CUSTOMER, payload: item, group });
          dispatch(addTotalNum(TAB_TYPE.PRIORITY));
          if (item?.type === TAB_TYPE.PAGE && group !== TAB_TYPE.TRASH) {
            dispatch(subtractTotalNum(TAB_TYPE.PAGE));
          }

          callback?.(response?.status, response?.data, newItem);
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const removePriorityCustomer = (item, callback, group, isRemove) => {
  return (dispatch) => {
    const payload = {};
    payload.ID = item.ID;

    DigitelClient.removePriorityCustomer(payload)
      .then((response) => {
        if (response?.status) {
          dispatch({ type: REMOVE_PRIORITY_CUSTOMER, payload: item, group });
          dispatch(subtractTotalNum(TAB_TYPE.PRIORITY));
          if (item?.type === TAB_TYPE.PAGE && group !== TAB_TYPE.TRASH) {
            dispatch(addTotalNum(TAB_TYPE.PAGE));
          }
          if (isRemove) {
            dispatch({ type: REMOVE_CUSTOMER, payload: item, group });
          }
        }
        callback?.(response?.status);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const sendEmailDoc = (id, email, type, callback) => {
  return (dispatch) => {
    const payload = {};
    payload.ID = id;
    payload.mail = email;
    payload.type = type;
    DigitelClient.sendEmailDoc(payload)
      .then((response) => {
        callback?.(response?.status);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getListCustomerLink = (params = {}, callback) => {
  return (dispatch) => {
    DigitelClient.getListCustomerLink(params)
      .then((response) => {
        const data = response?.data?.length ? response?.data : [];
        if (response?.status) {
          const typeLink = params?.type || TYPE_LINK.ALL;
          dispatch({
            type:
              !params?.page || params?.page === 1
                ? SET_LIST_CUSTOMER_LINK
                : SET_MORE_LIST_CUSTOMER_LINK,
            payload: data,
            typeLink,
          });
        }
        callback?.(response?.status, data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getCountCustomerLink = (callback) => {
  return (dispatch) => {
    DigitelClient.getCountCustomerLink()
      .then((response) => {
        if (response?.status) {
          dispatch({
            type: SET_TOTAL_NUM_LINK_TAB,
            payload: response?.data,
          });
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getPosterLink = (id, callback) => {
  return (dispatch) => {
    const payload = {};
    payload.ID = id;
    DigitelClient.getPosterLink(payload)
      .then((response) => {
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const sendEmailLink = (id, email, callback) => {
  return (dispatch) => {
    const payload = {};
    payload.ID = id;
    payload.mail = email;
    DigitelClient.sendEmailLink(payload)
      .then((response) => {
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getViewLink = (id, callback) => {
  return (dispatch) => {
    const payload = {};
    if (id) {
      payload.ID = id;
    }

    DigitelClient.getViewLink(payload)
      .then((response) => {
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const createAdLink = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.createAdLink(payload)
      .then((response) => {
        if (response?.status) {
          dispatch(getListFilterCustomer());
        }
        callback?.(response?.status, response?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const editAdLink = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.editAdLink(payload)
      .then((response) => {
        if (response?.status) {
          dispatch(getListFilterCustomer());
        }
        callback?.(response?.status, response?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const removeAdLink = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.removeAdLink({ ID: payload?.ID })
      .then((response) => {
        if (response?.status) {
          dispatch(getListFilterCustomer());
          dispatch({ type: REMOVE_CUSTOMER_LINK, payload });
        }
        callback?.(response?.status, response?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getListPlReferral = (keySearch, callback) => {
  return (dispatch) => {
    DigitelClient.getListPlReferral(keySearch)
      .then((response) => {
        if (response?.status && !keySearch) {
          dispatch({ type: SET_LIST_PL_REFERRAL, payload: response?.data });
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};
export const getListInsuranceReferral = (keySearch, callback) => {
  return (dispatch) => {
    DigitelClient.getListInsuranceReferral(keySearch)
      .then((response) => {
        if (response?.status && !keySearch) {
          dispatch({ type: SET_LIST_INSURANCE_REFERRAL, payload: response?.data });
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};
export const getListDaaReferral = (keySearch, callback) => {
  return (dispatch) => {
    DigitelClient.getListDaaReferral(keySearch)
      .then((response) => {
        if (response?.status && !keySearch) {
          dispatch({ type: SET_LIST_DAA_REFERRAL, payload: response?.data });
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const trashCustomer = (payload, callback, group) => {
  return (dispatch) => {
    DigitelClient.trashCustomer(payload)
      .then((response) => {
        if (response?.status) {
          if (payload?.deleteAll) {
            if (group === TAB_TYPE.PAGE) {
              dispatch({ type: SET_LIST_CUSTOMER_PENDING, payload: [] });
            }
            if (group === TAB_TYPE.TRASH) {
              dispatch({ type: SET_LIST_CUSTOMER_TRASH, payload: [] });
            }

            dispatch(setTotalNum(group, 0));
          } else {
            dispatch(subtractTotalNum(TAB_TYPE.PAGE));
            dispatch(addTotalNum(TAB_TYPE.TRASH));
          }
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const subtractTotalNum = (group) => (dispatch, getState) => {
  const total = getState()?.customerReducer?.totalNum;
  dispatch({
    type: SET_TOTAL_NUM_TAB,
    payload: {
      ...total,
      [group]: total[group] - 1 || 0,
    },
  });
};

export const addTotalNum = (group) => (dispatch, getState) => {
  const total = getState()?.customerReducer?.totalNum;
  dispatch({
    type: SET_TOTAL_NUM_TAB,
    payload: {
      ...total,
      [group]: (total[group] || 0) + 1,
    },
  });
};

export const setTotalNum = (group, number) => (dispatch, getState) => {
  const total = getState()?.customerReducer?.totalNum;
  dispatch({
    type: SET_TOTAL_NUM_TAB,
    payload: {
      ...total,
      [group]: number,
    },
  });
};

export const subtractCurrentPage = (number) => (dispatch, getState) => {
  const current = getState()?.customerReducer?.currentNum;
  dispatch({
    type: SET_CURRENT_NUM_TAB,
    payload: number !== undefined ? number : current.page_qc - 1 || 0,
    group: TAB_TYPE.PAGE,
  });
};
export const addCurrentPage = (number) => (dispatch, getState) => {
  const current = getState()?.customerReducer?.currentNum;
  dispatch({
    type: SET_CURRENT_NUM_TAB,
    payload: number !== undefined ? number : Number(current.page_qc || 0) + 1,
    group: TAB_TYPE.PAGE,
  });
};

export const clearTrashCustomer = (callback) => {
  return (dispatch) => {
    DigitelClient.clearTrashCustomer()
      .then((response) => {
        if (response?.status) {
          dispatch(setTotalNum(TAB_TYPE.TRASH, 0));
          dispatch({
            type: SET_LIST_CUSTOMER_TRASH,
            payload: [],
          });
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getUserAdLink = (code, callback) => {
  return (dispatch) => {
    DigitelClient.getUserAdLink(code)
      .then((response) => {
        if (response?.status) {
        }
        callback?.(response?.status, response?.data);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const syncListPriorityCustomer = (itemsAdd, idsDelete) => (dispatch, getState) => {
  const group = TAB_TYPE.PRIORITY;
  let listPriority = getState().customerReducer.listCustomer[group];

  idsDelete = idsDelete.map((item) => Number(item));
  listPriority = [...itemsAdd, ...listPriority];

  listPriority = listPriority?.filter(
    (item) => item?.priorityID && !idsDelete?.includes(Number(item?.priorityID)),
  );

  dispatch({
    type: SET_LIST_CUSTOMER,
    payload: listPriority,
    group,
  });
};

export const getStatisticCustomerByDate = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.getStatisticCustomerByDate(payload)
      .then((response) => {
        console.log('aaa-15:', response);
        callback?.(response?.data?.status, response?.data?.data || response?.data?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};
export const getStatisticCustomerByTotalProduct = (callback) => {
  return (dispatch) => {
    DigitelClient.getStatisticCustomerByTotalProduct()
      .then((response) => {
        callback?.(response?.data?.status, response?.data?.data || response?.data?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};
export const getStatisticCustomerByHandler = (callback) => {
  return (dispatch) => {
    DigitelClient.getStatisticCustomerByHandler()
      .then((response) => {
        callback?.(response?.data?.status, response?.data?.data || response?.data?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};

export const getStatisticCustomerByProgress = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.getStatisticCustomerByProgress(payload)
      .then((response) => {
        if (response?.data?.status) {
        }
        callback?.(response?.data?.status, response?.data?.data || response?.data?.message);
      })
      .catch((err) => {
        callback?.(false);
      });
  };
};
export const updateCustomer = (payload, callback, localPayload, group) => {
  return (dispatch) => {
    DigitelClient.updateCustomer(payload)
      .then((response) => {
        const status = response?.data?.status;
        if (status) {
          dispatch({ type: UPDATE_CUSTOMER, payload: { ...payload, ...localPayload }, group });
        }
        callback?.(status, response?.data?.message, response?.message);
      })
      .catch((err) => {
        callback?.(false, err?.message);
      });
  };
};
export const getDetailCustomerProject = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.getDetailCustomerProject(payload)
      .then((response) => {
        const status = response?.data?.status;
        callback?.(status, response?.data?.data || response?.data?.message);
      })
      .catch((err) => {
        callback?.(false, err?.message);
      });
  };
};
export const getStatisticCustomerByLink = (payload, callback) => {
  return (dispatch) => {
    DigitelClient.getStatisticCustomerByLink(payload)
      .then((response) => {
        const status = response?.data?.status;
        callback?.(status, response?.data?.data || response?.data?.message);
      })
      .catch((err) => {
        callback?.(false, err?.message);
      });
  };
};
export const setTabIndexCustomer = (index) => {
  return (dispatch) => {
    dispatch({ type: SET_TAB_INDEX_CUSTOMER, payload: index });
  };
};
