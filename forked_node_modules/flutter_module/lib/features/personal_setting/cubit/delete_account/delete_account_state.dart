// ignore_for_file: public_member_api_docs, sort_constructors_first
part of 'delete_account_cubit.dart';

class DeleteAccountState extends Equatable {
  const DeleteAccountState({
    this.status = BlocStatus.initial,
    this.otpStatus = BlocStatus.initial,
    this.cancelStatus = BlocStatus.initial,
    this.isVerifyOTP = false,
    this.errorFields = const {},
    this.errorMessage = '',
  });
  final BlocStatus status;
  final BlocStatus otpStatus;
  final BlocStatus cancelStatus;
  final bool isVerifyOTP;
  final Map<String, String> errorFields;
  final String errorMessage;

  @override
  List<Object> get props => [
        status,
        otpStatus,
        cancelStatus,
        isVerifyOTP,
        errorFields,
        errorMessage,
      ];

  DeleteAccountState copyWith({
    BlocStatus? status,
    BlocStatus? otpStatus,
    BlocStatus? cancelStatus,
    bool? isVerifyOTP,
    Map<String, String>? errorFields,
    String? errorMessage,
  }) {
    return DeleteAccountState(
      status: status ?? this.status,
      otpStatus: otpStatus ?? this.otpStatus,
      cancelStatus: cancelStatus ?? this.cancelStatus,
      isVerifyOTP: isVerifyOTP ?? this.isVerifyOTP,
      errorFields: errorFields ?? this.errorFields,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
