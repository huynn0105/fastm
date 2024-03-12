// ignore_for_file: public_member_api_docs, sort_constructors_first
class LegendaryReviewUserPayload {
  String? userID;
  String? toUserID;
  int? rating;
  String? comment;
  String? skill;

  LegendaryReviewUserPayload({this.userID, this.toUserID, this.rating, this.comment, this.skill = "lead"});

  LegendaryReviewUserPayload.fromJson(Map<String, dynamic> json) {
    userID = json['userID'];
    toUserID = json['toUserID'];
    rating = json['rating'];
    comment = json['comment'];
    skill = json['skill'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['userID'] = userID;
    data['toUserID'] = toUserID;
    data['rating'] = rating;
    data['comment'] = comment;
    data['skill'] = skill;
    return data;
  }

  LegendaryReviewUserPayload copyWith({
    String? userID,
    String? toUserID,
    int? rating,
    String? comment,
    String? skill,
  }) {
    return LegendaryReviewUserPayload(
      userID: userID ?? this.userID,
      toUserID: toUserID ?? this.toUserID,
      rating: rating ?? this.rating,
      comment: comment ?? this.comment,
      skill: skill ?? this.skill,
    );
  }
}
