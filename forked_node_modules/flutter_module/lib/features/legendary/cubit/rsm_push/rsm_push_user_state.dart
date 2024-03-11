part of 'rsm_push_user_cubit.dart';

class RSMPushUserState extends Equatable {
  const RSMPushUserState({
    this.status = BlocStatus.initial,
    this.searchStatus = BlocStatus.initial,
    this.sendPushStatus = BlocStatus.initial,
    this.listCollaboratorRSMLevel = const [],
    this.listCollaboratorRSMStatus = const [],
    this.listCollaboratorRSMTop = const [],
    this.selectedCollaboratorRSMLevel,
    this.selectedCollaboratorRSMStatus,
    this.selectedCollaboratorRSMTop,
    this.total = 0,
    this.users = const [],
    this.searchUsers = const [],
    this.addedUsers = const [],
    this.removedUsers = const [],
    this.errMsg,
  });

  final BlocStatus status;
  final BlocStatus searchStatus;
  final BlocStatus sendPushStatus;
  final List<CollaboratorRSMLevel> listCollaboratorRSMLevel;
  final List<CollaboratorRSMStatus> listCollaboratorRSMStatus;
  final List<CollaboratorRSMTop> listCollaboratorRSMTop;
  final CollaboratorRSMLevel? selectedCollaboratorRSMLevel;
  final CollaboratorRSMStatus? selectedCollaboratorRSMStatus;
  final CollaboratorRSMTop? selectedCollaboratorRSMTop;
  final int total;
  final List<CollaboratorRsmPushModel> users;
  final List<CollaboratorRsmPushModel> searchUsers;
  final List<CollaboratorRsmPushModel> addedUsers;
  final List<CollaboratorRsmPushModel> removedUsers;
  final String? errMsg;

  @override
  List<Object?> get props => [
        status,
        searchStatus,
        sendPushStatus,
        listCollaboratorRSMLevel,
        listCollaboratorRSMStatus,
        listCollaboratorRSMTop,
        selectedCollaboratorRSMLevel,
        selectedCollaboratorRSMStatus,
        selectedCollaboratorRSMTop,
        total,
        users,
        searchUsers,
        addedUsers,
        removedUsers,
        errMsg,
      ];

  RSMPushUserState copyWith({
    BlocStatus? status,
    BlocStatus? searchStatus,
    BlocStatus? sendPushStatus,
    List<CollaboratorRSMLevel>? listCollaboratorRSMLevel,
    List<CollaboratorRSMStatus>? listCollaboratorRSMStatus,
    List<CollaboratorRSMTop>? listCollaboratorRSMTop,
    CollaboratorRSMLevel? selectedCollaboratorRSMLevel,
    CollaboratorRSMStatus? selectedCollaboratorRSMStatus,
    CollaboratorRSMTop? selectedCollaboratorRSMTop,
    bool? clearTop,
    int? total,
    List<CollaboratorRsmPushModel>? users,
    List<CollaboratorRsmPushModel>? searchUsers,
    List<CollaboratorRsmPushModel>? addedUsers,
    List<CollaboratorRsmPushModel>? removedUsers,
    String? errMsg,
  }) {
    return RSMPushUserState(
      status: status ?? this.status,
      searchStatus: searchStatus ?? this.searchStatus,
      sendPushStatus: sendPushStatus ?? BlocStatus.initial,
      listCollaboratorRSMLevel: listCollaboratorRSMLevel ?? this.listCollaboratorRSMLevel,
      listCollaboratorRSMStatus: listCollaboratorRSMStatus ?? this.listCollaboratorRSMStatus,
      listCollaboratorRSMTop: listCollaboratorRSMTop ?? this.listCollaboratorRSMTop,
      selectedCollaboratorRSMLevel: selectedCollaboratorRSMLevel ?? this.selectedCollaboratorRSMLevel,
      selectedCollaboratorRSMStatus: selectedCollaboratorRSMStatus ?? this.selectedCollaboratorRSMStatus,
      selectedCollaboratorRSMTop:
          selectedCollaboratorRSMTop ?? (clearTop == true ? null : this.selectedCollaboratorRSMTop),
      total: total ?? this.total,
      users: users ?? this.users,
      searchUsers: searchUsers ?? this.searchUsers,
      addedUsers: addedUsers ?? this.addedUsers,
      removedUsers: removedUsers ?? this.removedUsers,
      errMsg: errMsg,
    );
  }
}
