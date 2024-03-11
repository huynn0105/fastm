/**
  API promise template:
    success -> return some kind of objects or response
    error -> reject with errorResponse which is { status, mesage }

  This class only be used through actions because this is lower level
*/

/* eslint-disable */
import Utils, { getAppVersion, getDeviceTrackingInfo } from 'app/utils/Utils';
import axios from 'axios';
import { Alert, Platform } from 'react-native';
import { Configs } from '../constants/configs';
import AppStrings from '../constants/strings';
import {
  BadLoans,
  Bank,
  Contest,
  DELMob,
  Gift,
  Help,
  Knowledge,
  LoginActivity,
  MoneyTransaction,
  News,
  NewsSlide,
  PointsTransaction,
  Promotion,
  ShopItem,
  Subscription,
  SubscriptionLight,
  User,
  UserApp,
  UserAppLight,
  Version,
} from '../models';
import CustomerForm from '../models/CustomerForm';
import BroadcastManager from '../submodules/firebase/manager/BroadcastManager';
import { getParams } from '../utils/getParams';
import AxiosClient, { AxiosMfastClient, AxiosOSTicketClient } from './AxiosClient';
import { ERROR_CODE, ERROR_STATUS } from './ErrorCode';
import { ErrorHandler } from './ErrorHandler';
import { isArray } from 'lodash';

const LOG_TAG = 'DigitelClient.js';
/* eslint-enable */

// --------------------------------------------------
// API ERROR TYPES
// --------------------------------------------------

export const API_ERROR_CODES = {
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  INVALID_ACCESS_TOKEN: 'INVALID_ACCESS_TOKEN',
  UNKNOWN_ERROR: 'UNKNOW_ERROR',
};

// --------------------------------------------------

const API_LIST = {
  ACKS_LIST: 'main/acks_list',
  APP_FREEZE: 'main/app-freeze',
  APP_INFO: 'main/app-info',
  BANK_BRANCH_LIST: 'main/bank-branch-list',
  BANK_LIST: 'main/bank-list',
  CONTEST: 'main/contests',
  DEL_MOB: 'fe_del/dpd_3',
  FEEDBACK: 'user/feedback',
  GIFT_LIST: 'main/gift-list',
  GIFT_REDEEM: 'main/gift_redeem',
  HELP: 'main/tools',
  LOGIN_HISTORY: 'user/login_history',
  LOGIN_TOKEN: 'user/login_token',
  NEWS_COUNT_UP: 'main/news_count_up',
  NEWS_LIST: 'main/news_list',
  NEWS_SLIDE: 'main/slide_list',
  OWNER_LIST: 'fe_credit/owner_list',
  POPUP: 'user/get_popup',
  PROMOTIONS: 'main/promotions',
  READ_POPUP: 'user/read_popup',
  REFERRAL_LIST: 'fe_credit/referral_list',
  REGISTER: 'user/register',
  REGISTER_VALIDATE: 'user/register_validate',
  RESEND_PASSWORD: 'user/resend-password',
  RESET_PASSWORD_2: 'user/reset_password_2',
  SHOP_ITEMS: 'main/shop_items',
  SUBSCRIPTIONS: 'fe_credit/subscriptions',
  TRACKING_API: 'marketing/app_event',
  TRACKING_EVENT: 'main/tracking_event',
  TRANSACTIONS: 'user/transactions',
  TRANSACTIONS_POINT: 'user/transactions_point',
  UPDATE_PROFILE: 'user/update-profile',
  UPDATE_PROFILE_OTP_2: 'user/update_profile_otp_2',
  USER_APP_LIST: 'user/app_list',
  USER_APP_LIST_LIGHT: 'user/app_list_period',
  USER_BAD_LOAN: 'fe_del/dpd_2',
  USER_BANK_LIST: 'user/bank_list',
  USER_INFO: 'user/info',
  VERSION: 'main/version',

  HO_GENERATE_CARD: 'ho_admin/app_generate_cart',
  HO_SEND_MAIL: 'ho_admin/app_send_mail',
  HO_SAVE_CARD: 'ho_admin/save_card',
  HO_REQUEST_PROCESS: 'ho_admin/request_process',

  UPLOAD_IMG: 'ho_admin/gen_path_img',

  CHECK_TOPUP: 'payment/check_topup',

  MOBILE_CARD_PAYMENT_URL_DATA: 'payment/mobile_card',
  TOP_UP_PAYMENT_URL_DATA: 'payment/topup',

  // TOOLS
  TOOLS: 'main/convenients',
  INVITE: 'mfast/invite_ctv',

  DPD: 'mfast/show_dpd',

  // solar
  SOLAR_GET_PROCESS: 'solar/get_process',
  SOLAR_GET_PROVINCES: 'solar/get_provinces',
  SOLAR_GET_DISTRICTS: 'solar/get_district',
  SOLAR_GET_WARDS: 'solar/get_wards',
  SUBMIT_SOLAR: 'solar/submit_solar',

  //
  GET_NOTIFICATIONS: 'notification/get_categories',
  SUBSCRIBE_NOTIFICATIONS: 'notification/category_subscribe',

  // validate cmnd
  CHECK_IDNUMBER_EXISTS: 'user/idNumber_exist',

  //
  OCR_IDENTIFY: 'ocr/identify',

  //survey

  GET_SURVEY_POPUP: 'survey/survey',

  SEND_SURVEY: 'survey/survey_save',
  FPT_LIVENESS: 'liveness/identify',

  //send mass message
  PUSH_MASS_MESSAGE: 'notification/push_notify',
  GET_LIST_PUSH: 'notification/get_notify_log',

  // customer tab
  GET_LIST_FILTER_CUSTOMER: 'potential_customer/list_filter',
  GET_LIST_CUSTOMER: 'potential_customer/list_customer',
  GET_CUSTOMER_DETAIL: 'potential_customer/detail_customer',
  ADD_PRIORITY_CUSTOMER: 'potential_customer/add_priority',
  REMOVE_PRIORITY_CUSTOMER: 'potential_customer/delete_priority',
  REMOVE_CUSTOMER: 'potential_customer/delete_customer',
  SEND_EMAIL_DOC: 'potential_customer/send_email_doc',
  GET_LIST_CUSTOMER_LINK: 'potential_customer/list_customer_link',
  GET_COUNT_CUSTOMER_LINK: 'potential_customer/COUNT_customer_link',
  GET_POSTER_LINK: 'potential_customer/load_poster',
  SEND_EMAIL_LINK: 'potential_customer/send_email_link',
  GET_VIEW_LINK: 'potential_customer/view_link',
  CREATE_AD_LINK: 'potential_customer/create_link',
  EDIT_AD_LINK: 'potential_customer/edit_link',
  REMOVE_AD_LINK: 'potential_customer/delete_link',
  GET_LIST_PL_REFERRAL: 'potential_customer/list_pl',
  GET_LIST_INSURANCE_REFERRAL: 'potential_customer/list_insurance',
  GET_LIST_DAA_REFERRAL: 'potential_customer/list_daa',
  TRASH_CUSTOMER: 'potential_customer/delete_customer',
  CLEAR_TRASH_CUSTOMER: 'potential_customer/delete_trash',
  GET_USER_AD_LINK: 'potential_customer/get_user',
  GET_STATISTIC_CUSTOMER_BY_DATE: 'potential_customer/statistics_customer_by_date',
  GET_STATISTIC_CUSTOMER_BY_TOTAL_PRODUCT: 'potential_customer/statistics_customer_by_project',
  GET_STATISTIC_CUSTOMER_BY_HANDLER: 'potential_customer/statistics_customer_by_handler',
  GET_STATISTIC_CUSTOMER_BY_PROCESS: 'potential_customer/statistics_customer_by_progress',
  UPDATE_CUSTOMER: 'potential_customer/update_customer',
  GET_DETAIL_CUSTOMER_PROJECT: 'potential_customer/detail_project',
  GET_STATISTIC_CUSTOMER_BY_LINK: 'potential_customer/statistics_customer_link',

  // MTRADE
  LIST_MTRADE_BANNER: 'mtrade/list_banner',
  LIST_MTRADE_CATEGORY: 'mtrade/list_product_group',
  LIST_MTRADE_FILTER: 'mtrade/list_filter',
  LIST_MTRADE_PRODUCT: 'mtrade/product_filter',
  LIST_MTRADE_KEY_SEARCH: 'mtrade/filter_suggestion',
  LIST_MTRADE_LOCATION: 'mtrade/delivery_support',
  SET_MTRADE_LOCATION: 'mtrade/user_tracking_delivery_support',
  MTRADE_DETAIL_PRODUCT: 'mtrade/product_detail',
  MTRADE_CREATE_ORDER: 'mtrade/create_order',
  LIST_MTRADE_CARD: 'mtrade/get_cart_product',
  MTRADE_CODE: 'mtrade/check_project_code',
  ADD_MTRADE_CARD: 'mtrade/add_carts',
  REMOVE_MTRADE_CARD: 'mtrade/remove_cart_item',
  LIST_MTRADE_AREA: 'mtrade/load_resource_location',
  MTRADE_BONUS: 'mtrade/get_mtrade_bonus',
  MTRADE_INDIRECT_BONUS: 'mtrade/get_indirect_bonus',
  LIST_MTRADE_ORDER: 'mtrade/get_order_detail',
  MTRADE_BONUS_BY_COLLABORATOR: 'mtrade/get_list_bonus_by_collaborator',
  MTRADE_DETAIL_PRODUCT_BY_ATTRIBUTE: 'mtrade/get_detail_by_product_attribute',

  TRACKING_AGENT: 'tracking/tracking_agent',

  DELETE_COLLABORATOR: 'collaborator_leave/remove_collaborators_not_working',
  CHECK_DELETING_COLLABORATOR: 'collaborator_leave/check_process_remove_collaborators',

  TOTAL_UNREAD_NOTIFICATION: 'notification/numUnreadNoti',
  CHECK_TIME_CHECKING: 'checking_time/time_checking_config',
  STATISTIC_WORKING: 'sale_core_report_statistic/report_statistic_config',
};

