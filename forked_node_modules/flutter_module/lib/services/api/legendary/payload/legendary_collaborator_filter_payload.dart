class LegendaryCollaboratorFilterPayload {
  LegendaryCollaboratorFilterPayload({
    this.rank,
    this.userID,
  });

  LegendaryCollaboratorFilterPayload.fromJson(dynamic json) {
    rank = json['rank'];
    userID = json['userID'];
  }

  String? rank;
  String? userID;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['rank'] = rank;
    map['userID'] = userID;
    return map;
  }
}
