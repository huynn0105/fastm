class TileData {
  String? code;
  String? title;
  String? icon;

  TileData({this.code, this.title, this.icon});

  TileData.fromJson(Map<String, dynamic> json) {
    code = json['code'];
    title = json['title'];
    icon = json['icon'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['code'] = code;
    data['title'] = title;
    data['icon'] = icon;
    return data;
  }
}
