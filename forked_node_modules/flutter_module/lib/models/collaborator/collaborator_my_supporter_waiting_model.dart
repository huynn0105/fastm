class MySupporterWaitingModel {
  String? avatarImage;
  String? fullName;
  String? mobilePhone;
  String? title;
  String? toUserID;
  String? avgRating;
  String? time;

  MySupporterWaitingModel({
    this.avatarImage,
    this.fullName,
    this.mobilePhone,
    this.title,
    this.toUserID,
    this.avgRating,
    this.time,
  });

  MySupporterWaitingModel.fromJson(Map<String, dynamic> json) {
    avatarImage = json['avatarImage'];
    fullName = json['fullName'];
    mobilePhone = json['mobilePhone'];
    title = json['title'];
    toUserID = json['toUserID'];
    avgRating = json['avgRating'];
    time = json['time'];
  }
}
