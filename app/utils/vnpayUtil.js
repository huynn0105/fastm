import { HmacSHA512 } from 'crypto-js';
import { Configs, DEEP_LINK_BASE_URL, isDevelopment, isStaging } from '../constants/configs';
import Utils, { sortObject } from './Utils';
import VnpayMerchant, { VnpayMerchantModule } from 'react-native-vnpay-merchant';
import querystring from 'query-string';
import { Alert, NativeEventEmitter } from 'react-native';

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

export const openVNPay = (dataJSON) => {
  try {
    let vnp_Params = dataJSON?.data || {};
    const ipAddr = Utils.getIpAddress();
    vnp_Params.vnp_IpAddr = ipAddr;
    vnp_Params.vnp_TmnCode = Configs.vnpTMNCode;
    vnp_Params.vnp_OrderInfo = dataJSON.data.vnp_OrderInfo;
    this.setState({ jsonPayload: dataJSON });
    vnp_Params = sortObject(vnp_Params);
    let vnpUrl = Configs.vnpUrl;
    const signed = HmacSHA512(
      querystring.stringify(vnp_Params, { encode: false }),
      Configs.vnpHashSecret,
    ).toString();
    vnp_Params.vnp_SecureHash = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    VnpayMerchant.show({
      isSandbox: isDevelopment || isStaging ? true : false,
      paymentUrl: vnpUrl,
      tmn_code: Configs.vnpTMNCode,
      backAlert: 'Bạn có chắc chắn trở lại ko?',
      title: ' ',
      iconBackName: 'back',
      titleColor: '000000',
      beginColor: 'f2f2f2',
      endColor: 'f2f2f2',
      scheme: `${DEEP_LINK_BASE_URL}://vnpay`,
    });
  } catch (error) {
    Alert.alert('Error open vnpay sdk', JSON.stringify(error));
  }
};

export const listenerVNPay = () => {
  eventEmitter.addListener('PaymentBack', (e) => {
    if (e) {
    }
  });
};

export const removeListenerVNPay = () => {
  eventEmitter.removeAllListeners('PaymentBack');
};
