class CollaboratorsPendingActionPayload {
  CollaboratorsPendingActionPayload({
    required this.id,
    required this.action,
  });

  final String id;
  final String action;


  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'action': action,
    };
  }

  factory CollaboratorsPendingActionPayload.fromJson(Map<String, dynamic> map) {
    return CollaboratorsPendingActionPayload(
      id: map['id'] ?? '',
      action: map['action'] ?? '',
    );
  }
}
