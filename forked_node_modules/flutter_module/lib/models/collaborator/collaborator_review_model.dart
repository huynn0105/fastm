class LegendaryReviewModel {
  String? iD;
  String? toUserID;
  String? rating;
  String? userID;
  String? comment;
  String? skill;
  String? createdDate;
  String? fullName;
  String? title;

  LegendaryReviewModel(
      {this.iD,
      this.toUserID,
      this.rating,
      this.userID,
      this.comment,
      this.skill,
      this.createdDate,
      this.fullName,
      this.title});

  LegendaryReviewModel.fromJson(Map<String, dynamic> json) {
    iD = json['ID'];
    toUserID = json['toUserID'];
    rating = json['rating'];
    userID = json['userID'];
    comment = json['comment'];
    skill = json['skill'];
    createdDate = json['createdDate'];
    fullName = json['fullName'];
    title = json['title'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['ID'] = iD;
    data['toUserID'] = toUserID;
    data['rating'] = rating;
    data['userID'] = userID;
    data['comment'] = comment;
    data['skill'] = skill;
    data['createdDate'] = createdDate;
    data['fullName'] = fullName;
    data['title'] = title;
    return data;
  }
}
