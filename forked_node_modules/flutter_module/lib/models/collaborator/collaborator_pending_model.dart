class CollaboratorPendingModel {
  String? userID;
  String? fullName;
  String? avatarImage;
  String? cmnd;
  String? note;
  String? sex;
  String? mobilePhone;
  String? createdDate;
  bool? isPoint;
  String? id;
  String? level;

  CollaboratorPendingModel({
    this.userID,
    this.fullName,
    this.avatarImage,
    this.cmnd,
    this.note,
    this.sex,
    this.mobilePhone,
    this.createdDate,
    this.isPoint,
    this.id,
    this.level,
  });

  Map<String, dynamic> toJson() {
    return {
      'userID': userID,
      'fullName': fullName,
      'avatarImage': avatarImage,
      'cmnd': cmnd,
      'note': note,
      'sex': sex,
      'mobilePhone': mobilePhone,
      'createdDate': createdDate,
      'isPoint': isPoint,
      'id': id,
      'level': level,
    };
  }

  factory CollaboratorPendingModel.fromJson(Map<String, dynamic> map) {
    return CollaboratorPendingModel(
      userID: map['userID'],
      fullName: map['fullName'],
      avatarImage: map['avatarImage'],
      cmnd: map['CMND'],
      note: map['note'],
      sex: map['sex'],
      mobilePhone: map['mobilePhone'],
      createdDate: map['createdDate'],
      isPoint: map['isPoint'],
      id: map['ID'],
      level: map['level'],
    );
  }
}
