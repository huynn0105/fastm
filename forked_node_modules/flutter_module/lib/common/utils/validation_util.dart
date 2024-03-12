import 'package:formz/formz.dart';

// Define input validation errors
enum InputError { empty, invalid }

class NameInput extends FormzInput<String, InputError> {
  const NameInput.pure() : super.pure('');

  const NameInput.dirty({String value = ''}) : super.dirty(value);

  @override
  InputError? validator(String value) {
    return value.isNotEmpty ? null : InputError.empty;
  }
}

class EmailInputValidation extends FormzInput<String, InputError> {
  final String pattern;

  const EmailInputValidation.pure({
    this.pattern =
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
  }) : super.pure('');

  const EmailInputValidation.dirty({
    String value = '',
    this.pattern =
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
  }) : super.dirty(value);

  @override
  InputError? validator(String value) {
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return InputError.empty;
    }

    if (!regExp.hasMatch(value)) {
      return InputError.invalid;
    }
    return null;
  }
}

class PhoneInputValidation extends FormzInput<String, InputError> {
  // final String viettel1 = r'^09[6-8]{1}[0-9]{7}$';
  // final String viettel2 = r'^086[0-9]{7}$';
  // final String viettel3 = r'^03[0-9]{8}$';
  // final String mobi1 = r'^09[03]{1}[0-9]{7}$';
  // final String mobi2 = r'^089[0-9]{7}$';
  // final String mobi3 = r'^07(0|[6-9]{1})[0-9]{7}$';
  // final String vina1 = r'^09[14]{1}[0-9]{7}$';
  // final String vina2 = r'^08[1-5]{1}[0-9]{7}$';
  // final String vina3 = r'^088[0-9]{7}$';
  // final String vietnammobi1 = r'^092[0-9]{7}$';
  // final String vietnammobi2 = r'^018[0-9]{7}$';
  // final String vietnammobi3 = r'^05[2368]{1}[0-9]{7}$';
  // final String gmobile1 = r'^099[0-9]{7}$';
  // final String gmobile2 = r'^059[0-9]{7}$';
  // final String itel = r'^087[0-9]{7}$';
  // final String reddi = r'^055[0-9]{7}$';
  final String phoneReg = r'^0[0-9]{9}$';

  const PhoneInputValidation.pure() : super.pure('');

  const PhoneInputValidation.dirty({
    String value = '',
  }) : super.dirty(value);

  @override
  InputError? validator(String value) {
    if (value.isEmpty) {
      return InputError.empty;
    }
    return _checkPhone(value);
  }

  InputError? _checkPhone(String value) {
    // List<String> regexList = [viettel1, viettel2, viettel3, mobi1, mobi2, mobi3, vina1, vina2,
    //   vina3, vietnammobi1, vietnammobi2, vietnammobi3, gmobile1, gmobile2, itel];
    List<String> regexList = [phoneReg];
    for (int i = 0; i < regexList.length; i++) {
      RegExp regExp = RegExp(regexList[i]);
      if (regExp.hasMatch(value)) {
        return null;
      }
    }
    return InputError.invalid;
  }
}

class CompanyPhoneInputValidation extends FormzInput<String, InputError> {
  final String pattern;

  const CompanyPhoneInputValidation.pure({

    this.pattern = r'^[0-9]{10,11}$',
  }) : super.pure('');

  const CompanyPhoneInputValidation.dirty({
    String value = '',
    this.pattern = r'^[0-9]{10,11}$',
  }) : super.dirty(value);

  @override
  InputError? validator(String value) {
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return InputError.empty;
    } else if (!regExp.hasMatch(value)) {
      return InputError.invalid;
    }
    return null;
  }
}

class CMNDInputValidation extends FormzInput<String, InputError> {
  final String pattern;

  const CMNDInputValidation.pure({

    this.pattern = r'^[0-9]{9}$',
  }) : super.pure('');

  const CMNDInputValidation.dirty({
    String value = '',
    this.pattern = r'^[0-9]{9}$',
  }) : super.dirty(value);

  @override
  InputError? validator(String value) {
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return InputError.empty;
    } else if (!regExp.hasMatch(value)) {
      return InputError.invalid;
    }
    return null;
  }
}

class NumberInputValidation extends FormzInput<String, InputError> {
  final String pattern;

  const NumberInputValidation.pure({
    this.pattern = r'^[0-9]*$',
  }) : super.pure('');

  const NumberInputValidation.dirty({
    String value = '',
    this.pattern = r'^[0-9]*$',
  }) : super.dirty(value);

  @override
  InputError? validator(String value) {
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return InputError.empty;
    } else if (!regExp.hasMatch(value)) {
      return InputError.invalid;
    }
    return null;
  }
}
