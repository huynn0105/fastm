/**
Sample JSON:
{
            "holderName": "Phan Thanh Vinh",
            "accountNumber": "130098789",
            "bankName": "ACB",
            "status": "pending",
            "detailURL": "https://appay-rc.cloudcms.vn/fe_credit/banking/update/4"
        }

        Note 'status': pending -> chờ duyệt; failed -> thất bại; success -> thành công
*/

export const BANK_STATUS_TYPE = {
  pending: 'pending',
  failed: 'failed',
  success: 'success',
  none: '',
};

export default class Bank {

  holderName = '';
  accountNumber = '';
  bankName: '';
  status: BANK_STATUS_TYPE.none;
  detailURL: '';

  static objectFromJSON(json) {
    const object = new Bank();

    object.holderName = json.holderName;
    object.accountNumber = json.accountNumber;
    object.bankName = json.bankName;
    object.status = BANK_STATUS_TYPE[json.status];
    object.detailURL = json.detailURL;

    return object;
  }
}
