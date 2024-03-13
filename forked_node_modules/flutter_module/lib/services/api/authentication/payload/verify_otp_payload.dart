class VerifyOtpPayload {
  VerifyOtpPayload({
    this.platform,
    this.accessToken,
    this.deviceUDID,
    this.otpCode,
  });

  VerifyOtpPayload.fromJson(dynamic json) {
    platform = json['platform'];
    accessToken = json['accessToken'];
    deviceUDID = json['deviceUDID'];
    otpCode = json['otp_code'];
  }

  String? platform;
  String? accessToken;
  String? deviceUDID;
  String? otpCode;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['platform'] = platform;
    map['accessToken'] = accessToken;
    map['deviceUDID'] = deviceUDID;
    map['otp_code'] = otpCode;
    return map;
  }
}
