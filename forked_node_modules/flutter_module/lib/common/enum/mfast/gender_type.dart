enum GenderType {
  female('female', "Nữ"),
  male('male', "Nam"),
  other('other', "Khác");

  final String id;
  final String name;
  const GenderType(this.id, this.name);
}

extension GenderTypeExtension on GenderType {
  bool get isFemale => this == GenderType.female;
  bool get isMale => this == GenderType.male;
  bool get isOther => this == GenderType.other;
}
