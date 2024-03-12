class UpdateUserPayload {
  UpdateUserPayload({
    this.avatarImage,
  });

  String? avatarImage;

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['avatarImage'] = avatarImage;
    return data..removeWhere((key, value) => value == null || value == '');
  }
}
