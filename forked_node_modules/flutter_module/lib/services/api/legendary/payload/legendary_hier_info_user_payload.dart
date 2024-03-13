/// userID : "1240469574"
/// isUserCollab : false
/// parentUserID : "1240469574"

class LegendaryHierUserInfoPayload {
  LegendaryHierUserInfoPayload({
    this.userID,
    this.isUserCollab,
    this.parentUserID,
  });

  String? userID;
  bool? isUserCollab;
  String? parentUserID;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    map['userID'] = userID;
    map['isUserCollab'] = isUserCollab;
    map['parentUserID'] = parentUserID;
    return map;
  }

  LegendaryHierUserInfoPayload copyWith({
    String? userID,
    bool? isUserCollab,
    String? parentUserID,
  }) {
    return LegendaryHierUserInfoPayload(
      userID: userID ?? this.userID,
      isUserCollab: isUserCollab ?? this.isUserCollab,
      parentUserID: parentUserID ?? this.parentUserID,
    );
  }
}
