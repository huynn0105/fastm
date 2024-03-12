part of 'legendary_collaborator_chart_cubit.dart';

class LegendaryCollaboratorChartState extends Equatable {
  const LegendaryCollaboratorChartState({
    this.status = BlocStatus.initial,
    this.data,
    this.tabFilters = const [],
    this.selectedTabFilter,
    this.levelFilters = const [],
    this.selectedLevelFilter,
    this.typeFilters = const [],
    this.selectedTypeFilter,
  });

  final BlocStatus status;
  final LegendaryCollaboratorChartModel? data;
  final List<DataWrapper> tabFilters;
  final DataWrapper? selectedTabFilter;
  final List<DataWrapper> levelFilters;
  final DataWrapper? selectedLevelFilter;
  final List<DataWrapper> typeFilters;
  final DataWrapper? selectedTypeFilter;

  @override
  List<Object?> get props => [
        status,
        data,
        tabFilters,
        selectedTabFilter,
        levelFilters,
        selectedLevelFilter,
        typeFilters,
        selectedTypeFilter,
      ];

  LegendaryCollaboratorChartState copyWith({
    BlocStatus? status,
    LegendaryCollaboratorChartModel? data,
    List<DataWrapper>? tabFilters,
    DataWrapper? selectedTabFilter,
    List<DataWrapper>? levelFilters,
    DataWrapper? selectedLevelFilter,
    List<DataWrapper>? typeFilters,
    DataWrapper? selectedTypeFilter,
  }) {
    return LegendaryCollaboratorChartState(
      status: status ?? this.status,
      data: data ?? this.data,
      tabFilters: tabFilters ?? this.tabFilters,
      selectedTabFilter: selectedTabFilter ?? this.selectedTabFilter,
      levelFilters: levelFilters ?? this.levelFilters,
      selectedLevelFilter: selectedLevelFilter ?? this.selectedLevelFilter,
      typeFilters: typeFilters ?? this.typeFilters,
      selectedTypeFilter: selectedTypeFilter ?? this.selectedTypeFilter,
    );
  }
}
