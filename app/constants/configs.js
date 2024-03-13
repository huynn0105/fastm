/**
 * all configs used in the app
 * - on production all test flags must be false
 */

/**
 * Run command below when changing environment values to configure app's name & firebase
 * -> read 0-docs/build.md for more details
 * - python 0-scripts/configure_env_ios.py
 * - python 0-scripts/configure_env_android.py
 */

import { LogBox } from 'react-native';
import {
  SERVER_URL,
  API_BASE_MFAST_URL,
  API_BASE_URL,
  API_PASSWORD,
  API_USERNAME,
  FIREBASE_FUNCTIONS_BASE_URL,
  FIREBASE_FUNCTIONS_SECRET_KEY,
  VNP_TMNCODE,
  VNP_HASHSECRET,
  VNP_URL_PAYMENT,
  VNP_RETURN_URL,
  API_OS_TICKET,
  API_MOBILE_CARD_PAYMENT,
  LOS_URL,
  LOS_API_KEY,
  MTRADE_LANDING_PAGE_URL,
  EKYC_SDK_URL,
  EKYC_SDK_TOKEN,
  ANDROID_GOOGLE_API_KEY,
  IOS_GOOGLE_API_KEY,
  CXGENIE_AGENT_ID,
  MOENGAGE_KEY,
} from 'react-native-dotenv';
import { ICON_PATH } from '../assets/path';
import { SH } from './styles';

// DEV PROD STAGING
export const environment = 'DEV';
export const isDevelopment = environment === 'DEV';
export const isProduction = environment === 'PROD';
export const isStaging = environment === 'STAGING';

// MOCK HAVE TO BE FALSE
export const isMockAPI = false; // FALSE
// --------------------------------------------------

LogBox.ignoreAllLogs();

const serverURL = SERVER_URL;

const apiBaseURL = API_BASE_URL;

const apiMFastBaseURL = API_BASE_MFAST_URL;

const apiOSTicketBaseURL = API_OS_TICKET;

const apiGetMobileCardPaymentURL = API_MOBILE_CARD_PAYMENT;

const losUrl = LOS_URL;

const losApiKey = LOS_API_KEY;

const mtradeLandingPageUrl = MTRADE_LANDING_PAGE_URL;

const ekycSdkUrl = EKYC_SDK_URL;

const ekycSdkToken = EKYC_SDK_TOKEN;

const androidGoogleApiKey = ANDROID_GOOGLE_API_KEY;

const iosGoogleApiKey = IOS_GOOGLE_API_KEY;

const cxgenieAgentID = CXGENIE_AGENT_ID;

const moengageKey = MOENGAGE_KEY;

const apiBasicAuthorization = isDevelopment
  ? { username: 'dgtapp', password: 'xuka1997' }
  : isStaging
  ? { username: 'dgtapp', password: 'xuka1997' }
  : { username: API_USERNAME, password: API_PASSWORD };

const apiMFastBasicAuthorization = isDevelopment
  ? { username: 'mfast', password: 'JP50Au0DGT' }
  : isStaging
  ? { username: 'dgtapp', password: 'xuka1997' }
  : { username: API_USERNAME, password: API_PASSWORD };

const firebaseFunctionsBaseURL = FIREBASE_FUNCTIONS_BASE_URL;

const firebaseFunctionsSecretKey = FIREBASE_FUNCTIONS_SECRET_KEY;

export const EndpointJoinGroupMfast = 'https://join.mfast.vn';

export const LIST_WEBVIEW_DISABLE_CUSTOM_BACK = [
  `${serverURL}/finance/home?projectID=376`,
  `${serverURL}/finance/home?projectID=377`,
  `${serverURL}/finance/home?projectID=378`,
  `${serverURL}//mfast/shb`,
  `${serverURL}//app/home_credit`,
  `${serverURL}/finance/home?projectID=381`,
  `${serverURL}/finance/home?projectID=382`,
  `${serverURL}/finance/home?projectID=383`,
];

// shoud write log
const enableLog = isDevelopment || isStaging;

// should hide Contacts and Chats tab
// const enableChat = isDevelopment;
const enableChat = true;

// should hide functions to create Group Chat
const enableGroupChat = isDevelopment;

