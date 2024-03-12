part of 'legendary_collaborator_cubit.dart';

class LegendaryCollaboratorState extends Equatable {
  const LegendaryCollaboratorState({
    this.status = BlocStatus.initial,
    this.rank,
    this.collaboratorStatus,
    this.collaboratorFilter,
    this.selectedLevels = const [],
    this.selectedSort,
    this.selectedWork,
    this.selectedTab,
    this.data = const [],
    this.userPending,
  });

  final BlocStatus status;
  final String? rank;
  final CollaboratorStatusModel? collaboratorStatus;
  final CollaboratorFilterModel? collaboratorFilter;
  final List<GeneralObject> selectedLevels;
  final GeneralObject? selectedSort;
  final GeneralObject? selectedWork;
  final GeneralObject? selectedTab;
  final List<CollaboratorModel> data;
  final int? userPending;

  @override
  List<Object?> get props => [
        status,
        rank,
        collaboratorStatus,
        collaboratorFilter,
        selectedLevels,
        selectedSort,
        selectedWork,
        selectedTab,
        data,
        userPending,
      ];

  LegendaryCollaboratorState copyWith({
    BlocStatus? status,
    String? rank,
    CollaboratorStatusModel? collaboratorStatus,
    CollaboratorFilterModel? collaboratorFilter,
    List<GeneralObject>? selectedLevels,
    GeneralObject? selectedSort,
    GeneralObject? selectedWork,
    GeneralObject? selectedTab,
    List<CollaboratorModel>? data,
    int? userPending,
  }) {
    return LegendaryCollaboratorState(
      status: status ?? this.status,
      rank: rank ?? this.rank,
      collaboratorStatus: collaboratorStatus ?? this.collaboratorStatus,
      collaboratorFilter: collaboratorFilter ?? this.collaboratorFilter,
      selectedLevels: selectedLevels ?? this.selectedLevels,
      selectedSort: selectedSort ?? this.selectedSort,
      selectedWork: selectedWork ?? this.selectedWork,
      selectedTab: selectedTab ?? this.selectedTab,
      data: data ?? this.data,
      userPending: userPending ?? this.userPending,
    );
  }
}
