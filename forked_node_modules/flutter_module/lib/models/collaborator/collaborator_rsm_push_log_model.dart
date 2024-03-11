import 'dart:convert';

class CollaboratorRsmPushLogModel {
  CollaboratorRsmPushLogModel({
    this.id,
    this.userID,
    this.usersArr,
    this.totalRSM,
    this.notifyId,
    this.status,
    this.processStarted,
    this.processFininshed,
    this.typeRSM,
    this.statusRSM,
    this.topRSM,
    this.content,
  });

  CollaboratorRsmPushLogModel.fromJson(dynamic json) {
    id = json['ID'];
    userID = json['userID'];
    usersArr = json['users_arr'];
    totalRSM = json['totalRSM'];
    notifyId = json['notify_id'];
    status = json['status'];
    processStarted = json['processStarted'];
    processFininshed = json['processFininshed'];
    requestData = json['request'];
    final request = json['request'] != null ? jsonDecode(json['request']) : null;
    final filterCondition = request?['data']?['filterCondition'];
    typeRSM = filterCondition?['typeRSM'];
    statusRSM = filterCondition?['statusRSM'];
    topRSM = filterCondition?['topRSM'];
    content = request?['notification']?['body'];
  }

  String? id;
  String? userID;
  String? usersArr;
  String? totalRSM;
  String? notifyId;
  String? status;
  String? processStarted;
  String? processFininshed;
  String? typeRSM;
  String? statusRSM;
  String? topRSM;
  String? content;
  String? requestData;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['ID'] = id;
    map['userID'] = userID;
    map['users_arr'] = usersArr;
    map['totalRSM'] = totalRSM;
    map['notify_id'] = notifyId;
    map['status'] = status;
    map['processStarted'] = processStarted;
    map['processFininshed'] = processFininshed;
    map['typeRSM'] = typeRSM;
    map['statusRSM'] = statusRSM;
    map['topRSM'] = topRSM;
    map['content'] = content;
    return map;
  }

  isFinished() {
    return status == 'done';
  }
}
