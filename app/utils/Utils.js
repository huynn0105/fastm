import { isInteger, isNaN } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Reactotron from 'reactotron-react-native';
import {
  Configs,
  DeepLinkPaths,
  DEEP_LINK_BASE_URL,
  EndpointJoinGroupMfast,
} from '../constants/configs';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const IS_DEV = __DEV__;

// --------------------------------------------------

export default class Utils {
  static ipArr = null;
  static getIpAddress() {
    return this.ipArr;
  }
  static setIpAddress(ipAddress) {
    this.ipArr = ipAddress;
  }
  static log(message, ...args) {
    if (!Configs.enableLog) return;
    Reactotron.display({
      name: 'LOG',
      preview: message,
      value: { message, args },
    });
  }
  static warn(message, ...args) {
    if (!Configs.enableLog) return;
    Reactotron.display({
      name: 'WARN',
      preview: message,
      value: { message, args },
      important: true,
    });
  }
  static error(message, ...args) {
    if (!Configs.enableLog) return;
    Reactotron.display({
      name: 'ERROR',
      preview: message,
      value: { message, args },
      important: true,
    });
  }
  static timeout(miliseconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, miliseconds);
    });
  }
  static timeout(miliseconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, miliseconds);
    });
  }
}

// --------------------------------------------------

export function getAppVersion() {
  return DeviceInfo.getVersion();
}

export function getAppVersionAndBuild() {
  const version = DeviceInfo.getVersion();
  const buildNumber = Configs.isBuildNumberHidden ? '' : `(${DeviceInfo.getBuildNumber()})`;
  return `${version} ${buildNumber}`;
}

export function getDeviceSystemVersion() {
  return DeviceInfo.getSystemVersion();
}

export function getDeviceUDID() {
  return DeviceInfo.getUniqueId();
}

export function getDeviceModel() {
  return DeviceInfo.getDeviceId();
}

let TRACKING_INFO = null;
export function getDeviceTrackingInfo() {
  if (!TRACKING_INFO) {
    TRACKING_INFO = {
      os: Platform.OS,
      osVersion: getDeviceSystemVersion(),
      appVersion: getAppVersion(),
      deviceUDID: getDeviceUDID(),
      deviceModel: getDeviceModel(),
    };
  }
  return TRACKING_INFO;
}

export function isPhoneX() {
  // return false;
  if (Platform.OS === 'ios') {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 780 ||
        dimen.width === 780 ||
        dimen.height === 812 ||
        dimen.width === 812 ||
        dimen.height === 844 ||
        dimen.width === 844 ||
        dimen.height === 896 ||
        dimen.width === 896 ||
        dimen.height === 926 ||
        dimen.width === 926)
    );
  }
  return false;
}

export function prettyNumberString(number, isDot) {
  let digits = `${number}`;
  digits = digits.split('');
  let minus = '';
  if (digits.length > 0 && digits[0] === '-') {
    minus = '-';
    digits.splice(0, 1);
  }
  digits = digits.reverse();
  let results = [];
  for (let i = 0; i < digits.length; i += 1) {
    results.push(digits[i]);
    if ((i + 1) % 3 === 0 && i < digits.length - 1) {
      results.push(isDot ? '.' : ',');
    }
  }
  results = minus + results.reverse().join('');
  return results;
}

export function prettyMoneyString(money, unit = 'vnđ') {
  const moneyString = prettyNumberString(money);
  if (unit === undefined || unit.length === 0) {
    return moneyString;
  }
  return `${moneyString} ${unit}`;
}

export function prettyStringWithout(string, unit = ',') {
  if (!string.length) {
    return string;
  }
  return `${string.split(unit).join('')}`;
}

export function prettyMoneyStringWithoutSymbol(money, unit = 'vnđ') {
  const moneyString = prettyNumberString(money);
  if (unit === undefined || unit.length === 0) {
    return moneyString;
  }
  return `${moneyString}`;
}

export function prettyPhoneNumberString(phoneNumber, firstSpacing = 3) {
  const digits = phoneNumber.split('');
  let results = [];
  for (let i = 0; i < digits.length; i += 1) {
    const spacing = i === firstSpacing ? firstSpacing : 4;
    if (i % spacing === 0 && i !== 0) {
      results.push(' ');
    }
    results.push(digits[i]);
  }
  results = results.join('');
  return results;
}

export function isEmailValid(email) {
  if (!email) {
    return false;
  }
  const lowerEmail = email.toLowerCase();
  const reSymbol =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ\u0300\u0301\u0303\u0309\u0323\u02C6\u0306\u031B]/;
  const resultTest = reSymbol.test(lowerEmail);
  if (resultTest) {
    return !resultTest;
  }
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * Convert Object/Dict to an Array
 * keys of the Object will be ommit, only keep vales
 * @param {Object} object
 * @returns array of values
 */
