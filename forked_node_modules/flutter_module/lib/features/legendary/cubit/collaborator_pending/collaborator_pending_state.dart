part of 'collaborator_pending_cubit.dart';

class CollaboratorPendingState extends Equatable {
  final BlocStatus status;
  final List<CollaboratorPendingModel> data;
  final int userPending;
  final BlocStatus confirmStatus;
  final CollaboratorPendingAction? action;
  final String? errorMessage;

  const CollaboratorPendingState({
    this.status = BlocStatus.initial,
    this.data = const [],
    this.userPending = 0,
    this.confirmStatus = BlocStatus.initial,
    this.action,
    this.errorMessage,
  });

  @override
  List<Object?> get props => [status, data, userPending, confirmStatus];

  CollaboratorPendingState copyWith({
    BlocStatus? status,
    List<CollaboratorPendingModel>? data,
    int? userPending,
    BlocStatus? confirmStatus,
    CollaboratorPendingAction? action,
    String? errorMessage,
  }) {
    return CollaboratorPendingState(
      status: status ?? this.status,
      data: data ?? this.data,
      userPending: userPending ?? this.userPending,
      confirmStatus: confirmStatus ?? BlocStatus.initial,
      action: action,
      errorMessage: errorMessage,
    );
  }
}

enum CollaboratorPendingAction {
  reject,
  confirm,
}