// should hide build number in the side menu
const isBuildNumberHidden = !isDevelopment;

// store log will use redux-devtools by default (if enableReactotron = false)
const enableReactotron = true;

// should application check for new version
const enableCheckForUpdate = true;

// VN-PAY
const vnpTMNCode = VNP_TMNCODE;
const vnpHashSecret = VNP_HASHSECRET;
const vnpUrl = VNP_URL_PAYMENT;
const vnpReturnUrl = VNP_RETURN_URL;
// --------------------------------------------------

export const Configs = {
  appName: 'MFast',
  environment,
  serverURL,
  apiBaseURL,
  apiMFastBaseURL,
  apiOSTicketBaseURL,
  apiBasicAuthorization,
  apiMFastBasicAuthorization,
  apiGetMobileCardPaymentURL,
  firebaseFunctionsBaseURL,
  firebaseFunctionsSecretKey,
  mobileCardURL: `${serverURL}/mobile_card`,
  mobileCardHistoryURL: `${serverURL}/mobile_card/history`,
  withdrawHistory: `${serverURL}/fe_credit/withdrawal/history`,
  momoUrl: `${serverURL}/bank_account/momo`,
  pointHistory: `${serverURL}/history/point`,
  minPasswordLength: 6,
  enableLog,
  enableChat,
  enableGroupChat,
  enableReactotron,
  enableCheckForUpdate,
  isBuildNumberHidden,
  vnpTMNCode,
  vnpHashSecret,
  vnpUrl,
  vnpReturnUrl,
  losUrl,
  losApiKey,
  mtradeLandingPageUrl,
  ekycSdkUrl,
  ekycSdkToken,
  androidGoogleApiKey,
  iosGoogleApiKey,
  cxgenieAgentID,
  moengageKey,
};

export const MFConfigs = {
  withdraw: `${serverURL}/fe_credit/withdrawal/`,
  upPro: `${serverURL}/hr/Hr_user_create_channel`,
  logoutWebview: `${serverURL}/mfast/authorization/logout`,
  policy: `${serverURL}/mfast/Policy`,
  policyIndirect: `${serverURL}/mfast/Policy?tab=indirect`,
  customerSite: `${serverURL}/mfast/potential_customer/customer_group`,
  ctvSite: `${serverURL}/mfast/ctv`,
  refSite: `${serverURL}/mfast_app/Rsa_dashboard/rule_ctv?tab=my_rsa`,
};

// --------------------------------------------------

export const DEEP_LINK_BASE_URL = isDevelopment ? 'mfastmobiledev' : 'mfastmobile';

export const DeepLinkPaths = {
  BASE_URL: DEEP_LINK_BASE_URL,

  // mfastmobile://chat/single?userID=2047&message=hello
  SINGLE_CHAT: `${DEEP_LINK_BASE_URL}://chat/single`,

  // mfastmobile://chat/group?threadID=111222&message=hello
  GROUP_CHAT: `${DEEP_LINK_BASE_URL}://chat/group`,

  // mfastmobile://callsip/?num=012345678&hideNum=true&name=LEVANA&param1=abc
  SIP_CALL: `${DEEP_LINK_BASE_URL}://callsip/`,

  // mfastmobile://callsip?url=012345678
  SIP_CALL_SUPPORT: `${DEEP_LINK_BASE_URL}://callsipsupport`,

  // mfastmobile://copy/?text=abc
  COPY: `${DEEP_LINK_BASE_URL}://copy/`,

  // mfastmobile://goback
  GO_BACK: `${DEEP_LINK_BASE_URL}://goback`,

  // mfastmobile://open?view=os_setting
  // mfastmobile://open?view=user_point
  OPEN: `${DEEP_LINK_BASE_URL}://open`,

  // mfastmobile://sms?number=123456789&body=hello
  SMS: `${DEEP_LINK_BASE_URL}://sms`,

  // mfastmobile://open_ctv
  OPEN_CTV: `${DEEP_LINK_BASE_URL}://open_ctv`,

  // mfastmobile://event?type=type&product=product
  EVENT: `${DEEP_LINK_BASE_URL}://event`,

  // mfastmobile://share?content=https://mfast.vn/abc?abc=ynx
  SHARE: `${DEEP_LINK_BASE_URL}://share`,

  GEN_LINK_REF_AND_SHARE: `${DEEP_LINK_BASE_URL}://genLinkRefAndShare`,

  IN_APP_REVIEW: `${DEEP_LINK_BASE_URL}://in-app-review`,

  BROWSER_OPEN: `${DEEP_LINK_BASE_URL}://browser`,

  JOIN_GROUP: `${DEEP_LINK_BASE_URL}://join-group`,

  VN_PAY: `${DEEP_LINK_BASE_URL}://vnpay`,

  // mfastmobile://popToTop
  POP_TO_TOP: `${DEEP_LINK_BASE_URL}://popToTop`,
};

