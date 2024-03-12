class ReferralInfoModel {
  ReferralInfoModel({
    this.cTVText,
    this.cTVText2,
    this.mfastLink,
  });

  ReferralInfoModel.fromJson(dynamic json) {
    cTVText = json['CTV_text'];
    cTVText2 = json['CTV_text2'];
    mfastLink = json['mfast_link'];
  }

  String? cTVText;
  String? cTVText2;
  String? mfastLink;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['CTV_text'] = cTVText;
    map['CTV_text2'] = cTVText2;
    map['mfast_link'] = mfastLink;
    return map;
  }
}
