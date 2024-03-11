/**
example

'transTitle' => Tiêu đề
'transDate' => Ngày cập nhật
'creditAmount' => Số tiền (có thể là số âm hoặc số dương)
'status' => 1: 'Đang xử lý'; 2: 'Hoàn tất'

*/

import moment from 'moment/min/moment-with-locales';
import { prettyNumberString } from '../utils/Utils';

export default class PointsTransaction {

  uid = '';
  title = '';
  amount = 0;
  status = 0;
  time = 0;

  // --------------------------------------------------

  static objectFromJSON(json) {
    const object = new PointsTransaction();

    const amount = parseInt(json.creditAmount, 10);
    const status = parseInt(json.status, 10);

    object.uid = json.transCode;
    object.title = json.transTitle;
    object.amount = isNaN(amount) ? 0 : amount;
    object.status = isNaN(status) ? 0 : status;
    object.time = json.transDate;

    return object;
  }

  // --------------------------------------------------

  timeString(format = 'DD/MM/YYYY') {
    return moment(this.time, 'X').format(format);
  }

  amountString() {
    if (!this.mAmountString) {
      const amount = this.amount > 0 ? this.amount : -this.amount;
      const amountString = prettyNumberString(amount);
      this.mAmountString = this.amount >= 0 ? `+ ${amountString}` : `- ${amountString}`;
    }
    return this.mAmountString;
  }

  amountStyle() {
    return this.amount >= 0 ? { color: '#2696E0' } : { color: '#FC1520' };
  }

  statusString() {
    switch (this.status) {
      case 1:
        return 'Đang xử lý';
      case 2:
        return 'Hoàn tất';
      default:
        return 'Unknown';
    }
  }

  statusStyle() {
    switch (this.status) {
      case 1:
        return { color: '#FDA92A' };
      case 2:
        return { color: '#2795E0' };
      default:
        return { color: '#2795E0' };
    }
  }
}