// --------------------------------------------------

export const AppInfoDefault = {
  contactEmail: 'hotro@mfast.vn',
  contactPhoneNumber: '0899909789',
  contactPhoneNumberPretty: '08999.09789',
  introduceURL: 'https://appay.cloudcms.vn/introduce-appay',
  termsOfUsageURL: 'http://www.mfast.vn/dieu-khoan-su-dung-mfast',
  privacyPolicyURL: 'http://www.mfast.vn/chinh-sach-bao-mat-mfast',
  zaloFanpageURL: 'https://zalo.me/797336384152903597',
  zaloFanpageText: 'MFAST Fanpage',
  facebookFanpageURL: 'https://www.facebook.com/appayvn/',
  facebookFanpageURL2: 'fb://profile/191958701597238',
  facebookFanpageText: 'MFAST Fanpage',
  faqUrl: 'http://appay.vn/fqa',
  addBankURL: '',
  muasamBaoHiemXeMay: '',
  muasamBaoHiemSucKhoe: '',
  dulichCungWifiPocket: '',
  dienthoaiVanPhong: '',
  taingheVanPhong: '',
  riCoffee: '',
  appContestText: '',
  appContestImage: '',
  mFastPredsaCustomer: '',
  mFastCollaborators: '',
  mFastHistoryShopping: '',
  mFastNewCollaborator: '',
  mFastContractCollaborator: '',
  mFastCustomer: `${serverURL}/mfast/customer`,
  casa: null,
  introductionUrl: '',
  mFastYourCustomer: '',
  mFastReviewUserUrl: '',
  introduceUrlMFast: 'https://www.mfast.vn/mfast-la-gi-3',
  insuranceCommonUrl: '',
  regulationTaxUrl:
    'https://www.mfast.vn/cac-quy-dinh-khi-rut-tien-va-khau-tru-thue-thu-nhap-ca-nhan',
  ctvUserMFastUrl: '',
  guideEnableTrackingUrl:
    'https://mfast.vn/huong-dan-bat-tinh-nang-cho-phep-mfast-theo-doi-hoat-dong-tren-iphone/',
  guideUseAdImage: 'https://mfast.vn/huong-dan-su-dung-bo-nhan-dien-thuong-hieu/',
  collaboratorLeaveDetailUrl: 'https://mfast.vn/quy-dinh-ve-quyen-so-huu-cong-tac-vien-tren-mfast/',
  guideAccountIdentification: 'https://mfast.vn/huong-dan-dinh-danh-tai-khoan/',
};

// --------------------------------------------------
export const TestConfigs = {
  // delete database everytime running
  isTestDatabase: false,

  // login with test account
  isTestLogin: false,
  testLoginUsername: '024351339',
  testLoginPassword: '123456',

  // OTP code will auto fill
  isTestOTP: false,

  // register info will auto fill
  isTestRegister: false,
  testRegisterUserInfo: {
    fullName: 'Tester Register',
    cmnd: '024351332',
    cmndIssuedDate: Date.parse('Aug 9, 2014'),
    cmndIssuedPlace: 'TP. HCM',
    gender: 'male',
    phoneNumber: '0982746822',
    email: 'tester1@gmail.com',
    address: '200/12/12 Nguyễn Đình Chiểu',
    ownerReferral: null,
    userReferral: null,
  },
};

