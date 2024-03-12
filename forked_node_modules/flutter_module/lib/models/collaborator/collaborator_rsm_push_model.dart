class CollaboratorRsmPushModel {
  CollaboratorRsmPushModel({
    this.id,
    this.userReferral,
    this.fullName,
    this.avatarImage,
    this.mobilePhone,
    this.idNumber,
    this.sex,
    this.createdDate,
    this.referralCode,
    this.depth,
    this.rsaName,
    this.rsmMobilePhone,
    // this.rsaUserReferral,
    this.hh,
    this.tg,
    this.sumAmount,
    this.maxComDate,
  });

  CollaboratorRsmPushModel.fromJson(dynamic json) {
    id = json['ID'];
    userReferral = json['userReferral'];
    fullName = json['fullName'];
    avatarImage = json['avatarImage'];
    mobilePhone = json['mobilePhone'];
    idNumber = json['idNumber'];
    sex = json['sex'];
    createdDate = json['createdDate'];
    referralCode = json['referralCode'];
    depth = json['depth'];
    rsaName = json['rsaName'];
    rsmMobilePhone = json['rsmMobilePhone'];
    // rsaUserReferral = json['rsaUserReferral'];
    hh = json['hh'];
    tg = json['tg'];
    sumAmount = json['sum_amount'];
    maxComDate = json['max_com_date'];
  }

  String? id;
  String? userReferral;
  String? fullName;
  String? avatarImage;
  String? mobilePhone;
  String? idNumber;
  String? sex;
  String? createdDate;
  String? referralCode;
  String? depth;
  String? rsaName;
  String? rsmMobilePhone;

  // dynamic rsaUserReferral;
  String? hh;
  String? tg;
  String? sumAmount;
  String? maxComDate;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['ID'] = id;
    map['userReferral'] = userReferral;
    map['fullName'] = fullName;
    map['avatarImage'] = avatarImage;
    map['mobilePhone'] = mobilePhone;
    map['idNumber'] = idNumber;
    map['sex'] = sex;
    map['createdDate'] = createdDate;
    map['referralCode'] = referralCode;
    map['depth'] = depth;
    map['rsaName'] = rsaName;
    map['rsmMobilePhone'] = rsmMobilePhone;
    // map['rsaUserReferral'] = rsaUserReferral;
    map['hh'] = hh;
    map['tg'] = tg;
    map['sum_amount'] = sumAmount;
    map['max_com_date'] = maxComDate;
    return map;
  }
}
