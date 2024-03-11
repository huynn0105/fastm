class LegendaryCollaboratorsByFilterPayload {
  const LegendaryCollaboratorsByFilterPayload({
    this.level,
    this.sort,
    this.work,
    this.tabs,
    this.keyword,
    this.month,
    this.userID,
    this.page = 1,
  });

  final List<String>? level;
  final String? sort;
  final String? work;
  final String? tabs;
  final String? keyword;
  final String? month;
  final String? userID;
  final int page;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['level'] = level;
    map['sort'] = sort;
    map['work'] = work;
    map['tabs'] = tabs;
    map['keyword'] = keyword;
    map['month'] = month;
    map['userID'] = userID;
    map['page'] = page;
    return map;
  }

  LegendaryCollaboratorsByFilterPayload copyWith({
    List<String>? level,
    String? sort,
    String? work,
    String? tabs,
    String? keyword,
    String? month,
    String? userID,
    int? page,
  }) {
    return LegendaryCollaboratorsByFilterPayload(
      level: level ?? this.level,
      sort: sort ?? this.sort,
      work: work ?? this.work,
      tabs: tabs ?? this.tabs,
      keyword: keyword ?? this.keyword,
      month: month ?? this.month,
      userID: userID ?? this.userID,
      page: page ?? this.page,
    );
  }
}
