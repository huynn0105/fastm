// ignore_for_file: public_member_api_docs, sort_constructors_first
part of 'legendary_change_supporter_cubit.dart';

class LegendaryChangeSupporterState extends Equatable {
  const LegendaryChangeSupporterState({
    this.checkStatus = BlocStatus.initial,
    this.checkData,
    this.leaveStatus = BlocStatus.initial,
    this.leaveMessage,
  });

  final BlocStatus checkStatus;
  final CheckChangeSupporterModel? checkData;
  final BlocStatus leaveStatus;
  final String? leaveMessage;

  @override
  List<Object?> get props => [
        checkStatus,
        checkData,
        leaveStatus,
        leaveMessage,
      ];

  LegendaryChangeSupporterState copyWith({
    BlocStatus? checkStatus,
    CheckChangeSupporterModel? checkData,
    BlocStatus? leaveStatus,
    String? leaveMessage,
  }) {
    return LegendaryChangeSupporterState(
      checkStatus: checkStatus ?? BlocStatus.initial,
      checkData: checkData ?? this.checkData,
      leaveStatus: leaveStatus ?? BlocStatus.initial,
      leaveMessage: leaveMessage ?? this.leaveMessage,
    );
  }
}
