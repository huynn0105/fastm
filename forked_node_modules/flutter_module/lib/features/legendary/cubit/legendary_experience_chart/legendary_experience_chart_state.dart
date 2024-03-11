part of 'legendary_experience_chart_cubit.dart';

class LegendaryExperienceChartState extends Equatable {
  const LegendaryExperienceChartState({
    this.status = BlocStatus.initial,
    this.data,
    this.tabFilters = const [],
    this.selectedTabFilter,
  });

  final BlocStatus status;
  final LegendaryExperienceChartModel? data;
  final List<DataWrapper> tabFilters;
  final DataWrapper? selectedTabFilter;

  @override
  List<Object?> get props => [
        status,
        data,
        tabFilters,
        selectedTabFilter,
      ];

  LegendaryExperienceChartState copyWith({
    BlocStatus? status,
    LegendaryExperienceChartModel? data,
    List<DataWrapper>? tabFilters,
    DataWrapper? selectedTabFilter,
  }) {
    return LegendaryExperienceChartState(
      status: status ?? this.status,
      data: data ?? this.data,
      tabFilters: tabFilters ?? this.tabFilters,
      selectedTabFilter: selectedTabFilter ?? this.selectedTabFilter,
    );
  }
}
