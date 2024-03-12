import React, {useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, NativeEventEmitter } from 'react-native'
import VnpayMerchant, { VnpayMerchantModule } from 'react-native-vnpay-merchant'
import hmacSHA512 from 'crypto-js/hmac-sha512';
import querystring from 'query-string';
import dateFormat from 'dateformat';
import {sortObject} from '../../utils/Utils';
import DeviceInfo from 'react-native-device-info';

import AppText from '../../componentV3/AppText';
import {Configs} from '../../constants/configs';

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

DeviceInfo.getIpAddress().then((ip) => {
	console.log("TCL: ip", ip)
  // "92.168.32.44"
});
const TestVNPAY = () => {
  useEffect(() => {
    // mở sdk
    eventEmitter.addListener('PaymentBack', (e) => {
      console.log('Sdk back!')
      if (e) {
        console.log("e.resultCode = " + e.resultCode);
        switch (e.resultCode) {
          //resultCode == -1
          //vi: Người dùng nhấn back từ sdk để quay lại
          //en: back from sdk (user press back in button title or button back in hardware android)

          //resultCode == 10
          //vi: Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...) lúc này app tích hợp sẽ cần lưu lại cái PNR, khi nào người dùng mở lại app tích hợp thì sẽ gọi kiểm tra trạng thái thanh toán của PNR Đó xem đã thanh toán hay chưa.
          //en: user select app to payment (Mobile banking, wallet ...) you need save your PNR code. because we don't know when app banking payment successfully. so when user re-open your app. you need call api check your PNR code (is paid or unpaid). PNR: it's vnp_TxnRef. Reference code of transaction at Merchant system

          //resultCode == 99
          //vi: Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp
          //en: back from button (button: done, ...) in the webview when payment success. (incase payment with card, atm card, visa ...)

          //resultCode == 98
          //vi: giao dịch thanh toán bị failed
          //en: payment failed

          //resultCode == 97
          //vi: thanh toán thành công trên webview
          //en: payment success
        }
      }
    })
    return () => {
      // khi tắt sdk
      eventEmitter.removeAllListeners('PaymentBack')
    }
  }, [])

  var tmnCode = 'MFAST001';
    var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    var returnUrl = "https://appay.cloudcms.vn/payment/result_banking_v2/vnpay";

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = "100000"// req.body.amount;
    // var bankCode = '' // req.body.bankCode;

    var orderInfo = 'thanh toan';
    var orderType = 'other';

    var locale = 'vn';
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '192.168.22.118';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params = sortObject(vnp_Params);
  const signed = hmacSHA512(querystring.stringify(vnp_Params, { encode: false }) , Configs.vnpHashSecret).toString();
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  
  // const paymentUrl = `${Configs.vnpUrl}?${payloadString}&vnp_SecureHash=${hash}`;
	// console.log("TCL: TestVNPAY -> vnpUrl", vnpUrl)

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => {
        VnpayMerchant.show({
          isSandbox: true,
          paymentUrl: vnpUrl,
          tmn_code:  Configs.vnpTMNCode,
          backAlert: 'Bạn có chắc chắn trở lại ko?',
          title: 'VNPAY',
          iconBackName: 'ion_back',
          beginColor: 'ffffff',
          endColor: 'ffffff',
          titleColor: '000000',
          scheme: 'mfastmobile'
        });
      }}>
        <AppText>
          test payment
        </AppText>
      </TouchableOpacity>
    </View>
  )
}

export default TestVNPAY;

const styles = StyleSheet.create({})
