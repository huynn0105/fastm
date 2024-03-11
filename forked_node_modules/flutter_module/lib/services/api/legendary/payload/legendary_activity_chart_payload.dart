/// userID : "1240469574"
/// month : "2022-07"
/// type : "pl"

class LegendaryActivityChartPayload {
  LegendaryActivityChartPayload({
    this.userID,
    this.month,
    this.type,
  });

  String? userID;
  String? month;
  String? type;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['userID'] = userID;
    map['month'] = month;
    map['type'] = type;
    return map;
  }

  LegendaryActivityChartPayload copyWith({
    String? userID,
    String? month,
    String? type,
  }) {
    return LegendaryActivityChartPayload(
      userID: userID ?? this.userID,
      month: month ?? this.month,
      type: type ?? this.type,
    );
  }
}
