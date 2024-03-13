// {
//   "del30": "96.31",
//   "penalty": "20",
//   "url": "http://appay.cloudcms.test/fe_credit/del/dpd/?DSA_CODE=DGT02295&date=2018-05-21"
// }

export default class BadLoans {

  role = '';
  label_1 = '';
  label_2 = '';
  label_3 = '';
  del30 = '';
  penalty = '';
  date = '';
  url = '';

  static objectFromJSON(json) {
    const object = new BadLoans();

    object.role = json.role;
    object.label_1 = json.label_1;
    object.label_2 = json.label_2;
    object.label_3 = json.label_3;
    object.del30 = json.del30;
    object.penalty = json.penalty;
    object.date = json.date;
    object.url = json.url;

    return object;
  }

  isOver() {
    return parseFloat(this.del30) >= 5.5;
  }

  static fakeData() {
    // const data =
    //   {
    //     "del30": "96.31",
    //     "penalty": "20",
    //     "url": "http://appay.cloudcms.test/fe_credit/del/dpd/?DSA_CODE=DGT02295&date=2018-05-21"
    //   }
    const item = new BadLoans();
    item.del30 = '2.4';
    item.label_1 = 'Chỉ số DEL30 MOB4';
    item.label_2 = '- Chỉ số DEL lớn hơn 5.5% không được xét thăng tiến\n- Khấu trừ thu nhập tạm tính theo quy định 0%';
    item.label_3 = 'Cập nhật lần cuối';
    item.date = '31/05/2018';
    item.url = 'http://appay.cloudcms.test/fe_credit/del/dpd/?DSA_CODE=DGT02295&date=2018-05-21';
    return item;
  }
}
