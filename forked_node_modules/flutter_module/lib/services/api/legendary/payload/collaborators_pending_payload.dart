class CollaboratorsPendingPayload {
  CollaboratorsPendingPayload({
    required this.userID,
    required this.page,
  });

  final String userID;
  final int page;

  Map<String, dynamic> toJson() {
    return {
      'userID': userID,
      'page': page,
    };
  }

  factory CollaboratorsPendingPayload.fromJson(Map<String, dynamic> map) {
    return CollaboratorsPendingPayload(
      userID: map['userID'] ?? '',
      page: map['page']?.toInt() ?? 0,
    );
  }
}
