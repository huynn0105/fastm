class VerifyEmailOTPPayload {
  VerifyEmailOTPPayload({
    this.email,
    this.otpCode,
  });

  String? email;
  String? otpCode;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['email'] = email;
    map['otpCode'] = otpCode;
    return map;
  }
}
