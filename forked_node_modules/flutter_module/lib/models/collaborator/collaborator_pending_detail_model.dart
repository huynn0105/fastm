class CollaboratorPendingDetailModel {
  String? createdDate;
  String? userId;
  String? fullName;
  String? avatarImage;
  String? cmnd;
  String? note;
  String? id;
  String? sex;
  String? mobilePhone;
  String? createdDateUser;
  String? timeAgo;
  int? year;
  int? month;
  int? day;
  String? level;
  LastRatingModel? lastRating;

  CollaboratorPendingDetailModel({
    this.createdDate,
    this.userId,
    this.fullName,
    this.avatarImage,
    this.cmnd,
    this.note,
    this.id,
    this.sex,
    this.mobilePhone,
    this.createdDateUser,
    this.timeAgo,
    this.year,
    this.month,
    this.day,
    this.level,
    this.lastRating,
  });

  factory CollaboratorPendingDetailModel.fromJson(Map<String, dynamic> map) {
    return CollaboratorPendingDetailModel(
      userId: map['userID'],
      fullName: map['fullName'],
      avatarImage: map['avatarImage'],
      cmnd: map['CMND'],
      note: map['note'],
      sex: map['sex'],
      id: map['ID'],
      mobilePhone: map['mobilePhone'],
      createdDate: map['createdDate'],
      createdDateUser: map['createdDateUser'],
      timeAgo: map['timeAgo'],
      year: map['year'],
      month: map['month'],
      day: map['day'],
      level: map['level'],
      lastRating: map['lastRating'] is List? ? null : LastRatingModel.fromJson(map['lastRating']),
    );
  }
}

class LastRatingModel {
  String? fullName;
  String? createdDate;
  double? rating;

  LastRatingModel({
    this.fullName,
    this.createdDate,
    this.rating,
  });

  factory LastRatingModel.fromJson(Map<String, dynamic> map) {
    return LastRatingModel(
      createdDate: map['createdDate'],
      fullName: map['fullName'],
      rating: map['rating'],
    );
  }
}
