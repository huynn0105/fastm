import {
  SET_COLLABORATOR_CHART,
  SET_COLLABORATOR_CURRENT_INDEX,
  SET_EXP_CHART,
  SET_FILTER_RATING,
  SET_HIER_INFO_USER,
  SET_LEGEND_CHART,
  SET_MY_SUPPORTER,
  SET_TAB_INDEX_COLLABORATOR,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  hierInfoUser: {},
  legendChart: {},
  expChart: {},
  comChart: {},
  collaboratorChart: {},
  currentIndex: 0,
  mySupporter: {},
  filterRating: {},

  tabIndex: 0,
};

export function collaboratorReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COLLABORATOR_CURRENT_INDEX: {
      const { payload } = action;
      return {
        ...state,
        currentIndex: payload,
      };
    }
    case SET_HIER_INFO_USER: {
      const { payload } = action;
      return {
        ...state,
        hierInfoUser: payload,
      };
    }
    case SET_LEGEND_CHART: {
      const { payload } = action;
      return {
        ...state,
        legendChart: payload,
      };
    }
    case SET_EXP_CHART: {
      const { payload } = action;
      return {
        ...state,
        expChart: payload,
      };
    }
    case SET_COLLABORATOR_CHART: {
      const { payload } = action;
      return {
        ...state,
        collaboratorChart: payload,
      };
    }
    case SET_MY_SUPPORTER: {
      const { payload } = action;
      return {
        ...state,
        mySupporter: payload,
      };
    }
    case SET_FILTER_RATING: {
      const { payload } = action;
      return {
        ...state,
        filterRating: payload,
      };
    }
    case SET_TAB_INDEX_COLLABORATOR: {
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
