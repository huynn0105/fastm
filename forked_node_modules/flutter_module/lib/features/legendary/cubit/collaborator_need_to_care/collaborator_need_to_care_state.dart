part of 'collaborator_need_to_care_cubit.dart';

class CollaboratorNeedToCareState extends Equatable {
  const CollaboratorNeedToCareState({
    this.statusWorking = BlocStatus.initial,
    this.statusFollow = BlocStatus.initial,
    this.statusCanLeave = BlocStatus.initial,
    this.statusCanRemove = BlocStatus.initial,
    this.statusDeparted = BlocStatus.initial,
    this.collaboratorFilter,
    this.selectedGrades = const [],
    this.selectedLevels = const [],
    this.selectedTab,
    this.totalUserWorking = 0,
    this.totalUserFollow = 0,
    this.totalUserCanLeave = 0,
    this.totalUserCanRemove = 0,
    this.totalUserDeparted = 0,
    this.dataUserWorking = const [],
    this.dataUserFollow = const [],
    this.dataUserCanLeave = const [],
    this.dataUserCanRemove = const [],
    this.dataUserDeparted = const [],
  });

  final BlocStatus statusWorking;
  final BlocStatus statusFollow;
  final BlocStatus statusCanLeave;
  final BlocStatus statusCanRemove;
  final BlocStatus statusDeparted;
  final CollaboratorCareFilterModel? collaboratorFilter;
  final List<GeneralObject> selectedGrades;
  final List<GeneralObject> selectedLevels;
  final GeneralObject? selectedTab;
  final int totalUserWorking;
  final int totalUserFollow;
  final int totalUserCanLeave;
  final int totalUserCanRemove;
  final int totalUserDeparted;
  final List<CollaboratorCareModel> dataUserWorking;
  final List<CollaboratorCareModel> dataUserFollow;
  final List<CollaboratorCareModel> dataUserCanLeave;
  final List<CollaboratorCareModel> dataUserCanRemove;
  final List<CollaboratorCareModel> dataUserDeparted;

  @override
  List<Object?> get props => [
        statusWorking,
        statusFollow,
        statusCanLeave,
        statusCanRemove,
        statusDeparted,
        collaboratorFilter,
        selectedGrades,
        selectedLevels,
        selectedTab,
        totalUserWorking,
        totalUserFollow,
        totalUserCanLeave,
        totalUserCanRemove,
        totalUserDeparted,
        dataUserWorking,
        dataUserFollow,
        dataUserCanLeave,
        dataUserCanRemove,
        dataUserDeparted,
      ];

  CollaboratorNeedToCareState copyWith({
    BlocStatus? statusWorking,
    BlocStatus? statusFollow,
    BlocStatus? statusCanLeave,
    BlocStatus? statusCanRemove,
    BlocStatus? statusDeparted,
    CollaboratorCareFilterModel? collaboratorFilter,
    List<GeneralObject>? selectedGrades,
    List<GeneralObject>? selectedLevels,
    GeneralObject? selectedTab,
    int? totalUserWorking,
    int? totalUserFollow,
    int? totalUserCanLeave,
    int? totalUserCanRemove,
    int? totalUserDeparted,
    List<CollaboratorCareModel>? dataUserWorking,
    List<CollaboratorCareModel>? dataUserFollow,
    List<CollaboratorCareModel>? dataUserCanLeave,
    List<CollaboratorCareModel>? dataUserCanRemove,
    List<CollaboratorCareModel>? dataUserDeparted,
  }) {
    return CollaboratorNeedToCareState(
      statusWorking: statusWorking ?? this.statusWorking,
      statusFollow: statusFollow ?? this.statusFollow,
      statusCanLeave: statusCanLeave ?? this.statusCanLeave,
      statusCanRemove: statusCanRemove ?? this.statusCanRemove,
      statusDeparted: statusDeparted ?? this.statusDeparted,
      collaboratorFilter: collaboratorFilter ?? this.collaboratorFilter,
      selectedGrades: selectedGrades ?? this.selectedGrades,
      selectedLevels: selectedLevels ?? this.selectedLevels,
      selectedTab: selectedTab ?? this.selectedTab,
      totalUserWorking: totalUserWorking ?? this.totalUserWorking,
      totalUserFollow: totalUserFollow ?? this.totalUserFollow,
      totalUserCanLeave: totalUserCanLeave ?? this.totalUserCanLeave,
      totalUserCanRemove: totalUserCanRemove ?? this.totalUserCanRemove,
      totalUserDeparted: totalUserDeparted ?? this.totalUserDeparted,
      dataUserWorking: dataUserWorking ?? this.dataUserWorking,
      dataUserFollow: dataUserFollow ?? this.dataUserFollow,
      dataUserCanLeave: dataUserCanLeave ?? this.dataUserCanLeave,
      dataUserCanRemove: dataUserCanRemove ?? this.dataUserCanRemove,
      dataUserDeparted: dataUserDeparted ?? this.dataUserDeparted,
    );
  }
}
