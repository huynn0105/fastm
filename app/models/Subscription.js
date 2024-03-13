/**
example

"subscriptionID": "8",
"projectID": "1",
"projectDescription": "Sản phẩm tài chính FE Credit",
"partnerWebsite": "www.fecredit.com.vn",
"logoImage": "http://125.212.211.29/docs/fecredit.jpg",
"featureImage": "http://crm.appay.vn/assets/img-temp/600x300/img1.png",
"projectRoleID": "2",
"roleDescription": "Tìm KH",
"projectLevelID": "4",
"projectLevelDescription": "Platinum",
"money": "4500000",
"point": "4230",
"appURL": "http://crm.appay.vn/fe_credit/main"

*/

import { prettyNumberString, prettyMoneyString } from '../utils/Utils';

export default class Subscription {

  uid = '';

  projectID = '';
  projectName = '';
  projectDetails = '';
  roleID = '';
  roleDetails = '';
  levelID = '';
  levelDetails = '';

  detailsURL = '';
  partnerWebsite = '';
  logoImage = '';
  featureImage = '';

  totalMoney = 0;
  totalPoint = 0;

  // --------------------------------------------------

  static objectFromJSON(json) {
    const object = new Subscription();

    const totalMoney = parseInt(json.money, 10);
    const totalPoint = parseInt(json.point, 10);

    object.uid = json.subscriptionID;

    object.projectID = json.projectID;
    object.projectName = json.projectName;
    object.projectDetails = json.projectDescription;
    object.roleID = json.projectRoleID;
    object.roleDetails = json.roleDescription;
    object.levelID = json.projectLevelID;
    object.levelDetails = json.projectLevelDescription;

    object.partnerWebsite = json.partnerWebsite;
    object.detailsURL = json.appURL;
    object.logoImage = json.logoImage;
    object.featureImage = json.featureImage;

    object.totalMoney = isNaN(totalMoney) ? 0 : totalMoney;
    object.totalPoint = isNaN(totalPoint) ? 0 : totalPoint;

    if (json.mainColor && typeof json.mainColor === 'string' && json.mainColor.length === 7) {
      object.roleColor = json.mainColor;
    }

    // check object valid
    if (!object.uid || !object.projectID || !object.roleID) {
      return null;
    }

    if (object.roleStyle) {
      object.roleStyle();
    }

    return object;
  }

  // --------------------------------------------------

  logoImageURI() {
    return { uri: this.logoImage };
  }

  featureImageURI() {
    return { uri: this.featureImage };
  }

  totalMoneyString() {
    return prettyMoneyString(this.totalMoney);
  }

  totalPointString() {
    return prettyNumberString(this.totalPoint);
  }

  roleStyle() {
    if (this.mRoleStyle) { 
      return this.mRoleStyle; 
    }
    let style = { color: '#202020' };
    if (this.roleColor && this.roleColor.length > 0) {
      style = { color: this.roleColor };
    }
    this.mRoleStyle = style;
    return style;
  }
}
