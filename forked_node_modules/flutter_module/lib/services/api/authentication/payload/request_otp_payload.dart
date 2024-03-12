class RequestOtpPayload {
  RequestOtpPayload({
    this.mobilePhone,
    this.isRetry,
    this.type,
  });

  RequestOtpPayload.fromJson(dynamic json) {
    mobilePhone = json['mobilePhone'];
    isRetry = json['isRetry'];
    type = json['type'];
  }

  String? mobilePhone;
  bool? isRetry;
  String? type;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['mobilePhone'] = mobilePhone;
    map['isRetry'] = isRetry;
    map['type'] = type;
    return map;
  }
}
