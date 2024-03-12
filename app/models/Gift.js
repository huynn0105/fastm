/**
Sample JSON:

"giftID": "1",
"giftTitle": "Iphone X 64GB trắng",
"giftDescription": "Nhận ngay Iphone X 64GB trắng khi bạn đặt đủ 10,000 điểm tích thưởng",
"giftContent": "Rome's history spans more than 2,500 years. ....",
"giftImage": "http://crm.appay.vn/assets/img-temp/600x300/img1.png"
*/

import { utf8Decode, prettyNumberString } from '../utils/Utils';

const base64 = require('base-64');

export default class Gift {

  uid = '';
  title = '';
  details = '';
  content = '';
  image = '';
  redeemPoints = 0;
  totalViews = 0;
  totalRedeems = 0;
  totalLefts = 0;

  static objectFromJSON(json) {
    const object = new Gift();

    const bytes = base64.decode(json.giftContent);
    const htmlContent = utf8Decode(bytes);
    const totalLefts = parseInt(json.stock, 10);

    object.uid = json.giftID;
    object.title = json.giftTitle;
    object.details = json.giftDescription;
    object.detailsURL = json.webURL;
    object.htmlContent = htmlContent;
    object.image = json.giftImage;
    object.redeemPoints = json.redeemPoint;
    object.totalViews = json.viewCount;
    object.totalRedeems = json.redeemCount;
    object.totalLefts = isNaN(totalLefts) ? 0 : totalLefts;

    if (!object.uid) {
      return null;
    }

    return object;
  }

  imageURI() {
    if (!this.image || this.image.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.image };
  }

  imagePlaceholder() {
    return require('../img/placeholder.jpg');
  }

  redeemPointsString() {
    if (!this.mRedeemPointsString) {
      this.mRedeemPointsString = prettyNumberString(this.redeemPoints);
    }
    return this.mRedeemPointsString;
  }
}
