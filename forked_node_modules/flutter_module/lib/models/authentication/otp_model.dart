class OtpModel {
  OtpModel({
    this.status,
    this.otpCode,
    this.channel,
    this.logOtpID,
    this.allowRetryEmail,
    this.waitRetry,
  });

  OtpModel.fromJson(dynamic json) {
    status = json['status'];
    otpCode = json['otp_code'];
    channel = json['channel'];
    logOtpID = json['logOtpID'];
    allowRetryEmail = json['allow_retry_email'];
    waitRetry = json['wait_retry'];
  }

  bool? status;
  String? otpCode;
  String? channel;
  int? logOtpID;
  bool? allowRetryEmail;
  int? waitRetry;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['status'] = status;
    map['otp_code'] = otpCode;
    map['channel'] = channel;
    map['logOtpID'] = logOtpID;
    map['allow_retry_email'] = allowRetryEmail;
    map['wait_retry'] = waitRetry;
    return map;
  }
}
