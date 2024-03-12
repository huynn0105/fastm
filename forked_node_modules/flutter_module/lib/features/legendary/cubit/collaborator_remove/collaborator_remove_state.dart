part of 'collaborator_remove_cubit.dart';

class CollaboratorRemoveState extends Equatable {
  const CollaboratorRemoveState({
    this.statusCheckRemove = BlocStatus.initial,
    this.statusRemove = BlocStatus.initial,
    this.selectedUserId = const [],
    this.selectedAll = false,
    this.removeType,
    this.msgCheckRemove,
    this.msgRemove,
  });

  final BlocStatus statusCheckRemove;
  final BlocStatus statusRemove;
  final List<String> selectedUserId;
  final bool selectedAll;
  final String? removeType;
  final String? msgCheckRemove;
  final String? msgRemove;

  @override
  List<Object?> get props => [
        statusCheckRemove,
        statusRemove,
        selectedUserId,
        selectedAll,
        removeType,
        msgCheckRemove,
        msgRemove,
      ];

  CollaboratorRemoveState copyWith({
    BlocStatus? statusCheckRemove,
    BlocStatus? statusRemove,
    List<String>? selectedUserId,
    bool? selectedAll,
    String? removeType,
    String? msgCheckRemove,
    String? msgRemove,
  }) {
    return CollaboratorRemoveState(
      statusCheckRemove: statusCheckRemove ?? this.statusCheckRemove,
      statusRemove: statusRemove ?? BlocStatus.initial,
      selectedUserId: selectedUserId ?? this.selectedUserId,
      selectedAll: selectedAll ?? this.selectedAll,
      removeType: removeType,
      msgCheckRemove: msgCheckRemove,
      msgRemove: msgRemove,
    );
  }
}
