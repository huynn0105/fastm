import {
  IS_GET_LOGIN_ACTIVITY_PROCESSING,
  GET_LOGIN_ACTIVITY_RESPONSE,
  LOGIN_ACTIVITY_RESPONSE,
  APPEND_LOGIN_ACTIVITY,
} from '../actions/types';

export function isGetLoginActivityProcessing(state = false, action) {
  return action.type === IS_GET_LOGIN_ACTIVITY_PROCESSING ? action.payload : state;
}

export function getLoginActivityResponse(state = {}, action) {
  return action.type === GET_LOGIN_ACTIVITY_RESPONSE ? action.payload : state;
}
export function loginActivities(state = [], action) {
  switch (action.type) {
    case LOGIN_ACTIVITY_RESPONSE:
      return groupActivityByMonth(action.payload);
    case APPEND_LOGIN_ACTIVITY:
      return [].concat(append2ArrayActivities(state, groupActivityByMonth(action.payload)));
    default:
      return state;
  }
}

function groupActivityByMonth(items) {
  const grouped = items.reduce((preResult, item) => {
    const result = preResult;
    result[item.formattedMonth] = result[item.formattedMonth] || [];
    result[item.formattedMonth].push(item);
    return result;
  }, []);

  const months = Object.keys(grouped);
  const result = months.map((month) => {
    return { 
      title: month, 
      data: grouped[month],
    };
  });

  return result;
}

function append2ArrayActivities(arr1, arr2) {
  // append exist keys to old arr
  for (let i1 = 0; i1 < arr1.length; i1 += 1) {
    const item1 = arr1[i1];
    for (let i2 = 0; i2 < arr2.length; i2 += 1) {
      const item2 = arr2[i2];
      if (item1.title === item2.title) {
        arr1[i1].data = arr1[i1].data.concat(arr2[i2].data);
      }
    }
  }

  // append new keys to old arr
  for (let i2 = 0; i2 < arr2.length; i2 += 1) {
    const item2 = arr2[i2];
    let existIndex = -1;
    for (let i1 = 0; i1 < arr1.length; i1 += 1) {
      const item1 = arr1[i1];
      if (item1.title === item2.title) {
        existIndex = i1;
        break;
      }
    }

    if (existIndex === -1) {
      arr1.push(arr2[i2]);
    }
  }

  return arr1;
}