enum ErrorCodeType {
  wrongOtp('wrong_otp'),
  otpNotExist('otp_not_exist'),
  userNotExist('user_not_exist');

  final String value;
  const ErrorCodeType(this.value);
}

extension ErrorCodeTypeExtension on ErrorCodeType {
  bool get isWrongOtp => this == ErrorCodeType.wrongOtp;
}
