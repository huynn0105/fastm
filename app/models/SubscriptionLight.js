/**
example

{
                "label": "GIỚI THIỆU KHÁCH HÀNG",
                "description": "Nhận lên đến <strong>450,000 vnđ</strong> cho 1 khách hàng tham gia thành công",
                "commission": {
                    "label": "Thu nhập tháng 8",
                    "value": "0 vnđ"
                },
                "point": {
                    "label": "Điểm thưởng tháng 8",
                    "value": "0 điểm"
                },
                "secret_key": "28a3562f1e2cce5c9dd77bfad1cbd73f",
                "appURL": "https://appay-rc.cloudcms.vn/fe_credit/main/app_create_predsa",
                "list": [
                    {
                        "label": "Danh sách khách hàng đã giới thiệu",
                        "img": "https://appay-rc.cloudcms.vn/assets/img/ds_khdgt.png",
                        "url": "https://appay-rc.cloudcms.vn/"
                    },
                    {
                        "label": "Chính sách chi trả cho giới thiệu khách hàng",
                        "img": "https://appay-rc.cloudcms.vn/assets/img/cs_ctckhgt.png",
                        "url": "https://appay-rc.cloudcms.vn/"
                    }
                ],
                "news_list": []
            }

*/

export default class SubscriptionLight {
  label = '';

  projectID = '';
  projectName = '';
  projectDetails = '';
  roleID = '';
  roleDetails = '';
  levelID = '';
  levelDetails = '';

  description = '';
  commission = {};
  point = {};
  appURL = '';

  list = [];
  newsList = [];

  // --------------------------------------------------

  static objectFromJSON(json) {
    const object = new SubscriptionLight();

    object.projectID = json.projectID;
    object.projectName = json.projectName;
    object.projectDetails = json.projectDescription;
    object.roleID = json.projectRoleID;
    object.roleDetails = json.roleDescription;
    object.levelID = json.projectLevelID;
    object.levelDetails = json.projectLevelDescription;

    object.label = json.label;
    object.description = json.description;
    object.commission = json.commission;
    object.point = json.point;
    object.appURL = json.appURL;
    object.list = json.list;
    object.newsList = json.news_list;

    return object;
  }
}
