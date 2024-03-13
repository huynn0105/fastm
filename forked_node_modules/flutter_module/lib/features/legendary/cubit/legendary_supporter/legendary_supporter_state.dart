part of 'legendary_supporter_cubit.dart';

class LegendarySupporterState extends Equatable {
  const LegendarySupporterState({
    this.status = BlocStatus.initial,
    this.filters,
    this.mySupporterWaiting,
  });
  final BlocStatus status;
  final LegendaryReviewFilterResponseModel? filters;
  final MySupporterWaitingModel? mySupporterWaiting;

  @override
  List<Object?> get props => [
        status,
        filters,
        mySupporterWaiting,
      ];

  LegendarySupporterState copyWith({
    BlocStatus? status,
    LegendaryReviewFilterResponseModel? filters,
    MySupporterWaitingModel? mySupporterWaiting,
  }) {
    return LegendarySupporterState(
      status: status ?? this.status,
      filters: filters ?? this.filters,
      mySupporterWaiting: mySupporterWaiting ?? this.mySupporterWaiting,
    );
  }
}
