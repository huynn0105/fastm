/**
example

'transTitle' => Tiêu đề
'transDate' => Ngày cập nhật
'creditAmount' => Số tiền (có thể là số âm hoặc số dương)
'status' => 1: 'Đang xử lý'; 2: 'Hoàn tất', 3: 'Thất bại'

*/

import moment from 'moment/min/moment-with-locales';
import { prettyMoneyString } from '../utils/Utils';

export default class MoneyTransaction {

  uid = '';
  title = '';
  amount = 0;
  status = 0;
  time = 0;

  mTimeMoment;
  mAmountString;

  // --------------------------------------------------

  static objectFromJSON(json) {
    const object = new MoneyTransaction();

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

  timeMoment() {
    if (!this.mTimeMoment) {
      this.mTimeMoment = moment(this.time, 'X');
    }
    return this.mTimeMoment;
  }

  timeString(format = 'DD/MM/YYYY') {
    return this.timeMoment().format(format);
  }

  amountString() {
    if (!this.mAmountString) {
      const amount = this.amount > 0 ? this.amount : -this.amount;
      const amountString = prettyMoneyString(amount);
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
