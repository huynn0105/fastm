class CollaboratorSupporterModel {
  String? toUserID;
  String? avatarImage;
  String? fullName;
  String? title;
  String? mobilePhone;

  CollaboratorSupporterModel({this.toUserID, this.avatarImage, this.fullName, this.title, this.mobilePhone});

  CollaboratorSupporterModel.fromJson(Map<String, dynamic> json) {
    toUserID = json['toUserID'];
    avatarImage = json['avatarImage'];
    fullName = json['fullName'];
    title = json['title'];
    mobilePhone = json['mobilePhone'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['toUserID'] = toUserID;
    data['avatarImage'] = avatarImage;
    data['fullName'] = fullName;
    data['title'] = title;
    data['mobilePhone'] = mobilePhone;
    return data;
  }
}
