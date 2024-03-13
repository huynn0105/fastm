import dateFormat from 'dateformat';
import { Configs } from '../../constants/configs';
import Utils from '../../utils/Utils';

const vnpayTestPayload = () => {
  const date = new Date();
  const ipAddr = Utils.getIpAddress();
  const createDate = dateFormat(date, 'yyyymmddHHmmss');
  const orderId = dateFormat(date, 'HHmmss');
  const amount = 10000000;
  const orderInfo = 'thanh toan';
  const orderType = 'other';
  const locale = 'vn';
  const currCode = 'VND';
  const vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = Configs.vnpTMNCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount;
  vnp_Params['vnp_ReturnUrl'] = Configs.vnpReturnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  return vnp_Params;
}

export default vnpayTestPayload;