// ignore_for_file: public_member_api_docs, sort_constructors_first
part of 'new_supporter_cubit.dart';

class NewSupporterState extends Equatable {
  const NewSupporterState({
    this.provinces = const [],
    this.districts = const [],
    this.province,
    this.district,
    this.group,
    this.text,
    this.supporterSelect,
    this.changeStatus = BlocStatus.initial,
    this.changeErrorMessage,
    this.supporterWaiting,
  });

  final List<DataWrapper> provinces;
  final List<DataWrapper> districts;
  final DataWrapper? province;
  final DataWrapper? district;
  final DataWrapper? group;
  final String? text;
  final LegendaryNewSupporterModel? supporterSelect;
  final BlocStatus changeStatus;
  final String? changeErrorMessage;
  final MySupporterWaitingModel? supporterWaiting;

  @override
  List<Object?> get props => [
        provinces,
        districts,
        province,
        district,
        group,
        text,
        supporterSelect,
        changeStatus,
        changeErrorMessage,
        supporterWaiting,
      ];

  NewSupporterState copyWith({
    List<DataWrapper>? provinces,
    List<DataWrapper>? districts,
    DataWrapper? province,
    DataWrapper? district,
    DataWrapper? group,
    String? text,
    LegendaryNewSupporterModel? supporterSelect,
    BlocStatus? changeStatus,
    String? changeErrorMessage,
    MySupporterWaitingModel? supporterWaiting,
  }) {
    return NewSupporterState(
      provinces: provinces ?? this.provinces,
      districts: districts ?? this.districts,
      province: province ?? this.province,
      district: district ?? this.district,
      group: group ?? this.group,
      text: text ?? this.text,
      supporterSelect: supporterSelect ?? this.supporterSelect,
      changeStatus: changeStatus ?? this.changeStatus,
      changeErrorMessage: changeErrorMessage ?? this.changeErrorMessage,
      supporterWaiting: supporterWaiting ?? this.supporterWaiting,
    );
  }
}
