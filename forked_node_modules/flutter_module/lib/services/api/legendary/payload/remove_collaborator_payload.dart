class RemoveCollaboratorPayload {
  RemoveCollaboratorPayload({
    this.collaborators,
    this.all,
  });

  RemoveCollaboratorPayload.fromJson(dynamic json) {
    collaborators = json['collaborators'] != null ? json['collaborators'].cast<String>() : [];
    all = json['all'];
  }

  List<String>? collaborators;
  bool? all;

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{};
    if (all == null || all == false) map['collaborators'] = collaborators;
    if (all == true) map['all'] = all;
    return map;
  }
}
