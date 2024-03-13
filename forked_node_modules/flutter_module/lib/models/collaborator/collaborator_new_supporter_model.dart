class LegendaryNewSupporterModel {
  String? avatarImage;
  String? fullName;
  String? mobilePhone;
  String? title;
  String? toUserID;
  String? avgRating;
  String? subTitle;
  String? referralID;
  String? district;

  LegendaryNewSupporterModel(
      {this.avatarImage,
      this.fullName,
      this.mobilePhone,
      this.title,
      this.toUserID,
      this.avgRating,
      this.subTitle,
      this.referralID,
      this.district});

  LegendaryNewSupporterModel.fromJson(Map<String, dynamic> json) {
    avatarImage = json['avatarImage'];
    fullName = json['fullName'];
    mobilePhone = json['mobilePhone'];
    title = json['title'];
    toUserID = json['toUserID'];
    avgRating = json['avgRating'];
    subTitle = json['sub_title'];
    referralID = json['referralID'];
    district = json['district'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['avatarImage'] = avatarImage;
    data['fullName'] = fullName;
    data['mobilePhone'] = mobilePhone;
    data['title'] = title;
    data['toUserID'] = toUserID;
    data['avgRating'] = avgRating;
    data['sub_title'] = subTitle;
    data['referralID'] = referralID;
    data['district'] = district;
    return data;
  }
}