export function getValuesArray(object) {
  const keys = Object.keys(object);
  return keys.map((key) => {
    return Object[key];
  });
}

/**
 * Compare version1 & version2, version has format 'x.x.x' while x is number
 * @param {*} version1
 * @param {*} version2
 */
export function compareVersion(version1, version2) {
  const version1Digits = version1.split('.');
  const version2Digits = version2.split('.');
  for (let i = 0; i < version1Digits.length; i += 1) {
    const d1 = version1Digits[i];
    const d2 = i < version2Digits.length ? version2Digits[i] : 0;
    if (d1 < d2) {
      return -1;
    }
    if (d1 > d2) {
      return 1;
    }
  }
  return 0;
}

/**
 * Help to decoded and parse url to path and params
 * @param {string} encoded url
 */

export function parseURL(url) {
  let decodedURL = decodeURIComponent(url.replace(/\+/g, '%20'));
  // replace {{br}} to \n
  decodedURL = decodedURL.replace(/{{br}}/g, '\n');
  // -
  let path = '';
  let params = '';
  // --
  const queryIndex = decodedURL.indexOf('?');
  if (queryIndex < 0) {
    path = decodedURL;
    params = {};
  } else {
    path = decodedURL.slice(0, queryIndex);
    const paramsString = decodedURL.slice(queryIndex + 1);
    const paramsList = paramsString.split('&');
    switch (path) {
      case DeepLinkPaths.SHARE: {
        const contentIndex = paramsString.indexOf('=');
        params = {
          content: paramsString.slice(contentIndex + 1),
        };
        break;
      }
      case DeepLinkPaths.COPY: {
        const contentIndex = paramsString.indexOf('=');
        params = {
          text: paramsString.slice(contentIndex + 1),
        };
        break;
      }
      case DeepLinkPaths.BROWSER_OPEN: {
        const contentIndex = paramsString.indexOf('=');
        params = {
          url: paramsString.slice(contentIndex + 1),
        };
        break;
      }
      default: {
        params = paramsList.reduce((acc, item) => {
          const pairs = item.split('=');
          if (pairs.length < 2) {
            return acc;
          }
          if (pairs.length === 2) {
            acc[pairs[0]] = pairs[1];
          }
          // case contain = into value lparis
          if (pairs.length > 2) {
            const pairString = [...pairs];
            pairString.shift();
            const value = pairString.join('=');
            acc[pairs[0]] = value;
          }
          // fix missing signer char + (CIMB)
          if (acc && acc.injectFunc) {
            acc.injectFunc = acc.injectFunc.replace(/\ /g, '+');
          }
          return acc;
        }, {});

        // retry map params into url
        if (params && params.url) {
          let originUrl = `${params.url}?`;
          Object.entries(params).forEach(([key, value]) => {
            if (
              key !== 'url' &&
              key !== 'injectFunc' &&
              key !== 'view' &&
              key !== 'title' &&
              value
            ) {
              originUrl = `${originUrl}&${key}=${value}`;
            }
          });
          if (originUrl) {
            params.url = originUrl;
          }
        }
        break;
      }
    }
  }
  // --
  return {
    path,
    params,
  };
}

// --------------------------------------------------
// UTF-8 Encode/Decode
// Thanks to: https://gist.github.com/chrisveness/bcb00eb717e6382c5608
//
/* eslint-disable */
/**
 * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only).
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.
 *
 * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} unicodeString - Unicode string to be encoded as UTF-8.
 * @returns {string} UTF8-encoded string.
 */
export function utf8Encode(unicodeString) {
  if (typeof unicodeString != 'string')
    throw new TypeError('parameter ‘unicodeString’ is not a string');
  const utf8String = unicodeString
    .replace(
      /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | (cc >> 6), 0x80 | (cc & 0x3f));
      },
    )
    .replace(
      /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(
          0xe0 | (cc >> 12),
          0x80 | ((cc >> 6) & 0x3f),
          0x80 | (cc & 0x3f),
        );
      },
    );
  return utf8String;
}

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 *
 * Can be achieved JavaScript by decodeURIComponent(escape(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} utf8String - UTF-8 string to be decoded back to Unicode.
 * @returns {string} Decoded Unicode string.
 */
export function utf8Decode(utf8String) {
  if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  const unicodeString = utf8String
    .replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc =
          ((c.charCodeAt(0) & 0x0f) << 12) |
          ((c.charCodeAt(1) & 0x3f) << 6) |
          (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      },
    )
    .replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc = ((c.charCodeAt(0) & 0x1f) << 6) | (c.charCodeAt(1) & 0x3f);
        return String.fromCharCode(cc);
      },
    );
  return unicodeString;
}
/* eslint-enable */

