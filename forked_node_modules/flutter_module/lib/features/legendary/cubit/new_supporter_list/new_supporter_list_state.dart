part of 'new_supporter_list_cubit.dart';

class NewSupporterListState extends Equatable {
  const NewSupporterListState({
    this.status = BlocStatus.initial,
    this.supporters = const [],
  });

  final BlocStatus status;
  final List<LegendaryNewSupporterModel> supporters;

  @override
  List<Object> get props => [
        status,
        supporters,
      ];

  NewSupporterListState copyWith({
    BlocStatus? status,
    List<LegendaryNewSupporterModel>? supporters,
  }) {
    return NewSupporterListState(
      status: status ?? this.status,
      supporters: supporters ?? this.supporters,
    );
  }
}
