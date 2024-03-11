import 'package:dio/dio.dart';

class ConvertInterceptors extends Interceptor {
  ConvertInterceptors();

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    var data = response.data;
    if (data is List) {
      data = <String, dynamic>{
        'status': response.statusCode == 200,
        'data': data,
        'message': response.statusMessage,
      };
    }
    response.data = data;
    super.onResponse(response, handler);
  }
}