const MFAST_API_LIST = {
  LOGIN: '/authorization/login',
  REGISTER: '/authorization/register',
  REQUEST_OTP: '/authorization/otp',
  SEND_LOGIN_NOTIFICATION: '/authorization/warning_notify',
  // Financial Services
  FINANCIAL_SERVICES: 'non_user/financial_services',
  // Shop
  SHOP: 'non_user/shop_items',
  // News - Posts
  POSTS: 'non_user/posts',
  // Knowledges
  USER_LIST: 'authorization/same_mobilePhone',
  USER_NOTE: 'authorization/update_note',
  USER_UPDATE: 'authorization/update',
  KNOWLEDGES: 'non_user/updated_knowledges',
  // Customer Forms
  CUSTOMER_FORMS: 'product/list_form_v2',
  // List District
  LIST_DISTRICT: 'general/load_district',

  // Customer Form - Global Care
  CUSTOMER_FORM_GET_GLOBAL_CARE_URL: 'product/global_care',

  POST_LIST: 'posts/list',
  KNOWLEDGE: 'general/acks_list',
  KNOWLEDGES_V2: 'general/acks_list_v2',

  CONTEST: 'general/contests',

  LOAD_PROVINCE: '/general/load_province',
  UPDATE_PROFILE: 'authorization/update_profile',

  SHOP_V2: 'non_user/shop_items_v2',
  VERSION_MFAST: 'main/version_mfast',
  GEN_LINK_REF: 'main/gen_link_referral',

  BUBBLE: 'general/bubble',
  SUPPORT_LINE: 'general/support',

  TERM_POPUP_LOGIN: 'general/term_popup_on_login',
  SUBMIT_TERM_POPUP_LOGIN: 'general/term_popup_on_login_callback',
  //
  OCR_IDENTIFY: 'ocr/identify',

  USER_CONFIG: 'Personal/list_setting',

  SEND_EMAIL_OTP: 'Personal/sent_otp_email',
  VERIFY_EMAIL_OTP: 'Personal/verify_otp_email',

  // get user meta
  USER_META_DATA: 'Personal/meta_data',
  UPDATE_META_DATA: 'Personal/update_meta_data',

  POPUP_BRAND: 'Personal/get_popup_brand',

  //
  SEND_PHONE_OTP: 'General/sent_otp',
  VERIFY_PHONE_OTP: 'General/verify_otp',

  // banks
  LIST_BANKS: 'general/banks',
  LIST_BANKS_BRANCHES: 'general/bank_branches',
  ADD_BANKING: 'personal/banking',
  ADD_MOMO: 'personal/momo_wallet',
  CANCEL_MOMO: 'personal/momo_cancel',
  MY_BANKING: 'personal/bank_list',

  SEND_TAX_COMMIT: 'personal/send_tax_commit',
  SEND_TAX_COMMIT_PHOTO: 'personal/tax_committed_photo',

  CHECK_TAX_NUMBER: 'personal/check_tax_number',
  GET_TAXT_NUMBER: 'personal/tax_number',

  CHECK_DUP_PHONE: 'personal/check_duplicate_mobile_phone',

  UPDATE_PHONE_NUMBER: 'personal/update_mobile_phone',

  UPDATE_CMND: 'Personal/u_meta_data_tmp',

  CHECK_DUP_NICKNAME: 'personal/check_duplicate_full_name',

  // get list
  LIST_PRIVACY_CONFIG: 'personal/privacy_configs',
  UPDATE_PRIVACY_CONFIG: 'personal/update_privacy_configs',

  // get province/district/ward
  GET_LIST_AREA: 'General/load_resource',
  TAX_REGISTER: 'personal/tax_register',
  SEARCH_USER_BY_NICKNAME: 'personal/search_by_nickname_or_mfastcode',
  ARENA_INFO: 'Personal/arena_info',
  THREAD_PUBLIC: 'general/public_chat_thread',
  CREATE_PASSCODE: 'authorization/create_password',
  LOGIN_BY_PASSCODE: 'authorization/login_by_password',
  CHECK_USING_PASSCODE: 'authorization/is_use_passcode',
  TOGGLE_USING_PASSCODE: 'personal/change_passcode_verify_status',

  // tips
  POSTS_TIPS: 'Posts/list_tips',

  // list finance
  LIST_FINANCE: 'Product/list_finance',

  //get presence status user

  GET_PRESENCE_STATUS_USER: 'Personal/status_user',

  //tracking

  TRACKING_EVENT_REPORT_APPAY: 'Non_user/moengage_event',
  GET_LIST_HIGHLIGHT_PROJECTS: 'non_user/highlight_project',
  CHECK_DUP_EMAIL: 'Personal/request_check_email',

  //send ins cert

  SAVE_INS_CERT: 'personal/ins_certificate_save',
  INS_USER_ESIGN: 'personal/ins_user_esign',
  //list_ctv
  GET_LIST_CTV: 'Personal/list_ctv',
  GET_INS_CERT: 'personal/img_ins_certificate',

  // Collaborator
  GET_INFO_COLLABORATOR: 'hierarchical/hier_info_user',
  GET_EXPERIENCE_CHART: 'hierarchical/point_chart',
  GET_INCOME_CHART: 'hierarchical/commission_chart',
  GET_COLLABORATOR_CHART: 'hierarchical/collaborator_chart',
  GET_LEGENDARY_CHART: 'hierarchical/detail_table',
  GET_FILTER_COLLABORATOR: 'hierarchical/collaborator_filter',
  GET_LIST_COLLABORATOR: 'hierarchical/collaborator',
  GET_LIST_COLLABORATOR_PENDING: 'hierarchical/user_pending',
  GET_FILTER_RATING: 'hierarchical/rating_filter',
  GET_LIST_RATING: 'hierarchical/load_page_rating_user',
  RATING_USER: 'hierarchical/rating',
  GET_RATING_USER: 'Personal/detail_user_rating',
  GET_WORKING_CHART: 'hierarchical/working_user',

  //
  HAS_DELETE_ACCOUNT: 'personal/can_self_delete',
  DELETE_ACCOUNT: 'personal/self_delete',

  //
  HAS_CHANGE_SUPPORTER: 'Personal/check_user_can_leave',
  GET_LIST_SUPPORTER: 'Personal/mentor_filter',
  SEND_REQUEST_SUPPORTER: 'Personal/mentor_change_process',
  GET_SUPPORTER_WAITING: 'Personal/mentor_reselect',
  REMOVE_SUPPORTER: 'Personal/mentor_change_to_free',

  //Collaborator leave
  GET_FILTER_COLLABORATOR_LEAVE: 'collaborator_leave/get_level',
  GET_LIST_COLLABORATOR_LEAVE: 'collaborator_leave/get_users',
  GET_COLLABORATOR_LEAVE: 'collaborator_leave/get_collaborator_leave',

  //bank
  SET_DEFAULT_BANK: 'personal/set_default_bank',
  DELETE_BANK: 'personal/delete_bank',
  GET_INFO_WITHDRAWAL_MONEY: 'withdrawal/withdrawal_info',
  CHECK_WITHDRAWAL_MONEY: 'withdrawal/withdrawal_validate',
  SENT_OTP_WITHDRAW_MONEY: 'withdrawal/send_otp',
  WITHDRAW_MONEY: 'withdrawal/process',
  WITHDRAW_MONEY_HISTORY: 'withdrawal/history',
  GET_STATISTIC_MONEY: 'personal/statistic_money',
  GET_FEE_WITHDRAW_MONEY: 'withdrawal/get_fee',
  EXPORT_STATEMENT: 'withdrawal/export_statement',
  GET_KBANK_DATA: 'Personal/meta_data_kbank',
  GET_DETAIL_COLLABORATOR_PENDING: 'personal/list_rsa_waiting',
  CONFIRM_COLLABORATOR_PENDING: 'personal/action_rsa_waiting',

  //
  LIST_MAIN_BANNER: 'non_user/news',
  LIST_MAIN_PRODUCT: 'non_user/customer_requirements',

  DELETE_ACCOUNT_V2: 'Personal/account_delete_request',
  CHECK_DELETE_ACCOUNT_V2: 'Personal/request_delete_check',
  CANCEL_DELETE_ACCOUNT_V2: 'Personal/account_delete_cancel_request',

  GET_BIDV_DATA: 'Personal/meta_data_bidv',
  GET_USER_BIDV_DATA: 'personal/bidv_bank_data',

  OVERVIEW_CORE_AGENT: 'Personal/core_agent',
};

const OS_TICKET_API = {
  GET_TICKET_BY_USER_ID: '/get_ticket_userID.php',
  GET_TOPICS: '/get_topic.php',
  GET_THREAD_BY_TICKET_NUMBER: '/get_thread_ticket.php',
  CREATE_TICKET: '/create_ticket_api.php',
  POST_THREAD: '/post_thread.php',
};

const UNKNOWN_ERROR_RESPONSE = {
  errorCode: API_ERROR_CODES.UNKNOWN_ERROR,
  status: false,
  message: AppStrings.unknown_error,
};

const API_STATUS_CODE = {
  INVALID_ACCESS_TOKEN: 403,
};

// --------------------------------------------------

// const axios = require('axios');

// export const axiosClient = axios.create({
//   baseURL: Configs.apiBaseURL,
//   auth: Configs.apiBasicAuthorization,
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// });

const QueryString = require('query-string');

const axiosClient = AxiosClient.shared();
const axiosMFastClient = AxiosMfastClient.shared();
const axiosOSTicketClient = AxiosOSTicketClient.shared();

// --------------------------------------------------

class DigitelClient {
  static userID = '';
  static userAccessToken = '';
  static defaultParams = {
    mobileApp: 'mfast',
    os: Platform.OS,
    appVersion: __DEV__ ? '3.0.1' : getAppVersion(),
    accessToken: DigitelClient.userAccessToken || null,
  };
  static userType = '';

  static checkEmptyAccessToken() {
    return DigitelClient.userAccessToken === '';
  }

  static checkSameToken(token) {
    return DigitelClient.userAccessToken === token;
  }

  static setup(userID, userAccessToken, type) {
    DigitelClient.userID = userID;
    DigitelClient.userAccessToken = userAccessToken;
    DigitelClient.userType = type;
    DigitelClient.defaultParams = {
      mobileApp: 'mfast',
      os: Platform.OS,
      appVersion: __DEV__ ? '3.0.1' : getAppVersion(),
      accessToken: DigitelClient.userAccessToken,
    };
  }