export const fonts = {
  light: 'MFastVN-Light',
  lightItalic: 'MFastVN-LightItalic',
  italic: 'MFastVN-Italic',
  regular: 'MFastVN-Regular',
  bold: 'MFastVN-Bold',
  boldItalic: 'MFastVN-BoldItalic',
  medium: 'MFastVN-Medium',
  mediumItalic: 'MFastVN-MediumItalic',
  semiBold: 'MFastVN-SemiBold',
  semiBoldItalic: 'MFastVN-SemiBoldItalic',
};
// xx-small, x-small, small, medium, large, x-large, xx-large, xxx-large
export const fontSize = {
  xxSmall: SH(9),
  xSmall: SH(10),
  small: SH(11),
  medium: SH(13),
  large: SH(15),
  xLarge: SH(18),
  xxLarge: SH(21),
};

const item = {
  cat_alias: 'finance',
  cat_title: 'Sản phẩm tài chính',
  position: 'top',
  note: '<p>Giới thiệu, tư vấn khách hàng vay với nhiều lựa chọn từ các đối tác </p>',
  urlAllItemPress: '',
  categories: [
    {
      id: 'vidientu',
      name: 'Ví điện tử',
    },
    {
      id: 'nganhang',
      name: 'Ngân hàng',
    },
  ],
  items: [
    {
      url_title: 'MCredit',
      title: 'MCredit',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/mc.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=376',
      disable: [],
      badge: '5.5%',
      highlight: false,
      tag_name: 'MCREDIT',
      category: 'nganhang',
      extra_config: {
        badge: '5.5%',
        highlight: '0',
      },
    },
    {
      url_title: 'PTF',
      title: 'PTF',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/ptf.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=377',
      disable: [],
      badge: '5.0%',
      highlight: false,
      tag_name: 'PTF',
      extra_config: {
        badge: '5.0%',
        highlight: '0',
      },
    },
    {
      url_title: 'Easy Credit',
      title: 'Easy Credit',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/easy.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=378',
      disable: [],
      badge: '4.0%',
      highlight: false,
      tag_name: 'EASY_CREDIT',
      extra_config: {
        badge: '4.0%',
        highlight: '0',
      },
    },
    {
      url_title: 'SHB Finance',
      title: 'SHB Finance',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/shb.png',
      url: 'https://appay-rc.cloudcms.vn//finance/home?projectID=379',
      disable: [],
      badge: '4.0%',
      highlight: false,
      tag_name: 'SHB_FINANCE',
      extra_config: {
        badge: '4.0%',
        highlight: '0',
      },
    },
    {
      url_title: 'Home Credit',
      title: 'Home Credit',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/home.png',
      url: 'https://appay-rc.cloudcms.vn//app/home_credit',
      disable: [],
      badge: '3.0%',
      highlight: false,
      tag_name: 'HOME_CREDIT',
      extra_config: {
        badge: '3.0%',
        highlight: '0',
      },
    },
    {
      url_title: 'CIMB',
      title: 'CIMB',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/cimb.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=381',
      disable: [],
      badge: '2.68%',
      highlight: false,
      tag_name: 'CIMB',
      extra_config: {
        badge: '2.68%',
        highlight: '0',
      },
    },
    {
      url_title: '$NAP',
      title: '$NAP',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/nap.png',
      url: 'https://appay-rc.cloudcms.vn//mfast/dnap/intro',
      disable: [],
      badge: '2.3%',
      highlight: false,
      tag_name: '$NAP',
      extra_config: {
        badge: '2.3%',
        highlight: '0',
      },
    },
    {
      url_title: 'Mirae Asset',
      title: 'Mirae Asset',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/mirae.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=383',
      disable: [],
      badge: '1,3 triệu',
      highlight: false,
      tag_name: 'MIRAE_ASSET',
      extra_config: {
        badge: '1,3 triệu',
        highlight: '0',
      },
    },
    {
      url_title: 'Viet Credit',
      title: 'Viet Credit',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/project_logo/icons/vietcredit.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=398',
      disable: [],
      badge: '',
      highlight: false,
      tag_name: 'VIET_CREDIT',
      extra_config: {
        badge: '',
        highlight: '0',
      },
    },
    {
      url_title: 'Vay trả góp MPL',
      title: 'Vay trả góp MPL',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/mpl/ico-mpl.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=414',
      disable: [],
      badge: '',
      highlight: false,
      tag_name: 'VAY_TRA_GOP_MPL',
      extra_config: {
        badge: '',
        highlight: '0',
      },
    },
    {
      url_title: 'Vay cầm cố F88',
      title: 'Vay cầm cố F88',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/mfast/home_image/F88/F88_2.png',
      url: 'https://appay-rc.cloudcms.vn/finance/home?projectID=409',
      disable: [],
      badge: '',
      highlight: false,
      tag_name: 'VAY_CAM_CO_F88',
      extra_config: {
        badge: '',
        highlight: '0',
      },
    },
  ],
  tools_title: 'Tiện ích',
  action_press_all: 'OPEN_BOTTOM_SHEET',
  cat_description: 'Tiện ích hỗ trợ sản phẩm, khách hàng vay',
  tools: [
    {
      url_title: 'Tất cả hồ sơ vay',
      title: 'Tất cả hồ sơ vay',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/project_non_pl/icon-tchsv.png',
      url: 'https://appay-rc.cloudcms.vn/mfast/customer',
      disable: [],
      badge: '',
      tag_name: 'TAT_CA_HO_SO_VAY',
      extra_config: null,
    },
    {
      url_title: 'Link quảng cáo trực tuyến',
      title: 'Link quảng cáo trực tuyến',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/project_non_pl/icon-link-potential.png',
      url: 'mfastmobiledev://open?view=AdLinkScreen&initTabIndex=1',
      disable: [],
      badge: '',
      tag_name: 'LINK_QUANG_CAO_TRUC_TUYEN',
      extra_config: null,
    },
    {
      url_title: 'Thêm hồ sơ vay',
      title: 'Thêm hồ sơ vay',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/project_non_pl/icon-thsv.png',
      url: 'https://appay-rc.cloudcms.vn/mfast/application',
      disable: [],
      badge: '',
      tag_name: 'THEM_HO_SO_VAY',
      extra_config: null,
    },
    {
      url_title: 'Chính sách thu nhập',
      title: 'Chính sách thu nhập',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/project_non_pl/icon-cshh.png',
      url: 'https://appay-rc.cloudcms.vn/mfast/policy',
      disable: [],
      badge: '',
      tag_name: 'CHINH_SACH_HOA_HONG',
      extra_config: null,
    },
    {
      url_title: 'Sản phẩm vay',
      title: 'Sản phẩm vay',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/project_non_pl/icon-spv.png',
      url: 'https://appay-rc.cloudcms.vn/Product_list',
      disable: [],
      badge: '',
      tag_name: 'SAN_PHAM_VAY',
      extra_config: null,
    },
    {
      url_title: 'Tư liệu bán hàng',
      title: 'Tư liệu bán hàng',
      icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/mfast_media_1.png',
      url: 'https://media.mfast.vn/',
      disable: [],
      badge: '',
      tag_name: 'TU_LIEU_BAN_HANG',
      extra_config: null,
    },
    {
      url_title: 'Kiến thức bán hàng',
      title: 'Kiến thức bán hàng',
      icon: 'https://appay-rc.cloudcms.vn/assets/img/project_non_pl/knowleadge.png',
      url: 'mfastmobiledev://open?view=News',
      disable: [],
      badge: '',
      tag_name: 'KIEN_THUC_BAN_HANG',
      extra_config: null,
    },
  ],
};

export const MAIN_CATEGORY_HOME = [
  { id: 'TIPS', name: 'Mẹo cho bạn', icon: ICON_PATH.categoryTips },
  { id: 'finance', name: 'Tài chính', icon: ICON_PATH.categoryPL },
  { id: 'bank', name: 'Tiếp thị liên kết', icon: ICON_PATH.categoryAffiliate },
  { id: 'insurance', name: 'Bảo hiểm', icon: ICON_PATH.categoryIns },
  { id: 'mua_sam', name: 'Dịch vụ, tiện ích', icon: ICON_PATH.categoryService },
  { id: 'tools', name: 'Kiến thức', icon: ICON_PATH.categoryKnowledge },
  { id: 'NEWS', name: 'Thi đua, tin tức', icon: ICON_PATH.categoryNews },
];
