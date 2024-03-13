part of 'collaborator_pending_confirm_cubit.dart';

class CollaboratorPendingConfirmState extends Equatable {
  final BlocStatus status;
  final CollaboratorPendingDetailModel? collaborator;
  final BlocStatus confirmStatus;
  final CollaboratorPendingAction? action;
  final String? errorMessage;

  const CollaboratorPendingConfirmState({
    this.status = BlocStatus.initial,
    this.collaborator,
    this.confirmStatus = BlocStatus.initial,
    this.action,
    this.errorMessage,
  });

  @override
  List<Object?> get props => [status, collaborator, confirmStatus];

  CollaboratorPendingConfirmState copyWith({
    BlocStatus? status,
    CollaboratorPendingDetailModel? collaborator,
    BlocStatus? confirmStatus,
    CollaboratorPendingAction? action,
    String? errorMessage,
  }) {
    return CollaboratorPendingConfirmState(
      status: status ?? this.status,
      collaborator: collaborator ?? this.collaborator,
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
