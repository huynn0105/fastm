import { applyMiddleware, combineReducers, createStore } from 'redux'; // eslint-disable-line
import thunk from 'redux-thunk';
import { AppInfoDefault, Configs } from '../../constants/configs';
import { User } from '../../models';
import * as firebaseReducer from '../../submodules/firebase/redux/reducers';
import initStateFirebase from '../../submodules/firebase/redux/store';
import { OTP_RESULT_TYPE } from '../actions/otp';
import * as rootReducer from '../reducers';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';

const bindMiddleware = (middleware) => applyMiddleware(...middleware);

// --------------------------------------------------

const initialState = {
  ...initStateFirebase,

  rootScreen: 'LOADING',
  internetState: true,
  systemStatus: {
    available: true,
    status: 0,
    freeze_page: '',
  },

  currentScreenName: 'Home',

  homeNavigate: {
    screen: null,
    params: null,
  },

  pendingOpenDeepLink: {
    path: null,
    params: null,
  },

  appInfo: AppInfoDefault,

  isGetBanksProcessing: false,
  getBanksResponse: {},
  isGetBankBranchesProcessing: false,
  getBankBranchesResponse: {},

  isLoginProcessing: false,
  loginResponse: {},
  isLogoutProcessing: false,
  logoutResponse: {},
  myUser: User,

  myUsers: [],

  isResetPasswordProcessing: false,
  resetPasswordResponse: {
    step: 0,
    shouldAlert: false,
    status: false,
    message: null,
  },
  resetPasswordInfo: {
    step: 1,
    userID: '',
    phoneNumber: '',
    actionCode: '',
    isShowingAlert: false,
  },

  isRegisterProcessing: false,
  registerResponse: {},

  isSendPasswordProcessing: false,
  sendPasswordResponse: {},

  isUpdateProfileProcessing: false,
  updateProfileResponse: {},
  isImportantUpdateProfileProcessing: false,
  importantUpdateProfileResponse: {},

  isGetOwnersProcessing: false,
  getOwnersResponse: {},

  isGetUsersProcessing: false,
  getUsersResponse: {},

  isGetSubscriptionsProcessing: false,
  getSubscriptionsResponse: {},
  subscriptions: {
    items: [],
    availableCount: 0,
    kiNo: 0,
  },

  isGetNewsProcessing: false,
  getNewsResponse: {},
  noticeNews: [],
  totalUnReadNoticeNews: 0,

  isGetKnowledgesProcessing: false,
  getKnowledgesResponse: {},
  knowledges: [],
  totalUnReadKnowledges: 0,

  isGetGiftsProcessing: false,
  getGiftsResponse: {},
  gifts: [],

  isGetMoneyHistoryProcessing: false,
  getMoneyHistoryResponse: {},
  moneyHistory: [],

  isGetPointsHistoryProcessing: false,
  getPointsHistoryResponse: {},
  pointsHistory: [],

  isRedeemGiftProcessing: false,
  redeemGiftResponse: {},

  isRegisterFirebaseTokenProcessing: false,
  registerFirebaseTokenResponse: {},
  isGetNotificationsProcessing: false,
  getNotificationsResponse: {},
  adminNotifications: [],
  systemNotifications: [],
  totalUnReadAdminNotifications: 0,
  totalUnReadSystemNotifications: 0,

  totalUnReadAdminNotificationsFb: -1,
  totalUnReadSystemNotificationsFb: -1,

  pendingNotification: null,
  pendingNotificationList: [],

  isFetchContactsProcessing: false,
  allContacts: [],

  isGetLoginActivityProcessing: false,
  getLoginActivityResponse: {},
  loginActivities: [],

  isGetUserBankList: false,
  userBankList: [],

  isGettingNewsSlideList: false,
  newsSlideList: [],

  isGettingUserAppList: false,
  userAppList: [],

  isGettingUserAppLightList: false,
  userAppLightList: [],

  isGettingBadLoans: false,
  badLoans: null,

  promotionEvent: {},

  activeTabbar: true,

  contestItem: {},

  sip: {},

  adminGiftedNotifications: [],
  systemGiftedNotifications: [],

  systemGiftedUnreadNotifications: [],
  adminGiftedUnreadNotifications: [],

  helpItem: {},

  fetchingShopItems: false,
  shopItems: [],

  delMod: {},
  withdrawInfos: [],
  withdrawTerm: '',

  fetchingFinancialServiceItems: false,
  financialServiceItems: [],

  fetchingCustomerFormData: false,
  customerFormData: null,
  districtsObject: {},
  customerFormFoundDistricts: [],
  financialCustomerForm: {},
  insuranceCustomerForm: {},
  digitalWalletCustomerForm: {},
  topUpCustomerForm: {},
  mobileCardCustomerForm: {},
  solarCustomerForm: {},

  fetchingMobileCardPaymentURLData: false,
  mobileCardPaymentURLData: {},

  sendingOTP: false,
  sendingOTPResult: OTP_RESULT_TYPE.NONE,
  requestWithOTPResult: OTP_RESULT_TYPE.NONE,

  isFetchingOSTicketTopics: false,
  osTicketTopics: [],

  isFetchingListOSTicketByUserID: false,
  listOSTicketByUserID: {},
  totalListOSTicketByUserID: {},

  isFetchingThreadByTicketID: false,
  threadByTicketID: [],

  isCreatingAnOSTicket: false,
  createAnOSTicketResponse: {},

  isPostingThread: false,
  postThreadResponse: {},

  loadingAccountData: false,

  isFetchingGlobalCareURLData: false,
  globalCareURLData: {},
  fetchingTopUpPaymentURLData: false,

  topupStatus: {},

  conversationContacts: [],
  invitationsRequestsContact: { invitations: [], sendingRequests: [] },
  fetchingConversationContacts: false,

  toolItems: [],
  postList: [],
  invitationInfo: {},

  shopV2Items: [],
  fetchingShopV2Items: false,
};

// --------------------------------------------------

let mCreateStoreFunc = null;
const allReducers = Object.assign({}, firebaseReducer, rootReducer);

const combinedReducer = combineReducers(allReducers);

const reducer = (state, action) => {
  if (action.type === 'RESET_APP_STATE') {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage: FilesystemStorage,
  whitelist: [
    'collaboratorReducer',
    'customerReducer',
    'userConfigs',
    'appInfo',
    'userMetaData',
    'myUser',
    'mtradeReducer',
  ],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const middlewares = [];
middlewares.push(thunk);
mCreateStoreFunc = createStore(persistedReducer, initialState, bindMiddleware(middlewares));

const createStoreFunc = mCreateStoreFunc;

let persistor = persistStore(createStoreFunc);
export { persistor };

export default createStoreFunc;
