// {
//   "amountFinal": "2800000",
//   "expDateTime": "27/07/2020",
//   "tenure": "22",
//   "tenureTotal": "24"
// }

import { prettyMoneyString } from '../utils/Utils';

export default class UserAppLight {
  title = '';
  amountFinal = '';
  expDateTime = '';
  tenure = '';
  tenureTotal = '';
  url = '';

  static objectFromJSON(json) {
    const object = new UserAppLight();

    object.title = json.title;
    object.amountFinal = json.amountFinal;
    object.expDateTime = json.expDateTime;
    object.tenure = json.tenure;
    object.tenureTotal = json.tenureTotal;
    object.url = json.url;

    return object;
  }

  requestPrettyAmount() {
    return `${prettyMoneyString(this.amountFinal, '')}đ`;
  }

  static sampleData(): {} {
    return {
      status: true,
      data: {
        title: 'Hợp đồng tài chính của bạn',
        amountFinal: '100000000',
        expDateTime: '12/1/2018',
        tenure: '1',
        tenureTotal: '12',
        url: 'www.google.com',
      },
    };
  }
}
