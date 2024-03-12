class CheckChangeSupporterModel {
  ErrorComm? errorComm;
  ErrorComm? errorApp;
  ErrorComm? errorLogin;
  String? userID;
  String? detailLink;

  CheckChangeSupporterModel({this.errorComm, this.errorApp, this.errorLogin, this.userID, this.detailLink});

  CheckChangeSupporterModel.fromJson(Map<String, dynamic> json) {
    errorComm = json['error_comm'] != null ? ErrorComm.fromJson(json['error_comm']) : null;
    errorApp = json['error_app'] != null ? ErrorComm.fromJson(json['error_app']) : null;
    errorLogin = json['error_login'] != null ? ErrorComm.fromJson(json['error_login']) : null;
    userID = json['userID'];
    detailLink = json['detail_link'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    if (errorComm != null) {
      data['error_comm'] = errorComm!.toJson();
    }
    if (errorApp != null) {
      data['error_app'] = errorApp!.toJson();
    }
    if (errorLogin != null) {
      data['error_login'] = errorLogin!.toJson();
    }
    data['userID'] = userID;
    data['detail_link'] = detailLink;
    return data;
  }
}

class ErrorComm {
  String? condition;
  int? currentTime;

  ErrorComm({this.condition, this.currentTime});

  ErrorComm.fromJson(Map<String, dynamic> json) {
    condition = json['condition'];
    currentTime = json['current_time'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['condition'] = condition;
    data['current_time'] = currentTime;
    return data;
  }
}
