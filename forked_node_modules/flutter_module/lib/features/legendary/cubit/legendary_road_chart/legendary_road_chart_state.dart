part of 'legendary_road_chart_cubit.dart';

class LegendaryRoadChartState extends Equatable {
  const LegendaryRoadChartState({
    this.status = BlocStatus.initial,
    this.data,
  });

  final BlocStatus status;
  final LegendaryRoadChartModel? data;

  @override
  List<Object?> get props => [
        status,
        data,
      ];

  LegendaryRoadChartState copyWith({
    BlocStatus? status,
    LegendaryRoadChartModel? data,
  }) {
    return LegendaryRoadChartState(
      status: status ?? this.status,
      data: data ?? this.data,
    );
  }
}
