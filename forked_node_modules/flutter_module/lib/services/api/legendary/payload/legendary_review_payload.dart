class LegendaryReviewPayload {
  String? userID;
  String? tab;
  String? skill;
  int? page;

  LegendaryReviewPayload({this.userID, this.tab = 'all', this.skill = "lead", this.page = 1});

  LegendaryReviewPayload.fromJson(Map<String, dynamic> json) {
    userID = json['userID'];
    tab = json['tab'];
    skill = json['skill'];
    page = json['page'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['userID'] = userID;
    data['tab'] = tab;
    data['skill'] = skill;
    data['page'] = page;
    return data;
  }

  LegendaryReviewPayload copyWith({
    String? userID,
    String? tab,
    String? skill,
    int? page,
  }) {
    return LegendaryReviewPayload(
      userID: userID ?? this.userID,
      tab: tab ?? this.tab,
      skill: skill ?? this.skill,
      page: page ?? this.page,
    );
  }
}
