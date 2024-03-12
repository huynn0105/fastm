class DeleteAccountPayload {
  String? otpCode;
  String? reason;

  DeleteAccountPayload({this.otpCode, this.reason});

  DeleteAccountPayload.fromJson(Map<String, dynamic> json) {
    otpCode = json['otp_code'];
    reason = json['reason'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['otp_code'] = otpCode;
    data['reason'] = reason;
    return data;
  }
}
