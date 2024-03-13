
class BaseModel<T> {
  bool status;
  String? errorTitle;
  String? errorMessage;
  String? errorCode;
  dynamic errorData;
  T? data;

  BaseModel({
    this.status = false,
    this.errorTitle,
    this.errorMessage,
    this.errorCode,
    this.data,
    this.errorData,
  });
}
