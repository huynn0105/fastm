class CollaboratorCareListModel {
  CollaboratorCareListModel({
    this.total,
    this.data,
  });

  CollaboratorCareListModel.fromJson(dynamic json) {
    total = json['total'];
    if (json['data'] != null) {
      data = [];
      json['data'].forEach((v) {
        data?.add(CollaboratorCareModel.fromJson(v));
      });
    }
  }

  int? total;
  List<CollaboratorCareModel>? data;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['total'] = total;
    if (data != null) {
      map['data'] = data?.map((v) => v.toJson()).toList();
    }
    return map;
  }
}

class CollaboratorCareModel {
  CollaboratorCareModel({
    this.userID,
    this.phone,
    this.avatar,
    this.fullName,
    this.info,
    this.requestDelete,
    this.requestDeleteDate,
  });

  CollaboratorCareModel.fromJson(dynamic json) {
    userID = json['userID'];
    phone = json['phone'];
    avatar = json['avatar'];
    fullName = json['fullName'];
    info = json['info'] != null ? CollaboratorCareInfo.fromJson(json['info']) : null;
    requestDelete = json['requestDelete'];
    requestDeleteDate = json['requestDeleteDate'];
  }

  String? userID;
  String? phone;
  String? avatar;
  String? fullName;
  CollaboratorCareInfo? info;
  bool? requestDelete;
  String? requestDeleteDate;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['userID'] = userID;
    map['phone'] = phone;
    map['avatar'] = avatar;
    map['fullName'] = fullName;
    if (info != null) {
      map['info'] = info?.toJson();
    }
    map['requestDelete'] = requestDelete;
    map['requestDeleteDate'] = requestDeleteDate;
    return map;
  }
}

class CollaboratorCareInfo {
  CollaboratorCareInfo({
    this.notWork,
    this.notIncome,
    this.notOpenApp,
    this.countApp,
  });

  CollaboratorCareInfo.fromJson(dynamic json) {
    notWork = json['not_work'];
    notIncome = json['not_income'];
    notOpenApp = json['not_open_app'];
    countApp = json['count_app'];
  }

  String? notWork;
  String? notIncome;
  String? notOpenApp;
  String? countApp;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['not_work'] = notWork;
    map['not_income'] = notIncome;
    map['not_open_app'] = notOpenApp;
    map['count_app'] = countApp;
    return map;
  }
}
