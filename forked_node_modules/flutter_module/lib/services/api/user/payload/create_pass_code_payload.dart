class CreatePassCodePayload {
  CreatePassCodePayload({
    this.mobilePhone,
    this.password,
  });

  CreatePassCodePayload.fromJson(dynamic json) {
    mobilePhone = json['mobilePhone'];
    password = json['password'];
  }

  String? mobilePhone;
  String? password;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['mobilePhone'] = mobilePhone;
    map['password'] = password;
    return map;
  }
}
