import {
  SET_ENABLE_NOTE,
  SET_HIGHTLIGHT_PROJECTS,
  SET_USER_CONFIG,
  SET_USER_PASSCODE,
  SET_LIST_CTVS,
  SET_LIST_NOTIS,
  SET_MORE_LIST_CTVS,
  SET_USER_DELETE_ACCOUNT,
  SET_OVERVIEW_CORE_AGENT,
  SET_TIME_CHECKING,
  SET_STATISTIC_WORKING,
} from '../../actions/actionsV3/actionTypes';

const initialState = {
  data: [],
  isUsePasscode: false,
  enableNote: true,
  highLightProjects: [],
  listCTVs: [],
  listNotis: [],
  deleteAccount: {},
  overviewCoreAgent: {},
  timeChecking: {},
};

export function userConfigs(state = initialState, action) {
  switch (action.type) {
    case SET_USER_CONFIG: {
      const { payload } = action;
      return {
        ...state,
        data: payload,
      };
    }
    case SET_USER_PASSCODE: {
      return {
        ...state,
        isUsePasscode: action.payload,
      };
    }
    case SET_ENABLE_NOTE: {
      return {
        ...state,
        enableNote: action.payload,
      };
    }
    case SET_HIGHTLIGHT_PROJECTS: {
      return {
        ...state,
        highLightProjects: action.payload,
      };
    }
    case SET_LIST_CTVS: {
      return {
        ...state,
        listCTVs: [...action.payload],
      };
    }
    case SET_MORE_LIST_CTVS: {
      return {
        ...state,
        listCTVs: [...state.listCTVs, ...action.payload],
      };
    }
    case SET_LIST_NOTIS: {
      return {
        ...state,
        listNotis: action.payload,
      };
    }
    case SET_USER_DELETE_ACCOUNT: {
      return {
        ...state,
        deleteAccount: action.payload,
      };
    }
    case SET_OVERVIEW_CORE_AGENT: {
      return {
        ...state,
        overviewCoreAgent: action.payload,
      };
    }
    case SET_TIME_CHECKING: {
      return {
        ...state,
        timeChecking: action.payload,
      };
    }
    case SET_STATISTIC_WORKING: {
      return {
        ...state,
        statisticWorking: action.payload,
      };
    }
    default:
      return state;
  }
}
