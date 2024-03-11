/// userID : 2049610010
/// month : "2023-10"

class LegendaryRoadChartPayload {
  LegendaryRoadChartPayload({
    this.userID,
    this.month,
  });

  String? userID;
  String? month;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['userID'] = userID;
    map['month'] = month;
    return map;
  }

  LegendaryRoadChartPayload copyWith({
    String? userID,
    String? month,
  }) {
    return LegendaryRoadChartPayload(
      userID: userID ?? this.userID,
      month: month ?? this.month,
    );
  }
}
