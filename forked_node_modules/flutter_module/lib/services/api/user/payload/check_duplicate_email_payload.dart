class CheckDuplicateEmailPayload {
  CheckDuplicateEmailPayload({
    this.email,
  });

  String? email;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['email'] = email;
    return map;
  }
}
