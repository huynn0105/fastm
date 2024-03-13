// ignore_for_file: public_member_api_docs, sort_constructors_first
class LegendarySupporterByFilterPayload {
  String? group;
  String? text;
  String? provinceID;
  String? districtID;

  LegendarySupporterByFilterPayload({this.group, this.text, this.provinceID, this.districtID});

  LegendarySupporterByFilterPayload.fromJson(Map<String, dynamic> json) {
    group = json['group'];
    text = json['text'];
    provinceID = json['provinceID'];
    districtID = json['districtID'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['group'] = group;
    data['text'] = text;
    data['provinceID'] = provinceID;
    data['districtID'] = districtID;
    return data;
  }

  LegendarySupporterByFilterPayload copyWith({
    String? group,
    String? text,
    String? provinceID,
    String? districtID,
  }) {
    return LegendarySupporterByFilterPayload(
      group: group ?? this.group,
      text: text ?? this.text,
      provinceID: provinceID ?? this.provinceID,
      districtID: districtID ?? this.districtID,
    );
  }
}
