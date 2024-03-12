part of 'legendary_activity_chart_cubit.dart';

class LegendaryActivityChartState extends Equatable {
  const LegendaryActivityChartState({
    this.status = BlocStatus.initial,
    this.data,
    this.tabFilters = const [],
    this.selectedTabFilter,
  });

  final BlocStatus status;
  final LegendaryActivityChartModel? data;
  final List<DataWrapper> tabFilters;
  final DataWrapper? selectedTabFilter;

  @override
  List<Object?> get props => [
        status,
        data,
        tabFilters,
        selectedTabFilter,
      ];

  LegendaryActivityChartState copyWith({
    BlocStatus? status,
    LegendaryActivityChartModel? data,
    List<DataWrapper>? tabFilters,
    DataWrapper? selectedTabFilter,
  }) {
    return LegendaryActivityChartState(
      status: status ?? this.status,
      data: data ?? this.data,
      tabFilters: tabFilters ?? this.tabFilters,
      selectedTabFilter: selectedTabFilter ?? this.selectedTabFilter,
    );
  }
}
