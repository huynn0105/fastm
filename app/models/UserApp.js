//   {
//   "productName": "Vay theo lương",
//   "requestAmount": "Đang cập nhật",
//   "tenureRequested": "Đang cập nhật",
//   "lastProcessText": "Không chắc - cần chuẩn bị giấy tờ",
//   "detailURL": "https://appay-rc.cloudcms.vn/fe_credit/main/app_single/?app_id=36207"
//   }

import { prettyMoneyString } from '../utils/Utils';

export default class UserApp {

  productName = '';
  requestAmount = '';
  tenureRequested = '';
  lastProcessText = '';
  detailURL = '';

  static objectFromJSON(json) {

    const object = new UserApp();

    object.productName = json.productName;
    object.requestAmount = json.requestAmount;
    object.tenureRequested = json.tenureRequested;
    object.lastProcessText = json.lastProcessText;
    object.detailURL = json.detailURL;

    return object;
  }

  requestPrettyAmount() {
    return prettyMoneyString(this.requestAmount, '');
  }
  tenureRequestedWithUnit() {
    return `${this.tenureRequested} tháng`;
  }

  static sampleData(): {} {
    return {
      status: true,
      data: [
        {
          productName: 'Hợp đồng tài chính của bạn',
          requestAmount: '100000000',
          tenureRequested: '12',
          lastProcessText: 'Đã nhận hồ sơ hoàn tất',
          detailURL: 'www.google.com',
        },
        // {
        //   productName: 'Hợp đồng tài chính của bạn',
        //   requestAmount: '100,000,000',
        //   tenureRequested: '12',
        //   lastProcessText: 'Đã nhận hồ sơ hoàn tất',
        //   detailURL: 'www.google.com',
        // },
      ],
      data_pagination: {
        total_rows: '1',
        per_page: '10',
        page: '1',
      },
    };
  }
}
