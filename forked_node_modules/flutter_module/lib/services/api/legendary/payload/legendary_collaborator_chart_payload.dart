/// userID : "1240469574"
/// rank : "head"
/// month : "2022-07"
/// tab : "all"
/// level : "6"
/// type : "sales"

class LegendaryCollaboratorChartPayload {
  LegendaryCollaboratorChartPayload({
    this.userID,
    this.month,
    this.rank,
    this.tab = 'all',
    this.level = '6',
    this.type = 'sales',
  });

  String? userID;
  String? month;
  String? rank;
  String? tab;
  String? level;
  String? type;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['userID'] = userID;
    map['month'] = month;
    map['rank'] = rank;
    map['tab'] = tab;
    map['level'] = level;
    map['type'] = type;
    return map;
  }

  LegendaryCollaboratorChartPayload copyWith({
    String? userID,
    String? month,
    String? rank,
    String? tab,
    String? level,
    String? type,
  }) {
    return LegendaryCollaboratorChartPayload(
      userID: userID ?? this.userID,
      month: month ?? this.month,
      rank: rank ?? this.rank,
      tab: tab ?? this.tab,
      level: level ?? this.level,
      type: type ?? this.type,
    );
  }
}