export function updateTimeAgoString(time) {
  const mUpdateTimeMoment = moment(time, 'x');
  const date = mUpdateTimeMoment.fromNow();
  if (date === 'Invalid date') {
    return '';
  } else {
    return date;
  }
}

export const checkInWhileList = (url) => {
  const urlWhileList = [
    'fb://',
    'https://mobile.facebook',
    'https://m.facebook',
    'zaloshareext://',
    'https://zalo.me/',
  ];

  for (let i = 0; i < urlWhileList.length; i += 1) {
    if (url.includes(urlWhileList[i])) {
      return true;
    }
  }
  return false;
};

export const checkUrlOpenBrowser = (url) => {
  const urls = [
    'https://mpl-rc.onlinelending.vn/onboarding/',
    'https://mpl.onlinelending.vn/onboarding/',
    'https://mpl.mfast.vn/onboarding/',
  ];

  for (let i = 0; i < urls.length; i += 1) {
    if (url.includes(urls[i])) {
      return true;
    }
  }
  return false;
};

export function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function isFullNameValid(fullName) {
  // Rule: only accept letters and apostrophe
  // Ref: https://www.regextester.com/93648
  const regName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
  return regName.test(removeAccents(fullName.trim()));
}

export function isPhoneNumberValid(phoneNumber) {
  // Validate Vietnam phone number
  // Ref: https://vnfaster.com/validate-so-dien-thoai-bang-javascript-don-gian.html
  const regPhoneNumber = /((09|08|06|02|01|04|03|07|05)+([0-9]{8})\b)/g;
  return regPhoneNumber.test(phoneNumber);
}

export function isCitizenIDValid(citizenID) {
  const length = citizenID.length;
  return length >= 9 && length <= 12;
}
export function unixTimeToDateString(time) {
  const date = new Date(time * 1000);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;

  return `${dd}/${mm}/${yyyy}`;
}

export const checkRestrict = (prefix = '', disable = []) => {
  return disable.map((i) => i.toUpperCase()).includes(prefix.toUpperCase())
    ? prefix.toUpperCase()
    : '';
};

export const urlify = (text) => {
  const urlRegex = /(\b(https|http)?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}">${url}</a>`;
  });
};

export const isDeepLink = (url) => {
  return (
    url &&
    (url.startsWith(`${DEEP_LINK_BASE_URL}://`) ||
      url.startsWith(EndpointJoinGroupMfast) ||
      url.startsWith('tel:') ||
      url.startsWith('mailto:') ||
      url.startsWith('fb:') ||
      url.startsWith('https://zalo.me'))
  );
};

export const isNeedAccessToken = (url) => {
  return (
    url &&
    (url.startsWith(Configs.serverURL) ||
      url.startsWith('https://www.mfast.vn') ||
      url.startsWith('https://appay-rc.cloudcms.vn') ||
      url.startsWith('https://appay.cloudcms.vn') ||
      url.startsWith('http://support-rc.appay.vn'))
  );
};

export const sortObject = (obj) => {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

export const getIpAddress = async () => {
  const ip = await DeviceInfo.getIpAddress();
  console.log('TCL: getIpAddress -> ip', ip);
  Utils.setIpAddress(ip);
  return ip;
};
// init get ip address
getIpAddress();

export const formatNumber = (number) => {
  number = Number(number);
  if (isNaN(number)) return 0 + '';
  if (isInteger(number)) {
    return prettyNumberString(number, true);
  } else {
    const split = number?.toFixed(1)?.split('.');
    return prettyNumberString(split[0], true) + ',' + split[1];
  }
};

export const formatCurrency = (n, digits = 1) => {
  if (n < 1e3) return n + '';
  if (n >= 1e3 && n < 1e6) return formatNumber(+(n / 1e3).toFixed(digits)) + ' nghìn';
  if (n >= 1e6 && n < 1e9) return formatNumber(+(n / 1e6).toFixed(digits)) + ' triệu';
  if (n >= 1e9 && n < 1e12) return formatNumber(+(n / 1e9).toFixed(digits)) + ' tỉ';
  if (n >= 1e12) return formatNumber(+(n / 1e12).toFixed(digits)) + ' trăm tỉ';
};

export const isValidPhone = (phone) =>
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(phone);
