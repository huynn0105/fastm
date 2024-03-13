part of 'rsm_push_history_cubit.dart';

class RSMPushHistoryState extends Equatable {
  const RSMPushHistoryState({
    this.status = BlocStatus.initial,
    this.currentMonth = 0,
    this.selectedMonth = 0,
    this.data = const [],
    this.filterData = const [],
  });

  final BlocStatus status;
  final int currentMonth;
  final int selectedMonth;
  final List<CollaboratorRsmPushLogModel> data;
  final List<CollaboratorRsmPushLogModel> filterData;

  @override
  List<Object?> get props => [
        status,
        currentMonth,
        selectedMonth,
        data,
        filterData,
      ];

  RSMPushHistoryState copyWith({
    BlocStatus? status,
    int? currentMonth,
    int? selectedMonth,
    List<CollaboratorRsmPushLogModel>? data,
    List<CollaboratorRsmPushLogModel>? filterData,
  }) {
    return RSMPushHistoryState(
      status: status ?? this.status,
      currentMonth: currentMonth ?? this.currentMonth,
      selectedMonth: selectedMonth ?? this.selectedMonth,
      data: data ?? this.data,
      filterData: filterData ?? this.filterData,
    );
  }
}
