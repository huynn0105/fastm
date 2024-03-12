part of 'legendary_income_chart_cubit.dart';

class LegendaryIncomeChartState extends Equatable {
  const LegendaryIncomeChartState({
    this.status = BlocStatus.initial,
    this.data,
    this.tabFilters = const [],
    this.selectedTabFilter,
  });

  final BlocStatus status;
  final LegendaryIncomeChartModel? data;
  final List<DataWrapper> tabFilters;
  final DataWrapper? selectedTabFilter;

  @override
  List<Object?> get props => [
        status,
        data,
        tabFilters,
        selectedTabFilter,
      ];

  LegendaryIncomeChartState copyWith({
    BlocStatus? status,
    LegendaryIncomeChartModel? data,
    List<DataWrapper>? tabFilters,
    DataWrapper? selectedTabFilter,
  }) {
    return LegendaryIncomeChartState(
      status: status ?? this.status,
      data: data ?? this.data,
      tabFilters: tabFilters ?? this.tabFilters,
      selectedTabFilter: selectedTabFilter ?? this.selectedTabFilter,
    );
  }
}
