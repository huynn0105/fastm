class GetLoginHistoryPayload {
  GetLoginHistoryPayload({
    this.userID,
    this.page,
    this.perPage,
  });

  String? userID;
  int? page;
  int? perPage;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['userID'] = userID;
    map['page'] = page;
    map['perPage'] = perPage;
    return map;
  }

  GetLoginHistoryPayload copyWith({
    String? userID,
    int? page,
    int? perPage,
  }) {
    return GetLoginHistoryPayload(
      userID: userID ?? this.userID,
      page: page ?? this.page,
      perPage: perPage ?? this.perPage,
    );
  }
}