  /**
   * Help to log axios error
   */
  static logAxiosError(error, api = 'API') {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      Utils.warn(`${LOG_TAG} ${api} axios response: `, error.response);
    }
    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      Utils.warn(`${LOG_TAG} ${api} axios request: `, error.request);
    }
    // rarely need -> disabled
    // Utils.warn(`${LOG_TAG} ${api} message: `, error.message);
    // Utils.warn(`${LOG_TAG} ${api} config: `, error.config);
  }

  /**
   * Make sure if an axius error/exception occur, it will be log & have message
   */
  static handleAxiosError(error, api = 'API') {
    DigitelClient.logAxiosError(error, api);
    // access token invalid
    if (error.response && error.response.status === API_STATUS_CODE.INVALID_ACCESS_TOKEN) {
      BroadcastManager.shared().notifyObservers(BroadcastManager.NAME.USER.INVALID_TOKEN);
      return Promise.reject(UNKNOWN_ERROR_RESPONSE);
    }
    // other errors
    if (error.response && error.response.data && error.response.data.status !== undefined) {
      const response = Object.assign(UNKNOWN_ERROR_RESPONSE, error.response.data);
      return Promise.reject(response);
    }
    // unknow error
    return Promise.reject(UNKNOWN_ERROR_RESPONSE);
  }

  /**
   * Make sure if a response failed, it will be log & have message
   */
  static handleFailResponse(response, api = 'API') {
    Utils.warn(`${LOG_TAG}: handleFailResponse ${api}: `, response);
    const message = Object.assign(UNKNOWN_ERROR_RESPONSE, response);
    return Promise.reject(message);
  }

  // --------------------------------------------------

  static checkSystemStatus() {
    return axiosClient
      .get(API_LIST.APP_FREEZE)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
        return null;
      })
      .catch(() => {});
  }

  // --------------------------------------------------

  static getAppInfo() {
    const api = 'getAppInfo';
    return axiosClient
      .get(API_LIST.APP_INFO, {
        params: {
          ...DigitelClient.defaultParams,
          apiVersion: 'v2',
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return response.data.data;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getPopup() {
    const api = 'getPopup';
    return axiosClient
      .get(API_LIST.POPUP, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data && response.data.status === true) {
          const data = response.data.data;
          if (Array.isArray(data) && data.length > 0) {
            return data[0];
          }
        }
        return null;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static readPopup(popupID, isRead = null) {
    const api = 'readPopup';
    return axiosClient
      .get(API_LIST.READ_POPUP, {
        params: {
          ...DigitelClient.defaultParams,
          postID: popupID,
          isRead,
        },
      })
      .then((response) => {
        return response.status;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getBanksList() {
    const api = 'getBanksList';
    return axiosClient
      .get(API_LIST.BANK_LIST, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return response.data;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getBankBranchesList(bankName) {
    const api = 'getBankBranchesList';
    return axiosClient
      .get(API_LIST.BANK_BRANCH_LIST, {
        params: {
          ...DigitelClient.defaultParams,
          bankName,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return response.data;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getOwners(referralID, keySearch) {
    const api = 'getOwners';
    return axiosClient
      .get(API_LIST.OWNER_LIST, {
        params: {
          ...DigitelClient.defaultParams,
          referralID,
          keySearch,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return response.data;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getUsers(keySearch) {
    const api = 'getUsers';
    return axiosClient
      .get(API_LIST.REFERRAL_LIST, {
        params: {
          ...DigitelClient.defaultParams,
          keySearch,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return response.data;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getUser(userID) {
    const api = 'getUser';
    return axiosClient
      .get(API_LIST.USER_INFO, {
        params: {
          ...DigitelClient.defaultParams,
          userID,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        // get user fail
        if (response.data.status !== true) {
          return DigitelClient.handleFailResponse(response, api);
        }
        // parse user & return
        const userJSON = Object.assign({}, response.data.data, {
          uid: response.data.data.ID,
        });
        const user = User.objectFromLoginJSON(userJSON);
        return user;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  /**
   * Disabled
   * -> Using login via firebase to get firebase auth token
   * -> Keep for reference
   */
  // static login(username, password, deviceUDID) {
  //   return axiosClient.get('user/login', {
  //     params: {
  //       loginID: username,
  //       loginPassword: password,
  //       deviceUDID,
  //     },
  //   })
  //     .then(response => {
  //       return DigitelClient.handleLoginResponse(response);
  //     })
  //     .catch(error => {
  //       return DigitelClient.handleLoginError(error);
  //     });
  // }

  static loginViaFirebase(username, password, deviceUDID) {
    const url = `${Configs.firebaseFunctionsBaseURL}/login`;
    return axiosClient
      .get(url, {
        params: {
          username,
          password,
          deviceUDID,
        },
      })
      .then((response) => {
        return DigitelClient.handleLoginResponse(response);
      })
      .catch((error) => {
        return DigitelClient.handleLoginError(error);
      });
  }

  static loginWithToken(accessToken) {
    return axiosClient
      .get(API_LIST.LOGIN_TOKEN, {
        params: {
          accessToken,
        },
      })
      .then((response) => {
        return DigitelClient.handleLoginResponse(response);
      })
      .catch((error) => {
        return DigitelClient.handleLoginError(error);
      });
  }

  static loginWithTokenViaFirebase(accessToken) {
    const url = `${Configs.firebaseFunctionsBaseURL}/loginToken`;
    return axiosClient
      .get(url, {
        params: {
          accessToken,
        },
      })
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return DigitelClient.handleLoginError(error);
      });
  }

  static handleLoginResponse(response) {
    const api = 'login';
    if (response.data.status !== true) {
      return DigitelClient.handleFailResponse(response, api);
    }

    const userData = response.data.data || [];

    const users = userData.map((user) => {
      if (!user) return {};
      return User.objectFromLoginJSON({ ...user, uid: user.ID });
    });

    // eslint-disable-next-line no-throw-literal
    if (!users) throw { response: { status: 404 } };

    return users;
  }

  static handleRegisterResponse(response) {
    const api = 'login';
    if (response.data.status !== true) {
      return DigitelClient.handleFailResponse(response, api);
    }

    const userData = response.data.data || {};

    const user = User.objectFromLoginJSON({ ...userData, uid: userData.ID });

    // eslint-disable-next-line no-throw-literal
    if (!user) throw { response: { status: 404 } };

    return user;
  }

  static handleLoginError(error) {
    const api = 'login';
    Utils.log(`${LOG_TAG}: handleLoginError: ${error}`, error);
    // custom an error code if invalid token
    if (error.response && error.response.status === 403) {
      return Promise.reject(
        Object.assign(
          {
            errorCode: API_ERROR_CODES.INVALID_ACCESS_TOKEN,
          },
          error.response.data,
        ),
      );
    }
    // custom an error code if wrong password
    if (error.response && error.response.status === 404) {
      return Promise.reject(
        Object.assign(
          {
            errorCode: API_ERROR_CODES.WRONG_PASSWORD,
          },
          error.response.data,
        ),
      );
    }
    // other errors
    return DigitelClient.handleAxiosError(error, api);
  }

  /**
   * Disabled
   * -> Using logout via firebase to un-register push notification tokens
   * -> Keep for reference
   */
  // static logout(deviceUDID, isLogOutOfAllDevices = false) {
  //   const api = 'logout';
  //   const params = {
  //     ...DigitelClient.defaultParams,
  //     deviceUDID,
  //   };
  //   if (isLogOutOfAllDevices) {
  //     params.logoutAllSession = 1;
  //   }
  //   return axiosClient.get('firebase/logout_app', {
  //     params,
  //   })
  //     .then(response => {
  //       // Utils.log(`${LOG_TAG}: ${api} response: `, response);
  //       if (response.data.status !== true) {
  //         Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
  //         return Promise.reject(response);
  //       }
  //       return { status: true };
  //     })
  //     .catch(error => {
  //       // doesn't care if invalid token on logout
  //       if (error.response && error.response.status === 403) {
  //         return Promise.resolve({ status: true });
  //       }
  //       // other errors
  //       return DigitelClient.handleAxiosError(error, api);
  //     });
  // }

  static logoutViaFirebase(deviceUDID, isLogOutOfAllDevices = false) {
    const api = 'logout';
    const url = `${Configs.firebaseFunctionsBaseURL}/logout`;

    return axiosClient
      .get(url, {
        params: {
          userID: DigitelClient.userID,
          userAccessToken: DigitelClient.userAccessToken,
          deviceUDID,
          logoutAllOfSessions: isLogOutOfAllDevices ? 'true' : 'false',
        },
      })
      .then((response) => {
        console.log(`aaa-8: ${LOG_TAG}: ${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(response);
        }
        return { status: true };
      })
      .catch((error) => {
        // doesn't care if invalid token on logout
        if (error.response && error.response.status === 403) {
          return Promise.resolve({ status: true });
        }
        // other errors
        return DigitelClient.handleAxiosError(error, api);
      });
  }

  static getMyUser() {
    const api = 'getMyUser';

    return axiosClient
      .get(API_LIST.LOGIN_TOKEN, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // fail
        if (response.data.status !== true) {
          return DigitelClient.handleFailResponse(response, api);
        }

        // parse user
        const userJSON = Object.assign({}, response.data.data, {
          uid: response.data.data.ID,
        });
        const user = User.objectFromLoginJSON(userJSON);

        return user;
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG}: getMyUser: ${error}`, error);
        // invalid token
        if (error.response && error.response.status === 403) {
          const errorCode = { errorCode: API_ERROR_CODES.INVALID_ACCESS_TOKEN };
          return Promise.reject(Object.assign(errorCode, error.response.data));
        }
        // other errors
        return DigitelClient.handleAxiosError(error, api);
      });
  }

  static requestResetPassword(username, type = 'call') {
    const api = 'requestResetPassword';
    return axiosClient
      .get(API_LIST.RESET_PASSWORD_2, {
        params: {
          ...DigitelClient.defaultParams,
          idNumber: username,
          step: 1,
          type,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(response);
        }
        return response.data.data;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static resetPassword(userID, newPassword, actionCode) {
    const api = 'resetPassword';
    return axiosClient
      .get(API_LIST.RESET_PASSWORD_2, {
        params: {
          ...DigitelClient.defaultParams,
          step: 2,
          userID,
          newPassword,
          actionCode,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(response);
        }
        return true;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static register(userInfo) {
    const api = 'register';

    // map userInfo to params
    const params = userInfo;
    params.idNumber = userInfo.cmnd;
    params.idIssuedDate = userInfo.cmndIssuedDate;
    params.idIssuedBy = userInfo.cmndIssuedPlace;
    params.mobilePhone = userInfo.phoneNumber;
    params.sex = userInfo.gender;
    if (params.ownerReferral) {
      params.ownerID = params.ownerReferral;
      delete params.ownerReferral;
    }
    if (params.userReferral) {
      params.referralID = params.userReferral;
      delete params.userReferral;
    }
    delete params.cmnd;
    delete params.cmndIssuedDate;
    delete params.cmndIssuedPlace;
    delete params.phoneNumber;
    delete params.gender;
    const paramsString = QueryString.stringify(params);

    // request
    return axiosClient
      .put(API_LIST.REGISTER, paramsString)
      .then((response) => {
        // console.log(`${LOG_TAG} ${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(response);
        }
        return { status: true };
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static registerValidate(userInfo) {
    const api = 'register_validate';

    // map userInfo to params
    const params = userInfo;
    params.idNumber = userInfo.cmnd;
    params.mobilePhone = userInfo.phoneNumber;
    delete params.cmnd;
    delete params.cmndIssuedDate;
    delete params.cmndIssuedPlace;
    delete params.phoneNumber;
    delete params.gender;
    delete params.userReferral;
    const paramsString = QueryString.stringify(params);

    // request
    return axiosClient
      .put(API_LIST.REGISTER_VALIDATE, paramsString)
      .then((response) => {
        // console.log(`${LOG_TAG} ${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(response);
        }
        return { status: true };
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, api);
      });
  }

  static requestSendPassword(cmnd) {
    const api = 'requestSendPassword';
    // request
    return axiosClient
      .get(API_LIST.RESEND_PASSWORD, {
        params: {
          idNumber: cmnd,
        },
      })
      .then((response) => {
        // console.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api}: fail: `, response);
          return Promise.reject(response);
        }
        return { status: true };
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static requestImportantUpdateProfile(type = 'call') {
    const api = 'requestImportantUpdateProfile';
    // request
    return axiosClient
      .get(API_LIST.UPDATE_PROFILE_OTP_2, {
        params: {
          ...DigitelClient.defaultParams,
          userID: DigitelClient.userID,
          step: 1,
          type,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return { status: true, step: 1, ...response.data };
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static importantUpdateProfile(actionCode, userInfo) {
    const api = 'importantUpdateProfile';
    // request
    return axiosClient
      .get(API_LIST.UPDATE_PROFILE_OTP_2, {
        params: {
          ...DigitelClient.defaultParams,
          userID: DigitelClient.userID,
          step: 2,
          actionCode,
          ...userInfo,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}: ${api} fail: `, response);
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return { status: true, step: 2, ...response.data };
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, api);
      });
  }

  static updateProfile(userInfo) {
    const api = 'updateMyProfile';
    // request
    return axiosClient
      .get(API_LIST.UPDATE_PROFILE, {
        params: {
          ...DigitelClient.defaultParams,
          ...userInfo,
        },
      })
      .then((response) => {
        console.log(`aaa-9: ${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          Utils.warn(`${LOG_TAG}.${api} fail: `, response);
          return Promise.reject(response);
        }
        return { status: true };
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getSubscriptions() {
    const api = 'getSubscriptions';
    return axiosClient
      .get(API_LIST.SUBSCRIPTIONS, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // Utils.log(`${LogTAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        // subscriptions
        const data = response.data.data;
        const subscriptions = data.subscriptions || [];
        let items = [];

        if (DigitelClient.userType === 'light') {
          items = subscriptions
            .map((json) => SubscriptionLight.objectFromJSON(json))
            .filter((item) => item !== null);
        } else {
          items = subscriptions
            .map((json) => Subscription.objectFromJSON(json))
            .filter((item) => item !== null);
        }

        // available subscriptions
        const availableCount = data.subscriptions_left_count || 0;
        const kiNo = data.ki_no || 0;
        return { items, availableCount, kiNo };
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getNews(categoryID, page = 1, perPage = 40) {
    const api = `getNews: {categoryID: ${categoryID}}: `;
    return axiosClient
      .get(API_LIST.NEWS_LIST, {
        params: {
          ...DigitelClient.defaultParams,
          categoryID,
          page,
          perPage,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const news = data.map((json) => News.objectFromJSON(json)).filter((item) => item !== null);
        return news;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static readNews(newsID) {
    const api = `readNews: ${newsID}: `;
    return axiosClient
      .get(API_LIST.NEWS_COUNT_UP, {
        params: {
          ...DigitelClient.defaultParams,
          postID: newsID,
        },
      })
      .then(() => {
        const result = { status: true };
        return result;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getKnowledges(page = 1, perPage = 40) {
    const api = 'getKnowledges';
    return axiosClient
      .get(API_LIST.ACKS_LIST, {
        params: {
          ...DigitelClient.defaultParams,
          page,
          perPage,
        },
      })
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data
          .map((json) => Knowledge.objectFromJSON(json))
          .filter((item) => item !== null);
        return items;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getNotifications(category = 'admin', page = 1, perPage = 20) {}

  static registerFirebaseToken(fcmToken, deviceUDID, deviceType, os, osVersion) {
    const api = `registerFirebaseToken: ${fcmToken}`;
    const params = {
      fcmToken,
      deviceUDID,
      deviceType,
      os,
      osVersion,
    };
    const paramsString = QueryString.stringify(params);
    return axiosClient
      .put(`firebase/register_token?accessToken=${DigitelClient.userAccessToken}`, paramsString)
      .then((response) => {
        // Utils.log(`${LOG_TAG}.${api}: response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return true;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getGifts(page = 1, perPage = 100) {
    const api = 'getGifts';
    return axiosClient
      .get(API_LIST.GIFT_LIST, {
        params: {
          ...DigitelClient.defaultParams,
          page,
          perPage,
        },
      })
      .then((response) => {
        // console.warn(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data.map((json) => Gift.objectFromJSON(json)).filter((item) => item !== null);
        return items;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static redeemGift(giftID) {
    const api = 'redeemGift';
    const params = {
      ...DigitelClient.defaultParams,
      giftID,
    };
    return axiosClient
      .get(API_LIST.GIFT_REDEEM, {
        params,
      })
      .then((response) => {
        // console.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return Object.assign({ message: AppStrings.redeem_success }, response.data);
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getMoneyHistory(fromDate, toDate, page = 1, perPage = 20) {
    const api = 'getMoneyHistory';
    const params = {
      ...DigitelClient.defaultParams,
      page,
      perPage,
    };
    if (fromDate && toDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
    }
    return axiosClient
      .get(API_LIST.TRANSACTIONS, {
        params,
      })
      .then((response) => {
        // console.log(`${LOG_TAG}.${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data
          .map((json) => MoneyTransaction.objectFromJSON(json))
          .filter((item) => item !== null);
        return items;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static getPointsHistory(fromDate, toDate, page = 1, perPage = 20) {
    const api = 'getPointsHistory';
    const params = {
      ...DigitelClient.defaultParams,
      page,
      perPage,
    };
    if (fromDate && toDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
    }
    // Utils.log(`${LogTAG}.${api} getPointsHistory: `, params);
    return axiosClient
      .get(API_LIST.TRANSACTIONS_POINT, {
        params,
      })
      .then((response) => {
        // console.log(`${LOG_TAG} ${api} response: `, response);
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data
          .map((json) => PointsTransaction.objectFromJSON(json))
          .filter((item) => item !== null);
        return items;
      })
      .catch((error) => DigitelClient.handleAxiosError(error, api));
  }

  static trackEvent(event, lat, lon, param1, param2, param3, param4, param5, extraParams) {
    const api = `tracking-1: ${event}`;
    const trackingInfo = getDeviceTrackingInfo();
    const userID = DigitelClient.userID ? DigitelClient.userID : '';

    if (DigitelClient.accessToken === '') {
      return null;
    }

    const params = {
      ...trackingInfo,
      userID,
      event,
      lat,
      lon,
    };

    if (param1) {
      params.param1 = param1;
    }
    if (param2) {
      params.param2 = param2;
    }
    if (param3) {
      params.param3 = param3;
    }
    if (param4) {
      params.param4 = param4;
    }
    if (param5) {
      params.param5 = param5;
    }
    if (extraParams) {
      params.extraParams = JSON.stringify(extraParams);
    }

    return axiosClient
      .get(API_LIST.TRACKING_EVENT, {
        params: {
          ...DigitelClient.defaultParams,
          ...params,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        DigitelClient.handleAxiosError(error, api);
      });
  }

  // login activities
  static getLoginActitivies(userID, page = 1, perPage = 20) {
    const API_LOGIN_HISTORY = 'API_LOGIN_HISTORY';
    return axiosClient
      .get(API_LIST.LOGIN_HISTORY, {
        params: {
          ...DigitelClient.defaultParams,
          userID,
          page,
          perPage,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }

        console.log('aaa-14:', response);

        const data = response.data.data;
        const items = data
          .map((json) => LoginActivity.objectFromJSON(json))
          .filter((item) => item !== null);
        return items;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LOGIN_HISTORY);
      });
  }

  static getNewsSlideList(page = 1, perPage = 30) {
    const API_NEWS_SLIDE = 'API_NEWS_SLIDE';
    return axiosClient
      .get(API_LIST.NEWS_SLIDE, {
        params: {
          ...DigitelClient.defaultParams,
          page,
          perPage,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data
          .map((json) => NewsSlide.objectFromJSON(json))
          .filter((item) => item !== null);

        return items;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_NEWS_SLIDE);
      });
  }

  // get user's banks
  static getUserBankList() {
    const API_USER_BANK = 'API_USER_BANK';
    return axiosClient
      .get(API_LIST.USER_BANK_LIST, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data.map((json) => Bank.objectFromJSON(json)).filter((item) => item !== null);
        return items;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_USER_BANK);
      });
  }

  // get user's app list
  static getUserAppList() {
    const API_USER_APP_LIST = 'API_USER_APP_LIST';
    return axiosClient
      .get(API_LIST.USER_APP_LIST, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = data
          .map((json) => UserApp.objectFromJSON(json))
          .filter((item) => item !== null);
        return items;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_USER_APP_LIST);
      });
  }
  static getUserAppLightList() {
    const API_USER_APP_LIST_LIGHT = 'API_USER_APP_LIST_LIGHT';
    return axiosClient
      .get(API_LIST.USER_APP_LIST_LIGHT, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return [];
          // return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const items = [UserAppLight.objectFromJSON(data)];
        return items;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_USER_APP_LIST_LIGHT);
      });
  }

  // get user's bad loans
  static getBadLoans(date, kiNo) {
    const API_USER_BAD_LOAN = 'API_USER_BAD_LOAN';
    return axiosClient
      .get(API_LIST.USER_BAD_LOAN, {
        params: {
          ...DigitelClient.defaultParams,
          date,
          ki_no: kiNo,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const item = BadLoans.objectFromJSON(data);
        return item;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_USER_BAD_LOAN);
      });
  }
  static getPromotionEvent() {
    const API_PROMOTIONS = 'API_PROMOTIONS';
    return axiosClient
      .get(API_LIST.PROMOTIONS, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const item = Promotion.objectFromJSON(data);
        return item;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_PROMOTIONS);
      });
  }

  static getAppUpdate(version) {
    const API_VERSION = 'API_VERSION';
    return axiosClient
      .get(API_LIST.VERSION, {
        params: {
          version,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const item = Version.objectFromJSON(data);
        return item;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_VERSION);
      });
  }

  static getContestItem() {
    const API_CONTEST = 'API_CONTEST';
    return axiosClient
      .get(API_LIST.CONTEST, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const item = Contest.objectFromJSON(data);
        return item;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_CONTEST);
      });
  }

  static getHelpItem() {
    const API_HELP = 'API_HELP';
    return axiosClient
      .get(API_LIST.HELP, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const item = Help.objectFromJSON(data);
        return item;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_HELP);
      });
  }

  static feedBack({ email, content, images }) {
    const API_FEEDBACK = 'API_FEEDBACK';
    return axiosClient
      .get(API_LIST.FEEDBACK, {
        params: {
          ...DigitelClient.defaultParams,
          email,
          content,
          images,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        return true;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_FEEDBACK);
      });
  }

  static fetchShopItems() {
    return axiosClient
      .get(API_LIST.SHOP_ITEMS, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return [];
        }
        const shopItems = response.data.data.map((shopJson) => ShopItem.objectFromJSON(shopJson));
        return shopItems;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.SHOP_ITEMS);
      });
  }

  static fetchDelMod() {
    return axiosClient
      .get(API_LIST.DEL_MOB, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return {};
        }
        return DELMob.objectFromJSON(response.data.data);
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.SHOP_ITEMS);
      });
  }

  static sendTrackingRecords(data) {
    const url = API_LIST.TRACKING_API;
    return axiosClient
      .post(url, {
        ...data,
      })
      .then((response) => {
        return response.data.status;
      })
      .catch(() => {
        return false;
      });
  }

  static fetchUserBanks() {
    return axiosClient
      .get(`user/banking?accessToken=${DigitelClient.defaultParams.accessToken}`, {})
      .then((response) => {
        if (response.data.status !== true) {
          return { infos: [], term: '' };
        }
        return { infos: response.data.data, term: response.data.term_url };
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.BANKING);
      });
  }

  static fetchTools() {
    return axiosClient
      .get(API_LIST.TOOLS, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        return response.data.status === true ? response.data.data : [];
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.TOOLS);
      });
  }

  // ////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////

  /*  REQUEST UTILS
   */

  static sendRequestAppay(axiosData, startRequest = () => {}, endRequest = () => {}) {
    return new Promise((resolve, reject) => {
      startRequest();
      axiosClient(axiosData)
        .then((response) => {
          // eslint-disable-next-line no-console
          // console.log(`send ${axiosData.url} then`, response);
          resolve(response);
        })
        .catch((error) => {
          console.log(
            '\u001B[31m -> file: DigitelClient.js:1868 -> sendRequest error:',
            axiosData.url,
            axiosData.params,
            error.message,
          );
          // eslint-disable-next-line no-console
          // console.log(`send ${axiosData.url} catch`, error.response);
          return ErrorHandler.handleError({
            error: error.response,
            requestData: {
              axiosData,
              resolve,
              reject,
              startRequest,
              endRequest,
            },
          });
        })
        .finally(endRequest);
    });
  }

  static sendRequest(axiosData, startRequest = () => {}, endRequest = () => {}) {
    return new Promise((resolve, reject) => {
      startRequest();
      axiosMFastClient(axiosData)
        .then((response) => {
          // eslint-disable-next-line no-console
          // console.log(`send ${axiosData.url} then`, response);
          resolve(response);
        })
        .catch((error) => {
          console.log(
            '\u001B[31m -> file: DigitelClient.js:1708 -> sendRequest error:',
            axiosData.url,
            axiosData.params,
            error.message,
          );
          // console.log('TCL: staticsendRequest -> error', { error });
          // eslint-disable-next-line no-console
          // console.log(`send ${axiosData.url} catch`, error.response);
          return ErrorHandler.handleError({
            error: error.response,
            requestData: {
              axiosData,
              resolve,
              reject,
              startRequest,
              endRequest,
            },
          });
        })
        .finally(endRequest);
    });
  }

  static sendRequestWithOTP(requestData, OTP, startRequest = () => {}, endRequest = () => {}) {
    const { axiosData } = requestData;
    const params = axiosData.params ? { params: { ...axiosData.params, otp_code: OTP } } : {};
    const data = axiosData.data ? { data: { ...axiosData.data, otp_code: OTP } } : {};
    const axiosOTPData = {
      ...axiosData,
      ...params,
      ...data,
    };
    return new Promise((resolve, reject) => {
      startRequest();
      axiosMFastClient(axiosOTPData)
        .then((response) => {
          // eslint-disable-next-line no-console
          // console.log(`send ${axiosData.url} OTP then`, response);
          requestData.resolve(response);
          resolve(response);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          // console.log(`send ${axiosData.url} with OTP catch`, error.response);
          return ErrorHandler.handleError({
            error: error.response,
            requestData,
            requestDataWithOTP: { axiosOTPData, resolve, reject },
          });
        })
        .finally(endRequest);
    });
  }

  /*  APIs
   */

  static mfLoginExternal({
    platform,
    accessToken,
    deviceUDID,
    startRequest = () => {},
    endRequest = () => {},
  }) {
    const api = `${Configs.firebaseFunctionsBaseURL}/loginExternal`;
    const params = {
      platform,
      accessToken,
      deviceUDID,
    };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = DigitelClient.handleLoginResponse;

    if (platform === 'phone') {
      return this.mfHookRequireOTP(axiosData, startRequest, endRequest).then(successCallback);
    }
    return this.sendRequest(axiosData, startRequest, endRequest)
      .then(successCallback)
      .catch((error) => console.log('mfLoginExternal error', error));
  }

  static mfHookRequireOTP(axiosData, startRequest, endRequest) {
    return new Promise((resolve, reject) => {
      const requiredOTPData = {
        status: ERROR_STATUS.ERROR_401,
        data: { err_code: ERROR_CODE.REQUIRED_OTP },
      };
      ErrorHandler.handleError({
        error: requiredOTPData,
        requestData: {
          axiosData,
          resolve,
          reject,
          startRequest,
          endRequest,
        },
      });
    });
  }

  static mfRegisterExternal(
    { platform, accessToken, fullName, referralID, deviceUDID, ...data },
    startRequest,
    endRequest,
  ) {
    const api = `${Configs.firebaseFunctionsBaseURL}/registerExternal`;
    const params = {
      platform,
      accessToken,
      fullName,
      referralID: referralID || '',
      deviceUDID,
      ...data,
    };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = DigitelClient.handleRegisterResponse;

    return this.sendRequest(axiosData, startRequest, endRequest).then(successCallback);
  }

  static mfRequestOTP(phone, isRetry, type) {
    const api = MFAST_API_LIST.REQUEST_OTP;
    const params = {
      mobilePhone: phone,
      isRetry,
      type,
    };
    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }

  static mfAddAccount() {
    return Promise.reject();
  }

  static mfNotificationLogin() {
    const api = MFAST_API_LIST.SEND_LOGIN_NOTIFICATION;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = () => {};
    return this.sendRequest(axiosData).then(successCallback);
  }

  // ------------------------------------------------------------------
  // API FINANCIAL SERVICES
  // ------------------------------------------------------------------
  static mfFetchFinancialServices() {
    const api = MFAST_API_LIST.FINANCIAL_SERVICES;
    const axiosData = { method: 'get', url: api };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data.map(ShopItem.objectFromJSON);
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static mfGetNews(page = 1, perPage = 20) {
    const api = MFAST_API_LIST.POSTS;
    const params = { page, perPage };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data.map(News.objectFromJSON);
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static mfGetKnowledges(page = 1, perPage = 20) {
    const api = MFAST_API_LIST.KNOWLEDGES;
    const params = { page, perPage };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data.map(Knowledge.objectFromJSON);
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  // ------------------------------------------------------------------
  // API SHOP
  // ------------------------------------------------------------------
  static mfGetShopItems() {
    const api = MFAST_API_LIST.SHOP;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data.map(ShopItem.objectFromJSON);
    };
    return this.sendRequest(axiosData).then(successCallback);
  }
  // ------------------------------------------------------------------
  // API CUSTOMER FORMS
  // ------------------------------------------------------------------
  static mfGetCustomerForms() {
    const api = MFAST_API_LIST.CUSTOMER_FORMS;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallBack = (response) => {
      if (response.data.status !== true) return [];
      const formData = CustomerForm.objectFormJSON(response.data.data);
      return formData;
    };
    return this.sendRequest(axiosData).then(successCallBack);
  }
  // ------------------------------------------------------------------
  // API LIST DISTRICT
  // ------------------------------------------------------------------
  static mfGetListDistrict(params) {
    const api = MFAST_API_LIST.LIST_DISTRICT;
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (!response.data) return {};
      const listDistrict = response.data;
      return listDistrict;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static mfGetMobileCardPaymentURL(paramObject) {
    const createFormData = () => {
      const formData = new FormData();
      const keys = Object.keys(paramObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const value = paramObject[key];
        formData.append(key, value);
      }
      return formData;
    };

    const successCallback = (json) => {
      if (!json.status) return {};
      const paymentURLData = json.data;
      return paymentURLData;
    };

    return fetch(Configs.apiGetMobileCardPaymentURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: createFormData(),
    })
      .then((response) => response.json())
      .then(successCallback)
      .catch((error) => console.log(error));
  }

  static sendOSTicketRequest(axiosData, startRequest = () => {}, endRequest = () => {}) {
    return new Promise((resolve, reject) => {
      startRequest();
      axiosOSTicketClient(axiosData)
        .then((response) => {
          endRequest();
          resolve(response);
        })
        .catch((error) => {
          endRequest();
          reject(error);
        });
    });
  }

  static osGetTopics() {
    const api = OS_TICKET_API.GET_TOPICS;
    const params = { ...DigitelClient.defaultParams, mobileApp: 'mfast' };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data.topic;
    };
    return this.sendOSTicketRequest(axiosData).then(successCallback);
  }

  static osGetListTicketByUserID(userID, type, page = 0) {
    const api = OS_TICKET_API.GET_TICKET_BY_USER_ID;
    const params = { userID, type, page };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendOSTicketRequest(axiosData).then(successCallback);
  }

  static osGetThreadTicketByTicketNumber(ticketNumber) {
    const api = OS_TICKET_API.GET_THREAD_BY_TICKET_NUMBER;
    const params = { ticketNumber };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendOSTicketRequest(axiosData).then(successCallback);
  }

  static osCreateTicket(paramObject) {
    const api = OS_TICKET_API.CREATE_TICKET;
    const data = DigitelClient.createFormData(paramObject);
    const axiosData = { method: 'post', url: api, data };
    const successCallback = (response) => {
      if (response.data.status !== true) return '';
      return response.data.data.ticket_number;
    };
    return this.sendOSTicketRequest(axiosData).then(successCallback);
  }

  static osPostThread(paramObject) {
    const api = OS_TICKET_API.POST_THREAD;
    const data = DigitelClient.createFormData(paramObject);
    const axiosData = { method: 'post', url: api, data };
    const successCallback = (response) => {
      if (response.data.status !== true) return {};
      return response.data;
    };
    return this.sendOSTicketRequest(axiosData).then(successCallback);
  }

  static createFormData(paramObject) {
    const bodyFormData = new FormData();
    const keys = Object.keys(paramObject);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = paramObject[key];
      if (Array.isArray(value)) {
        for (let j = 0; j < value.length; j += 1) {
          bodyFormData.append(`${key}[]`, value[j]);
        }
      } else {
        bodyFormData.append(key, value);
      }
    }
    return bodyFormData;
  }

  // CARD

  static fetchEmployeeCard() {
    const url = API_LIST.HO_GENERATE_CARD;
    return axiosClient
      .get(url, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        if (!response.data.status) throw Error();
        return response.data.data;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, url);
      });
  }

  static sendEmailHO(email, type) {
    const url = API_LIST.HO_SEND_MAIL;
    return axiosClient
      .get(url, {
        params: {
          ...DigitelClient.defaultParams,
          email,
          card_type: type,
        },
      })
      .then((response) => {
        // console.log('res', response);
        if (!response.data.status) throw Error();
        return response.data.status;
      })
      .catch((error) => {
        // console.log('error', error.response);
        return DigitelClient.handleAxiosError(error, url);
      });
  }

  static saveEmployeeCard(avatar) {
    const url = API_LIST.HO_SAVE_CARD;
    const data = new FormData();
    data.append('file', {
      uri: avatar,
      name: 'profile-picture',
      type: 'image/jpg',
    });
    return axiosClient
      .post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // console.log('save', response);
        return response.data.status;
      })
      .catch((error) => {
        // console.log('error', error.response);
        return DigitelClient.handleAxiosError(error, url);
      });
  }

  static requestProcessCard() {
    const url = API_LIST.HO_REQUEST_PROCESS;
    return axiosClient
      .post(
        url,
        {},
        {
          params: {
            ...DigitelClient.defaultParams,
          },
        },
      )
      .then((response) => {
        return response.data.status;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, url);
      });
  }

  static uploadImage(imagePath) {
    const url = API_LIST.UPLOAD_IMG;
    const data = new FormData();
    data.append('file', { uri: imagePath, name: 'image', type: 'image/jpg' });
    return axiosClient
      .post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        return response.data.status ? response.data.data.path : '';
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, url);
      });
  }

  /*  USER LIST
   */

  static mfFetchUserList() {
    const api = `${Configs.firebaseFunctionsBaseURL}/fetchUserList`;
    const axiosData = {
      method: 'get',
      url: api,
      params: DigitelClient.defaultParams,
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updateUserNote(userID, note) {
    const api = MFAST_API_LIST.USER_NOTE;
    const axiosData = {
      method: 'post',
      url: api,
      data: { ...DigitelClient.defaultParams, note, userID },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return false;
      return true;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updatePhone(mobilePhone, force = false, otp = '', startRequest, endRequest) {
    const api = MFAST_API_LIST.USER_UPDATE;
    const axiosData = {
      method: 'post',
      url: api,
      data: {
        ...DigitelClient.defaultParams,
        mobilePhone,
        force,
        otp_code: otp,
      },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return false;
      return true;
    };

    if (!otp) {
      return this.mfHookRequireOTP(axiosData, startRequest, endRequest).then(successCallback);
    }
    return this.sendRequest(axiosData, startRequest, endRequest).then(successCallback);
  }

  static mfGetGlobalCareURL(accessToken, fullName, idNumber, mobilePhone) {
    const api = MFAST_API_LIST.CUSTOMER_FORM_GET_GLOBAL_CARE_URL;
    const params = { accessToken, fullName, idNumber, mobilePhone };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return {};
      return response.data.url;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static checkTopup() {
    const api = API_LIST.CHECK_TOPUP;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: DigitelClient.createFormData({
        ...DigitelClient.defaultParams,
        ...params,
      }),
    };
    const successCallBack = (response) => {
      return response.data ? response.data : {};
    };
    return this.sendRequestAppay(axiosData).then(successCallBack);
  }

  static getTopUpPaymentURL(paramObject) {
    const successCallback = (json) => {
      if (!json.data.status) return json.data;
      return json.data.data;
    };
    const api = API_LIST.TOP_UP_PAYMENT_URL_DATA;
    const axiosData = {
      method: 'post',
      url: api,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: DigitelClient.createFormData({
        ...DigitelClient.defaultParams,
        ...paramObject,
      }),
    };
    return this.sendRequestAppay(axiosData).then(successCallback);
  }

  static getMobileCardPaymentURL(paramObject) {
    const successCallback = (json) => {
      if (!json.data.status) return {};
      return json.data;
    };
    const api = API_LIST.MOBILE_CARD_PAYMENT_URL_DATA;
    const axiosData = {
      method: 'post',
      url: api,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: DigitelClient.createFormData({
        ...DigitelClient.defaultParams,
        ...paramObject,
      }),
    };
    return this.sendRequestAppay(axiosData).then(successCallback);
  }

  static fetchPostList() {
    const api = MFAST_API_LIST.POST_LIST;
    const params = { ...DigitelClient.defaultParams, per_page: 100 };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      console.log('aaa-25:', response);
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchKnowledge() {
    let api = `${MFAST_API_LIST.KNOWLEDGES_V2}`;

    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchInvite() {
    const api = API_LIST.INVITE;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequestAppay(axiosData).then(successCallback);
  }

  static fetchProvince() {
    const api = MFAST_API_LIST.LOAD_PROVINCE;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      const obj = response.data;
      return Object.keys(obj).map((key) => obj[key]);
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updateUserProfile(userInfo) {
    const api = MFAST_API_LIST.UPDATE_PROFILE;
    const axiosData = {
      method: 'post',
      url: api,
      data: { ...DigitelClient.defaultParams, ...userInfo },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return false;
      return true;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchDPD() {
    const api = API_LIST.DPD;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      console.log('aaa-44', response);
      if (response.data.status !== true) return {};
      return response.data.data;
      // return response.data.data_new;
    };
    return this.sendRequestAppay(axiosData).then(successCallback);
  }

  static fetchShopV2() {
    const api = MFAST_API_LIST.SHOP_V2;
    const params = { ...DigitelClient.defaultParams, perPage: 40, apiVersion: 'v3' };
    const axiosData = { method: 'get', url: api, params };

    const successCallback = (response) => {
      if (response.data.status !== true) return [];

      return response.data;
    };

    return this.sendRequest(axiosData).then(successCallback);
  }

  static getSolarProcess() {
    return axiosClient
      .get(API_LIST.SOLAR_GET_PROCESS, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // console.log(' $$$$$$ getSolarProcess response $$$$$$ ', response);
        return Array.isArray(response.data) ? response.data : [];
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.TOOLS);
      });
  }

  static getSolarProvinces() {
    return axiosClient
      .get(API_LIST.SOLAR_GET_PROVINCES, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // console.log(' $$$$$$ getSolarProcess response $$$$$$ ', response);
        return Array.isArray(response.data) ? response.data : [];
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.TOOLS);
      });
  }

  static getSolarDistricts(provinceId) {
    // console.log(" @@@@@@@@@@@ getSolarDistricts provinceId ", provinceId);
    return axiosClient
      .get(`${API_LIST.SOLAR_GET_DISTRICTS}/${provinceId}`, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // console.log(' $$$$$$ getSolarDistricts response $$$$$$ ', response);
        return Array.isArray(response.data) ? response.data : [];
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.TOOLS);
      });
  }

  static getSolarWards(districtId) {
    return axiosClient
      .get(`${API_LIST.SOLAR_GET_WARDS}/${districtId}`, {
        params: {
          ...DigitelClient.defaultParams,
        },
      })
      .then((response) => {
        // console.log(' $$$$$$ getSolarProcess response $$$$$$ ', response);
        return Array.isArray(response.data) ? response.data : [];
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_LIST.TOOLS);
      });
  }

  //  tên KH: fullName
  // CMND: idNumber
  // SDT: mobilePhone
  // Tinh thanh solar: provinceID
  // Quan huyen solar: districtIDSolar
  // Phuong xa Solar: wardID
  // Process: processID
  // Note: processNote.
  static postSolarForm({
    fullName,
    idNumber,
    mobilePhone,
    processID,
    provinceID,
    districtIDSolar,
    wardID,
    processNote,
  }) {
    const api = `${API_LIST.SUBMIT_SOLAR}?accessToken=${DigitelClient.defaultParams.accessToken}`;
    const params = {
      fullName,
      idNumber,
      mobilePhone,
      processID,
      provinceID,
      districtIDSolar,
      wardID,
      processNote,
    };
    const axiosData = {
      method: 'post',
      url: api,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, ...params },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequestAppay(axiosData).then(successCallback);
  }

  static apiGetListNotificationSetting() {
    const api = `${API_LIST.GET_NOTIFICATIONS}?accessToken=${DigitelClient.defaultParams.accessToken}`;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      return response.data.status ? response.data.data : {};
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static apiSubscribeNotificationSetting({ categoryID, status }) {
    const api = `${API_LIST.SUBSCRIBE_NOTIFICATIONS}?accessToken=${DigitelClient.defaultParams.accessToken}`;
    const axiosData = {
      method: 'post',
      url: api,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, categoryID, status },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchContest() {
    let api = `${MFAST_API_LIST.CONTEST}`;
    if (DigitelClient.defaultParams && DigitelClient.defaultParams.accessToken) {
      api = `${api}?accessToken=${DigitelClient.defaultParams.accessToken}`;
    }
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      console.log('aaa-27:', response);
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getAppUpdateMfast(version) {
    const API_VERSION = 'API_VERSION_MFAST';
    return axiosClient
      .get(MFAST_API_LIST.VERSION_MFAST, {
        params: {
          version,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.data;
        const item = Version.objectFromJSON(data);
        return item;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error, API_VERSION);
      });
  }

  static checkIdnumberExists(idNumber) {
    const api = API_LIST.CHECK_IDNUMBER_EXISTS;
    const params = { idNumber };
    const axiosData = {
      method: 'post',
      url: api,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: DigitelClient.createFormData({
        ...DigitelClient.defaultParams,
        ...params,
      }),
    };
    const successCallBack = (response) => {
      return response.data ? response.data : {};
    };
    return this.sendRequestAppay(axiosData).then(successCallBack);
  }

  static genLinkReferral(projectID) {
    return axiosClient
      .get(MFAST_API_LIST.GEN_LINK_REF, {
        params: {
          ...DigitelClient.defaultParams,
          projectID,
        },
      })
      .then((response) => {
        if (response.data.status !== true) {
          return Promise.reject(UNKNOWN_ERROR_RESPONSE);
        }
        const data = response.data.url;
        return data;
      })
      .catch((error) => {
        return DigitelClient.handleAxiosError(error);
      });
  }

  static getSupportLine() {
    const api = MFAST_API_LIST.SUPPORT_LINE;
    const axiosData = {
      method: 'get',
      url: api,
      params: { ...DigitelClient.defaultParams, mobileApp: 'mfast' },
    };
    const successCallback = (response) => {
      if (!response?.data?.data) return [];
      return response?.data?.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getBubbleInfor() {
    const api = MFAST_API_LIST.BUBBLE;
    const axiosData = {
      method: 'get',
      url: api,
      params: { ...DigitelClient.defaultParams, mobileApp: 'mfast' },
    };
    const successCallback = (response) => {
      if (!response?.data?.data) return null;
      return response?.data?.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getPopupTermWhenUserLogin(mobilePhone) {
    const api = MFAST_API_LIST.TERM_POPUP_LOGIN;
    const params = { ...DigitelClient.defaultParams, mobilePhone };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return null;
      return response.data.data;
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((err) => {});
  }

  static submitConfirmTermWhenUserLogin(mobilePhone) {
    const api = MFAST_API_LIST.SUBMIT_TERM_POPUP_LOGIN;
    const params = { ...DigitelClient.defaultParams, mobilePhone };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return null;
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  /* User journey  */
  static submitORCIdentify(cmndUrl, extraData = {}) {
    const api = MFAST_API_LIST.OCR_IDENTIFY;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, path: cmndUrl, ...extraData },
    };

    const successCallback = (response) => {
      if (response.data) return response.data;
      return null;
    };
    return this.sendRequestAppay(axiosData).then(successCallback);
  }

  static getDataConfigUser() {
    const api = MFAST_API_LIST.USER_CONFIG;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static sendEmailOTP(email) {
    const api = MFAST_API_LIST.SEND_EMAIL_OTP;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, email },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static verifyEmailOTP(email, otpCode) {
    const api = MFAST_API_LIST.VERIFY_EMAIL_OTP;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, email, otpCode },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getUserMetaData() {
    const api = MFAST_API_LIST.USER_META_DATA;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;

      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getPopupBrand() {
    const api = MFAST_API_LIST.POPUP_BRAND;

    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return null;
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updateUserMetaData(payload) {
    const api = MFAST_API_LIST.UPDATE_META_DATA;
    const params = { ...DigitelClient.defaultParams, apiVersion: 'v2' };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...payload },
    };
    const successCallback = (response) => {
      if (isArray(response?.data?.message)) {
        response.data.message = response.data.message.join('\n\n');
      }
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static sendPhoneOTP(mobilePhone, type, isRetry, func) {
    const api = MFAST_API_LIST.SEND_PHONE_OTP;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, mobilePhone, type, isRetry, function: func },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static verifyPhoneOTP(mobilePhone, otpCode) {
    const api = MFAST_API_LIST.VERIFY_PHONE_OTP;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, mobilePhone, otpCode },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getListBanks() {
    const api = MFAST_API_LIST.LIST_BANKS;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return null;
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getListBankBranches() {
    const api = MFAST_API_LIST.LIST_BANKS_BRANCHES;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response.data.status !== true) return null;
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getListMyBank() {
    const api = `${MFAST_API_LIST.MY_BANKING}`;

    const params = { ...DigitelClient.defaultParams, apiVersion: 'v2' };
    const axiosData = {
      method: 'get',
      url: api,
      params,
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return null;

      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static addMyBank(payload) {
    const api = MFAST_API_LIST.ADD_BANKING;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, ...payload },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response.data;
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static sendTaxCommit(email) {
    const api = MFAST_API_LIST.SEND_TAX_COMMIT;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, email },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static sendTaxCommitPhoto(path) {
    const api = MFAST_API_LIST.SEND_TAX_COMMIT_PHOTO;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, path },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static checkTaxNumber(tax_number) {
    const api = MFAST_API_LIST.CHECK_TAX_NUMBER;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { ...DigitelClient.defaultParams, tax_number },
    };
    const successCallback = (response) => {
      if (response.data.status !== true) return response?.data;
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static checkDuplicatePhoneNumber(mobilePhone) {
    const api = MFAST_API_LIST.CHECK_DUP_PHONE;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      data: { mobilePhone },
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updatePhoneNumberUser(mobilePhone) {
    const api = MFAST_API_LIST.UPDATE_PHONE_NUMBER;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      data: { mobilePhone },
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updateCMND(payload) {
    const api = MFAST_API_LIST.UPDATE_CMND;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      data: { ...payload },
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static checkDuplicateNickName(nickname) {
    const api = MFAST_API_LIST.CHECK_DUP_NICKNAME;
    const params = { ...DigitelClient.defaultParams, full_name: nickname };
    const axiosData = {
      method: 'get',
      url: api,
      params,
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getListPrivacyConfig() {
    const api = MFAST_API_LIST.LIST_PRIVACY_CONFIG;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'get',
      url: api,
      params,
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static updatePrivacyConfig({ categoryID, status }) {
    const api = MFAST_API_LIST.UPDATE_PRIVACY_CONFIG;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
      data: { categoryID, status },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getListArea({ type, code }) {
    const api = MFAST_API_LIST.GET_LIST_AREA;
    const params = { ...DigitelClient.defaultParams, type, code };
    const axiosData = {
      method: 'get',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static postTaxRegister(payload) {
    const api = MFAST_API_LIST.TAX_REGISTER;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      data: { ...payload },
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getTaxNumber() {
    const api = MFAST_API_LIST.GET_TAXT_NUMBER;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static searchUserByNickname({ keyword = '' }) {
    const api = MFAST_API_LIST.SEARCH_USER_BY_NICKNAME;
    const params = { ...DigitelClient.defaultParams, keyword };
    const axiosData = {
      method: 'get',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getArenaInfor() {
    const api = MFAST_API_LIST.ARENA_INFO;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'get',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static getThreadPublic() {
    const api = MFAST_API_LIST.THREAD_PUBLIC;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'get',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static setPassCode(phoneNumber, passCode, passCodePlainText) {
    const api = MFAST_API_LIST.CREATE_PASSCODE;
    const payload = {
      mobilePhone: phoneNumber,
      password: passCode,
      password_plainText: passCodePlainText,
    };
    const params = { ...DigitelClient.defaultParams };

    const axiosData = {
      method: 'post',
      url: api,
      params: params,
      data: { ...payload },
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static mLoginWithPasscode(phoneNumber, passcode, deviceUDID) {
    const api = MFAST_API_LIST.LOGIN_BY_PASSCODE;
    const payload = {
      mobilePhone: phoneNumber,
      password: passcode,
      deviceUDID,
    };
    const params = { ...DigitelClient.defaultParams };
    const axiosData = {
      method: 'post',
      url: api,
      params,
      data: {
        ...payload,
      },
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static mCheckUsingPasscode(mobilePhone) {
    const api = MFAST_API_LIST.CHECK_USING_PASSCODE;
    const params = { ...DigitelClient.defaultParams, mobilePhone };
    const axiosData = {
      method: 'get',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
    };
    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static mTogglePasscode(status) {
    const api = MFAST_API_LIST.TOGGLE_USING_PASSCODE;
    const params = { accessToken: DigitelClient.userAccessToken, status };
    const axiosData = {
      method: 'get',
      url: api,
      params,
      headers: { 'Content-Type': 'application/json' },
    };

    const successCallback = (response) => {
      return response.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchPostsTips() {
    const api = MFAST_API_LIST.POSTS_TIPS;
    const params = { ...DigitelClient.defaultParams, per_page: 12 };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      console.log('aaa-26:', response);
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchListFinance() {
    const api = MFAST_API_LIST.LIST_FINANCE;
    const params = { ...DigitelClient.defaultParams, per_page: 12 };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      console.log('aaa-45:', response);
      if (response.data.status !== true) return [];
      return response.data.data;
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static fetchSurveyPopupContent() {
    const params = { ...DigitelClient.defaultParams, campaignID: 20 };

    return axiosClient
      .get(API_LIST.GET_SURVEY_POPUP, {
        params: params,
      })
      .then((response) => {
        return response?.data?.data;
      })
      .catch((error) => {
        console.log('error ne', error);
      });
  }

  static submitSurveyPopup(campaignID, feedbacks) {
    return axiosClient
      .post(
        API_LIST.SEND_SURVEY,
        { campaignID, feedbacks },
        {
          headers: { 'Content-Type': 'application/json' },
          params: { ...DigitelClient.defaultParams },
        },
      )
      .then((response) => {
        return response;
      })
      .catch((error) => console.log('error test', error));
  }

  static getPresenceStatusUser(userId) {
    const api = `${MFAST_API_LIST.GET_PRESENCE_STATUS_USER}/${userId}`;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response?.data?.data) {
        return response.data.data;
      }
    };
    return this.sendRequest(axiosData).then(successCallback);
  }

  static pushEventToReportAppay(data) {
    const api = MFAST_API_LIST.TRACKING_EVENT_REPORT_APPAY;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'post', url: api, params, data };
    const successCallback = (response) => {
      if (response?.data?.status) {
      }
    };

    return this.sendRequest(axiosData).then(successCallback);
  }
  static reEkycApi(url) {
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url, params };
    const successCallback = (response) => {
      if (response?.data?.status) {
        return response?.data?.status;
      }
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        return error;
      });
  }
  static fetchListNewsFromKeyword(keyword) {
    const url = `https://mfast.vn/wp-json/wp/v2/posts?search=${keyword}&page=1&per_page=20&_embed`;
    console.log('aaa-42', url);
    const successCallback = (response) => {
      return response?.data;
    };
    return axios
      .get(url, { ...DigitelClient.defaultParams })
      .then(successCallback)
      .catch((error) => {});

    // return this.sendRequest(axiosData)
    //   .then(successCallback)
    //   .catch((error) => {
    //     console.log('error call api', error);
    //   });
  }
  static fetchListHighlightProject() {
    const api = MFAST_API_LIST.GET_LIST_HIGHLIGHT_PROJECTS;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      console.log('aaa-47', response);
      if (response?.data?.data?.items?.length > 0) {
        return response?.data?.data?.items;
      }
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {});
  }
  static callLivenessIdentify(videoUri, cmndPath) {
    const date = new Date().getTime();
    const data = new FormData();
    data.append('video', {
      name: `${date}.mp4`,
      uri: videoUri,
      type: 'video/mp4',
    });
    data.append('cmnd', cmndPath);
    data.append('accessToken', DigitelClient.defaultParams.accessToken);

    // axios.post();

    return axiosClient
      .post(API_LIST.FPT_LIVENESS, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // params: { ...DigitelClient.defaultParams },
      })
      .then((response) => {
        if (response?.data) return response?.data;
      })
      .catch((error) => console.log('error test', error));
  }

  static checkDuplicateEmail(email) {
    const api = MFAST_API_LIST.CHECK_DUP_EMAIL;
    const params = { ...DigitelClient.defaultParams };
    const data = { email };
    const axiosData = { method: 'post', url: api, params, data };
    const successCallback = (response) => {
      return response.data.status;
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        console.log('error na', error);
      });
  }
  static addMomoWallet() {
    const api = MFAST_API_LIST.ADD_MOMO;
    const params = { ...DigitelClient.defaultParams };
    const data = {};
    const axiosData = { method: 'post', url: api, params, data };
    const successCallback = (response) => {
      if (response?.data) {
        return response.data;
      }
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        console.log('error add momo', error);
      });
  }
  static cancelMomoWallet() {
    const api = MFAST_API_LIST.CANCEL_MOMO;
    const params = { ...DigitelClient.defaultParams };
    const data = {};
    const axiosData = { method: 'post', url: api, params, data };
    const successCallback = (response) => {
      if (response?.data) {
        return response.data;
      }
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        console.log('error cancel momo', error);
      });
  }
  static saveInsCert(path, ins_certificate_number, ins_certificate_provide, ins_certificate_date) {
    const api = MFAST_API_LIST.SAVE_INS_CERT;
    const params = { ...DigitelClient.defaultParams };
    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      path,
      ins_certificate_number,
      ins_certificate_provide,
      ins_certificate_date,
    };
    console.log('\u001B[36m -> file: DigitelClient.js:3319 -> data', data);
    const axiosData = { method: 'post', url: api, params, data };
    const successCallback = (response) => {
      console.log('111 submit', response);
      if (response?.data) {
        return response?.data;
      }
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        if (__DEV__) {
          console.log('error save', error);
        }
      });
  }

  static getListCTV(filterParams = {}) {
    const api = MFAST_API_LIST.GET_LIST_CTV;
    const params = { ...DigitelClient.defaultParams, ...filterParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response?.data) {
        return (
          {
            data: response?.data?.data || [],
            total: response?.data?.data?.length ? response?.data?.total : 0,
          } || {}
        );
      }
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        if (__DEV__) {
          console.log('getListCTV ~~> error', error, filterParams);
        }
      });
  }

  static pushMassMessage(payload) {
    const api = `${API_LIST.PUSH_MASS_MESSAGE}?accessToken=${DigitelClient.defaultParams.accessToken}`;
    const params = { ...DigitelClient.defaultParams };

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };
    return axios
      .post(`${Configs.apiBaseURL}/${api}`, payload, options)
      .then((response) => {
        console.log('api ', response);
        if (response?.data?.status && response?.data?.notify_log_id) {
          return response?.data?.notify_log_id;
        }
      })
      .catch((error) => {
        return error;
      });
  }

  static getListPushMessage() {
    const api = API_LIST.GET_LIST_PUSH;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'get', url: api, params };
    const successCallback = (response) => {
      if (response?.data) {
        return response?.data;
      }
    };
    return this.sendRequestAppay(axiosData)
      .then(successCallback)
      .catch((error) => {
        console.log('fejjejf', error);
      });
  }
  static getPathInsCert() {
    const api = MFAST_API_LIST.GET_INS_CERT;
    const params = { ...DigitelClient.defaultParams };
    const axiosData = { method: 'post', url: api, params };
    const successCallback = (response) => {
      return response?.data;
    };
    return this.sendRequest(axiosData)
      .then(successCallback)
      .catch((error) => {
        console.log('111', error);
      });
  }

  static getListFilterCustomer() {
    const api = `${API_LIST.GET_LIST_FILTER_CUSTOMER}?accessToken=${DigitelClient.defaultParams.accessToken}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }

  static getListCustomer(params) {
    const stringParams = getParams(params);

    const api = `${API_LIST.GET_LIST_CUSTOMER}?accessToken=${
      DigitelClient.defaultParams.accessToken
    }${stringParams ? `&${stringParams}` : ''}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        console.log('aaa-12:', JSON.stringify(params), response.config.url);
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }

  static getCustomerDetail(params = {}, type) {
    const stringParams = getParams(params);

    const api = `${API_LIST.GET_CUSTOMER_DETAIL}?accessToken=${DigitelClient.defaultParams.accessToken}&${stringParams}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        console.log(
          `aaa-13: \u001B[34m -> file: DigitelClient.js:3498 -> DigitelClient -> api:`,
          response,
        );
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }

  static addPriorityCustomer(payload) {
    const api = `${API_LIST.ADD_PRIORITY_CUSTOMER}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .post(`${Configs.apiBaseURL}/${api}`, data, options)
      .then((response) => {
        console.log(`aaa-20: \u001B`, response);
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static removePriorityCustomer(payload) {
    const api = `${API_LIST.REMOVE_PRIORITY_CUSTOMER}`;

    const headers = {
      'Content-Type': 'application/json',
      'mobile-app': 'mfast',
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .delete(`${Configs.apiBaseURL}/${api}`, { data, headers })
      .then((response) => {
        console.log(`aaa-21: \u001B`, response);
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }

  static sendEmailDoc(payload) {
    console.log(
      '\u001B[33m ai log ne \u001B[36m -> file: DigitelClient.js -> line 3473 -> payload',
      payload,
    );
    const api = `${API_LIST.SEND_EMAIL_DOC}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .post(`${Configs.apiBaseURL}/${api}`, data, options)
      .then((response) => {
        console.log(
          '\u001B[33m ai log ne \u001B[36m -> file: DigitelClient.js -> line 3491 -> response.data',
          response.data,
        );
        return response.data;
      })
      .catch((error) => {
        console.log(
          '\u001B[33m ai log ne \u001B[36m -> file: DigitelClient.js -> line 3501 -> error',
          error,
        );
        return error;
      });
  }
  static getListCustomerLink(params) {
    const stringParams = getParams(params);

    const api = `${API_LIST.GET_LIST_CUSTOMER_LINK}?accessToken=${
      DigitelClient.defaultParams.accessToken
    }${stringParams ? `&${stringParams}` : ''}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static getCountCustomerLink() {
    const api = `${API_LIST.GET_COUNT_CUSTOMER_LINK}?accessToken=${DigitelClient.defaultParams.accessToken}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static getPosterLink(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const stringParams = getParams(params);
    const api = `${API_LIST.GET_POSTER_LINK}?${stringParams}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static sendEmailLink(payload) {
    const api = `${API_LIST.SEND_EMAIL_LINK}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .post(`${Configs.apiBaseURL}/${api}`, data, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static getViewLink(params) {
    const stringParams = getParams(params);

    const api = `${API_LIST.GET_VIEW_LINK}?accessToken=${DigitelClient.defaultParams.accessToken}${
      stringParams ? `&${stringParams}` : ''
    }`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}`, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static createAdLink(payload) {
    const api = `${API_LIST.CREATE_AD_LINK}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .post(`${Configs.apiBaseURL}/${api}`, data, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static editAdLink(payload) {
    const api = `${API_LIST.EDIT_AD_LINK}`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'mobile-app': 'mfast',
      },
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .put(`${Configs.apiBaseURL}/${api}`, data, options)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static removeAdLink(payload) {
    const api = `${API_LIST.REMOVE_AD_LINK}`;

    const headers = {
      'Content-Type': 'application/json',
      'mobile-app': 'mfast',
    };

    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    return axios
      .delete(`${Configs.apiBaseURL}/${api}`, { data, headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }

  //Collaborator
  static getInfoCollaborator(userId, isUserCollab, parentUserID) {
    const api = MFAST_API_LIST.GET_INFO_COLLABORATOR;
    const params = {};
    const data = {
      userID: userId,
      isUserCollab,
      parentUserID,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static getExperienceChart(userId, directSales, month) {
    const api = MFAST_API_LIST.GET_EXPERIENCE_CHART;
    const params = {};
    const data = {
      userID: userId,
      directSales,
      month,
      productName: 'all',
      showAll: true,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static getIncomeChart(userId, directSales, month) {
    const api = MFAST_API_LIST.GET_INCOME_CHART;
    const params = {};
    const data = {
      userID: userId,
      directSales,
      month,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getCollaboratorChart(userId, rank, month, tab, level, type) {
    const api = MFAST_API_LIST.GET_COLLABORATOR_CHART;
    const params = {};
    const data = {
      userID: userId,
      rank,
      month,
      tab,
      level,
      type,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getLegendaryChart(userId, month) {
    const api = MFAST_API_LIST.GET_LEGENDARY_CHART;
    const params = {};
    const data = {
      userID: userId,
      month,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getWorkingChart(userId, type, month) {
    const api = MFAST_API_LIST.GET_WORKING_CHART;
    const params = {};
    const data = {
      userID: userId,
      type,
      month,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getFilterCollaborator(rank, userId) {
    const api = MFAST_API_LIST.GET_FILTER_COLLABORATOR;
    const params = { rank, userID: userId };
    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getListCollaborator(userId, filters, month, page) {
    const api = MFAST_API_LIST.GET_LIST_COLLABORATOR;
    const params = {};
    const data = {
      ...filters,
      month,
      userID: userId,
      page,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getListCollaboratorPending(userId, page) {
    const api = MFAST_API_LIST.GET_LIST_COLLABORATOR_PENDING;
    const params = {};
    const data = {
      userID: userId,
      page,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getFilterRating(userId) {
    const api = MFAST_API_LIST.GET_FILTER_RATING;
    const params = {
      userID: userId,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getListRating(userId, tab, skill, page) {
    const api = MFAST_API_LIST.GET_LIST_RATING;
    const params = {};
    const data = {
      userID: userId,
      tab,
      skill,
      page,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static ratingUser(userId, toUserId, star, comment) {
    const api = MFAST_API_LIST.RATING_USER;
    const params = {};
    const data = {
      userID: userId,
      toUserID: toUserId,
      rating: star,
      comment,
      skill: 'lead',
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static getRatingUser(userID, toUserID) {
    const api = MFAST_API_LIST.GET_RATING_USER;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      userID,
      toUserID,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static getListPlReferral(keySearch) {
    const api = API_LIST.GET_LIST_PL_REFERRAL;
    const params = { ...DigitelClient.defaultParams };
    if (keySearch) {
      params.keySearch = keySearch;
    }
    const stringParams = getParams(params);

    return axios
      .get(`${Configs.apiBaseURL}/${api}?${stringParams}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static getListInsuranceReferral(keySearch) {
    const api = API_LIST.GET_LIST_INSURANCE_REFERRAL;
    const params = { ...DigitelClient.defaultParams };
    if (keySearch) {
      params.keySearch = keySearch;
    }
    const stringParams = getParams(params);

    return axios
      .get(`${Configs.apiBaseURL}/${api}?${stringParams}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static getListDaaReferral(keySearch) {
    const api = API_LIST.GET_LIST_DAA_REFERRAL;
    const params = { ...DigitelClient.defaultParams };
    if (keySearch) {
      params.keySearch = keySearch;
    }
    const stringParams = getParams(params);

    return axios
      .get(`${Configs.apiBaseURL}/${api}?${stringParams}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static trashCustomer(payload) {
    const api = API_LIST.TRASH_CUSTOMER;
    const data = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    return axios
      .delete(`${Configs.apiBaseURL}/${api}`, { data })
      .then((response) => {
        console.log(`aaa-22: \u001B`, response);
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static clearTrashCustomer() {
    const api = API_LIST.CLEAR_TRASH_CUSTOMER;
    const data = {
      ...DigitelClient.defaultParams,
    };

    return axios
      .delete(`${Configs.apiBaseURL}/${api}`, { data })
      .then((response) => {
        console.log(`aaa-23: \u001B`, response);
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static getUserAdLink(code) {
    const api = API_LIST.GET_USER_AD_LINK;
    const params = {
      ...DigitelClient.defaultParams,
      referralCode: code,
    };

    return axios
      .get(`${Configs.apiBaseURL}/${api}?${getParams(params)}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }
  static checkHasDeleteAccount() {
    const api = MFAST_API_LIST.HAS_DELETE_ACCOUNT;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static deleteAccount(mobilePhone, otpCode) {
    const api = MFAST_API_LIST.DELETE_ACCOUNT;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...DigitelClient.defaultParams,
      mobilePhone,
      otpCode,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static checkHasChangeSupporter() {
    const api = MFAST_API_LIST.HAS_CHANGE_SUPPORTER;
    const params = {
      accessToken: DigitelClient.userAccessToken || null,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getListSupporter({ text, provinceID, districtID, group }) {
    const api = MFAST_API_LIST.GET_LIST_SUPPORTER;
    const params = {
      accessToken: DigitelClient.userAccessToken || null,
    };
    const data = {};
    if (text) {
      data.text = text;
    }
    if (provinceID) {
      data.provinceID = provinceID;
    }
    if (districtID) {
      data.districtID = districtID;
    }
    if (group) {
      data.group = group;
    }

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static sendRequestSupporter(toUserID, note) {
    const api = MFAST_API_LIST.SEND_REQUEST_SUPPORTER;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {};
    if (toUserID) {
      data.toUserID = toUserID;
    }
    if (note) {
      data.note = note;
    }

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getSupporterWaiting() {
    const api = MFAST_API_LIST.GET_SUPPORTER_WAITING;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getFilterCollaboratorLeave() {
    const api = MFAST_API_LIST.GET_FILTER_COLLABORATOR_LEAVE;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequestAppay(axiosData);
  }
  static getListCollaboratorLeave(payload) {
    const api = MFAST_API_LIST.GET_LIST_COLLABORATOR_LEAVE;
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequestAppay(axiosData);
  }
  static getCollaboratorLeave() {
    const api = MFAST_API_LIST.GET_COLLABORATOR_LEAVE;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequestAppay(axiosData);
  }

  static setDefaultBank(bankID) {
    const api = MFAST_API_LIST.SET_DEFAULT_BANK;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const data = {
      ...DigitelClient.defaultParams,
      ID: bankID,
    };

    const axiosData = { method: 'post', url: api, params, data: data };

    return this.sendRequest(axiosData);
  }
  static deleteBank(bankID) {
    const api = MFAST_API_LIST.DELETE_BANK;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const data = {
      ...DigitelClient.defaultParams,
      ID: bankID,
    };

    const axiosData = { method: 'post', url: api, params, data: data };

    return this.sendRequest(axiosData);
  }
  static getInfoWithdrawalMoney(bankID) {
    const api = MFAST_API_LIST.GET_INFO_WITHDRAWAL_MONEY;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static checkWithdrawalMoney(bankID) {
    const api = MFAST_API_LIST.CHECK_WITHDRAWAL_MONEY;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static sendOTPWithdrawMoney(mobilePhone, isRetry, type) {
    const api = MFAST_API_LIST.SENT_OTP_WITHDRAW_MONEY;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...DigitelClient.defaultParams,
      mobilePhone,
      is_retry: isRetry,
      type,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static withdrawMoney(mobilePhone, otp, bankId, money, location) {
    const api = MFAST_API_LIST.WITHDRAW_MONEY;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...DigitelClient.defaultParams,
      mobilePhone,
      otp_code: otp,
      withdrawal_method: 'banking',
      banking_id: bankId,
      amount: money,
      location,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }
  static getWithdrawMoneyHistory(filter, page, month, year) {
    const api = MFAST_API_LIST.WITHDRAW_MONEY_HISTORY;
    const params = {
      ...DigitelClient.defaultParams,
      filter,
      page,
      month,
      year,
      date_ctr: 'about',
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getStatisticMoney(month, year) {
    const api = MFAST_API_LIST.GET_STATISTIC_MONEY;
    const params = {
      ...DigitelClient.defaultParams,
      month,
      year,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getFeeWithdrawMoney(money) {
    const api = MFAST_API_LIST.GET_FEE_WITHDRAW_MONEY;
    const data = {
      ...DigitelClient.defaultParams,
      amount: money,
      withdrawal_method: 'banking',
    };

    const axiosData = { method: 'post', url: api, data };

    const result = this.sendRequest(axiosData);

    console.log('aaa-40', api, JSON.stringify(data), result);

    return result;
  }
  static exportStatement(email, date_ctr, date_frm, date_to) {
    const api = MFAST_API_LIST.EXPORT_STATEMENT;
    const data = {
      ...DigitelClient.defaultParams,
      date_ctr,
      date_frm,
      date_to,
      email,
    };

    console.log('aaa-35', JSON.stringify(data));

    const axiosData = { method: 'post', url: api, data };

    return this.sendRequest(axiosData);
  }
  static getKBankData() {
    const api = MFAST_API_LIST.GET_KBANK_DATA;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }

  static getDetailCollaboratorPending(ID) {
    const api = MFAST_API_LIST.GET_DETAIL_COLLABORATOR_PENDING;
    const params = {
      ...DigitelClient.defaultParams,
      ID,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }

  static confirmCollaboratorPending(id, action) {
    const api = MFAST_API_LIST.CONFIRM_COLLABORATOR_PENDING;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...DigitelClient.defaultParams,
      id,
      action,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static insuranceUserESign(otpCode) {
    const api = MFAST_API_LIST.INS_USER_ESIGN;
    const params = { ...DigitelClient.defaultParams };
    const data = {
      otpCode,
      accessToken: DigitelClient.defaultParams.accessToken,
    };
    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static removeSupporter() {
    const api = MFAST_API_LIST.REMOVE_SUPPORTER;
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'post', url: api, params, data };

    return this.sendRequest(axiosData);
  }

  static getListMainBanner() {
    const api = MFAST_API_LIST.LIST_MAIN_BANNER;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getListMainProduct() {
    const api = MFAST_API_LIST.LIST_MAIN_PRODUCT;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getListMTradeBanner() {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_BANNER}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getListMTradeCategory() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_CATEGORY}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getListMTradeFilter() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_FILTER}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getListMTradeProduct(payload) {
    const data = {};

    if (payload?.group) {
      data.group = payload?.group;
    }
    if (payload?.productGroup) {
      data.productGroup = payload?.productGroup;
    }
    if (payload?.productCategory) {
      data.productCategory = payload?.productCategory;
    }
    if (payload?.brand) {
      data.brand = payload?.brand;
    }
    if (payload?.price) {
      data.price = payload?.price;
    }
    if (payload?.paymentMethod) {
      data.paymentMethod = payload?.paymentMethod;
    }
    if (payload?.productName) {
      data.productName = payload?.productName;
    }
    if (payload?.provinceCode) {
      data.provinceCode = payload?.provinceCode;
    }
    if (payload?.page) {
      data.page = payload?.page;
    }

    const params = {
      ...DigitelClient.defaultParams,
    };
    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_PRODUCT}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getListMTradeTextSearch(text) {
    const data = {
      productName: text,
    };
    const params = {
      ...DigitelClient.defaultParams,
    };
    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_KEY_SEARCH}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getListMTradeLocation() {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_LOCATION}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static setMTradeLocation(provinceCode) {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = { provinceCode };
    const paramsString = getParams(params);
    const api = `${API_LIST.SET_MTRADE_LOCATION}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getMTradeDetailProduct(productCode) {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      productCode,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_DETAIL_PRODUCT}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getMTradeCreateOrder(payload) {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_CREATE_ORDER}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getListMTradeCard(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_CARD}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getMTradeCode() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_CODE}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static addMTradeCard(payload) {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const data = {
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.ADD_MTRADE_CARD}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static removeMTradeCard(payload) {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const data = {
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.REMOVE_MTRADE_CARD}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }

  static getListMTradeArea({ type, code }) {
    const params = {
      ...DigitelClient.defaultParams,
      type,
      code,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_AREA}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }

  static getMTradeBonus({ month, year }) {
    const params = {
      ...DigitelClient.defaultParams,
      month,
      year,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_BONUS}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }

  static getMTradeIndirectBonus({ month, year, filter_level, filter_text, page }) {
    const params = {
      ...DigitelClient.defaultParams,
      month,
      year,
      filter_level,
      filter_text,
      page,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_BONUS}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getListMTradeIndirectBonus(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_INDIRECT_BONUS}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getListMTradeOrder(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.LIST_MTRADE_ORDER}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getMTradeBonusByCollaborator({ month, year, collaboratorID }) {
    const params = {
      ...DigitelClient.defaultParams,
      month,
      year,
      collaboratorID,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_BONUS_BY_COLLABORATOR}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getMTradeDetailProductByAttribute(payload) {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.MTRADE_DETAIL_PRODUCT_BY_ATTRIBUTE}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getStatisticCustomerByDate(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.GET_STATISTIC_CUSTOMER_BY_DATE}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getStatisticCustomerByTotalProduct() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.GET_STATISTIC_CUSTOMER_BY_TOTAL_PRODUCT}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getStatisticCustomerByHandler() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.GET_STATISTIC_CUSTOMER_BY_HANDLER}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getStatisticCustomerByProgress(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.GET_STATISTIC_CUSTOMER_BY_PROCESS}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static updateCustomer(payload) {
    const params = {
      ...DigitelClient.defaultParams,
    };
    const data = {
      accessToken: DigitelClient.defaultParams.accessToken,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.UPDATE_CUSTOMER}?${paramsString}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }
  static getDetailCustomerProject(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.GET_DETAIL_CUSTOMER_PROJECT}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }
  static getStatisticCustomerByLink(payload) {
    const params = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const paramsString = getParams(params);
    const api = `${API_LIST.GET_STATISTIC_CUSTOMER_BY_LINK}?${paramsString}`;

    return axios.get(`${Configs.apiBaseURL}/${api}`);
  }

  static trackingAgent(payload) {
    const data = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const api = `${API_LIST.TRACKING_AGENT}`;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }

  static deleteAccountV2(payload) {
    const data = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const api = MFAST_API_LIST.DELETE_ACCOUNT_V2;

    const axiosData = { method: 'post', url: api, data };

    return this.sendRequest(axiosData);
  }
  static checkDeleteAccountV2() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const api = MFAST_API_LIST.CHECK_DELETE_ACCOUNT_V2;

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static cancelDeleteAccountV2() {
    const data = {
      ...DigitelClient.defaultParams,
    };

    const api = MFAST_API_LIST.CANCEL_DELETE_ACCOUNT_V2;

    const axiosData = { method: 'post', url: api, data };

    return this.sendRequest(axiosData);
  }

  static deleteCollaborator(payload) {
    const data = {
      ...DigitelClient.defaultParams,
      ...payload,
    };

    const api = API_LIST.DELETE_COLLABORATOR;

    return axios.post(`${Configs.apiBaseURL}/${api}`, data);
  }

  static checkDeletingCollaborator() {
    const params = {
      ...DigitelClient.defaultParams,
    };

    const stringParams = getParams(params);
    const api = API_LIST.CHECK_DELETING_COLLABORATOR;

    return axios.get(`${Configs.apiBaseURL}/${api}?${stringParams}`);
  }
  static getBIDVData() {
    const api = MFAST_API_LIST.GET_BIDV_DATA;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }
  static getUserBIDVData() {
    const api = MFAST_API_LIST.GET_USER_BIDV_DATA;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }

  static getTotalUnreadNotification() {
    const api = `${API_LIST.TOTAL_UNREAD_NOTIFICATION}`;
    const params = { ...DigitelClient.defaultParams };
    const stringParams = getParams(params);

    return axios.get(`${Configs.apiBaseURL}/${api}?${stringParams}`);
  }

  static getOverviewCoreAgent() {
    const api = MFAST_API_LIST.OVERVIEW_CORE_AGENT;
    const params = {
      ...DigitelClient.defaultParams,
    };

    const axiosData = { method: 'get', url: api, params };

    return this.sendRequest(axiosData);
  }

  static getTimeChecking() {
    const api = API_LIST.CHECK_TIME_CHECKING;
    const paramsString = getParams(DigitelClient.defaultParams);

    return axiosClient
      .get(`${api}?${paramsString}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error: getTimeChecking', error);
      });
  }

  static getStatisticWorking() {
    const api = API_LIST.STATISTIC_WORKING;
    const paramsString = getParams(DigitelClient.defaultParams);

    return axiosClient
      .get(`${api}?${paramsString}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error: getStatisticWorking', error);
      });
  }
}

export default DigitelClient;
