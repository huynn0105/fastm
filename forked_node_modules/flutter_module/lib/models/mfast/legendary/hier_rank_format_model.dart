// {
//   "level": "Bá chủ",
//   "logo": "https://appay-rc.cloudcms.vn/assets/mfast-new_model/images/rank/bachu.png",
//   "point": 4800,
//   "star": "2"
// }

class HierRankFormatModel {
  String? level;
  String? logo;
  int? point;
  String? star;

  HierRankFormatModel({
    this.level,
    this.logo,
    this.point,
    this.star,
  });

  HierRankFormatModel.fromJson(Map<String, dynamic> json) {
    level = json["level"];
    logo = json["logo"];
    point = json["point"];
    star = json["star"];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data["level"] = level;
    data["logo"] = logo;
    data["point"] = point;
    data["star"] = star;
    return data;
  }
}
