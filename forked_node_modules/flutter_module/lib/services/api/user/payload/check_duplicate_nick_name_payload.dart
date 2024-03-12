class CheckDuplicateNickNamePayload {
  CheckDuplicateNickNamePayload({
    this.nickName,
  });

  String? nickName;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['full_name'] = nickName;
    return map;
  }
}
