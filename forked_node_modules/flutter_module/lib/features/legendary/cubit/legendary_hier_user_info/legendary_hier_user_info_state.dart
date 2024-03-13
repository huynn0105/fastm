part of 'legendary_hier_user_info_cubit.dart';

class LegendaryHierUserInfoState extends Equatable {
  const LegendaryHierUserInfoState({
    this.status = BlocStatus.initial,
    this.data,
  });

  final BlocStatus status;
  final LegendaryHierUserInfoModel? data;

  @override
  List<Object?> get props => [
        status,
        data,
      ];

  LegendaryHierUserInfoState copyWith({
    BlocStatus? status,
    LegendaryHierUserInfoModel? data,
  }) {
    return LegendaryHierUserInfoState(
      status: status ?? this.status,
      data: data ?? this.data,
    );
  }
}
